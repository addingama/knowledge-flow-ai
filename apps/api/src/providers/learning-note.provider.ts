import { type LearningNote, LearningNoteSchema } from "@repo/shared";
import OpenAI from "openai";
import { env } from "../config/env.js";
import { zodTextFormat } from "openai/helpers/zod.js";

export interface LearningNoteProvider {
  generate(topic: string): Promise<LearningNote>;
}

export class OpenAILearningNoteProvider implements LearningNoteProvider {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
    });
  }

  async generate(topic: string): Promise<LearningNote> {
    const response = await this.client.responses.parse({
      model: env.OPENAI_MODEL,
      instructions: [
        "You are a sofware engineering tutor.",
        "Create accurate, practical learning notes.",
        "Include a useful TypeScript code example.",
        "Keep explanations concise.",
      ].join(" "),
      input: `Create a learning note about: ${topic}`,
      text: {
        format: zodTextFormat(LearningNoteSchema, "learning_note"),
      },
      store: false,
    });

    if(!response.output_parsed) {
      throw new Error("OpenAI did not return a structured learning note");
    }

    return response.output_parsed;
  }
}