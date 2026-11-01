-- Baseline matching the database before auth recovery was introduced.
-- Mark this migration as applied on the existing database; do not execute it there.

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "public"."GameSave" (
	"id" SERIAL NOT NULL,
	"userId" INTEGER NOT NULL,
	"gameKey" TEXT NOT NULL,
	"data" JSONB NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "GameSave_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."User" (
	"id" SERIAL NOT NULL,
	"email" TEXT NOT NULL,
	"passwordHash" TEXT NOT NULL,
	"icon" TEXT NOT NULL DEFAULT 'default',
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"paypalSubscriptionId" TEXT,
	"stripeCustomerId" TEXT,
	"stripeSubscriptionId" TEXT,
	"subscriptionStatus" TEXT,
	"tier" TEXT NOT NULL DEFAULT 'free',
	CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GameSave_userId_gameKey_key"
	ON "public"."GameSave"("userId", "gameKey");
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
CREATE UNIQUE INDEX "User_paypalSubscriptionId_key"
	ON "public"."User"("paypalSubscriptionId");
CREATE UNIQUE INDEX "User_stripeCustomerId_key"
	ON "public"."User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key"
	ON "public"."User"("stripeSubscriptionId");

ALTER TABLE "public"."GameSave"
	ADD CONSTRAINT "GameSave_userId_fkey"
	FOREIGN KEY ("userId") REFERENCES "public"."User"("id")
	ON DELETE CASCADE ON UPDATE CASCADE;
