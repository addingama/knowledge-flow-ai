import { BackendStatus } from "@/components/backend-status";
import { getHealth } from "@/lib/api/health";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const health = await getHealth().catch((error: unknown) => {
    console.error("Failed to connect to Fastify API:", error);
    return null;
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-xl space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold">
            Knowledge Flow AI
          </h1>

          <p className="text-slate-400">
            Next.js + Fastify + TypeScript + pnpm
          </p>
        </div>

        <BackendStatus health={health} />
      </div>
    </main>
  );
}