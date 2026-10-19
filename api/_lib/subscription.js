import { json } from "./response.js";
export { getAppOrigin, normalizeAppOrigin } from "./appOrigin.js";

export const SUBSCRIPTION_TIERS = ["great", "ultra", "master"];
export const STRIPE_ENTITLED_STATUSES = new Set(["active", "trialing"]);
export const PAYPAL_ENTITLED_STATUSES = new Set(["ACTIVE"]);

function envKey(prefix, tierKey) {
	return `${prefix}_${String(tierKey || "").toUpperCase()}`;
}

export function normalizeTierKey(value) {
	const tierKey = String(value || "").trim().toLowerCase();
	return SUBSCRIPTION_TIERS.includes(tierKey) ? tierKey : null;
}

/**
 * Converts an external identifier to the positive integer shape used by User.id.
 * Provider metadata is untrusted input until it passes this parser and is matched
 * against either the authenticated user or an existing provider binding.
 */
export function parseProviderUserId(value) {
	const normalized = String(value ?? "").trim();
	if (!/^\d+$/.test(normalized)) return null;
	const parsed = Number(normalized);
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export function isEntitledSubscriptionStatus(provider, status) {
	const normalizedProvider = String(provider || "").trim().toLowerCase();
	const normalizedStatus = String(status || "").trim();

	if (normalizedProvider === "stripe") {
		return STRIPE_ENTITLED_STATUSES.has(normalizedStatus.toLowerCase());
	}
	if (normalizedProvider === "paypal") {
		return PAYPAL_ENTITLED_STATUSES.has(normalizedStatus.toUpperCase());
	}
	return false;
}

export function requireTierKey(value) {
	const tierKey = normalizeTierKey(value);
	if (!tierKey) {
		throw new Error("Invalid subscription tier.");
	}
	return tierKey;
}

export function getStripePriceIdForTier(tierKey) {
	const key = envKey("STRIPE_PRICE", requireTierKey(tierKey));
	const priceId = String(process.env[key] || "").trim();
	if (!priceId) {
		throw new Error(`Missing ${key} environment variable.`);
	}
	return priceId;
}

export function getPayPalPlanIdForTier(tierKey) {
	const key = envKey("PAYPAL_PLAN", requireTierKey(tierKey));
	const planId = String(process.env[key] || "").trim();
	if (!planId) {
		throw new Error(`Missing ${key} environment variable.`);
	}
	return planId;
}

export function getTierForStripePriceId(priceId) {
	for (const tierKey of SUBSCRIPTION_TIERS) {
		const configured = String(process.env[envKey("STRIPE_PRICE", tierKey)] || "").trim();
		if (configured && configured === priceId) return tierKey;
	}
	return null;
}

export function getTierForPayPalPlanId(planId) {
	for (const tierKey of SUBSCRIPTION_TIERS) {
		const configured = String(process.env[envKey("PAYPAL_PLAN", tierKey)] || "").trim();
		if (configured && configured === planId) return tierKey;
	}
	return null;
}

export function serializeUser(user) {
	if (!user) return null;

	const subscriptionProvider = user.stripeSubscriptionId
		? "stripe"
		: user.paypalSubscriptionId
			? "paypal"
			: null;

	return {
		id: user.id,
		email: user.email,
		icon: user.icon,
		tier: user.tier || "free",
		subscriptionStatus: user.subscriptionStatus || null,
		subscriptionProvider,
		hasBillingPortal: subscriptionProvider === "stripe",
		canCancelPayPalSubscription: subscriptionProvider === "paypal",
	};
}

export function getUserPublicSelect() {
	return {
		id: true,
		email: true,
		icon: true,
		tier: true,
		subscriptionStatus: true,
		stripeCustomerId: true,
		stripeSubscriptionId: true,
		paypalSubscriptionId: true,
	};
}

export function buildSubscriptionUpdate({
	provider,
	tierKey,
	status,
	stripeCustomerId,
	stripeSubscriptionId,
	paypalSubscriptionId,
	clearStripe = false,
	clearPayPal = false,
}) {
	const normalizedTier = normalizeTierKey(tierKey);
	const normalizedStatus = status == null ? null : String(status).trim();
	const isEntitled = isEntitledSubscriptionStatus(provider, normalizedStatus);

	const data = {
		tier: isEntitled && normalizedTier ? normalizedTier : "free",
		subscriptionStatus: normalizedStatus || null,
	};

	if (clearStripe) {
		data.stripeCustomerId = null;
		data.stripeSubscriptionId = null;
	}
	if (clearPayPal) {
		data.paypalSubscriptionId = null;
	}
	if (stripeCustomerId !== undefined) data.stripeCustomerId = stripeCustomerId;
	if (stripeSubscriptionId !== undefined) data.stripeSubscriptionId = stripeSubscriptionId;
	if (paypalSubscriptionId !== undefined) data.paypalSubscriptionId = paypalSubscriptionId;

	return data;
}

export function requireAuthenticatedUserId(session, res) {
	if (!session?.userId) {
		json(res, 401, { error: "Not authenticated." });
		return null;
	}
	return session.userId;
}
