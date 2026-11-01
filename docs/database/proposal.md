# Database Proposal

Signup currently fails with Prisma `P2022` because the checked-in application schema requires auth-recovery fields that the connected Neon database does not contain.

Status: completed on 2026-11-01. See [the migration report](migration-report-2026-11-01.md).

## Immediate rollout

1. The configured pooled and direct URLs target the same Neon database. The read-only audit found 5 users, `User`, and `GameSave`; all auth-recovery objects are absent.
2. Create and verify a restorable Neon backup or branch before applying schema changes.
3. Mark `20261101143000_baseline` as applied. This records the verified existing schema without executing its `CREATE TABLE` statements.
4. Run `prisma migrate deploy` through the unpooled URL. This applies only `20261101144000_add_auth_recovery`.
5. The auth migration adds nullable `emailVerifiedAt`, backfills existing users from `createdAt`, sets the default for future ORM writes, adds `sessionVersion` with default `0`, and creates `AuthToken` with its indexes and cascading foreign key.
6. Validate Prisma migration status, database drift, user counts, non-null backfill, default session versions, token constraints, signup, verification, login, and password reset.

Classification: **safe additive** with application coordination. The migration takes brief table locks for two `ALTER TABLE` statements. With 5 current users, the backfill is bounded and no meaningful downtime is expected.

Compatibility: the deployed pre-auth application ignores the new columns and table. The current application requires them, so the database migration must complete before or with deployment.

Recovery: take a verified backup or Neon branch first. If the migration fails, Prisma records the failed migration and deployment must stop for inspection. A manual rollback would drop `AuthToken`, `emailVerifiedAt`, and `sessionVersion`; that is data-destructive after auth tokens or session versions are in use and therefore requires separate approval. Restoring the verified backup is the preferred recovery path.

Verification queries:

```sql
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "User" WHERE "emailVerifiedAt" IS NULL;
SELECT "sessionVersion", COUNT(*) FROM "User" GROUP BY "sessionVersion";
SELECT COUNT(*) FROM "AuthToken";
```

## Deferred safe-additive proposals

- Add a durable billing-event ledger keyed by provider and event ID for auditability, idempotency, retry history, and event timestamps.
- Add cloud-save revision/schema-version fields before designing compare-and-swap or merge behavior.
- Add database constraints for tier, token purpose, and provider status only after profiling existing values.
- Establish a reviewed Prisma migration baseline after comparing every deployed environment with the checked-in schema.

Each proposal requires its own migration plan, validation queries, rollback path, and explicit target-environment approval. Do not edit an already-applied migration or use `prisma db push` as the production migration strategy.
