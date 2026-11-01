-- Record successfully handled provider webhook events without retaining raw
-- payloads or customer data. The compound key provides durable deduplication.

CREATE TABLE "ProviderEvent" (
	"id" SERIAL NOT NULL,
	"provider" TEXT NOT NULL,
	"eventId" TEXT NOT NULL,
	"eventType" TEXT NOT NULL,
	"objectId" TEXT,
	"outcome" TEXT NOT NULL,
	"occurredAt" TIMESTAMP(3),
	"processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "ProviderEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProviderEvent_provider_eventId_key"
	ON "ProviderEvent"("provider", "eventId");
CREATE INDEX "ProviderEvent_provider_processedAt_idx"
	ON "ProviderEvent"("provider", "processedAt");
