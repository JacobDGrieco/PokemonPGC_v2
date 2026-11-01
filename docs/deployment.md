# Deployment

The checked-in target is Vercel for the SPA and API handlers, PostgreSQL/Prisma for persistence, SMTP for auth email, Stripe Checkout for billing, optional standalone PayPal compatibility, and optionally R2 for external assets.

## Build gate

`vercel.json` intentionally skips builds unless the commit message contains `[deploy]`. Confirm this policy before changing it. A local build does not deploy anything.

## Production owner checklist

1. Configure `APP_ORIGIN`, `AUTH_SECRET`, database URLs, SMTP, and any enabled provider variables from `.env.example`.
2. Keep server secrets out of `VITE_*` variables.
3. Run `npm run check` with Node 24.
4. Verify a current database backup exists and can be restored.
5. Restore the backup into an isolated database and rehearse the exact additive SQL/migration.
6. Validate row counts, constraints, defaults, indexes, and application compatibility on the restored copy.
7. Apply only the reviewed migration/SQL to the approved target, then run `npm run prisma:generate` for the deployment artifact.
8. Configure the Stripe webhook for the exact public origin/environment. Configure the standalone PayPal webhook only when `VITE_PAYPAL_ENABLED=true`.
9. Complete SMTP inbox, auth, provider sandbox, mobile/desktop, and cloud save acceptance tests.
10. Deploy with an intentional `[deploy]` commit message only when every gate is approved.

Never run `prisma db push`, `prisma migrate reset`, or `deploy:prepare-db` against production.

## Auth-recovery schema addition

`prisma/proposed/20261018_add_auth_recovery.sql` is review-only. It adds verification/session-version fields and hashed one-time tokens. Follow [SMTP and authentication setup](audits/SMTP_AUTH_SETUP.md) for the exact validation sequence. Existing accounts must remain verified during rollout.

## Webhooks

- Stripe: `POST /api/subscriptions/stripe/webhook`
- PayPal: `POST /api/subscriptions/paypal/webhook`

Use the event sets and sandbox matrix in [subscription payments setup](audits/SUBSCRIPTION_PAYMENTS_SETUP.md). Current code does not persist webhook event IDs, so production launch still needs an explicit decision on durable idempotency/history.

## Rollback

- Roll back application code first.
- Prefer leaving additive nullable/defaulted database changes in place during application rollback.
- Do not drop columns/tables until the old application is confirmed compatible and a separate destructive-change approval is granted.
- Restore a database only through an approved incident plan; a source rollback does not reverse data mutations.
- Revert asset URLs/config separately from deleting remote objects.

## Unverified external state

The repository cannot prove current DNS, SMTP deliverability, deployed environment variables, webhook delivery, production database drift, region alignment, CDN headers, or provider objects. Verify them in their owning consoles before claiming production readiness.
