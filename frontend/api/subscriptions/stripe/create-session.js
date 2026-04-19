import { prisma } from "../../_lib/db.js";
import { getSessionFromRequest, readJsonBody } from "../../_lib/auth.js";
import { json, methodNotAllowed } from "../../_lib/response.js";
import { getStripeClient } from "../../_lib/stripe.js";
import {
	getAppOrigin,
	getStripePriceIdForTier,
	normalizeTierKey,
} from "../../_lib/subscription.js";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return methodNotAllowed(res, ["POST"]);
	}

	const session = getSessionFromRequest(req);
	if (!session?.userId) {
		return json(res, 401, { error: "Not authenticated." });
	}

	try {
		const body = await readJsonBody(req);
		const tierKey = normalizeTierKey(body?.tier);
		if (!tierKey) {
			return json(res, 400, { error: "Invalid subscription tier." });
		}

		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: {
				id: true,
				email: true,
				stripeCustomerId: true,
			},
		});

		if (!user) {
			return json(res, 404, { error: "User not found." });
		}

		const stripe = getStripeClient();
		const origin = getAppOrigin(req);
		const checkoutSession = await stripe.checkout.sessions.create({
			mode: "subscription",
			success_url: `${origin}/subscription/success?provider=stripe&tier=${encodeURIComponent(tierKey)}`,
			cancel_url: `${origin}/pricing?tier=${encodeURIComponent(tierKey)}`,
			customer: user.stripeCustomerId || undefined,
			customer_email: user.stripeCustomerId ? undefined : user.email,
			client_reference_id: String(user.id),
			line_items: [
				{
					price: getStripePriceIdForTier(tierKey),
					quantity: 1,
				},
			],
			metadata: {
				userId: String(user.id),
				tier: tierKey,
			},
			subscription_data: {
				metadata: {
					userId: String(user.id),
					tier: tierKey,
				},
			},
			allow_promotion_codes: true,
		});

		return json(res, 200, { url: checkoutSession.url });
	} catch (error) {
		console.error("[subscriptions/stripe/create-session] error:", error);
		return json(res, 500, { error: error.message || "Failed to create Stripe checkout session." });
	}
}
