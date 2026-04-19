import { buildSubscriptionUpdate, getTierForPayPalPlanId } from "./subscription.js";

let cachedAccessToken = null;
let cachedAccessTokenExpiresAt = 0;

export function getPayPalBaseUrl() {
	const env = String(process.env.PAYPAL_ENVIRONMENT || "").trim().toLowerCase();
	if (env === "live" || env === "production") return "https://api-m.paypal.com";
	return "https://api-m.sandbox.paypal.com";
}

function getPayPalCredentials() {
	const clientId = String(process.env.PAYPAL_CLIENT_ID || "").trim();
	const clientSecret = String(process.env.PAYPAL_CLIENT_SECRET || "").trim();
	if (!clientId || !clientSecret) {
		throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET environment variable.");
	}
	return { clientId, clientSecret };
}

export function getPayPalWebhookId() {
	const webhookId = String(process.env.PAYPAL_WEBHOOK_ID || "").trim();
	if (!webhookId) {
		throw new Error("Missing PAYPAL_WEBHOOK_ID environment variable.");
	}
	return webhookId;
}

export async function getPayPalAccessToken() {
	if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt - 60_000) {
		return cachedAccessToken;
	}

	const { clientId, clientSecret } = getPayPalCredentials();
	const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

	const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${auth}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "grant_type=client_credentials",
	});

	const payload = await response.json();
	if (!response.ok || !payload?.access_token) {
		throw new Error(payload?.error_description || payload?.error || "Failed to get PayPal access token.");
	}

	cachedAccessToken = payload.access_token;
	cachedAccessTokenExpiresAt = Date.now() + Number(payload.expires_in || 0) * 1000;
	return cachedAccessToken;
}

export async function paypalRequest(path, { method = "GET", body, headers } = {}) {
	const accessToken = await getPayPalAccessToken();
	const response = await fetch(`${getPayPalBaseUrl()}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json",
			...(body ? { "Content-Type": "application/json" } : {}),
			...(headers || {}),
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	if (response.status === 204) {
		return { ok: true, status: 204, data: null };
	}

	const data = await response.json().catch(() => null);
	if (!response.ok) {
		const detail = data?.details?.[0]?.description || data?.message || data?.name;
		throw new Error(detail || `PayPal request failed (${response.status}).`);
	}

	return { ok: true, status: response.status, data };
}

export async function getPayPalSubscription(subscriptionId) {
	const response = await paypalRequest(`/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`);
	return response.data;
}

export async function verifyPayPalWebhook(headers, event) {
	const response = await paypalRequest("/v1/notifications/verify-webhook-signature", {
		method: "POST",
		body: {
			auth_algo: headers["paypal-auth-algo"],
			cert_url: headers["paypal-cert-url"],
			transmission_id: headers["paypal-transmission-id"],
			transmission_sig: headers["paypal-transmission-sig"],
			transmission_time: headers["paypal-transmission-time"],
			webhook_id: getPayPalWebhookId(),
			webhook_event: event,
		},
	});

	return response.data?.verification_status === "SUCCESS";
}

export function getPayPalSubscriptionTier(subscription) {
	const customId = String(subscription?.custom_id || "").trim().toLowerCase();
	const customTier = customId.split(":")[1] || customId;
	if (["great", "ultra", "master"].includes(customTier)) return customTier;

	const planId = subscription?.plan_id;
	return planId ? getTierForPayPalPlanId(planId) : null;
}

export function buildPayPalSubscriptionUpdate(subscription) {
	return buildSubscriptionUpdate({
		tierKey: getPayPalSubscriptionTier(subscription),
		status: subscription?.status || null,
		paypalSubscriptionId: subscription?.id ? String(subscription.id) : undefined,
		clearStripe: true,
	});
}
