// backend/src/routes/saveImport.js
import express from "express";
import multer from "multer";
import { parseSaveForGame } from "../services/saveImport.js";

const router = express.Router();

// Store uploads in memory; saves are small and we only need them once.
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 1024 * 1024, // 1 MB limit for now; adjust if needed
	},
});

router.post("/:gameKey", upload.single("file"), (req, res) => {
	const { gameKey } = req.params;

	if (!req.file || !req.file.buffer) {
		return res.status(400).json({ error: "No save file uploaded." });
	}

	try {
		const result = parseSaveForGame(gameKey, req.file.buffer);

		// In the future we can apply 'result.tasks' to the DB here.
		// For now we just return it to the frontend for preview.
		return res.json(result);
	} catch (err) {
		console.error("[save-import] error:", err);
		return res
			.status(400)
			.json({ error: err.message || "Failed to parse save file." });
	}
});

export default router;
