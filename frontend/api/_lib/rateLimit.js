const buckets = new Map();

function now() {
	return Date.now();
}

export function getRequestIp(req) {
	const forwarded = req.headers["x-forwarded-for"];
	if (typeof forwarded === "string" && forwarded.trim()) {
		return forwarded.split(",")[0].trim();
	}
	return req.socket?.remoteAddress || "unknown";
}

export function checkRateLimit(scope, key, { windowMs, max }) {
	const bucketKey = `${scope}:${key}`;
	const ts = now();
	const existing = buckets.get(bucketKey);

	if (!existing || existing.resetAt <= ts) {
		buckets.set(bucketKey, { count: 1, resetAt: ts + windowMs });
		return { ok: true, remaining: max - 1, resetAt: ts + windowMs };
	}

	if (existing.count >= max) {
		return { ok: false, remaining: 0, resetAt: existing.resetAt };
	}

	existing.count += 1;
	return { ok: true, remaining: max - existing.count, resetAt: existing.resetAt };
}
