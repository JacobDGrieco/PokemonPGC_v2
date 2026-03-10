import bcrypt from "bcryptjs";
import { prisma } from "../_lib/db.js";
import { json, methodNotAllowed } from "../_lib/response.js";
import { readJsonBody, setSessionCookie } from "../_lib/auth.js";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return methodNotAllowed(res, ["POST"]);
	}

	const { email, password } = await readJsonBody(req);

	if (!email || !password) {
		return json(res, 400, { error: "Email and password required." });
	}

	try {
		const normalizedEmail = String(email).trim().toLowerCase();

		const user = await prisma.user.findUnique({
			where: { email: normalizedEmail },
			select: {
				id: true,
				email: true,
				passwordHash: true,
				icon: true,
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

		return json(res, 200, {
			id: user.id,
			email: user.email,
			icon: user.icon,
		});
	} catch (err) {
		console.error("[auth/login] error:", err);
		return json(res, 500, { error: "Internal error." });
	}
}