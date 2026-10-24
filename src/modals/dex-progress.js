// dex-progress.js
// Helper functions for dex completion percentages (species/forms/research).

// Local copy of normalizeFlag from dex.js – keep in sync if you change it there.
import { isMythicalForm } from "./dex-config.js";
import { getDexFormsNode } from "./dex-store.js";
import {
	isCompletedForGame,
	normalizeFlag,
	registerKeywordSectionMeter,
} from "./helpers.js";
import { isGCEASection } from "../store.js";

export const PATH_OF_SOLITUDE_KEY = "__pathOfSolitude";

function _tierStatsForMon(tasks, rec = {}) {
	let totalTiers = 0;
	let doneTiers = 0;

	tasks.forEach((t, idx) => {
		const steps = Array.isArray(t?.tiers) ? t.tiers.length : 0;
		totalTiers += steps;

		const raw = rec[idx];
		const lvl = typeof raw === "number" ? raw : raw ? steps : 0; // legacy true => full
		const clamped = Math.max(0, Math.min(steps, lvl));
		doneTiers += clamped;
	});

	return { totalTiers, doneTiers };
}

/**
 * Internal helper: aggregate research entries for a game into base vs extra stats.
 * Mirrors _researchStatsFor in dex.js – keep in sync if that changes.
 */
export function researchStatsFor(gameKey, genKey, store) {
	void genKey;

	const dex = Array.isArray(window.DATA?.dex?.[gameKey])
		? window.DATA.dex[gameKey]
		: [];

	const recAll =
		store?.dexResearchStatus instanceof Map
			? store.dexResearchStatus.get(gameKey) || {}
			: {};

	let baseTotal = 0,
		baseDone = 0;
	let extraTotal = 0,
		extraDone = 0;

	for (const mon of dex) {
		const tasks = Array.isArray(mon?.research) ? mon.research : [];
		if (!tasks.length) continue;

		const rec = recAll?.[mon.id] || {};
		const { totalTiers, doneTiers } = _tierStatsForMon(tasks, rec);

		if (mon?.mythical) {
			extraTotal += totalTiers;
			extraDone += doneTiers;
		} else {
			baseTotal += totalTiers;
			baseDone += doneTiers;
		}
	}

	return { baseTotal, baseDone, extraTotal, extraDone };
}

/**
 * Compute research-task completion percentage for a game.
 */
export function researchPctFor(gameKey, genKey, store) {
	const { baseTotal, baseDone, extraTotal, extraDone } = researchStatsFor(
		gameKey,
		genKey,
		store,
	);

	const basePct =
		baseTotal > 0 ? Math.round((baseDone / baseTotal) * 100) : 0;
	const fullTotal = baseTotal + extraTotal;
	const fullDone = baseDone + extraDone;
	const fullPct =
		fullTotal > 0 ? Math.round((fullDone / fullTotal) * 100) : 0;

	// If your UI expects the "extended overlay" behavior, keep it simple for now:
	// show fullPct only once base is done, otherwise show basePct.
	if (baseTotal > 0 && baseDone >= baseTotal) return fullPct;
	return basePct;
}

export function pathOfSolitudeStatsFor(gameKey, genKey, store) {
	void genKey;

	if (String(gameKey) !== "legendsarceus") {
		return { baseTotal: 0, baseDone: 0, extraTotal: 0, extraDone: 0 };
	}

	const dex = Array.isArray(window.DATA?.dex?.[gameKey])
		? window.DATA.dex[gameKey]
		: [];
	const recAll =
		store?.dexResearchStatus instanceof Map
			? store.dexResearchStatus.get(gameKey) || {}
			: {};

	let baseTotal = 0,
		baseDone = 0;
	let extraTotal = 0,
		extraDone = 0;

	for (const mon of dex) {
		const rec = recAll?.[mon.id] || {};
		const done = !!rec?.[PATH_OF_SOLITUDE_KEY];

		if (mon?.mythical) {
			extraTotal += 1;
			if (done) extraDone += 1;
		} else {
			baseTotal += 1;
			if (done) baseDone += 1;
		}
	}

	return { baseTotal, baseDone, extraTotal, extraDone };
}

export function pathOfSolitudePctFor(gameKey, genKey, store) {
	const { baseTotal, baseDone, extraTotal, extraDone } =
		pathOfSolitudeStatsFor(gameKey, genKey, store);

	if (!baseTotal) return 0;

	const pctBase = (baseDone / baseTotal) * 100;
	const pctExtended = ((baseDone + extraDone) / baseTotal) * 100;
	return baseDone === baseTotal ? pctExtended : pctBase;
}

/**
 * Compute forms-only completion percentage for a game.
 * Mirrors the implementation in dex.js, but isolated here.
 */
export function formsPctFor(gameKey, genKey, store) {
	const games = window.DATA.games?.[genKey] || [];
	const game = games.find((g) => g.key === gameKey);

	// prefer National forms set if it exists
	const baseGameKey = String(gameKey).endsWith("-national")
		? String(gameKey).replace(/-national$/, "")
		: String(gameKey);
	const natKey = `${baseGameKey}-national`;
	const natDex = window.DATA.dex?.[natKey] || [];
	const haveNat = natDex.length > 0;

	const formsDex = haveNat ? natDex : window.DATA.dex?.[gameKey] || [];
	const speciesWithForms = formsDex.filter(
		(m) => Array.isArray(m.forms) && m.forms.length,
	);

	let baseTotal = 0,
		extraTotal = 0,
		baseDone = 0,
		extraDone = 0;

	for (const m of speciesWithForms) {
		const nodeKey = haveNat ? natKey : gameKey;
		const { node } = getDexFormsNode(store, nodeKey, m.id);

		for (const f of m.forms) {
			const name = typeof f === "string" ? f : f?.name;
			if (!name) continue;

			const isExtra = isMythicalForm(f);
			const v = normalizeFlag(node.forms?.[name] || "unknown");
			const done = isCompletedForGame(game, v);

			if (isExtra) {
				extraTotal += 1;
				if (done) extraDone += 1;
			} else {
				baseTotal += 1;
				if (done) baseDone += 1;
			}
		}
	}

	if (!baseTotal) return 0;

	const pctBase = (baseDone / baseTotal) * 100;
	const pctExtended = ((baseDone + extraDone) / baseTotal) * 100;

	// mirror species logic: show extended only when base is full
	return baseDone === baseTotal ? pctExtended : pctBase;
}

/**
 * Hook to expose helpers on window.PPGC with store baked in.
 * Call this once from wireDexModal(store, ...).
 */
export function attachProgressHelpers(store) {
	window.PPGC = window.PPGC || {};
	window.PPGC.formsPctFor = (gameKey, genKey) =>
		formsPctFor(gameKey, genKey, store);
	window.PPGC.researchPctFor = (gameKey, genKey) =>
		researchPctFor(gameKey, genKey, store);
	window.PPGC.pathOfSolitudePctFor = (gameKey, genKey) =>
		pathOfSolitudePctFor(gameKey, genKey, store);

	registerKeywordSectionMeter({
		keyword: "solitude",
		pctFn: (gameKey, localStore) =>
			pathOfSolitudePctFor(gameKey, null, localStore),
		flagProp: "__ppgcPathOfSolitudeMeter",
		exposeName: "pathOfSolitudePctFor",
	});

	if (!Array.isArray(window.PPGC.sectionMeters)) {
		window.PPGC.sectionMeters = window.PPGC.sectionMeters
			? Array.from(window.PPGC.sectionMeters)
			: [];
	}

	const hasGceaSolitudeMeter = window.PPGC.sectionMeters.some(
		(fn) => fn && fn.__ppgcPathOfSolitudeGCEAMeter,
	);

	if (!hasGceaSolitudeMeter) {
		const meter = function legendsArceusGceaSolitudeMeter(
			sectionObj,
			gameKey,
		) {
			if (String(gameKey) !== "legendsarceus") return NaN;
			if (!isGCEASection(sectionObj)) return NaN;

			const localStore = window.PPGC?._storeRef;
			if (!localStore) return NaN;

			const pct = pathOfSolitudePctFor(gameKey, null, localStore);
			return Number.isFinite(pct) ? pct : NaN;
		};

		meter.__ppgcPathOfSolitudeGCEAMeter = true;
		window.PPGC.sectionMeters.push(meter);
	}
}
