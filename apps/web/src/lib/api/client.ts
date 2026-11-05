import "server-only";

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error("API_URL environment variable is required");
}

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = new URL(endpoint, API_URL);

  const response = await fetch(url, {
    ...options,
    cache: options.cache ?? "no-store",
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}