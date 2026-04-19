import { prisma } from "../../_lib/db.js";
import { getSessionFromRequest, readJsonBody } from "../../_lib/auth.js";
import { json, methodNotAllowed } from "../../_lib/response.js";
import { buildPayPalSubscriptionUpdate, getPayPalSubscription } from "../../_lib/paypal.js";
import { getPayPalPlanIdForTier, normalizeTierKey, serializeUser, getUserPublicSelect } from "../../_lib/subscription.js";

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
