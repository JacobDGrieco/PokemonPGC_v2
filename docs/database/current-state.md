# Database Current State

## Stack and source of truth

- PostgreSQL accessed through Prisma 6.
- `prisma/schema.prisma` is the checked-in application contract.
- `DB_DATABASE_URL` is the pooled application connection; `DB_DATABASE_URL_UNPOOLED` is reserved for reviewed schema operations.
- `prisma/migrations` contains a baseline matching the pre-auth database and a separate additive auth-recovery migration. Both are recorded as successfully applied on the connected Neon database.

## Models

- `User`: credentials, verification/session version, profile icon, effective tier/status, and unique Stripe/PayPal bindings.
- `AuthToken`: hashed, expiring email-verification and password-reset tokens owned by a user.
- `GameSave`: one whole JSON progress snapshot per `(userId, gameKey)`.

## Integrity and operational risks

- Tier, subscription status, and token purpose are application-validated strings rather than database constraints.
- Cloud saves are last-write-wins documents with no revision or merge history.
- Billing webhook event IDs and processing history are not stored durably.
- `User` has no general `updatedAt` field.
- Before migration, the connected Neon database contained 5 users and the `User` and `GameSave` tables but not `User.emailVerifiedAt`, `User.sessionVersion`, or `AuthToken`.
- On 2026-11-01, the existing schema was baselined and the additive auth-recovery migration was applied. Post-migration checks found no Prisma drift, no unverified pre-existing users, two required token indexes, and the expected foreign key.

No row contents, credentials, or private user fields were printed during inspection or migration. See [the migration report](migration-report-2026-11-01.md).
