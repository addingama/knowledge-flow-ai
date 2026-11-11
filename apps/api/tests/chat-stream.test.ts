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

import { chatStreamRoutes } from "../src/routes/chat-stream.js";
import type { LlmProvider } from "../src/providers/openai.provider.js";

describe("POST /api/chat/stream", () => {
  let app: FastifyInstance;

  const mockProvider: LlmProvider = {
    async generate() {
      return "Hello World";
    },

    async *stream() {
      yield "Hello";
      yield " ";
      yield "World";
    },
  };

  beforeEach(async () => {
    app = Fastify();

    await app.register(chatStreamRoutes, {
      prefix: "/api",
      llm: mockProvider,
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it("streams generated text", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/chat/stream",
      payload: {
        message: "Say hello",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("Hello World");
    expect(response.headers["content-type"]).toContain(
      "text/plain",
    );
  });

  it("rejects empty messages", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/chat/stream",
      payload: {
        message: "",
      },
    });

    expect(response.statusCode).toBe(400);
  });
});