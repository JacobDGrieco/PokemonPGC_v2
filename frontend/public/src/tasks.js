import { save, uid } from "./store.js";
import { getSeedTaskRegistry } from "./taskRegistry.js";
import { ensureSyncSetsExpandedForGame } from "./sync.js";
import { summarizeTasks } from "./progress.js";

/* ===================== Color / sprite helpers ===================== */
let _tooltipsDisabled = false;

/**
 * Extract the gameKey from a sectionId, assuming "gameKey-..." format.
 */
function gameKeyFromSection(sectionId) {
	const s = String(sectionId || "");
	if (s.includes(":")) return s.split(":")[0] || "";
	return s.split("-")[0] || "";
}

/**
 * Read the global accent color from CSS (fallback to a sane default).
 */
function getAccentColor() {
	const rs = getComputedStyle(document.documentElement);
	const cssVar = rs.getPropertyValue("--accent")?.trim();
	return cssVar && cssVar !== "initial" ? cssVar : "#6aa0ff";
}

/**
 * Resolve the accent color for a given section:
 * - Prefer game.color / game.accent / game.theme.accent
 * - Fall back to DATA.colors / DATA.themes
 * - Finally fall back to the global CSS accent
 */
function resolveAccentForSection(sectionId) {
	const fallback = getAccentColor();
	const gameKey = gameKeyFromSection(sectionId);
	const gens = window.DATA?.games || {};
	let game = null;

	for (const arr of Object.values(gens)) {
		const found = (arr || []).find((g) => g.key === gameKey);
		if (found) {
			game = found;
			break;
		}
	}

	const cand =
		game?.color ||
		game?.accent ||
		game?.theme?.accent ||
		window.DATA?.colors?.[gameKey] ||
		window.DATA?.themes?.[gameKey]?.accent;

	return typeof cand === "string" && cand.trim() ? cand : fallback;
}

/**
 * For Gen 1 games, allow toggling between b/w and color task sprites.
 * For other games, always use the base img.
 */
const GEN1_COLOR_GAMES = new Set(["red", "blue", "yellow"]);
function resolveTaskImageSrcs(task, sectionId) {
	if (!task) return [];

	const evalMaybe = (v) => (typeof v === "function" ? v() : v);

	const normalize = (v) => {
		if (v == null) return [];

		// First, evaluate the value (or function)
		const raw = evalMaybe(v);

		// If the evaluated result is an array, treat it as the list of srcs
		if (Array.isArray(raw)) {
			// Also eval any functions inside the array (and flatten if any return arrays)
			return raw
				.flatMap((x) => {
					const y = evalMaybe(x);
					return Array.isArray(y) ? y : [y];
				})
				.filter(Boolean);
		}

		// Otherwise it's a single src
		return [raw].filter(Boolean);
	};

	const baseArr = normalize(task.img);   // black/white / default
	const colorArr = normalize(task.imgS); // color sprite(s), if present

	if (!sectionId) return baseArr;

	const gameKey = gameKeyFromSection(sectionId);
	if (!GEN1_COLOR_GAMES.has(gameKey)) return baseArr;

	const useColor = window.PPGC?.gen1SpriteColor === true;
	if (useColor && colorArr.length) return colorArr;
	return baseArr;
}

/* ===================== Tooltip helpers ===================== */

const TOOLTIP_DELAY_MS = 800;
const TOOLTIP_AUTOHIDE_MS = 1800;
let _tooltipEl = null;
let _tooltipHideTimer = null;

/**
 * Lazily create & cache the shared tooltip element in the DOM.
 */
function ensureTooltipEl() {
	if (_tooltipEl) return _tooltipEl;
	const el = document.createElement("div");
	el.className = "tooltip";
	document.body.appendChild(el);
	_tooltipEl = el;
	return el;
}

function hideTooltip() {
	const el = ensureTooltipEl();
	el.classList.remove("show");

	clearTimeout(_tooltipHideTimer);
	_tooltipHideTimer = null;
}

/**
 * Position and show tooltip near a target element.
 */
function showTooltipForTarget(targetEl, html) {
	if (_tooltipsDisabled) return;
	if (!targetEl || !targetEl.isConnected) return;

	const el = ensureTooltipEl();
	el.innerHTML = html;
	el.style.left = "-9999px";
	el.style.top = "-9999px";
	el.removeAttribute("data-placement");

	requestAnimationFrame(() => {
		if (_tooltipsDisabled) return;
		if (!targetEl || !targetEl.isConnected) return;

		const r = targetEl.getBoundingClientRect();
		if (!r || r.width === 0 || r.height === 0) return;

		const tw = el.offsetWidth;
		const th = el.offsetHeight;
		const margin = 8;

		let top = r.top - th - margin;
		let left = r.left + r.width / 2 - tw / 2;
		let placement = "top";

		left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));

		if (top < 8) {
			top = r.bottom + margin;
			placement = "bottom";
		}

		el.dataset.placement = placement;
		el.style.left = `${Math.round(left)}px`;
		el.style.top = `${Math.round(top)}px`;
		el.classList.add("show");
	});
}

/**
 * Attach delayed hover/long-press tooltip behavior to an element.
 * getHtml() is evaluated only when the tooltip is about to open.
 */
function attachTooltip(el, getHtml) {
	let timer = null;
	let alive = true;

	const start = () => {
		alive = true;
		clearTimeout(timer);
		timer = setTimeout(() => {
			if (!alive) return;
			const html = getHtml?.();
			if (html) showTooltipForTarget(el, html);
		}, TOOLTIP_DELAY_MS);
	};

	const stop = () => {
		alive = false;
		clearTimeout(timer);
		hideTooltip();
	};

	el.addEventListener("mouseenter", start);
	el.addEventListener("mouseleave", stop);
	el.addEventListener("blur", stop, true);

	// touch support: long-press-ish
	el.addEventListener("touchstart", start, { passive: true });
	el.addEventListener("touchend", stop);
}

/* ===================== Global task index & syncs ===================== */
export function unloadSectionTasks(sectionId) {
	const tasksStore = window.PPGC?._tasksStoreRef;
	if (!tasksStore || !tasksStore.has(sectionId)) return;

	const arr = tasksStore.get(sectionId) || [];

	// Remove task ids for this section from the global task index
	window.PPGC = window.PPGC || {};
	const globalIdx = window.PPGC._taskIndexGlobal;
	if (globalIdx) {
		(function walk(list) {
			for (const t of list || []) {
				if (t?.id) globalIdx.delete(String(t.id));
				if (Array.isArray(t.children)) walk(t.children);
			}
		})(arr);
	}

	// Remove dex sync index entries pointing at this section
	const dexIdx = window.PPGC._dexSyncIndex;
	if (dexIdx) {
		for (const [key, bucket] of dexIdx.entries()) {
			const next = (bucket || []).filter((x) => x?.sectionId !== sectionId);
			if (!next.length) dexIdx.delete(key);
			else dexIdx.set(key, next);
		}
	}

	// Finally drop the heavy tree
	tasksStore.delete(sectionId);
}

/**
 * One global Map<taskId, { sectionId, task }> shared across sections.
 * (Used by sync logic and Dex → Task taskSync.)
 */
function _globalTaskIndex() {
	window.PPGC = window.PPGC || {};
	if (!window.PPGC._taskIndexGlobal) window.PPGC._taskIndexGlobal = new Map();
	return window.PPGC._taskIndexGlobal;
}

/**
 * Index all tasks in a section into the global task index.
 */
function _indexSectionTasks(sectionId, tasksArr) {
	const idx = _globalTaskIndex();
	(function walk(arr) {
		for (const t of arr || []) {
			if (t?.id) idx.set(t.id, { sectionId, task: t });
			if (Array.isArray(t.children) && t.children.length) walk(t.children);
		}
	})(tasksArr || []);
}

function _resolveDexEntryAndKey(dexList, linkId) {
	// Returns { entry, key } where key is ALWAYS String(entry.id)
	// Supports:
	//  - new string ids (entry.id is string)
	//  - legacy numeric ids (entry.id or entry.localId numeric)
	//  - linkId provided as string or number
	const wanted = String(linkId);

	// 1) Direct id match (new format or old string)
	let entry = (dexList || []).find((e) => e && String(e.id) === wanted);

	// 2) Numeric fallback: match localId (preferred) or id
	if (!entry) {
		const n = Number(linkId);
		if (Number.isFinite(n)) {
			entry = (dexList || []).find((e) => e && Number(e.localId ?? e.id) === n);
		}
	}

	if (!entry) return null;
	return { entry, key: String(entry.id) };
}

/**
 * Given a task that changed, apply:
 *   - task → task syncs (taskSync array)
 *   - task → dex syncs (dexSync array)
 * Then optionally re-render if the Dex modal is not open.
 */
function applySyncsFromTask(sourceTask, value) {
	_ensureIndexes();

	try {
		// Prefer the current route sectionId (when we're in a section view)
		let sid = window.PPGC?._storeRef?.state?.sectionId || null;

		// If we somehow don't have it, fall back to the global task index entry
		if (!sid && sourceTask?.id) {
			const hit = _globalTaskIndex().get(String(sourceTask.id));
			sid = hit?.sectionId || null;
		}

		const gk = sid ? gameKeyFromSection(sid) : null;
		if (gk) ensureSyncSetsExpandedForGame(gk);
	} catch { /* ignore */ }

	const store = window.PPGC?._storeRef;

	// 1) Collect taskSync/dexSync/fashionSync from sourceTask and all descendants
	//    - taskSync entries can be:
	//        * "some-task-id"
	//        * { id:"some-task-id", oneWay:true }   (set-only: unchecking source won't unset target)
	const taskTargets = new Map(); // id(string) -> oneWay(boolean)
	const dexLinks = [];
	const fashionLinks = [];

	const addTaskTarget = (v) => {
		if (v == null) return;
		if (typeof v === "object") {
			const id = v.id ?? v.taskId ?? v.value;
			if (id == null) return;
			const key = String(id);
			const prev = !!taskTargets.get(key);
			taskTargets.set(key, prev || v.oneWay === true || v.sink === true || v.sinkOnly === true);
		} else {
			const key = String(v);
			if (!taskTargets.has(key)) taskTargets.set(key, false);
		}
	};

	(function collect(t) {
		if (!t || typeof t !== "object") return;

		if (Array.isArray(t.taskSync)) t.taskSync.forEach(addTaskTarget);
		if (Array.isArray(t.dexSync)) dexLinks.push(...t.dexSync);
		if (Array.isArray(t.fashionSync)) fashionLinks.push(...t.fashionSync);
		if (Array.isArray(t.children)) t.children.forEach(collect);
	})(sourceTask);

	// 2) Apply task->task taskSync
	if (taskTargets.size) {
		for (const [targetId, isOneWay] of taskTargets.entries()) {
			// oneWay targets are set-only: unchecking the source does not unset them.
			if (!value && isOneWay) continue;

			// IMPORTANT: this is the helper that *already* falls back to taskRegistry
			// when the task isn't loaded (no “open the section first” problem).
			window.PPGC?.setTaskCheckedById?.(targetId, !!value);
		}
	}

	// 3) Apply task->dex taskSync
	if (store && dexLinks.length) {
		for (const link of dexLinks) {
			// ✅ oneWay targets are set-only: unchecking source does not unset them
			const isOneWay =
				link?.oneWay === true || link?.sink === true || link?.sinkOnly === true;
			if (!value && isOneWay) continue;

			// Resolve dex gameKey using the same rules as dex.js _resolveDexTargetKey
			const game = link?.game;
			if (!game) continue;

			const t = String(link.dexType || "regional").toLowerCase();
			let targetGameKey;

			if (t === "national") targetGameKey = `${game}-national`;
			else if (t === "regional") targetGameKey = game;
			else if (t === "central" || t === "coastal" || t === "mountain") targetGameKey = `${game}-${t}`;
			else if (t === "melemele" || t === "akala" || t === "ulaula" || t === "poni") targetGameKey = `${game}-${t}`;
			else {
				const candidate = `${game}-${t}`;
				targetGameKey = (window.DATA?.dex && window.DATA.dex[candidate]) ? candidate : game;
			}

			const dexList = window.DATA?.dex?.[targetGameKey] || [];
			if (!targetGameKey || !dexList.length) continue;

			const hit = _resolveDexEntryAndKey(dexList, link?.id);
			if (!hit) continue;

			const { entry, key: entryKey } = hit;

			// If NO form specified -> species-level write
			if (typeof link.form === "undefined" || link.form === null) {
				const curr = store.dexStatus.get(targetGameKey) || {};
				const prev = typeof curr[entryKey] !== "undefined" ? curr[entryKey] : "unknown";
				const next = value ? _promoteToCaughtSafe(prev) : "unknown";

				curr[entryKey] = next;
				store.dexStatus.set(targetGameKey, curr);

				save();
				continue;
			}

			const resolveFormName = (formRef) => {
				if (typeof formRef === "string") return formRef;

				const forms = Array.isArray(entry?.forms) ? entry.forms : [];
				if (!forms.length || typeof formRef !== "number") return null;

				// support 1-based indexes
				const idx = formRef >= 1 ? formRef - 1 : formRef;
				const f = forms[idx];
				if (!f) return null;

				return typeof f === "string" ? f : f?.name;
			};

			const formName = resolveFormName(link.form);
			if (!formName) continue;

			const formsMap = store.dexFormsStatus.get(targetGameKey) || {};
			const node = formsMap[entryKey] || { all: false, forms: {} };
			node.forms = node.forms || {};

			const prevForm = node.forms?.[formName] || "unknown";
			const nextForm = value ? _promoteToCaughtSafe(prevForm) : "unknown";

			node.forms[formName] = nextForm;

			// keep node.all logic if you already had it below; otherwise leave as-is
			formsMap[entryKey] = node;
			store.dexFormsStatus.set(targetGameKey, formsMap);

			save();
		}
	}

	// 4) Apply task->fashion fashionSync
	if (store && fashionLinks.length) {
		for (const link of fashionLinks) {
			// oneWay targets are set-only: unchecking source does not unset them
			if (!value && (link?.oneWay === true || link?.sink === true || link?.sinkOnly === true)) continue;
			const gameKey = link?.game;
			const itemIdRaw = link?.id;

			if (!gameKey || !itemIdRaw) continue;
			const itemIdStr = String(itemIdRaw);

			const cats = window.DATA?.fashion?.[gameKey]?.categories || [];
			if (!cats.length) continue;

			const explicitCategoryId =
				link?.dexType || link?.category || link?.categoryId || null;

			// Collect all (category, item) pairs we should touch
			const targets = [];

			if (explicitCategoryId) {
				// Existing behavior: restrict to a specific category
				const cat = cats.find((c) => c.id === explicitCategoryId);
				if (!cat) continue;
				for (const it of cat.items || []) {
					if (String(it.id) === itemIdStr) {
						targets.push({ catId: cat.id, item: it });
					}
				}
			} else {
				// NEW: no category provided → search all categories by id
				for (const cat of cats) {
					for (const it of cat.items || []) {
						if (String(it.id) === itemIdStr) {
							targets.push({ catId: cat.id, item: it });
						}
					}
				}
			}

			if (!targets.length) continue;

			for (const { catId, item } of targets) {
				const hasForms = Array.isArray(item.forms) && item.forms.length > 0;

				if (hasForms) {
					let gameMap = store.fashionFormsStatus.get(gameKey);
					if (!gameMap) {
						gameMap = new Map();
						store.fashionFormsStatus.set(gameKey, gameMap);
					}
					const rec = gameMap.get(catId) || {};
					const node = rec[item.id] || { all: false, forms: {} };

					const forms = item.forms || [];
					const formRef = link.form;

					const resolveFormName = (ref) => {
						if (typeof ref === "string") return ref;
						if (typeof ref === "number") {
							const idx = ref >= 1 ? ref - 1 : ref;
							const f = forms[idx];
							if (!f) return null;
							return typeof f === "string" ? f : f?.name;
						}
						return null;
					};

					if (typeof formRef !== "undefined" && formRef !== null) {
						const formName = resolveFormName(formRef);
						if (!formName) continue;
						node.forms = node.forms || {};
						node.forms[formName] = !!value;
					} else {
						node.forms = node.forms || {};
						for (const f of forms) {
							const name = typeof f === "string" ? f : f?.name;
							if (!name) continue;
							node.forms[name] = !!value;
						}
					}

					const allOn =
						forms.length > 0 &&
						forms.every((f) => {
							const name = typeof f === "string" ? f : f?.name;
							return name && node.forms?.[name];
						});
					node.all = allOn;

					rec[item.id] = node;
					gameMap.set(catId, rec);
				} else {
					let gameMap = store.fashionStatus.get(gameKey);
					if (!gameMap) {
						gameMap = new Map();
						store.fashionStatus.set(gameKey, gameMap);
					}
					const rec = gameMap.get(catId) || {};
					rec[item.id] = !!value;
					gameMap.set(catId, rec);
				}
			}
		}

		save();
	}

	// Re-render if the Dex modal isn't open (same as before)
	const isModalOpen = !!window.PPGC?._storeRef?.state?.dexModalFor;
	if (!isModalOpen) {
		try {
			window.PPGC?.renderAll?.();
		} catch {
			// ignore re-render errors
		}
	}
}

/**
 * Ensure both the global task index and dexSync index are populated.
 * Called lazily before sync operations.
 */
function _ensureIndexes() {
	const tasksStore = window.PPGC?._tasksStoreRef;
	if (!tasksStore) return;
	const ti = _globalTaskIndex();
	const di = _dexSyncIndex();
	if (ti.size && di.size) return;

	// Rebuild if empty
	if (typeof tasksStore.forEach === "function") {
		tasksStore.forEach((arr, sectionId) => {
			_indexSectionTasks(sectionId, arr);
			_indexDexSyncs(sectionId, arr);
		});
	}
}

/**
 * Toggle a task (and descendants) by ID, recomputing ancestors & saving.
 */
function _setTaskCheckedById(taskId, checked) {
	const id = String(taskId);
	const storeRef = window.PPGC?._storeRef;
	if (!storeRef) return false;

	// 1) If it's loaded, do what you do today
	const hit = _globalTaskIndex().get(id); // this only has entries for bootstrapped sections :contentReference[oaicite:6]{index=6}
	if (hit?.task) {
		const { sectionId, task } = hit;
		const hasKids = Array.isArray(task.children) && task.children.length > 0;

		if (hasKids) setDescendantsDone(task, !!checked);
		else task.done = !!checked;

		// (your ancestor recompute can stay, since we have the section loaded)
		const arr = window.PPGC._tasksStoreRef.get(sectionId) || [];
		const index = buildTaskIndex(arr);
		let cur = task;
		while (true) {
			const ent = index.get(cur.id) || { parent: null };
			const parent = ent.parent;
			if (!parent) break;
			const kids = Array.isArray(parent.children) ? parent.children : [];
			parent.done = kids.length ? kids.every((k) => !!k.done) : !!parent.done;
			cur = parent;
		}

		window.PPGC._tasksStoreRef.set(sectionId, arr);
		save();

		_indexSectionTasks(sectionId, arr);
		_indexDexSyncs(sectionId, arr);
		return true;
	}

	// 2) Not loaded → store overlay progress by id
	// Confirm it's a real task id (optional but helps avoid trash keys)
	const reg = getSeedTaskRegistry();
	if (!reg.has(id)) return false;

	storeRef.taskProgressById.set(id, !!checked);
	save(); // your save() should persist this (see note below)
	return true;
}

/* ===================== Global Dex sync index ===================== */

/**
 * Map<"game:id", Array<{ sectionId, task }>>.
 * Used to locate tasks that depend on a Dex entry.
 */
function _dexSyncIndex() {
	window.PPGC = window.PPGC || {};
	if (!window.PPGC._dexSyncIndex) window.PPGC._dexSyncIndex = new Map();
	return window.PPGC._dexSyncIndex;
}

/**
 * Index dexSync links in a section's tasks into the Dex sync index.
 */
function _indexDexSyncs(sectionId, tasksArr) {
	const idx = _dexSyncIndex();
	(function walk(arr) {
		for (const t of arr || []) {
			const ds = Array.isArray(t.dexSync) ? t.dexSync : [];
			for (const link of ds) {
				if (!link || !link.game || link.id == null) continue;

				// ✅ dex ids are strings now (but this also tolerates old numeric links)
				const key = `${link.game}:${String(link.id)}`;

				if (!idx.has(key)) idx.set(key, []);
				idx.get(key).push({ sectionId, task: t });
			}
			if (Array.isArray(t.children) && t.children.length) walk(t.children);
		}
	})(tasksArr || []);
}

/**
 * Apply Dex → Task taskSync when Dex entries change.
 * changedMap is { [dexId]: status } for a given gameKey.
 */
function applyDexSyncsFromDexEntries(gameKey, changedMap /* id -> status */) {
	const dexList = window.DATA?.dex?.[gameKey] || [];
	if (!dexList.length) return;

	for (const [idStr, status] of Object.entries(changedMap || {})) {
		const dexId = String(idStr);

		let entry = dexList.find((e) => e && String(e.id) === dexId);

		// fallback for old numeric keys (old saves)
		if (!entry) {
			const n = Number(idStr);
			if (Number.isFinite(n)) {
				entry = dexList.find((e) => e && Number(e.localId ?? e.id) === n);
			}
		}

		if (!entry || !Array.isArray(entry.taskSync) || !entry.taskSync.length) continue;

		const isComplete =
			status === "caught" ||
			status === "alpha" ||
			status === "shiny" ||
			status === "shiny_alpha";

		for (const spec of entry.taskSync) {
			const id = spec && typeof spec === "object" ? spec.id : spec;
			if (id == null) continue;

			// oneWay targets are set-only
			if (!isComplete && spec && typeof spec === "object" && spec.oneWay === true) continue;

			_setTaskCheckedById(id, isComplete);
		}
	}
}

/* ===================== Form-level taskSync helpers ===================== */

function _norm(v) {
	return String(v || "unknown")
		.trim()
		.toLowerCase();
}

function _isDexCompleteStatus(status) {
	const s = _norm(status);
	return (
		s === "caught" || s === "alpha" || s === "shiny" || s === "shiny_alpha"
	);
}

/**
 * For a single form, apply taskSync defined on that form when its status changes.
 */
function applyTaskSyncsFromForm(gameKey, entryId, formName, status) {
	try {
		const dexList = window.DATA?.dex?.[gameKey] || [];
		const wanted = String(entryId);
		let entry = dexList.find((e) => e && String(e.id) === wanted);

		if (!entry) {
			const n = Number(entryId);
			if (Number.isFinite(n)) {
				entry = dexList.find((e) => e && Number(e.localId ?? e.id) === n);
			}
		}

		const forms = Array.isArray(entry.forms) ? entry.forms : [];
		const hit = forms.find(
			(f) => (typeof f === "string" ? f : f?.name) === formName
		);
		if (!hit || typeof hit !== "object") return;

		const ids = Array.isArray(hit.taskSync)
			? hit.taskSync.slice()
			: typeof hit.taskSync === "number"
				? [hit.taskSync]
				: [];
		if (!ids.length) return;

		const checked = _isDexCompleteStatus(status);
		for (const taskId of ids) {
			const id = (taskId && typeof taskId === "object") ? taskId.id : taskId;
			if (id == null) continue;
			// oneWay targets are set-only
			if (!checked && taskId && typeof taskId === "object" && taskId.oneWay === true) continue;
			_setTaskCheckedById(id, checked);
		}
	} catch (e) {
		console.error("applyTaskSyncsFromForm error:", e);
	}
}

function applyTaskSyncsFromFashion(gameKey, categoryId, itemId) {
	try {
		const fashionBlock = window.DATA?.fashion?.[gameKey];
		const cats = fashionBlock?.categories || [];
		const cat = cats.find((c) => c.id === categoryId);
		if (!cat) return;

		const item = (cat.items || []).find(
			(it) => String(it.id) === String(itemId)
		);
		if (!item) return;

		// taskSync can be number, string, or array
		const ids = Array.isArray(item.taskSync)
			? item.taskSync.slice()
			: typeof item.taskSync === "number" || typeof item.taskSync === "string"
				? [item.taskSync]
				: [];

		if (!ids.length) return;

		const storeRef = window.PPGC?._storeRef;
		if (!storeRef) return;

		const hasForms = Array.isArray(item.forms) && item.forms.length > 0;

		let checked = false;
		if (!hasForms) {
			const gCat =
				storeRef.fashionStatus instanceof Map
					? storeRef.fashionStatus.get(gameKey)
					: null;
			const rec = gCat?.get(categoryId) || {};
			checked = !!rec[item.id];
		} else {
			const gFormsCat =
				storeRef.fashionFormsStatus instanceof Map
					? storeRef.fashionFormsStatus.get(gameKey)
					: null;
			const rec = gFormsCat?.get(categoryId) || {};
			const node = rec[item.id] || { all: false, forms: {} };
			checked = !!node.all; // treat "all forms on" as complete
		}

		for (const taskId of ids) {
			const id = (taskId && typeof taskId === "object") ? taskId.id : taskId;
			if (id == null) continue;
			if (!checked && taskId && typeof taskId === "object" && taskId.oneWay === true) continue;
			// Use the same helper dex uses so we don't recurse syncs
			window.PPGC?.setTaskCheckedById?.(id, checked);
		}
	} catch (e) {
		console.error("applyTaskSyncsFromFashion error:", e);
	}
}

// expose so dex.js can call it
window.PPGC = window.PPGC || {};
window.PPGC.applyDexSyncsFromDexEntries = applyDexSyncsFromDexEntries;
window.PPGC.applyTaskSyncsFromForm = applyTaskSyncsFromForm;
window.PPGC.setTaskCheckedById = _setTaskCheckedById;
window.PPGC.applyTaskSyncsFromFashion = applyTaskSyncsFromFashion;

/* ===================== Task building / indexing ===================== */

/**
 * Ensure sections exist for a gameKey, seeding from DATA.sections[gameKey]
 * if needed. Returns the array of section objects.
 */
export function ensureSections(gameKey) {
	const seed = (window.DATA.sections && window.DATA.sections[gameKey]) || [];
	if (!window.PPGC._sectionsStore) window.PPGC._sectionsStore = new Map();
	let arr = window.PPGC._sectionsStore.get(gameKey);

	if (!arr || (!arr.length && seed.length)) {
		window.PPGC._sectionsStore.set(
			gameKey,
			seed.map((s) => ({ id: s.id || uid(), title: s.title || "Section" }))
		);
		save();
		arr = window.PPGC._sectionsStore.get(gameKey);
	}

	if (!arr) {
		window.PPGC._sectionsStore.set(gameKey, []);
		arr = window.PPGC._sectionsStore.get(gameKey);
	}
	return arr;
}

/**
 * Build a Map<task.id, { task, parent }> for a tree of tasks.
 */
export function buildTaskIndex(tasks) {
	const map = new Map();
	(function walk(arr, parent = null) {
		for (const t of arr || []) {
			if (!t || typeof t !== "object" || !t.id) continue;
			map.set(t.id, { task: t, parent });
			if (Array.isArray(t.children) && t.children.length) walk(t.children, t);
		}
	})(tasks || []);
	return map;
}

function _clampInt(n, min, max) {
	const x = Number(n);
	if (!Number.isFinite(x)) return min;
	return Math.max(min, Math.min(max, Math.trunc(x)));
}

/**
 * Tier meta supports:
 *  - numeric tiers (existing behavior)
 *  - string tiers (label mode)
 *
 * In label mode:
 *  - slider value is still 0..steps
 *  - value 0 => "none selected"
 *  - value 1..steps => labels[value-1]
 */
function getTierMetaForTask(t) {
	if (!t) return { mode: "number", values: [], steps: 0 };

	// simple per-task cache
	if (t._tierMeta) return t._tierMeta;

	const raw = Array.isArray(t.tiers) ? t.tiers : [];
	const nums = [];
	const labels = [];
	let hasNum = false;
	let hasStr = false;

	const push = (v) => {
		if (v == null) return;

		if (Array.isArray(v)) {
			v.forEach(push);
			return;
		}

		if (typeof v === "number" && Number.isFinite(v)) {
			hasNum = true;
			nums.push(v);
			return;
		}

		if (typeof v === "string" && v.trim()) {
			hasStr = true;
			labels.push(v.trim());
			return;
		}

		// ignore objects/booleans/etc
	};

	raw.forEach(push);

	// Only use label mode if tiers are strings (no numbers present)
	const meta =
		hasStr && !hasNum
			? { mode: "label", values: labels, steps: labels.length }
			: { mode: "number", values: nums, steps: nums.length };

	t._tierMeta = meta;

	// Keep the old cache field around for existing numeric codepaths
	t._normalizedTiers = meta.mode === "number" ? meta.values : [];

	return meta;
}

function getNormalizedTiersForTask(t) {
	const meta = getTierMetaForTask(t);
	return meta.mode === "number" ? meta.values : [];
}

function getTierSteps(t) {
	return getTierMetaForTask(t).steps;
}

function describeTierSequence(nums) {
	const seq = (Array.isArray(nums) ? nums : [])
		.filter((n) => typeof n === "number" && Number.isFinite(n));

	const n = seq.length;
	if (!n) return "";
	if (n === 1) return String(seq[0]);

	// Compute differences between consecutive values
	const diffs = [];
	for (let i = 1; i < n; i++) {
		diffs.push(seq[i] - seq[i - 1]);
	}

	const allIncreasing = diffs.every((d) => d > 0);
	const firstStep = diffs[0];
	const sameStep = diffs.every((d) => d === firstStep);

	const first = seq[0];
	const last = seq[n - 1];

	// Nice clean arithmetic progression (contiguous or offset)
	if (allIncreasing && sameStep) {
		if (firstStep === 1) {
			// 1,2,3,4,... style
			return `(From ${first} to ${last})`;
		}
		// offset, e.g. 1,6,11,16,...
		return `(${first}→${last}, every ${firstStep})`;
	}

	// Mixed / irregular sequence – fall back to list
	if (n <= 12) {
		return seq.join(" · ");
	}

	// Long mixed list: compress
	const head = seq.slice(0, 3).join(" · ");
	const tail = seq.slice(-2).join(" · ");
	return `${head} · … · ${tail}`;
}

function formatTierTooltip(t) {
	const raw = Array.isArray(t?.tiers) ? t.tiers : null;

	const meta = getTierMetaForTask(t);
	if (meta.mode === "label") {
		// keep it compact if there are lots of labels
		const list = meta.values || [];
		if (!list.length) return "";
		if (list.length <= 12) return list.join(" · ");
		return `${list.slice(0, 3).join(" · ")} · … · ${list.slice(-2).join(" · ")}`;
	}

	// If the raw tiers use range()-style arrays, summarize each segment
	if (raw && raw.some((v) => Array.isArray(v))) {
		const parts = [];

		for (const v of raw) {
			if (Array.isArray(v)) {
				// This is likely from range(...): summarize as
				// "from X to Y" or "from X to Y, every N"
				const desc = describeTierSequence(v);
				parts.push(desc || v.join(" · "));
			} else if (typeof v === "number" && Number.isFinite(v)) {
				// Plain numeric tier
				parts.push(String(v));
			}
			// ignore anything else (strings/objects)
		}

		if (parts.length) {
			// e.g. "3, 6, from 10 to 45, every 5"
			return parts.join(" · ");
		}
	}

	// Fallback: no nested arrays → treat as a single sequence
	const nums = getNormalizedTiersForTask(t);
	if (!nums.length) return "";

	const desc = describeTierSequence(nums);
	// describeTierSequence already does:
	//   - "from 1 to 100"
	//   - "from 1 to 100, every 5"
	//   - or falls back to a compact list
	return desc || nums.join(" · ");
}

function _isEitherTask(t) {
	if (!t) return false;

	const src = t.eithers;
	if (!src || typeof src !== "object") return false;

	// new multi-option: at least 2 object-ish entries
	const entries = Object.entries(src).filter(([, v]) => v && typeof v === "object");
	return entries.length >= 2;
}

function _isTieredTask(t) {
	if (!t) return false;

	// New preferred signal: tiers exists
	if (Array.isArray(t.tiers) && t.tiers.length > 0) return true;

	// Back-compat (older data)
	return t.type === "tiered" && Array.isArray(t.tiers);
}

/**
 * Visit all descendants of a task (children, grandchildren, ...).
 */
function forEachDescendant(task, fn) {
	const kids = Array.isArray(task.children) ? task.children : [];
	for (const ch of kids) {
		fn(ch);
		forEachDescendant(ch, fn);
	}
}

/**
 * Set done / tiered completion for a task and all of its descendants.
 */
export function setDescendantsDone(task, val) {
	task.done = val;

	if (_isTieredTask(task)) {
		const steps = getTierSteps(task);
		task.currentTier = val ? steps : 0;
	}

	const kids = Array.isArray(task.children) ? task.children : [];
	for (const ch of kids) setDescendantsDone(ch, val);
}

/**
 * For Dex statuses, promote "unknown" and other low states up to "caught",
 * but never downgrade shiny / alpha / shiny_alpha.
 */
function _promoteToCaughtSafe(current) {
	const keep = new Set(["alpha", "shiny", "shiny_alpha", "caught"]);
	return keep.has(current) ? current : "caught";
}

/**
 * Simple spacer node used in layouts where window.DATA.spacer.id is present.
 */
function makeSpacer(height = 12) {
	const el = document.createElement("div");
	el.className = "task-spacer";
	el.style.height = `${height}px`;
	return el;
}

/* ===================== Rendering: layout & list ===================== */

/**
 * Render a task layout using row specs:
 *   - tasks: root task array
 *   - sectionId: used for accent color & sprite resolution
 *   - setTasks: callback(sectionId, updatedTasks)
 *   - rowsSpec: array of rows, each row is an array of task IDs or "spacer" IDs
 */
export function renderTaskLayout(tasks, sectionId, setTasks, rowsSpec) {
	const rootTasks = tasks;
	const index = buildTaskIndex(rootTasks);
	const cbById = new Map();
	const wrap = document.createElement("div");
	wrap.className = "task-layout";
	const used = new Set();

	/**
	 * Render a single inline task item (checkbox + label [+ sprite] [+ slider]).
	 */
	function makeInlineItem(t) {
		const item = document.createElement("div");
		const entry = index.get(t.id);
		const isSub = !!(entry && entry.parent);
		const hasKids = Array.isArray(t.children) && t.children.length > 0;
		const forceInline = !isSub && !hasKids && t.noCenter === true;
		const hasSlider = _isTieredTask(t);

		item.className =
			"task-item " +
			(isSub ? "is-subtask" : "is-main") +
			(!isSub ? (hasKids ? " has-children" : " no-children") : "") +
			(forceInline ? " force-inline" : "") +
			(hasSlider ? " has-slider" : "");

		const imgSrcs = resolveTaskImageSrcs(t, sectionId);
		const imgsHTML = imgSrcs
			.map((src) => `<img class="task-item-img" src="${src}" alt="">`)
			.join("");

		// checkbox + text shell
		if (isSub) {
			// SUBTASKS: keep current behavior (image above/centered via CSS)
			item.innerHTML = `
  ${imgsHTML ? `<div class="task-item-img-wrap">${imgsHTML}</div>` : ""}
  <label class="task-item-body ${_isEitherTask(t) ? "task-either-wrap" : ""}">
    ${_isEitherTask(t)
					? `
          <div class="small task-item-text task-either-title" data-id="${t.id}">${t.text}</div>
          <div class="task-either-center">
            ${_renderEitherHTML(t)}
          </div>
        `
					: `
          <input type="checkbox" ${t.done ? "checked" : ""} />
          <div class="small task-item-text" data-id="${t.id}">${t.text}</div>
        `
				}
  </label>
`;
		} else if (hasKids || forceInline) {
			// MAIN WITH SUBTASKS: image inline, left aligned (image first, then label)
			item.innerHTML = `
  <label class="task-item-body ${_isEitherTask(t) ? "task-either-wrap" : ""}">
    ${_isEitherTask(t)
					? `
          <div class="small task-item-text task-either-title" data-id="${t.id}">${t.text}</div>
          <div class="task-either-center">
            ${_renderEitherHTML(t)}
          </div>
        `
					: `
          <input type="checkbox" ${t.done ? "checked" : ""} />
          <div class="small task-item-text" data-id="${t.id}">${t.text}</div>
        `
				}
    ${imgsHTML ? `<div class="task-item-img-wrap inline">${imgsHTML}</div>` : ""}
  </label>
`;
		} else {
			// MAIN WITHOUT SUBTASKS: image above checkbox, centered (column layout)
			item.innerHTML = `
  ${imgsHTML ? `<div class="task-item-img-wrap">${imgsHTML}</div>` : ""}
  <label class="task-item-body ${_isEitherTask(t) ? "task-either-wrap" : ""}">
    ${_isEitherTask(t)
					? `
          <div class="small task-item-text task-either-title" data-id="${t.id}">${t.text}</div>
          <div class="task-either-center">
            ${_renderEitherHTML(t)}
          </div>
        `
					: `
          <input type="checkbox" ${t.done ? "checked" : ""} />
          <div class="small task-item-text" data-id="${t.id}">${t.text}</div>
        `
				}
  </label>
`;
		}

		item.querySelectorAll("img.task-item-img").forEach((imgEl) => {
			imgEl.addEventListener("error", () => {
				window.PPGC?.reportMissingAsset?.("taskImages", imgEl.currentSrc || imgEl.src);
				imgEl.remove();
			});
		});

		let cb = item.querySelector('input[type="checkbox"]');

		if (_isEitherTask(t)) {
			// keep ancestor logic stable (uses cbById), pick left cb as representative
			cb = item.querySelector("input.task-either-cb");
			_wireEitherUI(item, t, sectionId, setTasks, rootTasks);

			// ensure representative checkbox reflects "done"
			if (cb) cb.checked = !!_getEitherChoice(t.id);
		}
		cbById.set(t.id, cb);

		// --- Tiered slider / percent (if applicable) ---------------------
		let tieredWrap = null;
		if (_isTieredTask(t)) {
			const accent = resolveAccentForSection(sectionId);
			tieredWrap = renderTieredControls(t, cb, accent);

			// place % next to the task label
			const label = item.querySelector(".task-item-body");
			const pctEl = tieredWrap._pctEl;
			if (pctEl) label.appendChild(pctEl);

			// put the slider line under the label
			label.insertAdjacentElement("afterend", tieredWrap);

			tieredWrap.addEventListener("tiered-input", () => {
				window.PPGC?.refreshSectionHeaderPct?.();
			});

			tieredWrap.addEventListener("tiered-change", () => {
				// recompute ancestors’ done + update their checkboxes
				let cur = t;
				while (true) {
					const e = index.get(cur.id) || { parent: null };
					const parent = e.parent;
					if (!parent) break;
					const kids = Array.isArray(parent.children) ? parent.children : [];
					parent.done = kids.length
						? kids.every((k) => !!k.done)
						: !!parent.done;
					const parentCb = cbById.get(parent.id);
					if (parentCb) parentCb.checked = !!parent.done;
					cur = parent;
				}

				// persist, sync, and refresh header
				setTasks(sectionId, rootTasks);
				applySyncsFromTask(t, !!t.done);
				window.PPGC?.refreshSectionHeaderPct?.();
			});
		}

		// Checkbox change -> update this task, descendants, ancestors, taskSync
		if (!_isEitherTask(t)) {
			cb.addEventListener("change", () => {
				const hasKidsInner = Array.isArray(t.children) && t.children.length > 0;

				if (hasKidsInner) {
					setDescendantsDone(t, cb.checked);
				} else if (_isTieredTask(t)) {
					// checkbox drives the slider: max when checked, 0 when unchecked
					t.done = cb.checked;
					tieredWrap?._setTierFromDone?.();
				} else {
					t.done = cb.checked;
				}

				// Update descendant checkbox UIs immediately
				forEachDescendant(t, (child) => {
					const childCb = cbById.get(child.id);
					if (childCb) childCb.checked = !!child.done;
				});

				// Recompute ancestors' done and update their checkbox UIs
				let cur = t;
				while (true) {
					const e = index.get(cur.id) || { parent: null };
					const parent = e.parent;
					if (!parent) break;
					const kids = Array.isArray(parent.children) ? parent.children : [];
					parent.done = kids.length ? kids.every((k) => !!k.done) : !!parent.done;
					const parentCb = cbById.get(parent.id);
					if (parentCb) parentCb.checked = !!parent.done;
					cur = parent;
				}
				setTasks(sectionId, rootTasks);
				applySyncsFromTask(t, cb.checked);
				window.PPGC?.refreshSectionHeaderPct?.();
			});
		}

		// Tooltip content: prefer task.tooltip; for tiered, auto-build if missing
		attachTooltip(item, () => {
			const isTiered = _isTieredTask(t) && Array.isArray(t.tiers);

			if (isTiered) {
				const thresholds = formatTierTooltip(t);

				if (t.tooltip) {
					return `
				<div>${t.tooltip}</div>
				<div style="margin-top:0.05rem;"></div>
				<div>Tiers: ${thresholds}</div>
			`;
				}

				return `
			<div><strong>${t.text}</strong></div>
			<div style="margin-top:0.05rem;"></div>
			<div>Tiers: ${thresholds}</div>
		`;
			}

			if (t.tooltip) return t.tooltip;
			return `<strong>${t.text}</strong>`;
		});

		return item;
	}

	// Build each configured row
	for (const row of rowsSpec) {
		const rowEl = document.createElement("div");
		rowEl.className = "task-row task-inline";

		const includesSub = row.some((id) => {
			const entry = index.get(id);
			return entry && entry.parent;
		});
		if (includesSub) rowEl.classList.add("has-subtasks");

		for (const id of row) {
			const spacerId = window.DATA?.spacer?.id || "spacer";
			if (id === spacerId) {
				rowEl.appendChild(makeSpacer());
				continue;
			}

			const entry = index.get(id);
			if (!entry) continue;
			used.add(id);
			rowEl.appendChild(makeInlineItem(entry.task));
		}
		wrap.appendChild(rowEl);
	}

	// Leftover tasks (not in rowSpec) go into a simple list under "More:"
	const leftovers = [];
	(function collect(arr) {
		for (const t of arr || []) {
			if (!used.has(t.id)) leftovers.push(t);
			const kids = Array.isArray(t.children) ? t.children : [];
			for (const ch of kids) {
				// children rendered with parent
			}
		}
	})(rootTasks);

	if (leftovers.length) {
		const divider = document.createElement("div");
		divider.className = "small";
		divider.style.opacity = ".7";
		divider.style.margin = "6px 2px";
		divider.textContent = "More:";
		wrap.appendChild(divider);
		wrap.appendChild(
			renderTaskList(leftovers, sectionId, setTasks, rootTasks, index, cbById)
		);
	}

	return wrap;
}

/**
 * Build the tiered slider control for a task.
 * Returns a wrapper DIV with:
 *   - slider element
 *   - _pctEl: a percent/tier display node
 *   - _setTierFromDone(): sync slider from task.done
 */
function renderTieredControls(t, cb, accentColor) {
	const wrap = document.createElement("div");
	wrap.className = "tiered";

	const meta = getTierMetaForTask(t);
	const steps = meta.steps;

	// slider 0..steps
	const slider = document.createElement("input");
	slider.type = "range";
	slider.min = 0;
	slider.max = steps;
	slider.step = 1;
	slider.value = String(_clampInt(t.currentTier ?? 0, 0, steps));
	slider.className = "tiered-slider";

	const acc = accentColor || getAccentColor();
	try {
		slider.style.accentColor = acc;
	} catch {
		// some browsers don't support accent-color
	}
	slider.style.setProperty("--tier-accent", acc);

	// percent text (we'll place it up by the label)
	const pct = document.createElement("div");
	pct.className = "tiered-percent";

	const updatePct = () => {
		const m = getTierMetaForTask(t);
		const localSteps = m.steps;
		const v = localSteps ? _clampInt(t.currentTier ?? 0, 0, localSteps) : 0;

		// If tiers are strings, show the current label instead of "#/#"
		if (m.mode === "label") {
			pct.textContent = v === 0 ? "—" : (m.values[v - 1] || "—");
			return;
		}

		pct.textContent = v + "/" + localSteps;
	};
	updatePct();

	const line = document.createElement("div");
	line.className = "tiered-line";
	line.appendChild(slider);

	const syncDoneFromTier = () => {
		const localSteps = getTierSteps(t);
		t.done = localSteps ? t.currentTier >= localSteps : !!t.done;
		if (cb) cb.checked = !!t.done;
	};
	syncDoneFromTier();

	slider.addEventListener("input", () => {
		t.currentTier = Number(slider.value);
		syncDoneFromTier();
		updatePct();
		wrap.dispatchEvent(new CustomEvent("tiered-input", { bubbles: true }));
	});

	slider.addEventListener("change", () => {
		wrap.dispatchEvent(new CustomEvent("tiered-change", { bubbles: true }));
	});

	wrap._setTierFromDone = () => {
		const localSteps = getTierSteps(t);
		t.currentTier = t.done ? localSteps : 0;
		slider.value = String(t.currentTier);
		updatePct();
	};
	wrap._pctEl = pct;
	wrap._updatePct = updatePct;

	wrap.appendChild(line);
	return wrap;
}

/**
 * Render a simple stacked task list (no layout spec).
 */
export function renderTaskList(
	tasks,
	sectionId,
	setTasks,
	allTasksRef,
	indexOpt,
	cbByIdOpt
) {
	const container = document.createElement("div");
	container.className = "task-list";

	const allRef = allTasksRef || tasks;
	const index = indexOpt || buildTaskIndex(allRef);
	const cbById = cbByIdOpt || new Map();

	tasks.forEach((t) => {
		const row = document.createElement("div");
		row.className = "task-row";

		// base shell
		row.innerHTML = `
	${_isEitherTask(t)
				? `
				<div class="small task-item-text task-either-title" style="width:100%; text-align:center;">${t.text}</div>
				<div class="task-either-center" style="width:100%;">
					${_renderEitherHTML(t)}
				</div>
			`
				: `
				<input type="checkbox" ${t.done ? "checked" : ""} />
				<div class="small" style="flex:1">${t.text}</div>
			`
			}
`;

		let cb = row.querySelector('input[type="checkbox"]');

		if (_isEitherTask(t)) {
			cb = row.querySelector("input.task-either-cb");
			_wireEitherUI(row, t, sectionId, setTasks, allRef);
			if (cb) cb.checked = !!_getEitherChoice(t.id);
		} else {
			cbById.set(t.id, cb);
		}

		// Tiered slider goes under the text (if applicable)
		let tieredWrap = null;
		if (_isTieredTask(t)) {
			const accent = resolveAccentForSection(sectionId);
			tieredWrap = renderTieredControls(t, cb, accent);

			// move % up next to the inline task text
			const labelText = row.querySelector(".small");
			if (tieredWrap._pctEl && labelText && labelText.parentElement) {
				labelText.parentElement.appendChild(tieredWrap._pctEl);
			}

			// slider line stays below
			row.appendChild(tieredWrap);

			tieredWrap.addEventListener("tiered-change", () => {
				// unchanged behavior here (slider change is handled by checkbox logic)
			});
		}

		if (!_isEitherTask(t)) {
			cb.addEventListener("change", () => {
				const hasKids = Array.isArray(t.children) && t.children.length > 0;

				if (hasKids) {
					setDescendantsDone(t, cb.checked);
				} else if (_isTieredTask(t)) {
					t.done = cb.checked;
					tieredWrap?._setTierFromDone?.();
				} else {
					t.done = cb.checked;
				}

				// Update descendant checkbox UIs
				forEachDescendant(t, (child) => {
					const childCb = cbById.get(child.id);
					if (childCb) childCb.checked = !!child.done;
				});

				// Recompute and update ancestors
				let cur = t;
				while (true) {
					const e = index.get(cur.id) || { parent: null };
					const parent = e.parent;
					if (!parent) break;
					const kids = Array.isArray(parent.children) ? parent.children : [];
					parent.done = kids.length ? kids.every((k) => !!k.done) : !!parent.done;
					const parentCb = cbById.get(parent.id);
					if (parentCb) parentCb.checked = !!parent.done;
					cur = parent;
				}
				setTasks(sectionId, allRef);
				applySyncsFromTask(t, cb.checked);
				window.PPGC?.refreshSectionHeaderPct?.();
			});
		}

		container.appendChild(row);
	});

	return container;
}

function _getEitherChoice(taskId) {
	const store = window.PPGC?._storeRef || window.store;
	const m = store?.taskChoiceById;
	if (!m) return null;
	if (m instanceof Map) return m.get(String(taskId)) || null;
	// in case it ever becomes a plain object
	return m[String(taskId)] || null;
}

function _setEitherChoice(taskId, sideOrNull) {
	const store = window.PPGC?._storeRef || window.store;
	if (!store) return;

	if (!(store.taskChoiceById instanceof Map)) {
		store.taskChoiceById = new Map(Object.entries(store.taskChoiceById || {}));
	}

	const key = String(taskId);
	if (!sideOrNull) store.taskChoiceById.delete(key);
	else store.taskChoiceById.set(key, sideOrNull);

	store.save?.();
}

function _eitherSyncView(task, optionKey) {
	const opt =
		optionKey == null ? null : (task?.eithers || {})[String(optionKey)] || (task?.eithers || {})[optionKey];

	const mergeSync = (a, b) => {
		const out = [];
		const seen = new Set();

		const add = (v) => {
			if (v == null) return;
			// Keep objects (like {id, oneWay}) as-is (don’t try to dedupe them).
			if (typeof v === "object") {
				out.push(v);
				return;
			}
			const k = String(v);
			if (seen.has(k)) return;
			seen.add(k);
			out.push(v);
		};

		(Array.isArray(a) ? a : []).forEach(add);
		(Array.isArray(b) ? b : []).forEach(add);
		return out;
	};

	return {
		taskSync: mergeSync(task?.taskSync, opt?.taskSync),
		dexSync: mergeSync(task?.dexSync, opt?.dexSync),
		fashionSync: mergeSync(task?.fashionSync, opt?.fashionSync),
	};
}

function _renderEitherHTML(t) {
	const src = t?.eithers || {};

	const entries = Object.entries(src).filter(([, v]) => v && typeof v === "object");

	if (!entries.length) return "";

	const choice = _getEitherChoice(t.id);

	const optsHtml = entries
		.map(([key, opt]) => {
			const active = choice != null && String(choice) === String(key);
			const disabled = choice != null && !active;
			const rawText = typeof opt?.text === "string" ? opt.text : "";
			const text = rawText.trim();
			const labelHtml = text ? `<span class="small">${text}</span>` : "";

			return `
				<span class="task-either-choice ${active ? "either-active" : ""} ${disabled ? "either-disabled" : ""}"
					data-option-key="${String(key)}"
					role="button"
					tabindex="0">
					<input type="checkbox" class="task-either-cb" data-option-key="${String(key)}"
						${active ? "checked" : ""} ${disabled ? "disabled" : ""}/>
					${labelHtml}
				</span>
			`;
		})
		.join("");

	return `
		<div class="task-either" data-either="1">
			${optsHtml}
		</div>
	`;
}

function _wireEitherUI(rowOrItemEl, t, sectionId, setTasks, tasksRootRef) {
	const wrap = rowOrItemEl.querySelector('[data-either="1"]');
	if (!wrap) return;

	const _shieldFromOuterLabel = (e) => {
		if (!e.target.closest("input.task-either-cb")) {
			e.preventDefault();
		}
	};
	wrap.addEventListener("click", _shieldFromOuterLabel, true);

	const allRef = tasksRootRef;
	const getKeyFromEl = (el) => el?.getAttribute("data-option-key");

	// Update the chips/checkbox UI for whatever choice is currently stored
	const renderChoiceUI = (choice) => {
		// completion rule: picked anything => done
		t.done = !!choice;

		// update UI: selected checked, others disabled
		wrap
			.querySelectorAll(".task-either-choice[data-option-key]")
			.forEach((chip) => {
				const k = getKeyFromEl(chip);
				const active = choice != null && String(choice) === String(k);
				const disabled = choice != null && !active;

				chip.classList.toggle("either-active", active);
				chip.classList.toggle("either-disabled", disabled);

				const cb = chip.querySelector('input.task-either-cb[data-option-key]');
				if (cb) {
					cb.checked = active;
					cb.disabled = disabled;
				}
			});
	};

	/**
	 * Apply a choice. IMPORTANT:
	 * - Do NOT call setTasks() during init
	 * - Do NOT call setTasks()/sync if nothing changed
	 */
	const applyChoice = (newKeyOrNull, opts = {}) => {
		const { init = false } = opts;

		const prev = _getEitherChoice(t.id);
		const prevStr = prev == null ? null : String(prev);
		const nextStr = newKeyOrNull == null ? null : String(newKeyOrNull);

		// If nothing changed:
		// - on init: just render UI and leave
		// - otherwise: also just re-render UI and leave
		if (prevStr === nextStr) {
			renderChoiceUI(prev);
			return;
		}

		// If switching options (not init), attempt to unset previous option syncs (non-oneWay cases)
		if (!init && prev != null && newKeyOrNull != null && prevStr !== nextStr) {
			applySyncsFromTask(_eitherSyncView(t, prev), false);
		}

		_setEitherChoice(t.id, newKeyOrNull);
		const choice = _getEitherChoice(t.id);

		renderChoiceUI(choice);

		// During init: NEVER persist tasks / sync (prevents render recursion)
		if (init) return;

		// Persist tasks + run syncs for the chosen option
		setTasks(sectionId, allRef);
		if (choice != null) applySyncsFromTask(_eitherSyncView(t, choice), true);

		window.PPGC?.refreshSectionHeaderPct?.();
	};

	// Init from stored choice — UI only, no setTasks/sync
	applyChoice(_getEitherChoice(t.id), { init: true });

	// Clicking the chip toggles/clears (avoid double-fire when clicking checkbox itself)
	wrap.addEventListener("click", (e) => {
		const input = e.target.closest("input.task-either-cb");
		const chip = e.target.closest(".task-either-choice[data-option-key]");
		if (!chip) return;

		// Let checkbox change handler deal with real checkbox clicks
		if (input) return;

		const key = getKeyFromEl(chip);
		const cur = _getEitherChoice(t.id);

		if (cur != null && String(cur) === String(key)) applyChoice(null);
		else applyChoice(key);
	});

	// Checkbox changes (keyboard nav, etc.)
	wrap.querySelectorAll("input.task-either-cb[data-option-key]").forEach((cb) => {
		cb.addEventListener("change", (e) => {
			const key = e.target.getAttribute("data-option-key");
			const cur = _getEitherChoice(t.id);

			// If user unchecked the currently selected option, clear it.
			if (cur != null && String(cur) === String(key) && !e.target.checked) {
				applyChoice(null);
			} else {
				applyChoice(key);
			}
		});
	});
}

/* ===================== Task bootstrap ===================== */

/**
 * Make sure a section has tasks in the live store, seeding from DATA.tasks:
 *   - If tasks already exist, prune bad nodes and sync in new metadata (img, tiers, etc.)
 *   - If no tasks yet, deep-clone from the seed.
 */
export function bootstrapTasks(sectionId, tasksStore) {
	const seed = (window.DATA.tasks && window.DATA.tasks[sectionId]) || [];

	function applyProgressOverlayToSectionTasks(sectionId, tasksArr) {
		const storeRef = window.PPGC?._storeRef;
		if (!storeRef?.taskProgressById) return;

		(function walk(arr) {
			for (const t of arr || []) {
				if (!t?.id) continue;
				const k = String(t.id);
				if (storeRef.taskProgressById.has(k)) {
					t.done = !!storeRef.taskProgressById.get(k);
				}
				if (Array.isArray(t.children)) walk(t.children);
			}
		})(tasksArr);
	}

	// Existing tasks: clean & sync from seed
	if (tasksStore.has(sectionId)) {
		const current = tasksStore.get(sectionId) || [];
		const seedIndex = new Map();



		// Prune invalid nodes
		(function prune(arr) {
			if (!Array.isArray(arr)) return;
			for (let i = arr.length - 1; i >= 0; i--) {
				const t = arr[i];
				if (!t || typeof t !== "object" || !t.id) {
					arr.splice(i, 1);
					continue;
				}
				if (Array.isArray(t.children)) prune(t.children);
			}
		})(current);

		// Index seed by ID
		(function indexSeed(arr) {
			for (const t of arr || []) {
				if (!t || typeof t !== "object") continue;
				if (t.id) seedIndex.set(t.id, t);
				if (Array.isArray(t.children)) indexSeed(t.children);
			}
		})(seed);

		// Sync metadata (img, tiers, taskSync, tooltip, etc.) from seed
		let changed = false;
		(function sync(arr) {
			for (const t of arr || []) {
				if (!t || typeof t !== "object" || !t.id) continue;

				const s = seedIndex.get(t.id);
				if (s) {
					if (s.img && !t.img) {
						t.img = s.img;
						changed = true;
					}
					if (s.imgS && !t.imgS) {
						t.imgS = s.imgS;
						changed = true;
					}
					if (Array.isArray(s.tags) && !Array.isArray(t.tags)) {
						t.tags = [...s.tags];
						changed = true;
					}
					if (Array.isArray(s.taskSync) && !Array.isArray(t.taskSync)) {
						t.taskSync = [...s.taskSync];
						changed = true;
					}
					if (Array.isArray(s.dexSync) && !Array.isArray(t.dexSync)) {
						t.dexSync = [...s.dexSync];
						changed = true;
					}
					if (Array.isArray(s.fashionSync) && !Array.isArray(t.fashionSync)) {
						t.fashionSync = [...s.fashionSync];
						changed = true;
					}
					if (Array.isArray(s.tiers) && !Array.isArray(t.tiers)) {
						t.tiers = [...s.tiers];
						changed = true;
					}
					if (s.eithers) {
						const seedEither = s.eithers;

						if (!t.eithers || typeof t.eithers !== "object") {
							t.eithers = JSON.parse(JSON.stringify(seedEither));
							changed = true;
						} else {
							const keys = Object.keys(seedEither || {});

							for (const key of keys) {
								const so = seedEither?.[key];
								if (!so || typeof so !== "object") continue;

								if (!t.eithers[key] || typeof t.eithers[key] !== "object") {
									t.eithers[key] = JSON.parse(JSON.stringify(so));
									changed = true;
									continue;
								}

								if (so.text && !t.eithers[key].text) {
									t.eithers[key].text = so.text;
									changed = true;
								}

								for (const k of ["taskSync", "dexSync", "fashionSync"]) {
									if (Array.isArray(so[k]) && !Array.isArray(t.eithers[key][k])) {
										t.eithers[key][k] = [...so[k]];
										changed = true;
									}
								}
							}
						}
					}
					if (s.tooltip && !t.tooltip) {
						t.tooltip = s.tooltip;
						changed = true;
					}
					if (typeof s.noCenter === "boolean" && typeof t.noCenter !== "boolean") {
						t.noCenter = !!s.noCenter;
						changed = true;
					}
					if (typeof s.startGame === "boolean" && typeof t.startGame !== "boolean") {
						t.startGame = !!s.startGame;
						changed = true;
					}
				}
				if (Array.isArray(t.children)) sync(t.children);
			}
		})(current);

		if (changed) {
			tasksStore.set(sectionId, current);
			save();
			_indexSectionTasks(sectionId, current);
			_indexDexSyncs(sectionId, current);
		}
		return;
	}

	// No tasks yet: deep-clone from seed
	const cloned = seed.map(cloneTaskDeep);
	tasksStore.set(sectionId, cloned);
	applyProgressOverlayToSectionTasks(sectionId, cloned);
	save();
	_indexSectionTasks(sectionId, cloned);
	_indexDexSyncs(sectionId, cloned);

	/**
	 * Deep-clone a seed task into a live task node.
	 */
	function cloneTaskDeep(t) {
		return {
			id: t.id || uid(),
			text: t.text || "Task",
			done: !!t.done,
			img: t.img || null,
			imgS: t.imgS || null,
			tiers: Array.isArray(t.tiers) ? [...t.tiers] : undefined,
			unit: t.unit || null,
			currentTier: typeof t.currentTier === "number" ? t.currentTier : 0,
			currentCount: typeof t.currentCount === "number" ? t.currentCount : 0,
			eithers: t.eithers ? JSON.parse(JSON.stringify(t.eithers)) : undefined,
			tooltip: t.tooltip || null,
			noCenter: !!t.noCenter,
			children: Array.isArray(t.children) ? t.children.map(cloneTaskDeep) : [],
			taskSync: Array.isArray(t.taskSync) ? [...t.taskSync] : undefined,
			dexSync: Array.isArray(t.dexSync) ? [...t.dexSync] : undefined,
			fashionSync: Array.isArray(t.fashionSync) ? [...t.fashionSync] : undefined,
			tags: Array.isArray(t.tags) ? [...t.tags] : undefined,
			startGame: t.startGame === true,
		};
	}
}

window.PPGC = window.PPGC || {};
window.PPGC.disableTaskTooltips = function () {
	_tooltipsDisabled = true;
	hideTooltip();
};
window.PPGC.enableTaskTooltips = function () {
	_tooltipsDisabled = false;
};
