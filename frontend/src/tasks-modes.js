export function _clampInt(n, min, max) {
	const x = Number(n);
	if (!Number.isFinite(x)) return min;
	return Math.max(min, Math.min(max, Math.trunc(x)));
}

export function getTierMetaForTask(t) {
	if (!t) return { mode: "number", values: [], steps: 0 };
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
		}
	};

	raw.forEach(push);

	const meta =
		hasStr && !hasNum
			? { mode: "label", values: labels, steps: labels.length }
			: { mode: "number", values: nums, steps: nums.length };

	t._tierMeta = meta;
	t._normalizedTiers = meta.mode === "number" ? meta.values : [];
	return meta;
}

export function getNormalizedTiersForTask(t) {
	const meta = getTierMetaForTask(t);
	return meta.mode === "number" ? meta.values : [];
}

export function getTierSteps(t) {
	return getTierMetaForTask(t).steps;
}

export function describeTierSequence(nums) {
	const seq = (Array.isArray(nums) ? nums : []).filter((n) => typeof n === "number" && Number.isFinite(n));
	const n = seq.length;
	if (!n) return "";
	if (n === 1) return String(seq[0]);
	const diffs = [];
	for (let i = 1; i < n; i++) diffs.push(seq[i] - seq[i - 1]);
	const allIncreasing = diffs.every((d) => d > 0);
	const firstStep = diffs[0];
	const sameStep = diffs.every((d) => d === firstStep);
	const first = seq[0];
	const last = seq[n - 1];
	if (allIncreasing && sameStep) {
		if (firstStep === 1) return `(From ${first} to ${last})`;
		return `(${first}→${last}, every ${firstStep})`;
	}
	if (n <= 12) return seq.join(" · ");
	const head = seq.slice(0, 3).join(" · ");
	const tail = seq.slice(-2).join(" · ");
	return `${head} · … · ${tail}`;
}

export function formatTierTooltip(t) {
	const raw = Array.isArray(t?.tiers) ? t.tiers : null;
	const meta = getTierMetaForTask(t);
	if (meta.mode === "label") {
		const list = meta.values || [];
		if (!list.length) return "";
		if (list.length <= 12) return list.join(" · ");
		return `${list.slice(0, 3).join(" · ")} · … · ${list.slice(-2).join(" · ")}`;
	}
	if (raw && raw.some((v) => Array.isArray(v))) {
		const parts = [];
		for (const v of raw) {
			if (Array.isArray(v)) parts.push(describeTierSequence(v) || v.join(" · "));
			else if (typeof v === "number" && Number.isFinite(v)) parts.push(String(v));
		}
		if (parts.length) return parts.join(" · ");
	}
	const nums = getNormalizedTiersForTask(t);
	if (!nums.length) return "";
	return describeTierSequence(nums) || nums.join(" · ");
}

export function isEitherTask(t) {
	if (!t) return false;
	const src = t.eithers;
	if (!src || typeof src !== "object") return false;
	const entries = Object.entries(src).filter(([, v]) => v && typeof v === "object");
	return entries.length >= 2;
}

export function isTieredTask(t) {
	if (!t) return false;
	if (Array.isArray(t.tiers) && t.tiers.length > 0) return true;
	return t.type === "tiered" && Array.isArray(t.tiers);
}

export function forEachDescendant(task, fn) {
	const kids = Array.isArray(task.children) ? task.children : [];
	for (const ch of kids) {
		fn(ch);
		forEachDescendant(ch, fn);
	}
}

export function setDescendantsDone(task, val) {
	task.done = val;
	if (isTieredTask(task)) {
		const steps = getTierSteps(task);
		task.currentTier = val ? steps : 0;
	}
	const kids = Array.isArray(task.children) ? task.children : [];
	for (const ch of kids) setDescendantsDone(ch, val);
}

export function getEitherChoice(taskId) {
	const store = window.PPGC?._storeRef || window.store;
	const m = store?.taskChoiceById;
	if (!m) return null;
	if (m instanceof Map) return m.get(String(taskId)) || null;
	return m[String(taskId)] || null;
}

export function setEitherChoice(taskId, sideOrNull) {
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

export function eitherSyncView(task, optionKey) {
	const opt = optionKey == null ? null : (task?.eithers || {})[String(optionKey)] || (task?.eithers || {})[optionKey];
	const mergeSync = (a, b) => {
		const out = [];
		const seen = new Set();
		const add = (v) => {
			if (v == null) return;
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
