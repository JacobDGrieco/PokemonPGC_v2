/**
 * Stripe and PayPal subscription command/webhook boundary.
 * Provider ownership, configured Price/Plan, and current status are rechecked
 * before account entitlement changes; conflicting active providers fail closed.
 */
import crypto from "crypto";
import { prisma } from "../../_lib/db.js";
import {
	getSessionFromRequest,
	readJsonBody,
	readRawBody,
} from "../../_lib/auth.js";
import {
	json,
	methodNotAllowed,
	tooManyRequests,
} from "../../_lib/response.js";
import {
	buildPayPalSubscriptionUpdate,
	getPayPalSubscriptionBinding,
	getPayPalSubscription,
	paypalRequest,
	validatePayPalSubscriptionBinding,
	verifyPayPalWebhook,
} from "../../_lib/paypal.js";
import {
	buildStripeDowngradePhases,
	buildStripeSubscriptionUpdate,
	getStripeClient,
	getStripeHostedInvoiceUrl,
	getStripePendingChange,
	getStripePortalConfigurationId,
	getStripeScheduledTier,
	getStripeSubscriptionOwnerId,
	getStripeSubscriptionPeriod,
	getStripeSubscriptionTier,
	getStripeWebhookSecret,
	isPokemonPgcStripeSchedule,
	PPGC_STRIPE_SCHEDULE_METADATA_KEY,
	PPGC_STRIPE_SCHEDULE_METADATA_VALUE,
	validateStripeCheckoutBinding,
} from "../../_lib/stripe.js";
import {
	getAutomaticTierIconUpdate,
	getAppOrigin,
	getPayPalPlanIdForTier,
	getStripePriceIdForTier,
	getSubscriptionTierRank,
	getUserPublicSelect,
	isEntitledSubscriptionStatus,
	isPurchasableSubscriptionTier,
	normalizeTierKey,
	serializeUser,
} from "../../_lib/subscription.js";
import { checkRateLimit, getRequestIp } from "../../_lib/rateLimit.js";
import {
	recordProcessedProviderEvent,
	wasProviderEventProcessed,
} from "../../_lib/providerEvents.js";

export const config = {
	api: {
		bodyParser: false,
	},
};

const SUBSCRIPTION_ACTIONS = {
	stripe: new Set([
		"change-plan",
		"create-session",
		"details",
		"portal",
		"verify",
		"webhook",
	]),
	paypal: new Set([
		"cancel",
		"create-subscription",
		"details",
		"verify",
		"webhook",
	]),
};

const PAYPAL_SUBSCRIPTION_EVENT_TYPES = new Set([
	"BILLING.SUBSCRIPTION.CREATED",
	"BILLING.SUBSCRIPTION.ACTIVATED",
	"BILLING.SUBSCRIPTION.UPDATED",
	"BILLING.SUBSCRIPTION.EXPIRED",
	"BILLING.SUBSCRIPTION.CANCELLED",
	"BILLING.SUBSCRIPTION.SUSPENDED",
	"BILLING.SUBSCRIPTION.PAYMENT.FAILED",
	"PAYMENT.SALE.COMPLETED",
	"PAYMENT.SALE.REFUNDED",
	"PAYMENT.SALE.REVERSED",
]);

function getIdempotencyKey(req, scope) {
	const supplied = String(req.headers?.["idempotency-key"] || "").trim();
	const token = /^[A-Za-z0-9._:-]{16,48}$/.test(supplied)
		? supplied
		: crypto.randomUUID();
	// PayPal caps request IDs at 38 characters. Hashing preserves stable retry
	// behavior for both providers without leaking account or tier identifiers.
	const digest = crypto
		.createHash("sha256")
		.update(`${scope}:${token}`)
		.digest("hex")
		.slice(0, 32);
	return `ppgc-${digest}`;
}

function enforceBillingRateLimit(req, res, scope, userId, max = 12) {
	const key = `${userId || "anonymous"}:${getRequestIp(req)}`;
	const limit = checkRateLimit(`billing-${scope}`, key, {
		windowMs: 10 * 60 * 1000,
		max,
	});
	if (limit.ok) return true;
	tooManyRequests(
		res,
		{
			error: "Too many billing requests. Please wait and try again.",
		},
		limit.retryAfterSeconds,
	);
	return false;
}

function publicProviderError(res, message) {
	return json(res, 500, { error: message });
}

function getProviderEventOutcome(syncResult, fallback = "ignored") {
	if (syncResult?.updated) return "updated";
	return String(syncResult?.reason || fallback);
}

function hasConflictingEntitledProvider(user, incomingProvider) {
	if (incomingProvider === "stripe" && user?.paypalSubscriptionId) {
		return isEntitledSubscriptionStatus("paypal", user.subscriptionStatus);
	}
	if (incomingProvider === "paypal" && user?.stripeSubscriptionId) {
		return isEntitledSubscriptionStatus("stripe", user.subscriptionStatus);
	}
	return false;
}

function hasConflictingEntitledSubscription(
	user,
	provider,
	incomingSubscriptionId,
) {
	const currentId =
		provider === "stripe"
			? user?.stripeSubscriptionId
			: user?.paypalSubscriptionId;
	return (
		!!currentId &&
		currentId !== incomingSubscriptionId &&
		isEntitledSubscriptionStatus(provider, user?.subscriptionStatus)
	);
}

function getBillingUserSelect() {
	return {
		id: true,
		icon: true,
		tier: true,
		subscriptionStatus: true,
		stripeCustomerId: true,
		stripeSubscriptionId: true,
		paypalSubscriptionId: true,
	};
}

export default async function handler(req, res) {
	const provider = String(req.query?.provider || "")
		.trim()
		.toLowerCase();
	const action = String(req.query?.action || "")
		.trim()
		.toLowerCase();

	if (!SUBSCRIPTION_ACTIONS[provider]?.has(action)) {
		return json(res, 404, { error: "Not found." });
	}

	if (provider === "stripe") {
		if (action === "change-plan") return handleStripeChangePlan(req, res);
		if (action === "create-session")
			return handleStripeCreateSession(req, res);
		if (action === "details") return handleStripeDetails(req, res);
		if (action === "portal") return handleStripePortal(req, res);
		if (action === "verify") return handleStripeVerify(req, res);
		return handleStripeWebhook(req, res);
	}

	if (action === "cancel") return handlePayPalCancel(req, res);
	if (action === "create-subscription")
		return handlePayPalCreateSubscription(req, res);
	if (action === "details") return handlePayPalDetails(req, res);
	if (action === "verify") return handlePayPalVerify(req, res);
	return handlePayPalWebhook(req, res);
}

function isoFromUnixSeconds(value) {
	const seconds = Number(value || 0);
	if (!Number.isFinite(seconds) || seconds <= 0) return null;
	return new Date(seconds * 1000).toISOString();
}

function normalizeStripeDetails(subscription, user, schedule = null) {
	const period = getStripeSubscriptionPeriod(subscription);
	const pendingChange = getStripePendingChange(subscription, schedule);
	return {
		provider: "stripe",
		tier: user?.tier || getStripeSubscriptionTier(subscription) || "free",
		status: subscription?.status || user?.subscriptionStatus || null,
		renewalDate: isoFromUnixSeconds(period.currentPeriodEnd),
		currentPeriodStart: isoFromUnixSeconds(period.currentPeriodStart),
		pendingTier: pendingChange?.tierKey || null,
		pendingChangeDate: isoFromUnixSeconds(pendingChange?.effectiveAt),
		cancelAt: isoFromUnixSeconds(subscription?.cancel_at),
		canceledAt: isoFromUnixSeconds(subscription?.canceled_at),
		trialEnd: isoFromUnixSeconds(subscription?.trial_end),
		cancelAtPeriodEnd: !!subscription?.cancel_at_period_end,
		subscriptionId: subscription?.id
			? String(subscription.id)
			: user?.stripeSubscriptionId || null,
		customerId: subscription?.customer
			? String(subscription.customer)
			: user?.stripeCustomerId || null,
		priceId: subscription?.items?.data?.[0]?.price?.id
			? String(subscription.items.data[0].price.id)
			: null,
		interval:
			subscription?.items?.data?.[0]?.price?.recurring?.interval || null,
	};
}

function getStripeScheduleId(subscription) {
	if (typeof subscription?.schedule === "string") {
		return subscription.schedule;
	}
	return subscription?.schedule?.id ? String(subscription.schedule.id) : null;
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
		subscriptionId: subscription?.id
			? String(subscription.id)
			: user?.paypalSubscriptionId || null,
		customerId: null,
		priceId: subscription?.plan_id ? String(subscription.plan_id) : null,
		interval: "month",
	};
}

async function handleStripeChangePlan(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = await getSessionFromRequest(req);
	if (!session?.userId)
		return json(res, 401, { error: "Not authenticated." });
	if (
		!enforceBillingRateLimit(
			req,
			res,
			"stripe-change-plan",
			session.userId,
			8,
		)
	)
		return;

	try {
		const body = await readJsonBody(req);
		const requestedTier = String(body?.tier || "")
			.trim()
			.toLowerCase();
		const targetTier =
			requestedTier === "free" ? "free" : normalizeTierKey(requestedTier);
		if (
			!targetTier ||
			(targetTier !== "free" &&
				!isPurchasableSubscriptionTier(targetTier))
		) {
			return json(res, 400, {
				error: "Select an available subscription tier.",
			});
		}

		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: getBillingUserSelect(),
		});
		if (!user?.stripeSubscriptionId) {
			return json(res, 409, {
				error: "No active Stripe subscription was found.",
			});
		}
		if (!isEntitledSubscriptionStatus("stripe", user.subscriptionStatus)) {
			return json(res, 409, {
				error: "The Stripe subscription is not currently active.",
			});
		}

		const stripe = getStripeClient();
		let subscription = await stripe.subscriptions.retrieve(
			user.stripeSubscriptionId,
			{ expand: ["items.data.price"] },
		);
		const currentTier = getStripeSubscriptionTier(subscription);
		const ownerId = getStripeSubscriptionOwnerId(subscription);
		const subscriptionItem = subscription?.items?.data?.[0];
		if (
			ownerId !== user.id ||
			!currentTier ||
			!subscriptionItem?.id ||
			subscription.items.data.length !== 1
		) {
			return json(res, 409, {
				error: "Stripe subscription ownership or plan could not be verified.",
			});
		}
		const scheduleId = getStripeScheduleId(subscription);
		let schedule = scheduleId
			? await stripe.subscriptionSchedules.retrieve(scheduleId, {
					expand: ["phases.items.price"],
				})
			: null;
		if (schedule && !isPokemonPgcStripeSchedule(schedule, user.id)) {
			return json(res, 409, {
				error: "This subscription already has an externally managed plan schedule.",
			});
		}

		const currentRank = getSubscriptionTierRank(currentTier);
		const targetRank = getSubscriptionTierRank(targetTier);
		if (targetTier === currentTier) {
			if (subscription.cancel_at_period_end) {
				subscription = await stripe.subscriptions.update(
					subscription.id,
					{
						cancel_at_period_end: false,
						expand: ["items.data.price"],
					},
					{
						idempotencyKey: getIdempotencyKey(
							req,
							`stripe-resume:${user.id}:${subscription.id}`,
						),
					},
				);
			} else if (schedule && getStripeScheduledTier(schedule)) {
				await stripe.subscriptionSchedules.release(
					schedule.id,
					{ preserve_cancel_date: false },
					{
						idempotencyKey: getIdempotencyKey(
							req,
							`stripe-release-schedule:${user.id}:${schedule.id}`,
						),
					},
				);
				subscription = await stripe.subscriptions.retrieve(
					subscription.id,
					{ expand: ["items.data.price"] },
				);
			} else {
				return json(res, 409, {
					error: "This is already the current plan.",
				});
			}
			await syncStripeSubscriptionToUser({
				userId: user.id,
				subscription,
				requireMetadataOwner: true,
			});
			const updatedUser = await prisma.user.findUnique({
				where: { id: user.id },
				select: getUserPublicSelect(),
			});
			return json(res, 200, {
				ok: true,
				changeType: "scheduled-change-canceled",
				user: serializeUser(updatedUser),
				details: normalizeStripeDetails(subscription, updatedUser),
			});
		}
		if (subscription.cancel_at_period_end || subscription.cancel_at) {
			return json(res, 409, {
				error: "Remove the pending cancellation in Stripe before changing plans.",
			});
		}

		if (targetTier === "free") {
			if (schedule) {
				await stripe.subscriptionSchedules.release(
					schedule.id,
					{ preserve_cancel_date: false },
					{
						idempotencyKey: getIdempotencyKey(
							req,
							`stripe-release-for-cancel:${user.id}:${schedule.id}`,
						),
					},
				);
			}
			subscription = await stripe.subscriptions.update(
				subscription.id,
				{
					cancel_at_period_end: true,
					expand: ["items.data.price"],
				},
				{
					idempotencyKey: getIdempotencyKey(
						req,
						`stripe-schedule-free:${user.id}:${subscription.id}`,
					),
				},
			);
			const publicUser = await prisma.user.findUnique({
				where: { id: user.id },
				select: getUserPublicSelect(),
			});
			return json(res, 200, {
				ok: true,
				changeType: "scheduled-downgrade",
				user: serializeUser(publicUser),
				details: normalizeStripeDetails(subscription, publicUser),
			});
		}

		if (targetRank < currentRank) {
			const targetPrice = await stripe.prices.retrieve(
				getStripePriceIdForTier(targetTier),
			);
			let createdSchedule = false;
			if (!schedule) {
				schedule = await stripe.subscriptionSchedules.create(
					{ from_subscription: subscription.id },
					{
						idempotencyKey: getIdempotencyKey(
							req,
							`stripe-create-schedule:${user.id}:${subscription.id}`,
						),
					},
				);
				createdSchedule = true;
				schedule = await stripe.subscriptionSchedules.retrieve(
					schedule.id,
					{ expand: ["phases.items.price"] },
				);
			}

			try {
				schedule = await stripe.subscriptionSchedules.update(
					schedule.id,
					{
						end_behavior: "release",
						metadata: {
							[PPGC_STRIPE_SCHEDULE_METADATA_KEY]:
								PPGC_STRIPE_SCHEDULE_METADATA_VALUE,
							userId: String(user.id),
							targetTier,
						},
						phases: buildStripeDowngradePhases({
							schedule,
							subscription,
							targetPrice,
							userId: user.id,
							currentTier,
							targetTier,
						}),
						proration_behavior: "none",
					},
					{
						idempotencyKey: getIdempotencyKey(
							req,
							`stripe-update-schedule:${user.id}:${targetTier}`,
						),
					},
				);
			} catch (error) {
				if (createdSchedule) {
					await stripe.subscriptionSchedules
						.release(schedule.id, { preserve_cancel_date: false })
						.catch((releaseError) =>
							console.error(
								"[subscriptions/stripe/change-plan] schedule cleanup failed:",
								releaseError,
							),
						);
				}
				throw error;
			}

			const publicUser = await prisma.user.findUnique({
				where: { id: user.id },
				select: getUserPublicSelect(),
			});
			return json(res, 200, {
				ok: true,
				changeType: "scheduled-downgrade",
				user: serializeUser(publicUser),
				details: normalizeStripeDetails(
					subscription,
					publicUser,
					schedule,
				),
			});
		}

		if (schedule) {
			await stripe.subscriptionSchedules.release(schedule.id, {
				preserve_cancel_date: false,
			});
		}
		let updatedSubscription = await stripe.subscriptions.update(
			subscription.id,
			{
				items: [
					{
						id: subscriptionItem.id,
						price: getStripePriceIdForTier(targetTier),
						quantity: 1,
					},
				],
				payment_behavior: "pending_if_incomplete",
				proration_behavior: "always_invoice",
				expand: ["items.data.price", "latest_invoice"],
			},
			{
				idempotencyKey: getIdempotencyKey(
					req,
					`stripe-upgrade:${user.id}:${targetTier}`,
				),
			},
		);

		if (updatedSubscription.pending_update) {
			const hostedInvoiceUrl =
				getStripeHostedInvoiceUrl(updatedSubscription);
			if (hostedInvoiceUrl) {
				return json(res, 200, {
					ok: true,
					changeType: "payment-action-required",
					url: hostedInvoiceUrl,
				});
			}

			// A finalized invoice normally has a hosted URL. Keep the portal as
			// a safe fallback for asynchronous payment methods or provider delay.
			const portalSession = await stripe.billingPortal.sessions.create({
				customer: user.stripeCustomerId,
				return_url: `${getAppOrigin(req)}/pricing`,
			});
			return json(res, 200, {
				ok: true,
				changeType: "payment-action-required",
				url: portalSession.url,
			});
		}

		// Update metadata only after the paid price update succeeds so strict
		// price/metadata reconciliation never grants an unpaid tier.
		updatedSubscription = await stripe.subscriptions.update(
			updatedSubscription.id,
			{
				metadata: {
					...(updatedSubscription.metadata || {}),
					userId: String(user.id),
					tier: targetTier,
				},
				expand: ["items.data.price"],
			},
			{
				idempotencyKey: getIdempotencyKey(
					req,
					`stripe-upgrade-metadata:${user.id}:${targetTier}`,
				),
			},
		);
		await syncStripeSubscriptionToUser({
			userId: user.id,
			subscription: updatedSubscription,
			requireMetadataOwner: true,
		});
		const updatedUser = await prisma.user.findUnique({
			where: { id: user.id },
			select: getUserPublicSelect(),
		});
		return json(res, 200, {
			ok: true,
			changeType: "immediate-upgrade",
			user: serializeUser(updatedUser),
			details: normalizeStripeDetails(updatedSubscription, updatedUser),
		});
	} catch (error) {
		console.error("[subscriptions/stripe/change-plan] error:", error);
		return publicProviderError(res, "Failed to change the Stripe plan.");
	}
}

async function handleStripeCreateSession(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = await getSessionFromRequest(req);
	if (!session?.userId)
		return json(res, 401, { error: "Not authenticated." });
	if (!enforceBillingRateLimit(req, res, "stripe-checkout", session.userId))
		return;

	try {
		const body = await readJsonBody(req);
		const tierKey = normalizeTierKey(body?.tier);
		if (!tierKey)
			return json(res, 400, { error: "Invalid subscription tier." });
		if (!isPurchasableSubscriptionTier(tierKey)) {
			return json(res, 409, {
				error: "This subscription option is not available yet.",
			});
		}

		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: { email: true, ...getBillingUserSelect() },
		});
		if (!user) return json(res, 404, { error: "User not found." });
		if (hasConflictingEntitledProvider(user, "stripe")) {
			return json(res, 409, {
				error: "Cancel the active PayPal subscription before starting Stripe billing.",
			});
		}
		if (
			user.stripeSubscriptionId &&
			isEntitledSubscriptionStatus("stripe", user.subscriptionStatus)
		) {
			return json(res, 409, {
				error: "Use the billing portal to manage the active Stripe subscription.",
			});
		}

		const stripe = getStripeClient();
		const origin = getAppOrigin(req);
		// Leave payment_method_types unset so Stripe Checkout can present the
		// recurring-compatible methods enabled for this account and customer.
		const checkoutSession = await stripe.checkout.sessions.create(
			{
				mode: "subscription",
				success_url: `${origin}/subscription/success?provider=stripe&tier=${encodeURIComponent(tierKey)}&session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${origin}/pricing?tier=${encodeURIComponent(tierKey)}`,
				customer: user.stripeCustomerId || undefined,
				customer_email: user.stripeCustomerId ? undefined : user.email,
				client_reference_id: String(user.id),
				line_items: [
					{ price: getStripePriceIdForTier(tierKey), quantity: 1 },
				],
				metadata: { userId: String(user.id), tier: tierKey },
				subscription_data: {
					metadata: { userId: String(user.id), tier: tierKey },
				},
				allow_promotion_codes: true,
			},
			{
				idempotencyKey: getIdempotencyKey(
					req,
					`stripe-checkout:${user.id}:${tierKey}`,
				),
			},
		);

		return json(res, 200, { url: checkoutSession.url });
	} catch (error) {
		console.error("[subscriptions/stripe/create-session] error:", error);
		return publicProviderError(
			res,
			"Failed to create Stripe checkout session.",
		);
	}
}

async function handleStripeVerify(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = await getSessionFromRequest(req);
	if (!session?.userId)
		return json(res, 401, { error: "Not authenticated." });
	if (!enforceBillingRateLimit(req, res, "stripe-verify", session.userId, 20))
		return;

	try {
		const body = await readJsonBody(req);
		const tierKey = body?.tier ? normalizeTierKey(body.tier) : null;
		const checkoutSessionId = String(body?.sessionId || "").trim();
		if (!checkoutSessionId || (body?.tier && !tierKey)) {
			return json(res, 400, {
				error: "Missing Stripe checkout confirmation details.",
			});
		}

		const stripe = getStripeClient();
		const checkoutSession = await stripe.checkout.sessions.retrieve(
			checkoutSessionId,
			{
				expand: ["subscription", "subscription.items.data.price"],
			},
		);

		if (
			checkoutSession?.mode !== "subscription" ||
			!checkoutSession?.subscription
		) {
			return json(res, 400, {
				error: "Stripe checkout session does not include a subscription.",
			});
		}

		const subscription =
			typeof checkoutSession.subscription === "string"
				? await stripe.subscriptions.retrieve(
						checkoutSession.subscription,
						{ expand: ["items.data.price"] },
					)
				: checkoutSession.subscription;
		const binding = validateStripeCheckoutBinding({
			checkoutSession,
			subscription,
			expectedUserId: session.userId,
			expectedTier: tierKey,
		});
		if (!binding.ok) return json(res, 403, { error: binding.error });

		await syncStripeSubscriptionToUser({
			userId: session.userId,
			subscription,
			requireMetadataOwner: true,
		});

		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: getUserPublicSelect(),
		});

		const isEntitled = isEntitledSubscriptionStatus(
			"stripe",
			subscription.status,
		);
		if (!isEntitled) {
			return json(res, 409, {
				error: "Stripe has not activated this subscription yet.",
				confirmed: false,
				user: serializeUser(user),
			});
		}
		return json(res, 200, {
			ok: true,
			confirmed: true,
			user: serializeUser(user),
		});
	} catch (error) {
		console.error("[subscriptions/stripe/verify] error:", error);
		return publicProviderError(
			res,
			"Failed to verify Stripe checkout session.",
		);
	}
}

async function handleStripePortal(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = await getSessionFromRequest(req);
	if (!session?.userId)
		return json(res, 401, { error: "Not authenticated." });
	if (!enforceBillingRateLimit(req, res, "stripe-portal", session.userId, 20))
		return;

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: { stripeCustomerId: true },
		});
		if (!user?.stripeCustomerId) {
			return json(res, 400, {
				error: "No Stripe billing account found for this user.",
			});
		}

		const stripe = getStripeClient();
		const portalSession = await stripe.billingPortal.sessions.create(
			{
				customer: user.stripeCustomerId,
				return_url: `${getAppOrigin(req)}/pricing`,
				...(getStripePortalConfigurationId()
					? { configuration: getStripePortalConfigurationId() }
					: {}),
			},
			{
				idempotencyKey: getIdempotencyKey(
					req,
					`stripe-portal:${session.userId}`,
				),
			},
		);

		return json(res, 200, { url: portalSession.url });
	} catch (error) {
		console.error("[subscriptions/stripe/portal] error:", error);
		return publicProviderError(
			res,
			"Failed to create Stripe portal session.",
		);
	}
}

async function handleStripeDetails(req, res) {
	if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

	const session = await getSessionFromRequest(req);
	if (!session?.userId)
		return json(res, 401, { error: "Not authenticated." });

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
			return json(res, 200, {
				details: normalizeStripeDetails(null, user || null),
			});
		}

		const stripe = getStripeClient();
		const subscription = await stripe.subscriptions.retrieve(
			user.stripeSubscriptionId,
			{
				expand: ["items.data.price"],
			},
		);
		const scheduleId = getStripeScheduleId(subscription);
		const schedule = scheduleId
			? await stripe.subscriptionSchedules.retrieve(scheduleId, {
					expand: ["phases.items.price"],
				})
			: null;

		return json(res, 200, {
			details: normalizeStripeDetails(subscription, user, schedule),
		});
	} catch (error) {
		console.error("[subscriptions/stripe/details] error:", error);
		return publicProviderError(
			res,
			"Failed to load Stripe subscription details.",
		);
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
		const event = stripe.webhooks.constructEvent(
			rawBody,
			req.headers["stripe-signature"],
			getStripeWebhookSecret(),
		);
		const eventId = String(event?.id || "").trim();
		if (!eventId) throw new Error("Stripe event ID is missing.");
		if (await wasProviderEventProcessed("stripe", eventId)) {
			return json(res, 200, { received: true, duplicate: true });
		}

		let syncResult = { updated: false, reason: "ignored" };

		switch (event.type) {
			case "checkout.session.completed": {
				const checkoutSession = event.data.object;
				if (
					checkoutSession.mode === "subscription" &&
					checkoutSession.subscription
				) {
					const userId = getStripeSubscriptionOwnerId({
						metadata: checkoutSession.metadata,
					});
					const subscriptionId =
						typeof checkoutSession.subscription === "string"
							? checkoutSession.subscription
							: checkoutSession.subscription.id;
					syncResult = await syncStripeSubscriptionToUser({
						userId,
						subscriptionId: String(subscriptionId || ""),
						requireMetadataOwner: true,
					});
				}
				break;
			}
			case "customer.subscription.created":
			case "customer.subscription.updated":
			case "customer.subscription.deleted": {
				syncResult = await syncStripeSubscriptionToUser({
					subscriptionId: String(event.data.object.id),
				});
				break;
			}
			default:
				break;
		}

		const receipt = await recordProcessedProviderEvent({
			provider: "stripe",
			eventId,
			eventType: event.type,
			objectId: event?.data?.object?.id,
			outcome: getProviderEventOutcome(syncResult),
			occurredAt:
				Number(event.created) > 0
					? new Date(Number(event.created) * 1000)
					: null,
		});

		return json(res, 200, {
			received: true,
			duplicate: receipt.duplicate,
		});
	} catch (error) {
		console.error("[subscriptions/stripe/webhook] error:", error);
		const isInvalidSignature =
			error?.type === "StripeSignatureVerificationError";
		return json(res, isInvalidSignature ? 400 : 500, {
			error: isInvalidSignature
				? "Invalid Stripe webhook."
				: "Stripe webhook processing failed.",
		});
	}
}

/**
 * Reconciles current Stripe state. Existing bindings may predate metadata, but
 * first-time/browser bindings must contain the server-written owner metadata.
 */
async function syncStripeSubscriptionToUser({
	userId,
	subscriptionId,
	subscription: suppliedSubscription,
	requireMetadataOwner = false,
}) {
	const stripe = getStripeClient();
	const subscription =
		suppliedSubscription ||
		(await stripe.subscriptions.retrieve(subscriptionId, {
			expand: ["items.data.price"],
		}));
	const resolvedSubscriptionId = String(
		subscription?.id || subscriptionId || "",
	).trim();
	const metadataOwnerId = getStripeSubscriptionOwnerId(subscription);
	const providerTier = getStripeSubscriptionTier(subscription);
	if (!resolvedSubscriptionId || !providerTier) {
		throw new Error("Stripe subscription evidence is incomplete.");
	}

	let targetUser = null;
	if (userId) {
		if (metadataOwnerId !== userId) {
			throw new Error(
				"Stripe subscription owner metadata does not match the target user.",
			);
		}
		targetUser = await prisma.user.findUnique({
			where: { id: userId },
			select: getBillingUserSelect(),
		});
	} else {
		targetUser = await prisma.user.findUnique({
			where: { stripeSubscriptionId: resolvedSubscriptionId },
			select: getBillingUserSelect(),
		});
		if (!targetUser && metadataOwnerId) {
			targetUser = await prisma.user.findUnique({
				where: { id: metadataOwnerId },
				select: getBillingUserSelect(),
			});
		}
	}

	if (!targetUser) return { updated: false, reason: "user-not-found" };
	if (requireMetadataOwner && metadataOwnerId !== targetUser.id) {
		throw new Error("Stripe subscription ownership could not be verified.");
	}
	if (hasConflictingEntitledProvider(targetUser, "stripe")) {
		return { updated: false, reason: "active-paypal-subscription" };
	}
	if (
		hasConflictingEntitledSubscription(
			targetUser,
			"stripe",
			resolvedSubscriptionId,
		)
	) {
		return {
			updated: false,
			reason: "different-active-stripe-subscription",
		};
	}

	const isEntitled = isEntitledSubscriptionStatus(
		"stripe",
		subscription.status,
	);
	const update = buildStripeSubscriptionUpdate(subscription, {
		clearPayPal: isEntitled,
	});
	const nextIcon = getAutomaticTierIconUpdate({
		currentIcon: targetUser.icon,
		currentTier: targetUser.tier,
		nextTier: update.tier,
	});
	if (nextIcon !== undefined) update.icon = nextIcon;
	await prisma.user.update({
		where: { id: targetUser.id },
		data: update,
	});
	return {
		updated: true,
		userId: targetUser.id,
		tierKey: providerTier,
		isEntitled,
	};
}

async function handlePayPalCreateSubscription(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = await getSessionFromRequest(req);
	if (!session?.userId)
		return json(res, 401, { error: "Not authenticated." });
	if (!enforceBillingRateLimit(req, res, "paypal-checkout", session.userId))
		return;

	try {
		const body = await readJsonBody(req);
		const tierKey = normalizeTierKey(body?.tier);
		if (!tierKey)
			return json(res, 400, { error: "Invalid subscription tier." });
		if (!isPurchasableSubscriptionTier(tierKey)) {
			return json(res, 409, {
				error: "This subscription option is not available yet.",
			});
		}

		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: { email: true, ...getBillingUserSelect() },
		});
		if (!user) return json(res, 404, { error: "User not found." });
		if (hasConflictingEntitledProvider(user, "paypal")) {
			return json(res, 409, {
				error: "Cancel the active Stripe subscription before starting PayPal billing.",
			});
		}
		if (
			user.paypalSubscriptionId &&
			isEntitledSubscriptionStatus("paypal", user.subscriptionStatus)
		) {
			return json(res, 409, {
				error: "The account already has an active PayPal subscription.",
			});
		}

		const origin = getAppOrigin(req);
		const response = await paypalRequest("/v1/billing/subscriptions", {
			method: "POST",
			headers: {
				"PayPal-Request-Id": getIdempotencyKey(
					req,
					`paypal-checkout:${user.id}:${tierKey}`,
				),
			},
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

		const approveUrl = response.data?.links?.find(
			(link) => link?.rel === "approve",
		)?.href;
		if (!approveUrl)
			return json(res, 500, {
				error: "PayPal did not return an approval URL.",
			});

		return json(res, 200, {
			url: approveUrl,
			subscriptionId: response.data?.id || null,
		});
	} catch (error) {
		console.error(
			"[subscriptions/paypal/create-subscription] error:",
			error,
		);
		return publicProviderError(
			res,
			"Failed to create PayPal subscription.",
		);
	}
}

async function handlePayPalVerify(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = await getSessionFromRequest(req);
	if (!session?.userId)
		return json(res, 401, { error: "Not authenticated." });
	if (!enforceBillingRateLimit(req, res, "paypal-verify", session.userId, 20))
		return;

	try {
		const body = await readJsonBody(req);
		const tierKey = normalizeTierKey(body?.tier);
		const subscriptionId = String(body?.subscriptionId || "").trim();
		if (!tierKey || !subscriptionId) {
			return json(res, 400, {
				error: "Missing PayPal subscription verification details.",
			});
		}

		const subscription = await getPayPalSubscription(subscriptionId);
		const binding = validatePayPalSubscriptionBinding({
			subscription,
			expectedUserId: session.userId,
			expectedTier: tierKey,
		});
		if (!binding.ok) return json(res, 403, { error: binding.error });

		const currentUser = await prisma.user.findUnique({
			where: { id: session.userId },
			select: getBillingUserSelect(),
		});
		if (!currentUser) return json(res, 404, { error: "User not found." });
		if (hasConflictingEntitledProvider(currentUser, "paypal")) {
			return json(res, 409, {
				error: "The account already has an active Stripe subscription.",
			});
		}
		if (
			hasConflictingEntitledSubscription(
				currentUser,
				"paypal",
				subscriptionId,
			)
		) {
			return json(res, 409, {
				error: "The account already has a different active PayPal subscription.",
			});
		}

		const isEntitled = isEntitledSubscriptionStatus(
			"paypal",
			subscription.status,
		);
		const update = buildPayPalSubscriptionUpdate(subscription, {
			clearStripe: isEntitled,
		});
		const nextIcon = getAutomaticTierIconUpdate({
			currentIcon: currentUser.icon,
			currentTier: currentUser.tier,
			nextTier: update.tier,
		});
		if (nextIcon !== undefined) update.icon = nextIcon;
		await prisma.user.update({
			where: { id: session.userId },
			data: update,
		});

		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: getUserPublicSelect(),
		});

		if (!isEntitled) {
			return json(res, 409, {
				error: "PayPal has not activated this subscription yet.",
				confirmed: false,
				subscriptionStatus: subscription?.status || null,
				user: serializeUser(user),
			});
		}
		return json(res, 200, {
			ok: true,
			confirmed: true,
			subscriptionStatus: subscription?.status || null,
			user: serializeUser(user),
		});
	} catch (error) {
		console.error("[subscriptions/paypal/verify] error:", error);
		return publicProviderError(
			res,
			"Failed to verify PayPal subscription.",
		);
	}
}

async function handlePayPalDetails(req, res) {
	if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

	const session = await getSessionFromRequest(req);
	if (!session?.userId)
		return json(res, 401, { error: "Not authenticated." });

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
			return json(res, 200, {
				details: normalizePayPalDetails(null, user || null),
			});
		}

		const subscription = await getPayPalSubscription(
			user.paypalSubscriptionId,
		);
		return json(res, 200, {
			details: normalizePayPalDetails(subscription, user),
		});
	} catch (error) {
		console.error("[subscriptions/paypal/details] error:", error);
		return publicProviderError(
			res,
			"Failed to load PayPal subscription details.",
		);
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
		if (!isValid)
			return json(res, 400, {
				error: "Invalid PayPal webhook signature.",
			});
		const eventId = String(event?.id || "").trim();
		if (!eventId)
			return json(res, 400, { error: "Invalid PayPal webhook." });
		if (await wasProviderEventProcessed("paypal", eventId)) {
			return json(res, 200, { received: true, duplicate: true });
		}

		let syncResult = { updated: false, reason: "ignored" };
		if (
			!PAYPAL_SUBSCRIPTION_EVENT_TYPES.has(
				String(event?.event_type || ""),
			)
		) {
			syncResult = { updated: false, reason: "ignored-event-type" };
		} else {
			const isSaleEvent = String(event?.event_type || "").startsWith(
				"PAYMENT.SALE.",
			);
			const subscriptionId = String(
				isSaleEvent
					? event?.resource?.billing_agreement_id
					: event?.resource?.id ||
							event?.resource?.billing_agreement_id ||
							"",
			).trim();
			syncResult = subscriptionId
				? await syncPayPalSubscription(subscriptionId)
				: { updated: false, reason: "missing-subscription-id" };
		}

		const receipt = await recordProcessedProviderEvent({
			provider: "paypal",
			eventId,
			eventType: String(event?.event_type || "unknown"),
			objectId:
				event?.resource?.id || event?.resource?.billing_agreement_id,
			outcome: getProviderEventOutcome(syncResult),
			occurredAt: event?.create_time || null,
		});

		return json(res, 200, {
			received: true,
			duplicate: receipt.duplicate,
		});
	} catch (error) {
		console.error("[subscriptions/paypal/webhook] error:", error);
		const isInvalidPayload = error instanceof SyntaxError;
		return json(res, isInvalidPayload ? 400 : 500, {
			error: isInvalidPayload
				? "Invalid PayPal webhook."
				: "PayPal webhook processing failed.",
		});
	}
}

async function syncPayPalSubscription(subscriptionId) {
	const subscription = await getPayPalSubscription(subscriptionId);
	const binding = getPayPalSubscriptionBinding(subscription);
	const validation = validatePayPalSubscriptionBinding({
		subscription,
		expectedUserId: binding.userId,
		expectedTier: binding.tierKey,
	});
	if (!validation.ok) {
		throw new Error("PayPal subscription evidence is incomplete.");
	}
	const providerTier = validation.tierKey;

	const existingBinding = await prisma.user.findUnique({
		where: { paypalSubscriptionId: String(subscription.id) },
		select: getBillingUserSelect(),
	});
	if (existingBinding && existingBinding.id !== binding.userId) {
		throw new Error(
			"PayPal subscription is already bound to another user.",
		);
	}
	const targetUser =
		existingBinding ||
		(await prisma.user.findUnique({
			where: { id: binding.userId },
			select: getBillingUserSelect(),
		}));
	if (!targetUser) return { updated: false, reason: "user-not-found" };
	if (hasConflictingEntitledProvider(targetUser, "paypal")) {
		return { updated: false, reason: "active-stripe-subscription" };
	}
	if (
		hasConflictingEntitledSubscription(
			targetUser,
			"paypal",
			String(subscription.id),
		)
	) {
		return {
			updated: false,
			reason: "different-active-paypal-subscription",
		};
	}

	const isEntitled = isEntitledSubscriptionStatus(
		"paypal",
		subscription.status,
	);
	const data = buildPayPalSubscriptionUpdate(subscription, {
		clearStripe: isEntitled,
	});
	const nextIcon = getAutomaticTierIconUpdate({
		currentIcon: targetUser.icon,
		currentTier: targetUser.tier,
		nextTier: data.tier,
	});
	if (nextIcon !== undefined) data.icon = nextIcon;
	await prisma.user.update({ where: { id: targetUser.id }, data });
	return {
		updated: true,
		userId: targetUser.id,
		tierKey: providerTier,
		isEntitled,
	};
}

async function handlePayPalCancel(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const session = await getSessionFromRequest(req);
	if (!session?.userId)
		return json(res, 401, { error: "Not authenticated." });
	if (!enforceBillingRateLimit(req, res, "paypal-cancel", session.userId, 6))
		return;

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: getBillingUserSelect(),
		});
		if (!user?.paypalSubscriptionId) {
			return json(res, 400, {
				error: "No PayPal subscription found for this user.",
			});
		}

		await paypalRequest(
			`/v1/billing/subscriptions/${encodeURIComponent(user.paypalSubscriptionId)}/cancel`,
			{
				method: "POST",
				headers: {
					"PayPal-Request-Id": getIdempotencyKey(
						req,
						`paypal-cancel:${session.userId}`,
					),
				},
				body: {
					reason: "Canceled by customer from PokemonPGC pricing page.",
				},
			},
		);

		const nextIcon = getAutomaticTierIconUpdate({
			currentIcon: user.icon,
			currentTier: user.tier,
			nextTier: "free",
		});
		await prisma.user.update({
			where: { id: session.userId },
			data: {
				tier: "free",
				subscriptionStatus: "CANCELLED",
				paypalSubscriptionId: null,
				...(nextIcon !== undefined ? { icon: nextIcon } : {}),
			},
		});

		const updatedUser = await prisma.user.findUnique({
			where: { id: session.userId },
			select: getUserPublicSelect(),
		});

		return json(res, 200, { ok: true, user: serializeUser(updatedUser) });
	} catch (error) {
		console.error("[subscriptions/paypal/cancel] error:", error);
		return publicProviderError(
			res,
			"Failed to cancel PayPal subscription.",
		);
	}
}
