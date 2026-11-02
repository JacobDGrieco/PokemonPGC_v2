# Database Current State

## Stack and source of truth

- PostgreSQL accessed through Prisma 7.10.1 and `@prisma/adapter-pg`.
- `prisma/schema.prisma` is the checked-in application contract.
- `DB_DATABASE_URL` is the pooled application connection used by the runtime adapter; `DB_DATABASE_URL_UNPOOLED` is loaded by `prisma.config.ts` for reviewed schema and migration operations.
- `prisma/migrations` contains a baseline matching the pre-auth database,
  plus applied additive auth-recovery, provider-event ledger, and
  complimentary-access migrations.
- The v7 upgrade deliberately retains the supported `prisma-client-js` compatibility generator so the connection-engine change is isolated from the package/security upgrade. Migration to Prisma's new generated client can be load-tested separately.

## Models

- `User`: credentials, verification/session version, profile icon, effective tier/status, and unique Stripe/PayPal bindings.
- `AuthToken`: hashed, expiring email-verification and password-reset tokens owned by a user.
- `GameSave`: one whole JSON progress snapshot per `(userId, gameKey)`.
- `ProviderEvent`: durable provider webhook receipts for deduplication and incident review without raw payload retention.
- `TierGrant`: append-only complimentary-access grant/revoke history with
  database-enforced tier, audit-field, timestamp, and ownership constraints.

## Integrity and operational risks

- Tier, subscription status, and token purpose are application-validated strings rather than database constraints.
- Cloud saves are last-write-wins documents with no revision or merge history.
- Billing webhook event IDs and outcomes are stored durably when the matching handler code processes deliveries.
- `User` has no general `updatedAt` field.
- Before migration, the connected Neon database contained 5 users and the `User` and `GameSave` tables but not `User.emailVerifiedAt`, `User.sessionVersion`, or `AuthToken`.
- On 2026-11-01, the existing schema was baselined and the additive auth-recovery migration was applied. Post-migration checks found no Prisma drift, no unverified pre-existing users, two required token indexes, and the expected foreign key.
- On 2026-11-01, `20261101190000_add_provider_event_ledger` was applied. Prisma reported all migrations current, and a read-only Prisma count verified the new table was accessible with zero pre-deployment receipts.
- On 2026-11-01, `20261101223000_add_tier_grants` was applied after a fresh
  catalog-verified backup. Prisma reported all migrations current; the empty
  table had its three indexes and nine constraints, no orphaned rows, and the
  exact runtime user-selection query succeeded.
- On 2026-11-01, Prisma CLI and Client were upgraded from 6.19.3 to stable 7.10.1 without changing the schema. Migration status remained current, drift remained zero, and adapter reads plus a rollback-only transaction passed with strict TLS hostname verification.

No row contents, credentials, or private user fields were printed during inspection or migration. See [the auth migration report](migration-report-2026-11-01.md) and [the complimentary-access migration report](tier-grant-migration-report-2026-11-01.md).
