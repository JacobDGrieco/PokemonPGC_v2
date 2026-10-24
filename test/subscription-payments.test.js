import assert from "node:assert/strict";
import test from "node:test";

process.env.STRIPE_PRICE_GREAT = "price_great";
process.env.STRIPE_PRICE_ULTRA = "price_ultra";
process.env.STRIPE_PRICE_MASTER = "price_master";
process.env.PAYPAL_PLAN_GREAT = "plan_great";
process.env.PAYPAL_PLAN_ULTRA = "plan_ultra";
process.env.PAYPAL_PLAN_MASTER = "plan_master";

const {
	buildSubscriptionUpdate,
	isEntitledSubscriptionStatus,
	normalizeAppOrigin,
	parseProviderUserId,
	serializeUser,
} = await import("../api/_lib/subscription.js");
const { getStripeSubscriptionTier, validateStripeCheckoutBinding } =
	await import("../api/_lib/stripe.js");
const {
	getPayPalSubscriptionBinding,
	getPayPalSubscriptionTier,
	validatePayPalSubscriptionBinding,
} = await import("../api/_lib/paypal.js");

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
