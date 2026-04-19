import { prisma } from "../../_lib/db.js";
import { json } from "../../_lib/response.js";
import { readRawBody } from "../../_lib/auth.js";
import {
	buildStripeSubscriptionUpdate,
	getStripeClient,
	getStripeWebhookSecret,
} from "../../_lib/stripe.js";
import { getStripeSubscriptionTier } from "../../_lib/stripe.js";

export const config = {
	api: {
		bodyParser: false,
	},
};

async function syncStripeSubscriptionToUser({ userId, subscriptionId, fallbackTier, customerId }) {
	const stripe = getStripeClient();
	const subscription = await stripe.subscriptions.retrieve(subscriptionId);
	const update = buildStripeSubscriptionUpdate(subscription);
	if (!getStripeSubscriptionTier(subscription) && fallbackTier) {
		update.tier = fallbackTier;
	}
	if (customerId && !update.stripeCustomerId) {
		update.stripeCustomerId = String(customerId);
	}

	if (userId) {
		await prisma.user.update({
			where: { id: userId },
			data: update,
		});
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

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return json(res, 405, { error: "Method not allowed." });
	}

	try {
		const rawBody = await readRawBody(req);
		const signature = req.headers["stripe-signature"];
		const stripe = getStripeClient();
		const event = stripe.webhooks.constructEvent(rawBody, signature, getStripeWebhookSecret());

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
