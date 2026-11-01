# Deployment

The checked-in target is Vercel for the SPA and API handlers, PostgreSQL/Prisma for persistence, SMTP for auth email, Stripe Checkout for billing, optional standalone PayPal compatibility, and optionally R2 for external assets.

## Build gate

`vercel.json` intentionally skips builds unless the commit message contains `[deploy]`. Confirm this policy before changing it. A local build does not deploy anything.

## Production owner checklist

1. Configure `APP_ORIGIN`, `AUTH_SECRET`, database URLs, SMTP, and any enabled provider variables from [the environment reference](environment-variables.md).
2. Keep `APP_ORIGIN` on `https://www.pokemonpgc.com`; `vercel.json` redirects the apex host to `www` so the host-only authentication cookie survives every Stripe return path.
3. Keep server secrets out of `VITE_*` variables.
4. Run `npm run check` with Node 24.
5. Verify a current database backup exists and can be restored.
6. Restore the backup into an isolated database and rehearse the exact additive SQL/migration.
7. Validate row counts, constraints, defaults, indexes, and application compatibility on the restored copy.
8. Apply only the reviewed migration to the approved target, then run `npm run prisma:generate` for the deployment artifact.
9. Configure the Stripe webhook for the exact public origin/environment. Configure the standalone PayPal webhook only when `VITE_PAYPAL_ENABLED=true`.
10. Complete SMTP inbox, auth, provider sandbox, mobile/desktop, and cloud save acceptance tests.
11. Deploy with an intentional `[deploy]` commit message only when every gate is approved.

Never run `prisma db push`, `prisma migrate reset`, or `deploy:prepare-db` against production.

## Auth-recovery schema addition

`prisma/proposed/20261018_add_auth_recovery.sql` is review-only. It adds verification/session-version fields and hashed one-time tokens. Follow [SMTP and authentication setup](audits/SMTP_AUTH_SETUP.md) for the exact validation sequence. Existing accounts must remain verified during rollout.

## Webhooks

- Stripe: `POST /api/subscriptions/stripe/webhook`
- PayPal: `POST /api/subscriptions/paypal/webhook`

Use the event sets and sandbox matrix in [subscription payments setup](audits/SUBSCRIPTION_PAYMENTS_SETUP.md). The configured database already contains `20261101190000_add_provider_event_ledger`; verify migration status separately for any other deployment target.

## Complimentary access rollout

`20261101223000_add_tier_grants` is additive but must be deployed before the
application build that selects `User.tierGrants`. Verify a restorable backup,
rehearse the SQL against an isolated copy, run `npx prisma migrate deploy` only
against the explicitly approved target, and confirm migration status before the
application deployment. The owner command defaults to dry-run and should be
exercised with grant/history/revoke on an approved account after deployment.

## Rollback

- Roll back application code first.
- Prefer leaving additive nullable/defaulted database changes in place during application rollback.
- Do not drop columns/tables until the old application is confirmed compatible and a separate destructive-change approval is granted.
- Restore a database only through an approved incident plan; a source rollback does not reverse data mutations.
- Revert asset URLs/config separately from deleting remote objects.

## Unverified external state

The repository cannot prove current DNS, SMTP deliverability, deployed environment variables, webhook delivery, production database drift, region alignment, CDN headers, or provider objects. Verify them in their owning consoles before claiming production readiness.
