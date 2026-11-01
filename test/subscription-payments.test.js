import assert from "node:assert/strict";
import { Readable } from "node:stream";
import test from "node:test";

process.env.STRIPE_PRICE_GREAT = "price_great";
process.env.STRIPE_PRICE_ULTRA = "price_ultra";
process.env.STRIPE_PRICE_MASTER = "price_master";
process.env.PAYPAL_PLAN_GREAT = "plan_great";
process.env.PAYPAL_PLAN_ULTRA = "plan_ultra";
process.env.PAYPAL_PLAN_MASTER = "plan_master";

const {
	buildSubscriptionUpdate,
	getActiveTierGrant,
	getAutomaticTierIconUpdate,
	getEffectiveAccountTier,
	getUserPublicSelect,
	isEntitledSubscriptionStatus,
	isPurchasableSubscriptionTier,
	normalizeAppOrigin,
	parseProviderUserId,
	serializeUser,
} = await import("../api/_lib/subscription.js");
const {
	buildStripeDowngradePhases,
	getStripeHostedInvoiceUrl,
	getStripePendingChange,
	getStripeScheduledTier,
	getStripeSubscriptionPeriod,
	getStripeSubscriptionTier,
	validateStripeCheckoutBinding,
} = await import("../api/_lib/stripe.js");
const {
	getPayPalSubscriptionBinding,
	getPayPalSubscriptionTier,
	validatePayPalSubscriptionBinding,
} = await import("../api/_lib/paypal.js");
const { parsePaymentProviderFlag, PAYMENT_PROVIDER_AVAILABILITY } =
	await import("../src/config/paymentProviders.js");
const {
	buildProviderEventData,
	recordProcessedProviderEvent,
	wasProviderEventProcessed,
} = await import("../api/_lib/providerEvents.js");
const { readRawBody } = await import("../api/_lib/auth.js");
const { default: subscriptionsHandler } =
	await import("../api/subscriptions/[provider]/[action].js");

function createMockResponse() {
	return {
		headers: new Map(),
		statusCode: null,
		payload: null,
		setHeader(name, value) {
			this.headers.set(name, value);
		},
		status(statusCode) {
			this.statusCode = statusCode;
			return this;
		},
		json(payload) {
			this.payload = payload;
			return payload;
		},
	};
}

function stripeSubscription(overrides = {}) {
	return {
		id: "sub_123",
		customer: "cus_123",
		status: "active",
		metadata: { userId: "42", tier: "ultra" },
		items: { data: [{ price: { id: "price_ultra" } }] },
		...overrides,
	};
}

function stripeCheckout(overrides = {}) {
	return {
		id: "cs_123",
		mode: "subscription",
		customer: "cus_123",
		client_reference_id: "42",
		metadata: { userId: "42", tier: "ultra" },
		...overrides,
	};
}

function paypalSubscription(overrides = {}) {
	return {
		id: "I-123",
		status: "ACTIVE",
		custom_id: "42:ultra",
		plan_id: "plan_ultra",
		...overrides,
	};
}

test("new subscriptions default to Stripe while standalone PayPal is opt-in", () => {
	assert.equal(PAYMENT_PROVIDER_AVAILABILITY.stripe, true);
	assert.equal(PAYMENT_PROVIDER_AVAILABILITY.paypal, false);
	assert.equal(parsePaymentProviderFlag("yes", false), true);
	assert.equal(parsePaymentProviderFlag("off", true), false);
	assert.equal(parsePaymentProviderFlag("invalid", true), true);
});

test("Stripe change-plan is a registered API action", async () => {
	const response = createMockResponse();
	await subscriptionsHandler(
		{
			method: "GET",
			query: { provider: "stripe", action: "change-plan" },
			headers: {},
		},
		response,
	);
	assert.equal(response.statusCode, 405);
	assert.deepEqual(response.payload, { error: "Method not allowed." });
	assert.equal(response.headers.get("Allow"), "POST");
});

test("Stripe payment-action redirects use only an expanded hosted invoice", () => {
	assert.equal(
		getStripeHostedInvoiceUrl({
			latest_invoice: {
				hosted_invoice_url: "https://invoice.stripe.com/i/test_123",
			},
		}),
		"https://invoice.stripe.com/i/test_123",
	);
	assert.equal(getStripeHostedInvoiceUrl({ latest_invoice: "in_123" }), null);
	assert.equal(getStripeHostedInvoiceUrl({ latest_invoice: null }), null);
});

test("new checkout permits monthly and annual supporter options but not Master", () => {
	assert.equal(isPurchasableSubscriptionTier("great"), true);
	assert.equal(isPurchasableSubscriptionTier("ultra"), true);
	assert.equal(isPurchasableSubscriptionTier("master"), false);
	assert.equal(isPurchasableSubscriptionTier("free"), false);
});

test("provider user IDs accept positive safe integers only", () => {
	assert.equal(parseProviderUserId("42"), 42);
	assert.equal(parseProviderUserId("0"), null);
	assert.equal(parseProviderUserId("-1"), null);
	assert.equal(parseProviderUserId("42:master"), null);
	assert.equal(parseProviderUserId("not-a-user"), null);
});

test("only provider-active statuses grant entitlement", () => {
	assert.equal(isEntitledSubscriptionStatus("stripe", "active"), true);
	assert.equal(isEntitledSubscriptionStatus("stripe", "trialing"), true);
	assert.equal(isEntitledSubscriptionStatus("stripe", "past_due"), false);
	assert.equal(isEntitledSubscriptionStatus("stripe", "paused"), false);
	assert.equal(isEntitledSubscriptionStatus("paypal", "ACTIVE"), true);
	assert.equal(
		isEntitledSubscriptionStatus("paypal", "APPROVAL_PENDING"),
		false,
	);
	assert.equal(isEntitledSubscriptionStatus("paypal", "APPROVED"), false);
});

test("complimentary grants resolve above provider access and expire closed", () => {
	const now = new Date("2026-11-01T12:00:00.000Z");
	const user = {
		tier: "great",
		tierGrants: [
			{ tier: "ultra", expiresAt: "2026-10-01T00:00:00.000Z" },
			{ tier: "master", expiresAt: "2027-01-01T00:00:00.000Z" },
		],
	};

	assert.deepEqual(getActiveTierGrant(user, now), {
		tier: "master",
		expiresAt: new Date("2027-01-01T00:00:00.000Z"),
	});
	assert.equal(getEffectiveAccountTier(user, now), "master");
	assert.equal(
		getEffectiveAccountTier(
			{ tier: "ultra", tierGrants: [{ tier: "great" }] },
			now,
		),
		"ultra",
	);
	assert.equal(
		getActiveTierGrant(
			{ tierGrants: [{ tier: "master", revokedAt: now }] },
			now,
		),
		null,
	);
});

test("public users expose effective complimentary access without faking billing", () => {
	const publicUser = serializeUser({
		id: 42,
		email: "trainer@example.com",
		icon: "master",
		tier: "free",
		subscriptionStatus: null,
		stripeCustomerId: null,
		stripeSubscriptionId: null,
		paypalSubscriptionId: null,
		tierGrants: [{ tier: "master", expiresAt: null, revokedAt: null }],
	});

	assert.equal(publicUser.tier, "master");
	assert.deepEqual(publicUser.complimentaryAccess, {
		tier: "master",
		expiresAt: null,
	});
	assert.equal(publicUser.subscriptionProvider, null);
	assert.equal(publicUser.hasBillingPortal, false);
	assert.deepEqual(getUserPublicSelect().tierGrants.select, {
		tier: true,
		expiresAt: true,
		revokedAt: true,
	});
});

test("subscription updates fail closed for inactive statuses", () => {
	assert.deepEqual(
		buildSubscriptionUpdate({
			provider: "paypal",
			tierKey: "master",
			status: "APPROVAL_PENDING",
		}),
		{ tier: "free", subscriptionStatus: "APPROVAL_PENDING" },
	);
	assert.deepEqual(
		buildSubscriptionUpdate({
			provider: "stripe",
			tierKey: "great",
			status: "active",
		}),
		{ tier: "great", subscriptionStatus: "active" },
	);
});

test("tier changes follow only default or tier-managed account icons", () => {
	assert.equal(
		getAutomaticTierIconUpdate({
			currentIcon: "default",
			currentTier: "free",
			nextTier: "great",
		}),
		"great",
	);
	assert.equal(
		getAutomaticTierIconUpdate({
			currentIcon: "great",
			currentTier: "great",
			nextTier: "ultra",
		}),
		"ultra",
	);
	assert.equal(
		getAutomaticTierIconUpdate({
			currentIcon: "data:image/png;base64,custom",
			currentTier: "great",
			nextTier: "ultra",
		}),
		undefined,
	);
	assert.equal(
		getAutomaticTierIconUpdate({
			currentIcon: "ultra",
			currentTier: "ultra",
			nextTier: "free",
		}),
		"default",
	);
});

test("Stripe billing periods prefer item-level fields with legacy fallback", () => {
	assert.deepEqual(
		getStripeSubscriptionPeriod({
			current_period_start: 10,
			current_period_end: 20,
			items: {
				data: [{ current_period_start: 30, current_period_end: 40 }],
			},
		}),
		{ currentPeriodStart: 30, currentPeriodEnd: 40 },
	);
	assert.deepEqual(
		getStripeSubscriptionPeriod({
			current_period_start: 10,
			current_period_end: 20,
		}),
		{ currentPeriodStart: 10, currentPeriodEnd: 20 },
	);
});

test("only tagged Stripe schedules expose a configured future tier", () => {
	const schedule = {
		metadata: { ppgcManaged: "plan-change", userId: "42" },
		phases: [
			{
				start_date: 100,
				items: [{ price: "price_ultra" }],
			},
			{
				start_date: 200,
				items: [{ price: { id: "price_great" } }],
			},
		],
	};
	assert.deepEqual(getStripeScheduledTier(schedule, 150), {
		tierKey: "great",
		effectiveAt: 200,
	});
	assert.equal(
		getStripeScheduledTier({ ...schedule, metadata: {} }, 150),
		null,
	);
});

test("end-of-period Stripe cancellation is exposed as a Free downgrade", () => {
	assert.deepEqual(
		getStripePendingChange(
			{
				cancel_at_period_end: true,
				items: { data: [{ current_period_end: 300 }] },
			},
			null,
			200,
		),
		{ tierKey: "free", effectiveAt: 300 },
	);
	assert.equal(
		getStripePendingChange(
			{
				cancel_at_period_end: false,
				items: { data: [{ current_period_end: 300 }] },
			},
			null,
			200,
		),
		null,
	);
});

test("Stripe downgrade phases retain the paid plan through period end", () => {
	const phases = buildStripeDowngradePhases({
		schedule: {
			phases: [
				{
					start_date: 100,
					end_date: 400,
					items: [{ price: "price_ultra", quantity: 1 }],
					metadata: { existing: "value" },
					discounts: [],
				},
			],
		},
		subscription: {
			items: { data: [{ current_period_end: 300 }] },
		},
		targetPrice: {
			id: "price_great",
			recurring: { interval: "month", interval_count: 1 },
		},
		userId: 42,
		currentTier: "ultra",
		targetTier: "great",
		nowSeconds: 200,
	});

	assert.equal(phases[0].end_date, 300);
	assert.deepEqual(phases[0].metadata, {
		existing: "value",
		userId: "42",
		tier: "ultra",
	});
	assert.deepEqual(phases[1], {
		start_date: 300,
		duration: { interval: "month", interval_count: 1 },
		items: [{ price: "price_great", quantity: 1 }],
		metadata: { userId: "42", tier: "great" },
		proration_behavior: "none",
	});
});

test("Stripe tier is derived from the configured Price and conflicts fail closed", () => {
	assert.equal(getStripeSubscriptionTier(stripeSubscription()), "ultra");
	assert.equal(
		getStripeSubscriptionTier(
			stripeSubscription({ metadata: { userId: "42", tier: "master" } }),
		),
		null,
	);
	assert.equal(
		getStripeSubscriptionTier(
			stripeSubscription({
				items: { data: [{ price: { id: "price_unknown" } }] },
			}),
		),
		null,
	);
});

test("Stripe checkout binding requires exact session and subscription ownership", () => {
	assert.deepEqual(
		validateStripeCheckoutBinding({
			checkoutSession: stripeCheckout(),
			subscription: stripeSubscription(),
			expectedUserId: 42,
			expectedTier: "ultra",
		}),
		{ ok: true, ownerId: 42, tierKey: "ultra" },
	);

	assert.equal(
		validateStripeCheckoutBinding({
			checkoutSession: stripeCheckout(),
			subscription: stripeSubscription({
				metadata: { userId: "99", tier: "ultra" },
			}),
			expectedUserId: 42,
			expectedTier: "ultra",
		}).ok,
		false,
	);

	assert.equal(
		validateStripeCheckoutBinding({
			checkoutSession: stripeCheckout({
				metadata: {},
				client_reference_id: null,
			}),
			subscription: stripeSubscription(),
			expectedUserId: 42,
			expectedTier: "ultra",
		}).ok,
		false,
	);
});

test("PayPal binding requires exact custom owner, custom tier, and configured Plan", () => {
	assert.deepEqual(getPayPalSubscriptionBinding(paypalSubscription()), {
		userId: 42,
		tierKey: "ultra",
	});
	assert.equal(getPayPalSubscriptionTier(paypalSubscription()), "ultra");
	assert.deepEqual(
		validatePayPalSubscriptionBinding({
			subscription: paypalSubscription(),
			expectedUserId: 42,
			expectedTier: "ultra",
		}),
		{ ok: true, ownerId: 42, tierKey: "ultra" },
	);

	assert.equal(
		validatePayPalSubscriptionBinding({
			subscription: paypalSubscription({ custom_id: "99:ultra" }),
			expectedUserId: 42,
			expectedTier: "ultra",
		}).ok,
		false,
	);
	assert.equal(
		validatePayPalSubscriptionBinding({
			subscription: paypalSubscription({ custom_id: "42:master" }),
			expectedUserId: 42,
			expectedTier: "ultra",
		}).ok,
		false,
	);
});

test("application origins are reduced to validated HTTP(S) origins", () => {
	assert.equal(
		normalizeAppOrigin("https://pokemon.example/path?q=1"),
		"https://pokemon.example",
	);
	assert.equal(
		normalizeAppOrigin("preview.vercel.app"),
		"https://preview.vercel.app",
	);
	assert.throws(
		() => normalizeAppOrigin("javascript:alert(1)"),
		/HTTP or HTTPS/,
	);
	assert.throws(
		() => normalizeAppOrigin("https://user:pass@example.com"),
		/credentials/,
	);
});

test("webhook raw bodies are streamed before Vercel's lazy body parser", async () => {
	const rawBody = '{\n  "id": "evt_123",\n  "type": "test.event"\n}\n';
	const request = Readable.from([Buffer.from(rawBody)]);
	Object.defineProperty(request, "body", {
		get() {
			throw new Error("The parsed body getter must not be read first.");
		},
	});

	assert.equal(await readRawBody(request), rawBody);
});

test("webhook raw bodies fall back to an already-parsed adapter body", async () => {
	const request = Readable.from([]);
	request.body = { id: "evt_adapter", type: "test.event" };

	assert.equal(await readRawBody(request), JSON.stringify(request.body));
});

test("public user provider comes from a subscription binding, not a customer record alone", () => {
	assert.equal(
		serializeUser({
			id: 42,
			email: "trainer@example.com",
			icon: "default",
			tier: "free",
			subscriptionStatus: "canceled",
			stripeCustomerId: "cus_123",
			stripeSubscriptionId: null,
			paypalSubscriptionId: null,
		}).subscriptionProvider,
		null,
	);
});

test("provider event receipts retain bounded identifiers without raw payloads", () => {
	const occurredAt = new Date("2026-11-01T12:00:00.000Z");
	assert.deepEqual(
		buildProviderEventData({
			provider: "Stripe",
			eventId: "evt_123",
			eventType: "customer.subscription.updated",
			objectId: "sub_123",
			outcome: "updated",
			occurredAt,
		}),
		{
			provider: "stripe",
			eventId: "evt_123",
			eventType: "customer.subscription.updated",
			objectId: "sub_123",
			outcome: "updated",
			occurredAt,
		},
	);
	assert.throws(
		() =>
			buildProviderEventData({
				provider: "stripe",
				eventId: "x".repeat(256),
				eventType: "checkout.session.completed",
				outcome: "updated",
			}),
		/Provider event ID/,
	);
});

test("provider event identity checks use the compound key", async () => {
	let query = null;
	const database = {
		providerEvent: {
			async findUnique(input) {
				query = input;
				return { id: 7 };
			},
		},
	};

	assert.equal(
		await wasProviderEventProcessed("stripe", "evt_123", database),
		true,
	);
	assert.deepEqual(query, {
		where: {
			provider_eventId: { provider: "stripe", eventId: "evt_123" },
		},
		select: { id: true },
	});
});

test("provider event unique races are acknowledged as duplicates", async () => {
	const duplicateDatabase = {
		providerEvent: {
			async create() {
				throw Object.assign(new Error("duplicate"), { code: "P2002" });
			},
		},
	};

	assert.deepEqual(
		await recordProcessedProviderEvent(
			{
				provider: "stripe",
				eventId: "evt_duplicate",
				eventType: "customer.subscription.updated",
				outcome: "updated",
			},
			duplicateDatabase,
		),
		{ created: false, duplicate: true },
	);
});
