import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import { env } from "./config/env.js";
import { healthRoutes } from "./routes/health.js";
import { chatRoutes } from "./routes/chat.js";
import { chatStreamRoutes } from "./routes/chat-stream.js";
import { learningNoteRoutes } from "./routes/learning-notes.js";

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
  app.register(chatStreamRoutes, {prefix: "/api"});
  app.register(learningNoteRoutes, {prefix: "/api"});

  return app;
}