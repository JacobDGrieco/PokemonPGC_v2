# Troubleshooting

## `spawn EPERM` during tests or build on Windows

The restricted runner may block Node worker/process creation before any assertion runs. Rerun the identical `npm test` or `npm run build` with permission to spawn processes. Diagnose application failures only if the elevated run reaches the test/build logic.

## API requests fail during `npm run dev`

- Confirm both `dev:client` and `dev:api` are running.
- Confirm Vite and the adapter use the same port (`PPGC_API_PORT`, default 3000).
- Check `/api/health` through the Vite origin, not only the adapter port.
- A deployed cross-origin `VITE_API_BASE_URL` is intentionally reduced to same-origin `/api` outside localhost.

## Authentication email fails

- Validate every SMTP value in `environment-variables.md`.
- Port 465 normally needs `SMTP_SECURE=true`; port 587 normally needs STARTTLS.
- Set `APP_ORIGIN` to the exact public HTTPS origin.
- Check provider authentication, SPF/DKIM/DMARC, and spam placement without logging the link/token.
- Inbox delivery is not proven by a successful build or unit test.

## Login says verification is required

Use resend verification. Loading the link page does not consume the token; confirmation does. Tokens expire after 24 hours and a newer issuance replaces the older one.

## Password reset signs out other sessions

This is intentional. Reset increments `sessionVersion`, invalidating every previously signed cookie.

## Subscription returns but tier does not update

- Confirm the authenticated user matches provider owner metadata/custom ID.
- Confirm the configured Stripe Price or PayPal Plan maps to the requested tier.
- Confirm the provider status is entitled (`active`/`trialing` or `ACTIVE`).
- Confirm the exact webhook secret/ID and endpoint environment.
- Do not manually set the database tier as a substitute for repairing provider evidence.

## Cloud progress appears older

Stop sync before making more changes. Preserve local/folder/cloud copies, identify the newest trustworthy snapshot, and follow `persistence-and-recovery.md`. Current cloud saves have no revision conflict detection.

## Save import is rejected

The route requires login, accepts at most 1 MiB decoded data, and supports only `gameKey=red`. The Red file must be exactly 32 KiB. Other games/formats are intentionally unsupported.

## Missing images/models

- Check runtime `asset-env.js` and `VITE_ASSET_BASE_URL`/`ASSET_BASE_URL`.
- Verify the referenced key exists at the CDN/static origin with correct CORS/cache headers.
- Confirm the authored path uses the canonical asset helper.
- A model-viewer build chunk warning is expected because the viewer remains an optional on-demand feature.

## Prisma/schema mismatch

Run `npx prisma validate --schema prisma/schema.prisma` and compare the approved target with the checked-in schema. Do not fix production drift with `db push` or reset. Use backup, isolated restore, reviewed migration, and validation gates.

## Layout works on desktop but not phone

Use `docs/mobile-responsive-standards.md` and verify 320, 360, 390, 430, 600, 768, 900/901, landscape, zoom, keyboard, and reduced motion. No Playwright run is implied by source/build success.
