import "server-only";

import type { ChatRequest } from "@repo/shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return Response.json({
      error: "API_URL is not configured"
    }, { status: 503 });
  }

  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return Response.json({
      error: "Invalid request body"
    }, { status: 400 });
  }

  const response = await fetch(`${apiUrl}/api/chat/stream`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (
    typeof body?.message !== "string" ||
    !body.message.trim() ||
    body.message.length > 4000
  ) {
    return Response.json(
      { error: "Invalid message" },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(
      new URL("/api/chat/stream", apiUrl),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: request.signal,
      },
    );

    if (!upstream.ok) {
      return Response.json(
        { error: "Chat service unavailable" },
        { status: upstream.status },
      );
    }

    if (!upstream.body) {
      return Response.json(
        { error: "Empty stream response" },
        { status: 502 },
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (request.signal.aborted) {
      return new Response(null, { status: 499 });
    }

    console.error("Chat proxy error:", error);

    return Response.json(
      { error: "Unable to connect to chat service" },
      { status: 502 },
    );
  }
}