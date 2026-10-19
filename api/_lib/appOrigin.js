/**
 * Resolves the canonical browser origin used in externally delivered links.
 * Request-controlled Origin and forwarded-host headers are intentionally ignored.
 */
export function getAppOrigin(req) {
	const configuredOrigin = String(process.env.APP_ORIGIN || "").trim();
	if (configuredOrigin) return normalizeAppOrigin(configuredOrigin);

	const vercelHost = String(
		process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "",
	).trim();
	if (vercelHost) return normalizeAppOrigin(vercelHost, "https:");

	if (process.env.NODE_ENV !== "production") {
		const requestHost = String(req?.headers?.host || "").trim();
		if (requestHost) {
			const localOrigin = normalizeAppOrigin(requestHost, "http:");
			const hostname = new URL(localOrigin).hostname;
			if (["localhost", "127.0.0.1", "::1"].includes(hostname)) return localOrigin;
		}
		return "http://127.0.0.1:5173";
	}

	throw new Error("Missing APP_ORIGIN environment variable.");
}

export function normalizeAppOrigin(value, defaultProtocol = "https:") {
	const raw = String(value || "").trim();
	if (!raw) throw new Error("Application origin is required.");
	if (/^[a-z][a-z\d+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw)) {
		throw new Error("Application origin must use HTTP or HTTPS.");
	}

	const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(raw)
		? raw
		: `${defaultProtocol}//${raw}`;
	let url;
	try {
		url = new URL(withProtocol);
	} catch {
		throw new Error("Application origin must be a valid URL.");
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") {
		throw new Error("Application origin must use HTTP or HTTPS.");
	}
	if (url.username || url.password) {
		throw new Error("Application origin must not contain credentials.");
	}
	return url.origin;
}
