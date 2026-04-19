import bcrypt from "bcryptjs";
import { prisma } from "../_lib/db.js";
import { json, methodNotAllowed, tooManyRequests } from "../_lib/response.js";
import { clearSessionCookie, getSessionFromRequest, readJsonBody, setSessionCookie } from "../_lib/auth.js";
import { getRequestIp, checkRateLimit } from "../_lib/rateLimit.js";
import { validateCredentials, validateIcon } from "../_lib/validation.js";
import { getUserPublicSelect, serializeUser } from "../_lib/subscription.js";

const AUTH_ACTIONS = new Set(["login", "logout", "me", "signup"]);

export default async function handler(req, res) {
	const action = String(req.query?.action || "").trim().toLowerCase();
	if (!AUTH_ACTIONS.has(action)) {
		return json(res, 404, { error: "Not found." });
	}

	switch (action) {
		case "login":
			return handleLogin(req, res);
		case "logout":
			return handleLogout(req, res);
		case "me":
			return handleMe(req, res);
		case "signup":
			return handleSignup(req, res);
		default:
			return json(res, 404, { error: "Not found." });
	}
}

async function handleLogin(req, res) {
	if (req.method !== "POST") {
		return methodNotAllowed(res, ["POST"]);
	}

	const rawBody = await readJsonBody(req);
	const parsed = validateCredentials(rawBody);
	if (!parsed.ok) {
		return json(res, 400, { error: parsed.error });
	}

	try {
		const { email, password } = parsed;
		const rateKey = `${getRequestIp(req)}:${email}`;
		const limit = checkRateLimit("auth-login", rateKey, { windowMs: 10 * 60 * 1000, max: 20 });
		if (!limit.ok) {
			return tooManyRequests(res);
		}

		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				passwordHash: true,
				...getUserPublicSelect(),
			},
		});

		if (!user) {
			return json(res, 401, { error: "Invalid email or password." });
		}

		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) {
			return json(res, 401, { error: "Invalid email or password." });
		}

		setSessionCookie(res, user);
		return json(res, 200, serializeUser(user));
	} catch (err) {
		console.error("[auth/login] error:", err);
		return json(res, 500, { error: "Internal error." });
	}
}

async function handleLogout(req, res) {
	if (req.method !== "POST") {
		return methodNotAllowed(res, ["POST"]);
	}

	clearSessionCookie(res);
	return json(res, 200, { ok: true });
}

async function handleMe(req, res) {
	if (req.method === "GET") {
		return handleGetMe(req, res);
	}

	if (req.method === "PATCH") {
		return handlePatchMe(req, res);
	}

	return methodNotAllowed(res, ["GET", "PATCH"]);
}

async function handleGetMe(req, res) {
	const session = getSessionFromRequest(req);

	if (!session?.userId) {
		return json(res, 200, { user: null });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: getUserPublicSelect(),
		});

		return json(res, 200, { user: serializeUser(user) });
	} catch (err) {
		console.error("[auth/me GET] error:", err);
		return json(res, 500, { user: null });
	}
}

async function handlePatchMe(req, res) {
	const session = getSessionFromRequest(req);

	if (!session?.userId) {
		return json(res, 401, { error: "Not authenticated." });
	}

	const parsed = validateIcon((await readJsonBody(req))?.icon);
	if (!parsed.ok) {
		return json(res, 400, { error: parsed.error });
	}

	try {
		const user = await prisma.user.update({
			where: { id: session.userId },
			data: { icon: parsed.icon },
			select: getUserPublicSelect(),
		});

		return json(res, 200, { user: serializeUser(user) });
	} catch (err) {
		console.error("[auth/me PATCH] error:", err);
		return json(res, 500, { error: "Internal error." });
	}
}

async function handleSignup(req, res) {
	if (req.method !== "POST") {
		return methodNotAllowed(res, ["POST"]);
	}

	const rateKey = getRequestIp(req);
	const limit = checkRateLimit("auth-signup", rateKey, { windowMs: 10 * 60 * 1000, max: 10 });
	if (!limit.ok) {
		return tooManyRequests(res);
	}

	const parsed = validateCredentials(await readJsonBody(req));
	if (!parsed.ok) {
		return json(res, 400, { error: parsed.error });
	}

	const { email, password } = parsed;

	try {
		const existing = await prisma.user.findUnique({
			where: { email },
		});

		if (existing) {
			return json(res, 409, { error: "User already exists." });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email,
				passwordHash,
				icon: "default",
			},
			select: getUserPublicSelect(),
		});

		setSessionCookie(res, user);
		return json(res, 200, serializeUser(user));
	} catch (err) {
		console.error("[auth/signup] error:", err);
		return json(res, 500, { error: "Internal error." });
	}
}
