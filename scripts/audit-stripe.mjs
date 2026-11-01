/**
 * Read-only Stripe launch audit.
 *
 * The script validates configured account objects without printing API keys,
 * webhook secrets, endpoint URLs, customer data, or full provider identifiers.
 */
import "dotenv/config";
import Stripe from "stripe";

const PRICE_EXPECTATIONS = [
	{
		environmentName: "STRIPE_PRICE_GREAT",
		unitAmount: 500,
		interval: "month",
		intervalCount: 1,
	},
	{
		environmentName: "STRIPE_PRICE_ULTRA",
		unitAmount: 5_000,
		interval: "year",
		intervalCount: 1,
	},
];
const REQUIRED_WEBHOOK_EVENTS = [
	"checkout.session.completed",
	"customer.subscription.created",
	"customer.subscription.updated",
	"customer.subscription.deleted",
];

function requiredEnvironmentValue(name) {
	const value = String(process.env[name] || "").trim();
	if (!value) throw new Error(`Missing ${name}.`);
	return value;
}

function normalizeOrigin(value) {
	const url = new URL(requiredEnvironmentValue(value));
	if (url.protocol !== "https:") {
		throw new Error(
			`${value} must use HTTPS for the deployed Stripe audit.`,
		);
	}
	return url.origin;
}

function hasRequiredWebhookEvents(endpoint) {
	const enabledEvents = new Set(endpoint?.enabled_events || []);
	return (
		enabledEvents.has("*") ||
		REQUIRED_WEBHOOK_EVENTS.every((eventType) =>
			enabledEvents.has(eventType),
		)
	);
}

async function auditPrice(
	stripe,
	expectation,
	providerPriceId,
	expectedLiveMode,
) {
	const price = await stripe.prices.retrieve(providerPriceId, {
		expand: ["product"],
	});
	const product =
		price.product && typeof price.product === "object"
			? price.product
			: null;

	return {
		environmentName: expectation.environmentName,
		active: price.active === true,
		modeMatchesKey: price.livemode === expectedLiveMode,
		currency: price.currency || null,
		unitAmount: Number.isInteger(price.unit_amount)
			? price.unit_amount
			: null,
		recurring: !!price.recurring,
		interval: price.recurring?.interval || null,
		intervalCount: price.recurring?.interval_count || null,
		productActive: product?.active === true,
		expectedUnitAmount: expectation.unitAmount,
		expectedInterval: expectation.interval,
		expectedIntervalCount: expectation.intervalCount,
	};
}

async function main() {
	const secretKey = requiredEnvironmentValue("STRIPE_SECRET_KEY");
	const isLiveMode = secretKey.startsWith("sk_live_");
	if (!isLiveMode && !secretKey.startsWith("sk_test_")) {
		throw new Error("STRIPE_SECRET_KEY has an unsupported mode prefix.");
	}

	const stripe = new Stripe(secretKey, {
		maxNetworkRetries: 2,
		timeout: 10_000,
	});
	const origin = normalizeOrigin("APP_ORIGIN");
	const expectedWebhookUrl = `${origin}/api/subscriptions/stripe/webhook`;
	const expectedWebhook = new URL(expectedWebhookUrl);
	const portalConfigurationId = String(
		process.env.STRIPE_PORTAL_CONFIGURATION_ID ||
			process.env.STRIPE_PORTAL ||
			"",
	).trim();
	const configuredPriceIds = PRICE_EXPECTATIONS.map(({ environmentName }) =>
		requiredEnvironmentValue(environmentName),
	);

	const [account, prices, webhookEndpoints, portalConfiguration] =
		await Promise.all([
			stripe.accounts.retrieve(),
			Promise.all(
				PRICE_EXPECTATIONS.map((expectation, index) =>
					auditPrice(
						stripe,
						expectation,
						configuredPriceIds[index],
						isLiveMode,
					),
				),
			),
			stripe.webhookEndpoints.list({ limit: 100 }),
			portalConfigurationId
				? stripe.billingPortal.configurations.retrieve(
						portalConfigurationId,
					)
				: Promise.resolve(null),
		]);

	const matchingWebhookEndpoints = webhookEndpoints.data.filter(
		(endpoint) => endpoint.url === expectedWebhookUrl,
	);
	const parsedWebhookEndpoints = webhookEndpoints.data.flatMap((endpoint) => {
		try {
			return [{ endpoint, url: new URL(endpoint.url) }];
		} catch {
			return [];
		}
	});
	const sameOriginWebhookEndpoints = parsedWebhookEndpoints.filter(
		({ url }) => url.origin === expectedWebhook.origin,
	);
	const samePathWebhookEndpoints = parsedWebhookEndpoints.filter(
		({ url }) => url.pathname === expectedWebhook.pathname,
	);
	const usableSamePathWebhookEndpoints = samePathWebhookEndpoints.filter(
		({ endpoint }) =>
			endpoint.status === "enabled" && hasRequiredWebhookEvents(endpoint),
	);
	const enabledWebhookEndpoints = matchingWebhookEndpoints.filter(
		(endpoint) => endpoint.status === "enabled",
	);
	const completeWebhookEndpoints = enabledWebhookEndpoints.filter(
		hasRequiredWebhookEvents,
	);
	const findings = [];
	if (!account.details_submitted) {
		findings.push("The Stripe account has incomplete business details.");
	}
	if (!account.charges_enabled) {
		findings.push("Charges are not enabled for the Stripe account.");
	}
	if (!account.payouts_enabled) {
		findings.push("Payouts are not enabled for the Stripe account.");
	}
	if (new Set(configuredPriceIds).size !== configuredPriceIds.length) {
		findings.push("Two or more Stripe Price variables use the same Price.");
	}

	for (const price of prices) {
		if (!price.active)
			findings.push(`${price.environmentName} is inactive.`);
		if (!price.modeMatchesKey)
			findings.push(
				`${price.environmentName} is in the wrong Stripe mode.`,
			);
		if (!price.recurring)
			findings.push(`${price.environmentName} is not recurring.`);
		if (price.unitAmount !== price.expectedUnitAmount) {
			findings.push(
				`${price.environmentName} does not match its expected amount.`,
			);
		}
		if (
			price.interval !== price.expectedInterval ||
			price.intervalCount !== price.expectedIntervalCount
		) {
			findings.push(
				`${price.environmentName} does not match its expected billing interval.`,
			);
		}
		if (!price.productActive)
			findings.push(
				`${price.environmentName} belongs to an inactive product.`,
			);
	}
	if (portalConfiguration && portalConfiguration.active === false) {
		findings.push(
			"The configured billing portal configuration is inactive.",
		);
	}
	const portalFeatures = portalConfiguration?.features || {};
	if (portalConfiguration && !portalFeatures.payment_method_update?.enabled) {
		findings.push("The billing portal cannot update payment methods.");
	}
	if (portalConfiguration && !portalFeatures.subscription_cancel?.enabled) {
		findings.push("The billing portal cannot cancel subscriptions.");
	}
	if (portalConfiguration && !portalFeatures.subscription_update?.enabled) {
		findings.push("The billing portal cannot switch subscription options.");
	}
	if (portalConfiguration && !portalFeatures.invoice_history?.enabled) {
		findings.push("The billing portal does not expose invoice history.");
	}
	if (!matchingWebhookEndpoints.length) {
		if (samePathWebhookEndpoints.length) {
			findings.push(
				"The expected webhook route exists under a different origin.",
			);
		} else if (sameOriginWebhookEndpoints.length) {
			findings.push(
				"A webhook exists for APP_ORIGIN but uses a different route.",
			);
		} else {
			findings.push("No webhook endpoint matches APP_ORIGIN.");
		}
	} else if (!enabledWebhookEndpoints.length) {
		findings.push("The matching webhook endpoint is disabled.");
	} else if (!completeWebhookEndpoints.length) {
		findings.push(
			"The matching webhook endpoint is missing required events.",
		);
	}

	const report = {
		ok: findings.length === 0,
		mode: isLiveMode ? "live" : "test",
		account: {
			detailsSubmitted: account.details_submitted === true,
			chargesEnabled: account.charges_enabled === true,
			payoutsEnabled: account.payouts_enabled === true,
		},
		prices,
		portal: {
			configured: !!portalConfiguration,
			active: portalConfiguration?.active !== false,
			paymentMethodUpdateEnabled:
				portalFeatures.payment_method_update?.enabled === true,
			subscriptionCancelEnabled:
				portalFeatures.subscription_cancel?.enabled === true,
			subscriptionUpdateEnabled:
				portalFeatures.subscription_update?.enabled === true,
			invoiceHistoryEnabled:
				portalFeatures.invoice_history?.enabled === true,
		},
		webhook: {
			expectedOriginHost: expectedWebhook.host,
			samePathOriginHosts: [
				...new Set(samePathWebhookEndpoints.map(({ url }) => url.host)),
			],
			totalEndpointCount: webhookEndpoints.data.length,
			matchingEndpointCount: matchingWebhookEndpoints.length,
			sameOriginEndpointCount: sameOriginWebhookEndpoints.length,
			samePathEndpointCount: samePathWebhookEndpoints.length,
			samePathRequiredEventsComplete:
				usableSamePathWebhookEndpoints.length > 0,
			enabledEndpointCount: enabledWebhookEndpoints.length,
			requiredEventsComplete: completeWebhookEndpoints.length > 0,
		},
		findings,
	};

	console.log(JSON.stringify(report, null, 2));
	if (!report.ok) process.exitCode = 1;
}

main().catch((error) => {
	console.error(
		JSON.stringify({
			ok: false,
			errorType: String(error?.type || error?.name || "StripeAuditError"),
			code: error?.code ? String(error.code) : null,
			statusCode: Number.isInteger(error?.statusCode)
				? error.statusCode
				: null,
		}),
	);
	process.exitCode = 1;
});
