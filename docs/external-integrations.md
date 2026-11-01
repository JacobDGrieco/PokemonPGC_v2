# External Integrations

## PostgreSQL and Prisma

Server handlers use Prisma Client from `api/_lib/db.js`. Development caches the client to reduce reconnections. Database URLs are server-only. See `data-model.md` and `deployment.md`.

## SMTP

Nodemailer sends verification and reset mail. TLS 1.2+, bounded timeouts, no file/URL loading, escaped HTML, and text alternatives are enforced. DNS/domain delivery (SPF, DKIM, DMARC) remains an operator responsibility.

## Stripe

Stripe creates subscription checkout sessions, verifies returned sessions, exposes Billing Portal sessions/details, and reconciles signed webhooks. Account ownership and tier are derived from server-written metadata and configured Price IDs. Use test mode until the full sandbox matrix passes.

Checkout is the payment-data boundary: PokemonPGC does not collect card or wallet credentials. Because the session leaves `payment_method_types` unset, Stripe can dynamically show eligible, recurring-compatible methods enabled in the Dashboard, including cards and supported wallets. Availability depends on the Stripe account country, currency, customer device, browser, and recurring-payment compatibility.

## PayPal

The standalone PayPal integration is retained for compatibility but new PayPal checkout defaults off. When enabled, it creates subscriptions, verifies owner/tier/Plan binding, loads details, cancels subscriptions, and verifies webhooks. Requests have a ten-second bound. Keep sandbox/live credentials, Plans, and webhook ID in the same environment.

## PokeAPI

`src/services/pokeApi.js` fetches selected Pokemon detail/species data with request deduplication and a ten-second timeout. Local data remains the fallback; this is not a bulk startup dependency.

## Cloudflare R2-compatible assets

The client can prefix asset paths with `VITE_ASSET_BASE_URL`/`ASSET_BASE_URL`. `scripts/upload-assets.mjs` uploads recursively with MIME types but currently uses a hard-coded source path from an older checkout and has no dry-run/delete behavior. Do not run it until that path and overwrite policy are reviewed.

## GitHub / ProjectPokemon event data

`scripts/event-scraper.mjs` reads ProjectPokemon's EventsGallery through local files and/or GitHub. `GITHUB_TOKEN` is optional and must not be logged. Many formats are metadata-only; `.pk3` has deeper parsing. Review generated records and provenance before committing.

## Vercel

Vercel serves the SPA and API handlers and provides deployment-origin variables. Vercel Analytics is loaded in the client. The commit-message `[deploy]` gate is intentional in current configuration.

## Third-party assets and legal status

Pokemon game data, sprites, models, fonts, screenshots, and scraped event records have no complete repository-wide attribution manifest. This is an unresolved release risk. Do not represent the project as officially affiliated or assume that technical access grants redistribution rights.
