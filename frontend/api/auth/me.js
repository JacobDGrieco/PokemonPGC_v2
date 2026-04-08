import { prisma } from "../_lib/db.js";
import { json, methodNotAllowed } from "../_lib/response.js";
import { getSessionFromRequest, readJsonBody } from "../_lib/auth.js";
import { validateIcon } from "../_lib/validation.js";

export default async function handler(req, res) {
	if (req.method === "GET") {
		return handleGet(req, res);
	}

	if (req.method === "PATCH") {
		return handlePatch(req, res);
	}

	return methodNotAllowed(res, ["GET", "PATCH"]);
}

async function handleGet(req, res) {
	const session = getSessionFromRequest(req);

	if (!session?.userId) {
		return json(res, 200, { user: null });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
			select: {
				id: true,
				email: true,
				icon: true,
			},
		});

		return json(res, 200, { user: user || null });
	} catch (err) {
		console.error("[auth/me GET] error:", err);
		return json(res, 500, { user: null });
	}
}

async function handlePatch(req, res) {
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
			data: {
				icon: parsed.icon,
			},
			select: {
				id: true,
				email: true,
				icon: true,
			},
		});

		return json(res, 200, { user });
	} catch (err) {
		console.error("[auth/me PATCH] error:", err);
		return json(res, 500, { error: "Internal error." });
	}
}
