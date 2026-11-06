import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import { env } from "./config/env.js";
import { healthRoutes } from "./routes/health.js";
import { chatRoutes } from "./routes/chat.js";

export function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "development" ? "debug" : "info",
    },
  });

  app.register(helmet);

  app.register(cors, {
    origin: env.CORS_ORIGIN,
  });

  app.register(healthRoutes);

  app.register(chatRoutes, {prefix: "/api"});

  return app;
}