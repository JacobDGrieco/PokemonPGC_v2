# Database Proposal

## Owner-managed complimentary tier grants

Status: approved in principle by the owner on 2026-11-01; implementation is
safe to stage locally, but the migration must be reviewed before it is applied
to the connected database.

Existing design: `User.tier` is the provider-backed tier written by Stripe or
PayPal reconciliation. Directly setting it to `master` would fabricate billing
state, lose grant history, and allow a later provider webhook to overwrite the
complimentary access.

Requirement: the owner needs to grant Great, Ultra, or Master access to an
exact existing account without payment for personal use, friends, or giveaways.
Grant and revoke operations must be highly restricted and auditable.

Proposed design:

1. Add an append-only `TierGrant` model related to `User`. It stores the tier,
   bounded reason, operator label, grant time, optional expiration, and optional
   revocation metadata. Database checks restrict tiers and field lengths.
2. Derive the public effective tier as the higher of the provider-backed
   `User.tier` and all active, unexpired grants. Keep provider IDs, billing
   status, and `User.tier` unchanged.
3. Provide only a local CLI for grant, revoke, and history inspection. Do not
   add an HTTP admin route or browser admin page. The CLI requires database
   credentials, an exact verified email, a reason, an operator label, and an
   exact email confirmation; it refuses an existing billing relationship unless
   the operator supplies an explicit override.
4. Show recipients that their access is complimentary and suppress misleading
   purchase/downgrade controls while a grant is active. Existing billing portal
   access remains available when a separately paid subscription exists.
5. Update tier-managed icons when a grant or revoke changes effective access,
   while preserving uploaded or explicitly selected icons.

Affected files: `prisma/schema.prisma`, a new additive migration,
`api/_lib/subscription.js`, the owner CLI and script documentation, auth/payment
serialization tests, and the Account/Pricing React views. No provider objects,
prices, invoices, or webhooks are changed.

Classification: **safe additive with application coordination**. There is no
backfill or existing-row transformation. Creating the empty table, foreign key,
checks, and indexes should require only brief catalog locks and no application
downtime. Deploy the migration before application code that selects
`User.tierGrants`; the current application safely ignores the new table.

Recovery: roll back the application while retaining `TierGrant`; old code will
ignore it. Do not drop the table after grants exist because that would destroy
the audit history. Revoke an incorrect active grant through the CLI instead.

Verification:

```sql
SELECT COUNT(*) FROM "TierGrant";
SELECT "userId", "tier", "expiresAt", "revokedAt"
FROM "TierGrant"
WHERE "revokedAt" IS NULL
  AND ("expiresAt" IS NULL OR "expiresAt" > CURRENT_TIMESTAMP);
SELECT "userId", COUNT(*)
FROM "TierGrant"
WHERE "revokedAt" IS NULL
  AND ("expiresAt" IS NULL OR "expiresAt" > CURRENT_TIMESTAMP)
GROUP BY "userId";
```

Application tests must cover grant expiration, highest-tier resolution,
provider/grant coexistence, public serialization, CLI validation, icon behavior,
and complimentary UI contracts. Prisma format/validate/generate, migration
status/drift checks, the complete repository check, and a reviewed grant/revoke
exercise against a disposable or explicitly approved database are required.

## Subscription plan-management corrections

Status: approved by the owner on 2026-11-01; follow-up implementation and
Stripe sandbox lifecycle verification complete. Deployment verification is
pending because the deployed API still lacks the new change-plan action.

Observed behavior after the first sandbox checkout:

- Checkout returns to the canonical `www` origin, but both apex and `www` serve
  the app. Host-only login cookies therefore make an apex session appear logged
  out after Stripe returns to `www`.
- Stripe's current API stores billing periods on subscription items; the app
  still reads removed subscription-level fields.
- Provider reconciliation updates the effective tier but does not update a
  default/tier-managed account icon.
- Existing Stripe subscribers cannot select another tier in PokemonPGC and are
  sent to the generic billing portal.

Proposed behavior:

1. Redirect the apex domain to `www` so authentication and payment returns use
   one host. Keep the session cookie host-only and `SameSite=Lax`.
2. Read current period dates from the subscription item with legacy fallback.
3. Update the icon with the effective tier only when the existing icon is
   `default` or matches the previous tier. Preserve uploaded/custom icons.
4. Add an authenticated Stripe plan-change action. Great-to-Ultra changes
   immediately with Stripe's payment-failure protection. Ultra-to-Great keeps
   Ultra through the paid period and schedules Great through a Stripe
   subscription schedule. Selecting the current tier cancels a PokemonPGC-
   managed pending downgrade.
5. Keep Stripe Customer Portal for invoices, payment methods, and cancellation;
   move tier selection and pending-change status into PokemonPGC.
6. Treat Free as an end-of-term Stripe cancellation target so every lower tier
   is selectable. Show the current paid tier as a cancellation control that opens
   the authenticated Stripe portal, and let a scheduled lower-tier control undo
   the pending change.
7. Keep the PokemonPGC pricing screen as the plan selector while Stripe remains
   authoritative for charges, invoices, receipts, prorations, and subscription
   state. Show renewal and scheduled-change dates as date-only values in the
   public Account UI, and omit the internal current-period start value there.
   When an immediate upgrade needs customer payment action, send the customer
   to Stripe's hosted invoice and fall back to Customer Portal only when Stripe
   does not provide an invoice URL.

Classification: **requires application coordination; no database migration**.
Stripe remains authoritative for active and scheduled prices. No new database
columns or backfill are required.

Compatibility and recovery: existing subscriptions without schedules remain
unchanged. Schedules created by PokemonPGC are tagged and are the only schedules
the application may update or release. Unknown/external schedules fail closed.
Source rollback restores the old UI and API; any already-created Stripe schedule
must be released through Stripe only after confirming the intended customer
plan. The existing database backup remains available, but database restoration
is not part of this rollback because no schema or stored data changes are
planned.

Verification: unit-test date normalization, tier/icon policy, scheduled-tier
parsing, and route contracts; create disposable sandbox subscriptions for
immediate upgrade and end-of-term downgrade; verify webhook convergence,
scheduled effective date, schedule cancellation, account cleanup, canonical
redirect deployment, repository checks, and production logs before acceptance.

## Prisma 7 runtime upgrade

Status: completed and deployed on 2026-11-01. See
[the Prisma 7 upgrade report](prisma7-upgrade-report-2026-11-01.md).

The application currently uses Prisma CLI and Client 6.19.3 on Node 24. Prisma's
stable major upgrade target is 7.10.1. Prisma 8 is still a release candidate and
is outside this change. The v7 client requires an explicit PostgreSQL driver
adapter, a generated-client output path, ESM imports from that output, and a
root `prisma.config.ts` for CLI datasource configuration.

Classification: **requires application coordination; no data migration
required**. The Prisma models and existing migration SQL remain unchanged. This
change affects client generation, connection pooling, CLI configuration,
serverless bundling, and every process that imports `PrismaClient`.

Implementation sequence:

1. Preserve the current database with a custom-format `pg_dump` and verify its
   catalog with `pg_restore --list`.
2. Pin `prisma`, `@prisma/client`, `@prisma/adapter-pg`, and `pg` to compatible
   stable versions through npm.
3. Move the CLI datasource URL into `prisma.config.ts`, using the unpooled URL
   for migration/schema commands. Keep the pooled URL in the runtime adapter.
4. Generate the v7 client into an ignored server-only directory and update all
   handwritten imports.
5. Validate and format the schema, generate the client, confirm migration
   status and zero drift, run the complete test/build/documentation suite, and
   execute representative read/write/transaction checks with the disposable
   test account.
6. Deploy only after the local and connected-database checks pass, then verify
   the production health/auth/payment paths and logs.

Recovery: revert the source/package lock to Prisma 6.19.3 and reinstall to
regenerate the previous client. Because this upgrade has no schema migration,
source rollback is the primary recovery path. The verified pre-upgrade backup
is `C:\Users\gamin\Documents\PokemonPGC Backups\pokemonpgc-before-prisma7-20261101-164737.dump`
(SHA-256 `D23D332DA27F03613A8E5D4B9D444B1CB7FD4DA34C81512A4B573F9724084CC3`),
but restoring it should only be considered if database data is independently
damaged; a package rollback does not require a database restore.

Expected downtime: none. No DDL is planned. Deployment replaces the serverless
runtime client only; failed validation stops before deployment.

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

## Provider-event ledger proposal

Status: applied and verified on 2026-11-01.

Existing behavior verifies provider signatures and fetches current subscription
state, but it does not persist processed event IDs. Provider retries can therefore
repeat reconciliation work, and there is no local receipt history for support or
incident review.

The `ProviderEvent` table stores the provider, unique event ID, event
type, related provider object ID, processing outcome, provider occurrence time,
and local processing time. It deliberately does not retain raw webhook payloads
or customer details. Stripe and PayPal handlers check the ledger before work and
record a receipt only after successful reconciliation. A concurrent duplicate
may repeat an idempotent current-state reconciliation, but the database unique
constraint guarantees one durable receipt.

Classification: **safe additive with application coordination**. Migration
`20261101190000_add_provider_event_ledger` created one empty table and two
indexes without rewriting existing application tables. It was applied before
deployment of code that reads the new model.

Verification:

```sql
SELECT COUNT(*) FROM "ProviderEvent";
SELECT "provider", "eventId", COUNT(*)
FROM "ProviderEvent"
GROUP BY "provider", "eventId"
HAVING COUNT(*) > 1;
SELECT "provider", "outcome", COUNT(*)
FROM "ProviderEvent"
GROUP BY "provider", "outcome";
```

Application rollback can safely leave the additive table in place. Dropping it
now would be destructive, would discard future receipt history, and requires a
separate approved incident plan.

## Deferred safe-additive proposals

- Add cloud-save revision/schema-version fields before designing compare-and-swap or merge behavior.
- Add database constraints for tier, token purpose, and provider status only after profiling existing values.
- Establish a reviewed Prisma migration baseline after comparing every deployed environment with the checked-in schema.

Each proposal requires its own migration plan, validation queries, rollback path, and explicit target-environment approval. Do not edit an already-applied migration or use `prisma db push` as the production migration strategy.
