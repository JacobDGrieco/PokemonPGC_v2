import { ensureMonInfoLoaded } from "../../data/mon_info/_loader.js";

function _resolveMonInfoBucket(gameKey) {
	const byGame = window.DATA?.monInfo || {};
	if (byGame && byGame[gameKey]) return byGame[gameKey];

	// Fallback for combined buckets like "scarlet,violet" during transition.
	for (const [k, bucket] of Object.entries(byGame)) {
		if (typeof k === "string" && k.includes(",")) {
			const parts = k.split(",").map((s) => s.trim());
			if (parts.includes(gameKey)) return bucket;
		}
	}
	return null;
}

export async function renderMonInfoInto({
	gameKey,
	genKey,
	mon,
	formKey = null,
	titleEl = null,
	bodyEl = null,
	sourceCard = null,
} = {}) {
	// Allow page rendering: if caller didn't pass elements, fall back to modal elements.
	const targetTitleEl = titleEl || document.getElementById("monInfoTitle");
	const targetBodyEl = bodyEl || document.getElementById("monInfoBody");

	// If we still don't have a body target, nothing to do.
	if (!targetBodyEl) return;

	// If sourceCard wasn't provided, try to infer it from the invoker.
	const invokerEl = document.activeElement;
	const resolvedSourceCard =
		sourceCard ||
		invokerEl?.closest?.(".card") ||
		document.querySelector(`.card [data-open="monInfo"]`)?.closest?.(".card") ||
		null;

	// Keep legacy variable names so the existing template/wiring code can stay the same.
	const monInfoTitle = targetTitleEl;
	const monInfoBody = targetBodyEl;
	sourceCard = resolvedSourceCard;
	const natId = mon?.natiId ?? mon?.natId ?? mon?.nationalId ?? null;
	const key = natId ?? mon?.id;

	// ---------------- Forms (catalog-driven) ----------------
	const catalogForms = (natId != null && window.DATA?.formsCatalog?.[natId]) || {};

	// Allow “game variants” to match base games (swordioa -> sword, swordct -> sword, etc.)
	function _gameMatches(metaGames, gk) {
		if (!Array.isArray(metaGames) || !metaGames.length) return true; // no list => treat as global
		if (!gk) return true;

		const g = String(gk);
		const base = g.replace(/(ioa|ct|tm|id|md)$/i, "");
		return metaGames.includes(g) || metaGames.includes(base);
	}

	// IMPORTANT: do NOT sort — preserve insertion order from the catalog file
	const formOpts = [];
	for (const [fk, meta] of Object.entries(catalogForms)) {
		if (meta && Array.isArray(meta.games) && meta.games.length) {
			if (!_gameMatches(meta.games, gameKey)) continue;
		}
		formOpts.push({
			key: String(fk),
			label: meta?.label ? String(meta.label) : String(fk),
		});
	}

	const hasForms = formOpts.length > 0;

	// “Effective” form key: used for loading + applying.
	// UI stays blank unless the user explicitly chose something.
	let effectiveFormKey = formKey;
	if (!effectiveFormKey && hasForms) {
		effectiveFormKey = formOpts[0].key; // load first form silently
	}

	await ensureMonInfoLoaded(key, effectiveFormKey);


	const bucket = _resolveMonInfoBucket(gameKey);
	const info =
		(natId != null && bucket?.[natId]) ||
		// Back-compat: allow old monInfo keyed by regional dex id
		bucket?.[mon.id] ||
		null;

	const mergeInfo = (base, patch) => {
		if (!patch) return base;
		if (!base) return patch;

		// plain-object deep merge; arrays are replaced
		const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
		const out = { ...base };

		for (const k of Object.keys(patch)) {
			const pv = patch[k];
			const bv = base[k];

			if (isObj(bv) && isObj(pv)) out[k] = mergeInfo(bv, pv);
			else out[k] = pv;
		}
		return out;
	};

	// Form override bucket: window.DATA.monInfoForms[gameKey][natId][formKey]
	const formOverride =
		effectiveFormKey && natId != null
			? window.DATA?.monInfoForms?.[gameKey]?.[natId]?.[effectiveFormKey] || null
			: null;

	const effectiveInfo = mergeInfo(info, formOverride);

	const baseStats = effectiveInfo?.baseStats || mon.baseStats || null;
	const expGroup = effectiveInfo?.expGroup || mon.expGroup || null;
	const baseEggSteps = effectiveInfo?.baseEggSteps || mon.baseEggSteps || null;
	if (monInfoTitle) {
		const homeDex = window.DATA?.dex?.home || [];
		const homeEntry =
			(natId != null && homeDex.find((d) => Number(d?.natiId) === Number(natId))) ||
			homeDex.find((d) => Number(d?.natiId) === Number(mon?.natiId)) ||
			homeDex.find((d) => Number(d?.natiId) === Number(mon?.id)) ||
			null;

		monInfoTitle.textContent =
			effectiveInfo?.displayName ||
			mon?.name ||
			homeEntry?.name ||
			(natId != null ? `#${natId}` : `#${mon?.id ?? "??"}`);
	}

	const types = effectiveInfo?.types || mon.types || [];
	const abilities = effectiveInfo?.abilities || [];
	const eggGroups = effectiveInfo?.eggGroups || [];
	const evo = effectiveInfo?.evolution || null;
	const moves = effectiveInfo?.moves || {};
	const locations = effectiveInfo?.locations || [];
	const dexList = window.DATA?.dex?.[gameKey] || [];
	const homeSprite = natId != null ? `imgs/sprites/pokemon_home/base-front/${pad4(natId)}.png` : null;
	const spriteSrc = effectiveInfo?.sprites.front || homeSprite || mon.img || null;

	const renderListRow = (label, valueOrArr) => {
		if (valueOrArr == null) return "";

		// Array -> stacked column
		if (Array.isArray(valueOrArr)) {
			const cleaned = valueOrArr.filter((v) => v != null && v !== "");

			if (!cleaned.length) return "";

			const itemsHtml = cleaned
				.map((v) => `<span class="value-line">${v}</span>`)
				.join("");

			return `
		<div class="mon-info-row">
		  <span class="label">${label}</span>
		  <span class="value value--stacked">
			${itemsHtml}
		  </span>
		</div>`;
		}

		// Single value -> same as before
		const v = valueOrArr;
		if (v === "") return "";

		return `
	  <div class="mon-info-row">
		<span class="label">${label}</span>
		<span class="value">${v}</span>
	  </div>`;
	};

	const statusFromCard = (() => {
		const c = sourceCard;
		if (!c) return null;

		// dataset-based (if you have it)
		const ds =
			c.dataset?.status ||
			c.dataset?.dexStatus ||
			c.getAttribute?.("data-status") ||
			c.getAttribute?.("data-dex-status");
		if (ds) return String(ds).toLowerCase();

		// class-based (common patterns)
		const cls = c.classList;
		if (
			cls.contains("shiny-alpha") ||
			(cls.contains("shiny") && cls.contains("alpha"))
		)
			return "shinyalpha";
		if (cls.contains("alpha")) return "alpha";
		if (cls.contains("shiny")) return "shiny";
		if (cls.contains("caught")) return "caught";
		if (cls.contains("seen")) return "seen";

		return null;
	})();

	const renderStatsRadar = (statsObj) => {
		if (!statsObj) return "";

		// HP at top, then clockwise: Atk, Def, Spe, SpD, SpA
		const order = ["hp", "atk", "def", "spe", "spd", "spa"];
		const labels = ["HP", "Atk", "Def", "Spe", "SpD", "SpA"];
		const values = order.map((k) => Number(statsObj[k] ?? 0));

		const maxVal = Math.max(...values, 1);
		const total = values.reduce((sum, v) => sum + v, 0);
		const center = 50;
		const radius = 65;

		const points = values.map((v, idx) => {
			const ratio = v / maxVal;
			const r = radius * ratio;
			const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / order.length; // start at top, go clockwise
			const x = center + r * Math.cos(angle);
			const y = center + r * Math.sin(angle);
			return { x, y, r, angle, value: v, label: labels[idx] };
		});

		const polygonPoints = points
			.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
			.join(" ");

		// background rings
		const gridLevels = [0.33, 0.66, 1];
		const gridPolys = gridLevels
			.map((lvl) => {
				const pts = order
					.map((_, i) => {
						const r = radius * lvl;
						const angle = -Math.PI / 2 + (i * 2 * Math.PI) / order.length;
						const x = center + r * Math.cos(angle);
						const y = center + r * Math.sin(angle);
						return `${x.toFixed(1)},${y.toFixed(1)}`;
					})
					.join(" ");
				return `<polygon points="${pts}" class="stat-grid-ring" />`;
			})
			.join("");

		// little dots at each vertex
		const vertexDots = points
			.map(
				(p) =>
					`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(
						1
					)}" r="1.6" class="stat-vertex-dot" />`
			)
			.join("");

		// labels outside each vertex
		const labelRadius = radius + 12;
		const labelsSvg = points
			.map((p) => {
				const lx = center + labelRadius * Math.cos(p.angle);
				const ly = center + labelRadius * Math.sin(p.angle);
				return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(
					1
				)}" class="stat-label" text-anchor="middle" dominant-baseline="central">${p.label
					}</text>`;
			})
			.join("");

		// stat numbers inside the diamond along each ray
		const numbersSvg = points
			.map((p) => {
				const innerR = p.r * 0.7; // pull number inside the diamond
				const nx = center + innerR * Math.cos(p.angle);
				const ny = center + innerR * Math.sin(p.angle);
				return `<text x="${nx.toFixed(1)}" y="${ny.toFixed(
					1
				)}" class="stat-value" text-anchor="middle" dominant-baseline="central">${p.value
					}</text>`;
			})
			.join("");

		// base stat total in the center
		const totalSvg = `<text x="${center}" y="${center}" class="stat-total" text-anchor="middle" dominant-baseline="central">${total}</text>`;

		return `
	  <div class="mon-info-block mon-info-stats">
		<h3>Base Stats</h3>
		<div class="mon-info-stats-graph">
		  <svg viewBox="-25 -25 150 150" class="mon-info-stats-radar" aria-hidden="true">
			${gridPolys}
			<polygon points="${polygonPoints}" class="stat-radar-fill" />
			${vertexDots}
			${labelsSvg}
			${numbersSvg}
			${totalSvg}
		  </svg>
		</div>
	  </div>
	`;
	};

	const renderEvRadar = (evObj) => {
		if (!evObj) return "";

		// same order/labels as base stats radar to keep formatting consistent
		const order = ["hp", "atk", "def", "spe", "spd", "spa"];
		const labels = ["HP", "Atk", "Def", "Spe", "SpD", "SpA"];
		const values = order.map((k) => Number(evObj[k] ?? 0));

		// EV yields are small; keep it readable even if all zeros
		const maxVal = Math.max(...values, 1);
		const total = values.reduce((sum, v) => sum + v, 0);

		const center = 50;
		const radius = 65;

		const points = values.map((v, idx) => {
			const ratio = v / maxVal;
			const r = radius * ratio;
			const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / order.length;
			const x = center + r * Math.cos(angle);
			const y = center + r * Math.sin(angle);
			return { x, y, r, angle, value: v, label: labels[idx] };
		});

		const polygonPoints = points
			.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
			.join(" ");

		const gridLevels = [0.33, 0.66, 1];
		const gridPolys = gridLevels
			.map((lvl) => {
				const pts = order
					.map((_, i) => {
						const r = radius * lvl;
						const angle = -Math.PI / 2 + (i * 2 * Math.PI) / order.length;
						const x = center + r * Math.cos(angle);
						const y = center + r * Math.sin(angle);
						return `${x.toFixed(1)},${y.toFixed(1)}`;
					})
					.join(" ");
				return `<polygon points="${pts}" class="stat-grid-ring" />`;
			})
			.join("");

		const vertexDots = points
			.map(
				(p) =>
					`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(
						1
					)}" r="1.6" class="stat-vertex-dot" />`
			)
			.join("");

		const labelRadius = radius + 12;
		const labelsSvg = points
			.map((p) => {
				const lx = center + labelRadius * Math.cos(p.angle);
				const ly = center + labelRadius * Math.sin(p.angle);
				return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(
					1
				)}" class="stat-label" text-anchor="middle" dominant-baseline="central">${p.label
					}</text>`;
			})
			.join("");

		const numbersSvg = points
			.map((p) => {
				const innerR = p.r * 0.7;
				const nx = center + innerR * Math.cos(p.angle);
				const ny = center + innerR * Math.sin(p.angle);
				return `<text x="${nx.toFixed(1)}" y="${ny.toFixed(
					1
				)}" class="stat-value" text-anchor="middle" dominant-baseline="central">${p.value
					}</text>`;
			})
			.join("");

		const totalSvg = `<text x="${center}" y="${center}" class="stat-total" text-anchor="middle" dominant-baseline="central">${total}</text>`;

		return `
	<div class="mon-info-block mon-info-stats mon-info-ev">
	  <h3>EV Yield</h3>
	  <div class="mon-info-stats-graph">
		<svg viewBox="-25 -25 150 150" class="mon-info-stats-radar" aria-hidden="true">
		  ${gridPolys}
		  <polygon points="${polygonPoints}" class="stat-radar-fill" />
		  ${vertexDots}
		  ${labelsSvg}
		  ${numbersSvg}
		  ${totalSvg}
		</svg>
	  </div>
	</div>
  `;
	};

	let statsHtml = "";
	if (baseStats) {
		statsHtml = renderStatsRadar(baseStats);
	}

	const evObj = effectiveInfo?.evYield || null;
	if (evObj) {
		statsHtml += renderEvRadar(evObj);
	}

	// ---------------- TYPE CHART ----------------

	const TYPE_CHART = {
		Normal: { Rock: 0.5, Steel: 0.5, Ghost: 0 },
		Fire: {
			Fire: 0.5,
			Water: 0.5,
			Grass: 2,
			Ice: 2,
			Bug: 2,
			Rock: 0.5,
			Dragon: 0.5,
			Steel: 2,
		},
		Water: {
			Fire: 2,
			Water: 0.5,
			Grass: 0.5,
			Ground: 2,
			Rock: 2,
			Dragon: 0.5,
		},
		Grass: {
			Fire: 0.5,
			Water: 2,
			Grass: 0.5,
			Poison: 0.5,
			Ground: 2,
			Flying: 0.5,
			Bug: 0.5,
			Rock: 2,
			Dragon: 0.5,
			Steel: 0.5,
		},
		Electric: {
			Water: 2,
			Electric: 0.5,
			Grass: 0.5,
			Ground: 0,
			Flying: 2,
			Dragon: 0.5,
		},
		Ice: {
			Fire: 0.5,
			Water: 0.5,
			Grass: 2,
			Ground: 2,
			Flying: 2,
			Dragon: 2,
			Steel: 0.5,
			Ice: 0.5,
		},

		Fighting: {
			Normal: 2,
			Ice: 2,
			Rock: 2,
			Dark: 2,
			Steel: 2,
			Poison: 0.5,
			Flying: 0.5,
			Psychic: 0.5,
			Bug: 0.5,
			Fairy: 0.5,
			Ghost: 0,
		},
		Poison: {
			Grass: 2,
			Fairy: 2,
			Poison: 0.5,
			Ground: 0.5,
			Rock: 0.5,
			Ghost: 0.5,
			Steel: 0,
		},
		Ground: {
			Fire: 2,
			Electric: 2,
			Poison: 2,
			Rock: 2,
			Steel: 2,
			Grass: 0.5,
			Bug: 0.5,
			Flying: 0,
		},
		Flying: {
			Grass: 2,
			Fighting: 2,
			Bug: 2,
			Electric: 0.5,
			Rock: 0.5,
			Steel: 0.5,
		},
		Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
		Bug: {
			Grass: 2,
			Psychic: 2,
			Dark: 2,
			Fire: 0.5,
			Fighting: 0.5,
			Poison: 0.5,
			Flying: 0.5,
			Ghost: 0.5,
			Steel: 0.5,
			Fairy: 0.5,
		},
		Rock: {
			Fire: 2,
			Ice: 2,
			Flying: 2,
			Bug: 2,
			Fighting: 0.5,
			Ground: 0.5,
			Steel: 0.5,
		},
		Ghost: { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
		Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
		Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
		Steel: {
			Rock: 2,
			Ice: 2,
			Fairy: 2,
			Fire: 0.5,
			Water: 0.5,
			Electric: 0.5,
			Steel: 0.5,
		},
		Fairy: {
			Fighting: 2,
			Dragon: 2,
			Dark: 2,
			Fire: 0.5,
			Poison: 0.5,
			Steel: 0.5,
		},
	};

	const ALL_TYPES = [
		"Normal",
		"Fire",
		"Water",
		"Electric",
		"Grass",
		"Ice",
		"Fighting",
		"Poison",
		"Ground",
		"Flying",
		"Psychic",
		"Bug",
		"Rock",
		"Ghost",
		"Dragon",
		"Dark",
		"Steel",
		"Fairy",
	];

	const ABBR = {
		Normal: "Nor",
		Fire: "Fir",
		Water: "Wat",
		Electric: "Ele",
		Grass: "Gra",
		Ice: "Ice",
		Fighting: "Fig",
		Poison: "Poi",
		Ground: "Gro",
		Flying: "Fly",
		Psychic: "Psy",
		Bug: "Bug",
		Rock: "Roc",
		Ghost: "Gho",
		Dragon: "Dra",
		Dark: "Dar",
		Steel: "Ste",
		Fairy: "Fai",
	};

	const normalizeTypeName = (t) => {
		if (!t) return null;
		const s = String(t).toLowerCase();
		return s.charAt(0).toUpperCase() + s.slice(1);
	};

	let chartHtml = "";
	const defTypes = (types || []).map(normalizeTypeName).filter(Boolean);

	if (defTypes.length) {
		const dmg = {
			"4x": [],
			"2x": [],
			"1.5x": [],
			"1x": [],
			"0.5x": [],
			"0.25x": [],
			"0x": [],
		};

		for (const atk of ALL_TYPES) {
			let mult = 1;
			for (const def of defTypes) {
				const row = TYPE_CHART[atk] || {};
				const m = row[def] != null ? row[def] : 1;
				mult *= m;
			}

			let bucket = "1x";
			if (mult === 0) bucket = "0x";
			else if (mult === 4) bucket = "4x";
			else if (mult === 2) bucket = "2x";
			else if (mult === 1.5) bucket = "1.5x";
			else if (mult === 0.5) bucket = "0.5x";
			else if (mult === 0.25) bucket = "0.25x";

			dmg[bucket].push(atk);
		}

		const groups = [
			ALL_TYPES.slice(0, 6),
			ALL_TYPES.slice(6, 12),
			ALL_TYPES.slice(12, 18),
		];

		const tablesHtml = groups
			.map((group) => {
				const head = group
					.map(
						(t) =>
							`<th><span class="type-abbr type-${t.toLowerCase()}">${ABBR[t]
							}</span></th>`
					)
					.join("");

				const body = group
					.map((t) => {
						const m = dmg["4x"].includes(t)
							? 4
							: dmg["2x"].includes(t)
								? 2
								: dmg["1.5x"].includes(t)
									? 1.5
									: dmg["0.25x"].includes(t)
										? 0.25
										: dmg["0.5x"].includes(t)
											? 0.5
											: dmg["0x"].includes(t)
												? 0
												: 1;

						let cls = "type-fx-100";
						let label = "";

						if (m === 4) {
							cls = "type-fx-400";
							label = "4";
						} else if (m === 2) {
							cls = "type-fx-200";
							label = "2";
						} else if (m === 1.5) {
							cls = "type-fx-150";
							label = "1½";
						} else if (m === 0.5) {
							cls = "type-fx-50";
							label = "½";
						} else if (m === 0.25) {
							cls = "type-fx-25";
							label = "¼";
						} else if (m === 0) {
							cls = "type-fx-0";
							label = "0";
						}

						return `<td class="type-fx-cell ${cls}">${label}</td>`;
					})
					.join("");

				return `
		  <table class="type-table-pokedex">
			<thead><tr>${head}</tr></thead>
			<tbody><tr>${body}</tr></tbody>
		  </table>
		`;
			})
			.join("");

		chartHtml = `
	  <div class="mon-info-block mon-info-typechart">
		<h3>Type Defenses</h3>
		<div class="typechart-matrix">
		  ${tablesHtml}
		</div>
	  </div>
	`;
	}

	// -------------- Evolution (tree/branches) --------------
	//
	// Preferred shape:
	// evo.paths: [ [step, step, ...], [step, step, ...] ]
	//
	// Back-compat:
	// evo.chain:  [step, step, ...]               (linear)
	// evo.chain:  [[...],[...]]                   (branched)
	// evo.shared + evo.branches                   (shared + suffix)
	// evo.branches: [[...],[...]]                 (suffix-only, assumes shared is common prefix)
	//
	// Step: { id, name, method?, value?, level?, trigger?, sprite? }


	const findDexEntry = (step) => {
		if (!step) return null;
		return dexList.find((e) => e && String(e.id) === String(step.id)) || null;
	};

	const methodLabel = (step) => {
		if (!step) return "";
		const m = step.method != null ? String(step.method) : "";
		const v = step.value != null ? step.value : null;

		if (!m && step.level != null) return `Lv. ${step.level}`;
		if (!m) return step.trigger || "";

		if (m.toLowerCase() === "level") return v != null ? `Lv. ${v}` : "Level";
		if (v == null || v === "") return m;
		return `${m}: ${v}`;
	};

	const linkHtml = (step) => {
		const method = methodLabel(step);
		return `
		<div class="evo-link">
			<div class="evo-method">${method || ""}</div>
			<div class="evo-arrow">→</div>
		</div>
	`;
	};

	const segHtml = (step) => {
		// arrow/method + the NEXT node are wrapped together so they never split lines
		return `<div class="evo-seg">${linkHtml(step)}${stepNodeHtml(step)}</div>`;
	};

	const stepNodeHtml = (step) => {
		const entry = findDexEntry(step);

		// Resolve dex entry sprite (supports img being a function)
		const resolve = (v) => {
			try { return typeof v === "function" ? v() : v; }
			catch { return v; }
		};

		const pad4 = (v) => String(v).padStart(4, "0");

		// Pick a national id for HOME sprites:
		// - prefer step.natiId if you ever include it
		// - else use step.id (your evo steps use dex ids)
		// - else fall back to dex entry's natiId/id
		const natId =
			step?.natiId ??
			step?.natId ??
			step?.nationalId ??
			step?.id ??
			entry?.natiId ??
			entry?.natId ??
			entry?.nationalId ??
			entry?.id ??
			null;

		// Your HOME base sprites folder
		const homeSprite =
			natId != null ? `imgs/sprites/pokemon_home/base-front/${pad4(natId)}.png` : null;

		// Priority:
		// 1) step.sprite override (if evolution data explicitly supplies)
		// 2) Pokémon HOME sprite default
		// 3) dex entry img (whatever that is)
		const imgSrc = step?.sprite || homeSprite || resolve(entry?.img) || null;

		return `
	<div class="evo-node">
	  ${imgSrc ? `<img class="evo-img" src="${imgSrc}" alt="${step.name}" loading="lazy" />` : ""}
	  <div class="evo-name">${step.name}</div>
	</div>`;
	};

	// Convert whatever evo shape you have into evoPaths (array of full chains)
	const normalizeEvoToPaths = (evoObj) => {
		if (!evoObj) return [];

		// already in paths form
		if (Array.isArray(evoObj.paths) && evoObj.paths.length) {
			return evoObj.paths
				.map((p) => (Array.isArray(p) ? p.filter(Boolean) : []))
				.filter((p) => p.length);
		}

		// chain linear
		if (Array.isArray(evoObj.chain) && evoObj.chain.length) {
			if (!Array.isArray(evoObj.chain[0])) return [evoObj.chain.filter(Boolean)];
			return evoObj.chain
				.map((p) => (Array.isArray(p) ? p.filter(Boolean) : []))
				.filter((p) => p.length);
		}

		// shared + branches (your current format)
		if (Array.isArray(evoObj.shared) && Array.isArray(evoObj.branches)) {
			const shared = evoObj.shared.filter(Boolean);
			return evoObj.branches
				.map((b) => (Array.isArray(b) ? b.filter(Boolean) : b && typeof b === "object" ? [b] : []))
				.filter((b) => b.length)
				.map((b) => shared.concat(b));
		}

		// branches only — treat as already-full paths if they start with same root,
		// otherwise we just render each branch as-is.
		if (Array.isArray(evoObj.branches) && evoObj.branches.length) {
			return evoObj.branches
				.map((b) => (Array.isArray(b) ? b.filter(Boolean) : b && typeof b === "object" ? [b] : []))
				.filter((b) => b.length);
		}

		// legacy: evo itself is [[...],[...]]
		if (Array.isArray(evoObj) && Array.isArray(evoObj[0])) {
			return evoObj.map((p) => p.filter(Boolean)).filter((p) => p.length);
		}

		return [];
	};

	const evoPaths = normalizeEvoToPaths(evo);

	let evoHtml = "";

	if (evoPaths.length) {
		// If only one path, render a simple horizontal chain (NO branching UI).
		if (evoPaths.length === 1) {
			const path = evoPaths[0];

			const rowHtml = path
				.map((step, i) => (i === 0 ? stepNodeHtml(step) : segHtml(step)))
				.join("");

			evoHtml = `
			<div class="mon-info-block mon-info-evo-block">
				<h3>Evolution</h3>
				<div class="evo-linear">
					${rowHtml}
				</div>
			</div>
		`;
		} else {
			// branching case: show shared trunk on the LEFT, branches stacked on the RIGHT

			// Find the longest common prefix (shared trunk)
			const commonPrefix = (() => {
				let idx = 0;
				while (true) {
					const first = evoPaths[0][idx];
					if (!first) break;

					const ok = evoPaths.every((p) => {
						const s = p[idx];
						if (!s) return false;
						if (first.id != null && s.id != null) return String(first.id) === String(s.id);
						return String(first.name || "") === String(s.name || "");
					});
					if (!ok) break;
					idx++;
				}
				return evoPaths[0].slice(0, idx);
			})();

			const sharedLen = commonPrefix.length;

			// trunk row (left side)
			const trunkRowHtml = commonPrefix
				.map((step, i) => (i === 0 ? stepNodeHtml(step) : segHtml(step)))
				.join("");

			// branch rows (right side, stacked)
			const branchesColHtml = evoPaths
				.map((path) => {
					const suffix = path.slice(sharedLen);
					if (!suffix.length) return "";

					let row = `<div class="evo-branch-row">`;

					for (let i = 0; i < suffix.length; i++) {
						const step = suffix[i];
						const method = methodLabel(step);

						row += segHtml(step);
					}

					row += `</div>`;
					return row;
				})
				.filter(Boolean)
				.join("");

			evoHtml = `
			<div class="mon-info-block mon-info-evo-block">
				<h3>Evolution</h3>

				<div class="evo-split">
					<div class="evo-trunk-row">
						${trunkRowHtml}
					</div>

					<div class="evo-branches-col">
						${branchesColHtml}
					</div>
				</div>
			</div>
		`;
		}
	}


	// -------------- Locations --------------

	// Location meta (shown at top of Locations block)
	// Keep this resilient: different games/data files may store these fields differently.
	const locEncounterRarity = effectiveInfo?.encounter?.rarity || null;

	const locCatchRate = effectiveInfo?.catchRate || null;

	const formatCatchRate = (v) => {
		if (v == null || v === "") return null;

		// if it's already formatted like "45 / 225", keep it
		const s = String(v).trim();
		if (s.includes("/")) return s;

		// try to treat it as a number
		const n = Number(s);
		const percent = (n / 225 * 100).toFixed(2);
		if (Number.isFinite(n)) return `${n} / 225 (${percent}%)`;

		// fallback: just show whatever it is
		return s;
	};

	let locationsHtml = "";
	if (Array.isArray(locations) && locations.length) {
		const renderMetaItem = (label, value) => {
			if (value == null || value === "") return "";
			return `
				<div class="mon-info-profile-item">
					<div class="label">${label}</div>
					<div class="value">${value}</div>
				</div>
			`;
		};

		const metaHtml = [
			renderMetaItem("Encounter Rarity", locEncounterRarity),
			renderMetaItem("Catch Rate", formatCatchRate(locCatchRate)),
		]
			.filter(Boolean)
			.join("");

		const items = locations
			.map((loc) => {
				if (typeof loc === "string") return `<li>${loc}</li>`;

				const area = loc.area || "";
				const notes = loc.notes || "";

				// Optional: allow per-location rarity/rate, but keep list text clean
				const extra = [];
				if (loc.rarity) extra.push(`Rarity: ${loc.rarity}`);
				if (loc.rate != null) extra.push(`Rate: ${loc.rate}`);
				const extraText = extra.length ? ` <span class="mon-info-locations-extra">(${extra.join(", ")})</span>` : "";

				if (area && notes) return `<li><strong>${area}</strong> — ${notes}${extraText}</li>`;
				return `<li>${(area || notes)}${extraText}</li>`;
			})
			.join("");

		locationsHtml = `
	  <div class="mon-info-block mon-info-locations">
		<h3>Locations</h3>
				${metaHtml ? `<div class="mon-info-locations-meta">${metaHtml}</div>` : ""}
		<ul class="mon-info-locations-list">
		  ${items}
		</ul>
	  </div>`;
	}

	// -------------- Move pools --------------
	const TM_GEN_BY_GAME = {
		// tweak this map as you add more games
		legendsza: "gen9_2",
	};

	const getTmIconSrc = (game, move) => {
		const genFolder = TM_GEN_BY_GAME[game] || "gen9_2";

		let typeKey = "normal";

		if (move && typeof move === "object" && move.type) {
			typeKey = String(move.type).toLowerCase();
		}

		return `imgs/tms/${genFolder}/${typeKey}.png`;
	};

	const renderMoveLine = (m) => {
		let text;

		if (typeof m === "string") {
			text = m;
		} else {
			const prefix = m.level != null ? `Lv. ${m.level}: ` : "";
			text = `${prefix}${m.name}`;
		}

		const tmIconSrc = getTmIconSrc(gameKey, m);

		return `
	  <li class="mon-info-move">
		<span class="mon-info-move-tm-icon">
		  ${tmIconSrc ? `<img src="${tmIconSrc}" alt="" loading="lazy" />` : ""}
		</span>
		<span class="mon-info-move-name">${text}</span>
	  </li>
	`;
	};

	const movesSection = (label, arr) =>
		!arr || !arr.length
			? ""
			: `
	  <div class="mon-info-subblock">
		<h4>${label}</h4>
		<ul>
		  ${arr.map((m) => renderMoveLine(m)).join("")}
		</ul>
	  </div>`;

	const movesHtml =
		moves && (moves.levelUp || moves.tm || moves.egg)
			? `
	  <div class="mon-info-block">
		<h3>Move Pool</h3>
		<div class="mon-info-moves-grid">
		  ${movesSection("Level-up", moves.levelUp)}
		  ${movesSection("TM / TR", moves.tm)}
		  ${movesSection("Egg Moves", moves.egg)}
		</div>
	  </div>`
			: "";

	const hasInfo = !!info;

	// ------------------------------------------------------------
	// Completion / Pills (Dex status + Research + Shiny/Alpha)
	// ------------------------------------------------------------

	// --- Dex status pill -------------------------------------------------------
	// Prefer real progress if available, but keep this resilient for testing.
	const detectDexStatus = () => {
		const normalize = (raw) => {
			if (!raw) return "unknown";
			const s = String(raw).trim().toLowerCase();

			// allow either "shiny alpha" or "shiny_alpha"
			if ((s.includes("shiny") && s.includes("alpha")) || s === "shiny_alpha")
				return "shinyalpha";
			if (s.includes("alpha")) return "alpha";
			if (s.includes("shiny")) return "shiny";
			if (s.includes("caught")) return "caught";
			if (s.includes("seen")) return "seen";
			if (s.includes("unknown")) return "unknown";
			return "unknown";
		};

		const storeStatusObj = window.store?.getDexStatus?.(gameKey, mon.id);
		if (storeStatusObj?.status != null) {
			return normalize(storeStatusObj.status);
		}

		return "unknown";
	};

	const dexStatus = statusFromCard || detectDexStatus();

	const dexStatusLabel = (() => {
		// show the current status instead of "Dex Entry"
		if (dexStatus === "unknown") return "Unknown";
		if (dexStatus === "seen") return "Seen";
		if (dexStatus === "caught") return "Caught";
		if (dexStatus === "shiny") return "Shiny";
		if (dexStatus === "alpha") return "Alpha";
		if (dexStatus === "shinyalpha") return "Shiny Alpha";
		return "Unknown";
	})();

	const dexStatusClass = `is-status-${dexStatus}`;

	// --- Research pill ---------------------------------------------------------
	// "Pull from the dex and pull any research task for that id number"
	// For now, we treat "research tasks exist" as:
	// - dex entry has researchTasks / research / researchId / researchKey / etc.
	// - or you have a window.DATA.research bucket (optional)
	const researchData = window.DATA?.research?.[gameKey]?.[mon.id] || null;
	const isLegendsArceus = gameKey === "legendsarceus";

	const getResearchProgress = () => {
		const tasks = Array.isArray(researchData?.tasks) ? researchData.tasks : null;
		const byGame =
			window.store?.dexResearchStatus instanceof Map
				? window.store.dexResearchStatus.get(gameKey)
				: null;

		const byPLA =
			window.store?.dexResearchStatus instanceof Map
				? window.store.dexResearchStatus.get("legendsarceus")
				: null;

		// This is the actual saved per-task slider level map: rec[taskIdx] = level
		const rec =
			(byGame && byGame[String(mon.id)]) ||
			(byPLA && byPLA[String(mon.id)]) ||
			{};

		// Tier-based stats
		let totalTiers = 0;
		let doneTiers = 0;
		let levelPoints = 0;

		if (Array.isArray(tasks) && tasks.length) {
			tasks.forEach((t, idx) => {
				const tiers = Array.isArray(t?.tiers) ? t.tiers : [];
				const steps = tiers.length || 0;

				totalTiers += steps;

				const raw = rec[idx];
				const lvl = typeof raw === "number" ? raw : raw ? steps : 0; // legacy true => full
				const clamped = Math.max(0, Math.min(steps, lvl));

				doneTiers += clamped;
				levelPoints += clamped * (t?.boost ? 2 : 1);
			});
		}

		const researchLevel = Math.min(10, levelPoints);
		const allComplete = totalTiers > 0 && doneTiers >= totalTiers;

		return {
			tasks,
			rec,
			totalTiers,
			doneTiers,
			levelPoints,
			researchLevel,
			allComplete,
		};
	};

	const researchProg = getResearchProgress();

	// clickable if we actually have tasks (even if opener isn’t wired yet)
	const canOpenResearch = isLegendsArceus && (!!researchProg?.tasks || researchData != null);

	// Determine research state colors:
	// - red if not completed
	// - green if >= 10 slider positions completed
	// - gold if all completed
	const getResearchState = () => {
		if (!isLegendsArceus) return "off";
		if (!researchProg.tasks) return "off";

		if (researchProg.allComplete) return "gold";
		if (Number(researchProg.researchLevel || 0) >= 10) return "green";
		return "red";
	};

	const researchState = getResearchState();

	// --- Shiny/Alpha availability pills ---------------------------------------
	// Based on maxStatus tags:
	// - no tag => both true
	// - "shiny" => shiny true, alpha false
	// - "caught" => both false
	//
	// alpha pill only shown for Legends Arceus + ZA (per your request)
	const maxStatusRaw =
		info?.maxStatus ??
		mon?.maxStatus ??
		(mon?.tags && (mon.tags.maxStatus || mon.tags.maxstatus)) ??
		null;

	const maxStatus =
		maxStatusRaw == null ? null : String(maxStatusRaw).toLowerCase();

	const computeAvailabilityFromMaxStatus = () => {
		if (!maxStatus) return { shiny: true, alpha: true };

		if (maxStatus === "caught") return { shiny: false, alpha: false };
		if (maxStatus === "shiny") return { shiny: true, alpha: false };

		// anything else -> default permissive (keeps testing flexible)
		return { shiny: true, alpha: true };
	};

	const avail = computeAvailabilityFromMaxStatus();

	const showAlphaPill = gameKey === "legendsarceus" || gameKey === "legendsza";

	const pillCount =
		1 + // status
		(isLegendsArceus && researchProg.tasks ? 1 : 0) +
		1 + // shiny
		(showAlphaPill ? 1 : 0);

	const pillCols = Math.min(4, Math.max(2, pillCount));

	// --- Build pill grid -------------------------------------------------------
	const completionTopHtml = `
<div class="mon-info-completion-grid" style="grid-template-columns: repeat(${pillCols}, minmax(0, 1fr));">

  <button class="mon-info-pill ${dexStatusClass}" type="button" data-pill="dexStatus">
	<span class="pill-title">${dexStatusLabel}</span>
  </button>

 ${isLegendsArceus && researchProg.tasks
			? `<button class="mon-info-pill ${researchState === "gold"
				? "is-gold"
				: researchState === "green"
					? "is-green"
					: "is-red"
			} ${canOpenResearch ? "is-clickable" : ""}"
	  type="button"
	  data-pill="research"
	  title="${canOpenResearch
				? "Open Research Tasks"
				: "Research modal not available for this entry"
			}">
	<span class="pill-title">Research</span>
	<span class="pill-sub">${Number(researchProg.researchLevel || 0)}</span>
  </button>`
			: ``
		}

  <button class="mon-info-pill ${avail.shiny ? "is-green" : "is-red"
		}" type="button" data-pill="shinyAvail">
	<span class="pill-title">${avail.shiny ? "Can be Shiny" : "Cannot be Shiny"
		}</span>
  </button>

  ${showAlphaPill
			? `<button class="mon-info-pill ${avail.alpha ? "is-green" : "is-red"
			}" type="button" data-pill="alphaAvail">
	<span class="pill-title">${avail.alpha ? "Can be Alpha" : "Cannot be Alpha"
			}</span>
	  </button>`
			: `<div></div>`
		}

</div>
`;

	// Variants / special forms (supports nested object or flat arrays)
	const variants = effectiveInfo?.variants || effectiveInfo?.specialVariants || {};
	const forms = variants.forms ?? effectiveInfo?.forms ?? null;
	const regional =
		variants.regional ?? variants.regionalForms ?? effectiveInfo?.regionalForms ?? null;
	const mega = variants.mega ?? variants.megaForms ?? effectiveInfo?.megaForms ?? null;
	const gmax = variants.gmax ?? variants.gigantamax ?? effectiveInfo?.gigantamax ?? null;
	const other = variants.other ?? variants.otherForms ?? null;

	const variantsHtml =
		forms || regional || mega || gmax || other
			? `
	  <div class="mon-info-block">
		<h3>Forms &amp; Variants</h3>
		${renderListRow("Forms", forms)}
		${renderListRow("Regional", regional)}
		${renderListRow("Mega", mega)}
		${renderListRow("Gigantamax", gmax)}
		${renderListRow("Other", other)}
	  </div>`
			: "";

	const notesHtml =
		Array.isArray(effectiveInfo?.notes) && effectiveInfo.notes.filter(Boolean).length
			? `
	  <div class="mon-info-block">
		<h3>Notes</h3>
		<ul class="mon-info-notes">
		  ${effectiveInfo.notes
				.filter((n) => n != null && n !== "")
				.map((n) => `<li>${n}</li>`)
				.join("")}
		</ul>
	  </div>`
			: "";

	const inferGenNumber = () => {
		// genKey usually looks like "gen9"
		if (genKey != null) {
			const m = String(genKey).match(/(\d+)/);
			if (m) return Number(m[1]);
		}
		// Try a few common metadata buckets if you have them
		const meta =
			window.DATA?.games?.[gameKey] ||
			window.DATA?.gameMeta?.[gameKey] ||
			window.DATA?.gameInfo?.[gameKey] ||
			null;

		if (meta?.gen != null) return Number(meta.gen);
		if (meta?.generation != null) return Number(meta.generation);

		return null; // unknown
	};

	const genNum = inferGenNumber();
	const allowModels = genNum != null && genNum >= 6;

	// -------------- Sprites & Models (gallery) --------------
	// Allow per-mon overrides via monInfo:
	// info.sprites = { front, back, icon, frontShiny, backShiny, iconShiny }
	// info.models  = { base, shiny, thumbBase?, thumbShiny? }
	//
	// Fallbacks try reasonable conventions but are intentionally non-destructive:
	// if an asset path is wrong/missing, the tile will collapse via onerror handlers.
	const resolveSpriteSources = () => {
		const sprites = effectiveInfo?.sprites || {};

		const has = (k) => Object.prototype.hasOwnProperty.call(sprites, k);

		const front = has("front") ? sprites.front : null;
		const back = has("back") ? sprites.back : null;
		const icon = has("icon") ? sprites.icon : null;
		const menu = has("menu") ? sprites.menu : null;

		const frontAnimated = has("frontAnimated") ? sprites.frontAnimated : null;
		const backAnimated = has("backAnimated") ? sprites.backAnimated : null;

		const frontShiny = has("frontShiny") ? sprites.frontShiny : null;
		const backShiny = has("backShiny") ? sprites.backShiny : null;
		const iconShiny = has("iconShiny") ? sprites.iconShiny : null;

		const frontShinyAnimated = has("frontShinyAnimated") ? sprites.frontShinyAnimated : null;
		const backShinyAnimated = has("backShinyAnimated") ? sprites.backShinyAnimated : null;

		return { front, back, icon, menu, frontAnimated, backAnimated, frontShiny, backShiny, iconShiny, frontShinyAnimated, backShinyAnimated };
	};

	const resolveModelSources = () => {
		if (!allowModels) {
			return { base: null, shiny: null, thumbBase: null, thumbShiny: null };
		}

		const sprites = effectiveInfo?.sprites || effectiveInfo?.spriteSet || {};

		// If there's no models object (or it's empty), don't show a model card at all.
		const models = effectiveInfo?.models;
		if (
			!models ||
			(typeof models === "object" &&
				!Array.isArray(models) &&
				Object.keys(models).length === 0)
		) {
			return { base: null, shiny: null, thumbBase: null, thumbShiny: null };
		}

		const base =
			models.base ??
			models.model ??
			(typeof window._baseModel === "function" ? window._baseModel(genKey, gameKey, mon.id) : null);

		const shiny =
			models.shiny ??
			models.modelShiny ??
			(typeof window._shinyModel === "function" ? window._shinyModel(genKey, gameKey, mon.id) : null);

		// Optional thumbnail images for models
		const thumbBase = sprites.front ?? models.thumbnail ?? null;
		const thumbShiny = sprites.frontShiny ?? null;

		return { base, shiny, thumbBase, thumbShiny };
	};

	const renderAssetTile = ({ label, src, modelUrl, variant }) => {
		if (!src) return "";

		const s = String(src);
		const m = modelUrl ? String(modelUrl) : null;

		// if src itself is a GLB/GLTF file
		const isModelFile = /\.(glb|gltf)$/i.test(s);

		// show viewer button if we have a modelUrl
		const hasViewer = !!m;

		// If the tile itself is the GLB/GLTF => file tile with buttons
		if (isModelFile) {
			return `
	<div class="asset-tile asset-tile--file">
		<div class="asset-label">${label}</div>

		<div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
			<button
				type="button"
				class="asset-file"
				data-open-modelviewer="1"
				data-model-url="${s.replace(/"/g, "&quot;")}"
				data-model-variant="${variant || "base"}"
				data-model-label="${label.replace(/"/g, "&quot;")}"
			>Open Viewer</button>

			<a class="asset-file" href="${s}" target="_blank" rel="noopener">Open model file</a>
		</div>

		<div class="asset-filepath">${s}</div>
	</div>`;
		}

		// Otherwise => image tile (sprite/thumb), but optionally include viewer button
		return `
	<div class="asset-tile ${hasViewer ? "asset-tile--hasviewer" : ""}">
		${hasViewer
				? `<button
					type="button"
					class="asset-openviewer"
					data-open-modelviewer="1"
					data-model-url="${m.replace(/"/g, "&quot;")}"
					data-model-variant="${variant || "base"}"
					data-model-label="${label.replace(/"/g, "&quot;")}"
				>Open Viewer</button>`
				: ""
			}

		<img
			src="${s}"
			alt="${label}"
			loading="lazy"
			onerror="
  window.PPGC?.reportMissingAsset?.('sprites', this.currentSrc || this.src);
  this.closest('.asset-tile')?.classList?.add('is-missing');
  this.remove();
"
		/>
		<div class="asset-label">${label}</div>
	</div>`;
	};

	const renderSpritesModels = () => {
		const spr = resolveSpriteSources();
		const mdl = resolveModelSources();

		const baseTiles = [
			renderAssetTile({ label: "Model", src: mdl.thumbBase || mdl.base, modelUrl: mdl.base, variant: "base" }),
			renderAssetTile({ label: "Front", src: spr.front }),
			renderAssetTile({ label: "Back", src: spr.back }),
			renderAssetTile({ label: "Icon", src: spr.icon }),
			renderAssetTile({ label: "Menu Sprite", src: spr.menu }),
			renderAssetTile({ label: "Front (Animated)", src: spr.frontAnimated, }),
			renderAssetTile({ label: "Back (Animated)", src: spr.backAnimated }),
		].filter(Boolean).join("");

		const shinyTiles = [
			renderAssetTile({ label: "Model", src: mdl.thumbShiny || mdl.shiny, modelUrl: mdl.shiny, variant: "shiny" }),
			renderAssetTile({ label: "Front", src: spr.frontShiny }),
			renderAssetTile({ label: "Back", src: spr.backShiny }),
			renderAssetTile({ label: "Icon", src: spr.iconShiny }),
			renderAssetTile({ label: "Menu Sprite", src: spr.menu }),
			renderAssetTile({ label: "Front (Animated)", src: spr.frontShinyAnimated }),
			renderAssetTile({ label: "Back (Animated)", src: spr.backShinyAnimated }),
		].filter(Boolean).join("");

		if (!baseTiles && !shinyTiles) return "";

		return `
		<div class="mon-info-block mon-info-assets">
			<h3>Sprites &amp; Models</h3>

			<div class="asset-tabs" role="tablist" aria-label="Sprites and models variants">
				<button class="asset-tab is-active" type="button" data-assets-tab="base">Base</button>
				<button class="asset-tab" type="button" data-assets-tab="shiny">Shiny</button>
			</div>

			<div class="asset-panels">
				<div class="asset-panel is-active" data-assets-panel="base">
					<div class="asset-grid">${baseTiles || `<div class="asset-empty">No base assets configured.</div>`}</div>
				</div>
				<div class="asset-panel" data-assets-panel="shiny">
					<div class="asset-grid">${shinyTiles || `<div class="asset-empty">No shiny assets configured.</div>`}</div>
				</div>
			</div>
		</div>
	`;
	};

	const assetsHtml = info ? renderSpritesModels() : "";

	const _wireAssetsTabs = () => {
		const root = monInfoBody.querySelector(".mon-info-assets");
		if (!root || root.dataset.wired === "1") return;
		root.dataset.wired = "1";

		const setTab = (key) => {
			root.querySelectorAll(".asset-tab").forEach((b) => {
				b.classList.toggle("is-active", b.dataset.assetsTab === key);
			});
			root.querySelectorAll(".asset-panel").forEach((p) => {
				p.classList.toggle("is-active", p.dataset.assetsPanel === key);
			});
		};

		root.addEventListener("click", (e) => {
			const btn = e.target?.closest?.(".asset-tab");
			if (!btn) return;
			setTab(btn.dataset.assetsTab);
		});
	};

	const _wireResearchClick = () => {
		const researchBtn = monInfoBody.querySelector('[data-pill="research"]');
		if (!researchBtn || researchBtn.dataset.wired) return;
		researchBtn.dataset.wired = "1";

		researchBtn.addEventListener("click", () => {
			if (!canOpenResearch) return;

			const key =
				typeof researchFromDex === "string" ||
					typeof researchFromDex === "number"
					? researchFromDex
					: researchData?.modalKey || researchData?.researchId || mon.id;

			const opts = { mon, tasks: researchProg?.tasks };

			// 1) Direct openers (if you later expose them)
			if (typeof window?.PPGC?.openResearchModal === "function") {
				window.PPGC.openResearchModal(gameKey, key, opts);
				return;
			}
			if (typeof window?.PPGC?.openDexResearchModal === "function") {
				window.PPGC.openDexResearchModal(gameKey, key, opts);
				return;
			}
			if (typeof window?.PPGC?.openResearchTasksModal === "function") {
				window.PPGC.openResearchTasksModal(gameKey, key, opts);
				return;
			}

			// 2) BEST FALLBACK: click the existing dex-card research button (uses your already-working wiring)
			const cardBtn = sourceCard?.querySelector?.(".research-launch");
			if (cardBtn) {
				cardBtn.click();
				return;
			}

			// 3) Event fallback (for future wiring)
			window.dispatchEvent(
				new CustomEvent("ppgc:openResearchModal", {
					detail: { gameKey, key, ...opts },
				})
			);

			console.warn(
				"[PPGC] Research pill clicked but no modal opener found. " +
				"Tried PPGC openers, then card .research-launch, then event fallback.",
				{ gameKey, key }
			);
		});
	};

	const _wireModelViewerClick = () => {
		// delegate so it works even when you re-render the modal body
		if (monInfoBody.dataset.modelViewerWired === "1") return;
		monInfoBody.dataset.modelViewerWired = "1";

		monInfoBody.addEventListener("click", async (e) => {
			const btn = e.target?.closest?.("[data-open-modelviewer]");
			if (!btn) return;

			const glbUrl = btn.getAttribute("data-model-url");
			const variant = btn.getAttribute("data-model-variant") || "base";
			const label = btn.getAttribute("data-model-label") || "Model";
			if (!glbUrl) return;

			// ✅ NEW: make sure the model viewer code is actually loaded
			try {
				if (typeof window?.PPGC?.ensureModelViewerLoaded === "function") {
					await window.PPGC.ensureModelViewerLoaded();
				}
			} catch (err) {
				console.debug("[modelViewer] lazy-load failed:", err);
			}

			// Now it should exist (model-viewer.js assigns it to window.PPGC)
			if (typeof window?.PPGC?.openModelViewerModal === "function") {
				window.PPGC.openModelViewerModal({
					title: `${mon.name} — ${label}`,
					glbUrl,
					variant,
				});
			} else {
				console.warn("PPGC.openModelViewerModal not found (even after load)");
			}
		});
	};


	// ---- PROFILE (moved from header + merged with size/gender/friendship) ----

	const sizeObj = effectiveInfo?.size || {};
	const height = sizeObj.height ?? effectiveInfo?.height ?? null;
	const weight = sizeObj.weight ?? effectiveInfo?.weight ?? null;

	const genderObj = effectiveInfo?.gender || null;
	const genderRatioText =
		genderObj && (genderObj.maleRatio != null || genderObj.femaleRatio != null)
			? `${genderObj.maleRatio ?? "?"}% ♂ / ${genderObj.femaleRatio ?? "?"}% ♀`
			: effectiveInfo?.genderRatio ?? null;

	// baseFriendship already computed above in your battle section; reuse it
	const baseFriendshipProfile =
		effectiveInfo?.battle?.baseFriendship ?? effectiveInfo?.baseFriendship ?? null;

	const renderProfileItem = (label, valueOrArr) => {
		if (valueOrArr == null) return "";

		// Array -> stacked
		if (Array.isArray(valueOrArr)) {
			const cleaned = valueOrArr.filter((v) => v != null && v !== "");
			if (!cleaned.length) return "";

			let itemsHtml = cleaned
				.map((v) => `<span class="value-line">${v}</span>`)
				.join("");

			return `
	  <div class="mon-info-profile-item">
		<div class="label">${label}</div>
		<div class="value value--stacked">${itemsHtml}</div>
	  </div>`;
		}

		// Single value
		const v = String(valueOrArr);
		if (!v) return "";

		let itemHtml = `<div class="value">${v}</div>`;
		if (label === "Base Friendship") itemHtml = `<div class="value">${v} / 255</div>`;

		return `
			<div class="mon-info-profile-item">
			<div class="label">${label}</div>
			${itemHtml}
			</div>
		`;
	};

	// Build the 8 values
	const profileItems = [
		renderProfileItem("Abilities", abilities),
		renderProfileItem("Egg Groups", eggGroups),
		renderProfileItem("Exp Growth", expGroup),
		renderProfileItem("Base Egg Steps", baseEggSteps != null ? baseEggSteps : null),

		renderProfileItem("Height", height),
		renderProfileItem("Weight", weight),
		renderProfileItem("Gender Ratio", genderRatioText),
		renderProfileItem("Base Friendship", baseFriendshipProfile),
	].filter(Boolean).join("");

	const profileHtml = effectiveInfo
		? `
		<div class="mon-info-block mon-info-profile">
			<h3>Profile</h3>
			<div class="mon-info-profile-grid">
			${profileItems}
			</div>
		</div>
		` : "";

	const quickStatsHtml = completionTopHtml;

	monInfoBody.innerHTML = `
	<div class="mon-info-header">
	  ${spriteSrc
			? `<div class="mon-info-sprite">
		  <img src="${spriteSrc}" alt="${mon.name}" loading="lazy" />
		</div>`
			: ""
		}
	  <div class="mon-info-main">
		<div class="mon-info-topline">
		  <div class="mon-info-basic">
			<div class="mon-info-name">
			  #${String(mon.id).padStart(4, "0")} — ${mon.name}
			</div>
			<div class="mon-info-types">
			  ${(types || [])
			.map(
				(t) =>
					`<span class="type-pill type-${String(
						t
					).toLowerCase()}">${t}</span>`
			)
			.join("")}
			</div>
			${hasForms ? `
			<div class="mon-info-form">
			  <select id="monInfoFormSelect" class="mon-info-form-select">
				<option value="" ${!formKey ? "selected" : ""}></option>
				${formOpts.map(o =>
				`<option value="${o.key}" ${formKey === o.key ? "selected" : ""}>${o.label}</option>`
			).join("")}
			  </select>
			</div>
			` : ""
		}
		  </div>
		  ${quickStatsHtml
			? `<div class="mon-info-quickstats">${quickStatsHtml}</div>`
			: ""
		}
		</div>
	  </div>
	</div>

	${info?.flavor
			? `<div class="mon-info-block mon-info-flavor">${info.flavor}</div>`
			: ""
		}

	<div class="mon-info-layout">
	  <aside class="mon-info-col mon-info-col--summary">
		${chartHtml}
		${statsHtml}
		${notesHtml}
	  </aside>

	  <section class="mon-info-col mon-info-col--details">
		${profileHtml}
		${variantsHtml}
		${evoHtml}
		${locationsHtml}
		${movesHtml ||
		(hasInfo
			? ""
			: `<div class="mon-info-empty">No move data defined yet for this game.</div>`)
		}
		</section>
	</div>

	${assetsHtml}

	${!hasInfo
			? `<div class="mon-info-empty">
		  No detailed <code>monInfo</code> entry configured yet for this Pokémon in <strong>${gameKey}</strong>.
		</div>`
			: ""
		}
  `;

	// Wire form select (works for modal + page render targets)
	const formSel = monInfoBody.querySelector("#monInfoFormSelect");
	if (formSel) {
		formSel.onchange = async () => {
			const chosen = formSel.value || null;

			// preserve scroll position (nice for long info cards)
			const prevScroll = monInfoBody.scrollTop;

			await renderMonInfoInto({
				gameKey,
				genKey,
				mon,
				formKey: chosen, // null => blank UI, but will load first form silently
				titleEl,
				bodyEl,
				sourceCard,
			});

			monInfoBody.scrollTop = prevScroll;
		};
	}

	_wireAssetsTabs();
	_wireResearchClick();
	_wireModelViewerClick();
}

export async function openMonInfo(gameKey, genKey, mon) {
	const monInfoModal = document.getElementById("monInfoModal");
	const monInfoTitle = document.getElementById("monInfoTitle");
	const monInfoBody = document.getElementById("monInfoBody");

	if (!monInfoModal || !monInfoBody) return;

	// Capture the element that opened the modal (usually inside the dex card)
	const invokerEl = document.activeElement;

	// Try to find the dex card we came from
	const sourceCard =
		invokerEl?.closest?.(".card") ||
		document.querySelector(`.card [data-open="monInfo"]`)?.closest?.(".card") ||
		null;

	await renderMonInfoInto({
		gameKey,
		genKey,
		mon,
		titleEl: monInfoTitle,
		bodyEl: monInfoBody,
		sourceCard,
	});

	monInfoModal.classList.add("open");
	monInfoModal.setAttribute("aria-hidden", "false");
	monInfoModal.dataset.gameKey = gameKey;
	monInfoModal.dataset.monId = String(mon.id);
}

export function setupMonInfoModal() {
	const monInfoModal = document.getElementById("monInfoModal");
	const monInfoClose = document.getElementById("monInfoClose");
	if (!monInfoModal) return;

	const close = () => {
		monInfoModal.classList.remove("open");
		monInfoModal.setAttribute("aria-hidden", "true");
	};

	// Wire close handlers once per page load (prevents duplicate listeners on repeated opens)
	if (monInfoModal.dataset.wired !== "1") {
		monInfoModal.dataset.wired = "1";

		// ✅ click outside (backdrop) closes modal
		monInfoModal.addEventListener("click", (e) => {
			if (e.target === monInfoModal) close();
		});

		monInfoClose?.addEventListener("click", close);

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && monInfoModal.classList.contains("open")) {
				close();
			}
		});
	}

	if (!window.__PPGC_MONINFO_RESEARCH_WIRED) {
		window.__PPGC_MONINFO_RESEARCH_WIRED = true;

		window.addEventListener("ppgc:researchSaved", (e) => {
			const detail = e?.detail || {};
			const monInfoModal = document.getElementById("monInfoModal");
			const monInfoBody = document.getElementById("monInfoBody");
			if (!monInfoModal || !monInfoBody) return;
			if (!monInfoModal.classList.contains("open")) return;

			// Only update if the current mon matches
			const currentGame = monInfoModal.dataset.gameKey;
			const currentMonId = monInfoModal.dataset.monId;

			if (String(detail.gameKey) !== String(currentGame)) return;
			if (String(detail.monId) !== String(currentMonId)) return;

			const btn = monInfoBody.querySelector('[data-pill="research"]');
			const sub = btn?.querySelector(".pill-sub");
			if (!btn || !sub) return;

			const stats = detail.stats || {};
			const lvl = Number(stats.researchLevel || 0);

			sub.textContent = `${lvl}`;

			btn.classList.remove("is-red", "is-green", "is-gold", "is-off");
			if (stats.allComplete) btn.classList.add("is-gold");
			else if (lvl >= 10) btn.classList.add("is-green");
			else btn.classList.add("is-red");
		});
	}
}