-- Add email verification, all-session revocation, and hashed one-time auth tokens.
-- Existing accounts remain verified so this rollout does not lock out current users.

ALTER TABLE "User"
	ADD COLUMN "emailVerifiedAt" TIMESTAMP(3),
	ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;

UPDATE "User"
SET "emailVerifiedAt" = COALESCE("createdAt", CURRENT_TIMESTAMP)
WHERE "emailVerifiedAt" IS NULL;

ALTER TABLE "User"
	ALTER COLUMN "emailVerifiedAt" SET DEFAULT CURRENT_TIMESTAMP;

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
