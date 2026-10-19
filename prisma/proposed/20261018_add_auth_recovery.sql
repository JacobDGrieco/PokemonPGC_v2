-- REVIEW-ONLY additive migration proposal. Do not run without the rollout gate
-- in SMTP_AUTH_IMPLEMENTATION_PLAN.md and a verified database backup.

ALTER TABLE "User"
	ADD COLUMN "emailVerifiedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
	ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;

-- Accounts created before verification existed retain access.
UPDATE "User"
SET "emailVerifiedAt" = COALESCE("createdAt", CURRENT_TIMESTAMP)
WHERE "emailVerifiedAt" IS NULL;

CREATE TABLE "AuthToken" (
	"id" SERIAL NOT NULL,
	"userId" INTEGER NOT NULL,
	"purpose" TEXT NOT NULL,
	"tokenHash" TEXT NOT NULL,
	"expiresAt" TIMESTAMP(3) NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AuthToken_tokenHash_key" ON "AuthToken"("tokenHash");
CREATE INDEX "AuthToken_userId_purpose_createdAt_idx"
	ON "AuthToken"("userId", "purpose", "createdAt");

ALTER TABLE "AuthToken"
	ADD CONSTRAINT "AuthToken_userId_fkey"
	FOREIGN KEY ("userId") REFERENCES "User"("id")
	ON DELETE CASCADE ON UPDATE CASCADE;

-- Validation queries to run in the same reviewed maintenance window:
-- SELECT COUNT(*) FROM "User" WHERE "emailVerifiedAt" IS NULL;
-- SELECT "sessionVersion", COUNT(*) FROM "User" GROUP BY "sessionVersion";
-- SELECT COUNT(*) FROM "AuthToken";
