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

import { chatRoutes } from "../src/routes/chat.js";
import type { LlmProvider } from "../src/providers/openai.provider.js";

describe("POST /api/chat", () => {
  let app: FastifyInstance;

  const mockProvider: LlmProvider = {
    async generate() {
      return "A monorepo contains multiple projects.";
    },
    async *stream() {
      yield "A monorepo contains multiple projects.";
    },
  };

  beforeEach(async () => {
    app = Fastify();

    await app.register(chatRoutes, {
      prefix: "/api",
      llm: mockProvider,
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it("returns an LLM response", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/chat",
      payload: {
        message: "What is a monorepo?",
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      success: true,
      data: {
        message: "A monorepo contains multiple projects.",
      },
    });
  });

  it("rejects empty messages", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/chat",
      payload: {
        message: "",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("rejects missing messages", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/chat",
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it("handles provider errors", async () => {
    await app.close();

    app = Fastify();

    await app.register(chatRoutes, {
      prefix: "/api",
      llm: {
        async generate() {
          throw new Error("Provider unavailable");
        },
        async *stream() {
          throw new Error("Provider unavailable");
        },
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/chat",
      payload: {
        message: "Hello",
      },
    });

    expect(response.statusCode).toBe(502);

    expect(response.json()).toMatchObject({
      success: false,
      error: {
        code: "LLM_PROVIDER_ERROR",
      },
    });
  });
});