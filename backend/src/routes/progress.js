// backend/src/routes/progress.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

function requireAuth(req, res, next) {
	const userId = req.session?.userId;
	if (!userId) {
		return res.status(401).json({ error: "Not authenticated" });
	}
	// normalize so other handlers can just use req.user.id
	req.user = { id: userId };
	next();
}

// GET /api/progress/:gameKey
router.get("/:gameKey", requireAuth, async (req, res) => {
	const { gameKey } = req.params;
	const userId = req.user.id;

	try {
		const save = await prisma.gameSave.findUnique({
			where: {
				userId_gameKey: {
					userId,
					gameKey,
				},
			},
		});

		if (!save) {
			return res.status(404).json({ save: null });
		}

		return res.json({
			save: {
				gameKey: save.gameKey,
				data: save.data,
				updatedAt: save.updatedAt,
			},
		});
	} catch (err) {
		console.error("[progress] GET error:", err);
		return res.status(500).json({ error: "Internal error." });
	}
});

// PUT /api/progress/:gameKey
router.put("/:gameKey", requireAuth, async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { gameKey } = req.params;
		const data = req.body?.data || req.body?.snapshot || null;

		if (!gameKey || !data) {
			return res.status(400).json({ error: "Missing gameKey or data" });
		}

		const save = await prisma.gameSave.upsert({
			where: {
				userId_gameKey: { userId, gameKey },
			},
			update: {
				data,
				updatedAt: new Date(),
			},
			create: {
				userId,
				gameKey,
				data,
			},
		});

		res.json({ ok: true, save });
	} catch (err) {
		console.error("[progress] PUT error:", err);
		next(err);
	}
});

export default router;
