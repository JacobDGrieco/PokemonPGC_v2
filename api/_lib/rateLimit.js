/**
 * Best-effort per-process request throttling for server handlers.
 * Buckets reset on cold start and are not shared across serverless instances;
 * this must not be represented as a distributed production abuse control.
 */
const buckets = new Map();
const MAX_BUCKETS = 10_000;
const SWEEP_INTERVAL_MS = 60_000;
let nextSweepAt = 0;

function pruneBuckets(timestampMs) {
	if (timestampMs >= nextSweepAt) {
		for (const [bucketKey, bucket] of buckets) {
			if (bucket.resetAt <= timestampMs) buckets.delete(bucketKey);
		}
		nextSweepAt = timestampMs + SWEEP_INTERVAL_MS;
	}

	while (buckets.size >= MAX_BUCKETS) {
		const oldestKey = buckets.keys().next().value;
		if (oldestKey === undefined) break;
		buckets.delete(oldestKey);
	}
}

export function getRequestIp(req) {
	const forwarded = req.headers?.["x-forwarded-for"];
	if (typeof forwarded === "string" && forwarded.trim()) {
		return forwarded.split(",")[0].trim().slice(0, 128) || "unknown";
	}
	return String(req.socket?.remoteAddress || "unknown").slice(0, 128);
}

export function checkRateLimit(
	scope,
	key,
	{ windowMs, max, nowMs = Date.now() },
) {
	if (!Number.isFinite(windowMs) || windowMs <= 0) {
		throw new Error("Rate-limit windowMs must be positive.");
	}
	if (!Number.isInteger(max) || max <= 0) {
		throw new Error("Rate-limit max must be a positive integer.");
	}

	const bucketKey = `${String(scope)}:${String(key)}`;
	const ts = Number(nowMs);
	pruneBuckets(ts);
	const existing = buckets.get(bucketKey);

	if (!existing || existing.resetAt <= ts) {
		buckets.set(bucketKey, { count: 1, resetAt: ts + windowMs });
		return {
			ok: true,
			remaining: max - 1,
			resetAt: ts + windowMs,
			retryAfterSeconds: 0,
		};
	}

	if (existing.count >= max) {
		return {
			ok: false,
			remaining: 0,
			resetAt: existing.resetAt,
			retryAfterSeconds: Math.max(
				1,
				Math.ceil((existing.resetAt - ts) / 1000),
			),
		};
	}

	existing.count += 1;
	return {
		ok: true,
		remaining: max - existing.count,
		resetAt: existing.resetAt,
		retryAfterSeconds: 0,
	};
}
