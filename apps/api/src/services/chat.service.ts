import { ChatResponse } from "@repo/shared";
import type { LlmProvider } from "../providers/openai.provider.js";

export class ChatService {
  constructor(private readonly llmProvider: LlmProvider) {}

  async chat(message: string, model: string): Promise<ChatResponse> {
    const answer = await this.llmProvider.generate(message);

    return {
      success: true,
      data: {
        message: answer,
        model,
      }
    }
  }
}