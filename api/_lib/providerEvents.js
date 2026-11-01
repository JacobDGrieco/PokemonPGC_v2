/**
 * Durable provider-event receipt helpers.
 *
 * Only provider identifiers and processing outcomes are stored. Raw webhook
 * payloads are intentionally excluded because they can contain customer data.
 */
import { prisma } from "./db.js";

const MAX_PROVIDER_LENGTH = 32;
const MAX_EVENT_ID_LENGTH = 255;
const MAX_EVENT_TYPE_LENGTH = 255;
const MAX_OBJECT_ID_LENGTH = 255;
const MAX_OUTCOME_LENGTH = 64;

function requiredBoundedText(value, name, maxLength) {
	const normalized = String(value || "").trim();
	if (!normalized || normalized.length > maxLength) {
		throw new Error(`${name} is invalid.`);
	}
	return normalized;
}

function optionalBoundedText(value, name, maxLength) {
	if (value == null || value === "") return null;
	return requiredBoundedText(value, name, maxLength);
}

function optionalDate(value) {
	if (!value) return null;
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

export function buildProviderEventData({
	provider,
	eventId,
	eventType,
	objectId,
	outcome,
	occurredAt,
}) {
	return {
		provider: requiredBoundedText(
			String(provider || "").toLowerCase(),
			"Provider",
			MAX_PROVIDER_LENGTH,
		),
		eventId: requiredBoundedText(
			eventId,
			"Provider event ID",
			MAX_EVENT_ID_LENGTH,
		),
		eventType: requiredBoundedText(
			eventType,
			"Provider event type",
			MAX_EVENT_TYPE_LENGTH,
		),
		objectId: optionalBoundedText(
			objectId,
			"Provider object ID",
			MAX_OBJECT_ID_LENGTH,
		),
		outcome: requiredBoundedText(
			outcome,
			"Provider event outcome",
			MAX_OUTCOME_LENGTH,
		),
		occurredAt: optionalDate(occurredAt),
	};
}

export async function wasProviderEventProcessed(
	provider,
	eventId,
	database = prisma,
) {
	const identity = buildProviderEventData({
		provider,
		eventId,
		eventType: "identity-check",
		outcome: "identity-check",
	});
	const existing = await database.providerEvent.findUnique({
		where: {
			provider_eventId: {
				provider: identity.provider,
				eventId: identity.eventId,
			},
		},
		select: { id: true },
	});
	return !!existing;
}

/**
 * Records a successfully handled event. A unique-race means another request
 * already committed the same receipt, so callers can acknowledge the retry.
 */
export async function recordProcessedProviderEvent(event, database = prisma) {
	const data = buildProviderEventData(event);
	try {
		await database.providerEvent.create({ data, select: { id: true } });
		return { created: true, duplicate: false };
	} catch (error) {
		if (error?.code === "P2002") {
			return { created: false, duplicate: true };
		}
		throw error;
	}
}
