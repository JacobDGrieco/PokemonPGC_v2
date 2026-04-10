import { save } from "./store.js";
import { buildTaskIndex } from "./tasks-bootstrap.js";
import { setDescendantsDone, getDefaultEitherChoice, getEitherChoice, isEitherTask, setEitherChoice } from "./tasks-modes.js";
import { getSeedTaskRegistry } from "./taskRegistry.js";
import { ensureSyncSetsExpandedForGame } from "./sync.js";
import { ensurePpgcRoot } from "./runtime/globals.js";

const PPGC = ensurePpgcRoot();

function gameKeyFromSection(sectionId) {
	const s = String(sectionId || "");
	if (s.includes(":")) return s.split(":")[0] || "";
	return s.split("-")[0] || "";
}

export function unloadSectionTasks(sectionId) {
	const tasksStore = window.PPGC?._tasksStoreRef;
	if (!tasksStore || !tasksStore.has(sectionId)) return;
	const arr = tasksStore.get(sectionId) || [];
	const globalIdx = PPGC._taskIndexGlobal;
	if (globalIdx) {
		(function walk(list) {
			for (const t of list || []) {
				if (t?.id) globalIdx.delete(String(t.id));
				if (Array.isArray(t.children)) walk(t.children);
			}
		})(arr);
	}
	const dexIdx = PPGC._dexSyncIndex;
	if (dexIdx) {
		for (const [key, bucket] of dexIdx.entries()) {
			const next = (bucket || []).filter((x) => x?.sectionId !== sectionId);
			if (!next.length) dexIdx.delete(key); else dexIdx.set(key, next);
		}
	}
	tasksStore.delete(sectionId);
}

function _globalTaskIndex() {
	window.PPGC = window.PPGC || {};
	if (!PPGC._taskIndexGlobal) PPGC._taskIndexGlobal = new Map();
	return PPGC._taskIndexGlobal;
}
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
	const wanted = String(linkId);
	let entry = (dexList || []).find((e) => e && String(e.id) === wanted);
	if (!entry) {
		const n = Number(linkId);
		if (Number.isFinite(n)) entry = (dexList || []).find((e) => e && Number(e.localId ?? e.id) === n);
	}
	if (!entry) return null;
	return { entry, key: String(entry.id) };
}
function _dexSyncIndex() {
	window.PPGC = window.PPGC || {};
	if (!PPGC._dexSyncIndex) PPGC._dexSyncIndex = new Map();
	return PPGC._dexSyncIndex;
}
function _indexDexSyncs(sectionId, tasksArr) {
	const idx = _dexSyncIndex();
	(function walk(arr) {
		for (const t of arr || []) {
			const ds = Array.isArray(t.dexSync) ? t.dexSync : [];
			for (const link of ds) {
				if (!link || !link.game || link.id == null) continue;
				const key = `${link.game}:${String(link.id)}`;
				if (!idx.has(key)) idx.set(key, []);
				idx.get(key).push({ sectionId, task: t });
			}
			if (Array.isArray(t.children) && t.children.length) walk(t.children);
		}
	})(tasksArr || []);
}
function _ensureIndexes() {
	const tasksStore = window.PPGC?._tasksStoreRef;
	if (!tasksStore) return;
	const ti = _globalTaskIndex();
	const di = _dexSyncIndex();
	if (ti.size && di.size) return;
	if (typeof tasksStore.forEach === "function") {
		tasksStore.forEach((arr, sectionId) => { _indexSectionTasks(sectionId, arr); _indexDexSyncs(sectionId, arr); });
	}
}
function _setTaskCheckedById(taskId, checked) {
	const id = String(taskId);
	const storeRef = window.PPGC?._storeRef;
	if (!storeRef) return false;
	const hit = _globalTaskIndex().get(id);
	if (hit?.task) {
		const { sectionId, task } = hit;
		const hasKids = Array.isArray(task.children) && task.children.length > 0;
		if (hasKids) {
			setDescendantsDone(task, !!checked);
		} else if (isEitherTask(task)) {
			const nextChoice = checked ? (getEitherChoice(task.id) ?? getDefaultEitherChoice(task)) : null;
			setEitherChoice(task.id, nextChoice);
			task.done = !!nextChoice;
		} else {
			task.done = !!checked;
		}
		const arr = PPGC._tasksStoreRef.get(sectionId) || [];
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
		PPGC._tasksStoreRef.set(sectionId, arr);
		save();
		_indexSectionTasks(sectionId, arr);
		_indexDexSyncs(sectionId, arr);
		return true;
	}
	const reg = getSeedTaskRegistry();
	if (!reg.has(id)) return false;
	storeRef.taskProgressById.set(id, !!checked);
	save();
	return true;
}
function _promoteToCaughtSafe(current) {
	const keep = new Set(["alpha", "shiny", "shiny_alpha", "caught"]);
	return keep.has(current) ? current : "caught";
}
function _norm(v) { return String(v || "unknown").trim().toLowerCase(); }
function _isDexCompleteStatus(status) {
	const s = _norm(status);
	return s === "caught" || s === "alpha" || s === "shiny" || s === "shiny_alpha";
}

export function applySyncsFromTask(sourceTask, value) {
	_ensureIndexes();
	try {
		let sid = window.PPGC?._storeRef?.state?.sectionId || null;
		if (!sid && sourceTask?.id) sid = _globalTaskIndex().get(String(sourceTask.id))?.sectionId || null;
		const gk = sid ? gameKeyFromSection(sid) : null;
		if (gk) ensureSyncSetsExpandedForGame(gk);
	} catch {}
	const store = window.PPGC?._storeRef;
	const taskTargets = new Map();
	const dexLinks = [];
	const fashionLinks = [];
	const addTaskTarget = (v) => {
		if (v == null) return;
		if (typeof v === "object") {
			const id = v.id ?? v.taskId ?? v.value;
			if (id == null) return;
			const key = String(id);
			taskTargets.set(key, !!taskTargets.get(key) || v.oneWay === true || v.sink === true || v.sinkOnly === true);
		} else if (!taskTargets.has(String(v))) taskTargets.set(String(v), false);
	};
	(function collect(t) {
		if (!t || typeof t !== "object") return;
		if (Array.isArray(t.taskSync)) t.taskSync.forEach(addTaskTarget);
		if (Array.isArray(t.dexSync)) dexLinks.push(...t.dexSync);
		if (Array.isArray(t.fashionSync)) fashionLinks.push(...t.fashionSync);
		if (Array.isArray(t.children)) t.children.forEach(collect);
	})(sourceTask);
	for (const [targetId, isOneWay] of taskTargets.entries()) {
		if (!value && isOneWay) continue;
		window.PPGC?.setTaskCheckedById?.(targetId, !!value);
	}
	if (store && dexLinks.length) {
		for (const link of dexLinks) {
			const isOneWay = link?.oneWay === true || link?.sink === true || link?.sinkOnly === true;
			if (!value && isOneWay) continue;
			const game = link?.game;
			if (!game) continue;
			const t = String(link.dexType || "regional").toLowerCase();
			let targetGameKey;
			if (t === "national") targetGameKey = `${game}-national`;
			else if (t === "regional") targetGameKey = game;
			else if (["central","coastal","mountain","melemele","akala","ulaula","poni"].includes(t)) targetGameKey = `${game}-${t}`;
			else {
				const candidate = `${game}-${t}`;
				targetGameKey = (window.DATA?.dex && window.DATA.dex[candidate]) ? candidate : game;
			}
			const dexList = window.DATA?.dex?.[targetGameKey] || [];
			if (!targetGameKey || !dexList.length) continue;
			const hit = _resolveDexEntryAndKey(dexList, link?.id);
			if (!hit) continue;
			const { entry, key: entryKey } = hit;
			if (typeof link.form === "undefined" || link.form === null) {
				const curr = store.dexStatus.get(targetGameKey) || {};
				const prev = typeof curr[entryKey] !== "undefined" ? curr[entryKey] : "unknown";
				curr[entryKey] = value ? _promoteToCaughtSafe(prev) : "unknown";
				store.dexStatus.set(targetGameKey, curr);
				save();
				continue;
			}
			const resolveFormName = (formRef) => {
				if (typeof formRef === "string") return formRef;
				const forms = Array.isArray(entry?.forms) ? entry.forms : [];
				if (!forms.length || typeof formRef !== "number") return null;
				const idx = formRef >= 1 ? formRef - 1 : formRef;
				const f = forms[idx];
				return f ? (typeof f === "string" ? f : f?.name) : null;
			};
			const formName = resolveFormName(link.form);
			if (!formName) continue;
			const formsMap = store.dexFormsStatus.get(targetGameKey) || {};
			const node = formsMap[entryKey] || { all: false, forms: {} };
			node.forms = node.forms || {};
			const prevForm = node.forms?.[formName] || "unknown";
			node.forms[formName] = value ? _promoteToCaughtSafe(prevForm) : "unknown";
			formsMap[entryKey] = node;
			store.dexFormsStatus.set(targetGameKey, formsMap);
			save();
		}
	}
	if (store && fashionLinks.length) {
		for (const link of fashionLinks) {
			if (!value && (link?.oneWay === true || link?.sink === true || link?.sinkOnly === true)) continue;
			const gameKey = link?.game;
			const itemIdRaw = link?.id;
			if (!gameKey || !itemIdRaw) continue;
			const itemIdStr = String(itemIdRaw);
			const cats = window.DATA?.fashion?.[gameKey]?.categories || [];
			if (!cats.length) continue;
			const explicitCategoryId = link?.dexType || link?.category || link?.categoryId || null;
			const targets = [];
			if (explicitCategoryId) {
				const cat = cats.find((c) => c.id === explicitCategoryId);
				if (!cat) continue;
				for (const it of cat.items || []) if (String(it.id) === itemIdStr) targets.push({ catId: cat.id, item: it });
			} else {
				for (const cat of cats) for (const it of cat.items || []) if (String(it.id) === itemIdStr) targets.push({ catId: cat.id, item: it });
			}
			if (!targets.length) continue;
			for (const { catId, item } of targets) {
				const hasForms = Array.isArray(item.forms) && item.forms.length > 0;
				if (hasForms) {
					let gameMap = store.fashionFormsStatus.get(gameKey);
					if (!gameMap) { gameMap = new Map(); store.fashionFormsStatus.set(gameKey, gameMap); }
					const rec = gameMap.get(catId) || {};
					const node = rec[item.id] || { all: false, forms: {} };
					const forms = item.forms || [];
					const formRef = link.form;
					const resolveFormName = (ref) => {
						if (typeof ref === "string") return ref;
						if (typeof ref === "number") {
							const idx = ref >= 1 ? ref - 1 : ref;
							const f = forms[idx];
							return f ? (typeof f === "string" ? f : f?.name) : null;
						}
						return null;
					};
					node.forms = node.forms || {};
					if (typeof formRef !== "undefined" && formRef !== null) {
						const formName = resolveFormName(formRef);
						if (!formName) continue;
						node.forms[formName] = !!value;
					} else {
						for (const f of forms) {
							const name = typeof f === "string" ? f : f?.name;
							if (!name) continue;
							node.forms[name] = !!value;
						}
					}
					node.all = forms.length > 0 && forms.every((f) => {
						const name = typeof f === "string" ? f : f?.name;
						return name && node.forms?.[name];
					});
					rec[item.id] = node;
					gameMap.set(catId, rec);
				} else {
					let gameMap = store.fashionStatus.get(gameKey);
					if (!gameMap) { gameMap = new Map(); store.fashionStatus.set(gameKey, gameMap); }
					const rec = gameMap.get(catId) || {};
					rec[item.id] = !!value;
					gameMap.set(catId, rec);
				}
			}
		}
		save();
	}
	const isModalOpen = !!window.PPGC?._storeRef?.state?.dexModalFor;
	if (!isModalOpen) {
		try { window.PPGC?.renderAll?.(); } catch {}
	}
}

export function applyDexSyncsFromDexEntries(gameKey, changedMap) {
	const dexList = window.DATA?.dex?.[gameKey] || [];
	if (!dexList.length) return;
	for (const [idStr, status] of Object.entries(changedMap || {})) {
		const dexId = String(idStr);
		let entry = dexList.find((e) => e && String(e.id) === dexId);
		if (!entry) {
			const n = Number(idStr);
			if (Number.isFinite(n)) entry = dexList.find((e) => e && Number(e.localId ?? e.id) === n);
		}
		if (!entry || !Array.isArray(entry.taskSync) || !entry.taskSync.length) continue;
		const isComplete = status === "caught" || status === "alpha" || status === "shiny" || status === "shiny_alpha";
		for (const spec of entry.taskSync) {
			const id = spec && typeof spec === "object" ? spec.id : spec;
			if (id == null) continue;
			if (!isComplete && spec && typeof spec === "object" && spec.oneWay === true) continue;
			_setTaskCheckedById(id, isComplete);
		}
	}
}

export function applyTaskSyncsFromForm(gameKey, entryId, formName, status) {
	try {
		const dexList = window.DATA?.dex?.[gameKey] || [];
		const wanted = String(entryId);
		let entry = dexList.find((e) => e && String(e.id) === wanted);
		if (!entry) {
			const n = Number(entryId);
			if (Number.isFinite(n)) entry = dexList.find((e) => e && Number(e.localId ?? e.id) === n);
		}
		const forms = Array.isArray(entry.forms) ? entry.forms : [];
		const hit = forms.find((f) => (typeof f === "string" ? f : f?.name) === formName);
		if (!hit || typeof hit !== "object") return;
		const ids = Array.isArray(hit.taskSync) ? hit.taskSync.slice() : typeof hit.taskSync === "number" ? [hit.taskSync] : [];
		if (!ids.length) return;
		const checked = _isDexCompleteStatus(status);
		for (const taskId of ids) {
			const id = (taskId && typeof taskId === "object") ? taskId.id : taskId;
			if (id == null) continue;
			if (!checked && taskId && typeof taskId === "object" && taskId.oneWay === true) continue;
			_setTaskCheckedById(id, checked);
		}
	} catch (e) { console.error("applyTaskSyncsFromForm error:", e); }
}

export function applyTaskSyncsFromFashion(gameKey, categoryId, itemId) {
	try {
		const fashionBlock = window.DATA?.fashion?.[gameKey];
		const cats = fashionBlock?.categories || [];
		const cat = cats.find((c) => c.id === categoryId);
		if (!cat) return;
		const item = (cat.items || []).find((it) => String(it.id) === String(itemId));
		if (!item) return;
		const ids = Array.isArray(item.taskSync) ? item.taskSync.slice() : typeof item.taskSync === "number" || typeof item.taskSync === "string" ? [item.taskSync] : [];
		if (!ids.length) return;
		const storeRef = window.PPGC?._storeRef;
		if (!storeRef) return;
		const hasForms = Array.isArray(item.forms) && item.forms.length > 0;
		let checked = false;
		if (!hasForms) {
			const gCat = storeRef.fashionStatus instanceof Map ? storeRef.fashionStatus.get(gameKey) : null;
			const rec = gCat?.get(categoryId) || {};
			checked = !!rec[item.id];
		} else {
			const gFormsCat = storeRef.fashionFormsStatus instanceof Map ? storeRef.fashionFormsStatus.get(gameKey) : null;
			const rec = gFormsCat?.get(categoryId) || {};
			const node = rec[item.id] || { all: false, forms: {} };
			checked = !!node.all;
		}
		for (const taskId of ids) {
			const id = (taskId && typeof taskId === "object") ? taskId.id : taskId;
			if (id == null) continue;
			if (!checked && taskId && typeof taskId === "object" && taskId.oneWay === true) continue;
			window.PPGC?.setTaskCheckedById?.(id, checked);
		}
	} catch (e) { console.error("applyTaskSyncsFromFashion error:", e); }
}

window.PPGC = window.PPGC || {};
PPGC.applyDexSyncsFromDexEntries = applyDexSyncsFromDexEntries;
PPGC.applyTaskSyncsFromForm = applyTaskSyncsFromForm;
PPGC.setTaskCheckedById = _setTaskCheckedById;
PPGC.applyTaskSyncsFromFashion = applyTaskSyncsFromFashion;
