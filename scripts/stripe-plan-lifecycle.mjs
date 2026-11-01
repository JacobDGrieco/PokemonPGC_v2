/**
 * Exercises immediate upgrade and end-of-term downgrade scheduling with a
 * disposable Stripe test customer. It refuses live keys and always cleans up.
 */
import "dotenv/config";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import Stripe from "stripe";
import {
	buildStripeDowngradePhases,
	getStripeScheduledTier,
	getStripeSubscriptionPeriod,
	PPGC_STRIPE_SCHEDULE_METADATA_KEY,
	PPGC_STRIPE_SCHEDULE_METADATA_VALUE,
} from "../api/_lib/stripe.js";

const secretKey = String(process.env.STRIPE_SECRET_KEY || "").trim();
const greatPriceId = String(process.env.STRIPE_PRICE_GREAT || "").trim();
const ultraPriceId = String(process.env.STRIPE_PRICE_ULTRA || "").trim();

if (!secretKey.startsWith("sk_test_")) {
	throw new Error(
		"Lifecycle testing requires a Stripe test-mode secret key.",
	);
}
if (!greatPriceId || !ultraPriceId) {
	throw new Error("Stripe Great and Ultra test Price IDs are required.");
}

const stripe = new Stripe(secretKey, { maxNetworkRetries: 2, timeout: 15_000 });
const testUserId = 2_000_000_001;
let customer = null;
let subscription = null;
let schedule = null;

try {
	customer = await stripe.customers.create({
		email: `ppgc-plan-${crypto.randomUUID()}@example.invalid`,
		metadata: { purpose: "pokemonpgc-plan-lifecycle-test" },
		source: "tok_visa",
	});

	subscription = await stripe.subscriptions.create({
		customer: customer.id,
		items: [{ price: greatPriceId, quantity: 1 }],
		metadata: { userId: String(testUserId), tier: "great" },
		payment_behavior: "error_if_incomplete",
		expand: ["items.data.price"],
	});
	assert.match(subscription.status, /^(active|trialing)$/);
	assert.ok(getStripeSubscriptionPeriod(subscription).currentPeriodEnd);

	subscription = await stripe.subscriptions.update(subscription.id, {
		items: [
			{
				id: subscription.items.data[0].id,
				price: ultraPriceId,
				quantity: 1,
			},
		],
		payment_behavior: "pending_if_incomplete",
		proration_behavior: "always_invoice",
		expand: ["items.data.price"],
	});
	assert.equal(subscription.pending_update, null);
	assert.equal(subscription.items.data[0].price.id, ultraPriceId);
	subscription = await stripe.subscriptions.update(subscription.id, {
		metadata: { userId: String(testUserId), tier: "ultra" },
		expand: ["items.data.price"],
	});

	schedule = await stripe.subscriptionSchedules.create({
		from_subscription: subscription.id,
	});
	schedule = await stripe.subscriptionSchedules.retrieve(schedule.id, {
		expand: ["phases.items.price"],
	});
	const greatPrice = await stripe.prices.retrieve(greatPriceId);
	schedule = await stripe.subscriptionSchedules.update(schedule.id, {
		end_behavior: "release",
		metadata: {
			[PPGC_STRIPE_SCHEDULE_METADATA_KEY]:
				PPGC_STRIPE_SCHEDULE_METADATA_VALUE,
			userId: String(testUserId),
			targetTier: "great",
		},
		phases: buildStripeDowngradePhases({
			schedule,
			subscription,
			targetPrice: greatPrice,
			userId: testUserId,
			currentTier: "ultra",
			targetTier: "great",
		}),
		proration_behavior: "none",
	});
	assert.equal(getStripeScheduledTier(schedule)?.tierKey, "great");

	await stripe.subscriptionSchedules.release(schedule.id, {
		preserve_cancel_date: false,
	});
	schedule = null;
	subscription = await stripe.subscriptions.retrieve(subscription.id, {
		expand: ["items.data.price"],
	});
	assert.equal(subscription.items.data[0].price.id, ultraPriceId);
	assert.equal(subscription.schedule, null);
	subscription = await stripe.subscriptions.update(subscription.id, {
		cancel_at_period_end: true,
		expand: ["items.data.price"],
	});
	assert.equal(subscription.cancel_at_period_end, true);
	assert.ok(getStripeSubscriptionPeriod(subscription).currentPeriodEnd);
	subscription = await stripe.subscriptions.update(subscription.id, {
		cancel_at_period_end: false,
		expand: ["items.data.price"],
	});
	assert.equal(subscription.cancel_at_period_end, false);

	console.log(
		"Stripe test lifecycle passed: immediate upgrade, paid downgrade, Free downgrade, and pending-change cancellation.",
	);
} finally {
	if (schedule?.id && ["active", "not_started"].includes(schedule.status)) {
		await stripe.subscriptionSchedules
			.release(schedule.id, { preserve_cancel_date: false })
			.catch(() => {});
	}
	if (customer?.id) {
		await stripe.customers.del(customer.id).catch(() => {});
	}
}
