export async function POST(request: Request) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return Response.json(
      { error: "Backend URL is not configured" },
      { status: 503 },
    );
  }

  try {
    const upstream = await fetch(new URL("/api/learning-notes/generate", apiUrl),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: await request.text(),
        cache: "no-store",
        signal: request.signal,
      });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return Response.json(
      {
        error: "Unable to reach backend",
      },
      {
        status: 502,
      }
    );
  }
}