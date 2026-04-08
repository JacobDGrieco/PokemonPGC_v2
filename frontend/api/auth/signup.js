import bcrypt from "bcryptjs";
import { prisma } from "../_lib/db.js";
import { json, methodNotAllowed, tooManyRequests } from "../_lib/response.js";
import { getRequestIp, checkRateLimit } from "../_lib/rateLimit.js";
import { validateCredentials } from "../_lib/validation.js";
import { readJsonBody, setSessionCookie } from "../_lib/auth.js";

export default async function handler(req, res) {
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
			select: {
				id: true,
				email: true,
				icon: true,
			},
		});

		setSessionCookie(res, user);
		return json(res, 200, user);
	} catch (err) {
		console.error("[auth/signup] error:", err);
		return json(res, 500, { error: "Internal error." });
	}
}
