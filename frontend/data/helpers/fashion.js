window._fashionSlug = function _fashionSlug(s) {
	return String(s ?? "")
		.trim()
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/['’]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
};
window._fashionFullId = function (gameKey, categoryId, itemId, formId) {
	const gk = String(gameKey || "");
	const cat = String(categoryId || "");
	const item = pad3(itemId);

	if (formId === undefined || formId === null || formId === "") {
		return `${gk}:${cat}:${item}`;
	}
	return `${gk}:fashion:${cat}:${item}:${pad3(formId)}`;
};
window.buildFashionFor = function buildFashionFor(CATEGORIES, ITEMS_BY_CATEGORY) {
	return {
		categories: (CATEGORIES || []).map((c) => ({
			id: c.id,
			label: c.label,
			items: (ITEMS_BY_CATEGORY?.[c.id] || []).map((it) => ({
				...it,
				forms: Array.isArray(it.forms) ? it.forms.map((f) => ({ ...f })) : it.forms,
			})),
		})),
	};
};
/**
 * Resolve the folder prefix used by fashion assets for a given gameKey.
 * (Add more mappings as you add more fashion sets.)
 */
window._resolveFashionPrefix = function (gameKey) {
	const gk = String(gameKey || "").toLowerCase();

	// XY
	if (gk === "x" || gk === "y") return "xy";

	// default: assume gameKey is already the folder name
	return gk;
};
// Internal: normalize authoring gender => folder gender
function _fashionGenderFolder(itemGender) {
	const g = String(itemGender || "unisex").toLowerCase();
	if (g === "male" || g === "female") return g;
	// "both"/unknown -> unisex folder
	return "unisex";
}
// NEW: finalize ids + auto-assign imgs based on NAME slugs.
// - Authoring item.id can now be numeric (recommended).
// - Images are built from slug(item.name), NOT item.id.
// - If forms exist:
//    - parent img uses first form image key
//    - each form image key: `${itemSlug}-${formSlug}`
// - Full IDs:
//    item.id  => <game>:<cat>:<itemPad3>
//    form.id  => <game>:<cat>:<itemPad3>:<formPad3>
function _finalizeFashionIdsAndImgs(gameKey, fashionObj) {
	if (!fashionObj || !Array.isArray(fashionObj.categories)) return fashionObj;

	for (const cat of fashionObj.categories) {
		const categoryId = cat?.id;
		if (!categoryId || !Array.isArray(cat.items)) continue;

		for (const item of cat.items) {
			if (!item) continue;

			// --- 1) Canonical IDs (numeric authoring -> full ids) ----------
			const rawItemId = item._rawId ?? item.id;
			item._rawId = rawItemId;

			// Allow legacy string ids, but prefer numeric going forward
			const itemIdNum = (rawItemId != null && rawItemId !== "" && !isNaN(Number(rawItemId)))
				? Number(rawItemId)
				: rawItemId;

			// Only overwrite with canonical if numeric-ish
			if (typeof itemIdNum === "number") {
				item.id = window._fashionFullId(gameKey, categoryId, itemIdNum);
			} else {
				// fallback legacy: keep stable, but still prefix with game/cat
				item.id = `${String(gameKey)}:${String(categoryId)}:${String(itemIdNum)}`;
			}

			// --- 2) Auto image assignment (from NAME slugs) ----------------
			const genderFolder = _fashionGenderFolder(item.gender);
			const rawImgKey = item._imgKey;

			// If an old build ever stored "_imgKey: '1'" (or other digits), ignore it and recompute from name.
			const itemSlug =
				(typeof rawImgKey === "string" && rawImgKey.trim() && !/^\d+$/.test(rawImgKey))
					? rawImgKey.trim()
					: window._fashionSlug(item.name);

			item._imgKey = itemSlug;

			const hasForms = Array.isArray(item.forms) && item.forms.length > 0;

			if (hasForms) {
				// Ensure each form has an img; parent uses first form
				const first = item.forms[0];
				const firstName = (typeof first === "string") ? first : (first?.name ?? "");
				const firstSlug = window._fashionSlug(firstName);
				const parentImgKey = `${itemSlug}-${firstSlug}`;

				if (!item.img) {
					item.img = ({ gameKey }) => window._fashionItem(gameKey, genderFolder, categoryId, parentImgKey);
				}

				for (const f of item.forms) {
					if (!f || typeof f !== "object") continue;

					// Canonical form id
					const rawFormId = f._rawId ?? f.id;
					f._rawId = rawFormId;

					const formIdNum = (rawFormId != null && rawFormId !== "" && !isNaN(Number(rawFormId)))
						? Number(rawFormId)
						: rawFormId;

					if (typeof itemIdNum === "number" && typeof formIdNum === "number") {
						f.id = window._fashionFullId(gameKey, categoryId, itemIdNum, formIdNum);
					} else {
						// fallback legacy
						f.id = `${String(gameKey)}:${String(categoryId)}:${String(itemIdNum)}:${String(formIdNum)}`;
					}

					// Image key from item name + form name
					const formName = String(f.name ?? "");
					const formSlug = window._fashionSlug(formName);
					const imgKey = `${itemSlug}-${formSlug}`;

					if (!f.img) {
						f.img = ({ gameKey }) => window._fashionItem(gameKey, genderFolder, categoryId, imgKey);
					}
				}
			} else {
				// No forms: image is just the item slug
				if (!item.img) {
					item.img = ({ gameKey }) => window._fashionItem(gameKey, genderFolder, categoryId, itemSlug);
				}
			}
		}
	}

	return fashionObj;
}
/**
 * Seed fashion data for one or multiple gameKeys, similar to task seeding.
 *
 * builder(gameKey, ctx) should return the full fashion object for that gameKey,
 * e.g. { categories: [ {id,label,items:[...]} ] }
 */
window.defineFashionMany = function (gameKeys, builder) {
	const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

	window.DATA = window.DATA || {};
	window.DATA.fashion = window.DATA.fashion || {};

	for (const gameKey of keys) {
		const built = builder(gameKey, { gameKey });

		// NEW: rewrite ids + auto-assign imgs
		window.DATA.fashion[gameKey] = _finalizeFashionIdsAndImgs(gameKey, built);
	}
};