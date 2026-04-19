import { prisma } from "../../_lib/db.js";
import { getSessionFromRequest, readJsonBody, readRawBody } from "../../_lib/auth.js";
import { json, methodNotAllowed } from "../../_lib/response.js";
import {
	buildPayPalSubscriptionUpdate,
	getPayPalSubscription,
	paypalRequest,
	verifyPayPalWebhook,
} from "../../_lib/paypal.js";
import {
	buildStripeSubscriptionUpdate,
	getStripeClient,
	getStripePortalConfigurationId,
	getStripeSubscriptionTier,
	getStripeWebhookSecret,
} from "../../_lib/stripe.js";
import {
	getAppOrigin,
	getPayPalPlanIdForTier,
	getStripePriceIdForTier,
	getUserPublicSelect,
	normalizeTierKey,
	serializeUser,
} from "../../_lib/subscription.js";

export const config = {
	api: {
		bodyParser: false,
	},
};

const SUBSCRIPTION_ACTIONS = {
	stripe: new Set(["create-session", "details", "portal", "verify", "webhook"]),
	paypal: new Set(["cancel", "create-subscription", "details", "verify", "webhook"]),
};

export default async function handler(req, res) {
	const provider = String(req.query?.provider || "").trim().toLowerCase();
	const action = String(req.query?.action || "").trim().toLowerCase();

	if (!SUBSCRIPTION_ACTIONS[provider]?.has(action)) {
		return json(res, 404, { error: "Not found." });
	}

	if (provider === "stripe") {
		if (action === "create-session") return handleStripeCreateSession(req, res);
		if (action === "details") return handleStripeDetails(req, res);
		if (action === "portal") return handleStripePortal(req, res);
		if (action === "verify") return handleStripeVerify(req, res);
		return handleStripeWebhook(req, res);
	}

	if (action === "cancel") return handlePayPalCancel(req, res);
	if (action === "create-subscription") return handlePayPalCreateSubscription(req, res);
	if (action === "details") return handlePayPalDetails(req, res);
	if (action === "verify") return handlePayPalVerify(req, res);
	return handlePayPalWebhook(req, res);
}

function isoFromUnixSeconds(value) {
	const seconds = Number(value || 0);
	if (!Number.isFinite(seconds) || seconds <= 0) return null;
	return new Date(seconds * 1000).toISOString();
}

function normalizeStripeDetails(subscription, user) {
	return {
		provider: "stripe",
		tier: user?.tier || getStripeSubscriptionTier(subscription) || "free",
		status: subscription?.status || user?.subscriptionStatus || null,
		renewalDate: isoFromUnixSeconds(subscription?.current_period_end),
		currentPeriodStart: isoFromUnixSeconds(subscription?.current_period_start),
		cancelAt: isoFromUnixSeconds(subscription?.cancel_at),
		canceledAt: isoFromUnixSeconds(subscription?.canceled_at),
		trialEnd: isoFromUnixSeconds(subscription?.trial_end),
		cancelAtPeriodEnd: !!subscription?.cancel_at_period_end,
		subscriptionId: subscription?.id ? String(subscription.id) : user?.stripeSubscriptionId || null,
		customerId: subscription?.customer ? String(subscription.customer) : user?.stripeCustomerId || null,
		priceId: subscription?.items?.data?.[0]?.price?.id ? String(subscription.items.data[0].price.id) : null,
		interval: subscription?.items?.data?.[0]?.price?.recurring?.interval || null,
	};
}

function normalizePayPalDetails(subscription, user) {
	return {
		provider: "paypal",
		tier: user?.tier || "free",
		status: subscription?.status || user?.subscriptionStatus || null,
		renewalDate: subscription?.billing_info?.next_billing_time || null,
		currentPeriodStart: subscription?.start_time || null,
		cancelAt: null,
		canceledAt: subscription?.status_update_time || null,
		trialEnd: null,
		cancelAtPeriodEnd: false,
		subscriptionId: subscription?.id ? String(subscription.id) : user?.paypalSubscriptionId || null,
		customerId: null,
		priceId: subscription?.plan_id ? String(subscription.plan_id) : null,
		interval: "month",
	};
}

async function handleStripeCreateSession(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = getSessionFromRequest(req);
	if (!session?.userId) return json(res, 401, { error: "Not authenticated." });

	try {
		const body = await readJsonBody(req);
		const tierKey = normalizeTierKey(body?.tier);
		if (!tierKey) return json(res, 400, { error: "Invalid subscription tier." });

		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: { id: true, email: true, stripeCustomerId: true },
		});
		if (!user) return json(res, 404, { error: "User not found." });

		const stripe = getStripeClient();
		const origin = getAppOrigin(req);
		const checkoutSession = await stripe.checkout.sessions.create({
			mode: "subscription",
			success_url: `${origin}/subscription/success?provider=stripe&tier=${encodeURIComponent(tierKey)}&session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/pricing?tier=${encodeURIComponent(tierKey)}`,
			customer: user.stripeCustomerId || undefined,
			customer_email: user.stripeCustomerId ? undefined : user.email,
			client_reference_id: String(user.id),
			line_items: [{ price: getStripePriceIdForTier(tierKey), quantity: 1 }],
			metadata: { userId: String(user.id), tier: tierKey },
			subscription_data: { metadata: { userId: String(user.id), tier: tierKey } },
			allow_promotion_codes: true,
		});

		return json(res, 200, { url: checkoutSession.url });
	} catch (error) {
		console.error("[subscriptions/stripe/create-session] error:", error);
		return json(res, 500, { error: error.message || "Failed to create Stripe checkout session." });
	}
}

async function handleStripeVerify(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = getSessionFromRequest(req);
	if (!session?.userId) return json(res, 401, { error: "Not authenticated." });

	try {
		const body = await readJsonBody(req);
		const tierKey = normalizeTierKey(body?.tier);
		const checkoutSessionId = String(body?.sessionId || "").trim();
		if (!tierKey || !checkoutSessionId) {
			return json(res, 400, { error: "Missing Stripe checkout confirmation details." });
		}

		const stripe = getStripeClient();
		const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
			expand: ["subscription"],
		});

		if (checkoutSession?.mode !== "subscription" || !checkoutSession?.subscription) {
			return json(res, 400, { error: "Stripe checkout session does not include a subscription." });
		}

		const sessionUserId = Number(checkoutSession.metadata?.userId || checkoutSession.client_reference_id || 0) || null;
		if (sessionUserId && sessionUserId !== session.userId) {
			return json(res, 403, { error: "This Stripe checkout session belongs to a different user." });
		}

		await syncStripeSubscriptionToUser({
			userId: session.userId,
			subscriptionId: String(
				typeof checkoutSession.subscription === "string"
					? checkoutSession.subscription
					: checkoutSession.subscription.id
			),
			fallbackTier: tierKey,
			customerId: checkoutSession.customer ? String(checkoutSession.customer) : null,
		});

		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: getUserPublicSelect(),
		});

		return json(res, 200, {
			ok: true,
			user: serializeUser(user),
		});
	} catch (error) {
		console.error("[subscriptions/stripe/verify] error:", error);
		return json(res, 500, { error: error.message || "Failed to verify Stripe checkout session." });
	}
}

async function handleStripePortal(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = getSessionFromRequest(req);
	if (!session?.userId) return json(res, 401, { error: "Not authenticated." });

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: { stripeCustomerId: true },
		});
		if (!user?.stripeCustomerId) {
			return json(res, 400, { error: "No Stripe billing account found for this user." });
		}

		const stripe = getStripeClient();
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: user.stripeCustomerId,
			return_url: `${getAppOrigin(req)}/pricing`,
			...(getStripePortalConfigurationId() ? { configuration: getStripePortalConfigurationId() } : {}),
		});

		return json(res, 200, { url: portalSession.url });
	} catch (error) {
		console.error("[subscriptions/stripe/portal] error:", error);
		return json(res, 500, { error: error.message || "Failed to create Stripe portal session." });
	}
}

async function handleStripeDetails(req, res) {
	if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

	const session = getSessionFromRequest(req);
	if (!session?.userId) return json(res, 401, { error: "Not authenticated." });

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: {
				tier: true,
				subscriptionStatus: true,
				stripeCustomerId: true,
				stripeSubscriptionId: true,
			},
		});
		if (!user?.stripeSubscriptionId) {
			return json(res, 200, { details: normalizeStripeDetails(null, user || null) });
		}

		const stripe = getStripeClient();
		const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
			expand: ["items.data.price"],
		});

		return json(res, 200, { details: normalizeStripeDetails(subscription, user) });
	} catch (error) {
		console.error("[subscriptions/stripe/details] error:", error);
		return json(res, 500, { error: error.message || "Failed to load Stripe subscription details." });
	}
}

async function handleStripeWebhook(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return json(res, 405, { error: "Method not allowed." });
	}

	try {
		const rawBody = await readRawBody(req);
		const stripe = getStripeClient();
		const event = stripe.webhooks.constructEvent(rawBody, req.headers["stripe-signature"], getStripeWebhookSecret());

		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object;
				if (session.mode === "subscription" && session.subscription) {
					const userId = Number(session.metadata?.userId || session.client_reference_id || 0) || null;
					await syncStripeSubscriptionToUser({
						userId,
						subscriptionId: String(session.subscription),
						fallbackTier: String(session.metadata?.tier || "").trim().toLowerCase() || null,
						customerId: session.customer ? String(session.customer) : null,
					});
				}
				break;
			}
			case "customer.subscription.created":
			case "customer.subscription.updated":
			case "customer.subscription.deleted": {
				const subscription = event.data.object;
				await prisma.user.updateMany({
					where: {
						OR: [
							{ stripeSubscriptionId: subscription.id },
							{ stripeCustomerId: String(subscription.customer) },
						],
					},
					data: buildStripeSubscriptionUpdate(subscription),
				});
				break;
			}
			default:
				break;
		}

		return json(res, 200, { received: true });
	} catch (error) {
		console.error("[subscriptions/stripe/webhook] error:", error);
		return json(res, 400, { error: error.message || "Invalid Stripe webhook." });
	}
}

async function syncStripeSubscriptionToUser({ userId, subscriptionId, fallbackTier, customerId }) {
	const stripe = getStripeClient();
	const subscription = await stripe.subscriptions.retrieve(subscriptionId);
	const update = buildStripeSubscriptionUpdate(subscription);
	if (!getStripeSubscriptionTier(subscription) && fallbackTier) update.tier = fallbackTier;
	if (customerId && !update.stripeCustomerId) update.stripeCustomerId = String(customerId);

	if (userId) {
		await prisma.user.update({ where: { id: userId }, data: update });
		return;
	}

	await prisma.user.updateMany({
		where: {
			OR: [
				{ stripeSubscriptionId: subscriptionId },
				...(customerId ? [{ stripeCustomerId: String(customerId) }] : []),
			],
		},
		data: update,
	});
}

async function handlePayPalCreateSubscription(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = getSessionFromRequest(req);
	if (!session?.userId) return json(res, 401, { error: "Not authenticated." });

	try {
		const body = await readJsonBody(req);
		const tierKey = normalizeTierKey(body?.tier);
		if (!tierKey) return json(res, 400, { error: "Invalid subscription tier." });

		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: { id: true, email: true },
		});
		if (!user) return json(res, 404, { error: "User not found." });

		const origin = getAppOrigin(req);
		const response = await paypalRequest("/v1/billing/subscriptions", {
			method: "POST",
			body: {
				plan_id: getPayPalPlanIdForTier(tierKey),
				custom_id: `${user.id}:${tierKey}`,
				subscriber: { email_address: user.email },
				application_context: {
					brand_name: "PokemonPGC",
					user_action: "SUBSCRIBE_NOW",
					return_url: `${origin}/subscription/success?provider=paypal&tier=${encodeURIComponent(tierKey)}`,
					cancel_url: `${origin}/pricing?tier=${encodeURIComponent(tierKey)}`,
				},
			},
		});

		const approveUrl = response.data?.links?.find((link) => link?.rel === "approve")?.href;
		if (!approveUrl) return json(res, 500, { error: "PayPal did not return an approval URL." });

		return json(res, 200, {
			url: approveUrl,
			subscriptionId: response.data?.id || null,
		});
	} catch (error) {
		console.error("[subscriptions/paypal/create-subscription] error:", error);
		return json(res, 500, { error: error.message || "Failed to create PayPal subscription." });
	}
}

async function handlePayPalVerify(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = getSessionFromRequest(req);
	if (!session?.userId) return json(res, 401, { error: "Not authenticated." });

	try {
		const body = await readJsonBody(req);
		const tierKey = normalizeTierKey(body?.tier);
		const subscriptionId = String(body?.subscriptionId || "").trim();
		if (!tierKey || !subscriptionId) {
			return json(res, 400, { error: "Missing PayPal subscription verification details." });
		}

		const subscription = await getPayPalSubscription(subscriptionId);
		if (subscription?.plan_id !== getPayPalPlanIdForTier(tierKey)) {
			return json(res, 400, { error: "PayPal subscription plan does not match the selected tier." });
		}

		await prisma.user.update({
			where: { id: session.userId },
			data: buildPayPalSubscriptionUpdate(subscription),
		});

		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: getUserPublicSelect(),
		});

		return json(res, 200, {
			ok: true,
			subscriptionStatus: subscription?.status || null,
			user: serializeUser(user),
		});
	} catch (error) {
		console.error("[subscriptions/paypal/verify] error:", error);
		return json(res, 500, { error: error.message || "Failed to verify PayPal subscription." });
	}
}

async function handlePayPalDetails(req, res) {
	if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

	const session = getSessionFromRequest(req);
	if (!session?.userId) return json(res, 401, { error: "Not authenticated." });

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: {
				tier: true,
				subscriptionStatus: true,
				paypalSubscriptionId: true,
			},
		});
		if (!user?.paypalSubscriptionId) {
			return json(res, 200, { details: normalizePayPalDetails(null, user || null) });
		}

		const subscription = await getPayPalSubscription(user.paypalSubscriptionId);
		return json(res, 200, { details: normalizePayPalDetails(subscription, user) });
	} catch (error) {
		console.error("[subscriptions/paypal/details] error:", error);
		return json(res, 500, { error: error.message || "Failed to load PayPal subscription details." });
	}
}

async function handlePayPalWebhook(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return json(res, 405, { error: "Method not allowed." });
	}

	try {
		const rawBody = await readRawBody(req);
		const event = rawBody ? JSON.parse(rawBody) : {};
		const isValid = await verifyPayPalWebhook(req.headers, event);
		if (!isValid) return json(res, 400, { error: "Invalid PayPal webhook signature." });

		const subscriptionId = String(event?.resource?.id || event?.resource?.billing_agreement_id || "").trim();
		if (subscriptionId) await syncPayPalSubscription(subscriptionId);

		return json(res, 200, { received: true });
	} catch (error) {
		console.error("[subscriptions/paypal/webhook] error:", error);
		return json(res, 400, { error: error.message || "Invalid PayPal webhook." });
	}
}

function parseUserIdFromCustomId(customId) {
	const raw = String(customId || "").trim();
	if (!raw) return null;
	const [id] = raw.split(":");
	const parsed = Number(id);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function syncPayPalSubscription(subscriptionId) {
	const subscription = await getPayPalSubscription(subscriptionId);
	const userId = parseUserIdFromCustomId(subscription?.custom_id);
	const data = buildPayPalSubscriptionUpdate(subscription);

	if (userId) {
		await prisma.user.update({ where: { id: userId }, data });
		return;
	}

	await prisma.user.updateMany({
		where: { paypalSubscriptionId: String(subscription.id) },
		data,
	});
}

async function handlePayPalCancel(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = getSessionFromRequest(req);
	if (!session?.userId) return json(res, 401, { error: "Not authenticated." });

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: { paypalSubscriptionId: true },
		});
		if (!user?.paypalSubscriptionId) {
			return json(res, 400, { error: "No PayPal subscription found for this user." });
		}

		await paypalRequest(`/v1/billing/subscriptions/${encodeURIComponent(user.paypalSubscriptionId)}/cancel`, {
			method: "POST",
			body: { reason: "Canceled by customer from PokemonPGC pricing page." },
		});

		await prisma.user.update({
			where: { id: session.userId },
			data: {
				tier: "free",
				subscriptionStatus: "CANCELLED",
				paypalSubscriptionId: null,
			},
		});

		const updatedUser = await prisma.user.findUnique({
			where: { id: session.userId },
			select: getUserPublicSelect(),
		});

		return json(res, 200, { ok: true, user: serializeUser(updatedUser) });
	} catch (error) {
		console.error("[subscriptions/paypal/cancel] error:", error);
		return json(res, 500, { error: error.message || "Failed to cancel PayPal subscription." });
	}
}
