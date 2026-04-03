import { save } from "../store.js";
import { bootstrapTasks } from "../tasks.js";
import { ensureMonInfoLoaded } from "../../data/mon_info/_loader.js";
import {
	getGameColor,
	computeChipScale,
	prepFormsModal,
	createWheelResizeHandler,
} from "./modal.js";
import {
	normalizeFlag,
	rankStatus,
	pickHighestStatus,
	isCompletedForGame,
	clampStatusForMon,
	isOptionAllowedForMon,
	clampStatusForForm,
	isOptionAllowedForForm,
	getFilterClassForStatus,
	renderBadges,
	getDexScrollContainer,
	resolveMaybeFn,
} from "./helpers.js";
import {
	attachProgressHelpers,
	formsPctFor,
	researchPctFor,
	researchStatsFor,
} from "./dex-progress.js";
import { setupDexFormsModal } from "./dex-forms.js";
import { openMonInfo, setupMonInfoModal } from "./dex-mon-info.js";
import { openResearchModal, setupResearchModal } from "./dex-research.js";

window.DATA = window.DATA || {};
window.DATA.dexVariants = window.DATA.dexVariants || {
	ruby: ["ruby", "ruby-national"],
	sapphire: ["sapphire", "sapphire-national"],
	firered: ["firered", "firered-national"],
	leafgreen: ["leafgreen", "leafgreen-national"],
	emerald: ["emerald", "emerald-national"],
	diamond: ["diamond", "diamond-national"],
	pearl: ["pearl", "pearl-national"],
	platinum: ["platinum", "platinum-national"],
	heartgold: ["heartgold", "heartgold-national"],
	soulsilver: ["soulsilver", "soulsilver-national"],
	black: ["black", "black-national"],
	white: ["white", "white-national"],
	black2: ["black2", "black2-national"],
	white2: ["white2", "white2-national"],
	x: ["x-central", "x-coastal", "x-mountain", "x-national"],
	y: ["y-central", "y-coastal", "y-mountain", "y-national"],
	sun: ["sun-alola", "sun-melemele", "sun-akala", "sun-ulaula", "sun-poni"],
	moon: ["moon-alola", "moon-melemele", "moon-akala", "moon-ulaula", "moon-poni"],
	ultrasun: ["ultrasun-alola", "ultrasun-melemele", "ultrasun-akala", "ultrasun-ulaula", "ultrasun-poni"],
	ultramoon: ["ultramoon-alola", "ultramoon-melemele", "ultramoon-akala", "ultramoon-ulaula", "ultramoon-poni"],
	sword: ["sword", "swordioa", "swordct"],
	swordioa: ["sword", "swordioa", "swordct"],
	swordct: ["sword", "swordioa", "swordct"],
	shield: ["shield", "shieldioa", "shieldct"],
	shieldioa: ["shield", "shieldioa", "shieldct"],
	shieldct: ["shield", "shieldioa", "shieldct"],
	scarlet: ["scarlet", "scarlettm", "scarletid"],
	scarlettm: ["scarlet", "scarlettm", "scarletid"],
	scarletid: ["scarlet", "scarlettm", "scarletid"],
	violet: ["violet", "violettm", "violetid"],
	violettm: ["violet", "violettm", "violetid"],
	violetid: ["violet", "violettm", "violetid"],
	legendsza: ["legendsza", "legendszamd"],
	legendszamd: ["legendsza", "legendszamd"],
};

// --- Tag helpers ----------------------------------------------------
const TAG_ORDER = [
	"gender",
	"alolan",
	"galarian",
	"hisuian",
	"paldean",
	"other",
	"starter",
	"fossil",
	"pseudo",
	"legendary",
	"mythical",
	"mega",
	"zcrystal",
	"ultrabeast",
	"gigantamax",
	"paradox",
];

function _normalizeDexList(gameKey, raw) {
	// preferred: the classic shape
	if (Array.isArray(raw)) return raw;

	// allowed wrapper: { items: [...] }
	if (raw && Array.isArray(raw.items)) return raw.items;

	// common “nested by gameKey” mistake: { red: [...] }
	if (raw && typeof raw === "object" && Array.isArray(raw[gameKey])) return raw[gameKey];

	return [];
}

function _getDexList(gameKey) {
	return _normalizeDexList(gameKey, window.DATA?.dex?.[gameKey]);
}

/**
 * Build a normalized, ordered tag list for any dex entry or form.
 * - Uses obj.tags if present
 * - Also folds in legacy boolean flags (gender, starter, etc.) so old data still works
 * - Returns a new array (does not mutate the original object)
 */
function extractTags(obj) {
	if (!obj) return [];

	let tags = [];
	if (Array.isArray(obj.tags)) {
		tags = obj.tags.map((t) => String(t).toLowerCase());
	}

	// Sort by your preferred order; unknown tags go at the end alphabetically
	tags.sort((a, b) => {
		const ia = TAG_ORDER.indexOf(a);
		const ib = TAG_ORDER.indexOf(b);
		if (ia === -1 && ib === -1) return a.localeCompare(b);
		if (ia === -1) return 1;
		if (ib === -1) return -1;
		return ia - ib;
	});

	return tags;
}

/**
 * Does this entry/form have a given tag?
 * `tag` should be lowercase (we’ll lowercase everything internally anyway).
 */
function hasTag(obj, tag) {
	const needle = String(tag || "").toLowerCase();
	if (!needle) return false;
	const tags = extractTags(obj);
	return tags.includes(needle);
}

const _isMythicalForm = (f) => typeof f === "object" && hasTag(f, "mythical");
// --- Dex key helpers shared by cards + modal --------------------
function isNatKey(k) {
	return String(k || "").endsWith("-national");
}

function baseOf(k) {
	const str = String(k || "");
	// Strip "-national" if present
	const withoutNat = str.endsWith("-national")
		? str.replace(/-national$/, "")
		: str;
	// Then take everything before the first "-"
	return withoutNat.split("-")[0];
}

function buildNatDexIndex() {
	const dexRoot = window.DATA?.dex || {};
	const index = {};

	for (const [gameKey, raw] of Object.entries(dexRoot)) {
		const list = _normalizeDexList(gameKey, raw);
		if (!list.length) continue;

		// baseOf("diamond") -> "diamond"
		// baseOf("diamond-national") -> "diamond"
		// baseOf("x-central") -> "x"
		const baseKey = baseOf(gameKey);
		if (!baseKey) continue;

		if (!index[baseKey]) {
			index[baseKey] = new Map();
		}
		const map = index[baseKey];

		for (const entry of list) {
			if (!entry || typeof entry !== "object") continue;
			const nat = entry.natiId;
			if (nat === undefined || nat === null) continue;

			const natKey = String(nat);
			if (!map.has(natKey)) map.set(natKey, []);
			map.get(natKey).push({
				gameKey,
				id: entry.id,
			});
		}
	}

	window.PPGC = window.PPGC || {};
	window.PPGC._natDexIndex = index;
}

// Build once when this module is first imported (if not already built)
(function ensureNatIndex() {
	try {
		window.PPGC = window.PPGC || {};
		if (!window.PPGC._natDexIndex) {
			buildNatDexIndex();
		}
	} catch (e) {
		console.error("[dex] Failed to build natDex index:", e);
	}
})();

// Small helper for Dex↔Dex code below
function _getNatIndexForGame(gameKey) {
	window.PPGC = window.PPGC || {};
	const root = window.PPGC._natDexIndex;
	if (!root) return null;
	const baseKey = baseOf(gameKey);
	return root[baseKey] || null;
}

function statusIsShiny(status) {
	return status === "shiny" || status === "shiny_alpha";
}

function labelForDexKey(baseKey, key) {
	if (!key) return "";

	const names = (window.DATA && window.DATA.dexNames) || {};
	const v = names[key];

	if (typeof v === "string") return v;
	if (v && typeof v === "object") {
		// common "extra wrapper" shape: { red: "Kanto Dex" }
		if (typeof v[key] === "string") return v[key];
		if (typeof v.name === "string") return v.name;
		if (typeof v.label === "string") return v.label;
	}

	if (isNatKey(key)) return "National Dex";

	// 3) Derive a suffix-based name for things like x-central, sun-melemele, etc.
	const strKey = String(key);
	const baseGuess = baseKey || baseOf(strKey);
	const rawBase = strKey.startsWith(baseGuess) ? baseGuess : baseOf(strKey);

	let raw = strKey.replace(rawBase, "").replace(/^-/, "");
	if (!raw) return "Regional Dex";

	const pretty = raw.charAt(0).toUpperCase() + raw.slice(1);
	return `${pretty} Dex`;
}

function shortLabelForDexKey(baseKey, key) {
	const full = labelForDexKey(baseKey, key);
	// Strip a trailing " Dex" to get things like "Unova", "National"
	return full.replace(/\s*Dex$/i, "");
}

/**
 * Look up the forms node for a mon within the dex store, creating
 * nested objects on demand so callers can safely mutate it.
 */
function _getDexFormsNode(store, gameKey, monId) {
	const map = store.dexFormsStatus.get(gameKey) || {};
	const node = map[monId] || { all: false, forms: {} };
	return { map, node };
}
/**
 * Replace the forms node for a mon within the dex store.
 */
function _setDexFormsNode(store, gameKey, monId, node) {
	const map = store.dexFormsStatus.get(gameKey) || {};
	map[monId] = node;
	store.dexFormsStatus.set(gameKey, map);
	save();
}
function _setAllFormsForMon(
	store,
	gameKey,
	monId,
	formsList,
	status
) {
	const map = store.dexFormsStatus.get(gameKey) || {};
	const node = map[monId] || { all: false, forms: {} };
	node.forms = node.forms || {};

	// Look up the mon so we can apply species + per-form caps
	const dexList = _getDexList(gameKey);
	const mon = dexList.find((m) => m && String(m.id) === String(monId)) || null;

	for (const f of formsList || []) {
		const name = typeof f === "string" ? f : f?.name;
		if (!name) continue;
		const applied = clampStatusForForm(mon, f, status);
		node.forms[name] = applied;
	}

	const total = (formsList || []).length;
	const filled = Object.values(node.forms).filter(
		(v) => v && v !== "unknown"
	).length;
	node.all = total > 0 && filled === total && status !== "unknown";

	map[monId] = node;
	store.dexFormsStatus.set(gameKey, map);
	return node;
}
/**
 * Compute the effective species status based on the base species
 * flag and all of its forms.
 */
function _effectiveSpeciesStatus(store, gameKey, mon) {
	const statusMap = store.dexStatus.get(gameKey) || {};
	let base = statusMap[mon.id] || "unknown";
	if (Array.isArray(mon.forms) && mon.forms.length) {
		const { node } = _getDexFormsNode(store, gameKey, mon.id);
		const formVals = (mon.forms || []).map((f) => {
			const name = typeof f === "string" ? f : f?.name;
			return node.forms?.[name] || "unknown";
		});
		const highest = pickHighestStatus(formVals);
		if (rankStatus(highest) > rankStatus(base)) base = highest;
	}
	// ⬇️ NEW: enforce per-mon max
	return clampStatusForMon(mon, base);
}

/**
 * Build the summary card data for a given game's dex section.
 * Returned object is consumed by the card renderer.
 */
export function dexSummaryCardFor(gameKey, genKey, store) {
	const games = window.DATA.games?.[genKey] || [];
	const game = games.find((g) => g.key === gameKey);
	const dex = _getDexList(gameKey);

	// ——— Inject golden meter styles once ———
	if (!document.getElementById("ppgc-golden-meter-css")) {
		const style = document.createElement("style");
		style.id = "ppgc-golden-meter-css";
		document.head.appendChild(style);
	}

	const isMythical = (m) => !!m?.mythical;

	// --- National meter (same math, but against `${base}-national`) ---
	const baseGameKey = String(gameKey).endsWith("-national")
		? String(gameKey).replace(/-national$/, "")
		: String(gameKey);
	const natKey = `${baseGameKey}-national`;
	const natDex = _getDexList(natKey);

	const baseKey = baseGameKey;
	const variants = window.DATA.dexVariants?.[baseKey] || [gameKey];
	const hasVariantsConfig =
		Array.isArray(window.DATA.dexVariants?.[baseKey]) &&
		window.DATA.dexVariants[baseKey].length > 1;

	const natBaseDex = natDex.filter((m) => !isMythical(m));
	const natExtraDex = natDex.filter((m) => isMythical(m));
	const natBaseTotal = natBaseDex.length;
	const natExtraTotal = natExtraDex.length;

	const natBaseDone = natBaseDex.filter((m) =>
		isCompletedForGame(game, _effectiveSpeciesStatus(store, natKey, m))
	).length;
	const natExtraDone = natExtraDex.filter((m) =>
		isCompletedForGame(game, _effectiveSpeciesStatus(store, natKey, m))
	).length;

	const natPctBase = natBaseTotal ? (natBaseDone / natBaseTotal) * 100 : 0;
	const natPctExtended = natBaseTotal
		? ((natBaseDone + natExtraDone) / natBaseTotal) * 100
		: 0;
	const natPctBar = Math.min(
		100,
		Math.max(0, Math.round((natBaseDone / Math.max(1, natBaseTotal)) * 100))
	);
	const natPctExtraOverlay =
		natBaseTotal > 0 && natBaseDone === natBaseTotal && natExtraTotal > 0
			? (natExtraDone / natExtraTotal) * 100
			: 0;

	// --- Forms meter (split base/extra by per-form "mythical" flag)
	const haveNat = natBaseTotal > 0;
	const formsDex = haveNat ? natDex : dex;
	const speciesWithForms = formsDex.filter((m) => Array.isArray(m.forms) && m.forms.length);

	// totals
	let formsBaseTotal = 0,
		formsExtraTotal = 0,
		formsBaseDone = 0,
		formsExtraDone = 0;

	for (const m of speciesWithForms) {
		const nodeKey = haveNat ? natKey : gameKey;
		const { node } = _getDexFormsNode(store, nodeKey, m.id);

		for (const f of m.forms) {
			const name = typeof f === "string" ? f : f?.name;
			if (!name) continue;

			const isExtra = _isMythicalForm(f);               // <- mythical form?
			const v = normalizeFlag(node.forms?.[name] || "unknown");
			const isDone = isCompletedForGame(game, v);

			if (isExtra) {
				formsExtraTotal += 1;
				if (isDone) formsExtraDone += 1;
			} else {
				formsBaseTotal += 1;
				if (isDone) formsBaseDone += 1;
			}
		}
	}

	// base vs extended math (mirrors species meters)
	const formsPctBase = formsBaseTotal ? (formsBaseDone / formsBaseTotal) * 100 : 0;
	const formsPctExtended = formsBaseTotal ? ((formsBaseDone + formsExtraDone) / formsBaseTotal) * 100 : 0;
	const formsPctBar = Math.min(100, Math.max(0, Math.round((formsBaseDone / Math.max(1, formsBaseTotal)) * 100)));
	const formsPctExtraOverlay =
		formsBaseTotal > 0 && formsBaseDone === formsBaseTotal && formsExtraTotal > 0
			? (formsExtraDone / formsExtraTotal) * 100
			: 0;

	const haveForms = (formsBaseTotal + formsExtraTotal) > 0;

	const {
		baseTotal: researchBaseTotal,
		extraTotal: researchExtraTotal,
		baseDone: researchBaseDone,
		extraDone: researchExtraDone,
	} = researchStatsFor(gameKey, genKey, store);

	const haveResearch = researchBaseTotal + researchExtraTotal > 0;

	let researchPctBar = 0,
		researchPctExtraOverlay = 0,
		researchLabelPct = 0;

	if (haveResearch) {
		const pctBase =
			researchBaseTotal ? (researchBaseDone / researchBaseTotal) * 100 : 0;
		const pctExtended = researchBaseTotal
			? ((researchBaseDone + researchExtraDone) / researchBaseTotal) * 100
			: 0;

		researchLabelPct =
			researchBaseDone === researchBaseTotal ? pctExtended : pctBase;
		researchPctBar = Math.min(
			100,
			Math.max(0, Math.round((researchBaseDone / Math.max(1, researchBaseTotal)) * 100))
		);
		researchPctExtraOverlay =
			researchBaseTotal > 0 &&
				researchBaseDone === researchBaseTotal &&
				researchExtraTotal > 0
				? (researchExtraDone / researchExtraTotal) * 100
				: 0;
	}

	const card = document.createElement("section");
	card.className = "card";
	const nationalHTML = haveNat && !hasVariantsConfig
		? `
		<!-- national meter -->
		<div class="small">National:
			${natBaseDone === natBaseTotal ? natBaseDone + natExtraDone : natBaseDone}
			/ ${natBaseTotal || 0}
			(${(natBaseDone === natBaseTotal ? natPctExtended : natPctBase).toFixed(2)}%)
		</div>
		<div class="progress ${natPctExtraOverlay > 0 ? "has-extra" : ""}">
			<span class="base"  style="width:${natPctBar}%"></span>
			<span class="extra" style="width:${natPctExtraOverlay}%"></span>
			${natPctExtraOverlay > 0 ? `<div class="extra-badge" title="Extra credit progress">+${natPctExtraOverlay.toFixed(0)}%</div>` : ``}
		</div>`
		: ``;

	const formsHTML = haveForms
		? `
		<!-- forms meter -->
		<div class="small">
			Forms:
			${formsBaseDone === formsBaseTotal ? formsBaseDone + formsExtraDone : formsBaseDone}
			/ ${formsBaseTotal || 0}
			(${(formsBaseDone === formsBaseTotal ? formsPctExtended : formsPctBase).toFixed(2)}%)
		</div>
		<div class="progress ${formsPctExtraOverlay > 0 ? "has-extra" : ""}">
			<span class="base"  style="width:${formsPctBar}%"></span>
			<span class="extra" style="width:${formsPctExtraOverlay}%"></span>
			${formsPctExtraOverlay > 0 ? `<div class="extra-badge" title="Extra credit progress">+${formsPctExtraOverlay.toFixed(0)}%</div>` : ``}
		</div>`
		: ``;

	const researchHTML = haveResearch
		? `
    <!-- research meter -->
    <div class="small" data-research-label="${gameKey}">
      Research Tasks:
      ${researchBaseDone === researchBaseTotal ? researchBaseDone + researchExtraDone : researchBaseDone}
      / ${researchBaseTotal || 0}
      (${researchLabelPct.toFixed(2)}%)
    </div>
    <div class="progress ${researchPctExtraOverlay > 0 ? "has-extra" : ""}" data-research-meter="${gameKey}">
      <span class="base"  style="width:${researchPctBar}%"></span>
      <span class="extra" style="width:${researchPctExtraOverlay}%"></span>
      ${researchPctExtraOverlay > 0 ? `<div class="extra-badge" title="Extra credit progress">+${researchPctExtraOverlay.toFixed(0)}%</div>` : ``}
    </div>`
		: ``;

	// ---------- MULTI-DEX VARIANT METERS ----------
	let variantsHTML = "";
	if (variants.length) {
		for (const dk of variants) {
			const d = _getDexList(dk);
			if (!d.length) continue;

			const variantBaseKey = baseOf(dk);
			const label = shortLabelForDexKey(variantBaseKey, dk);

			// Split into base vs extra (mythical) species
			const baseMons = d.filter((m) => !isMythical(m));
			const extraMons = d.filter((m) => isMythical(m));

			const regionTotal = baseMons.length;
			const extraTotal = extraMons.length;

			let regionDone = 0;
			let extraDone = 0;

			for (const m of baseMons) {
				if (
					isCompletedForGame(
						game,
						_effectiveSpeciesStatus(store, dk, m)
					)
				) {
					regionDone++;
				}
			}
			for (const m of extraMons) {
				if (
					isCompletedForGame(
						game,
						_effectiveSpeciesStatus(store, dk, m)
					)
				) {
					extraDone++;
				}
			}

			// Base vs “extra credit” math aligned with National / Forms meters
			const pctBase =
				regionTotal > 0 ? (regionDone / regionTotal) * 100 : 0;
			const pctExtended =
				regionTotal > 0
					? ((regionDone + extraDone) / regionTotal) * 100
					: 0;

			const labelPct =
				regionDone === regionTotal ? pctExtended : pctBase;

			const pctBar = Math.min(
				100,
				Math.max(0, Math.round((regionDone / Math.max(1, regionTotal)) * 100))
			);

			const pctExtraOverlay =
				regionTotal > 0 &&
					regionDone === regionTotal &&
					extraTotal > 0
					? (extraDone / extraTotal) * 100
					: 0;

			const labelDone =
				regionDone === regionTotal
					? `${regionDone + extraDone} / ${regionTotal}`
					: `${regionDone}/${regionTotal}`;

			variantsHTML += `
				<div class="small">
					${label}:
					${labelDone} (${labelPct.toFixed(2)}%)
				</div>
				<div class="progress ${pctExtraOverlay > 0 ? "has-extra" : ""}">
					<span class="base"  style="width:${pctBar}%"></span>
					<span class="extra" style="width:${pctExtraOverlay}%"></span>
					${pctExtraOverlay > 0 ? `<div class="extra-badge" title="Extra credit progress">+${pctExtraOverlay.toFixed(0)}%</div>` : ``}
				</div>`;
		}
	}

	card.innerHTML = `
		<div class="card-hd"><h3>Pokédex — <span class="small">${game?.label || gameKey
		}</span></h3></div>
		<div class="card-bd">
			${variantsHTML}
			${nationalHTML}
			${formsHTML}
			${researchHTML}
		</div>
	`;
	return card;
}
/**
 * Compute overall dex completion percentage for a game.
 */
export function dexPctFor(gameKey, genKey, store) {
	const games = window.DATA.games?.[genKey] || [];
	const game = games.find((g) => g.key === gameKey);
	const dex = _getDexList(gameKey);

	const isMythical = (m) => !!m?.mythical;

	const baseDex = dex.filter((m) => !isMythical(m));
	const extraDex = dex.filter((m) => isMythical(m));
	const baseDone = baseDex.filter((m) =>
		isCompletedForGame(game, _effectiveSpeciesStatus(store, gameKey, m))
	).length;
	const baseTotal = baseDex.length;
	const extraDone = extraDex.filter((m) =>
		isCompletedForGame(game, _effectiveSpeciesStatus(store, gameKey, m))
	).length;

	const pctBase = baseTotal ? (baseDone / baseTotal) * 100 : 0;
	const pctExtended = ((baseDone + extraDone) / Math.max(1, baseTotal)) * 100;
	return baseDone === baseTotal ? pctExtended : pctBase;
}

/**
 * Wire up the main dex modal: search, bulk controls, per-mon cards,
 * forms wheel modal, and research modal.
 */
export function wireDexModal(store, els) {
	let _closing = false;
	const {
		modal,
		modalClose,
		dexGrid,
		dexSearch,
		dexSelectAll,
		dexClearAll,
		modalTitle,
	} = els;
	const bulkStatusSelect = dexClearAll;
	let dexHelpDropdown = null;

	if (dexSelectAll && bulkStatusSelect && dexSelectAll.parentElement && dexSelectAll.parentElement === bulkStatusSelect.parentElement) {
		const parent = dexSelectAll.parentElement;
		const bulkGroup = document.createElement("div");
		bulkGroup.className = "dex-bulk-group";

		dexSelectAll.style.width = '100%';
		bulkStatusSelect.style.width = '100%';

		// Insert the group where the button currently lives
		parent.insertBefore(bulkGroup, dexSelectAll);
		bulkGroup.appendChild(dexSelectAll);
		bulkGroup.appendChild(bulkStatusSelect);
	}

	function ensureDexHelpDropdown() {
		if (!dexSearch || dexHelpDropdown) return;
		dexSearch.style.width = "250px";

		dexHelpDropdown = document.createElement("div");
		dexHelpDropdown.className = "dex-help-dropdown";
		dexHelpDropdown.style.position = "absolute";
		dexHelpDropdown.style.zIndex = "25";
		dexHelpDropdown.style.padding = "8px 10px";
		dexHelpDropdown.style.borderRadius = "6px";
		dexHelpDropdown.style.fontSize = "12px";
		dexHelpDropdown.style.maxWidth = "360px";
		dexHelpDropdown.style.background = "var(--card-bg, #111827)";
		dexHelpDropdown.style.border = "1px solid rgba(255,255,255,.1)";
		dexHelpDropdown.style.boxShadow = "0 8px 16px rgba(0,0,0,.45)";
		dexHelpDropdown.style.display = "none";

		dexHelpDropdown.innerHTML = `
			<div style="font-weight:600;margin-bottom:4px;">Dex commands</div>
			<div><code>/status &lt;status&gt;</code> – unknown, seen, caught, shiny, alpha, shinyalpha</div>
			<div><code>/form &lt;status&gt;</code> – gender, mega, regional, alolan, galarian, hisuian, paldean, other</div>
			<div><code>/species &lt;tag&gt;</code> – starter, fossil, pseudo, mega, ultrabeast, paradox, legendary, mythical</div>
			<div><code>/type &lt;type&gt;</code> – filter by typings (e.g. <code>/type fire</code>) (WIP)</div>
			<div><code>/evolution &lt;method&gt;</code> – level, stone, item, trade, happiness, other (WIP)</div>
			<div><code>/location &lt;text&gt;</code> – filter by game location (WIP)</div>
			<div><code>/stage &lt;n&gt;</code> – evolution stage 1, 2, or 3 (WIP)</div>
		`;

		// Only attach to body so we can position it with page coordinates
		document.body.appendChild(dexHelpDropdown);
	}

	function updateDexHelpDropdown(rawQ) {
		ensureDexHelpDropdown();
		if (!dexHelpDropdown || !dexSearch) return;

		const v = (rawQ || "").trim().toLowerCase();
		if (v === "/help") {
			const rect = dexSearch.getBoundingClientRect();

			// Position just under the search input
			dexHelpDropdown.style.left = `${rect.left + window.scrollX}px`;
			dexHelpDropdown.style.top = `${rect.bottom + window.scrollY + 4}px`;
			dexHelpDropdown.style.display = "";
		} else {
			dexHelpDropdown.style.display = "none";
		}
	}

	attachProgressHelpers(store);

	const { openDexForms } = setupDexFormsModal(store, {
		formsModal,
		formsModalClose,
		formsWheel,
		getGameColor,
		computeChipScale,
		prepFormsModal,
		createWheelResizeHandler,
		normalizeFlag,
		clampStatusForForm,
		isOptionAllowedForForm,
		getFilterClassForStatus,
		renderBadges,
		shouldUseColorSprite,
		getDexFormsNode: (gameKey, monId) => _getDexFormsNode(store, gameKey, monId),
		setDexFormsNode: (gameKey, monId, node) =>
			_setDexFormsNode(store, gameKey, monId, node),
		applyDexLinksFromForm: (gameKey, monId, formName, status) =>
			applyDexLinksFromForm(gameKey, monId, formName, status),
		renderDexGrid,
	});

	window.PPGC = window.PPGC || {};
	window.PPGC.formsPctFor = (gameKey, genKey) =>
		formsPctFor(gameKey, genKey, store);
	window.PPGC.researchPctFor = (gameKey, genKey) =>
		researchPctFor(gameKey, genKey, store);
	setupMonInfoModal();
	setupResearchModal();

	if (!window.__PPGC_DEX_RESEARCH_SAVED_WIRED) {
		window.__PPGC_DEX_RESEARCH_SAVED_WIRED = true;

		window.addEventListener("ppgc:researchSaved", (e) => {
			const d = e?.detail || {};
			const gameKey = String(d.gameKey || "");
			const monId = String(d.monId || "");
			const stats = d.stats || null;

			// Only update if the dex modal is open for this same dex key
			if (!store?.state?.dexModalFor) return;
			if (String(store.state.dexModalFor) !== gameKey) return;

			// Update per-card count
			const keyForCount = `${gameKey}:${monId}`;
			const el = document.querySelector(`[data-dex-research-count="${keyForCount}"]`);
			if (el && stats && typeof stats.doneTiers === "number" && typeof stats.totalTiers === "number") {
				el.textContent = `${stats.doneTiers}/${stats.totalTiers}`;
				el.title = `Tiers completed: ${stats.doneTiers}/${stats.totalTiers} • Level: ${Math.min(10, Number(stats.researchLevel || 0))}/10`;
			}

			// ✅ MOVE THIS INSIDE THE HANDLER
			try {
				const currentGenKey =
					store?.state?.genKey ||
					store?.state?.currentGenKey ||
					store?.state?.activeGenKey ||
					null;

				const gk = gameKey;
				const { baseTotal, baseDone, extraTotal, extraDone } =
					researchStatsFor(gk, currentGenKey, store);

				const haveResearch = (baseTotal + extraTotal) > 0;
				if (!haveResearch) return;

				const pctBase = baseTotal ? (baseDone / baseTotal) * 100 : 0;
				const pctExtended = baseTotal ? ((baseDone + extraDone) / baseTotal) * 100 : 0;
				const labelPct = (baseDone === baseTotal) ? pctExtended : pctBase;

				const pctBar = Math.min(100, Math.max(0, Math.round((baseDone / Math.max(1, baseTotal)) * 100)));
				const pctExtraOverlay =
					baseTotal > 0 && baseDone === baseTotal && extraTotal > 0
						? (extraDone / extraTotal) * 100
						: 0;

				document.querySelectorAll(`[data-research-label="${gk}"]`).forEach((el) => {
					const shownDone = (baseDone === baseTotal) ? (baseDone + extraDone) : baseDone;
					el.textContent = `Research Tasks: ${shownDone} / ${baseTotal || 0} (${labelPct.toFixed(2)}%)`;
				});

				document.querySelectorAll(`[data-research-meter="${gk}"]`).forEach((wrap) => {
					const baseSpan = wrap.querySelector("span.base");
					const extraSpan = wrap.querySelector("span.extra");
					if (baseSpan) baseSpan.style.width = `${pctBar}%`;
					if (extraSpan) extraSpan.style.width = `${pctExtraOverlay}%`;
					if (pctExtraOverlay > 0) wrap.classList.add("has-extra");
					else wrap.classList.remove("has-extra");
				});
			} catch (err) {
				console.warn("[PPGC] research meter refresh failed", err);
			}
		});
	}

	if (formsModal && formsModal.parentElement !== document.body) {
		document.body.appendChild(formsModal);
	}

	const modalChange =
		modal.querySelector("header .modalChange") || modal.querySelector(".modal-hd");

	// single unified dropdown for all dex scopes (regional / sub-dex / national)
	let scopeSelect = null;

	function resolveInitialDexKey(rawKey) {
		if (!rawKey) return rawKey;

		const base = baseOf(rawKey);

		// If this exact key already has a dex with data, use it.
		const direct = _getDexList(rawKey);
		if (Array.isArray(direct) && direct.length > 0) return rawKey;

		// Otherwise, look at dexVariants[base] and pick the first one that has data.
		const variants = window.DATA.dexVariants?.[base];
		if (Array.isArray(variants) && variants.length) {
			for (const v of variants) {
				const arr = _getDexList(v);
				if (Array.isArray(arr) && arr.length > 0) return v;
			}
			// If none have data yet, just fall back to the first variant.
			return variants[0];
		}

		// Fallback: just use the raw key.
		return rawKey;
	}

	// Build the list of dex keys (regional/sub-dex/national) for a base game.
	function computeDexScopeOptions(baseKey) {
		if (!baseKey) return [];

		const variantsCfg = window.DATA.dexVariants?.[baseKey];
		const hasVariantsCfg =
			Array.isArray(variantsCfg) && variantsCfg.length > 0;

		let list = [];

		// 1) sub-dex variants (XY, Alola, etc.)
		if (hasVariantsCfg) {
			// For games with variants, we ONLY use the explicit variant keys
			// (e.g. x-central, x-coastal, sun-alola, sun-melemele, etc.)
			list = variantsCfg.slice();
		} else {
			// No explicit variants: just the base dex if it exists
			const baseDex = _getDexList(baseKey);
			if (Array.isArray(baseDex) && baseDex.length) {
				list.push(baseKey);
			}
		}

		// 2) national dex, if it exists
		const natKey = `${baseKey}-national`;
		const natDex = _getDexList(natKey);
		const hasNat = Array.isArray(natDex) && natDex.length > 0;
		if (hasNat && !list.includes(natKey)) {
			list.push(natKey);
		}

		// 3) For non-variant games, make sure the base key is present
		//    so it can be labeled "Regional Dex" in the dropdown.
		if (!hasVariantsCfg && !list.includes(baseKey)) {
			list.unshift(baseKey);
		}

		// If there's only one entry, there’s nothing to switch between
		if (list.length <= 1) return [];
		return list;
	}

	function populateBulkStatusSelect(gameKey, game, dex) {
		if (!bulkStatusSelect || !(bulkStatusSelect.tagName === "SELECT")) return;
		// Avoid re-building if already populated for this game
		if (bulkStatusSelect.dataset.forGameKey === String(gameKey) && bulkStatusSelect.options.length) {
			return;
		}
		bulkStatusSelect.innerHTML = "";
		bulkStatusSelect.dataset.forGameKey = String(gameKey || "");

		const canonicalOrder = ["shiny_alpha", "alpha", "shiny", "caught", "seen", "unknown"];
		// Use game.flags when available; otherwise fall back to full canonical list
		let rawFlags = Array.isArray(game?.flags) && game.flags.length ? game.flags.slice() : canonicalOrder.slice();

		// Normalize and keep only those present in canonical order
		const present = new Set(rawFlags.map((f) => normalizeFlag(f)).filter(Boolean));
		// Ensure unknown exists as a safe fallback
		present.add("unknown");

		const finalFlags = canonicalOrder.filter((f) => present.has(f));

		finalFlags.forEach((val) => {
			const opt = document.createElement("option");
			opt.value = val;
			const label = val
				.replace(/_/g, " ")
				.replace(/\b\w/g, (s) => s.toUpperCase());
			opt.textContent = label;
			bulkStatusSelect.appendChild(opt);
		});

		// Default bulk status to "caught" if present, otherwise first option
		const hasCaught = finalFlags.includes("caught");
		bulkStatusSelect.value = hasCaught ? "caught" : (finalFlags[0] || "");
	}

	function refreshScopeControls(currentGameKey) {
		if (!modalChange || !currentGameKey) return;

		const modalCloseBtn = modalChange.querySelector(".modalClose");
		const baseKey = baseOf(currentGameKey || "");
		const options = computeDexScopeOptions(baseKey);

		// If there is no meaningful variant (no nat / no sub-dex), remove dropdown
		if (!options.length) {
			if (scopeSelect) {
				scopeSelect.remove();
				scopeSelect = null;
			}
			return;
		}

		// Ensure dropdown exists and is placed where the old Regi/Nati button was
		if (!scopeSelect) {
			scopeSelect = document.createElement("select");
			scopeSelect.className = "dex-scope-select";
			scopeSelect.title = "Choose Dex";

			modalChange.insertBefore(
				scopeSelect,
				modalCloseBtn || modalChange.firstChild
			);

			scopeSelect.addEventListener("change", () => {
				const newKey = scopeSelect.value;
				if (!newKey) return;

				const newBase = baseOf(newKey);
				const genKey =
					(window.DATA.tabs || [])
						.map((t) => t.key)
						.find((gk) =>
							(window.DATA.games[gk] || []).some(
								(g) => g.key === newBase
							)
						) || null;

				openDexModal(newKey, genKey);
			});
		}

		// Rebuild options each time in case DATA changes
		scopeSelect.innerHTML = "";
		options.forEach((key) => {
			const opt = document.createElement("option");
			opt.value = key;
			opt.textContent = labelForDexKey(baseKey, key);
			scopeSelect.appendChild(opt);
		});

		// Sync currently-open dex selection
		scopeSelect.value = currentGameKey;
	}

	window.PPGC = window.PPGC || {};
	if (!Array.isArray(window.PPGC._pendingDexSyncs)) window.PPGC._pendingDexSyncs = [];

	function _queueDexSync(gameKey, dexId, status) {
		window.PPGC._pendingDexSyncs.push({ gameKey, dexId, status });
	}
	window.PPGC = window.PPGC || {};
	if (!Array.isArray(window.PPGC._pendingDexSyncs)) {
		window.PPGC._pendingDexSyncs = [];
	}

	// NEW: small helper to batch dex sync work (skip repeated save/render)
	function runInDexBatch(fn) {
		window.PPGC = window.PPGC || {};
		const prev = !!window.PPGC._batchDexSync;
		window.PPGC._batchDexSync = true;
		try {
			fn && fn();
		} finally {
			window.PPGC._batchDexSync = prev;
		}
	}
	const GEN1_DEX_GAMES = new Set(["red", "blue", "yellow"]);
	// Dex thumb animation toggle: only meaningful from Gen 5 (Black/White) onward.
	const ANIM_DEX_GAMES = new Set([
		"black", "white", "black2", "white2",
		"x", "y", "omegaruby", "alphasapphire",
		"sun", "moon", "ultrasun", "ultramoon",
		"letsgopikachu", "letsgoeevee",
		"sword", "shield", "brilliantdiamond", "shiningpearl",
		"legendsarceus", "scarlet", "violet", "legendsza"
	]);

	function shouldUseColorSprite(gameKey) {
		if (!gameKey) return null;
		// baseOf() strips "-national" (e.g. "red-national" -> "red")
		const base = baseOf(gameKey);
		if (!GEN1_DEX_GAMES.has(base)) return null;
		// use true/false when we’re actually in a Gen 1 game
		return window.PPGC?.gen1SpriteColor === true;
	}
	function getImageForStatus(it, status) {
		const gameKey = store.state.dexModalFor;
		const useColor = shouldUseColorSprite(gameKey);

		const val = (v) => (typeof v === "function" ? v() : v);

		// Gen 1 color toggle: swaps B/W vs color via img/imgS
		if (useColor !== null) {
			const baseImg = val(resolveMaybeFn(it.img)) || "";
			const colorImg = val(resolveMaybeFn(it.imgS)) || baseImg;
			return useColor ? colorImg : baseImg;
		}

		// Gen 2+ : use imgS when status is shiny (or shiny_alpha), else img
		const isShiny =
			status === "shiny" ||
			status === "shiny_alpha" ||
			status === "shinyalpha";

		const primary = isShiny ? (it.imgS ?? it.img) : it.img;
		return val(resolveMaybeFn(primary)) || "";
	}
	// --- NEW: Dex↔Dex sync (natiId-first, dexSync fallback) --------------

	function _resolveDexTargetKey(link) {
		const game = link?.game;
		if (!game) return null;

		const t = String(link.dexType || "regional").toLowerCase();

		// 1) National: "x" -> "x-national"
		if (t === "national") return `${game}-national`;

		// 2) Explicit regional or default: just the base game (ruby, diamond, etc.)
		if (t === "regional") return game;

		// 3) X/Y sub-dexes
		if (t === "central" || t === "coastal" || t === "mountain") {
			return `${game}-${t}`;
		}

		// 4) Alola sub-dexes
		if (t === "melemele" || t === "akala" || t === "ulaula" || t === "poni") {
			return `${game}-${t}`;
		}

		// 5) Fallback for any future/custom types:
		//    try game-dexType, or just game if that doesn't exist.
		const candidate = `${game}-${t}`;
		if (window.DATA?.dex?.[candidate]) return candidate;
		return game;
	}

	function _resolveFormNameFor(link, entryId, targetGameKey) {
		if (typeof link?.form === "undefined" || link.form === null) return null;
		if (typeof link.form === "string") return link.form;

		// number => index into entry.forms (support 0- or 1-based)
		const dexList = window.DATA?.dex?.[targetGameKey] || [];
		const entry = dexList.find((e) => e && e.id === entryId);
		const forms = Array.isArray(entry?.forms) ? entry.forms : [];
		const idx =
			typeof link.form === "number"
				? link.form >= 1
					? link.form - 1
					: link.form
				: -1;
		const f = forms[idx];
		if (!f) return null;
		return typeof f === "string" ? f : f?.name || null;
	}

	/** Mirror changed species statuses across regional/sub/national dexes. */
	function applyDexLinksFromDexEntries(gameKey, changedMap) {
		const dexList = window.DATA?.dex?.[gameKey] || [];
		if (!dexList.length) return;

		// Prefer natiId-based syncing when possible
		const natIndex = _getNatIndexForGame(gameKey);

		for (const [idStr, newStatusRaw] of Object.entries(changedMap || {})) {
			const dexId = String(idStr);
			let entry = dexList.find((e) => e && String(e.id) === dexId);

			// fallback for legacy numeric keys
			if (!entry) {
				const n = Number(idStr);
				if (Number.isFinite(n)) {
					entry = dexList.find((e) => e && Number(e.localId ?? e.id) === n);
				}
			}
			if (!entry) continue;

			const newStatus = String(newStatusRaw || "unknown")
				.trim()
				.toLowerCase();

			const { natiId, dexSync } = entry;
			let usedNat = false;

			// ---------- Path 1: natiId-based sync ----------
			if (natIndex && natiId != null) {
				const natKey = String(natiId);
				const bucket = natIndex.get(natKey);

				if (bucket && bucket.length) {
					usedNat = true;
					for (const target of bucket) {
						const { gameKey: targetGameKey, id: targetId } = target;
						// skip self
						if (targetGameKey === gameKey && String(targetId) === String(entry.id)) continue;

						const curr = store.dexStatus.get(targetGameKey) || {};
						curr[targetId] = newStatus;
						store.dexStatus.set(targetGameKey, curr);

						if (!window.PPGC?._batchDexSync) {
							if (store.state.dexModalFor === targetGameKey) {
								renderDexGrid();
							}
						}
					}
				}
			}

			// ---------- Path 2: legacy dexSync fallback ----------
			if (!usedNat && Array.isArray(dexSync) && dexSync.length) {
				for (const link of dexSync) {
					const targetGameKey = _resolveDexTargetKey(link);
					const targetId = link?.id;
					if (!targetGameKey || typeof targetId !== "number") continue;

					const formName = _resolveFormNameFor(link, targetId, targetGameKey);
					if (!formName) {
						// species-level mirror (write exact status)
						const curr = store.dexStatus.get(targetGameKey) || {};
						curr[targetId] = newStatus;
						store.dexStatus.set(targetGameKey, curr);

						if (!window.PPGC?._batchDexSync) {
							save();
							if (store.state.dexModalFor === targetGameKey) {
								renderDexGrid();
							}
						}
					} else {
						// form-level mirror (same as your old implementation)
						const formsMap = store.dexFormsStatus.get(targetGameKey) || {};
						const node = formsMap[targetId] || { all: false, forms: {} };
						node.forms = node.forms || {};
						node.forms[formName] = newStatus;

						// recompute .all flag when every form is non-unknown
						const tList =
							(window.DATA?.dex?.[targetGameKey] || []).find(
								(e) => e && e.id === targetId
							)?.forms || [];
						const total = tList.length;
						const filled = tList.reduce((a, f) => {
							const nm = typeof f === "string" ? f : f?.name;
							return a + ((node.forms?.[nm] || "unknown") !== "unknown" ? 1 : 0);
						}, 0);
						node.all = total > 0 && filled === total && newStatus !== "unknown";
						formsMap[targetId] = node;
						store.dexFormsStatus.set(targetGameKey, formsMap);

						if (!window.PPGC?._batchDexSync) {
							save();
						}
					}
				}
			}
		}
	}

	/**
	 * Mirror a single form status across dexes.
	 * Preferred: natiId + matching form name.
	 * Fallback: legacy dexSync links on the entry/form.
	 */
	function applyDexLinksFromForm(sourceGameKey, sourceMonId, sourceFormName, status) {
		const dexList = window.DATA?.dex?.[sourceGameKey] || [];
		if (!dexList.length) return;

		const entry = dexList.find((e) => e && String(e.id) === String(sourceMonId));
		if (!entry) return;

		const formsArr = Array.isArray(entry.forms) ? entry.forms : [];
		const srcForm = formsArr.find((f) => {
			if (!f) return false;
			if (typeof f === "string") return f === sourceFormName;
			return f.name === sourceFormName;
		});

		const newStatus = String(status || "unknown")
			.trim()
			.toLowerCase();

		// ---------- Path 1: natiId-based form sync ----------
		const natIndex = _getNatIndexForGame(sourceGameKey);
		if (natIndex && entry.natiId !== undefined && entry.natiId !== null) {
			const bucket = natIndex.get(String(entry.natiId)) || [];
			for (const target of bucket) {
				const { gameKey: targetGameKey, id: targetId } = target;
				// skip self
				if (targetGameKey === sourceGameKey && targetId === sourceMonId) continue;

				const tList = window.DATA?.dex?.[targetGameKey] || [];
				const targetEntry = tList.find((e) => e && e.id === targetId);
				if (!targetEntry || !Array.isArray(targetEntry.forms)) continue;

				const targetForms = targetEntry.forms;
				const targetName = sourceFormName;

				// Only sync if the target has a form with the same name
				const hasMatchingForm = targetForms.some((f) => {
					if (!f) return false;
					const nm = typeof f === "string" ? f : f?.name;
					return nm === targetName;
				});
				if (!hasMatchingForm) continue;

				const formsMap = store.dexFormsStatus.get(targetGameKey) || {};
				const node = formsMap[targetId] || { all: false, forms: {} };
				node.forms = node.forms || {};

				node.forms[targetName] = newStatus;

				// Recompute .all for the target mon
				const total = targetForms.length;
				const filled = targetForms.reduce((a, f) => {
					const nm = typeof f === "string" ? f : f?.name;
					const v = nm ? node.forms?.[nm] || "unknown" : "unknown";
					return a + (v !== "unknown" ? 1 : 0);
				}, 0);
				node.all = total > 0 && filled === total && newStatus !== "unknown";

				formsMap[targetId] = node;
				store.dexFormsStatus.set(targetGameKey, formsMap);

				if (!window.PPGC?._batchDexSync) {
					save();
				}
			}
			return;
		}

		// ---------- Path 2: legacy dexSync-based form links ----------
		// Collect only form-specific links:
		//  - any entry.dexSync that has a .form field
		//  - plus any dexSync on the source form itself
		const entryLinks = Array.isArray(entry.dexSync)
			? entry.dexSync.filter(
				(lnk) => typeof lnk?.form !== "undefined" && lnk.form !== null
			)
			: [];

		const formLinks =
			srcForm &&
				typeof srcForm === "object" &&
				Array.isArray(srcForm.dexSync)
				? srcForm.dexSync
				: [];

		const links = [...entryLinks, ...formLinks];
		if (!links.length) return;

		for (const link of links) {
			const targetGameKey = _resolveDexTargetKey(link);
			const targetId = link?.id;
			if (!targetGameKey || typeof targetId !== "number") continue;

			const targetFormName = _resolveFormNameFor(
				link,
				targetId,
				targetGameKey
			);
			if (!targetFormName) continue;

			const formsMap = store.dexFormsStatus.get(targetGameKey) || {};
			const node = formsMap[targetId] || { all: false, forms: {} };
			node.forms = node.forms || {};

			// Set the target form’s status
			node.forms[targetFormName] = newStatus;

			// Recompute .all for the target mon
			const targetDexEntry = (window.DATA?.dex?.[targetGameKey] || []).find(
				(e) => e && e.id === targetId
			);
			const targetForms = Array.isArray(targetDexEntry?.forms)
				? targetDexEntry.forms
				: [];
			const total = targetForms.length;
			const filled = targetForms.reduce((a, f) => {
				const nm = typeof f === "string" ? f : f?.name;
				const v = nm ? node.forms?.[nm] || "unknown" : "unknown";
				return a + (v !== "unknown" ? 1 : 0);
			}, 0);
			node.all =
				total > 0 && filled === total && newStatus !== "unknown";

			formsMap[targetId] = node;
			store.dexFormsStatus.set(targetGameKey, formsMap);

			if (!window.PPGC?._batchDexSync) {
				save();
			}
		}
	}

	function speciesAndFormsMatch(entry, speciesFn, formFn) {
		let speciesMatch = false;
		let formsMatch = false;

		if (typeof speciesFn === "function") {
			speciesMatch = !!speciesFn(entry);
		}

		if (typeof formFn === "function" && Array.isArray(entry.forms) && entry.forms.length) {
			formsMatch = entry.forms.some((f) => {
				const obj = f && typeof f === "object" ? f : {};
				return !!formFn(obj);
			});
		}

		return speciesMatch || formsMatch;
	}

	function renderDexGrid() {
		const gameKey = store.state.dexModalFor;
		if (!gameKey) return;
		const genKey = (window.DATA.tabs || [])
			.map((t) => t.key)
			.find((gk) =>
				(window.DATA.games[gk] || []).some((g) => g.key === gameKey)
			);
		const game = (window.DATA.games?.[genKey] || []).find(
			(g) => g.key === gameKey
		);

		const dex = _getDexList(gameKey);
		populateBulkStatusSelect(gameKey, game, dex);
		const rawQ = (dexSearch.value || "").trim();
		const q = rawQ.toLowerCase();
		const options = game ? game.flags : ["shiny", "caught", "seen", "unknown"];
		const statusMap = store.dexStatus.get(gameKey) || {};

		updateDexHelpDropdown(rawQ);

		// --- Command parsing (/seen, /caught, /form, /legendary, /mythic) ---
		const STATUS_TOKEN_MAP = {
			unknown: "unknown",
			seen: "seen",
			caught: "caught",
			shiny: "shiny",
			alpha: "alpha",
			shinyalpha: "shiny_alpha",
			shiny_alpha: "shiny_alpha",
		};

		let cmdMode = null;        // "status" | "formStatus" | "species" | "type" | "location" | "stage"
		let cmdStatus = null;      // normalized status for /status and /form
		let cmdArg = null;         // generic string argument for type/location/species
		let cmdStage = null;       // numeric stage for /stage
		let isCommandTyping = false; // true if input starts with "/" at all

		if (q.startsWith("/")) {
			isCommandTyping = true;

			const parts = rawQ.trim().split(/\s+/);
			const cmd = (parts[0] || "").toLowerCase();
			const rest = parts.slice(1).join(" ").trim();

			// Helper to resolve things like "shiny alpha", "shiny_alpha", etc.
			const resolveStatusToken = (token) => {
				if (!token) return null;
				const compact = String(token).toLowerCase().replace(/[_\s]/g, "");
				if (!compact) return null;

				// direct lookup by canonical tokens (unknown, caught, shinyalpha, etc.)
				if (STATUS_TOKEN_MAP[compact]) {
					return normalizeFlag(STATUS_TOKEN_MAP[compact]);
				}

				// fallback: compare against keys with compacting (just in case)
				for (const [key, val] of Object.entries(STATUS_TOKEN_MAP)) {
					const keyCompact = key.toLowerCase().replace(/[_\s]/g, "");
					if (keyCompact === compact) return normalizeFlag(val);
				}
				return null;
			};

			if (cmd === "/status") {
				// /status <status>
				if (rest) {
					const st = resolveStatusToken(rest);
					if (st) {
						cmdMode = "status";
						cmdStatus = st;
					}
				}
			} else if (cmd === "/form") {
				// /form <form> – generic tag/tag-like filter for form groups
				if (rest) {
					cmdMode = "form";
					cmdArg = rest.toLowerCase();   // ✅ use cmdArg, not cmdStatus
				}
			} else if (cmd === "/species") {
				// /species <tag> – generic tag filter
				if (rest) {
					cmdMode = "species";
					cmdArg = rest.toLowerCase();
				}
			} else if (cmd === "/type") {
				// /type <typing> – uses monInfo.types (falls back to dex types if present)
				if (rest) {
					cmdMode = "type";
					cmdArg = rest.toLowerCase();
				}
			} else if (cmd === "/evolution") {
				// /evolution <evo> – generic tag filter
				if (rest) {
					cmdMode = "evolution";
					cmdArg = rest.toLowerCase();
				}
			} else if (cmd === "/location") {
				// /location <location substring> – uses monInfo.locations
				if (rest) {
					cmdMode = "location";
					cmdArg = rest.toLowerCase();
				}
			} else if (cmd === "/stage") {
				// /stage <stage> – 1/2/3 or "basic"/"stage1"/etc.
				if (rest) {
					let n = parseInt(rest, 10);
					if (Number.isNaN(n)) {
						const tok = rest.toLowerCase().replace(/[^a-z0-9]/g, "");
						if (tok === "basic" || tok === "stage1") n = 1;
						else if (tok === "stage2") n = 2;
						else if (tok === "stage3") n = 3;
					}
					if (Number.isInteger(n) && n > 0) {
						cmdMode = "stage";
						cmdStage = n;
					}
				}
			}
		}

		if (isCommandTyping && !cmdMode && !q.includes(" ")) {
			updateDexHelpDropdown(rawQ);
			return;
		}

		// --- build filtered list ----------------------------------------------
		let filtered;

		if (!q) {
			// Empty search → show all
			filtered = dex;
		} else if (q === "/help") {
			// /help only shows the command dropdown; don't narrow results
			filtered = dex;
		} else if (cmdMode) {
			// Handle completed /commands
			const monInfoForGame = (window.DATA.monInfo && window.DATA.monInfo[gameKey]) || null;

			filtered = dex.filter((it) => {
				if (cmdMode === "status") {
					// Species-level status, including forms
					const eff = _effectiveSpeciesStatus(store, gameKey, it);
					return normalizeFlag(eff) === cmdStatus;
				}
				if (cmdMode === "form") {
					const raw = (cmdArg || "").trim();
					if (!raw) return true;

					// normalize: lower-case and strip spaces/underscores
					let tag = raw.toLowerCase();

					// Allowed tags for /form
					// gender, mega, regional, alolan, galarian, hisuian, paldean, otherForms
					const allowedFormTags = new Set([
						"gender",
						"regional",
						"alolan",
						"galarian",
						"hisuian",
						"paldean",
						"other",
					]);

					// If it's not one of the supported /form tags, show no results
					if (!allowedFormTags.has(tag)) return false;

					return speciesAndFormsMatch(
						it,
						// species-level (dex entry)
						(sp) => {
							if (tag === "regional") {
								// Regional = any of the four region tags
								return (
									hasTag(sp, "alolan") ||
									hasTag(sp, "galarian") ||
									hasTag(sp, "hisuian") ||
									hasTag(sp, "paldean")
								);
							}
							return hasTag(sp, tag);
						},
						// form-level
						(form) => {
							if (tag === "regional") {
								return (
									hasTag(form, "alolan") ||
									hasTag(form, "galarian") ||
									hasTag(form, "hisuian") ||
									hasTag(form, "paldean")
								);
							}
							return hasTag(form, tag);
						}
					);
				}
				if (cmdMode === "species") {
					let tag = (cmdArg || "").toLowerCase().trim();
					if (!tag) return true;

					// Allowed tags for /species:
					// starter, fossil, pseudo, mega, zcrystal, ultrabeast, paradox, legendary, mythical
					const allowedSpeciesTags = new Set([
						"starter",
						"fossil",
						"pseudo",
						"legendary",
						"mythical",
						"mega",
						"zcrystal",
						"ultrabeast",
						"paradox",
					]);

					// Only these tags are supported
					if (!allowedSpeciesTags.has(tag)) return false;

					return speciesAndFormsMatch(
						it,
						// species-level tags
						(sp) => {
							if (tag === "legendary") {
								// keep your “legendary includes mythical” behavior
								return hasTag(sp, "legendary") || hasTag(sp, "mythical");
							}
							if (tag === "mythical") return hasTag(sp, "mythical");
							return hasTag(sp, tag);
						},
						// form-level tags
						(form) => {
							if (tag === "legendary") {
								return hasTag(form, "legendary") || hasTag(form, "mythical");
							}
							if (tag === "mythical") return hasTag(form, "mythical");
							return hasTag(form, tag);
						}
					);
				}
				if (cmdMode === "type") {
					// Uses monInfo.types first, then falls back to any types on the dex entry
					const needle = (cmdArg || "").toLowerCase().trim();
					if (!needle) return true;

					const info = monInfoForGame ? monInfoForGame[it.id] : null;

					// Species-level types
					const baseTypes = (info?.types || it.types || []).map((t) =>
						String(t).toLowerCase()
					);

					// Form-level types from monInfo (if you add them there)
					const formTypesFromInfo = [];
					if (Array.isArray(info?.forms)) {
						info.forms.forEach((f) => {
							if (!f) return;
							if (Array.isArray(f.types)) {
								f.types.forEach((t) => formTypesFromInfo.push(String(t).toLowerCase()));
							} else if (f.type) {
								formTypesFromInfo.push(String(f.type).toLowerCase());
							}
						});
					}

					// Optional: types defined directly on dex forms (if you ever use that)
					const formTypesFromDex = [];
					if (Array.isArray(it.forms)) {
						it.forms.forEach((f) => {
							if (!f || typeof f !== "object") return;
							if (Array.isArray(f.types)) {
								f.types.forEach((t) => formTypesFromDex.push(String(t).toLowerCase()));
							} else if (f.type) {
								formTypesFromDex.push(String(f.type).toLowerCase());
							}
						});
					}

					const allTypes = [...baseTypes, ...formTypesFromInfo, ...formTypesFromDex];
					if (!allTypes.length) return false;

					return allTypes.some((t) => t.includes(needle));
				}
				if (cmdMode === "evolution") {
					const needle = (cmdArg || "").toLowerCase().trim();
					if (!needle) return true;

					const info = monInfoForGame ? monInfoForGame[it.id] : null;

					const methods = [];

					// Species-level evolution info
					if (info?.evolution) {
						const evo = info.evolution;
						if (evo.method) {
							methods.push(String(evo.method).toLowerCase());
						}
						if (Array.isArray(evo.tags)) {
							evo.tags.forEach((t) => methods.push(String(t).toLowerCase()));
						}
					}

					// Form-level evolution info (if present)
					if (Array.isArray(info?.forms)) {
						info.forms.forEach((f) => {
							if (!f || !f.evolution) return;
							const fe = f.evolution;
							if (fe.method) {
								methods.push(String(fe.method).toLowerCase());
							}
							if (Array.isArray(fe.tags)) {
								fe.tags.forEach((t) => methods.push(String(t).toLowerCase()));
							}
						});
					}

					if (!methods.length) return false;

					// crude mapping: /evolution stone, /evolution trade, etc.
					const n = needle.replace(/[^a-z0-9]/g, "");
					return methods.some((m) => m.replace(/[^a-z0-9]/g, "").includes(n));
				}
				if (cmdMode === "location") {
					const needle = (cmdArg || "").toLowerCase();
					if (!needle) return true;

					const info = monInfoForGame ? monInfoForGame[it.id] : null;

					// Base locations
					const baseLocs = Array.isArray(info?.locations)
						? info.locations
						: [];

					// Optional: per-form locations in monInfo (if you add them later)
					let allLocs = baseLocs.slice();
					if (Array.isArray(info?.forms)) {
						info.forms.forEach((f) => {
							if (!f) return;
							if (Array.isArray(f.locations)) {
								allLocs.push(...f.locations);
							} else if (typeof f.location === "string") {
								allLocs.push(f.location);
							}
						});
					}

					if (!allLocs.length) return false;

					return allLocs.some((loc) => {
						if (typeof loc === "string") {
							return loc.toLowerCase().includes(needle);
						}
						const area = (loc.area || "").toLowerCase();
						const notes = (loc.notes || "").toLowerCase();
						return area.includes(needle) || notes.includes(needle);
					});
				}
				if (cmdMode === "stage") {
					// Evolution stage pulled from monInfo.evolution.stage
					if (!cmdStage) return true;

					const info = monInfoForGame ? monInfoForGame[it.id] : null;
					const stages = [];

					// Species stage
					if (info?.evolution && typeof info.evolution.stage === "number") {
						stages.push(info.evolution.stage);
					}

					// Form stages
					if (Array.isArray(info?.forms)) {
						info.forms.forEach((f) => {
							if (!f || !f.evolution) return;
							const st = f.evolution.stage;
							if (typeof st === "number") stages.push(st);
						});
					}

					if (!stages.length) return false;
					return stages.includes(cmdStage);
				}
				return true;
			});
		} else if (isCommandTyping) {
			// Typing an incomplete /command → don't narrow results yet
			filtered = dex;
		} else {
			// Normal text search
			filtered = dex.filter((it) =>
				`${it.id} ${it.name}`.toLowerCase().includes(q)
			);
		}

		dexGrid.innerHTML = "";
		filtered.forEach((it) => {
			let current = statusMap[it.id] || "unknown";

			const hasForms = Array.isArray(it.forms) && it.forms.length > 0;
			const hasResearch = Array.isArray(it.research) && it.research.length > 0;

			if (hasForms) {
				// When a mon has forms, the card status comes from its forms only
				const { node } = _getDexFormsNode(store, gameKey, it.id);
				const formVals = (it.forms || []).map((f) => {
					const name = typeof f === "string" ? f : f?.name;
					return node.forms?.[name] || "unknown";
				});
				current = pickHighestStatus(formVals);
			}

			current = clampStatusForMon(it, current);

			let src = getImageForStatus(it, current);
			const cls = getFilterClassForStatus(current);
			const card = document.createElement("article");
			card.className = "card";
			card.setAttribute("role", "listitem");
			card.style.setProperty("--accent", game?.color || "#6aa6ff");
			const keyForCount = `${gameKey}:${it.id}`;
			const formsCountHTML = hasForms
				? `<span class="pill count" data-dex-forms-count="${keyForCount}"></span>`
				: "";
			const researchCountHTML = hasResearch
				? `<span class="pill count" data-dex-research-count="${keyForCount}"></span>`
				: "";
			card.innerHTML = `
				<div class="thumb ${cls}">
				<button
					type="button"
					class="dex-info-btn"
					title="Show detailed info for ${it.name}"
					aria-label="Show detailed info for ${it.name}"
					>i
				</button>
					<div class="name" title="${it.id}">#${String(window._dexIdNumber(it.id, it.localId) ?? "").padStart(3, "0")}
					${renderBadges(current, gameKey)}
				</div>
				${src
					? (String(src).toLowerCase().endsWith(".webm")
						? `<video
						class="sprite dex-webm"
						src="${src}"
						autoplay
						loop
						muted
						playsinline
						preload="metadata"
						disablepictureinpicture
						style="width:132px;height:132px;object-fit:contain;"
					></video>`
						: `<img
						class="sprite"
						alt="${it.name}"
						src="${src}"
						loading="lazy"
						style="width:132px;height:132px;object-fit:contain;"
					/>`)
					: `<div style="opacity:.5;">No image</div>`
				}
				</div>
				<div class="card-bd">
         			<div class="name" title="${it.name}" data-id="${it.id}">${it.name}</div>
				<div class="row">
					${hasForms
					? `<button class="forms-launch" title="Choose forms">
                        <span class="dot"></span><span>Forms</span>${formsCountHTML}
                      </button>`
					: `<select class="flag-select" aria-label="Status for ${it.name
					}">
                        ${options
						.map((opt) => {
							const val = normalizeFlag(opt);
							if (!isOptionAllowedForMon(it, val)) return "";
							const label = val
								.replace(/_/g, " ")
								.replace(/\b\w/g, (s) => s.toUpperCase());
							const currentVal = clampStatusForMon(it, statusMap[it.id] || "unknown");
							return `<option value="${val}" ${val === currentVal ? "selected" : ""
								}>${label}</option>`;
						})
						.join("")}
                      </select>`
				}
            	${hasResearch
					? `<button class="research-launch" title="Research tasks"
                          data-game="${gameKey}"
                          data-id="${it.id}">
                <span class="dot"></span><span>Research</span>${researchCountHTML}
              </button>`
					: ""
				}
          </div>
        </div>`;

			if (hasResearch) {
				const rEl = card.querySelector(`[data-dex-research-count="${keyForCount}"]`);
				if (rEl) {
					// Always compute totals from tiers so it starts as 0/31 (not 0/7)
					const stats = window?.PPGC?.getMonResearchTierStats
						? window.PPGC.getMonResearchTierStats(gameKey, it.id, it, store)
						: null;

					if (stats && typeof stats.totalTiers === "number") {
						rEl.textContent = `${Number(stats.doneTiers || 0)}/${stats.totalTiers}`;
						rEl.title = `Tiers completed: ${Number(stats.doneTiers || 0)}/${stats.totalTiers} • Level: ${Math.min(10, Number(stats.researchLevel || 0))}/10`;
					} else {
						// super safe fallback: at least don't show task-count totals
						rEl.textContent = `0/0`;
					}
				}
			}

			const infoBtn = card.querySelector(".dex-info-btn");
			if (infoBtn) {
				infoBtn.addEventListener("click", async (e) => {
					e.stopPropagation();
					await openMonInfo(gameKey, genKey, it);
				});
			}
			if (hasForms) {
				card.querySelector(".forms-launch")?.addEventListener("click", (e) => {
					e.stopPropagation();
					openDexForms(gameKey, genKey, it);
				});
				const countEl = card.querySelector(
					`[data-dex-forms-count="${keyForCount}"]`
				);
				if (countEl) {
					const total = (it.forms || []).length;
					const { node } = _getDexFormsNode(store, gameKey, it.id);
					const filled = (it.forms || []).reduce((acc, f) => {
						const name = typeof f === "string" ? f : f?.name;
						return (
							acc + ((node.forms?.[name] || "unknown") !== "unknown" ? 1 : 0)
						);
					}, 0);
					countEl.textContent = `${filled}/${total}`;
				}
			}
			if (hasResearch) {
				card.querySelector(".research-launch")?.addEventListener("click", (e) => {
					e.stopPropagation();
					openResearchModal(gameKey, genKey, it, store);
				});

				const researchCountEl = card.querySelector(
					`[data-dex-research-count="${keyForCount}"]`
				);
				if (researchCountEl) {
					const tasks = Array.isArray(it.research) ? it.research : [];

					const recAll =
						store.dexResearchStatus instanceof Map
							? store.dexResearchStatus.get(gameKey) || {}
							: {};
					const rec = recAll[it.id] || {};

					let totalTiers = 0;
					let doneTiers = 0;

					tasks.forEach((t, idx) => {
						const tiers = Array.isArray(t.tiers) ? t.tiers : [];
						const steps = tiers.length || 0;

						totalTiers += steps;

						const raw = rec[idx];
						const level =
							typeof raw === "number"
								? raw
								: raw
									? steps // legacy true => full
									: 0;

						const clamped = Math.max(0, Math.min(steps, level));
						doneTiers += clamped;
					});

					// Always show tiers, even when 0
					researchCountEl.textContent = `${doneTiers}/${totalTiers}`;
					researchCountEl.title = `Tiers completed: ${doneTiers}/${totalTiers}`;
				}
			}
			const select = card.querySelector("select.flag-select");
			if (select) {
				select.addEventListener("change", () => {
					let newVal = normalizeFlag(select.value);
					newVal = clampStatusForMon(it, newVal);
					select.value = newVal;

					const curr = store.dexStatus.get(gameKey) || {};
					curr[it.id] = newVal;
					store.dexStatus.set(gameKey, curr);
					save();
					_queueDexSync(gameKey, it.id, newVal);

					// NEW: immediate Dex ↔ Dex + Dex → Task sync for this mon
					const changed = { [it.id]: newVal };

					// Dex ↔ Dex links (regional / national / multi-dex)
					try {
						applyDexLinksFromDexEntries(gameKey, changed);
					} catch (e) {
						console.error("applyDexLinksFromDexEntries (single) error:", e);
					}

					// Dex → Task sync
					try {
						window.PPGC.applyDexSyncsFromDexEntries?.(gameKey, changed);
					} catch (e) {
						console.error("applyDexSyncsFromDexEntries (single) error:", e);
					}

					const thumb = card.querySelector(".thumb");
					const newSrc = getImageForStatus(it, newVal);
					const newCls = getFilterClassForStatus(newVal);

					thumb.classList.remove("status-unknown", "status-seen", "status-normal");
					thumb.classList.add(newCls);

					// Swap <img> ↔ <video> if needed WITHOUT changing layout order
					const oldSprite = thumb.querySelector(".sprite");

					const newIsWebm = typeof newSrc === "string" && newSrc.toLowerCase().endsWith(".webm");
					let newSprite;

					if (newIsWebm) {
						newSprite = document.createElement("video");
						newSprite.src = newSrc;
						newSprite.autoplay = true;
						newSprite.loop = true;
						newSprite.muted = true;
						newSprite.playsInline = true;
						newSprite.preload = "metadata";
						newSprite.setAttribute("disablepictureinpicture", "");
					} else {
						newSprite = document.createElement("img");
						newSprite.src = newSrc;
						newSprite.alt = it.name;
						newSprite.loading = "lazy";
					}

					// keep consistent class + sizing behavior
					newSprite.className = "sprite" + (newIsWebm ? " dex-webm" : "");
					newSprite.style.width = "132px";
					newSprite.style.height = "132px";
					newSprite.style.objectFit = "contain";

					// Replace in-place (preserves the # dex number position)
					if (oldSprite) oldSprite.replaceWith(newSprite);
					else thumb.appendChild(newSprite);

					// Update badges without changing layout order
					const oldBadges = thumb.querySelector(".badges");
					oldBadges?.remove();
					const newBadgesHTML = renderBadges(newVal, gameKey);
					if (newBadgesHTML) thumb.insertAdjacentHTML("beforeend", newBadgesHTML);
				});
			}
			dexGrid.appendChild(card);
		});
	}

	function renderDexGridIfOpen() {
		const forKey = store?.state?.dexModalFor;
		if (!forKey) return;

		// Only rerender if the modal is actually in the DOM
		const modalEl =
			document.querySelector(".dex-modal") ||
			document.querySelector("#dex-modal") ||
			document.querySelector("[data-modal='dex']");

		if (!modalEl) return;

		renderDexGrid();
	}
	window.PPGC.renderDexGridIfOpen = renderDexGridIfOpen;

	function openDexModal(gameKey, genKey) {
		window.PPGC.disableTaskTooltips();
		// Resolve base "x" / "sun" into first real dex (x-central, sun-melemele, etc.)
		const resolvedKey = resolveInitialDexKey(gameKey);
		store.state.dexModalFor = resolvedKey;
		refreshScopeControls(resolvedKey);

		const baseKey = baseOf(resolvedKey);
		const gameBase = (window.DATA.games?.[genKey] || []).find(
			(g) => g.key === baseKey
		);

		const tasksStore = window.PPGC?._tasksStoreRef;
		if (tasksStore) {
			// Sections are still keyed by the base game (e.g. "x", "sun"), not x-central.
			const sections = window.DATA?.sections?.[baseKey] || [];
			for (const s of sections) {
				if (!s?.id) continue;
				bootstrapTasks(s.id, tasksStore);
			}
		}

		const curr = store.dexStatus.get(resolvedKey) || {};
		modal.__dexSnapshot = { ...curr };

		// Build title: "X (Central Dex)", "X (National Dex)", etc.
		const baseLabel = gameBase ? gameBase.label : baseKey;
		const scopeLabel = labelForDexKey(baseKey, resolvedKey);

		modalTitle.innerHTML = `
			<span class="dex-modal-title-main">Dex Editor - ${baseLabel}</span>
			<span class="dex-modal-title-scope">${scopeLabel}</span>
		`;
		const scrollEl = getDexScrollContainer();
		if (scrollEl) scrollEl.scrollTop = 0;
		dexGrid.scrollTop = 0;
		dexSearch.value = "";
		if (dexHelpDropdown) {
			dexHelpDropdown.style.display = "none";
		}
		// Ensure mon-info is loaded so Dex thumbs can be sourced from it (and animated if enabled).
		try {
			const _baseKey = baseOf(resolvedKey || "");
			ensureMonInfoLoaded?.(_baseKey, store.state.monInfoForm)?.then?.(() => {
				try {
					if (modal && modal.classList.contains("open") && store.state.dexModalFor === resolvedKey) {
						renderDexGrid();
					}
				} catch { }
			});
		} catch { }

		renderDexGrid();
		modal.__returnFocusEl = document.activeElement;
		modal.classList.add("open");
		modal.setAttribute("aria-hidden", "false");
	}
	function closeModal() {
		if (_closing) return;
		_closing = true;

		// Hide the modal first (keep DOM stable while we work)
		const returnEl = modal.__returnFocusEl;
		try {
			// If the close button is focused, blur it first
			if (document.activeElement && modal.contains(document.activeElement)) {
				document.activeElement.blur?.();
			}

			// Restore focus to the opener (or fall back)
			if (returnEl && typeof returnEl.focus === "function") {
				returnEl.focus({ preventScroll: true });
			} else {
				// fallback focus target (pick something stable in your UI)
				document.querySelector("#app, #content, body")?.focus?.({ preventScroll: true });
			}
		} catch { }

		// Now hide the modal
		modal.classList.remove("open");
		modal.setAttribute("aria-hidden", "true");
		const scrollEl = getDexScrollContainer();
		if (scrollEl) scrollEl.scrollTop = 0;
		dexGrid.scrollTop = 0;
		dexSearch.value = "";

		// Hide /help dropdown if it's showing
		if (dexHelpDropdown) {
			dexHelpDropdown.style.display = "none";
		}

		// Reset the bulk status dropdown back to "Unknown"
		if (bulkStatusSelect && bulkStatusSelect.tagName === "SELECT") {
			// Prefer explicit "unknown" if present, otherwise fall back to last option
			const normalizedOptions = Array.from(bulkStatusSelect.options).map((opt) =>
				normalizeFlag(opt.value || opt.textContent || "")
			);
			const hasUnknown = normalizedOptions.includes("unknown");

			if (hasUnknown) {
				bulkStatusSelect.value = "unknown";
			} else if (bulkStatusSelect.options.length > 0) {
				bulkStatusSelect.selectedIndex = bulkStatusSelect.options.length - 1;
			}
		}

		// Kill any tooltips so nothing “sticks” at top-left
		try {
			window.PPGC?.hideTooltips?.();
		} catch { }

		// Mute inner renders while we sync
		window.PPGC = window.PPGC || {};
		window.PPGC._suppressRenders = true;

		// --- NEW: figure out which game we’re editing and what actually changed
		const gameKey = store.state.dexModalFor; // still set right now
		const before = modal.__dexSnapshot || {}; // snapshot taken on open
		const after = store.dexStatus.get(gameKey) || {}; // current status map
		const changed = {};
		const keys = new Set([
			...Object.keys(before),
			...Object.keys(after),
		]);
		for (const k of keys) {
			const b = before[k] || "unknown";
			const a = after[k] || "unknown";
			if (a !== b) changed[k] = a; // only apply diffs
		}

		// Apply Dex -> Task using Dex entries’ taskSync (no rendering here)
		try {
			applyDexLinksFromDexEntries(gameKey, changed);
		} catch (e) {
			console.error("applyDexLinksFromDexEntries error:", e);
		}
		// Then apply Dex -> Task using Dex entries’ taskSync
		try {
			window.PPGC.applyDexSyncsFromDexEntries?.(gameKey, changed);
		} catch (e) {
			console.error("applyDexSyncsFromDexEntries error:", e);
		}

		// Now mark modal closed and persist
		store.state.dexModalFor = null;
		save();

		// Unmute and render exactly once on next frame
		window.PPGC._suppressRenders = false;
		requestAnimationFrame(() => {
			try {
				window.PPGC?.renderAll?.();
			} catch (e) {
				console.error(e);
			}
			_closing = false;
		});

		window.PPGC.enableTaskTooltips();
	}

	const api = { openDexModal: openDexModal, closeModal, renderDexGrid };
	modal.addEventListener("click", (e) => {
		if (e.target === modal) closeModal();
	});
	modalClose.addEventListener("click", closeModal);
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeModal();
	});
	let dexSearchRAF = null;
	dexSearch.addEventListener("input", () => {
		if (dexSearchRAF) cancelAnimationFrame(dexSearchRAF);
		dexSearchRAF = requestAnimationFrame(() => {
			renderDexGrid();
		});
	});
	dexSelectAll.addEventListener("click", () => {
		const gameKey = store.state.dexModalFor;
		if (!gameKey) return;

		// Take the bulk status from the dropdown (default to "caught")
		let chosen = "caught";
		if (bulkStatusSelect && bulkStatusSelect.tagName === "SELECT") {
			const raw = bulkStatusSelect.value;
			if (raw) chosen = normalizeFlag(raw);
		}

		const dex = _getDexList(gameKey);
		const curr = store.dexStatus.get(gameKey) || {};

		// Track which species we’re changing so we can run Dex↔Dex + Dex→Task
		const changed = {};

		// Run all the heavy work in batch mode (no repeated save/render)
		runInDexBatch(() => {
			for (const m of dex) {
				if (m.mythical) continue; // keep your existing rule: skip mythicals

				const applied = clampStatusForMon(m, chosen);
				curr[m.id] = applied;
				_queueDexSync(gameKey, m.id, applied);
				changed[m.id] = applied;

				// Forms: apply the same chosen status to every form
				if (Array.isArray(m.forms) && m.forms.length) {
					const node = _setAllFormsForMon(
						store,
						gameKey,
						m.id,
						m.forms,
						applied
					);

					for (const [fname, val] of Object.entries(node.forms || {})) {
						if (!fname) continue;

						// Dex ↔ Dex form sync (regional <-> national)
						try {
							applyDexLinksFromForm(gameKey, m.id, fname, val);
						} catch (e) {
							console.error("applyDexLinksFromForm (bulk) error:", e);
						}

						// Dex -> Task form sync (existing behavior)
						try {
							window.PPGC?.applyTaskSyncsFromForm?.(
								gameKey,
								m.id,
								fname,
								val
							);
						} catch {
							// ignore
						}
					}
				}
			}

			// Persist the current dex we just edited (in-memory only, save() happens after batch)
			store.dexStatus.set(gameKey, curr);

			// Immediately mirror these changes to linked dexes + tasks (still in batch mode)
			if (Object.keys(changed).length) {
				try {
					applyDexLinksFromDexEntries(gameKey, changed);
				} catch (e) {
					console.error("applyDexLinksFromDexEntries (bulk) error:", e);
				}

				try {
					window.PPGC?.applyDexSyncsFromDexEntries?.(gameKey, changed);
				} catch (e) {
					console.error("applyDexSyncsFromDexEntries (bulk) error:", e);
				}
			}
		});

		// 🔹 NEW: tell the modal “this is now the baseline”
		if (modal) {
			modal.__dexSnapshot = { ...curr };
		}

		// NOW do a single save + re-render once
		save();
		renderDexGrid();
	});

	return api;
}