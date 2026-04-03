import { isGCEASection } from "./store.js";

/* ===================== Task completion helpers ===================== */

/**
 * Compute completion for a single task.
 *
 * - Tiered tasks: currentTier / tiers.length (0..1)
 * - Leaf tasks: 1 if done, else 0
 * - Group tasks: average of child completions
 */
export function getTaskCompletion(task) {
	if (task?.type === "tiered" && Array.isArray(task.tiers)) {
		const steps = task.tiers.length;
		const tier = Math.max(0, Math.min(task.currentTier ?? 0, steps));
		return steps === 0 ? 1 : tier / steps; // 0..1
	}

	// Leaf tasks (checkbox)
	if (!Array.isArray(task?.children) || task.children.length === 0) {
		return task?.done ? 1 : 0;
	}

	// Groups: average of children
	const kids = task.children;
	if (!kids.length) return 0;
	const sum = kids.reduce((a, c) => a + getTaskCompletion(c), 0);
	return sum / kids.length;
}

/**
 * Count how many leaf tasks are done vs total leaves in a nested task tree.
 * Returns { done, total } where "done" is an integer count of fully-complete leaves.
 */
export function countLeavesDoneTotal(tasksArr) {
	let done = 0;
	let total = 0;

	if (!Array.isArray(tasksArr)) return { done, total };

	for (const t of tasksArr) {
		const kids = Array.isArray(t.children) ? t.children : [];
		if (kids.length) {
			const sub = countLeavesDoneTotal(kids);
			done += sub.done;
			total += sub.total;
		} else {
			total += 1;
			if (t.done) done += 1;
		}
	}

	return { done, total };
}

/**
 * Summarize a task tree for ring / meter UIs.
 *
 * Returns:
 *   { done, total }
 * where:
 *   - total = number of leaf tasks
 *   - done  = fractional sum of each leaf's completion (0..1)
 */
export function summarizeTasks(tasksArray) {
	let done = 0;
	let total = 0;

	if (!Array.isArray(tasksArray)) return { done, total };

	const walk = (arr) => {
		for (const t of arr) {
			if (Array.isArray(t.children) && t.children.length) {
				walk(t.children);
			} else {
				done += getTaskCompletion(t);
				total += 1;
			}
		}
	};

	walk(tasksArray);
	return { done, total };
}

/**
 * Given a raw count and an ordered list of thresholds, returns the tier index.
 * Example:
 *   tiers = [1, 3, 5]
 *   count = 4  → tier 2  (>= 1, >= 3, not >= 5)
 * Result is in range 0..tiers.length.
 */
export function tierFromCount(count, tiers) {
	let t = 0;
	for (const th of tiers) {
		if (count >= th) t++;
	}
	return t; // 0..tiers.length
}


/* ===================== Games helpers ===================== */

/**
 * Flatten window.DATA.games into a simple list:
 *   [{ genKey, game }, ...]
 */
export function allGamesList() {
	const out = [];
	const gens = window.DATA.games || {};

	for (const genKey of Object.keys(gens)) {
		for (const g of gens[genKey]) {
			out.push({ genKey, game: g });
		}
	}

	return out;
}

/**
 * Return a 2D array of games for a generation, grouped into visual rows.
 *
 * Layout rules:
 *   - If window.DATA.layout.gameRows[genKey] exists, use that as row configuration.
 *   - Any configured keys that resolve to games are included in those rows.
 *   - Remaining games are appended as a final "leftovers" row.
 */
export function getGameRowsForGen(genKey) {
	const all = (window.DATA.games?.[genKey] || []).slice();
	const byKey = new Map(all.map((g) => [g.key, g]));
	const cfg = window.DATA.layout?.gameRows?.[genKey] || null;
	if (!cfg) return [all];

	const rows = [];
	const used = new Set();

	for (const row of cfg) {
		const rowGames = [];
		for (const key of row) {
			const g = byKey.get(key);
			if (g) {
				rowGames.push(g);
				used.add(key);
			}
		}
		if (rowGames.length) rows.push(rowGames);
	}

	const leftovers = all.filter((g) => !used.has(g.key));
	if (leftovers.length) rows.push(leftovers);

	return rows;
}


/* ===================== Section add-on meters ===================== */

/**
 * Compute extra progress meters for a section (Dex, forms, research, custom).
 *
 * Returns an array of percentages (0..100) to feed into ring UIs:
 *   - For GCEA sections:
 *       1) Regional Dex completion
 *       2) National Dex completion (if exists)
 *       3) Forms completion (single meter, preferring National if present)
 *       4) Research completion (single meter, preferring National if present)
 *   - Plus any custom sectionMeters(sectionObj, gameKey, genKey) → number
 */
export function getSectionAddonPcts(
	sectionObj,
	gameKey,
	genKey,
	dexPctFor,
	sectionMeters
) {
	const pcts = [];

	if (isGCEASection(sectionObj)) {
		const baseKey = String(gameKey).endsWith("-national")
			? String(gameKey).replace(/-national$/, "")
			: String(gameKey);
		const natKey = `${baseKey}-national`;
		const hasNat = !!(window.DATA?.dex?.[natKey]?.length);

		// Prefer the variant list that matches the current gameKey, then fall back to the base.
		const variantsCfg = window.DATA?.dexVariants?.[baseKey];

		// Games where we WANT multi-dex behavior for GCEA (X/Y, Alola, etc.)
		// Everything else that has variants (Sword/IoA/CT, SV+DLC, ZA+Mega)
		// we treat as "normal": only this game's dex counts.
		const forbidMultiDexForGCEA = new Set([
			"sword",
			"swordioa",
			"swordct",
			"shield",
			"shieldioa",
			"shieldct",
			"scarlet",
			"scarlettm",
			"scarletid",
			"violet",
			"violettm",
			"violetid",
			"legendsza",
			"legendszamd",
		]);

		if (
			Array.isArray(variantsCfg) &&
			variantsCfg.length > 1 &&
			!forbidMultiDexForGCEA.has(baseKey)
		) {
			// ✅ Multi-dex games that SHOULD share their dexes for GCEA
			// (X/Y, Alola, etc.): use one meter per variant.
			for (const vk of variantsCfg) {
				const pct = dexPctFor(vk, genKey);
				if (Number.isFinite(pct)) {
					pcts.push(pct);
				}
			}
		} else {
			// ✅ Normal games OR "isolated" multi-dex games (Sword/IoA/CT, SV+DLC, ZA+Mega):
			// ONLY this game's own dex is counted for GCEA.

			// 1) Regional species (this gameKey only)
			const regPct = dexPctFor(gameKey, genKey);
			if (Number.isFinite(regPct)) {
				pcts.push(regPct);
			}

			// 2) National species (if a national dex exists for this base)
			if (hasNat) {
				const natPct = dexPctFor(natKey, genKey);
				if (Number.isFinite(natPct)) {
					pcts.push(natPct);
				}
			}
		}
	}

	// Custom meters from section config
	if (Array.isArray(sectionMeters)) {
		for (const m of sectionMeters) {
			try {
				const v = m(sectionObj, gameKey, genKey);
				if (typeof v === "number" && isFinite(v)) {
					pcts.push(v);
				}
			} catch {
				// ignore bad meters, keep the rest
			}
		}
	}

	return pcts;
}
