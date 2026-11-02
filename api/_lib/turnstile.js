/**
 * Cloudflare Turnstile server verification. Authentication routes fail closed
 * when production credentials are missing or the one-time token is rejected.
 */
const TURNSTILE_VERIFY_URL =
	"https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";
const TURNSTILE_MAX_TOKEN_LENGTH = 2048;

export const TURNSTILE_AUTH_ACTIONS = Object.freeze({
	login: "auth_login",
	signup: "auth_signup",
});

export function getTurnstileSecret(environment = process.env) {
	const configuredSecret = String(
		environment.TURNSTILE_SECRET_KEY || "",
	).trim();
	if (configuredSecret) {
		if (
			environment.NODE_ENV === "production" &&
			configuredSecret === TURNSTILE_TEST_SECRET
		) {
			return "";
		}
		return configuredSecret;
	}
	return environment.NODE_ENV === "production" ? "" : TURNSTILE_TEST_SECRET;
}

export function getTurnstileAllowedHostnames(environment = process.env) {
	if (environment.NODE_ENV !== "production") return [];
	const candidates = [
		environment.APP_ORIGIN,
		environment.VERCEL_URL,
		environment.VERCEL_PROJECT_PRODUCTION_URL,
	];
	return [
		...new Set(
			candidates.flatMap((candidate) => {
				const normalized = String(candidate || "").trim();
				if (!normalized) return [];
				try {
					return [
						new URL(
							normalized.includes("://")
								? normalized
								: `https://${normalized}`,
						).hostname,
					];
				} catch {
					return [];
				}
			}),
		),
	];
}

export function evaluateTurnstileResponse(
	payload,
	expectedAction,
	allowedHostnames = [],
) {
	if (!payload || typeof payload !== "object") {
		return { valid: false, retryable: true, reason: "invalid-response" };
	}
	if (payload.success !== true) {
		return { valid: false, retryable: false, reason: "challenge-rejected" };
	}
	if (String(payload.action || "") !== expectedAction) {
		return { valid: false, retryable: false, reason: "action-mismatch" };
	}
	const hostname = String(payload.hostname || "");
	if (allowedHostnames.length && !allowedHostnames.includes(hostname)) {
		return { valid: false, retryable: false, reason: "hostname-mismatch" };
	}
	return {
		valid: true,
		retryable: false,
		reason: "verified",
		hostname: hostname || null,
	};
}

export async function verifyTurnstileToken(
	token,
	{
		expectedAction,
		environment = process.env,
		fetchImpl = globalThis.fetch,
	} = {},
) {
	const normalizedToken = String(token || "").trim();
	if (
		!normalizedToken ||
		normalizedToken.length > TURNSTILE_MAX_TOKEN_LENGTH ||
		!Object.values(TURNSTILE_AUTH_ACTIONS).includes(expectedAction)
	) {
		return { valid: false, retryable: false, reason: "invalid-request" };
	}

	const secret = getTurnstileSecret(environment);
	const allowedHostnames = getTurnstileAllowedHostnames(environment);
	if (
		!secret ||
		typeof fetchImpl !== "function" ||
		(environment.NODE_ENV === "production" && !allowedHostnames.length)
	) {
		return { valid: false, retryable: true, reason: "misconfigured" };
	}

	try {
		const body = new URLSearchParams({
			secret,
			response: normalizedToken,
		});
		const response = await fetchImpl(TURNSTILE_VERIFY_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body,
			signal: AbortSignal.timeout(5_000),
		});
		if (!response.ok) {
			return {
				valid: false,
				retryable: true,
				reason: "provider-unavailable",
			};
		}
		return evaluateTurnstileResponse(
			await response.json(),
			expectedAction,
			allowedHostnames,
		);
	} catch {
		return {
			valid: false,
			retryable: true,
			reason: "provider-unavailable",
		};
	}
}
