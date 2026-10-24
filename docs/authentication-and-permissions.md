# Authentication and Permissions

## Session model

`api/_lib/auth.js` creates a custom HMAC-SHA256 signed payload, not a JWT. The `ppgc_session` cookie is HTTP-only, SameSite=Lax, Path `/`, Priority High, and Secure in production. It expires after 30 days.

The payload contains user ID, email, issue/expiry times, and `sessionVersion`. `getSessionFromRequest()` verifies the signature/expiry and then checks the database version. Logout clears one cookie; password reset increments the database version and revokes all prior cookies.

`AUTH_SECRET` is security-critical. Rotation signs out every user. Use a high-entropy secret and never expose it to client code.

## Signup and email verification

- Emails are trimmed/lowercased and passwords are preserved exactly after validation.
- New public accounts are inserted with `emailVerifiedAt: null`.
- Verification tokens use 32 random bytes, are stored only as SHA-256 digests, expire after 24 hours, and are single use.
- Resend replaces the prior verification token for that user.
- Login is denied until verification succeeds.

Existing-account rollout uses the schema default/backfill described in `docs/audits/SMTP_AUTH_SETUP.md`; do not accidentally mark established accounts unverified during migration.

## Password recovery

- Forgot-password returns the same public message for eligible and ineligible addresses.
- Reset tokens expire after one hour and are single use.
- Successful reset writes a new bcrypt hash and increments `sessionVersion`.
- Raw tokens, passwords, URLs containing tokens, and recipient addresses must not be logged.

## Authorization boundaries

- Cloud saves are always scoped to `session.userId`; callers cannot choose another owner.
- Save import requires a valid session.
- Billing browser actions require a valid session and verified provider owner/tier evidence.
- Webhooks require Stripe signature construction or PayPal remote verification.
- Paid feature visibility uses the server-serialized tier; only provider-entitled states should write a paid tier.

Client-side tier checks improve UX but are not a substitute for server authorization on sensitive operations.

## Rate limits

`api/_lib/rateLimit.js` stores counters in process memory. This protects one warm process only; cold starts and parallel serverless instances have independent buckets. Database token cooldown limits repeat verification/reset issuance across instances, but a distributed rate-limit service is still required for a strong production abuse control.

## CSRF and origin assumptions

SameSite=Lax cookies and same-origin `/api` use reduce cross-site exposure. State-changing endpoints accept JSON/POST and provider return URLs use a validated canonical origin. There is no separate CSRF token layer; do not loosen cookie/origin behavior without a security review.

## Manual security gates

- SMTP delivery, SPF/DKIM/DMARC, and token-expiry/reuse tests
- Login/signup enumeration and rate-limit tests
- Cross-account progress and provider-ID rejection
- Stripe/PayPal webhook signature and reverse-order delivery tests
- Session invalidation across multiple browsers after password reset
- Production secret/config inspection without logging values
