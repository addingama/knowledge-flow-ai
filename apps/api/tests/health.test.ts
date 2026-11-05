import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../src/app.js";

describe("Health API", () => {
  let app: FastifyInstance;

  beforeEach(() => {
    app = buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("GET /health returns 200", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
  });

  it("returns the expected health contract", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    const body = response.json();

    expect(body.status).toBe("ok");
    expect(body.service).toBe("api");
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });

  it("returns JSON content type", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.headers["content-type"]).toContain(
      "application/json",
    );
  });
});