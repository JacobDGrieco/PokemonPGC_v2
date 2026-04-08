import { RED_SPEC } from "./saveImportSpecs/red.js";

const SUPPORTED_SAVE_IMPORT_GAMES = new Set(["red"]);

export function isSaveImportSupported(gameKey) {
	return SUPPORTED_SAVE_IMPORT_GAMES.has(gameKey);
}

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

function parseRedSave(buf) {
	if (buf.length !== 32 * 1024) {
		throw new Error(`Unexpected Red save size: ${buf.length} bytes`);
	}

	let firstNonZero = buf.findIndex((b) => b !== 0);
	if (firstNonZero < 0) firstNonZero = 0;

	const previewOffset = Math.max(0, firstNonZero - 16);
	const hexPreview = buf.subarray(previewOffset, previewOffset + 32).toString("hex");
	const tasks = {};

	for (const rule of RED_SPEC.flags) {
		if (rule.type === "bitflag") {
			tasks[rule.id] = readBit(buf, rule.offset, rule.bit);
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
