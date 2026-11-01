# Project Structure

## Root

- `index.html`, `vite.config.js`: Vite entry, proxy, runtime URL injection, and production manifest.
- `api.js`: browser HTTP client. It keeps cookies same-origin and rejects a cross-origin API base outside local development.
- `package.json`: root-only scripts; this is not a workspace/monorepo.
- `vercel.json`: SPA rewrite and the intentional `[deploy]` commit-message build gate.
- `docs/environment-variables.md`: canonical secrets-free environment contract; populated `.env*` files remain local-only.

## `src/`

- `main.jsx` and `App.jsx`: React mount and URL routing.
- `pages/`: route-level pages; route-only CSS should load with its route.
- `components/`: React shells, content views, task UI, navigation, and modal hosts.
- `hooks/`: React lifecycle adapters such as subscription and legacy bootstrap.
- `react-bridge/`: stable adapters between React and mutable/imperative runtime state; business content does not belong here.
- `modals/`: imperative Dex, collection, research, and model-viewer behavior. Suffixes such as `-core`, `-sync`, `-render`, and `-assets` indicate ownership.
- `runtime/`: installation of legacy browser globals.
- `services/`: client-facing external services such as PokeAPI.
- `ui/`: imperative DOM/navigation helpers retained during migration.
- `store.js`, `persistence.js`, `registry.js`, `tasks*.js`, `sync.js`: compatibility-sensitive state, registration, and synchronization core.

## `data/`

- `data.js`: lightweight game/generation catalog.
- `bootstraps/`: generation-level lazy import boundaries.
- `tasks/`, `regidexs/`, `natidexs/`, `distributions/`, `fashion/`, `medals/`, `trainers/`: authored product data.
- `layouts/`: section ordering and visual composition.
- `syncs/`: cross-game/cross-entry relationships.
- `helpers/`: schema-building and registration helpers; avoid adding unrelated generic helpers.

Data IDs are persisted contracts. Read `data-authoring.md` before changing them.

## `api/`

- `auth/[action].js`: signup, login, session/profile, verification, and reset actions.
- `progress/[[...slug]].js`: account-wide and per-game cloud snapshots.
- `save-import/[gameKey].js`: authenticated save upload/parse dispatch.
- `subscriptions/[provider]/[action].js`: Stripe/PayPal checkout, verification, details, portal/cancel, and webhooks.
- `_lib/`: server-only security, database, provider, validation, response, and parser modules.

## `prisma/`

`schema.prisma` describes the current PostgreSQL target. `migrations/` contains the reviewed migration history; new migrations remain unapplied until their target, backup, and rollout are explicitly approved. `proposed/` contains older review-only SQL and is never applied automatically.

## `styles/`

Global and feature styles use semantic prefixes (`account-`, `task-`, `dex-`, `home-`, `dist-`, `mon-info-`). `src/styles/index.css` is the shared entry; homepage and pricing styles load with their routes.

## `scripts/`, `test/`, and `docs/`

- `scripts/`: operational tools; read `scripts/README.md` because several mutate files, accounts, or remote assets.
- `scripts/admin-tier-access.mjs`: local-only complimentary access grant,
  revocation, and history command; it deliberately has no browser/API route.
- `test/`: Node tests for authentication/payment rules and source-level standardization/mobile contracts.
- `docs/`: canonical handoff, architecture, operations, standards, and audits.

## Generated or local-only material

- `node_modules/`, `dist/`, `.vercel/`: generated.
- `.env*`, `ACTION_ITEMS.md`, `test-accounts.txt`, `MEMORY.md`, local agent directories: private/local and ignored.
- `public/`: source public assets. Build-time `asset-env.js` is generated into `dist`; do not run `prepare-public.mjs` without reading its destructive warning.
