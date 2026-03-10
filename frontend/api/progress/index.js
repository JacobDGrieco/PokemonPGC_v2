import { json, methodNotAllowed } from "../_lib/response.js";
import { getSessionFromRequest, readJsonBody } from "../_lib/auth.js";
import { getUserSaves, upsertUserSave } from "../_lib/progress.js";

export default async function handler(req, res) {
	if (req.method === "GET") {
		return handleGet(req, res);
	}

	if (req.method === "PUT") {
		return handlePut(req, res);
	}

	return methodNotAllowed(res, ["GET", "PUT"]);
}

async function handleGet(req, res) {
	const session = getSessionFromRequest(req);

	if (!session?.userId) {
		return json(res, 401, { error: "Not authenticated." });
	}

	try {
		const saves = await getUserSaves(session.userId);
		return json(res, 200, { saves });
	} catch (err) {
		console.error("[progress GET] error:", err);
		return json(res, 500, { error: "Internal error." });
	}
}

async function handlePut(req, res) {
	const session = getSessionFromRequest(req);

	if (!session?.userId) {
		return json(res, 401, { error: "Not authenticated." });
	}

	const body = await readJsonBody(req);
	const { gameKey, data } = body || {};

	if (!gameKey) {
		return json(res, 400, { error: "Missing gameKey." });
	}

	if (data == null) {
		return json(res, 400, { error: "Missing data." });
	}

	try {
		await upsertUserSave(session.userId, gameKey, data);
		return json(res, 200, { ok: true });
	} catch (err) {
		console.error("[progress PUT] error:", err);
		return json(res, 500, { error: "Internal error." });
	}
}