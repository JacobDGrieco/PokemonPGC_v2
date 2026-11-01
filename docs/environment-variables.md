# Environment Variables

Use `.env.example` as the template. Never commit populated secret files or paste live values into issues/logs.

## Database and authentication

| Variable                   | Required                | Scope         | Purpose                                                         |
| -------------------------- | ----------------------- | ------------- | --------------------------------------------------------------- |
| `DB_DATABASE_URL`          | API features            | Server secret | Pooled PostgreSQL URL used by Prisma.                           |
| `DB_DATABASE_URL_UNPOOLED` | Schema operations       | Server secret | Direct PostgreSQL URL used for migration/schema work.           |
| `AUTH_SECRET`              | Accounts                | Server secret | HMAC key for `ppgc_session`; rotation invalidates every cookie. |
| `APP_ORIGIN`               | Production auth/billing | Server config | Canonical HTTP(S) origin for email and provider return links.   |

`APP_ORIGIN` falls back to trusted Vercel URL variables and to the request origin only in non-production. Configure it explicitly in production.

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

`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `STRIPE_PRICE_GREAT|ULTRA|MASTER` are required for their respective flows. `STRIPE_PORTAL_CONFIGURATION_ID` is optional. Legacy aliases `STRIPE_WEBHOOK` and `STRIPE_PORTAL` remain readable but new environments should use the full names.

All IDs must belong to the same Stripe test/live account and mode.

`VITE_STRIPE_ENABLED=true` exposes the Stripe checkout control. It is public UI configuration, not authorization. Stripe Checkout dynamically presents the recurring-compatible payment methods enabled for the Stripe account and eligible for the customer.

## PayPal

`PAYPAL_ENVIRONMENT` is `sandbox` or `live` (default `sandbox`). `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, and `PAYPAL_PLAN_GREAT|ULTRA|MASTER` must belong to that same environment.

`VITE_PAYPAL_ENABLED=false` is the default. Set it to `true` only when the standalone PayPal credentials, Plans, webhook, and sandbox acceptance matrix are complete. Existing PayPal subscription management remains available for already-bound accounts even when new checkout is hidden.

## Client/runtime URLs

- `VITE_ASSET_BASE_URL` or fallback `ASSET_BASE_URL`: prefix for externally hosted game assets.
- `VITE_API_BASE_URL` or fallback `API_BASE_URL`: API base written at build time.

The browser client uses a configured cross-origin API only on localhost; deployed browsers fall back to same-origin `/api` to preserve cookie/security assumptions. Do not put secrets in `VITE_*` variables.

## Local development aliases

The preferred API port is `PPGC_API_PORT`; `API_PORT`, `PPGC_BACKEND_PORT`, and `BACKEND_PORT` remain accepted aliases in Vite configuration. Default: 3000.

## Operational scripts

- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`: `upload-assets.mjs` only.
- `GITHUB_TOKEN`: optional event-scraper GitHub API authentication.
- `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_GIT_COMMIT_MESSAGE`: supplied by Vercel; do not set as application secrets.

## Verification

Environment names are referenced by `prisma/schema.prisma`, `vite.config.js`, `scripts/write-dist-env.mjs`, `api/_lib/*`, and provider helpers. `npm run build` proves client/build variables parse; provider, SMTP, and database connectivity require explicit sandbox/test-environment checks.
