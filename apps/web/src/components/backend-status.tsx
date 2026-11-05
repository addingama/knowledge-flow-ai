import type { HealthResponse } from "@repo/shared";

type BackendStatusProps = {
  health: HealthResponse | null;
};

export function BackendStatus({ health }: BackendStatusProps) {
  const isOnline = health?.status === "ok";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-3">
        <span
          className={`h-3 w-3 rounded-full ${
            isOnline ? "bg-emerald-500" : "bg-red-500"
          }`}
        />

        <h2 className="text-lg font-semibold">
          Backend API
        </h2>
      </div>

      <p className="mt-3 text-sm text-slate-400">
        Status: {isOnline ? "Connected" : "Disconnected"}
      </p>

      {health && (
        <div className="mt-4 space-y-2 text-sm text-slate-300">
          <p>Service: {health.service}</p>
          <p>
            Last checked:{" "}
            {new Date(health.timestamp).toISOString()}
          </p>
        </div>
      )}
    </div>
  );
}