# Auth-Recovery Migration Report

## Outcome

The connected Neon `neondb` database was baselined and migrated successfully on 2026-11-01. The migration fixed signup failure `P2022` by adding `User.emailVerifiedAt`, `User.sessionVersion`, and `AuthToken`.

## Backup and rehearsal

- Installed PostgreSQL 18.6 client tools through Scoop.
- Created a custom-format pre-migration backup at `C:\Users\gamin\Documents\PokemonPGC Backups\pokemonpgc-neondb-before-auth-20261101.dump`.
- Backup size: 8,641 bytes.
- SHA-256: `E835D32E2F983322F326294BD9CF91AC3A70D8930712EC6DE7122EA22F827EA2`.
- Verified the archive with `pg_restore --list` and confirmed `User` and `GameSave` data entries.
- Restored the archive into an isolated local PostgreSQL database.
- Confirmed restored row counts matched the source database.
- Rehearsed the exact baseline and migration commands successfully, then removed the disposable restore and stopped the local server.

The dump contains private application data and password hashes. Keep it access-controlled and do not commit, email, or upload it to an untrusted location.

## Applied migrations

1. `20261101143000_baseline` was marked as applied without executing its table-creation SQL against the existing database.
2. `20261101144000_add_auth_recovery` was deployed through Prisma Migrate.

No tables, rows, or existing columns were removed. Five existing users were retained and backfilled as verified using their `createdAt` timestamps. Their `sessionVersion` values started at `0`.

## Verification

- Prisma migration status: up to date, two successful migrations.
- Live Prisma schema drift: none.
- Existing users: 5.
- Existing users with null `emailVerifiedAt`: 0.
- Existing users with nonzero `sessionVersion`: 0.
- Initial `AuthToken` rows: 0.
- Required `AuthToken` indexes: 2.
- Required `AuthToken.userId` foreign key: 1.
- Repository unit tests: 25 passed.
- Prisma schema, documentation, formatting, and migration rehearsal checks passed.

## Remaining acceptance check

Retry signup with an inbox controlled by the owner. Confirm receipt of the verification email, one-time verification behavior, login after verification, password-reset delivery, one-hour reset expiry, and invalidation of older sessions after a successful reset.
