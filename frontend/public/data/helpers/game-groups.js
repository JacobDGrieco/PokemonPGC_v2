
const GAME_GROUPS = {
	gen1: { gen: 1, keys: ["red", "green", "blue", "yellow"] },
	gen2: { gen: 2, keys: ["gold", "silver", "crystal"] },
	gen3: { gen: 3, keys: ["ruby-national", "ruby", "sapphire-national", "sapphire", "emerald-national", "emerald"] },
	gen4: { gen: 4, keys: ["diamond-national", "diamond", "pearl-national", "pearl", "platinum-national", "platinum", "heartgold-national", "heartgold", "soulsilver-national", "soulsilver"] },
	gen5: { gen: 5, keys: ["black-national", "black", "white-national", "white", "black2-national", "black2", "white2-national", "white2"] },
	gen6: { gen: 6, keys: ["x-national", "x-central", "x-coastal", "x-mountain", "y-national", "y-central", "y-coastal", "y-mountain", "omegaruby-national", "omegaruby", "alphasapphire-national", "alphasapphire"] },
	gen7: { gen: 7, keys: ["sun-alola", "sun-melemele", "sun-akala", "sun-ulaula", "sun-poni", "moon-alola", "moon-melemele", "moon-akala", "moon-ulaula", "moon-poni", "ultrasun-alola", "ultrasun-melemele", "ultrasun-akala", "ultrasun-ulaula", "ultrasun-poni", "ultramoon-alola", "ultramoon-melemele", "ultramoon-akala", "ultramoon-ulaula", "ultramoon-poni"] },

	rgby: { gen: 1, keys: ["red", "green", "blue", "yellow"] },
	gsc: { gen: 2, keys: ["gold", "silver", "crystal"] },
	rse: { gen: 3, keys: ["ruby-national", "ruby", "sapphire-national", "sapphire", "emerald-national", "emerald"] },
	frlg: { gen: 3, keys: ["firered-national", "firered", "leafgreen-national", "leafgreen"] },
	dp: { gen: 4, keys: ["diamond-national", "diamond", "pearl-national", "pearl"] },
	pl: { gen: 4, keys: ["platinum-national", "platinum"] },
	dppl: { gen: 4, keys: ["diamond-national", "diamond", "pearl-national", "pearl", "platinum-national", "platinum"] },
	hgss: { gen: 4, keys: ["heartgold-national", "heartgold", "soulsilver-national", "soulsilver"] },
	bw: { gen: 5, keys: ["black-national", "black", "white-national", "white"] },
	bw2: { gen: 5, keys: ["black2-national", "black2", "white2-national", "white2"] },
	xy: { gen: 6, keys: ["x-national", "x-central", "x-coastal", "x-mountain", "y-national", "y-central", "y-coastal", "y-mountain"] },
	oras: { gen: 6, keys: ["omegaruby-national", "omegaruby", "alphasapphire-national", "alphasapphire"] },
	sm: { gen: 7, keys: ["sun-alola", "sun-melemele", "sun-akala", "sun-ulaula", "sun-poni", "moon-alola", "moon-melemele", "moon-akala", "moon-ulaula", "moon-poni"] },
	usum: { gen: 7, keys: ["ultrasun-alola", "ultrasun-melemele", "ultrasun-akala", "ultrasun-ulaula", "ultrasun-poni", "ultramoon-alola", "ultramoon-melemele", "ultramoon-akala", "ultramoon-ulaula", "ultramoon-poni"] },
	lgpe: { gen: "7_2", keys: ["letsgopikachu", "letsgoeevee"] },
	swsh: { gen: 8, keys: ["sword", "swordioa", "swordct", "shield", "shieldioa", "shieldct"] },
	bdsp: { gen: "8_2", keys: ["brilliantdiamond-national", "brilliantdiamond", "shiningpearl-national", "shiningpearl"] },
	la: { gen: "8_2", keys: ["legendsarceus"] },
	scvi: { gen: 9, keys: ["scarlet", "scarlettm", "scarletid", "violet", "violettm", "violetid"] },
	lza: { gen: "9_2", keys: ["legendsza", "legendszamd"] },
};
window.gameSearch = function (...tokens) {
	const out = {};
	const flat = tokens.flat();

	for (const t of flat) {
		if (!t) continue;

		if (Array.isArray(t) && t.length >= 2) {
			const k = String(t[0]);
			out[k] = t[1];
			continue;
		}

		const token = String(t);
		const g = GAME_GROUPS[token];
		if (g) {
			for (const k of g.keys) out[k] = g.gen;
			continue;
		}
	}

	return out;
};
window.formSearch = function (...tokens) {
	// tokens can be strings (group keys or explicit gameKeys) or arrays
	const out = [];
	for (const t of tokens.flat()) {
		if (Array.isArray(t)) {
			out.push(...t);
		} else if (typeof t === "string" && GAME_GROUPS[t].keys) {
			out.push(...GAME_GROUPS[t].keys);
		} else if (typeof t === "string") {
			// allow passing explicit game keys
			out.push(t);
		}
	}
	// de-dupe, preserve order
	return [...new Set(out)];
};
window.normalizeGenKeyNoPrefix = function (genKey) {
	if (genKey == null) return null;

	// If it's already numeric (6, 7.5, etc)
	if (typeof genKey === "number") return genKey;

	const raw = String(genKey).trim();

	// "gen6" -> "6", "gen7_2" -> "7_2"
	const stripped = raw.replace(/^gen/i, "");

	// Preserve special tokens
	if (stripped === "home") return "home";

	// If it's like "7_2" / "8_2" / "9_2", keep it as a string (your helpers support this)
	if (stripped.includes("_")) return stripped;

	// Otherwise turn "6" into 6
	const n = Number(stripped);
	return Number.isFinite(n) ? n : stripped;
};
window.inferGenFromGameKey = function (gameKey) {
	const gk = String(gameKey || "").trim();
	if (!gk) return null;

	// Preferred: use the GAME_GROUPS map you already have in helpers.js
	// It’s not exported, but in your build it’s in the same runtime scope as helpers.
	// If for any reason it isn't accessible here, fallback to window.DATA scanning.
	try {
		// Match exact game keys (including "-national" etc.)
		if (typeof GAME_GROUPS === "object" && GAME_GROUPS) {
			for (const group of Object.values(GAME_GROUPS)) {
				if (!group || !Array.isArray(group.keys)) continue;
				if (group.keys.includes(gk)) return group.gen; // returns 6, 7, 7.5, etc.
			}
		}
	} catch { }

	// Fallback: scan window.DATA.games by tab key (returns something like "gen6", "gen7_2", etc.)
	try {
		const tabKey =
			(window.DATA?.tabs || [])
				.map(t => t.key)
				.find(tk => (window.DATA?.games?.[tk] || []).some(g => g.key === gk)) || null;

		return normalizeGenKeyNoPrefix(tabKey);
	} catch { }

	return null;
};