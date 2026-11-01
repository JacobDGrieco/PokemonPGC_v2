# API Reference

All API responses are JSON. Private/authenticated responses use `Cache-Control: private, no-store`. Browser calls include cookies. Unless noted, errors use `{ "error": "message" }`.

## Health

### `GET /api/health`

Returns service health JSON. It does not authenticate or prove every external integration.

## Authentication and account

| Route                           | Method | Authentication  | Request / result                                                                |
| ------------------------------- | ------ | --------------- | ------------------------------------------------------------------------------- |
| `/api/auth/signup`              | POST   | No              | `{email,password}`; creates an unverified account and sends verification email. |
| `/api/auth/login`               | POST   | No              | `{email,password}`; sets `ppgc_session` only for verified credentials.          |
| `/api/auth/logout`              | POST   | Cookie optional | Clears the browser cookie.                                                      |
| `/api/auth/me`                  | GET    | Optional        | Returns `{user}` or `user: null`.                                               |
| `/api/auth/me`                  | PATCH  | Required        | Updates validated profile fields such as `icon`.                                |
| `/api/auth/resend-verification` | POST   | No              | `{email}`; generic response regardless of account state.                        |
| `/api/auth/forgot-password`     | POST   | No              | `{email}`; generic response regardless of account state.                        |
| `/api/auth/verify-email`        | POST   | No              | `{token}`; consumes a valid 24-hour token.                                      |
| `/api/auth/reset-password`      | POST   | No              | `{token,password}`; consumes a one-hour token and revokes old sessions.         |

Credentials: email at most 254 characters; password 8-128 characters with spaces preserved. Auth token request endpoints combine process-local rate limits with a database one-minute issue cooldown.

Authenticated user payloads can include `complimentaryAccess` with `tier` and
nullable `expiresAt`. `user.tier` is the higher effective access level, while
provider fields continue to describe billing only. Complimentary grants have no
public API or browser mutation route.

## Progress

All progress routes require a valid session. `gameKey` must match 1-64 alphanumeric/hyphen characters. Snapshot bodies accept `{data}` or compatibility `{snapshot}` and must be a plain object below the serialized size limit.

### `GET /api/progress`

Returns `{saves: [{gameKey,data,updatedAt}]}` for the session user, newest first.

### `PUT /api/progress`

Body: `{gameKey,data}`. Upserts the session user's game snapshot and returns `{ok:true}`.

### `GET /api/progress/:gameKey`

Returns `{save:{gameKey,data,updatedAt}}`; missing saves return 404 with `{save:null}`.

### `PUT /api/progress/:gameKey`

Body: `{data}`. Returns `{ok:true,save:{gameKey,updatedAt}}`; it intentionally does not echo the full snapshot.

## Save import

### `POST /api/save-import/:gameKey`

Requires authentication. Body: `{filename?,contentBase64}`. Maximum decoded payload is 1 MiB. Only `red` is supported; the Red parser requires exactly 32 KiB. A successful response includes parser-derived task state and diagnostic size/preview fields. Treat save files and returned progress as private user data.

## Subscriptions

All browser billing actions require authentication. Webhooks use provider signatures instead. Create/cancel actions are rate-limited and accept/generated idempotency evidence. Successfully processed webhook IDs are recorded in the provider-event ledger.

### Stripe

- `POST /api/subscriptions/stripe/create-session` with `{tier}`
- `POST /api/subscriptions/stripe/change-plan` with `{tier}`
- `POST /api/subscriptions/stripe/verify` with `{sessionId,tier}`
- `GET /api/subscriptions/stripe/details`
- `POST /api/subscriptions/stripe/portal`
- `POST /api/subscriptions/stripe/webhook` with raw provider body/signature

### PayPal

- `POST /api/subscriptions/paypal/create-subscription` with `{tier}`
- `POST /api/subscriptions/paypal/verify` with `{subscriptionId,tier}`
- `GET /api/subscriptions/paypal/details`
- `POST /api/subscriptions/paypal/cancel`
- `POST /api/subscriptions/paypal/webhook` with provider verification headers/body

Provider reconciliation recognizes `great`, `ultra`, and `master`. New checkout accepts only `great` (monthly) and `ultra` (yearly); both grant the same supporter feature set. Master checkout returns 409 until explicitly enabled. Provider Price/Plan mapping and owner metadata are authoritative; the browser's requested tier is never sufficient evidence by itself.

For an active Stripe subscription, `change-plan` applies an upgrade immediately with Stripe payment protection and schedules a downgrade for the end of the current paid period. `{tier:"free"}` schedules cancellation at period end without removing current access. Selecting the current paid tier releases a PokemonPGC-managed downgrade or resumes an end-of-period cancellation. The application refuses to alter an unknown/external Stripe schedule. `details` includes item-level period dates plus `pendingTier` and `pendingChangeDate` when a managed change exists.

## Status conventions

- 200: successful request (including generic anti-enumeration auth responses)
- 400: invalid input/provider evidence/webhook
- 401: no valid session
- 403: authenticated but provider ownership/tier evidence is invalid
- 404: route/resource missing
- 405: unsupported method with `Allow`
- 409: account/provider conflict or provider state not yet entitled
- 429: process-local rate limit, with `Retry-After` when a reset time is known
- 500: internal/provider configuration failure with a generic public message

This is an implementation reference, not a versioned public API guarantee. Coordinate compatibility before changing any route, property, cookie, or status behavior.
