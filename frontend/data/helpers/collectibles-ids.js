

window._curryFullId = (g, type, flavor) => window._fullId(g, "curries", type, flavor);
window._sandwichFullId = (g, type, tier) => window._fullId(g, "sandwiches", type, tier);
window._stickerFullId = (g, type, form) => window._fullId(g, "stickers", type, form);
window._medalFullId = (g, type, medal) => window._fullId(g, "medals", type, medal);

/**
 * Generic seeder for flat collectibles lists:
 * - bucketKey: "curry" | "sandwich" | "sticker" (the DATA collection key)
 * - bucketId:  "curries" | "sandwiches" | "stickers" (the id namespace segment)
 * - baseSlugFrom: (item) => string (what to slug for the base id)
 * - formSlugFrom: (form) => string (what to slug for the form id)
 *
 * Output:
 * item.id  => <game>:<bucketId>:<baseSlug>
 * form.id  => <game>:<bucketId>:<baseSlug>:<formSlug>
 */
window.defineCollectiblesMany = function ({
	gameKeys,
	bucketKey,
	bucketId,
	builder,
	baseSlugFrom,
	formSlugFrom,
	ensureLabel = false,
}) {
	const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

	window.DATA = window.DATA || {};
	window.DATA[bucketKey] = window.DATA[bucketKey] || {};

	for (const gameKey of keys) {
		const built = builder(gameKey, { gameKey });
		const list = Array.isArray(built) ? built : [];

		const normalized = list.map((it) => {
			if (!it || typeof it !== "object") return it;

			const out = { ...it };

			// --- base id ---
			const baseStr = baseSlugFrom ? baseSlugFrom(out) : (out.id ?? out.name ?? out.label);
			const baseSlug = window._slugify(baseStr);
			out.id = window._fullId(gameKey, bucketId, baseSlug);

			// Ensure label (optional)
			if (ensureLabel && !out.label && out.name) out.label = out.name;

			// --- forms ---
			if (Array.isArray(out.forms)) {
				out.forms = out.forms.map((f) => {
					const fObj = (typeof f === "string") ? { name: f } : (f && typeof f === "object" ? { ...f } : null);
					if (!fObj) return f;

					const formStr = formSlugFrom ? formSlugFrom(fObj) : fObj.name;
					const formSlug = window._slugify(formStr);

					fObj.id = window._fullId(gameKey, bucketId, baseSlug, formSlug);
					return fObj;
				});
			}

			return out;
		});

		window.DATA[bucketKey][gameKey] = normalized;
	}
};

window.defineCurryMany = function (gameKeys, builder) {
	return window.defineCollectiblesMany({
		gameKeys,
		bucketKey: "curry",
		bucketId: "curries",
		builder,
		baseSlugFrom: (it) => it.id,
		formSlugFrom: (f) => f.name,
	});
};

window.defineSandwichMany = function (gameKeys, builder) {
	return window.defineCollectiblesMany({
		gameKeys,
		bucketKey: "sandwich",
		bucketId: "sandwiches",
		builder,
		baseSlugFrom: (it) => it.name || it.label || it.id,
		formSlugFrom: (f) => f.name,
		ensureLabel: true,
	});
};

window.defineStickersMany = function (gameKeys, builder) {
	return window.defineCollectiblesMany({
		gameKeys,
		bucketKey: "sticker",
		bucketId: "stickers",
		builder,
		baseSlugFrom: (it) => it.label || it.name || it.id,
		formSlugFrom: (f) => f.name,
	});
};

window.defineMedalsMany = function (gameKeys, builder) {
	const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

	window.DATA = window.DATA || {};
	window.DATA.medals = window.DATA.medals || {};

	for (const gameKey of keys) {
		const built = builder(gameKey, { gameKey }) || { sections: [] };

		// NEW: rewrite ids + auto-assign imgs
		window.DATA.medals[gameKey] = _finalizeMedalsIdsAndImgs(gameKey, built);
	}
};


// Slugify medal names into asset keys, BUT keep "+" (you asked for this).
// Examples:
// "First Step"      -> "first-step"
// "A+ Rank"         -> "a+-rank"
// "Rock & Roll"     -> "rock-and-roll"

// Map a single medal item:
// - DO NOT overwrite item.id (keep numeric authoring id)
// - derive image key from name slug (or allow override via _imgKey)
window.mapMedalItem = function mapMedalItem(sectionId, item) {
	const out = { ...item };

	const nameSlug = window._slugify(out.name, { keepPlus: true });

	// Keep numeric id; optionally allow separate stable slug storage if you want it
	// (doesn't affect ids used for saving/checking)
	if (out.idSlug == null) out.idSlug = nameSlug;

	// Allow authoring override: _imgKey: "custom-file-name"
	const imgKey =
		(typeof out._imgKey === "string" && out._imgKey.trim())
			? out._imgKey.trim()
			: nameSlug;

	out._imgKey = imgKey;

	// Default img from slug; keep any explicit img if author provided one
	out.img = out.img ?? (() => window._medal(sectionId, imgKey));

	return out;
};

// Build medals object from simple SECTIONS + ITEMS_BY_SECTION
window.buildMedalsFor = function buildMedalsFor(SECTIONS, ITEMS_BY_SECTION) {
	return {
		sections: (SECTIONS || []).map((s) => ({
			// keep label/type/etc
			...s,
			items: (ITEMS_BY_SECTION?.[s.id] || []).map((it) => mapMedalItem(s.id, it)),
		})),
	};
};

function _finalizeMedalsIdsAndImgs(gameKey, medalsObj) {
	if (!medalsObj || !Array.isArray(medalsObj.sections)) return medalsObj;

	for (const sec of medalsObj.sections) {
		if (!sec || !Array.isArray(sec.items)) continue;

		// Folder/type for medal image paths: prefer explicit sec.type, fallback to sec.id
		const folder = String(sec.type || sec.id || "").trim();

		for (const it of sec.items) {
			if (!it) continue;

			// --- 1) Canonical IDs (numeric authoring -> full ids) ----------
			const rawId = it._rawId ?? it.id;
			it._rawId = rawId;

			const idNum =
				(rawId != null && rawId !== "" && !isNaN(Number(rawId)))
					? Number(rawId)
					: rawId;

			// If it's numeric-ish, rewrite to canonical
			if (typeof idNum === "number") {
				it.id = window._medalFullId(gameKey, sec.id, idNum);
			} else {
				// Fallback legacy: still namespace it so it's stable + unique
				// (and avoids collisions if old ids are reused)
				const legacy = String(idNum);
				it.id = `${String(gameKey)}:${String(sec.id)}:${legacy}`;
			}

			// --- 2) Auto image assignment (from NAME slug) -----------------
			// Allow authoring-time override via it._imgKey (like fashion)
			const rawImgKey = it._imgKey;
			const slug =
				(typeof rawImgKey === "string" && rawImgKey.trim())
					? rawImgKey.trim()
					: window._medalSlug(it.name);

			it._imgKey = slug;

			// Only assign if missing (lets you override per medal)
			if (!it.img && folder) {
				it.img = () => window._medal(folder, slug);
			}
		}
	}

	return medalsObj;
}

