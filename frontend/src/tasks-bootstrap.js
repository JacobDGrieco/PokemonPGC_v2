import { save, uid } from "./store.js";

export function ensureSections(gameKey, PPGC = window.PPGC) {
	const seed = (window.DATA.sections && window.DATA.sections[gameKey]) || [];
	if (!PPGC._sectionsStore) PPGC._sectionsStore = new Map();
	let arr = PPGC._sectionsStore.get(gameKey);
	if (!arr || (!arr.length && seed.length)) {
		PPGC._sectionsStore.set(
			gameKey,
			seed.map((s) => ({ id: s.id || uid(), title: s.title || "Section" }))
		);
		save();
		arr = PPGC._sectionsStore.get(gameKey);
	}
	if (!arr) {
		PPGC._sectionsStore.set(gameKey, []);
		arr = PPGC._sectionsStore.get(gameKey);
	}
	return arr;
}

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

export function bootstrapTasks(sectionId, tasksStore, { indexSectionTasks, indexDexSyncs } = {}) {
	const seed = (window.DATA.tasks && window.DATA.tasks[sectionId]) || [];

	function applyProgressOverlayToSectionTasks(tasksArr) {
		const storeRef = window.PPGC?._storeRef;
		if (!storeRef?.taskProgressById) return;
		(function walk(arr) {
			for (const t of arr || []) {
				if (!t?.id) continue;
				const k = String(t.id);
				if (storeRef.taskProgressById.has(k)) t.done = !!storeRef.taskProgressById.get(k);
				if (Array.isArray(t.children)) walk(t.children);
			}
		})(tasksArr);
	}

	if (tasksStore.has(sectionId)) {
		const current = tasksStore.get(sectionId) || [];
		const seedIndex = new Map();

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

		(function indexSeed(arr) {
			for (const t of arr || []) {
				if (!t || typeof t !== "object") continue;
				if (t.id) seedIndex.set(t.id, t);
				if (Array.isArray(t.children)) indexSeed(t.children);
			}
		})(seed);

		let changed = false;
		(function sync(arr) {
			for (const t of arr || []) {
				if (!t || typeof t !== "object" || !t.id) continue;
				const s = seedIndex.get(t.id);
				if (s) {
					if (s.img && !t.img) { t.img = s.img; changed = true; }
					if (s.imgS && !t.imgS) { t.imgS = s.imgS; changed = true; }
					if (Array.isArray(s.tags) && !Array.isArray(t.tags)) { t.tags = [...s.tags]; changed = true; }
					if (Array.isArray(s.taskSync) && !Array.isArray(t.taskSync)) { t.taskSync = [...s.taskSync]; changed = true; }
					if (Array.isArray(s.dexSync) && !Array.isArray(t.dexSync)) { t.dexSync = [...s.dexSync]; changed = true; }
					if (Array.isArray(s.fashionSync) && !Array.isArray(t.fashionSync)) { t.fashionSync = [...s.fashionSync]; changed = true; }
					if (Array.isArray(s.tiers) && !Array.isArray(t.tiers)) { t.tiers = [...s.tiers]; changed = true; }
					if (s.eithers) {
						const seedEither = s.eithers;
						if (!t.eithers || typeof t.eithers !== "object") {
							t.eithers = JSON.parse(JSON.stringify(seedEither));
							changed = true;
						} else {
							for (const key of Object.keys(seedEither || {})) {
								const so = seedEither?.[key];
								if (!so || typeof so !== "object") continue;
								if (!t.eithers[key] || typeof t.eithers[key] !== "object") {
									t.eithers[key] = JSON.parse(JSON.stringify(so));
									changed = true;
									continue;
								}
								if (so.text && !t.eithers[key].text) { t.eithers[key].text = so.text; changed = true; }
								for (const k of ["taskSync", "dexSync", "fashionSync"]) {
									if (Array.isArray(so[k]) && !Array.isArray(t.eithers[key][k])) {
										t.eithers[key][k] = [...so[k]];
										changed = true;
									}
								}
							}
						}
					}
					if (s.tooltip && !t.tooltip) { t.tooltip = s.tooltip; changed = true; }
					if (typeof s.noCenter === "boolean" && typeof t.noCenter !== "boolean") { t.noCenter = !!s.noCenter; changed = true; }
					if (typeof s.startGame === "boolean" && typeof t.startGame !== "boolean") { t.startGame = !!s.startGame; changed = true; }
				}
				if (Array.isArray(t.children)) sync(t.children);
			}
		})(current);

		if (changed) {
			tasksStore.set(sectionId, current);
			save();
			indexSectionTasks?.(sectionId, current);
			indexDexSyncs?.(sectionId, current);
		}
		return;
	}

	const cloneTaskDeep = (t) => ({
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
	});

	const cloned = seed.map(cloneTaskDeep);
	tasksStore.set(sectionId, cloned);
	applyProgressOverlayToSectionTasks(cloned);
	save();
	indexSectionTasks?.(sectionId, cloned);
	indexDexSyncs?.(sectionId, cloned);
}
