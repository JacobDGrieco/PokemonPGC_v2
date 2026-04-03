
// Rebuild a "base game" -> (natiId -> [{gameKey,id}...]) index.
// dex.js reads window.PPGC._natDexIndex, so keeping this up-to-date avoids weird cross-dex lookups.
window._dex = function (game, type, id, form) {
	if (arguments.length === 3) {
		return { game, dexType: type, id, };
	} else {
		return { game, dexType: type, id, form: form, };
	}
};
window._regionalDex = (game, ...args) => _dex(game, "regional", ...args);
window._nationalDex = (game, ...args) => _dex(game, "national", ...args);


window.formKeyToSuffix = function (natiId, formKey) {
	if (!formKey) return null;
	const k = String(formKey).trim().toLowerCase().replace(/\s+/g, "_");

	if (k === "gigantamax") return "gi";
	if (k === "mega-x") return "mx";
	if (k === "mega-y") return "my";
	if (k === "mega-z") return "mz";

	const map = FORM_SUFFIX_OVERRIDES(Number(natiId));
	if (map) {
		if (Object.prototype.hasOwnProperty.call(map, k)) return map[k];
		for (const [rawKey, suffix] of Object.entries(map)) {
			const nk = String(rawKey).trim().toLowerCase().replace(/\s+/g, "_");
			if (nk === k) return suffix;
		}
	}

	return (k[0]) || null;
};
function FORM_SUFFIX_OVERRIDES(natiId) {
	switch (Number(natiId)) {
		case 19: return { "kantonian-female": "f", "alolan": "a" };
		case 20: return { "kantonian-female": "f", "alolan": "a" };
		case 25: return { "rock-star": "roc", "belle": "bel", "pop-star": "pop", "phd": "phd", "libre": "lib" };
		case 26: return { "kantonian-female": "f", "alolan": "a" };
		case 128: return { "paldean-(aqua-breed)": "a", "paldean-(blaze-breed)": "b", "paldean-(combat-breed)": "p" };
		case 201: return { "!": "em", "?": "qm" };
		case 215: return { "johtonian-female": "f", "hisuian-male": "h", "hisuian-female": "h-f" };
		case 351: return { "rainy": "r", "snowy": "i", "sunny": "s" };
		case 479: return { "fan": "fa", "frost": "fr", "heat": "h", "mow": "m", "wash": "w" };
		case 666:
			return {
				"archipelago-pattern": "arc",
				"continental-pattern": "con",
				"elegant-pattern": "ele",
				"garden-pattern": "gar",
				"high-plains-pattern": "hig",
				"icy-snow-pattern": "icy",
				"jungle-pattern": "jun",
				"marine-pattern": "mar",
				"meadow-pattern": "mea",
				"modern-pattern": "mod",
				"monsoon-pattern": "mon",
				"ocean-pattern": "oce",
				"polar-pattern": "pol",
				"river-pattern": "riv",
				"sandstorm-pattern": "san",
				"savanna-pattern": "sav",
				"sun-pattern": "sun",
				"tundra-pattern": "tun",
				"fancy-pattern": "fan",
				"poke-ball-pattern": "pok",
			};
		case 670: return { "mega": "em" };
		case 676:
			return {
				"heart-trim": "he",
				"star-trim": "st",
				"diamond-trim": "di",
				"debutante-trim": "de",
				"matron-trim": "ma",
				"dandy-trim": "da",
				"le-reine-trim": "la",
				"kabuki-trim": "ka",
				"pharaoh-trim": "ph",
			};
		case 710: return { "small-size": "s", "large-size": "l", "super-size": "s" };
		case 711: return { "small-size": "s", "large-size": "l", "super-size": "s" };
		case 718: return { "10%-forme": "10", "complete-form": "com", "mega": "cm", };
		case 741: return { "pa'u-style": "pa", "pom-pom-style": "po", "sensu-style": "se", };
		case 845: return { "gulping": "gu", "gorging": "go" };
		case 869:
			return {
				"vanilla-cream\nstrawberry-sweet": "va",
				"vanilla-cream\nberry-sweet": "va-b",
				"vanilla-cream\nlove-sweet": "va-l",
				"vanilla-cream\nstar-sweet": "va-s",
				"vanilla-cream\nclover-sweet": "va-c",
				"vanilla-cream\nflower-sweet": "va-f",
				"vanilla-cream\nribbon-sweet": "va-r",
				"ruby-cream\nstrawberry-sweet": "rc",
				"ruby-cream\nberry-sweet": "rc-b",
				"ruby-cream\nlove-sweet": "rc-l",
				"ruby-cream\nstar-sweet": "rc-s",
				"ruby-cream\nclover-sweet": "rc-c",
				"ruby-cream\nflower-sweet": "rc-f",
				"ruby-cream\nribbon-sweet": "rc-r",
				"matcha-cream\nstrawberry-sweet": "mac",
				"matcha-cream\nberry-sweet": "mac-b",
				"matcha-cream\nlove-sweet": "mac-l",
				"matcha-cream\nstar-sweet": "mac-s",
				"matcha-cream\nclover-sweet": "mac-c",
				"matcha-cream\nflower-sweet": "mac-f",
				"matcha-cream\nribbon-sweet": "mac-r",
				"mint-cream\nstrawberry-sweet": "mic",
				"mint-cream\nberry-sweet": "mic-b",
				"mint-cream\nlove-sweet": "mic-l",
				"mint-cream\nstar-sweet": "mic-s",
				"mint-cream\nclover-sweet": "mic-c",
				"mint-cream\nflower-sweet": "mic-f",
				"mint-cream\nribbon-sweet": "mic-r",
				"lemon-cream\nstrawberry-sweet": "lc",
				"lemon-cream\nberry-sweet": "lc-b",
				"lemon-cream\nlove-sweet": "lc-l",
				"lemon-cream\nstar-sweet": "lc-s",
				"lemon-cream\nclover-sweet": "lc-c",
				"lemon-cream\nflower-sweet": "lc-f",
				"lemon-cream\nribbon-sweet": "lc-r",
				"salted-cream\nstrawberry-sweet": "sc",
				"salted-cream\nberry-sweet": "sc-b",
				"salted-cream\nlove-sweet": "sc-l",
				"salted-cream\nstar-sweet": "sc-s",
				"salted-cream\nclover-sweet": "sc-c",
				"salted-cream\nflower-sweet": "sc-f",
				"salted-cream\nribbon-sweet": "sc-r",
				"ruby-swirl\nstrawberry-sweet": "rs",
				"ruby-swirl\nberry-sweet": "rs-b",
				"ruby-swirl\nlove-sweet": "rs-l",
				"ruby-swirl\nstar-sweet": "rs-s",
				"ruby-swirl\nclover-sweet": "rs-c",
				"ruby-swirl\nflower-sweet": "rs-f",
				"ruby-swirl\nribbon-sweet": "rs-r",
				"caramel-swirl\nstrawberry-sweet": "cs",
				"caramel-swirl\nberry-sweet": "cs-b",
				"caramel-swirl\nlove-sweet": "cs-l",
				"caramel-swirl\nstar-sweet": "cs-s",
				"caramel-swirl\nclover-sweet": "cs-c",
				"caramel-swirl\nflower-sweet": "cs-f",
				"caramel-swirl\nribbon-sweet": "cs-r",
				"rainbow-swirl\nstrawberry-sweet": "ras",
				"rainbow-swirl\nberry-sweet": "ras-b",
				"rainbow-swirl\nlove-sweet": "ras-l",
				"rainbow-swirl\nstar-sweet": "ras-s",
				"rainbow-swirl\nclover-sweet": "ras-c",
				"rainbow-swirl\nflower-sweet": "ras-f",
				"rainbow-swirl\nribbon-sweet": "ras-r",
			};
		case 890: return { "eternamax": "gi", };
		case 925: return { "family-of-three": "3", };
		case 982: return { "two-segment": "2", };
		default:
			return null;
	}
}

window._rebuildNatDexIndex = function _rebuildNatDexIndex() {
	const dexRoot = window.DATA?.dex || {};
	const index = {};

	const isNatKey = (k) => String(k || "").endsWith("-national");
	const baseOf = (k) => {
		const str = String(k || "");
		const withoutNat = isNatKey(str) ? str.replace(/-national$/, "") : str;
		return withoutNat.split("-")[0];
	};
	const normalizeDexList = (gameKey, raw) => {
		if (Array.isArray(raw)) return raw;
		if (raw && Array.isArray(raw.items)) return raw.items;
		if (raw && typeof raw === "object" && Array.isArray(raw[gameKey])) return raw[gameKey];
		return [];
	};

	for (const [gameKey, raw] of Object.entries(dexRoot)) {
		const list = normalizeDexList(gameKey, raw);
		if (!list.length) continue;

		const baseKey = baseOf(gameKey);
		if (!baseKey) continue;

		if (!index[baseKey]) index[baseKey] = new Map();
		const map = index[baseKey];

		for (const entry of list) {
			if (!entry || typeof entry !== "object") continue;
			const nat = entry.natiId;
			if (nat === undefined || nat === null) continue;

			const natKey = String(nat);
			if (!map.has(natKey)) map.set(natKey, []);
			map.get(natKey).push({ gameKey, id: entry.id });
		}
	}

	window.PPGC = window.PPGC || {};
	window.PPGC._natDexIndex = index;
};

window._registerDexData = function _registerDexData({
	baseKeys,
	dexName,
	variants,
	decorateIds = true,
	refreshNatIndex = true,
	buildDexFor,
} = {}) {
	window.DATA = window.DATA || {};
	window.DATA.dex = window.DATA.dex || {};
	window.DATA.dexNames = window.DATA.dexNames || {};

	const keys = Array.isArray(baseKeys) ? baseKeys : [];
	const vars = (Array.isArray(variants) && variants.length)
		? variants
		: [{ suffix: "", name: dexName || "Dex" }];

	if (typeof buildDexFor !== "function") {
		console.warn("[dex] _registerDexData missing buildDexFor()");
		return;
	}

	for (const baseKey of keys) {
		for (const v of vars) {
			const suffix = typeof v?.suffix === "string" ? v.suffix : "";
			const dexKey = `${baseKey}${suffix}`;

			let list = buildDexFor(baseKey, dexKey) || [];
			if (!Array.isArray(list)) list = [];

			if (decorateIds && typeof window._decorateDexListIds === "function") {
				list = window._decorateDexListIds(dexKey, list);
			}

			window.DATA.dex[dexKey] = list;

			// Name priority: variant.name -> dexName -> fallback
			const name =
				(typeof v?.name === "string" && v.name.trim())
					? v.name.trim()
					: (typeof dexName === "string" && dexName.trim())
						? dexName.trim()
						: "Dex";

			window.DATA.dexNames[dexKey] = name;
		}
	}

	if (refreshNatIndex && typeof window._rebuildNatDexIndex === "function") {
		window._rebuildNatDexIndex();
	}
};

/**
 * Register dex data for a set of game keys using a shared BASE_DEX array.
 * This fully replaces the common "buildDexFor" boilerplate in dex data files.
 *
 * What it does:
 * - For each (baseKey + variant) it:
 *   - wraps sprites so they use baseKey for sprite folders
 *   - assigns img/imgS for each mon (and its forms)
 *   - registers DATA.dex[dexKey] and DATA.dexNames[dexKey]
 *   - optionally decorates ids using _decorateDexListIds(dexKey, list)
 *
 * Params:
 * - gen: numeric or "7_2"/"8_2"/"9_2" etc (used only for sprite choosing)
 * - baseKeys: ["black","white"]
 * - dexName: name for base variant
 * - baseDex: array of dex entries (without worrying about img/imgS)
 * - variants: [{suffix:"", name:"Unova Dex"}, {suffix:"-national", name:"National Dex"}]
 *
 * Optional overrides:
 * - spriteGameKey: (baseKey, dexKey) => "black" (default baseKey)
 *     (useful if a variant should still pull sprites from base game)
 * - spriteGen: (baseKey, dexKey) => gen (default gen)
 */
window._registerDexDataFromBaseDex = function _registerDexDataFromBaseDex({
	gen,
	baseKeys,
	dexName,
	baseDex,
	variants,
	sub,                 // ✅ NEW: single-suffix mode (e.g. "-national", "-central")
	// ...
	decorateIds = true,
	refreshNatIndex = true,
	spriteGameKey,
	spriteGen,
} = {}) {
	const BASE = Array.isArray(baseDex) ? baseDex : [];
	const keys = Array.isArray(baseKeys) ? baseKeys : [];

	// ✅ If you didn't pass variants, build it from `sub` (or default to base)
	const vars =
		Array.isArray(variants) && variants.length
			? variants
			: [
				{
					suffix: typeof sub === "string" ? sub : "",
					name:
						typeof dexName === "string"
							? dexName
							: (sub === "-national" ? "National Dex" : "Dex"),
				},
			];

	function pickGen(baseKey, dexKey) {
		if (typeof spriteGen === "function") return spriteGen(baseKey, dexKey);
		return gen;
	}
	function pickGameKey(baseKey, dexKey) {
		if (typeof spriteGameKey === "function") return spriteGameKey(baseKey, dexKey);
		return baseKey;
	}

	function withSprites(entry, g, gameKey) {
		// IMPORTANT: preserve existing fields; just override img/imgS if absent OR if they
		// were authored as baseSprite(...) placeholders.
		const out = { ...entry };
		function bindGameKeyFn(fn) {
			if (typeof fn !== "function") return fn;
			return (ctx) => fn({ ...(ctx || {}), gameKey });
		}

		// If author supplied img/imgS, bind ctx.gameKey like tasks do
		if (out.img) out.img = bindGameKeyFn(out.img);
		if (out.imgS) out.imgS = bindGameKeyFn(out.imgS);

		const baseSprite = (natiId, form) =>
			window.wantAnimatedDexSprites(g)
				? window._frontSpriteAnimated(g, gameKey, natiId, form)
				: window._frontSprite(g, gameKey, natiId, form);

		const shinySprite = (natiId, form) =>
			window.wantAnimatedDexSprites(g)
				? window._frontSpriteShinyAnimated(g, gameKey, natiId, form)
				: window._frontSpriteShiny(g, gameKey, natiId, form);

		// If author didn’t supply img/imgS, set them
		if (!out.img) out.img = () => baseSprite(out.natiId);
		if (!out.imgS) out.imgS = () => shinySprite(out.natiId);

		// Forms: also ensure each form has img/imgS (don’t overwrite explicit ones)
		if (Array.isArray(out.forms)) {
			out.forms = out.forms.map((f) => {
				if (!f || typeof f !== "object") return f;
				const ff = { ...f };

				// Use:
				// - form.natiId if provided (rare)
				// - else inherit parent natiId
				const fid = ff.natiId ?? out.natiId;

				// If you ever want to support form-specific keys, allow:
				//   f.formKey or f.form to pass through to _sprite helpers (they already handle it)
				const formKey = ff.formKey ?? ff.form ?? null;

				if (ff.img) ff.img = bindGameKeyFn(ff.img);
				if (ff.imgS) ff.imgS = bindGameKeyFn(ff.imgS);

				return ff;
			});
		}

		return out;
	}

	// BuildDexFor is now internal; delegate registration to your existing helper
	window._registerDexData({
		baseKeys: keys,
		dexName,
		variants: vars,
		decorateIds,
		refreshNatIndex,
		buildDexFor: (baseKey, dexKey) => {
			const g = pickGen(baseKey, dexKey);
			const spriteKey = pickGameKey(baseKey, dexKey);

			// Map BASE_DEX -> final entries with bound sprites
			return BASE.map((m) => withSprites(m, g, spriteKey));
		},
	});
};