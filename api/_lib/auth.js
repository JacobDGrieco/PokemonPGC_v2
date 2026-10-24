/**
 * Server-only signed-cookie session and request-body helpers.
 *
 * Sessions are HMAC-signed custom payloads, then checked against the user's
 * database `sessionVersion` so password reset can revoke every older cookie.
 */
import crypto from "crypto";
import { prisma } from "./db.js";

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
	const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
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

function signaturesMatch(left, right) {
	const leftBuf = Buffer.from(String(left || ""));
	const rightBuf = Buffer.from(String(right || ""));
	if (leftBuf.length !== rightBuf.length) return false;
	return crypto.timingSafeEqual(leftBuf, rightBuf);
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
		sessionVersion: Number.isInteger(user.sessionVersion)
			? user.sessionVersion
			: 0,
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
	if (!signaturesMatch(signature, expected)) return null;

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
		"Priority=High",
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
		"Priority=High",
	];

	if (isProd) {
		cookie.push("Secure");
	}

	res.setHeader("Set-Cookie", cookie.join("; "));
}

/**
 * Validates both the cookie signature and the user's current session version.
 * Legacy cookies are version zero and remain valid until a password reset bumps
 * the database value, which revokes every previously issued cookie.
 */
export async function getSessionFromRequest(req) {
	const cookies = parseCookies(req);
	const token = cookies[COOKIE_NAME];
	const session = verifySessionToken(token);
	if (!session?.userId) return null;

	const user = await prisma.user.findUnique({
		where: { id: session.userId },
		select: { sessionVersion: true },
	});
	if (!user) return null;
	const cookieVersion = Number.isInteger(session.sessionVersion)
		? session.sessionVersion
		: 0;
	return user.sessionVersion === cookieVersion ? session : null;
}

/** Reads a parsed or streamed JSON body, returning an empty object on invalid JSON. */
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

export async function readRawBody(req) {
	if (Buffer.isBuffer(req.body)) {
		return req.body.toString("utf8");
	}

	if (typeof req.body === "string") {
		return req.body;
	}

	if (req.body && typeof req.body === "object") {
		return JSON.stringify(req.body);
	}

	const chunks = [];
	for await (const chunk of req) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}

	if (!chunks.length) return "";
	return Buffer.concat(chunks).toString("utf8");
}
