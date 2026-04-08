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

export function buildTaskLayoutMeta(rowsSpec, index, spacerId = "spacer") {
	const rowMeta = (rowsSpec || []).map((row) => {
		const entries = (row || [])
			.filter((id) => id !== spacerId)
			.map((id) => index.get(id))
			.filter(Boolean);

		const childParentIds = [...new Set(entries.map((entry) => entry.parent?.id).filter(Boolean))];
		const mainEntries = entries.filter((entry) => !entry.parent);
		const singleMainEntry = entries.length === 1 && mainEntries.length === 1 ? mainEntries[0] : null;
		const hasChildren = !!(singleMainEntry?.task?.children?.length);

		return {
			includesSubtasks: entries.some((entry) => !!entry.parent),
			isSingleMainWithChildren: !!singleMainEntry && hasChildren,
			mainTaskId: singleMainEntry?.task?.id || null,
			isPureChildRow: entries.length > 0 && entries.every((entry) => !!entry.parent) && childParentIds.length === 1,
			childParentId: childParentIds.length === 1 ? childParentIds[0] : null,
		};
	});

	const decorated = rowMeta.map((meta) => ({
		...meta,
		rowClasses: meta.includesSubtasks ? ["has-subtasks"] : [],
	}));

	for (let i = 0; i < rowMeta.length; i += 1) {
		const meta = rowMeta[i];
		if (!meta.isSingleMainWithChildren || !meta.mainTaskId) continue;

		let lastChildRow = i;
		for (let j = i + 1; j < rowMeta.length; j += 1) {
			const candidate = rowMeta[j];
			if (!candidate.isPureChildRow || candidate.childParentId !== meta.mainTaskId) break;
			lastChildRow = j;
		}

		if (lastChildRow === i) continue;

		decorated[i].rowClasses.push("task-lineage-row", "task-lineage-start", "task-lineage-parent");
		for (let j = i + 1; j <= lastChildRow; j += 1) {
			decorated[j].rowClasses.push(
				"task-lineage-row",
				"task-lineage-child",
				j === lastChildRow ? "task-lineage-end" : "task-lineage-middle",
			);
		}

		i = lastChildRow - 1;
	}

	return decorated;
}

export function buildTaskLayoutGroups(rowsSpec, index, spacerId = "spacer") {
	const meta = buildTaskLayoutMeta(rowsSpec, index, spacerId);
	const groups = [];

	for (let i = 0; i < (rowsSpec || []).length; i += 1) {
		const rowMeta = meta[i] || { rowClasses: [] };

		if (rowMeta.rowClasses.includes("task-lineage-start")) {
			const rowIndexes = [i];
			let j = i + 1;
			while (j < meta.length && meta[j]?.rowClasses?.includes("task-lineage-row")) {
				rowIndexes.push(j);
				if (meta[j].rowClasses.includes("task-lineage-end")) break;
				j += 1;
			}
			groups.push({
				type: "lineage",
				rowIndexes,
			});
			i = rowIndexes[rowIndexes.length - 1];
			continue;
		}

		groups.push({
			type: "single",
			rowIndexes: [i],
		});
	}

	return { meta, groups };
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
