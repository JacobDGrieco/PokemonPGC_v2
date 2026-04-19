import { json } from "./response.js";

export const SUBSCRIPTION_TIERS = ["great", "ultra", "master"];
export const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
	"ACTIVE",
	"APPROVAL_PENDING",
	"APPROVED",
	"TRIALING",
	"trialing",
	"active",
	"past_due",
	"paused",
]);

function envKey(prefix, tierKey) {
	return `${prefix}_${String(tierKey || "").toUpperCase()}`;
}

export function normalizeTierKey(value) {
	const tierKey = String(value || "").trim().toLowerCase();
	return SUBSCRIPTION_TIERS.includes(tierKey) ? tierKey : null;
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

export function getAppOrigin(req) {
	const originHeader = String(req.headers?.origin || "").trim();
	if (originHeader) return originHeader.replace(/\/+$/, "");

	const forwardedProto = String(req.headers?.["x-forwarded-proto"] || "").trim();
	const forwardedHost = String(req.headers?.["x-forwarded-host"] || "").trim();
	if (forwardedProto && forwardedHost) {
		return `${forwardedProto}://${forwardedHost}`.replace(/\/+$/, "");
	}

	const host = String(req.headers?.host || "").trim();
	if (host) {
		const proto = process.env.NODE_ENV === "production" ? "https" : "http";
		return `${proto}://${host}`.replace(/\/+$/, "");
	}

	const apiBaseUrl = String(process.env.API_BASE_URL || "").trim();
	if (apiBaseUrl) {
		return apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
	}

	return "http://127.0.0.1:5173";
}

export function serializeUser(user) {
	if (!user) return null;

	const subscriptionProvider = user.stripeCustomerId
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
		paypalSubscriptionId: true,
	};
}

export function buildSubscriptionUpdate({
	tierKey,
	status,
	stripeCustomerId,
	stripeSubscriptionId,
	paypalSubscriptionId,
	clearStripe = false,
	clearPayPal = false,
}) {
	const normalizedTier = normalizeTierKey(tierKey);
	const upperStatus = status == null ? null : String(status).trim();
	const active = ACTIVE_SUBSCRIPTION_STATUSES.has(upperStatus) || ACTIVE_SUBSCRIPTION_STATUSES.has(String(upperStatus || "").toLowerCase());

	const data = {
		tier: active && normalizedTier ? normalizedTier : "free",
		subscriptionStatus: upperStatus || null,
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
