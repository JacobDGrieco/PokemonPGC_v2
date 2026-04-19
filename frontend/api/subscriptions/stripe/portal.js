import { prisma } from "../../_lib/db.js";
import { getSessionFromRequest } from "../../_lib/auth.js";
import { json, methodNotAllowed } from "../../_lib/response.js";
import { getStripeClient, getStripePortalConfigurationId } from "../../_lib/stripe.js";
import { getAppOrigin } from "../../_lib/subscription.js";

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
