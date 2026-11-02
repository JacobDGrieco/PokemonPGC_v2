# Authentication and Permissions

## Session model

`api/_lib/auth.js` creates a custom HMAC-SHA256 signed payload, not a JWT. The `ppgc_session` cookie is HTTP-only, SameSite=Lax, Path `/`, Priority High, and Secure in production. It expires after 30 days.

The payload contains user ID, email, issue/expiry times, and `sessionVersion`. `getSessionFromRequest()` verifies the signature/expiry and then checks the database version. Logout clears one cookie; password reset increments the database version and revokes all prior cookies.

`AUTH_SECRET` is security-critical. Rotation signs out every user. Use a high-entropy secret and never expose it to client code.

## Signup and email verification

- Public signup begins with a neutral birth month/year screen before email and password fields are shown.
- The shared month-based rule is checked again by the API before any account lookup or creation. The ambiguous thirteenth-birthday month remains ineligible; signup becomes available the following month.
- Birth month/year exists only in transient component/request memory. It is not stored in the database, cookies, browser storage, analytics, or application logs.
- Emails are trimmed/lowercased and passwords are preserved exactly after validation.
- Login and signup require separate action-bound Cloudflare Turnstile tokens that are validated once on the server and reset after every attempt.
- New public accounts are inserted with `emailVerifiedAt: null`.
- Verification tokens use 32 random bytes, are stored only as SHA-256 digests, expire after 24 hours, and are single use.
- Resend replaces the prior verification token for that user.
- Login is denied until verification succeeds.

Existing-account rollout uses the schema default/backfill described in [SMTP and authentication setup](audits/SMTP_AUTH_SETUP.md); do not accidentally mark established accounts unverified during migration.

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
- Complimentary tiers are separate `TierGrant` records. The public effective
  tier is the higher of provider-backed access and an active, unexpired grant.
- Grant administration has no HTTP route. The local owner command requires
  database credentials, an exact verified email, a recorded actor/reason,
  matching confirmation, and an explicit execution flag.

Client-side tier checks improve UX but are not a substitute for server authorization on sensitive operations.

## Rate limits

`api/_lib/rateLimit.js` stores counters in process memory. This protects one warm process only; cold starts and parallel serverless instances have independent buckets. Database token cooldown limits repeat verification/reset issuance across instances, but a distributed rate-limit service is still required for a strong production abuse control.

Turnstile supplements but does not replace these limits. Its public sitekey is safe for browser code; `TURNSTILE_SECRET_KEY` must remain server-only. Production authentication fails closed when verification cannot be completed. See [Turnstile setup](turnstile-setup.md).

## CSRF and origin assumptions

SameSite=Lax cookies and same-origin `/api` use reduce cross-site exposure. State-changing endpoints accept JSON/POST and provider return URLs use a validated canonical origin. There is no separate CSRF token layer; do not loosen cookie/origin behavior without a security review.

## Manual security gates

- SMTP delivery, SPF/DKIM/DMARC, and token-expiry/reuse tests
- Login/signup enumeration and rate-limit tests
- Turnstile real-key login/signup, action mismatch, expired-token, blocked-browser, and provider-outage tests
- Cross-account progress and provider-ID rejection
- Stripe/PayPal webhook signature and reverse-order delivery tests
- Session invalidation across multiple browsers after password reset
- Production secret/config inspection without logging values
