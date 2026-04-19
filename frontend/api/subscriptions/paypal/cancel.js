import { prisma } from "../../_lib/db.js";
import { getSessionFromRequest } from "../../_lib/auth.js";
import { json, methodNotAllowed } from "../../_lib/response.js";
import { paypalRequest } from "../../_lib/paypal.js";
import { getUserPublicSelect, serializeUser } from "../../_lib/subscription.js";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return methodNotAllowed(res, ["POST"]);
	}

	const session = getSessionFromRequest(req);
	if (!session?.userId) {
		return json(res, 401, { error: "Not authenticated." });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: {
				paypalSubscriptionId: true,
			},
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
