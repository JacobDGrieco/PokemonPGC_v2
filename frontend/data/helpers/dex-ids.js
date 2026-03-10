window._parseDexKey = function _parseDexKey(dexGameKey) {
	const raw = String(dexGameKey || "").trim().toLowerCase();
	if (!raw) return { game: "", category: "" };

	// National dex keys end with "-national"
	if (raw.endsWith("-national")) {
		return { game: raw.replace(/-national$/, ""), category: "national" };
	}

	// Regional sub-dex keys: "<game>-<region>"
	// (x-central, x-coastal, x-mountain, sun-alola, sun-melemele, etc.)
	const idx = raw.indexOf("-");
	if (idx > 0) {
		const game = raw.slice(0, idx);
		const category = raw.slice(idx + 1);
		return { game, category };
	}

	// Plain game key => regional
	return { game: raw, category: "regional" };
};

/**
 * Build the new dex ID:
 * <game>:dex:<category>:<id>[:<formId>]
 *
 * Notes:
 * - id is required (this is the dex entry's normal `id` field).
 * - formId is optional and should already be normalized (or a simple slug).
 */
window._makeDexId = function _makeDexId(dexGameKey, id, formId) {
	const { game, category } = window._parseDexKey(dexGameKey);
	const n = Number(id);

	// ✅ allow 0 (BW starts at 0), but still reject NaN / negatives
	if (!game || !Number.isFinite(n) || n < 0) return "";

	const base = `${game}:dex:${category}:${pad4(n)}`;
	return formId ? `${base}:${String(formId)}` : base;
};

/**
 * Decorate a dex list so:
 * - entry.id becomes the new string ID (based on *entry.id*)
 * - entry.localId preserves the old numeric entry.id (regional/national index)
 */
window._decorateDexListIds = function _decorateDexListIds(dexGameKey, dexList) {
	const arr = Array.isArray(dexList) ? dexList : [];
	return arr.map((m, i) => {
		if (!m || typeof m !== "object") return m;

		const localId = Number.isFinite(Number(m.localId)) ? m.localId : m.id;
		const newId = window._makeDexId(dexGameKey, localId);

		return { ...m, localId, id: newId, };
	});
};

/**
 * Extract the numeric “dex number” from a dex entry id.
 * - If id is already a number -> returns it
 * - If id is "game:dex:category:123" -> returns 123
 * - Falls back to localId if provided
 */
window._dexIdNumber = function _dexIdNumber(id, localId) {
	if (Number.isFinite(Number(localId))) return Number(localId);

	if (typeof id === "number" && Number.isFinite(id)) return id;

	const s = String(id || "");
	const m = s.match(/:dex:[^:]+:(\d+)(?::|$)/i);
	if (m) return Number(m[1]);

	const n = Number(s);
	return Number.isFinite(n) ? n : null;
};