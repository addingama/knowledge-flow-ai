export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-white">
      <h1 className="text-4xl font-bold">
        Fullstack Starter
      </h1>

      <p className="text-center text-slate-400">
        Next.js + Fastify + TypeScript + pnpm
      </p>

      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
        Frontend is running
      </span>
    </main>
  );
}