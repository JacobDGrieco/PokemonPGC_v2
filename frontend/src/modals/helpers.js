/**
 * Generic "get items for a game" helper.
 * Works with data blocks shaped like:
 *   window.DATA[dataKey][gameKey]
 *   or that object having an `.items` array.
 */
export function getGameCollection(dataKey, gameKey) {
	const S = window.DATA || {};
	const block = S[dataKey] || {};
	const entry = block[gameKey];

	if (!entry) return [];
	if (Array.isArray(entry)) return entry;
	if (Array.isArray(entry.items)) return entry.items;
	return [];
}

/**
 * Shared section-meter registration for collections that are keyed
 * by a keyword in section id/title/tags (e.g. "curry", "sandwich").
 *
 * - keyword: lowercased string to look for ("curry", "sandwich", etc.)
 * - pctFn:   (gameKey, store) => percentage
 * - flagProp: unique flag property on the meter fn ("__ppgcCurryMeter")
 * - exposeName: optional window.PPGC[...] name to expose pctFn as
 */
export function registerKeywordSectionMeter({
	keyword,
	pctFn,
	flagProp,
	exposeName,
}) {
	if (typeof window === "undefined") return;

	window.PPGC = window.PPGC || {};

	// Ensure sectionMeters is an array
	if (!Array.isArray(window.PPGC.sectionMeters)) {
		window.PPGC.sectionMeters = window.PPGC.sectionMeters
			? Array.from(window.PPGC.sectionMeters)
			: [];
	}

	// Avoid double-registering the same meter
	const already = window.PPGC.sectionMeters.some(
		(fn) => fn && fn[flagProp]
	);
	if (already) return;

	const meter = function keywordSectionMeter(sectionObj, gameKey, genKey) {
		void genKey; // keeps signature consistent, we don't need it here

		const id = String(sectionObj?.id || "").toLowerCase();
		const title = (sectionObj?.title || "").toLowerCase();
		const tags = Array.isArray(sectionObj?.tags) ? sectionObj.tags : [];

		const kw = String(keyword || "").toLowerCase();
		const isMatch =
			tags.some((t) => String(t || "").toLowerCase() === kw) ||
			id.includes(kw) ||
			title.includes(kw);

		if (!isMatch) return NaN;

		const store = window.PPGC?._storeRef;
		if (!store) return NaN;

		const pct = pctFn(gameKey, store);
		return Number.isFinite(pct) ? pct : NaN;
	};

	meter[flagProp] = true;
	window.PPGC.sectionMeters.push(meter);

	if (exposeName) {
		window.PPGC[exposeName] = function (gameKey, genKey) {
			void genKey;
			const store = window.PPGC?._storeRef;
			if (!store) return 0;
			const pct = pctFn(gameKey, store);
			return Number.isFinite(pct) ? pct : 0;
		};
	}
}

// --- Dex helpers --------------------------------------------------------

export const DEX_STATUS_RANK = {
	unknown: 0,
	seen: 1,
	caught: 2,
	shiny: 3,
	alpha: 4,
	shiny_alpha: 5,
};

export function resolveMaybeFn(v) {
	try { return typeof v === "function" ? v() : v; }
	catch { return v; }
}

export function normalizeFlag(v) {
	return String(v || "unknown")
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "_");
}

export function rankStatus(v) {
	// use normalized form so callers can pass "Caught", "  SHINY ", etc.
	return DEX_STATUS_RANK[normalizeFlag(v)] ?? 0;
}

export function pickHighestStatus(list) {
	if (!Array.isArray(list) || !list.length) return "unknown";
	return list.reduce(
		(best, v) => (rankStatus(v) > rankStatus(best) ? v : best),
		"unknown"
	);
}

export function isCompletedForGame(game, flag) {
	const s = normalizeFlag(flag);

	if (!s || s === "unknown" || s === "seen") return false;

	// Treat all “caught-like” states as complete
	return (
		s === "caught" ||
		s === "alpha" ||
		s === "shiny" ||
		s === "shiny_alpha"
	);
}

/**
 * Clamp a mon-level status so it never exceeds the maximum allowed
 * by that mon (e.g. shiny-locked species).
 */
export function clampStatusForMon(mon, val) {
	const desired = normalizeFlag(val);
	if (!mon || !mon.maxStatus) return desired;

	const max = normalizeFlag(mon.maxStatus);
	return rankStatus(desired) > rankStatus(max) ? max : desired;
}

export function isOptionAllowedForMon(mon, val) {
	if (!mon || !mon.maxStatus) return true;
	const max = normalizeFlag(mon.maxStatus);
	return rankStatus(val) <= rankStatus(max);
}

/**
 * Clamp a form-level status so it never exceeds the maximum allowed
 * by that specific form (if it has its own maxStatus).
 */
export function clampStatusForForm(mon, form, val) {
	const desired = normalizeFlag(val);
	if (!mon) return desired;

	// Start with species cap if present
	let cap = mon.maxStatus ? normalizeFlag(mon.maxStatus) : null;

	// Tighten with per-form cap if present
	if (form && typeof form === "object" && form.maxStatus) {
		const formCap = normalizeFlag(form.maxStatus);
		if (!cap || rankStatus(formCap) < rankStatus(cap)) {
			cap = formCap;
		}
	}

	if (!cap) return desired;
	return rankStatus(desired) > rankStatus(cap) ? cap : desired;
}

export function isOptionAllowedForForm(mon, form, val) {
	const normalized = normalizeFlag(val);
	if (!mon) return true;

	let cap = mon.maxStatus ? normalizeFlag(mon.maxStatus) : null;

	if (form && typeof form === "object" && form.maxStatus) {
		const formCap = normalizeFlag(form.maxStatus);
		if (!cap || rankStatus(formCap) < rankStatus(cap)) {
			cap = formCap;
		}
	}

	if (!cap) return true;
	return rankStatus(normalized) <= rankStatus(cap);
}

export function getFilterClassForStatus(status) {
	const s = normalizeFlag(status);
	if (!s || s === "unknown") return "status-unknown";
	if (s === "seen") return "status-seen";
	return "status-normal";
}

export function renderBadges(status, gameKey) {
	const s = normalizeFlag(status);
	const icons = [];
	const isAlpha = (v) => v === "alpha" || v === "shiny_alpha";
	const isShiny = (v) => v === "shiny" || v === "shiny_alpha";

	const marks = (window.DATA && window.DATA.marks) || {};
	const byGame =
		(window.DATA && window.DATA.marksByGame) || {};

	// Resolve a useful marks config for this gameKey
	function resolveGameMarks(rawKey) {
		if (!rawKey) return null;

		const g = String(rawKey);

		// 1) exact match
		if (byGame[g]) return byGame[g];

		// 2) strip "-national"
		if (g.endsWith("-national")) {
			const baseNat = g.replace(/-national$/, "");
			if (byGame[baseNat]) return byGame[baseNat];
		}

		// 3) strip everything after the first "-" (x-central → x, sun-alola → sun)
		const baseDash = g.split("-")[0];
		if (byGame[baseDash]) return byGame[baseDash];

		// 4) prefix match for DLC-style keys without "-" (swordioa → sword)
		for (const [k, cfg] of Object.entries(byGame)) {
			if (g !== k && g.startsWith(k)) return cfg;
		}

		return null;
	}

	const gameMarks = resolveGameMarks(gameKey);

	const shinySrc =
		(gameMarks && gameMarks.shiny) || marks.shiny;
	const alphaSrc =
		(gameMarks && gameMarks.alpha) || marks.alpha;

	if (isShiny(s) && shinySrc) {
		icons.push(
			`<img src="${shinySrc}" alt="Shiny Badge"/>`
		);
	}
	if (isAlpha(s) && alphaSrc) {
		icons.push(
			`<img src="${alphaSrc}" alt="Alpha Badge"/>`
		);
	}

	return icons.length
		? `<div class="badges">${icons.join("")}</div>`
		: "";
}

export function getDexScrollContainer() {
	return (
		modal.querySelector(".body") || // sheet-style modal
		modal.querySelector(".modal-bd") || // dialog-style fallback
		modal
	);
}

export function cleanupFormsModal() {
	const formsModal = document.getElementById("formsModal");
	const formsWheel = document.getElementById("formsWheel");
	if (!formsModal) return;

	// Remove any known resize handlers that might be attached by different modules
	const keys = [
		"_dexOnResize",
		"_curryOnResize",
		"_sandwichOnResize",
		"_capsuleOnResize",
	];

	for (const k of keys) {
		const fn = formsModal[k];
		if (typeof fn === "function") window.removeEventListener("resize", fn);
		formsModal[k] = null;
	}

	// Drop the wheel DOM so images + chip nodes can GC
	if (formsWheel) formsWheel.innerHTML = "";

	// Optional: clear metadata like Dex does
	delete formsModal.dataset.formsNonce;
	delete formsModal.dataset.gameKey;
	delete formsModal.dataset.genKey;
	delete formsModal.dataset.monId;
}
