# Prisma 7 Upgrade Report

## Outcome

Prisma CLI and Client were upgraded from 6.19.3 to stable 7.10.1 on Node 24.
The production deployment completed successfully, and the deployed Stripe
test-mode grant/cancel webhook lifecycle passed through the upgraded database
runtime.

The upgrade retains Prisma's supported `prisma-client-js` compatibility
generator. Runtime connections now use `@prisma/adapter-pg` with Neon's pooled
URL, a five-second connection timeout, and `sslmode=verify-full`. Prisma CLI
schema and migration commands use the direct URL through `prisma.config.ts`.

## Backup and recovery

- Backup: `C:\Users\gamin\Documents\PokemonPGC Backups\pokemonpgc-before-prisma7-20261101-164737.dump`
- Format: PostgreSQL custom archive
- Size: 16,333 bytes
- SHA-256: `D23D332DA27F03613A8E5D4B9D444B1CB7FD4DA34C81512A4B573F9724084CC3`
- Verification: `pg_restore --list` succeeded with five table-data entries.

The dump contains private application data and password hashes. Keep it
access-controlled and never commit or upload it to an untrusted location.

No schema migration or data transformation was needed. The normal rollback is
to restore Prisma 6.19.3 source and lock-file versions, reinstall, and redeploy.
Database restoration is unnecessary unless data is independently damaged.

## Verification

- Prisma schema formatting, validation, and Client 7.10.1 generation passed.
- All three checked-in migrations are applied.
- Prisma reported zero database drift.
- Adapter reads and a rollback-only transaction passed; the smoke row was not
  retained.
- Strict TLS hostname verification passed without the `pg` compatibility
  warning.
- `npm audit` and `npm audit --omit=dev` reported zero vulnerabilities locally.
- Formatting, CSS/JavaScript linting, and documentation checks passed. ESLint
  retained eight pre-existing React Hook warnings and reported no errors.
- All 34 repository tests passed.
- The production build passed its JavaScript, CSS, and image budgets.
- Vercel generated Prisma Client 7.10.1 and deployed the production build.
- Stripe test-mode subscription grant, cancellation, provider-event receipts,
  and disposable-account cleanup passed against the deployed webhook.

## Remaining work

Prisma's new `prisma-client` generator produces a different generated-client
layout and changes the connection engine. Migrate to it separately only after
serverless bundling and connection-pool/load behavior are measured. Prisma 8
was a release candidate at the time of this upgrade and was intentionally not
used.
