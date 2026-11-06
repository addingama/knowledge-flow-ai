import OpenAI from "openai";

import { env } from "../config/env.js";

export interface LlmProvider {
  generate(message: string): Promise<string>;
}

export class OpenAIProvider implements LlmProvider {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      timeout: 30_000,
      maxRetries: 1
    });
  }

  async generate(message: string): Promise<string> {
    const response = await this.client.responses.create({
      model: env.OPENAI_MODEL,
      instructions: "You are a helpful assistant. " + "Provide clear, accurate, and concise answers.",
      input: message,
      max_output_tokens: 500,
      store: false,
    });

    const text = response.output_text?.trim();

    if (!text) {
      throw new Error("LLM returned an empty response");
    }
    return text;
  }
}