import { ensureDataRoot, ensurePpgcRoot } from "./runtime/globals.js";
import { range } from "../data/helpers/range.js";

/**
 * Deep-merge plain-object source into target.
 * - Nested plain objects are merged recursively.
 * - Arrays and primitives are overwritten.
 */
function deepMerge(target, source, path = "DATA") {
	target = target && typeof target === "object" ? target : {};

	// EXPANDER
	if (source && typeof source === "object" && !Array.isArray(source) && source.$forGames && source.$value) {
		const games = Array.isArray(source.$forGames)
			? source.$forGames
			: String(source.$forGames).split(/[,\|]/g).map(s => s.trim()).filter(Boolean);

		const baseCtx = (source.$ctx && typeof source.$ctx === "object") ? source.$ctx : {};
		const valueFn = source.$value;

		for (const gameKey of games) {
			const ctx = { ...baseCtx, gameKey };
			const expanded = typeof valueFn === "function" ? valueFn(ctx) : {};

			target[gameKey] = deepMerge(target[gameKey], expanded, `${path}.${gameKey}`);
		}
		return target;
	}

	for (const rawKey in source) {
		if (!Object.prototype.hasOwnProperty.call(source, rawKey)) continue;

		const sv = source[rawKey];

		const keys =
			typeof rawKey === "string" && /[,\|]/.test(rawKey)
				? rawKey.split(/[,\|]/g).map((s) => s.trim()).filter(Boolean)
				: [rawKey];

		if (keys.length > 1 && Object.prototype.hasOwnProperty.call(target, rawKey)) {
			delete target[rawKey];
		}

		for (const key of keys) {
			const tv = target[key];

			if (sv && typeof sv === "object" && !Array.isArray(sv)) {
				target[key] = deepMerge(
					tv && typeof tv === "object" && !Array.isArray(tv) ? tv : {},
					sv,
					`${path}.${key}`
				);
			} else {
				target[key] = sv;
			}
		}
	}

	return target;
}

/**
 * Global data registry:
 * - DATA: all game/task/dex/etc data, mutated by PPGC.register().
 * - PPGC: config + entry points shared across modules / globals.
 */
export const DATA = ensureDataRoot();
export const PPGC = ensurePpgcRoot();

// Ensure sectionMeters exists so modules can safely push custom meters.
PPGC.sectionMeters = PPGC.sectionMeters || [];

/**
 * Register a data chunk with the global DATA object.
 *
 * Typical usage from data files:
 *   PPGC.register({
 *     games: { ... },
 *     dex: { ... },
 *     sections: { ... },
 *   });
 */

PPGC.register = function (chunk) {
	if (Array.isArray(chunk)) {
		for (const part of chunk) deepMerge(DATA, part, "DATA");
		return;
	}
	deepMerge(DATA, chunk, "DATA");
};
