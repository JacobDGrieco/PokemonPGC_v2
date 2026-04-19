import { prisma } from "../../_lib/db.js";
import { getSessionFromRequest, readJsonBody } from "../../_lib/auth.js";
import { json, methodNotAllowed } from "../../_lib/response.js";
import { paypalRequest } from "../../_lib/paypal.js";
import { getAppOrigin, getPayPalPlanIdForTier, normalizeTierKey } from "../../_lib/subscription.js";

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
			},
		});

		if (!user) {
			return json(res, 404, { error: "User not found." });
		}

		const origin = getAppOrigin(req);
		const response = await paypalRequest("/v1/billing/subscriptions", {
			method: "POST",
			body: {
				plan_id: getPayPalPlanIdForTier(tierKey),
				custom_id: `${user.id}:${tierKey}`,
				subscriber: {
					email_address: user.email,
				},
				application_context: {
					brand_name: "PokemonPGC",
					user_action: "SUBSCRIBE_NOW",
					return_url: `${origin}/subscription/success?provider=paypal&tier=${encodeURIComponent(tierKey)}`,
					cancel_url: `${origin}/pricing?tier=${encodeURIComponent(tierKey)}`,
				},
			},
		});

		const approveUrl = response.data?.links?.find((link) => link?.rel === "approve")?.href;
		if (!approveUrl) {
			return json(res, 500, { error: "PayPal did not return an approval URL." });
		}

		return json(res, 200, {
			url: approveUrl,
			subscriptionId: response.data?.id || null,
		});
	} catch (error) {
		console.error("[subscriptions/paypal/create-subscription] error:", error);
		return json(res, 500, { error: error.message || "Failed to create PayPal subscription." });
	}
}
