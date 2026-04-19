import Stripe from "stripe";
import { buildSubscriptionUpdate, getTierForStripePriceId } from "./subscription.js";

let stripeClient = null;

export function getStripeClient() {
	if (stripeClient) return stripeClient;

	const apiKey = String(process.env.STRIPE_SECRET_KEY || "").trim();
	if (!apiKey) {
		throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
	}

	stripeClient = new Stripe(apiKey);
	return stripeClient;
}

export function getStripeWebhookSecret() {
	const secret = String(process.env.STRIPE_WEBHOOK || "").trim();
	if (!secret) {
		throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable.");
	}
	return secret;
}

export function getStripePortalConfigurationId() {
	return String(process.env.STRIPE_PORTAL || "").trim() || null;
}

export function getStripeSubscriptionTier(subscription) {
	const metadataTier = String(subscription?.metadata?.tier || "").trim().toLowerCase();
	if (metadataTier) return metadataTier;

	const priceId = subscription?.items?.data?.[0]?.price?.id;
	return priceId ? getTierForStripePriceId(priceId) : null;
}

export function buildStripeSubscriptionUpdate(subscription) {
	return buildSubscriptionUpdate({
		tierKey: getStripeSubscriptionTier(subscription),
		status: subscription?.status || null,
		stripeCustomerId: subscription?.customer ? String(subscription.customer) : undefined,
		stripeSubscriptionId: subscription?.id ? String(subscription.id) : undefined,
		clearPayPal: true,
	});
}
