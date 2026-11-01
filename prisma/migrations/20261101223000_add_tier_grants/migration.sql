-- CreateTable
CREATE TABLE "TierGrant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tier" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "grantedBy" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "revokeReason" TEXT,

    CONSTRAINT "TierGrant_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TierGrant_tier_check" CHECK ("tier" IN ('great', 'ultra', 'master')),
    CONSTRAINT "TierGrant_reason_check" CHECK (char_length("reason") BETWEEN 3 AND 500),
    CONSTRAINT "TierGrant_grantedBy_check" CHECK (char_length("grantedBy") BETWEEN 2 AND 120),
    CONSTRAINT "TierGrant_revokedBy_check" CHECK ("revokedBy" IS NULL OR char_length("revokedBy") BETWEEN 2 AND 120),
    CONSTRAINT "TierGrant_revokeReason_check" CHECK ("revokeReason" IS NULL OR char_length("revokeReason") BETWEEN 3 AND 500),
    CONSTRAINT "TierGrant_expiresAt_check" CHECK ("expiresAt" IS NULL OR "expiresAt" > "grantedAt"),
    CONSTRAINT "TierGrant_revokedAt_check" CHECK ("revokedAt" IS NULL OR "revokedAt" >= "grantedAt")
);

-- CreateIndex
CREATE INDEX "TierGrant_userId_revokedAt_expiresAt_idx" ON "TierGrant"("userId", "revokedAt", "expiresAt");

-- CreateIndex
CREATE INDEX "TierGrant_grantedAt_idx" ON "TierGrant"("grantedAt");

-- AddForeignKey
ALTER TABLE "TierGrant" ADD CONSTRAINT "TierGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
