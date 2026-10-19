import crypto from "crypto";
import { prisma } from "./db.js";

export const AUTH_TOKEN_PURPOSES = Object.freeze({
	EMAIL_VERIFY: "EMAIL_VERIFY",
	PASSWORD_RESET: "PASSWORD_RESET",
});

export const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
export const AUTH_TOKEN_REQUEST_COOLDOWN_MS = 60 * 1000;

export function createRawAuthToken() {
	return crypto.randomBytes(32).toString("base64url");
}

export function hashAuthToken(rawToken) {
	return crypto.createHash("sha256").update(String(rawToken || ""), "utf8").digest("hex");
}

export function hashRateLimitIdentity(value) {
	return crypto.createHash("sha256").update(String(value || ""), "utf8").digest("hex").slice(0, 24);
}

export function isValidRawAuthToken(rawToken) {
	return /^[A-Za-z0-9_-]{40,128}$/.test(String(rawToken || ""));
}

export function buildAuthActionUrl(origin, path, rawToken) {
	if (!isValidRawAuthToken(rawToken)) throw new Error("Invalid authentication token.");
	const url = new URL(path, `${String(origin || "").replace(/\/+$/, "")}/`);
	url.searchParams.set("token", rawToken);
	return url.toString();
}

/**
 * Replaces any prior token for the same purpose. Only the digest is persisted;
 * the raw value exists long enough to be delivered through the side channel.
 */
export async function issueAuthToken({ userId, purpose, ttlMs, now = new Date() }) {
	if (!Object.values(AUTH_TOKEN_PURPOSES).includes(purpose)) {
		throw new Error("Invalid authentication token purpose.");
	}
	const rawToken = createRawAuthToken();
	const tokenHash = hashAuthToken(rawToken);
	const expiresAt = new Date(now.getTime() + ttlMs);

	await prisma.$transaction([
		prisma.authToken.deleteMany({ where: { userId, purpose } }),
		prisma.authToken.create({ data: { userId, purpose, tokenHash, expiresAt } }),
	]);

	return { rawToken, tokenHash, expiresAt };
}

export async function revokeAuthToken(rawToken) {
	if (!isValidRawAuthToken(rawToken)) return;
	await prisma.authToken.deleteMany({ where: { tokenHash: hashAuthToken(rawToken) } });
}

export async function wasAuthTokenIssuedRecently(userId, purpose, now = new Date()) {
	const threshold = new Date(now.getTime() - AUTH_TOKEN_REQUEST_COOLDOWN_MS);
	const recent = await prisma.authToken.findFirst({
		where: {
			userId,
			purpose,
			createdAt: { gte: threshold },
		},
		select: { id: true },
	});
	return !!recent;
}
