import { LearningNote } from "@repo/shared";
import { LearningNoteProvider } from "../providers/learning-note.provider.js";

export class LearningNoteService {
  constructor(private readonly provider: LearningNoteProvider) {}

  generate(topic: string): Promise<LearningNote> {
    return this.provider.generate(topic);
  }
}