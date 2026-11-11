import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import Fastify, {
  type FastifyInstance,
} from "fastify";

import { learningNoteRoutes } from "../src/routes/learning-notes.js";
import type { LearningNoteProvider } from "../src/providers/learning-note.provider.js";

describe("POST /api/learning-notes/generate", () => {
  let app: FastifyInstance;

  const mockProvider: LearningNoteProvider = {
    async generate(topic: string) {
      return {
        title: topic,
        summary: "A programming concept.",
        difficulty: "beginner",
        keyConcepts: ["TypeScript"],
        codeExample: "const x = 1;",
        takeaways: ["Learn the fundamentals"],
        nextActions: ["Practice coding"],
      };
    },
  };

  beforeEach(async () => {
    app = Fastify();

    await app.register(learningNoteRoutes, {
      prefix: "/api",
      provider: mockProvider,
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it("returns a structured learning note", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/learning-notes/generate",
      payload: {
        topic: "TypeScript Basics",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      success: true,
      data: {
        title: "TypeScript Basics",
        difficulty: "beginner",
        summary: "A programming concept.",
        keyConcepts: ["TypeScript"],
        codeExample: "const x = 1;",
        takeaways: ["Learn the fundamentals"],
        nextActions: ["Practice coding"],
      },
    });
  });

  it("rejects missing topic", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/learning-notes/generate",
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Invalid learning topic",
    });
  });

  it("rejects empty topic", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/learning-notes/generate",
      payload: {
        topic: "",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
    });
  });

  it("rejects topic shorter than 3 characters", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/learning-notes/generate",
      payload: {
        topic: "ab",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
    });
  });

  it("rejects whitespace-only topic", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/learning-notes/generate",
      payload: {
        topic: "   ",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
    });
  });

  it("rejects topic longer than 200 characters", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/learning-notes/generate",
      payload: {
        topic: "a".repeat(201),
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
    });
  });

  it("accepts topic at minimum length after trim", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/learning-notes/generate",
      payload: {
        topic: "  abc  ",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      success: true,
      data: {
        title: "abc",
      },
    });
  });

  it("handles provider errors", async () => {
    await app.close();

    app = Fastify();

    await app.register(learningNoteRoutes, {
      prefix: "/api",
      provider: {
        async generate() {
          throw new Error("Provider unavailable");
        },
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/learning-notes/generate",
      payload: {
        topic: "TypeScript Basics",
      },
    });

    expect(response.statusCode).toBe(502);
    expect(response.json()).toMatchObject({
      success: false,
      error: {
        code: "LLM_GENERATION_ERROR",
        message: "Unable to generate learning note",
      },
    });
  });
});
