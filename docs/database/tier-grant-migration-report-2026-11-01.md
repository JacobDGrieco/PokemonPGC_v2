# Complimentary-Access Migration Report — 2026-11-01

## Target and cause

Production `/api/auth/me` and `/api/auth/login` requests returned HTTP 500.
Vercel runtime logs identified Prisma `P2021`: the deployed user selection
included `User.tierGrants`, but `public."TierGrant"` did not exist.

The approved target was the configured PPGC production PostgreSQL database.
No connection strings, credentials, user records, or private fields were
printed.

## Backup

Before migration, a PostgreSQL 18 custom-format backup was created at:

`C:\Users\gamin\Documents\PokemonPGC Backups\pokemonpgc-before-tier-grant-20261101-232148.dump`

- Size: 17,305 bytes
- SHA-256: `E944E724205F24D362F1DF32BF855CD6FBA52A5456F66F530280EE99C8319E1E`
- Catalog entries: 57
- `pg_restore --list` verified the required `User`, `GameSave`, `AuthToken`,
  and `ProviderEvent` table entries.

The backup was catalog-verified but was not restored into an isolated database
during this incident repair. Restoration remains the recovery path if
independent data damage is later identified; normal application rollback does
not require dropping the additive table.

## Migration

Preflight `prisma migrate status` found exactly four checked-in migrations and
only `20261101223000_add_tier_grants` pending. No drift or additional pending
migration was observed.

`prisma migrate deploy` applied that migration successfully. It created the
empty `TierGrant` table, primary key, two supporting indexes, seven check
constraints, and the cascading `User` foreign key. It did not update or delete
existing rows.

## Verification

- Prisma migration status: database schema up to date.
- Migration ledger: one successful, non-rolled-back entry.
- Table exists: yes.
- Rows: 0, as expected before the first owner grant.
- Indexes: 3, including the primary-key index.
- Constraints: 9, including the primary key and foreign key.
- Orphaned grant rows: 0.
- The exact Prisma user-selection query used by auth completed successfully and
  returned an existing user with zero tier grants.

The remaining acceptance check is an owner-performed production login with a
fresh Turnstile token, followed by inspection of Vercel logs for any new auth
errors.
