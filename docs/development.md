# Development

## Prerequisites

- Node.js 24.x (the repository engine contract)
- npm
- PostgreSQL credentials for server-backed features
- Optional provider sandbox/SMTP/R2 credentials for integration work

Run commands from the repository root.

## Setup

```powershell
npm install
New-Item -ItemType File .env
npm run prisma:generate
npm run dev
```

Populate only the local values you need, using [the environment-variable reference](environment-variables.md). The repository intentionally does not keep a copyable environment template so placeholder files cannot be mistaken for populated configuration.

`npm run dev` starts Vite on 5173 and the local Vercel-handler adapter on `PPGC_API_PORT` or 3000. Vite proxies `/api` to that adapter.

Local checklist features do not require a database. Server-backed routes will fail until database/auth variables are configured.

## Quality gates

```powershell
npm run format:check
npm run lint
npm test
npx prisma validate --schema prisma/schema.prisma
npm run build
```

`npm run check` combines formatter, lint, tests, and build. The build also enforces homepage budgets. The remaining lint warnings are known React-hook dependency warnings; do not add new warnings without documenting why.

On restricted Windows runners, `node --test` or Vite may fail before assertions with `spawn EPERM`. Rerun the same command with permission to spawn subprocesses before diagnosing a product regression.

## Adding game content

Use existing helpers and neighboring game files. Keep stable IDs, register the file in the correct generation bootstrap, and validate task/Dex sync references. See `data-authoring.md`.

## UI changes

- Preserve hybrid ownership boundaries; do not have React and imperative modules mutate the same subtree.
- Keep desktop and the 320/360/390/430/600/768/900 responsive matrix in scope.
- Use the shared control/focus tokens and `docs/mobile-responsive-standards.md`.
- Do not use Playwright unless explicitly authorized.

## Database changes

Do not edit already-applied migrations, reset production, or use `db push` as a production deployment path. Follow [deployment](deployment.md) and the [database proposal](database/proposal.md).

## Generated files

Do not hand-edit `dist/`, `node_modules/`, Prisma Client output, or lock-file internals. Update source/config and regenerate them with the owning tool.
