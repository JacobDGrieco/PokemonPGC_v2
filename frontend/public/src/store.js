// Centralized state & persistence for PPGC

const STORAGE_KEY = "ppgc_v1";
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

// Derive safe initial navigation state from saved blob
let initialLevel = saved.level || "gen";
let initialGenKey = saved.genKey || null;
let initialGameKey = saved.gameKey || null;
let initialSectionId = saved.sectionId || null;

const ALLOWED_LEVELS = new Set(["gen", "game", "section", "account", "tools", "moninfo"]);
if (!ALLOWED_LEVELS.has(initialLevel)) initialLevel = "gen";

// If the saved combo doesn't make sense, fall back to the top level
if (initialLevel === "section" && (!initialGameKey || !initialSectionId)) {
	initialLevel = "gen";
	initialGenKey = null;
	initialGameKey = null;
	initialSectionId = null;
} else if (initialLevel === "game" && !initialGenKey) {
	initialLevel = "gen";
	initialGenKey = null;
}

/**
 * Core store object.
 *
 * state: navigation + UI state
 * sectionsStore: Map<gameKey, Section[]>
 * tasksStore:    Map<sectionId, Task[]>
 * dexStatus:     Map<gameKey, { [monId]: status }>
 * ...plus various status maps initialized below.
 */
export const store = {
	state: {
		level: initialLevel,
		genKey: initialGenKey,
		gameKey: initialGameKey,
		sectionId: initialSectionId,
		dexModalFor: null,
		gen1SpriteMode: saved.gen1SpriteMode || "bw",
		dexSpriteMode: saved.dexSpriteMode || "static",
		fashionGenderByGame: saved.fashionGenderByGame || {},
		startedGames: saved.startedGames || {},
		gameSummaryScope: saved.gameSummaryScope || "all",
		gameSummaryAggregateMode: saved.gameSummaryAggregateMode || "all",
		monInfoId: saved.monInfoId || null,
		monInfoGameKey: saved.monInfoGameKey || null,
		monInfoForm: saved.monInfoForm || null,
		toolsKey: saved.toolsKey || "info",
		sidebarCollapsed: !!saved.sidebarCollapsed,
	},
	sectionsStore: new Map(Object.entries(saved.sections || {})),
	tasksStore: new Map(Object.entries(saved.tasks || {})),
	dexStatus: new Map(Object.entries(saved.dexStatus || {})),
	dexFormsStatus: new Map(), // Map<gameKey, { [monId]: { all?:boolean, forms:{[formName]: status|boolean} } }>
	taskProgressById: new Map(Object.entries(saved.taskProgressById || {})),
	taskChoiceById: new Map(Object.entries(saved.taskChoiceById || {})),
};

// Extra UI state defaults
store.state.fashionModalFor ??= null;
store.state.fashionCategory ??= null;
store.state.fashionGenderByGame ??= saved.fashionGenderByGame || {};
store.state.modelViewerSolo ??= false;

// Additional status maps
store.fashionStatus ??= new Map();          // Map<gameKey, Map<categoryId, Record<itemId:boolean>>>
store.fashionFormsStatus ??= new Map();     // Map<gameKey, Map<categoryId, Record<itemId, {forms,...}|...>>>
store.distributionsStatus ??= new Map();    // Map<gameKey, { [distId]: boolean }>
store.dexResearchStatus ??= new Map();      // Map<gameKey, { [dexMonId]: { [taskId]: boolean } }>
store.curryStatus ??= new Map();            // Map<gameKey, { [curryId]: boolean }>
store.curryFormsStatus ??= new Map();       // Map<gameKey, { [curryId]: { all:boolean, forms:{[name]:boolean} } }>
store.sandwichStatus ??= new Map();         // Map<gameKey, { [sandwichId]: boolean }>
store.sandwichFormsStatus ??= new Map();    // Map<gameKey, { [sandwichId]: { all:boolean, forms:{[name]:boolean} } }>
store.stickerStatus ??= new Map();        // Map<gameKey, { [stickerId]: boolean }>
store.stickerFormsStatus ??= new Map();   // Map<gameKey, { [stickerId]: { all:boolean, forms:{[name]:boolean} } }>


/* ===================== Load from localStorage ===================== */

// Fashion main items
{
	const raw = saved.fashionStatus || JSON.parse(localStorage.getItem("fashionStatus") || "{}");
	const map = new Map();
	for (const [gameKey, categories] of Object.entries(raw)) {
		const catMap = new Map();
		for (const [catId, items] of Object.entries(categories || {})) {
			catMap.set(catId, items || {});
		}
		map.set(gameKey, catMap);
	}
	store.fashionStatus = map;
}

// Fashion forms
{
	const rawForms = saved.fashionFormsStatus || JSON.parse(localStorage.getItem("fashionFormsStatus") || "{}");
	const formsMap = new Map();
	for (const [gameKey, categories] of Object.entries(rawForms)) {
		const catMap = new Map();
		for (const [catId, items] of Object.entries(categories || {})) {
			catMap.set(catId, items || {});
		}
		catMap.size && formsMap.set(gameKey, catMap);
	}
	store.fashionFormsStatus = formsMap;
}

// Dex forms
{
	const rawDexForms = saved.dexFormsStatus || JSON.parse(localStorage.getItem("dexFormsStatus") || "{}");
	const dexFormsMap = new Map();
	for (const [gameKey, byId] of Object.entries(rawDexForms || {})) {
		const rec = {};
		for (const [monId, node] of Object.entries(byId || {})) {
			rec[monId] = {
				all: !!node?.all,
				forms: node?.forms || {},
			};
		}
		dexFormsMap.set(gameKey, rec);
	}
	store.dexFormsStatus = dexFormsMap;
}

// Distributions
{
	const rawDist = saved.distributionsStatus || JSON.parse(localStorage.getItem("distributionsStatus") || "{}");

	const distMap = new Map();
	for (const [gameKey, rec] of Object.entries(rawDist || {})) {
		distMap.set(gameKey, rec || {});
	}
	store.distributionsStatus = distMap;
}

// Dex research
{
	const rawResearch = saved.dexResearchStatus || JSON.parse(localStorage.getItem("dexResearchStatus") || "{}");
	const researchMap = new Map();
	for (const [gameKey, rec] of Object.entries(rawResearch)) {
		researchMap.set(gameKey, rec || {});
	}
	store.dexResearchStatus = researchMap;
}

// Curry
{
	const rawCurry = saved.curryStatus || JSON.parse(localStorage.getItem("curryStatus") || "{}");
	const curryMap = new Map();
	for (const [gameKey, rec] of Object.entries(rawCurry)) {
		curryMap.set(gameKey, rec || {});
	}
	store.curryStatus = curryMap;
}

// Curry forms
{
	const rawCurryForms = saved.curryFormsStatus || JSON.parse(localStorage.getItem("curryFormsStatus") || "{}");
	const curryFormsMap = new Map();
	for (const [gameKey, rec] of Object.entries(rawCurryForms)) {
		const gameRec = {};
		for (const [curryId, node] of Object.entries(rec || {})) {
			gameRec[curryId] = {
				all: !!node?.all,
				forms: node?.forms || {},
			};
		}
		curryFormsMap.set(gameKey, gameRec);
	}
	store.curryFormsStatus = curryFormsMap;
}

// Sandwich
{
	const rawSandwich = saved.sandwichStatus || JSON.parse(localStorage.getItem("sandwichStatus") || "{}");
	const sandwichMap = new Map();
	for (const [gameKey, rec] of Object.entries(rawSandwich)) {
		sandwichMap.set(gameKey, rec || {});
	}
	store.sandwichStatus = sandwichMap;
}

// Sandwich forms
{
	const rawSandwichForms = saved.sandwichFormsStatus || JSON.parse(localStorage.getItem("sandwichFormsStatus") || "{}");
	const sandwichFormsMap = new Map();
	for (const [gameKey, rec] of Object.entries(rawSandwichForms)) {
		const gameRec = {};
		for (const [sandwichId, node] of Object.entries(rec || {})) {
			gameRec[sandwichId] = {
				all: !!node?.all,
				forms: node?.forms || {},
			};
		}
		sandwichFormsMap.set(gameKey, gameRec);
	}
	store.sandwichFormsStatus = sandwichFormsMap;
}

// Sticker
{
	const rawSticker = saved.stickerStatus || JSON.parse(localStorage.getItem("stickerStatus") || "{}");
	const stickerMap = new Map();
	for (const [gameKey, rec] of Object.entries(rawSticker)) {
		stickerMap.set(gameKey, rec || {});
	}
	store.stickerStatus = stickerMap;
}

// Sticker forms
{
	const rawStickerForms = saved.stickerFormsStatus || JSON.parse(localStorage.getItem("stickerFormsStatus") || "{}");
	const stickerFormsMap = new Map();
	for (const [gameKey, rec] of Object.entries(rawStickerForms)) {
		const gameRec = {};
		for (const [stickerId, node] of Object.entries(rec || {})) {
			gameRec[stickerId] = {
				all: !!node?.all,
				forms: node?.forms || {},
			};
		}
		stickerFormsMap.set(gameKey, gameRec);
	}
	store.stickerFormsStatus = stickerFormsMap;
}

/* ===================== Save helpers ===================== */

/**
 * Serialize a nested Map<outerKey, Map<innerKey, value>> into a plain object:
 *   { [outerKey]: { [innerKey]: value } }
 *
 * Used for fashionStatus and fashionFormsStatus.
 */
function serializeNestedCategoryStatus(map) {
	const out = {};
	if (!(map instanceof Map)) return out;

	map.forEach((catMap, gameKey) => {
		const cats = {};
		if (catMap instanceof Map) {
			catMap.forEach((items, catId) => {
				cats[catId] = items;
			});
		}
		out[gameKey] = cats;
	});

	return out;
}

/**
 * Serialize Map<gameKey, record> into a plain object:
 *   { [gameKey]: record || {} }
 *
 * Used for dexFormsStatus, distributionsStatus, research, curry, sandwich, etc.
 */
function serializeSimpleStatusMap(map) {
	const out = {};
	if (!(map instanceof Map)) return out;

	map.forEach((rec, gameKey) => {
		out[gameKey] = rec || {};
	});

	return out;
}

/* ===================== Saving to localStorage ===================== */
/**
 * Persist core state + all status maps to localStorage.
 */
export function save() {
	const s = store.state || {};

	const obj = {
		// --- Core navigation / UI state that must survive reloads ---
		level: s.level,             // "gen" | "game" | "section" | "account"
		genKey: s.genKey,
		gameKey: s.gameKey,
		sectionId: s.sectionId,
		dexModalFor: s.dexModalFor || null,
		gen1SpriteMode: s.gen1SpriteMode || "bw",
		dexSpriteMode: s.dexSpriteMode || "static",
		fashionGenderByGame: s.fashionGenderByGame || {},
		startedGames: s.startedGames || {},
		gameSummaryScope: s.gameSummaryScope || "all",
		gameSummaryAggregateMode: s.gameSummaryAggregateMode || "all",
		monInfoId: s.monInfoId || null,
		monInfoGameKey: s.monInfoGameKey || null,
		monInfoForm: s.monInfoForm || null,
		sidebarCollapsed: !!s.sidebarCollapsed,
		favoriteGames: store.favoriteGames || {},
		completedGames: store.completedGames || {},
		sections: Object.fromEntries(store.sectionsStore),
		tasks: Object.fromEntries(store.tasksStore),
		dexStatus: Object.fromEntries(store.dexStatus),
		dexFormsStatus: Object.fromEntries(store.dexFormsStatus),
		dexResearchStatus: Object.fromEntries(store.dexResearchStatus),
		distributionsStatus: Object.fromEntries(store.distributionsStatus),
		curryStatus: Object.fromEntries(store.curryStatus),
		curryFormsStatus: Object.fromEntries(store.curryFormsStatus),
		sandwichStatus: Object.fromEntries(store.sandwichStatus),
		sandwichFormsStatus: Object.fromEntries(store.sandwichFormsStatus),
		stickerStatus: Object.fromEntries(store.stickerStatus),
		stickerFormsStatus: Object.fromEntries(store.stickerFormsStatus),
		fashionStatus: serializeNestedCategoryStatus(store.fashionStatus),
		fashionFormsStatus: serializeNestedCategoryStatus(store.fashionFormsStatus),
		taskProgressById: store.taskProgressById instanceof Map ? Object.fromEntries(store.taskProgressById) : {},
		taskChoiceById: store.taskChoiceById instanceof Map ? Object.fromEntries(store.taskChoiceById) : {},
		toolsKey: s.toolsKey || "info",
		modelViewerSolo: s.modelViewerSolo || false,
	};

	try {
		localStorage.setItem("ppgc_v1", JSON.stringify(obj));
	} catch (e) {
		console.warn("[ppgc] Failed to save progress:", e);
	}
}

// Convenience alias
store.save = save;

/* ===================== Misc helpers & exports ===================== */

/** Tiny unique-ish ID for tasks, sections, etc. */
export function uid() {
	return Math.random().toString(36).slice(2, 9);
}

/** True if a section is the "Gotta Catch 'Em All" core Dex section. */
export function isGCEASection(section) {
	return (section?.title || "").trim().toLowerCase() === "gotta catch 'em all";
}

/**
 * Collect all known gameKeys across static DATA and live state maps.
 * Returns an array of unique keys.
 */
export function getAllGameKeys() {
	const out = new Set();

	const S = window.DATA || {};

	// From static DATA
	Object.keys(S.sections || {}).forEach((k) => out.add(k));
	Object.keys(S.dex || {}).forEach((k) => out.add(k));
	Object.keys(S.fashion || {}).forEach((k) => out.add(k));
	Object.keys(S.curry || {}).forEach((k) => out.add(k));
	Object.keys(S.sandwich || {}).forEach((k) => out.add(k));
	Object.keys(S.sticker || {}).forEach((k) => out.add(k));

	// From live stores (covers edge cases where state exists but DATA is missing)
	const addFromMap = (m) => {
		if (m instanceof Map) {
			m.forEach((_, k) => out.add(k));
		}
	};

	addFromMap(store.dexStatus);
	addFromMap(store.dexFormsStatus);
	addFromMap(store.fashionStatus);
	addFromMap(store.fashionFormsStatus);
	addFromMap(store.curryStatus);
	addFromMap(store.curryFormsStatus);
	addFromMap(store.sandwichStatus);
	addFromMap(store.sandwichFormsStatus);
	addFromMap(store.stickerStatus);
	addFromMap(store.stickerFormsStatus);

	return [...out];
}

/* ===================== Store helpers on window.store ===================== */

// Expose store globally so persistence / dev tools can reach it.
window.store = store;

/**
 * Look up a task by ID across all sections and return a compact state object.
 * Returns:
 *   - { type: "tiered", currentTier, currentCount } for tiered tasks
 *   - { type: "check", done } for checkbox tasks
 */
store.getTaskState = function (taskId) {
	const visit = (arr) => {
		for (const t of arr || []) {
			if (!t) continue;
			if (String(t.id) === String(taskId)) return t;
			if (Array.isArray(t.children)) {
				const hit = visit(t.children);
				if (hit) return hit;
			}
		}
		return null;
	};

	for (const [, tasks] of this.tasksStore.entries()) {
		const node = visit(tasks);
		if (node) {
			if (node.type === "tiered") {
				return {
					type: "tiered",
					currentTier: Number(node.currentTier || 0),
					currentCount: Number(node.currentCount || 0),
				};
			}
			return { type: "check", done: !!node.done };
		}
	}

	// Fallback if not found
	return { type: "check", done: false };
};

/** Return full dex entry state for a dexId in a game (flags + forms). */
store.getDexState = function (gameKey, dexId) {
	const d = this.dex?.[gameKey]?.[dexId] || {};
	return {
		seen: !!d.seen,
		caught: !!d.caught,
		shiny: !!d.shiny,
		alpha: !!d.alpha,
		forms: d.forms || {},
	};
};

/**
 * Return combined dex status for a mon:
 *   {
 *     status: "unknown" | "caught" | ...,
 *     forms: { [formKey]: "unknown" | "caught" | ... }
 *   }
 */
store.getDexStatus = function (gameKey, dexId) {
	const monId = String(dexId);

	// Top-level status (single dropdown)
	const byGame =
		this.dexStatus instanceof Map ? this.dexStatus.get(gameKey) : null;
	const statusRaw =
		byGame && typeof byGame[monId] !== "undefined" ? byGame[monId] : "unknown";
	const status =
		typeof statusRaw === "string"
			? statusRaw
			: statusRaw
				? "caught"
				: "unknown";

	// Per-form statuses
	const formsOut = {};
	const formsByGame =
		this.dexFormsStatus instanceof Map
			? this.dexFormsStatus.get(gameKey)
			: null;
	const pack =
		formsByGame && formsByGame[monId] ? formsByGame[monId] : { forms: {} };
	const formsRec = pack?.forms || pack || {};

	for (const [k, v] of Object.entries(formsRec)) {
		formsOut[k] = typeof v === "string" ? v : v ? "caught" : "unknown";
	}

	return { status, forms: formsOut };
};

/**
 * Return true/false for a fashion selection.
 * If formKey == null, checks the whole item.
 * If formKey is provided, checks that specific form.
 */
store.getFashionState = function (gameKey, categoryId, itemId, formKey) {
	const gCat =
		this.fashionStatus instanceof Map ? this.fashionStatus.get(gameKey) : null;
	const gFormsCat =
		this.fashionFormsStatus instanceof Map
			? this.fashionFormsStatus.get(gameKey)
			: null;

	const catKey = String(categoryId);
	const itemKey = String(itemId);

	// Whole-item toggle (no forms)
	if (formKey == null) {
		const cat = gCat && gCat.get(catKey);
		if (!cat) return false;
		return !!cat[itemKey];
	}

	// Specific form toggle
	const catForms = gFormsCat && gFormsCat.get(catKey);
	const itemPack = catForms && catForms[itemKey];
	if (!itemPack) return false;

	// Support either { forms: { [idx]: boolean } } or a flat { [idx]: boolean }
	const forms =
		(itemPack && typeof itemPack.forms === "object" && itemPack.forms) ||
		itemPack ||
		{};
	if (typeof formKey === "string") return !!forms[formKey];
	if (typeof formKey === "number") return !!forms[String(formKey)];
	return false;
};

function _setGameStartedFlag(gameKey, started) {
	if (!gameKey) return;
	const s = store.state || {};
	if (!s.startedGames) s.startedGames = {};

	if (started) {
		s.startedGames[gameKey] = true;
	} else {
		delete s.startedGames[gameKey];
	}
}
/** True if a game has been marked as started. */
store.isGameStarted = function (gameKey) {
	const s = this.state || {};
	const started = s.startedGames || {};
	return !!started[gameKey];
};
/**
 * Mark/unmark a game as started.
 * Persists immediately.
 */
store.setGameStarted = function (gameKey, started) {
	_setGameStartedFlag(gameKey, started);
	save();
};

/* ===================== Hard reset hook ===================== */
/**
 * When STORAGE_KEY (ppgc_v1) is removed from localStorage,
 * also clear all auxiliary status keys and in-memory mirrors.
 */
(function setupPPGCResetHook() {
	const EXTRA_KEYS = [
		"dexFormsStatus",
		"fashionStatus",
		"fashionFormsStatus",
		"dexResearchStatus",
		"distributionsStatus",
		"curryStatus",
		"curryFormsStatus",
		"sandwichStatus",
		"sandwichFormsStatus",
		"stickerStatus",
		"stickerFormsStatus",
	];

	const _origRemoveItem = localStorage.removeItem.bind(localStorage);

	localStorage.removeItem = function (key) {
		_origRemoveItem(key);
		if (key === STORAGE_KEY) {
			try {
				EXTRA_KEYS.forEach((k) => _origRemoveItem(k));
			} catch {
				// ignore clearing failures
			}

			// Clear in-memory mirrors so the UI truly resets
			try {
				store.sectionsStore.clear();
				store.tasksStore.clear();
				store.dexStatus = new Map();
				store.dexFormsStatus = new Map();
				store.fashionStatus = new Map();
				store.fashionFormsStatus = new Map();
				store.distributionsStatus = new Map();
				store.dexResearchStatus = new Map();
				store.curryStatus = new Map();
				store.curryFormsStatus = new Map();
				store.sandwichStatus = new Map();
				store.sandwichFormsStatus = new Map();
				store.stickerStatus = new Map();
				store.stickerFormsStatus = new Map();
				store.taskProgressById = new Map();
				store.taskChoiceById = new Map();

				store.state = {
					level: "gen",
					genKey: null,
					gameKey: null,
					sectionId: null,
					dexModalFor: null,
					fashionModalFor: null,
					fashionCategory: null,
					gen1SpriteMode: "bw",
					dexSpriteMode: "static",
					fashionGenderByGame: {},
					startedGames: {},
					gameSummaryScope: "all",
					gameSummaryAggregateMode: "all",
					monInfoId: null,
					monInfoGameKey: null,
					monInfoForm: null,
				};
			} catch {
				// ignore
			}

			// One re-render to reflect the cleared state
			try {
				window.PPGC = window.PPGC || {};
				window.PPGC._suppressRenders &&
					(window.PPGC._suppressRenders = false);
				window.PPGC.renderAll?.();
			} catch {
				// ignore
			}
		}
	};

	// Bonus explicit API
	window.PPGC = window.PPGC || {};
	window.PPGC.resetAllProgress = function () {
		try {
			localStorage.removeItem(STORAGE_KEY); // cascades via the patch
		} catch {
			// ignore
		}
	};
})();
