import Stripe from "stripe";
import {
	buildSubscriptionUpdate,
	getTierForStripePriceId,
	normalizeTierKey,
	parseProviderUserId,
} from "./subscription.js";

export const PPGC_STRIPE_SCHEDULE_METADATA_KEY = "ppgcManaged";
export const PPGC_STRIPE_SCHEDULE_METADATA_VALUE = "plan-change";

let stripeClient = null;

export function getStripeClient() {
	if (stripeClient) return stripeClient;

	const apiKey = String(process.env.STRIPE_SECRET_KEY || "").trim();
	if (!apiKey) {
		throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
	}

	stripeClient = new Stripe(apiKey, {
		maxNetworkRetries: 2,
		timeout: 10_000,
	});
	return stripeClient;
}

export function getStripeWebhookSecret() {
	const secret = String(
		process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK || "",
	).trim();
	if (!secret) {
		throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable.");
	}
	return secret;
}

export function getStripePortalConfigurationId() {
	return (
		String(
			process.env.STRIPE_PORTAL_CONFIGURATION_ID ||
				process.env.STRIPE_PORTAL ||
				"",
		).trim() || null
	);
}

export function getStripeSubscriptionTier(subscription) {
	const priceId = subscription?.items?.data?.[0]?.price?.id;
	const priceTier = priceId ? getTierForStripePriceId(priceId) : null;
	const metadataTier = normalizeTierKey(subscription?.metadata?.tier);

	// A conflict indicates provider state or configuration drift. Failing closed
	// prevents metadata from elevating an unrecognized or differently priced plan.
	if (priceTier && metadataTier && priceTier !== metadataTier) return null;
	return priceTier;
}

/** Stripe moved subscription periods from the subscription to each item. */
export function getStripeSubscriptionPeriod(subscription) {
	const item = subscription?.items?.data?.[0];
	return {
		currentPeriodStart:
			item?.current_period_start ??
			subscription?.current_period_start ??
			null,
		currentPeriodEnd:
			item?.current_period_end ??
			subscription?.current_period_end ??
			null,
	};
}

/** Returns a safe Stripe-hosted payment URL only for an expanded invoice. */
export function getStripeHostedInvoiceUrl(subscription) {
	const invoice = subscription?.latest_invoice;
	return typeof invoice === "object" &&
		typeof invoice?.hosted_invoice_url === "string"
		? invoice.hosted_invoice_url
		: null;
}

export function isPokemonPgcStripeSchedule(schedule, expectedUserId) {
	if (
		schedule?.metadata?.[PPGC_STRIPE_SCHEDULE_METADATA_KEY] !==
		PPGC_STRIPE_SCHEDULE_METADATA_VALUE
	) {
		return false;
	}

	if (expectedUserId == null) return true;
	return parseProviderUserId(schedule?.metadata?.userId) === expectedUserId;
}

/** Returns the next configured tier in a tagged schedule, if one exists. */
export function getStripeScheduledTier(
	schedule,
	nowSeconds = Date.now() / 1000,
) {
	if (!isPokemonPgcStripeSchedule(schedule)) return null;

	const phase = schedule?.phases?.find(
		(candidate) => Number(candidate?.start_date || 0) > nowSeconds,
	);
	const price = phase?.items?.[0]?.price;
	const priceId = typeof price === "string" ? price : price?.id;
	const tierKey = priceId ? getTierForStripePriceId(priceId) : null;
	if (!tierKey) return null;

	return {
		tierKey,
		effectiveAt: Number(phase.start_date),
	};
}

/** Normalizes paid-tier schedules and end-of-term cancellation as one change. */
export function getStripePendingChange(
	subscription,
	schedule,
	nowSeconds = Date.now() / 1000,
) {
	const scheduledTier = getStripeScheduledTier(schedule, nowSeconds);
	if (scheduledTier) return scheduledTier;
	if (!subscription?.cancel_at_period_end) return null;

	const period = getStripeSubscriptionPeriod(subscription);
	return period.currentPeriodEnd
		? { tierKey: "free", effectiveAt: Number(period.currentPeriodEnd) }
		: null;
}

function getStripeObjectId(value) {
	if (typeof value === "string") return value;
	return value?.id ? String(value.id) : null;
}

function copyStripeDiscounts(discounts) {
	return (Array.isArray(discounts) ? discounts : [])
		.map((discount) => {
			const discountId = getStripeObjectId(discount?.discount);
			if (discountId) return { discount: discountId };
			const promotionCodeId = getStripeObjectId(discount?.promotion_code);
			if (promotionCodeId) return { promotion_code: promotionCodeId };
			const couponId = getStripeObjectId(discount?.coupon);
			return couponId ? { coupon: couponId } : null;
		})
		.filter(Boolean);
}

function copyStripeScheduleItem(item) {
	const priceId = getStripeObjectId(item?.price || item?.plan);
	if (!priceId) throw new Error("Stripe schedule item price is missing.");

	const copiedItem = {
		price: priceId,
		quantity: Number(item?.quantity || 1),
	};
	if (item?.metadata && Object.keys(item.metadata).length > 0) {
		copiedItem.metadata = item.metadata;
	}
	const discounts = copyStripeDiscounts(item?.discounts);
	if (discounts.length > 0) copiedItem.discounts = discounts;
	if (Array.isArray(item?.tax_rates) && item.tax_rates.length > 0) {
		copiedItem.tax_rates = item.tax_rates
			.map(getStripeObjectId)
			.filter(Boolean);
	}
	return copiedItem;
}

/** Preserves the active phase and starts the lower tier at paid-period end. */
export function buildStripeDowngradePhases({
	schedule,
	subscription,
	targetPrice,
	userId,
	currentTier,
	targetTier,
	nowSeconds = Date.now() / 1000,
}) {
	const periodEnd = Number(
		getStripeSubscriptionPeriod(subscription).currentPeriodEnd || 0,
	);
	const currentPhase = schedule?.phases?.find(
		(phase) =>
			Number(phase?.start_date || 0) <= nowSeconds &&
			Number(phase?.end_date || 0) >= nowSeconds,
	);
	if (!currentPhase || !periodEnd) {
		throw new Error("Stripe did not expose the current billing phase.");
	}
	if (!targetPrice?.recurring?.interval) {
		throw new Error("The target Stripe price is not recurring.");
	}

	const phaseDiscounts = copyStripeDiscounts(currentPhase.discounts);
	const currentPhaseInput = {
		start_date: Number(currentPhase.start_date),
		end_date: periodEnd,
		items: currentPhase.items.map(copyStripeScheduleItem),
		metadata: {
			...(currentPhase.metadata || {}),
			userId: String(userId),
			tier: currentTier,
		},
		proration_behavior: "none",
	};
	if (phaseDiscounts.length > 0) currentPhaseInput.discounts = phaseDiscounts;

	const nextPhaseInput = {
		start_date: periodEnd,
		duration: {
			interval: targetPrice.recurring.interval,
			interval_count: Number(targetPrice.recurring.interval_count || 1),
		},
		items: [{ price: targetPrice.id, quantity: 1 }],
		metadata: { userId: String(userId), tier: targetTier },
		proration_behavior: "none",
	};
	if (phaseDiscounts.length > 0) nextPhaseInput.discounts = phaseDiscounts;

	return [currentPhaseInput, nextPhaseInput];
}

export function getStripeSubscriptionOwnerId(subscription) {
	return parseProviderUserId(subscription?.metadata?.userId);
}

export function validateStripeCheckoutBinding({
	checkoutSession,
	subscription,
	expectedUserId,
	expectedTier,
}) {
	const sessionOwnerId = parseProviderUserId(
		checkoutSession?.metadata?.userId ||
			checkoutSession?.client_reference_id,
	);
	const subscriptionOwnerId = getStripeSubscriptionOwnerId(subscription);
	const providerTier = getStripeSubscriptionTier(subscription);
	const sessionTier = normalizeTierKey(checkoutSession?.metadata?.tier);
	const normalizedExpectedTier = expectedTier
		? normalizeTierKey(expectedTier)
		: null;

	if (!sessionOwnerId || sessionOwnerId !== expectedUserId) {
		return {
			ok: false,
			error: "Stripe Checkout ownership could not be verified.",
		};
	}
	if (!subscriptionOwnerId || subscriptionOwnerId !== expectedUserId) {
		return {
			ok: false,
			error: "Stripe subscription ownership could not be verified.",
		};
	}
	if (!providerTier) {
		return {
			ok: false,
			error: "Stripe subscription tier could not be verified.",
		};
	}
	if (sessionTier && sessionTier !== providerTier) {
		return {
			ok: false,
			error: "Stripe Checkout tier does not match the subscription price.",
		};
	}
	if (normalizedExpectedTier && normalizedExpectedTier !== providerTier) {
		return {
			ok: false,
			error: "Stripe subscription does not match the requested tier.",
		};
	}
	if (
		checkoutSession?.customer &&
		subscription?.customer &&
		String(checkoutSession.customer) !== String(subscription.customer)
	) {
		return {
			ok: false,
			error: "Stripe customer does not match the subscription.",
		};
	}

	return { ok: true, ownerId: expectedUserId, tierKey: providerTier };
}

export function buildStripeSubscriptionUpdate(
	subscription,
	{ clearPayPal = false } = {},
) {
	return buildSubscriptionUpdate({
		provider: "stripe",
		tierKey: getStripeSubscriptionTier(subscription),
		status: subscription?.status || null,
		stripeCustomerId: subscription?.customer
			? String(subscription.customer)
			: undefined,
		stripeSubscriptionId: subscription?.id
			? String(subscription.id)
			: undefined,
		clearPayPal,
	});
}
