# Application Flows

## Startup and route loading

1. `src/main.jsx` mounts `App` inside `BrowserRouter`.
2. `src/App.jsx` selects a lazy route page and shows a route loading state.
3. Checklist/account routes mount `AppShell`; `useLegacyBootstrap()` imports `src/index.js` and installs legacy APIs.
4. The store loads `ppgc_v1`, generation metadata loads on demand, and bridge events refresh React UI.

## Local checklist update

1. A React or imperative control mutates task, Dex, or collection state.
2. Task/Dex sync modules cascade only declared `taskSync`/`dexSync` relationships.
3. `save()` serializes the compatible snapshot to `localStorage`.
4. With an authenticated cloud-sync session, `src/persistence.js` schedules/uploads a per-game snapshot through `api.js`.

Local durability is immediate. Cloud conflict behavior remains last-write/whole-snapshot.

## Signup and verification

1. `AuthModal` posts credentials to `/api/auth/signup`.
2. The API creates an unverified user, issues a hashed one-time token, and sends an SMTP link.
3. `/verify-email?token=...` renders `AuthActionPage`; confirmation posts to `/api/auth/verify-email`.
4. The API consumes the token and marks the email verified; the user can then log in.

Forgot/resend responses are deliberately generic to reduce account enumeration.

## Login and password reset

Login verifies bcrypt credentials and email verification, then sets a 30-day HMAC-signed HTTP-only SameSite=Lax cookie. Authenticated requests also compare its `sessionVersion` with the database.

Password reset sends a one-hour one-time link. Success replaces the password hash, increments `sessionVersion`, and consumes the token, invalidating older cookies across devices.

## Cloud restore/save

`src/persistence.js` coordinates local state, optional folder handles, and API saves. `/api/progress` lists all user snapshots; `/api/progress/:gameKey` reads/writes one. Ownership always comes from the session, never the request body.

The current startup restore can fetch all saves. Do not replace it with manifest/demand loading until conflict precedence and compatibility are explicitly designed.

## Save-file import

1. An authenticated browser base64-encodes a file and posts it to `/api/save-import/:gameKey`.
2. The server enforces a 1 MiB transport bound and dispatches by game key.
3. Only Pokemon Red is supported; its parser requires an exact 32 KiB save and maps reviewed offsets/flags to task IDs.
4. The client presents/applies parsed progress through existing persistence rules.

## Subscription lifecycle

1. The browser requests checkout/approval for a tier.
2. The server derives Price/Plan IDs from environment configuration and writes owner/tier evidence to provider metadata/custom IDs.
3. Return verification re-fetches provider state and rejects mismatched user, tier, Price, or Plan evidence.
4. Webhooks independently reconcile current state.
5. Only Stripe `active`/`trialing` and PayPal `ACTIVE` grant a paid tier. Conflicting active providers are rejected.

PayPal cancellation currently removes access immediately. Stripe cancellation management is delegated to the Billing Portal.

## Complimentary tier access

1. The owner runs the local `admin:tier-access` command against an explicitly
   reviewed database target; there is no HTTP admin action.
2. The command requires an exact existing verified email, operator label,
   reason, dry-run review, matching confirmation, and `--execute`.
3. An active `TierGrant` combines with provider-backed `User.tier` by choosing
   the higher rank. It never creates or modifies a Stripe/PayPal object.
4. Grant and revoke records retain their actor, reason, timestamps, optional
   expiration, and revocation metadata for audit history.
