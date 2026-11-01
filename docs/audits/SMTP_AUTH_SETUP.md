# SMTP and Authentication Setup

PokemonPGC sends verification and password-reset messages through Nodemailer. The application never stores raw one-time tokens: only SHA-256 digests are written to `AuthToken`.

## Prerequisites

1. Confirm the target database contains `User.emailVerifiedAt`, `User.sessionVersion`, and `AuthToken` from `prisma/schema.prisma`.
2. Verify a restorable database backup before applying any schema change.
3. Rehearse `prisma/proposed/20261018_add_auth_recovery.sql` against an isolated restore if the target database predates those fields.
4. Never use `prisma db push`, `prisma migrate reset`, or `deploy:prepare-db` against production.

## Required environment

```dotenv
APP_ORIGIN="https://your-production-domain.example"
AUTH_SECRET="at-least-32-random-bytes"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_REQUIRE_TLS="true"
SMTP_USER="sender@example.com"
SMTP_PASS="provider-app-password"
SMTP_FROM_EMAIL="sender@example.com"
SMTP_FROM_NAME="PokemonPGC"
```

- `APP_ORIGIN` must be the exact public HTTPS origin. It controls links delivered by email and provider return URLs.
- `AUTH_SECRET` must contain at least 32 bytes. Rotating it intentionally signs every existing browser session out.
- Port 587 normally uses `SMTP_SECURE=false` plus `SMTP_REQUIRE_TLS=true`.
- Port 465 normally uses `SMTP_SECURE=true`; implicit TLS makes `SMTP_REQUIRE_TLS` unnecessary.
- `SMTP_FROM_EMAIL` must be an address the SMTP provider permits the authenticated account to send as.

## Reusing StylesEngravingInc SMTP

The local StylesEngravingInc project uses Google SMTP with a matching authenticated sender address. Its host, port, secure mode, username, password, and sender address can be reused for PokemonPGC staging if that mailbox is intended to send both brands. Keep `SMTP_FROM_NAME=PokemonPGC`.

For production, a dedicated PokemonPGC mailbox or verified alias is preferable so recipients do not see an unrelated business address. Do not copy either project's populated environment file into Git.

## Getting Google SMTP credentials

1. Choose the Google or Google Workspace mailbox that will send PokemonPGC mail.
2. Enable 2-Step Verification on that account.
3. Open [Google App Passwords](https://support.google.com/accounts/answer/185833).
4. Create a new app password specifically for PokemonPGC.
5. Store the generated 16-character value as `SMTP_PASS` without display-grouping spaces.
6. Use `smtp.gmail.com`, port 587, STARTTLS settings from the example above.

Google can hide App Passwords for organization-managed, security-key-only, or Advanced Protection accounts. In that case, use an SMTP relay or a transactional email provider with a dedicated credential.

## Adding values to Vercel

1. Open the PokemonPGC project in Vercel.
2. Go to **Settings -> Environment Variables**.
3. Add the database, auth, origin, and SMTP variables from [the environment reference](../environment-variables.md).
4. Mark passwords, tokens, and connection strings as sensitive.
5. Apply production credentials to Production. Use non-production credentials for Preview and Development where possible.
6. Redeploy after changing variables; Vercel does not inject changes into an existing deployment.

## Acceptance checks

- Create a new account and receive the verification email in a real inbox.
- Confirm the link uses the canonical HTTPS origin.
- Verify the token succeeds once and fails on reuse.
- Request a password reset, confirm one-hour expiry behavior, and verify older sessions are revoked.
- Check text and HTML email rendering, spam placement, and sender alignment.
- Configure SPF, DKIM, and DMARC for the sending domain before production delivery.

Do not paste delivered links, tokens, recipient addresses, credentials, or connection strings into logs or issue reports.
