// backend/src/services/saveImport.js
// Central place to parse raw save files into "task values" for each game.

const SUPPORTED_SAVE_IMPORT_GAMES = new Set(["red"]);
import { RED_SPEC } from "./red.js";

/** Quick runtime check for frontend/backend alignment if needed */
export function isSaveImportSupported(gameKey) {
	return SUPPORTED_SAVE_IMPORT_GAMES.has(gameKey);
}

/**
 * Entry point: parse a save for a specific game.
 * - gameKey: e.g. "red"
 * - buf: Node.js Buffer with the raw .sav contents
 */
export function parseSaveForGame(gameKey, buf) {
	if (!isSaveImportSupported(gameKey)) {
		throw new Error(`Save import is not enabled for game: ${gameKey}`);
	}

	switch (gameKey) {
		case "red":
			return parseRedSave(buf);
		default:
			throw new Error(`No save parser implemented for game: ${gameKey}`);
	}
}

function readBit(buf, offset, bit) {
	const byte = buf[offset];
	return ((byte >> bit) & 1) === 1;
}

/**
 * Example parser for Pokémon Red.
 * Right now this:
 *   - sanity-checks file size
 *   - returns a hex preview
 *   - shows where task mapping will eventually go
 *
 * Later, we'll:
 *   - add proper validation (to distinguish Red vs Blue, etc.)
 *   - map individual bits/bytes to specific PPGC task IDs.
 */
function parseRedSave(buf) {
	// Size sanity check (32 KB SRAM)
	if (buf.length !== 32 * 1024) {
		throw new Error(`Unexpected Red save size: ${buf.length} bytes`);
	}

	let firstNonZero = buf.findIndex((b) => b !== 0);
	if (firstNonZero < 0) firstNonZero = 0;

	const previewOffset = Math.max(0, firstNonZero - 16);
	const hexPreview = buf.subarray(previewOffset, previewOffset + 32).toString("hex");

	// ---- Apply RED_SPEC mappings ----
	const tasks = {};

	for (const rule of RED_SPEC.flags) {
		if (rule.type === "bitflag") {
			const value = readBit(buf, rule.offset, rule.bit);
			tasks[rule.id] = value;
		} else if (rule.type === "nonzero-byte") {
			const byte = buf[rule.offset] ?? 0;
			tasks[rule.id] = byte !== 0;
		}
	}

	return {
		gameKey: "red",
		size: buf.length,
		hexPreview,
		hexOffset: previewOffset,
		tasks,
	};
}
