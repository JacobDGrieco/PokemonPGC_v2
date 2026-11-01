# Data Model

`prisma/schema.prisma` is the checked-in PostgreSQL target. No live database was inspected and no migration baseline is present.

```mermaid
erDiagram
	User ||--o{ GameSave : owns
	User ||--o{ AuthToken : receives
	User {
		int id PK
		string email UK
		string passwordHash
		datetime emailVerifiedAt
		int sessionVersion
		string icon
		string tier
		string subscriptionStatus
		string stripeCustomerId UK
		string stripeSubscriptionId UK
		string paypalSubscriptionId UK
		datetime createdAt
	}
	GameSave {
		int id PK
		int userId FK
		string gameKey
		json data
		datetime createdAt
		datetime updatedAt
	}
	AuthToken {
		int id PK
		int userId FK
		string purpose
		string tokenHash UK
		datetime expiresAt
		datetime createdAt
	}
```

## Rules

- `User.email` is unique; application validation trims and lowercases it.
- Passwords are bcrypt hashes. Plaintext passwords never belong in the database.
- `emailVerifiedAt = null` prevents login for newly created accounts.
- Incrementing `sessionVersion` invalidates all older signed cookies.
- One `GameSave` exists per `(userId, gameKey)` and is deleted with its user.
- `GameSave.data` is a whole JSON snapshot. The API enforces a plain object with at most 1,000,000 serialized characters.
- `AuthToken` stores a SHA-256 digest, never the raw verification/reset token; user deletion cascades tokens.
- Provider IDs are unique nullable bindings. Effective paid access also requires an entitled provider status.

## Current limitations

- Tier/status strings are not database enums or constrained values.
- Game saves have no schema version, revision, compare-and-swap field, or merge history.
- Billing subscriptions/webhook events are not modeled durably.
- `User` has no `updatedAt` audit field.
- Profile icons may be large inline image data URLs.

See [database current state](database/current-state.md) for the current assessment and [database proposal](database/proposal.md) for review-only rollout and future safe-additive work.
