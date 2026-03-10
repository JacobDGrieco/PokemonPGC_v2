import crypto from "crypto";

const COOKIE_NAME = "ppgc_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function base64urlEncode(input) {
	return Buffer.from(input)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "");
}

function base64urlDecode(input) {
	const normalized = input
		.replace(/-/g, "+")
		.replace(/_/g, "/");
	const pad = normalized.length % 4;
	const padded = pad ? normalized + "=".repeat(4 - pad) : normalized;
	return Buffer.from(padded, "base64").toString("utf8");
}

function getSecret() {
	const secret = process.env.AUTH_SECRET;
	if (!secret) {
		throw new Error("Missing AUTH_SECRET environment variable.");
	}
	return secret;
}

function signValue(value) {
	return crypto
		.createHmac("sha256", getSecret())
		.update(value)
		.digest("base64url");
}

export function parseCookies(req) {
	const raw = req.headers?.cookie || "";
	const out = {};

	raw.split(";").forEach((part) => {
		const trimmed = part.trim();
		if (!trimmed) return;
		const eq = trimmed.indexOf("=");
		if (eq === -1) return;

		const key = trimmed.slice(0, eq).trim();
		const value = trimmed.slice(eq + 1).trim();
		out[key] = decodeURIComponent(value);
	});

	return out;
}

export function createSessionToken(user) {
	const payload = {
		userId: user.id,
		email: user.email,
		iat: Date.now(),
		exp: Date.now() + SESSION_TTL_MS,
	};

	const encodedPayload = base64urlEncode(JSON.stringify(payload));
	const signature = signValue(encodedPayload);

	return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token) {
	if (!token || !token.includes(".")) return null;

	const [encodedPayload, signature] = token.split(".");
	if (!encodedPayload || !signature) return null;

	const expected = signValue(encodedPayload);
	if (signature !== expected) return null;

	try {
		const payload = JSON.parse(base64urlDecode(encodedPayload));
		if (!payload?.userId || !payload?.exp) return null;
		if (Date.now() > payload.exp) return null;
		return payload;
	} catch {
		return null;
	}
}

export function setSessionCookie(res, user) {
	const token = createSessionToken(user);
	const isProd = process.env.NODE_ENV === "production";

	const cookie = [
		`${COOKIE_NAME}=${encodeURIComponent(token)}`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		`Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
	];

	if (isProd) {
		cookie.push("Secure");
	}

	res.setHeader("Set-Cookie", cookie.join("; "));
}

export function clearSessionCookie(res) {
	const isProd = process.env.NODE_ENV === "production";

	const cookie = [
		`${COOKIE_NAME}=`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		"Max-Age=0",
	];

	if (isProd) {
		cookie.push("Secure");
	}

	res.setHeader("Set-Cookie", cookie.join("; "));
}

export function getSessionFromRequest(req) {
	const cookies = parseCookies(req);
	const token = cookies[COOKIE_NAME];
	return verifySessionToken(token);
}

export async function readJsonBody(req) {
	if (req.body && typeof req.body === "object") {
		return req.body;
	}

	if (typeof req.body === "string") {
		try {
			return JSON.parse(req.body);
		} catch {
			return {};
		}
	}

	const chunks = [];
	for await (const chunk of req) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}

	if (!chunks.length) return {};

	const raw = Buffer.concat(chunks).toString("utf8");
	if (!raw) return {};

	try {
		return JSON.parse(raw);
	} catch {
		return {};
	}
}