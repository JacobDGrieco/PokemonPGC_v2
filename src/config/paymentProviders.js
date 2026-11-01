/**
 * Build-time availability for starting new subscriptions.
 *
 * These flags control only which checkout choices the browser offers. Server
 * ownership checks, provider credentials, and webhook verification remain the
 * authority for every billing change.
 */
export function parsePaymentProviderFlag(value, fallback) {
	const normalized = String(value ?? "")
		.trim()
		.toLowerCase();
	if (!normalized) return fallback;
	if (["1", "true", "yes", "on"].includes(normalized)) return true;
	if (["0", "false", "no", "off"].includes(normalized)) return false;
	return fallback;
}

const clientEnvironment = import.meta.env || {};

export const PAYMENT_PROVIDER_AVAILABILITY = Object.freeze({
	stripe: parsePaymentProviderFlag(
		clientEnvironment.VITE_STRIPE_ENABLED,
		true,
	),
	paypal: parsePaymentProviderFlag(
		clientEnvironment.VITE_PAYPAL_ENABLED,
		false,
	),
});
