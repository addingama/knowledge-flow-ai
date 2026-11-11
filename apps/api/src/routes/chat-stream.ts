import { FastifyPluginAsync } from "fastify";
import { LlmProvider, OpenAIProvider } from "../providers/openai.provider.js"
import { ChatRequest } from "@repo/shared";
import { env } from "../config/env.js";
import { ChatService } from "../services/chat.service.js";


const chatBodySchema = {
  type: "object",
  required: ["message"],
  additionalProperties: false,
  properties: {
    message: {
      type: "string",
      minLength: 1,
      maxLength: 4000,
      pattern: "\\S",
    },
  }
} as const;

export interface ChatStreamRouteOptions {
  llm?: LlmProvider;
};

export const chatStreamRoutes: FastifyPluginAsync<ChatStreamRouteOptions> = async (app, options) => {
  app.post<{ Body: ChatRequest }>(
    "/chat/stream",
    {
      schema: {
        body: chatBodySchema,
      }
    },
    async (request, reply) => {
      if (!options.llm && !env.OPENAI_API_KEY) {
        return reply.code(503).send({
          success: false,
          error: {
            code: "LLM_NOT_CONFIGURED",
            message: "LLM provider is not configured",
          },
        });
      }

      const provider =
        options.llm ??
        new OpenAIProvider(env.OPENAI_API_KEY!);

      const service = new ChatService(provider);
      const controller = new AbortController();

      const onClose = () => {
        if (!reply.raw.writableFinished) {
          controller.abort();
        }
      };

      reply.raw.on("close", onClose);

      // Obtain the first chunk before sending response headers.
      // This lets provider startup failures return HTTP 502.
      let iterator: AsyncIterator<string> | undefined;

      try {
        iterator = service.stream(request.body.message.trim(), controller.signal)[Symbol.asyncIterator]();

        const first = await iterator.next();

        reply.hijack();

        reply.raw.writeHead(200, {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Content-Type-Options": "nosniff",
        });

        // Setelah response headers dikirim:
        if (!first.done) {
          reply.raw.write(first.value);

          while (!controller.signal.aborted) {
            const next = await iterator.next();

            if (next.done) break;

            reply.raw.write(next.value);
          }
        }

        if (!controller.signal.aborted) {
          reply.raw.end();
        }
      } catch (error) {
        request.log.error(
          { err: error },
          "LLM streaming failed",
        );

        if (!reply.sent) {
          return reply.code(502).send({
            success: false,
            error: {
              code: "LLM_STREAM_ERROR",
              message: "Unable to start LLM stream",
            },
          });
        }

        // Once streaming starts, HTTP status cannot be changed.
        reply.raw.destroy();
      } finally {
        reply.raw.off("close", onClose);
        await iterator?.return?.();
      }
    }
  )
}