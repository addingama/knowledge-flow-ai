import { FastifyPluginAsync } from "fastify";
import { LearningNoteProvider, OpenAILearningNoteProvider } from "../providers/learning-note.provider.js";
import { LearningNote, LearningNoteRequestSchema } from "@repo/shared";
import { env } from "../config/env.js";
import { LearningNoteService } from "../services/learning-note.service.js";

export interface LearningNoteRouteOptions {
  provider?: LearningNoteProvider;
}

export const learningNoteRoutes: FastifyPluginAsync<LearningNoteRouteOptions> = async (app, options) => {
  app.post("/learning-notes/generate", async (request, reply) => {
    const parsed = LearningNoteRequestSchema.safeParse(request.body);

    if(!parsed.success) {
      return reply.code(400).send({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid learning topic",
        issue: parsed.error.issues,
      });
    }

    const provider = options.provider ?? new OpenAILearningNoteProvider(env.OPENAI_API_KEY!);
    
    const service = new LearningNoteService(provider);

    try {
      const note: LearningNote = await service.generate(parsed.data.topic);

      return {
        success: true,
        data: note,
      }
    } catch (error) {
      request.log.error({err: error}, "Learning note generation failed");

      return reply.code(502).send({
        success: false,
        error: {
          code: "LLM_GENERATION_ERROR",
          message: "Unable to generate learning note",
        }
      });
    }
  })
}