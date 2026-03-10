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

		const existing = await prisma.user.findUnique({
			where: { email: normalizedEmail },
		});

		if (existing) {
			return json(res, 409, { error: "User already exists." });
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email: normalizedEmail,
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