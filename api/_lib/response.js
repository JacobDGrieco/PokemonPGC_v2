function applySecurityHeaders(res) {
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("X-Frame-Options", "DENY");
	res.setHeader("Referrer-Policy", "same-origin");
	res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
	res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
	res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
	res.setHeader("Cache-Control", "no-store");
}

export function json(res, status, payload) {
	applySecurityHeaders(res);
	return res.status(status).json(payload);
}

export function tooManyRequests(res, payload = { error: "Too many requests." }) {
	return json(res, 429, payload);
}

export function methodNotAllowed(res, allowed = []) {
	if (allowed.length) {
		res.setHeader("Allow", allowed.join(", "));
	}
	return json(res, 405, { error: "Method not allowed." });
}
