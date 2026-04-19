import { prisma } from "../../_lib/db.js";
import { json } from "../../_lib/response.js";
import { readRawBody } from "../../_lib/auth.js";
import {
	buildPayPalSubscriptionUpdate,
	getPayPalSubscription,
	verifyPayPalWebhook,
} from "../../_lib/paypal.js";

export const config = {
	api: {
		bodyParser: false,
	},
};

function parseUserIdFromCustomId(customId) {
	const raw = String(customId || "").trim();
	if (!raw) return null;
	const [id] = raw.split(":");
	const parsed = Number(id);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function syncPayPalSubscription(subscriptionId) {
	const subscription = await getPayPalSubscription(subscriptionId);
	const userId = parseUserIdFromCustomId(subscription?.custom_id);
	const data = buildPayPalSubscriptionUpdate(subscription);

	if (userId) {
		await prisma.user.update({
			where: { id: userId },
			data,
		});
		return;
	}

	await prisma.user.updateMany({
		where: { paypalSubscriptionId: String(subscription.id) },
		data,
	});
}

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return json(res, 405, { error: "Method not allowed." });
	}

	try {
		const rawBody = await readRawBody(req);
		const event = rawBody ? JSON.parse(rawBody) : {};
		const isValid = await verifyPayPalWebhook(req.headers, event);
		if (!isValid) {
			return json(res, 400, { error: "Invalid PayPal webhook signature." });
		}

		const subscriptionId = String(event?.resource?.id || event?.resource?.billing_agreement_id || "").trim();
		if (subscriptionId) {
			await syncPayPalSubscription(subscriptionId);
		}

		return json(res, 200, { received: true });
	} catch (error) {
		console.error("[subscriptions/paypal/webhook] error:", error);
		return json(res, 400, { error: error.message || "Invalid PayPal webhook." });
	}
}
