# PokemonPGC

PokemonPGC is an unofficial Pokemon post-game checklist, Pokedex tracker, and collection companion. It combines local-first progress tracking with optional accounts, cloud saves, save-file import, and paid feature tiers.

> This is a work in progress and is not affiliated with Nintendo, Game Freak, or The Pokemon Company. Game names and assets belong to their respective owners.

## What is implemented

- Per-game story, post-game, sidequest, trainer, and collection checklists
- Regional/national Dex tracking, forms, shiny/alpha state, and cross-entry sync
- Event distributions, fashion, recipes, medals, research, and other collectibles
- Search-first Pokemon information with progressive rendering
- Local browser persistence and optional folder backup/recovery
- Optional account-based cloud saves
- Email verification and password recovery through SMTP
- Stripe Checkout supporter subscriptions: Great Ball monthly and Ultra Ball
  yearly, with Master Ball reserved for a later release and standalone PayPal
  retained as an opt-in compatibility provider
- Pokemon Red save-file parsing; other save formats are not implemented
- On-demand 3D model viewer and generation-specific data loading

Some data sets and navigation destinations remain incomplete. `src/config/tiers.js` is the source of truth for feature readiness and tier access.

## Stack

- Node.js 24
- React 18, React Router 7, and Vite 7
- Plain JavaScript/JSX and CSS
- Prisma 7 with PostgreSQL through the `pg` driver adapter
- Vercel-style serverless API handlers
- Nodemailer/SMTP, Stripe Checkout, optional standalone PayPal, Cloudflare
  R2-compatible asset publishing, PokeAPI, Three.js, and Vercel Analytics

## Quick start

1. Install Node.js 24 and PostgreSQL access.
2. Run `npm install`.
3. Create a local `.env` using the names in [the environment reference](docs/environment-variables.md), and fill only the values required for the flows you will use. Never commit `.env`.
4. Run `npm run prisma:generate`.
5. Run `npm run dev`.

The client uses port 5173. The local API adapter defaults to port 3000. The app can render and store local progress without an API, but accounts, cloud saves, save import, email, and subscriptions require server/database configuration.

## Commands

| Command                   | Purpose                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `npm run dev`             | Start client and local API adapter.                                 |
| `npm run build`           | Build `dist/`, write runtime URLs, and enforce performance budgets. |
| `npm run preview`         | Preview the production client build.                                |
| `npm test`                | Run Node contract/security tests.                                   |
| `npm run lint`            | Run ESLint and Stylelint.                                           |
| `npm run format:check`    | Check formatting.                                                   |
| `npm run check`           | Run formatting, lint, tests, and production build.                  |
| `npm run prisma:generate` | Generate Prisma Client from the checked-in schema.                  |
| `npm run prisma:migrate`  | Create/apply a development migration; review the target first.      |
| `npm run prisma:deploy`   | Apply reviewed migrations in a deployment environment.              |
| `npm run stripe:audit`    | Read-only audit of configured Stripe test/live objects.             |

`db:push`, `prisma:push`, and `deploy:prepare-db` can alter a database without a reviewed migration history. Do not use them against production. See [deployment](docs/deployment.md).

## Repository map

- `src/`: React UI, hybrid runtime, persistence, sync, modals, and client services
- `data/`: game configuration, tasks, Dexes, distributions, collectibles, layouts, and lazy bootstraps
- `api/`: serverless HTTP handlers and server-only auth/payment/database helpers
- `prisma/`: PostgreSQL schema and review-only proposed SQL
- `styles/`: shared and feature-owned stylesheets
- `scripts/`: development, build, data, account, and asset operations
- `test/`: security and source-contract tests
- `docs/`: canonical architecture, operations, contracts, standards, and audit records

## Documentation

- [Architecture](docs/architecture.md)
- [Project structure](docs/project-structure.md)
- [Application flows](docs/application-flows.md)
- [Development](docs/development.md)
- [Environment variables](docs/environment-variables.md)
- [API reference](docs/api.md)
- [Authentication and permissions](docs/authentication-and-permissions.md)
- [Data model](docs/data-model.md)
- [Data authoring](docs/data-authoring.md)
- [Persistence and recovery](docs/persistence-and-recovery.md)
- [External integrations](docs/external-integrations.md)
- [Deployment](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)
- [SMTP and authentication rollout](docs/audits/SMTP_AUTH_SETUP.md)
- [Subscription payments rollout](docs/audits/SUBSCRIPTION_PAYMENTS_SETUP.md)
- [Operational scripts](scripts/README.md)

## Important limitations

- Production schema work requires a backup, restored-copy rehearsal, reviewed additive migration, and validation.
- Cloud restore remains whole-account/last-write behavior without revision-based conflict resolution.
- API rate limiting is process-local and is not a distributed production control.
- Billing event receipts are durable, but full subscription history remains in Stripe rather than the application database.
- Red is the only supported save-file parser.
- File System Access API folder backup is browser-dependent.
- Physical mobile/browser, inbox-delivery, provider sandbox, webhook-delivery, and production-database verification are separate manual gates.

## Legal and content provenance

This repository is an unofficial fan project. Asset and data provenance is not yet fully catalogued; maintainers must confirm licensing and attribution before public or commercial distribution. The event scraper targets ProjectPokemon's EventsGallery and Pokemon detail fallback can use PokeAPI; neither integration transfers ownership of source content.
