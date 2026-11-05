import type { FastifyPluginAsync } from "fastify";
import type { HealthResponse } from "@repo/shared";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Reply: HealthResponse }>("/health", async () => {
    return {
      status: "ok",
      service: "api",
      timestamp: new Date().toISOString(),
    };
  });
};