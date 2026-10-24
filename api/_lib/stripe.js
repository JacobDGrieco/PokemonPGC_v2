import Stripe from "stripe";
import {
	buildSubscriptionUpdate,
	getTierForStripePriceId,
	normalizeTierKey,
	parseProviderUserId,
} from "./subscription.js";

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
