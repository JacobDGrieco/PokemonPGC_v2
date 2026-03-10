// history.js
// Tiny history/router helper for PPGC.
// Exposes:
//   window.PPGC.navigateTo(routeOrState, ...optionalParts)
//   window.PPGC.navigateToState(statePatch)
//
// This version fixes a regression where navigateToState was not defined.

export function initHistory({ store, renderAll }) {
	if (!store || !store.state) throw new Error("[history] initHistory requires {store, renderAll}");

	window.PPGC = window.PPGC || {};

	// ---------- Helpers ----------

	function basePath() {
		return window.location.pathname.split("#")[0].split("?")[0] || "/";
	}

	function snapshotFromState() {
		const s = store.state || {};
		return {
			level: s.level || "gen",
			genKey: s.genKey || null,
			gameKey: s.gameKey || null,
			sectionId: s.sectionId || null,
			accountTab: s.accountTab || null,
			monInfoId: typeof s.monInfoId !== "undefined" ? s.monInfoId : null,
			monInfoGameKey: s.monInfoGameKey || null,
			monInfoForm: s.monInfoForm || null,
			toolsKey: s.toolsKey || "info",
		};
	}

	function buildPrettyHashFromState(state) {
		const s = state || {};
		const lvl = s.level || "gen";

		if (lvl === "section") {
			const gen = s.genKey || "all";
			const game = s.gameKey || "all";
			const sec = s.sectionId || "";
			return `#/section/${encodeURIComponent(gen)}/${encodeURIComponent(game)}/${encodeURIComponent(sec)}`;
		}

		if (lvl === "game") {
			const gen = s.genKey || "all";
			return `#/game/${encodeURIComponent(gen)}`;
		}

		if (lvl === "account") {
			const tab = s.accountTab || "general";
			return `#/account/${encodeURIComponent(tab)}`;
		}

		if (lvl === "tools") {
			const tool = s.toolsKey || "info";
			return `#/tools/${encodeURIComponent(tool)}`;
		}

		if (lvl === "moninfo") {
			const n = s.monInfoId != null ? String(s.monInfoId) : "";
			const gPretty = s.monInfoGameKey ? monInfoPrettyGameSlug(String(s.monInfoGameKey)) : "";
			const f = s.monInfoForm ? encodeURIComponent(String(s.monInfoForm)) : "";

			if (!n) return `#/tools/info`;

			const nEnc = encodeURIComponent(n);
			const gEnc = gPretty ? encodeURIComponent(gPretty) : "";

			if (gEnc && f) return `#/tools/info/${nEnc}/${gEnc}/${f}`;
			if (gEnc) return `#/tools/info/${nEnc}/${gEnc}`;
			return `#/tools/info/${nEnc}`;
		}

		// "gen" or unknown -> empty hash
		return "";
	}

	function applyUrlToStateFromLocation() {
		const hash = (window.location.hash || "").replace(/^#/, ""); // "/section/.."
		const parts = hash.split("/").filter(Boolean); // ["section", "gen", "game", "sec"]

		const route = parts[0] || "";

		// Defaults
		const next = {
			level: "gen",
			genKey: null,
			gameKey: null,
			sectionId: null,
			accountTab: null,
			monInfoId: null,
			monInfoGameKey: null,
			monInfoForm: null,
		};

		if (route === "section") {
			next.level = "section";
			next.genKey = parts[1] ? decodeURIComponent(parts[1]) : null;
			next.gameKey = parts[2] ? decodeURIComponent(parts[2]) : null;
			next.sectionId = parts[3] ? decodeURIComponent(parts[3]) : null;
		} else if (route === "game") {
			next.level = "game";
			next.genKey = parts[1] ? decodeURIComponent(parts[1]) : null;
		} else if (route === "account") {
			next.level = "account";
			next.accountTab = parts[1] ? decodeURIComponent(parts[1]) : "general";
		} else if (route === "tools") {
			// #/tools/<tool>
			// #/tools/info/<natiId>/<gameSlug>/<formKey?>
			const tool = parts[1] ? decodeURIComponent(parts[1]) : "info";
			const n = parts[2] ? decodeURIComponent(parts[2]) : null;
			const gSlug = parts[3] ? decodeURIComponent(parts[3]) : null;
			const f = parts[4] ? decodeURIComponent(parts[4]) : null;

			if (!n) {
				next.level = "tools";
				next.toolsKey = tool || "info";
			} else if ((tool || "info") === "info") {
				next.level = "moninfo";
				next.toolsKey = "info";
				next.monInfoId = isNaN(Number(n)) ? n : Number(n);
				next.monInfoGameKey = gSlug ? monInfoGameKeyFromPrettySlug(gSlug) : null;
				next.monInfoForm = f || null;
			} else {
				// Unknown tool with extra path → just land on tool root
				next.level = "tools";
				next.toolsKey = tool || "info";
			}
		}

		Object.assign(store.state, next);
	}

	// --- Mon Info URL "pretty" game segment helpers ---
	function monInfoPrettyGameSlug(gameKey) {
		const gk = String(gameKey || "").trim().toLowerCase();
		if (!gk) return "";

		if (gk.startsWith("legendsza")) return "legendsza";
		if (gk.startsWith("scarlet") || gk.startsWith("violet")) return "scarlet-violet";
		if (gk.startsWith("legendsarceus")) return "legendsarceus";
		if (gk.startsWith("brilliantdiamond") || gk.startsWith("shiningpearl")) return "brilliantdiamond-shiningpearl";
		if (gk.startsWith("sword") || gk.startsWith("shield")) return "sword-shield";
		if (gk.startsWith("letsgopikachu") || gk.startsWith("letsgoeevee")) return "letsgopikachu-letsgoeevee";
		if (gk.startsWith("ultrasun") || gk.startsWith("ultramoon")) return "ultrasun-ultramoon";
		if (gk.startsWith("sun") || gk.startsWith("moon")) return "sun-moon";
		if (gk.startsWith("omegaruby") || gk.startsWith("alphasapphire")) return "omegaruby-alphasapphire";
		if (gk.startsWith("black2") || gk.startsWith("white2")) return "black2-white2";
		if (gk.startsWith("black") || gk.startsWith("white")) return "black-white";
		if (gk.startsWith("heartgold") || gk.startsWith("soulsilver")) return "heartgold-soulsilver";
		if (gk.startsWith("platinum")) return "platinum";
		if (gk.startsWith("diamond") || gk.startsWith("pearl")) return "diamond-pearl";
		if (gk.startsWith("firered") || gk.startsWith("leafgreen")) return "firered-leafgreen";
		if (gk.startsWith("emerald")) return "emerald";
		if (gk.startsWith("ruby") || gk.startsWith("sapphire")) return "ruby-sapphire";
		if (gk.startsWith("crystal")) return "crystal";
		if (gk.startsWith("silver")) return "silver";
		if (gk.startsWith("gold")) return "gold";
		if (gk.startsWith("yellow")) return "yellow";
		if (gk.startsWith("green")) return "green";
		if (gk.startsWith("red") || gk.startsWith("blue")) return "red-blue";
		if (gk.startsWith("x") || gk.startsWith("y")) return "x-y";

		return gk;
	}

	function monInfoGameKeyFromPrettySlug(slug) {
		const s = String(slug || "").trim().toLowerCase();
		if (!s) return null;

		if (s === "legendsza") return "legendsza";
		if (s === "scarlet-violet") return "scarlet";
		if (s === "legendsarceus") return "legendsarceus";
		if (s === "brilliantdiamond-shiningpearl") return "brilliantdiamond-national";
		if (s === "sword-shield") return "sword";
		if (s === "letsgopikachu-letsgoeevee") return "letsgopikachu";
		if (s === "ultrasun-ultramoon") return "ultrasun-alola";
		if (s === "sun-moon") return "sun-alola";
		if (s === "omegaruby-alphasapphire") return "omegaruby-national";
		if (s === "black2-white2") return "black2-national";
		if (s === "black-white") return "black-national";
		if (s === "heartgold-soulsilver") return "heartgold-national";
		if (s === "platinum") return "platinum-national";
		if (s === "diamond-pearl") return "diamond-national";
		if (s === "firered-leafgreen") return "firered-national";
		if (s === "emerald") return "emerald-national";
		if (s === "ruby-sapphire") return "ruby-national";
		if (s === "crystal") return "crystal";
		if (s === "silver") return "silver";
		if (s === "gold") return "gold";
		if (s === "yellow") return "yellow";
		if (s === "green") return "green";
		if (s === "red-blue") return "red";
		if (s === "x-y") return "x-national";

		return s;
	}

	// ---------- Public navigation API ----------

	function navigateToState(patch = {}, { replace = false } = {}) {
		Object.assign(store.state, patch);

		const url = basePath() + buildPrettyHashFromState(store.state);
		const snap = snapshotFromState();

		try {
			if (replace) history.replaceState(snap, "", url);
			else history.pushState(snap, "", url);
		} catch (e) {
			// If pushState fails (rare), fall back to hash assignment
			window.location.hash = buildPrettyHashFromState(store.state).replace(/^#/, "");
		}

		renderAll();
		if (typeof store.save === "function") store.save();
	}

	// Named routes convenience:
	//   navigateTo("account", "general")
	//   navigateTo("section", genKey, gameKey, sectionId)
	//   navigateTo("moninfo", natiId, gameKey?, formKey?)
	function navigateTo(route, a, b, c, d) {
		if (!route) route = "home";

		if (route === "home") {
			return navigateToState({ level: store.state.level || "gen" }, { replace: false });
		}

		if (route === "account") {
			return navigateToState({
				level: "account",
				genKey: null,
				gameKey: null,
				sectionId: null,
				accountTab: a || "general",
				monInfoId: null,
				monInfoGameKey: null,
				monInfoForm: null,
			});
		}

		if (route === "game") {
			return navigateToState({
				level: "game",
				genKey: a || null,
				gameKey: null,
				sectionId: null,
				accountTab: null,
				monInfoId: null,
				monInfoGameKey: null,
				monInfoForm: null,
			});
		}

		if (route === "section") {
			return navigateToState({
				level: "section",
				genKey: a || null,
				gameKey: b || null,
				sectionId: c || null,
				accountTab: null,
				monInfoId: null,
				monInfoGameKey: null,
				monInfoForm: null,
			});
		}

		if (route === "moninfo" || route === "info") {
			const n = a ?? null;
			const g = b ?? null;
			const f = c ?? null;

			if (n == null || n === "") {
				return navigateToState({
					level: "tools",
					toolsKey: "info",
					genKey: null,
					gameKey: null,
					sectionId: null,
					accountTab: null,
					monInfoId: null,
					monInfoGameKey: null,
					monInfoForm: null,
				});
			}

			return navigateToState({
				level: "moninfo",
				genKey: null,
				gameKey: null,
				sectionId: null,
				accountTab: null,
				monInfoId: n,
				monInfoGameKey: g,
				monInfoForm: f,
			});
		}

		console.warn("[history] unknown route:", route);
		return navigateTo("home");
	}

	// ---------- Back/Forward + direct hash edits ----------

	window.addEventListener("popstate", (event) => {
		const snap = event.state;

		if (snap && typeof snap === "object") {
			Object.assign(store.state, {
				level: snap.level || "gen",
				genKey: snap.genKey || null,
				gameKey: snap.gameKey || null,
				sectionId: snap.sectionId || null,
				accountTab: snap.accountTab || null,
				monInfoId: typeof snap.monInfoId !== "undefined" ? snap.monInfoId : null,
				monInfoGameKey: snap.monInfoGameKey || null,
				monInfoForm: snap.monInfoForm || null,
			});
		} else {
			applyUrlToStateFromLocation();
		}

		renderAll();
		if (typeof store.save === "function") store.save();
	});

	window.addEventListener("hashchange", () => {
		applyUrlToStateFromLocation();
		const snap = snapshotFromState();
		try {
			history.replaceState(snap, "", window.location.href);
		} catch { }
		renderAll();
		if (typeof store.save === "function") store.save();
	});

	// ---------- Initialize from URL on first load ----------

	applyUrlToStateFromLocation();
	try {
		history.replaceState(snapshotFromState(), "", window.location.href);
	} catch { }

	// ---------- Expose on window.PPGC immediately ----------

	window.PPGC.navigateTo = navigateTo;
	window.PPGC.navigateToState = navigateToState;
	window.PPGC._applyUrlToStateFromLocation = applyUrlToStateFromLocation;
}
