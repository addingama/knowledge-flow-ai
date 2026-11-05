# Knowledge Flow AI

Full-stack TypeScript monorepo built with pnpm, Next.js, and Fastify.

## Tech Stack

- pnpm workspaces
- Next.js (App Router)
- Fastify
- TypeScript
- Tailwind CSS
- Vitest

## Project Structure

```text
apps/
  web/       Next.js frontend
  api/       Fastify backend

packages/
  shared/    Shared TypeScript types
```

## Requirements

- Node.js 24+
- pnpm (version specified in package.json)

## Getting Started

```bash
pnpm install
pnpm dev
```

## Applications

- Frontend: http://localhost:3000
- API: http://127.0.0.1:3001
- Health check: http://127.0.0.1:3001/health

## Environment Variables

Copy the example files:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Run frontend and backend |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run automated tests |
| `pnpm check` | Run all validations |

## Production

Build:

```bash
pnpm build
```

Start API:

```bash
NODE_ENV=production pnpm --filter @repo/api start
```

Start frontend:

```bash
pnpm --filter @repo/web start
```