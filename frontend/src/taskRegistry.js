// src/taskRegistry.js
export function buildSeedTaskRegistry() {
	const reg = new Map(); // taskId -> { sectionId, parentIds: [] }

	const tasksRoot = window.DATA?.tasks || {};
	for (const [sectionId, arr] of Object.entries(tasksRoot)) {
		const list = Array.isArray(arr) ? arr : [];

		(function walk(nodes, parentStack) {
			for (const t of nodes || []) {
				if (!t || typeof t !== "object" || !t.id) continue;
				const id = String(t.id);

				// Store section + parent chain (parent chain is optional but useful later)
				if (!reg.has(id)) {
					reg.set(id, { sectionId, parentIds: parentStack.slice(), type: t.type || null });
				}

				if (Array.isArray(t.children) && t.children.length) {
					parentStack.push(id);
					walk(t.children, parentStack);
					parentStack.pop();
				}
			}
		})(list, []);
	}

	window.PPGC = window.PPGC || {};
	window.PPGC._seedTaskRegistry = reg;
	return reg;
}

export function getSeedTaskRegistry() {
	window.PPGC = window.PPGC || {};
	return window.PPGC._seedTaskRegistry || buildSeedTaskRegistry();
}

/**
 * Build (and cache) a Map<sectionId, string[]> of seed task IDs.
 *
 * Used for fast percentage computation in summary views (Home/Gen/Game),
 * without bootstrapping full task trees into store.tasksStore.
 */
export function buildSeedTaskIdsBySection() {
	const reg = getSeedTaskRegistry();
	const bySection = new Map();
	for (const [taskId, meta] of reg.entries()) {
		const secId = meta?.sectionId;
		if (!secId) continue;
		let arr = bySection.get(secId);
		if (!arr) {
			arr = [];
			bySection.set(secId, arr);
		}
		arr.push(String(taskId));
	}

	window.PPGC = window.PPGC || {};
	window.PPGC._seedTaskIdsBySection = bySection;
	return bySection;
}

export function getSeedTaskIdsBySection() {
	window.PPGC = window.PPGC || {};
	return window.PPGC._seedTaskIdsBySection || buildSeedTaskIdsBySection();
}
