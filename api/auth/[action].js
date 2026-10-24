/**
 * Multiplexed authentication/account handler for signup, login, profile,
 * verification, and password recovery. Enumeration-sensitive actions return
 * generic messages and raw one-time tokens are never stored or logged.
 */
import bcrypt from "bcryptjs";
import { prisma } from "../_lib/db.js";
import { json, methodNotAllowed, tooManyRequests } from "../_lib/response.js";
import {
	clearSessionCookie,
	getSessionFromRequest,
	readJsonBody,
	setSessionCookie,
} from "../_lib/auth.js";
import { getRequestIp, checkRateLimit } from "../_lib/rateLimit.js";
import {
	validateCredentials,
	validateEmail,
	validateIcon,
	validatePassword,
} from "../_lib/validation.js";
import { getUserPublicSelect, serializeUser } from "../_lib/subscription.js";
import { getAppOrigin } from "../_lib/appOrigin.js";
import {
	AUTH_TOKEN_PURPOSES,
	EMAIL_VERIFICATION_TTL_MS,
	PASSWORD_RESET_TTL_MS,
	buildAuthActionUrl,
	hashAuthToken,
	hashRateLimitIdentity,
	isValidRawAuthToken,
	issueAuthToken,
	revokeAuthToken,
	wasAuthTokenIssuedRecently,
} from "../_lib/authTokens.js";
import { sendAuthEmail } from "../_lib/email.js";

const AUTH_ACTIONS = new Set([
	"forgot-password",
	"login",
	"logout",
	"me",
	"resend-verification",
	"reset-password",
	"signup",
	"verify-email",
]);
const GENERIC_FORGOT_MESSAGE =
	"If that address has an eligible account, a password-reset email is on the way.";
const GENERIC_RESEND_MESSAGE =
	"If that address has an unverified account, a verification email is on the way.";

export default async function handler(req, res) {
	const action = String(req.query?.action || "")
		.trim()
		.toLowerCase();
	if (!AUTH_ACTIONS.has(action))
		return json(res, 404, { error: "Not found." });

	switch (action) {
		case "forgot-password":
			return handleForgotPassword(req, res);
		case "login":
			return handleLogin(req, res);
		case "logout":
			return handleLogout(req, res);
		case "me":
			return handleMe(req, res);
		case "resend-verification":
			return handleResendVerification(req, res);
		case "reset-password":
			return handleResetPassword(req, res);
		case "signup":
			return handleSignup(req, res);
		case "verify-email":
			return handleVerifyEmail(req, res);
		default:
			return json(res, 404, { error: "Not found." });
	}
}

function enforceEmailActionRateLimit(req, res, scope, email, max = 5) {
	const identity = hashRateLimitIdentity(email);
	const rateKey = `${getRequestIp(req)}:${identity}`;
	const limit = checkRateLimit(scope, rateKey, {
		windowMs: 15 * 60 * 1000,
		max,
	});
	if (limit.ok) return true;
	tooManyRequests(res, {
		error: "Too many requests. Please wait and try again.",
	});
	return false;
}

function getSafeDeliveryError(error) {
	return {
		code: String(error?.code || "EMAIL_DELIVERY_FAILED"),
		responseCode: Number.isInteger(error?.responseCode)
			? error.responseCode
			: undefined,
	};
}

async function issueAndSendAuthEmail({
	req,
	user,
	purpose,
	ttlMs,
	kind,
	path,
}) {
	const issued = await issueAuthToken({ userId: user.id, purpose, ttlMs });
	try {
		const actionUrl = buildAuthActionUrl(
			getAppOrigin(req),
			path,
			issued.rawToken,
		);
		await sendAuthEmail({ to: user.email, kind, actionUrl });
	} catch (error) {
		await revokeAuthToken(issued.rawToken).catch(() => {});
		throw error;
	}
}

async function handleLogin(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const parsed = validateCredentials(await readJsonBody(req));
	if (!parsed.ok) return json(res, 400, { error: parsed.error });

	try {
		const { email, password } = parsed;
		const rateKey = `${getRequestIp(req)}:${hashRateLimitIdentity(email)}`;
		const limit = checkRateLimit("auth-login", rateKey, {
			windowMs: 10 * 60 * 1000,
			max: 20,
		});
		if (!limit.ok) return tooManyRequests(res);

		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				passwordHash: true,
				emailVerifiedAt: true,
				sessionVersion: true,
				...getUserPublicSelect(),
			},
		});

		if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
			return json(res, 401, { error: "Invalid email or password." });
		}
		if (!user.emailVerifiedAt) {
			return json(res, 403, {
				error: "Verify your email before logging in.",
				code: "EMAIL_NOT_VERIFIED",
			});
		}

		setSessionCookie(res, user);
		return json(res, 200, serializeUser(user));
	} catch (error) {
		console.error("[auth/login] error:", error);
		return json(res, 500, { error: "Internal error." });
	}
}

async function handleLogout(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
	clearSessionCookie(res);
	return json(res, 200, { ok: true });
}

async function handleMe(req, res) {
	if (req.method === "GET") return handleGetMe(req, res);
	if (req.method === "PATCH") return handlePatchMe(req, res);
	return methodNotAllowed(res, ["GET", "PATCH"]);
}

async function handleGetMe(req, res) {
	const session = await getSessionFromRequest(req);
	if (!session?.userId) return json(res, 200, { user: null });

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: getUserPublicSelect(),
		});
		return json(res, 200, { user: serializeUser(user) });
	} catch (error) {
		console.error("[auth/me GET] error:", error);
		return json(res, 500, { user: null });
	}
}

async function handlePatchMe(req, res) {
	const session = await getSessionFromRequest(req);
	if (!session?.userId)
		return json(res, 401, { error: "Not authenticated." });

	const parsed = validateIcon((await readJsonBody(req))?.icon);
	if (!parsed.ok) return json(res, 400, { error: parsed.error });

	try {
		const user = await prisma.user.update({
			where: { id: session.userId },
			data: { icon: parsed.icon },
			select: getUserPublicSelect(),
		});
		return json(res, 200, { user: serializeUser(user) });
	} catch (error) {
		console.error("[auth/me PATCH] error:", error);
		return json(res, 500, { error: "Internal error." });
	}
}

async function handleSignup(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

	const limit = checkRateLimit("auth-signup", getRequestIp(req), {
		windowMs: 10 * 60 * 1000,
		max: 10,
	});
	if (!limit.ok) return tooManyRequests(res);

	const parsed = validateCredentials(await readJsonBody(req));
	if (!parsed.ok) return json(res, 400, { error: parsed.error });
	const { email, password } = parsed;

	try {
		const existing = await prisma.user.findUnique({
			where: { email },
			select: { emailVerifiedAt: true },
		});
		if (existing) {
			return json(res, 409, {
				error: existing.emailVerifiedAt
					? "An account already exists for this email."
					: "This account is waiting for email verification.",
				code: existing.emailVerifiedAt
					? "ACCOUNT_EXISTS"
					: "EMAIL_NOT_VERIFIED",
			});
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			// The database default verifies legacy/admin-created rows during rollout;
			// public signup must always opt into the unverified state explicitly.
			data: {
				email,
				passwordHash,
				emailVerifiedAt: null,
				icon: "default",
			},
			select: { id: true, email: true },
		});

		try {
			await issueAndSendAuthEmail({
				req,
				user,
				purpose: AUTH_TOKEN_PURPOSES.EMAIL_VERIFY,
				ttlMs: EMAIL_VERIFICATION_TTL_MS,
				kind: "verify",
				path: "/auth/verify-email",
			});
		} catch (error) {
			console.error(
				"[auth/signup] verification delivery failed:",
				getSafeDeliveryError(error),
			);
			return json(res, 503, {
				error: "Your account was created, but the verification email could not be sent. Use resend verification to try again.",
				code: "EMAIL_DELIVERY_FAILED",
			});
		}

		return json(res, 201, {
			ok: true,
			verificationRequired: true,
			message:
				"Account created. Check your email to verify it before logging in.",
		});
	} catch (error) {
		if (error?.code === "P2002") {
			return json(res, 409, {
				error: "An account already exists for this email.",
				code: "ACCOUNT_EXISTS",
			});
		}
		console.error("[auth/signup] error:", error);
		return json(res, 500, { error: "Internal error." });
	}
}

async function handleResendVerification(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
	const parsed = validateEmail((await readJsonBody(req))?.email);
	if (!parsed.ok) return json(res, 400, { error: parsed.error });
	if (
		!enforceEmailActionRateLimit(
			req,
			res,
			"auth-resend-verification",
			parsed.email,
		)
	)
		return;

	try {
		const user = await prisma.user.findUnique({
			where: { email: parsed.email },
			select: { id: true, email: true, emailVerifiedAt: true },
		});
		if (user && !user.emailVerifiedAt) {
			const recentlyIssued = await wasAuthTokenIssuedRecently(
				user.id,
				AUTH_TOKEN_PURPOSES.EMAIL_VERIFY,
			);
			if (!recentlyIssued) {
				await issueAndSendAuthEmail({
					req,
					user,
					purpose: AUTH_TOKEN_PURPOSES.EMAIL_VERIFY,
					ttlMs: EMAIL_VERIFICATION_TTL_MS,
					kind: "verify",
					path: "/auth/verify-email",
				});
			}
		}
	} catch (error) {
		console.error(
			"[auth/resend-verification] delivery failed:",
			getSafeDeliveryError(error),
		);
	}
	return json(res, 200, { ok: true, message: GENERIC_RESEND_MESSAGE });
}

async function handleForgotPassword(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
	const parsed = validateEmail((await readJsonBody(req))?.email);
	if (!parsed.ok) return json(res, 400, { error: parsed.error });
	if (
		!enforceEmailActionRateLimit(
			req,
			res,
			"auth-forgot-password",
			parsed.email,
		)
	)
		return;

	try {
		const user = await prisma.user.findUnique({
			where: { email: parsed.email },
			select: { id: true, email: true, emailVerifiedAt: true },
		});
		if (user?.emailVerifiedAt) {
			const recentlyIssued = await wasAuthTokenIssuedRecently(
				user.id,
				AUTH_TOKEN_PURPOSES.PASSWORD_RESET,
			);
			if (!recentlyIssued) {
				await issueAndSendAuthEmail({
					req,
					user,
					purpose: AUTH_TOKEN_PURPOSES.PASSWORD_RESET,
					ttlMs: PASSWORD_RESET_TTL_MS,
					kind: "reset",
					path: "/auth/reset-password",
				});
			}
		}
	} catch (error) {
		console.error(
			"[auth/forgot-password] delivery failed:",
			getSafeDeliveryError(error),
		);
	}
	return json(res, 200, { ok: true, message: GENERIC_FORGOT_MESSAGE });
}

async function handleVerifyEmail(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
	const limit = checkRateLimit("auth-verify-email", getRequestIp(req), {
		windowMs: 15 * 60 * 1000,
		max: 20,
	});
	if (!limit.ok) return tooManyRequests(res);
	const rawToken = String((await readJsonBody(req))?.token || "");
	if (!isValidRawAuthToken(rawToken))
		return json(res, 400, {
			error: "This verification link is invalid or expired.",
		});

	try {
		const tokenHash = hashAuthToken(rawToken);
		const outcome = await prisma.$transaction(async (tx) => {
			const token = await tx.authToken.findUnique({
				where: { tokenHash },
			});
			if (
				!token ||
				token.purpose !== AUTH_TOKEN_PURPOSES.EMAIL_VERIFY ||
				token.expiresAt <= new Date()
			) {
				if (token)
					await tx.authToken.deleteMany({ where: { id: token.id } });
				return null;
			}
			const consumed = await tx.authToken.deleteMany({
				where: { id: token.id, tokenHash },
			});
			if (consumed.count !== 1) return null;
			await tx.user.update({
				where: { id: token.userId },
				data: { emailVerifiedAt: new Date() },
			});
			await tx.authToken.deleteMany({
				where: {
					userId: token.userId,
					purpose: AUTH_TOKEN_PURPOSES.EMAIL_VERIFY,
				},
			});
			return { userId: token.userId };
		});

		if (!outcome)
			return json(res, 400, {
				error: "This verification link is invalid or expired.",
			});
		return json(res, 200, {
			ok: true,
			message: "Email verified. You can now log in.",
		});
	} catch (error) {
		console.error("[auth/verify-email] error:", error);
		return json(res, 500, {
			error: "Email verification could not be completed.",
		});
	}
}

async function handleResetPassword(req, res) {
	if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
	const limit = checkRateLimit("auth-reset-password", getRequestIp(req), {
		windowMs: 15 * 60 * 1000,
		max: 10,
	});
	if (!limit.ok) return tooManyRequests(res);
	const body = await readJsonBody(req);
	const rawToken = String(body?.token || "");
	const passwordResult = validatePassword(body?.password);
	if (!isValidRawAuthToken(rawToken))
		return json(res, 400, {
			error: "This password-reset link is invalid or expired.",
		});
	if (!passwordResult.ok)
		return json(res, 400, { error: passwordResult.error });

	try {
		const tokenHash = hashAuthToken(rawToken);
		const passwordHash = await bcrypt.hash(passwordResult.password, 10);
		const outcome = await prisma.$transaction(async (tx) => {
			const token = await tx.authToken.findUnique({
				where: { tokenHash },
			});
			if (
				!token ||
				token.purpose !== AUTH_TOKEN_PURPOSES.PASSWORD_RESET ||
				token.expiresAt <= new Date()
			) {
				if (token)
					await tx.authToken.deleteMany({ where: { id: token.id } });
				return null;
			}
			const consumed = await tx.authToken.deleteMany({
				where: { id: token.id, tokenHash },
			});
			if (consumed.count !== 1) return null;
			await tx.user.update({
				where: { id: token.userId },
				data: { passwordHash, sessionVersion: { increment: 1 } },
			});
			await tx.authToken.deleteMany({
				where: {
					userId: token.userId,
					purpose: AUTH_TOKEN_PURPOSES.PASSWORD_RESET,
				},
			});
			return { userId: token.userId };
		});

		if (!outcome)
			return json(res, 400, {
				error: "This password-reset link is invalid or expired.",
			});
		clearSessionCookie(res);
		return json(res, 200, {
			ok: true,
			message:
				"Password updated. All existing sessions have been signed out.",
		});
	} catch (error) {
		console.error("[auth/reset-password] error:", error);
		return json(res, 500, {
			error: "Password reset could not be completed.",
		});
	}
}
