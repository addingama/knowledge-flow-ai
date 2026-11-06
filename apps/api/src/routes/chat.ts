import type { FastifyPluginAsync } from "fastify";
import type {
  ApiError,
  ChatRequest,
  ChatResponse,
} from "@repo/shared";
import { env } from "../config/env.js";

import {LlmProvider, OpenAIProvider} from "../providers/openai.provider.js"
import {ChatService} from "../services/chat.service.js"

const chatBodySchema = {
  type: "object",
  required: ["message"],
  properties: {
    message: {
      type: "string",
      minLength: 1,
      maxLength: 4000,
      pattern: "\\S",
    },
  },
} as const;

export interface ChatRouteOptions {
  llm?: LlmProvider;
}

export const chatRoutes: FastifyPluginAsync<ChatRouteOptions> = async (app, options) => {
  app.post<{Body: ChatRequest; Reply: ChatResponse | ApiError}>(
    "/chat",
    {
      schema: {
        body: chatBodySchema,
      },
    },
    async (request, reply) => {
      if (!options.llm && !env.OPENAI_API_KEY) {
        return reply.code(503).send({
          success: false,
          error: {
            code: "LLM_NOT_CONFIGURED",
            message: "LLM provideris not configured",
          },
        })
      }

      const provider = options.llm ?? new OpenAIProvider(env.OPENAI_API_KEY!);

      const service = new ChatService(provider);

      try {
        return await service.chat(request.body.message.trim(), env.OPENAI_MODEL)
      } catch (error) {
        request.log.error({err: error}, "LLM generation failed");

        return reply.code(502).send({
          success: false,
          error: {
            code: "LLM_PROVIDER_ERROR",
            message: "Unable to generate a response",
          },
        })
      }
    }
  )
}