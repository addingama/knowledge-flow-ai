"use client";

import { useState } from "react";

import {
  LearningNoteRequestSchema,
  LearningNoteSchema,
  type LearningNote,
} from "@repo/shared";

import { LearningNoteResult } from "./learning-note-result";

type GenerateResponse = {
  success: true;
  data: LearningNote;
};

export function LearningNoteGenerator() {
  const [topic, setTopic] = useState("");
  const [note, setNote] = useState<LearningNote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isLoading) return;

    setError(null);

    const parsed = LearningNoteRequestSchema.safeParse({
      topic,
    });

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ??
          "Please enter a valid topic.",
      );
      return;
    }

    setIsLoading(true);
    setNote(null);

    try {
      const response = await fetch(
        "/api/learning-notes/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed.data),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to generate learning note (${response.status})`,
        );
      }

      const json: unknown = await response.json();

      // Validate the complete API response.
      const resultSchema = LearningNoteSchema;

      if (
        typeof json !== "object" ||
        json === null ||
        !("data" in json)
      ) {
        throw new Error("Invalid API response");
      }

      const validated = resultSchema.safeParse(json.data);

      if (!validated.success) {
        throw new Error(
          "Generated note does not match the expected schema",
        );
      }

      const result: GenerateResponse = {
        success: true,
        data: validated.data,
      };

      setNote(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleGenerate}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="space-y-2">
          <label
            htmlFor="learning-topic"
            className="block text-sm font-medium"
          >
            What would you like to learn?
          </label>

          <textarea
            id="learning-topic"
            value={topic}
            onChange={(event) =>
              setTopic(event.target.value)
            }
            placeholder="e.g. Dependency Injection in TypeScript"
            rows={3}
            maxLength={200}
            disabled={isLoading}
            className="w-full resize-none rounded-lg border border-slate-300 bg-transparent px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-700"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || topic.trim().length < 3}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Generating..."
              : "Generate Learning Note"}
          </button>
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {isLoading && (
        <div
          role="status"
          className="rounded-xl border border-slate-200 p-6 text-slate-500 dark:border-slate-800"
        >
          Generating your learning note...
        </div>
      )}

      {note && <LearningNoteResult note={note} />}
    </div>
  );
}