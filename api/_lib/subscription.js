/**
 * Shared subscription policy and public-user serialization.
 * Provider status plus server-configured Price/Plan mapping is authoritative;
 * browser-supplied tier strings never grant entitlement by themselves.
 */
import { json } from "./response.js";
export { getAppOrigin, normalizeAppOrigin } from "./appOrigin.js";

export const SUBSCRIPTION_TIERS = ["great", "ultra", "master"];
export const PURCHASABLE_SUBSCRIPTION_TIERS = ["great", "ultra"];
export const STRIPE_ENTITLED_STATUSES = new Set(["active", "trialing"]);
export const PAYPAL_ENTITLED_STATUSES = new Set(["ACTIVE"]);

const ACCOUNT_TIER_ICONS = {
	free: "default",
	great: "great",
	ultra: "ultra",
	master: "master",
};

const ACCOUNT_TIER_ORDER = ["free", ...SUBSCRIPTION_TIERS];

function envKey(prefix, tierKey) {
	return `${prefix}_${String(tierKey || "").toUpperCase()}`;
}

export function normalizeTierKey(value) {
	const tierKey = String(value || "")
		.trim()
		.toLowerCase();
	return SUBSCRIPTION_TIERS.includes(tierKey) ? tierKey : null;
}

export function getSubscriptionTierRank(value) {
	return ACCOUNT_TIER_ORDER.indexOf(
		String(value || "")
			.trim()
			.toLowerCase(),
	);
}

export function getTierIcon(value) {
	return (
		ACCOUNT_TIER_ICONS[
			String(value || "")
				.trim()
				.toLowerCase()
		] || null
	);
}

/**
 * Keeps tier-managed account icons synchronized without overwriting an uploaded
 * icon or another explicit choice. The previous tier icon is treated as managed
 * so a later upgrade, downgrade, or cancellation can continue following rank.
 */
export function getAutomaticTierIconUpdate({
	currentIcon,
	currentTier,
	nextTier,
}) {
	const nextIcon = getTierIcon(nextTier);
	if (!nextIcon) return undefined;

	const normalizedCurrentIcon =
		String(currentIcon || "default").trim() || "default";
	const previousTierIcon = getTierIcon(currentTier) || "default";
	if (
		normalizedCurrentIcon !== "default" &&
		normalizedCurrentIcon !== previousTierIcon
	) {
		return undefined;
	}

	return nextIcon;
}

/** New checkout is limited separately from provider reconciliation. */
export function isPurchasableSubscriptionTier(value) {
	const tierKey = normalizeTierKey(value);
	return PURCHASABLE_SUBSCRIPTION_TIERS.includes(tierKey);
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
	const normalizedProvider = String(provider || "")
		.trim()
		.toLowerCase();
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
		const configured = String(
			process.env[envKey("STRIPE_PRICE", tierKey)] || "",
		).trim();
		if (configured && configured === priceId) return tierKey;
	}
	return null;
}

export function getTierForPayPalPlanId(planId) {
	for (const tierKey of SUBSCRIPTION_TIERS) {
		const configured = String(
			process.env[envKey("PAYPAL_PLAN", tierKey)] || "",
		).trim();
		if (configured && configured === planId) return tierKey;
	}
	return null;
}

/** Returns the highest active complimentary grant, failing closed on bad data. */
export function getActiveTierGrant(user, now = new Date()) {
	const nowMs = new Date(now).getTime();
	if (!Number.isFinite(nowMs)) return null;

	let activeGrant = null;
	for (const grant of Array.isArray(user?.tierGrants)
		? user.tierGrants
		: []) {
		if (grant?.revokedAt) continue;
		const tier = normalizeTierKey(grant?.tier);
		if (!tier) continue;
		const expiresAt = grant?.expiresAt ? new Date(grant.expiresAt) : null;
		if (expiresAt && !Number.isFinite(expiresAt.getTime())) continue;
		if (expiresAt && expiresAt.getTime() <= nowMs) continue;

		if (
			!activeGrant ||
			getSubscriptionTierRank(tier) >
				getSubscriptionTierRank(activeGrant.tier)
		) {
			activeGrant = { tier, expiresAt };
		}
	}

	return activeGrant;
}

/** Resolves provider-backed and complimentary access without merging sources. */
export function getEffectiveAccountTier(user, now = new Date()) {
	const providerTier = ACCOUNT_TIER_ORDER.includes(user?.tier)
		? user.tier
		: "free";
	const grant = getActiveTierGrant(user, now);
	return grant &&
		getSubscriptionTierRank(grant.tier) >
			getSubscriptionTierRank(providerTier)
		? grant.tier
		: providerTier;
}

export function serializeUser(user) {
	if (!user) return null;

	const subscriptionProvider = user.stripeSubscriptionId
		? "stripe"
		: user.paypalSubscriptionId
			? "paypal"
			: null;
	const complimentaryAccess = getActiveTierGrant(user);

	return {
		id: user.id,
		email: user.email,
		icon: user.icon,
		tier: getEffectiveAccountTier(user),
		subscriptionStatus: user.subscriptionStatus || null,
		subscriptionProvider,
		complimentaryAccess: complimentaryAccess
			? {
					tier: complimentaryAccess.tier,
					expiresAt: complimentaryAccess.expiresAt
						? complimentaryAccess.expiresAt.toISOString()
						: null,
				}
			: null,
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
		tierGrants: {
			where: {
				revokedAt: null,
				OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
			},
			select: {
				tier: true,
				expiresAt: true,
				revokedAt: true,
			},
		},
	};
}

/**
 * Builds the only supported account-level billing state transition. Non-entitled
 * provider states always collapse the effective tier to free; optional clear
 * flags enforce the one-active-provider invariant.
 */
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
	if (stripeCustomerId !== undefined)
		data.stripeCustomerId = stripeCustomerId;
	if (stripeSubscriptionId !== undefined)
		data.stripeSubscriptionId = stripeSubscriptionId;
	if (paypalSubscriptionId !== undefined)
		data.paypalSubscriptionId = paypalSubscriptionId;

	return data;
}

export function requireAuthenticatedUserId(session, res) {
	if (!session?.userId) {
		json(res, 401, { error: "Not authenticated." });
		return null;
	}
	return session.userId;
}
