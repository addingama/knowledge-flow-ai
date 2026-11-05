import type { HealthResponse } from "@repo/shared";

import { apiFetch } from "./client";

export async function getHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/health");
}