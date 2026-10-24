# Operational Scripts

Run scripts from the repository root. Review environment targets before any script that writes files, mutates accounts, or uploads remote objects.

| Script                          | Purpose                                                        | Side effects and safety                                                                                                                                                                                   |
| ------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api-dev-server.mjs`            | Adapts Vercel handlers to a local Node HTTP server.            | Listens on `PPGC_API_PORT`/`API_PORT` or 3000; uses configured database/providers when routes are called.                                                                                                 |
| `write-dist-env.mjs`            | Writes runtime asset/API URLs after Vite build.                | Replaces `dist/asset-env.js`; safe only after a build created `dist`.                                                                                                                                     |
| `check-performance-budgets.mjs` | Reads Vite manifest and public media sizes.                    | Read-only; fails the build if homepage JS/CSS/image budgets regress.                                                                                                                                      |
| `create-test-accounts.mjs`      | Upserts four tier test users.                                  | Mutates the configured database, rotates passwords, increments session versions, clears provider IDs, and prints new credentials. Never run against production; protect console output.                   |
| `event-scraper.mjs`             | Stages distribution records from EventsGallery/local payloads. | Can access network/local files and write an output module. Review generated data/provenance; `--dry-run` is available. Its header previously referenced old filenames; use the current script path.       |
| `prepare-public.mjs`            | Legacy public-tree builder.                                    | **Destructive:** recursively deletes and rebuilds repository `public/`. It is not in package scripts and does not match the current Vite asset layout. Do not run without a reviewed migration/backup.    |
| `upload-assets.mjs`             | Recursively uploads assets to R2-compatible storage.           | Writes/overwrites remote keys, has no dry-run/delete rollback, and currently points to an older absolute checkout path. Do not run until the source root and overwrite policy are corrected and approved. |
| `ignore-build.sh`               | Implements Vercel deploy gating.                               | Causes Vercel to build only when the commit message contains `[deploy]`.                                                                                                                                  |

## Test-account safety

`npm run test-accounts:create` is authorized only for a disposable/test database. Confirm `DB_DATABASE_URL` first. The generated passwords are secrets even though the accounts are non-production. Do not redirect output to a tracked file or paste it into chat/issues.

## Asset upload safety

Before enabling R2 upload:

1. Replace the hard-coded source with an explicit reviewed path/config.
2. Add a dry-run inventory and total-byte report.
3. Decide whether existing keys may be overwritten.
4. Verify bucket/account and a small isolated prefix.
5. Document cache headers, rollback, and cleanup separately.

No remote upload or deletion was performed during the documentation pass.
