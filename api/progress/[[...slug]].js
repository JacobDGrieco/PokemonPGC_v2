import { json, methodNotAllowed } from "../_lib/response.js";
import { getSessionFromRequest, readJsonBody } from "../_lib/auth.js";
import { prisma } from "../_lib/db.js";
import { getUserSaves, upsertUserSave } from "../_lib/progress.js";
import { validateGameKey, validateSnapshotPayload } from "../_lib/validation.js";

export default async function handler(req, res) {
	const slug = Array.isArray(req.query?.slug) ? req.query.slug : [];

	if (slug.length === 0) {
		return handleProgressIndex(req, res);
	}

	if (slug.length === 1) {
		req.query = { ...req.query, gameKey: slug[0] };
		return handleProgressByGame(req, res);
	}

	return json(res, 404, { error: "Not found." });
}

async function handleProgressIndex(req, res) {
	if (req.method === "GET") return handleProgressIndexGet(req, res);
	if (req.method === "PUT") return handleProgressIndexPut(req, res);
	return methodNotAllowed(res, ["GET", "PUT"]);
}

async function handleProgressIndexGet(req, res) {
	const session = await getSessionFromRequest(req);

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

async function handleProgressIndexPut(req, res) {
	const session = await getSessionFromRequest(req);

	if (!session?.userId) {
		return json(res, 401, { error: "Not authenticated." });
	}

	const body = await readJsonBody(req);
	const gameKeyResult = validateGameKey(body?.gameKey);
	const dataResult = validateSnapshotPayload(body?.data ?? body?.snapshot);

	if (!gameKeyResult.ok) {
		return json(res, 400, { error: gameKeyResult.error });
	}

	if (!dataResult.ok) {
		return json(res, 400, { error: dataResult.error });
	}

	try {
		await upsertUserSave(session.userId, gameKeyResult.gameKey, dataResult.data);
		return json(res, 200, { ok: true });
	} catch (err) {
		console.error("[progress PUT] error:", err);
		return json(res, 500, { error: "Internal error." });
	}
}

async function handleProgressByGame(req, res) {
	if (req.method === "GET") return handleProgressByGameGet(req, res);
	if (req.method === "PUT") return handleProgressByGamePut(req, res);
	return methodNotAllowed(res, ["GET", "PUT"]);
}

async function handleProgressByGameGet(req, res) {
	const session = await getSessionFromRequest(req);
	const parsedGameKey = validateGameKey(req.query?.gameKey);

	if (!session?.userId) {
		return json(res, 401, { error: "Not authenticated." });
	}

	if (!parsedGameKey.ok) {
		return json(res, 400, { error: parsedGameKey.error });
	}

	try {
		const save = await prisma.gameSave.findUnique({
			where: {
				userId_gameKey: {
					userId: session.userId,
					gameKey: parsedGameKey.gameKey,
				},
			},
		});

		if (!save) {
			return json(res, 404, { save: null });
		}

		return json(res, 200, {
			save: {
				gameKey: save.gameKey,
				data: save.data,
				updatedAt: save.updatedAt,
			},
		});
	} catch (error) {
		console.error("[progress GET by game] error:", error);
		return json(res, 500, { error: "Internal error." });
	}
}

async function handleProgressByGamePut(req, res) {
	const session = await getSessionFromRequest(req);
	const parsedGameKey = validateGameKey(req.query?.gameKey);

	if (!session?.userId) {
		return json(res, 401, { error: "Not authenticated." });
	}

	if (!parsedGameKey.ok) {
		return json(res, 400, { error: parsedGameKey.error });
	}

	const body = await readJsonBody(req);
	const data = body?.data ?? body?.snapshot ?? null;
	const parsedData = validateSnapshotPayload(data);

	if (!parsedData.ok) {
		return json(res, 400, { error: parsedData.error });
	}

	try {
		const save = await prisma.gameSave.upsert({
			where: {
				userId_gameKey: {
					userId: session.userId,
					gameKey: parsedGameKey.gameKey,
				},
			},
			update: {
				data: parsedData.data,
				updatedAt: new Date(),
			},
			create: {
				userId: session.userId,
				gameKey: parsedGameKey.gameKey,
				data: parsedData.data,
			},
		});

		return json(res, 200, { ok: true, save });
	} catch (error) {
		console.error("[progress PUT by game] error:", error);
		return json(res, 500, { error: "Internal error." });
	}
}
