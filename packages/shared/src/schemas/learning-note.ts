import z from "zod";

export const LearningNoteRequestSchema = z.object({
  topic: z.string().trim().min(3).max(200),
});

export const LearningNoteSchema = z.object({
  title: z.string(),
  summary: z.string(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  keyConcepts: z.array(z.string()),
  codeExample: z.string(),
  takeaways: z.array(z.string()),
  nextActions: z.array(z.string()),
});

export type LearningNoteRequest = z.infer<typeof LearningNoteRequestSchema>;

export type LearningNote = z.infer<typeof LearningNoteSchema>;