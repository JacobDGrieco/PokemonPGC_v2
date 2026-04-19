import bcrypt from "bcryptjs";
import { prisma } from "../_lib/db.js";
import { json, methodNotAllowed, tooManyRequests } from "../_lib/response.js";
import { getRequestIp, checkRateLimit } from "../_lib/rateLimit.js";
import { validateCredentials } from "../_lib/validation.js";
import { readJsonBody, setSessionCookie } from "../_lib/auth.js";
import { getUserPublicSelect, serializeUser } from "../_lib/subscription.js";

export default async function handler(req, res) {
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
