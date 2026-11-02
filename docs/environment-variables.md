# Environment Variables

This is the canonical environment contract. Create `.env` locally and add values directly in Vercel for deployed environments; do not commit populated secret files or paste live values into issues/logs. Production and Preview may share values when that is intentional. Vercel Development values are only needed for workflows such as `vercel dev` or `vercel env run --environment development`; ordinary `npm run dev` reads the local `.env`.

## Database and authentication

| Variable                   | Required                | Scope         | Purpose                                                         |
| -------------------------- | ----------------------- | ------------- | --------------------------------------------------------------- |
| `DB_DATABASE_URL`          | API features            | Server secret | Pooled PostgreSQL URL used by Prisma.                           |
| `DB_DATABASE_URL_UNPOOLED` | Schema operations       | Server secret | Direct PostgreSQL URL used for migration/schema work.           |
| `AUTH_SECRET`              | Accounts                | Server secret | HMAC key for `ppgc_session`; rotation invalidates every cookie. |
| `APP_ORIGIN`               | Production auth/billing | Server config | Canonical HTTP(S) origin for email and provider return links.   |

`APP_ORIGIN` falls back to trusted Vercel URL variables and to the request origin only in non-production. Configure it explicitly in production.

## Authentication bot protection

| Variable                  | Required      | Scope         | Purpose                                                     |
| ------------------------- | ------------- | ------------- | ----------------------------------------------------------- |
| `VITE_TURNSTILE_SITE_KEY` | Deployed auth | Public client | Cloudflare Turnstile widget sitekey embedded by Vite.       |
| `TURNSTILE_SECRET_KEY`    | Deployed auth | Server secret | Server-only key used with Cloudflare's Siteverify endpoint. |

Create a managed Turnstile widget and restrict it to `pokemonpgc.com`; Cloudflare treats the root hostname as covering `www.pokemonpgc.com` and its other subdomains. Localhost automatically uses Cloudflare's published test keys when these variables are absent. Production fails closed if the real keys or canonical host information are missing, and it refuses Cloudflare's test secret.

Vercel Preview deployments need a hostname explicitly allowed by the selected Turnstile widget because Cloudflare does not accept wildcard hostname entries. Prefer a stable preview alias and a separate preview widget rather than authorizing a broad shared domain. See [Turnstile setup](turnstile-setup.md).

## SMTP

| Variable                  | Required                   | Default/format                                          |
| ------------------------- | -------------------------- | ------------------------------------------------------- |
| `SMTP_HOST`               | Yes for verification/reset | Hostname                                                |
| `SMTP_PORT`               | Yes                        | Integer 1-65535; typically 465 or 587                   |
| `SMTP_USER` / `SMTP_PASS` | Yes                        | Provider credentials; server-only                       |
| `SMTP_SECURE`             | Optional                   | Defaults true on port 465                               |
| `SMTP_REQUIRE_TLS`        | Recommended                | Defaults true in production unless implicit TLS is used |
| `SMTP_FROM_EMAIL`         | Optional                   | Defaults to `SMTP_USER`                                 |
| `SMTP_FROM_NAME`          | Optional                   | Defaults to `PokemonPGC`                                |

The transporter requires TLS 1.2+, bounds connection/socket time, and blocks file/URL content loading.

## Stripe

`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_GREAT`, and `STRIPE_PRICE_ULTRA` are required for new checkout. Great is the $5 monthly Price and Ultra is the $50 yearly Price; both grant the same supporter access. `STRIPE_PRICE_MASTER` remains readable for provider reconciliation but new Master checkout is disabled until the lifetime product and permanent-entitlement rules are implemented. `STRIPE_PORTAL_CONFIGURATION_ID` is optional. Legacy aliases `STRIPE_WEBHOOK` and `STRIPE_PORTAL` remain readable but new environments should use the full names.

All keys, Price IDs, portal configurations, webhook endpoints, and signing secrets must belong to the same Stripe test/live account and mode. Keep the full set in test mode until sandbox acceptance passes; test signing secrets cannot validate live endpoint deliveries and vice versa.

`VITE_STRIPE_ENABLED` set to `true` exposes the Stripe checkout control. It is public UI configuration, not authorization. Stripe Checkout dynamically presents the recurring-compatible payment methods enabled for the Stripe account and eligible for the customer.

## PayPal

`PAYPAL_ENVIRONMENT` is `sandbox` or `live` (default `sandbox`). `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_PLAN_GREAT`, `PAYPAL_PLAN_ULTRA`, and `PAYPAL_PLAN_MASTER` must belong to that same environment.

`VITE_PAYPAL_ENABLED` defaults to `false`. Set it to `true` only when the standalone PayPal credentials, Plans, webhook, and sandbox acceptance matrix are complete. Existing PayPal subscription management remains available for already-bound accounts even when new checkout is hidden.

## Client/runtime URLs

- `VITE_ASSET_BASE_URL` or fallback `ASSET_BASE_URL`: prefix for externally hosted game assets.
- `VITE_API_BASE_URL`: API base written at build time. `API_BASE_URL` remains a legacy fallback but is unnecessary for same-origin Vercel deployments.

The browser client uses a configured cross-origin API only on localhost; deployed browsers fall back to same-origin `/api` to preserve cookie/security assumptions. Do not put secrets in `VITE_*` variables.

## Local development aliases

The preferred API port is `PPGC_API_PORT`; `API_PORT`, `PPGC_BACKEND_PORT`, and `BACKEND_PORT` remain accepted aliases in Vite configuration. Default: 3000. This is local-only and should not be set in Vercel.

## Operational scripts

- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`: `upload-assets.mjs` only.
- `GITHUB_TOKEN`: optional event-scraper GitHub API authentication.
- `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_GIT_COMMIT_MESSAGE`: supplied by Vercel; do not set as application secrets.

## Verification

Environment names are referenced by `prisma/schema.prisma`, `vite.config.js`, `scripts/write-dist-env.mjs`, `api/_lib/*`, and provider helpers. `npm run build` proves client/build variables parse; provider, SMTP, and database connectivity require explicit sandbox/test-environment checks.
