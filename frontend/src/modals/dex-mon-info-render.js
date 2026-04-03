export function renderListRow(label, valueOrArr) {
	if (valueOrArr == null) return "";

	if (Array.isArray(valueOrArr)) {
		const cleaned = valueOrArr.filter((v) => v != null && v !== "");
		if (!cleaned.length) return "";
		const itemsHtml = cleaned.map((v) => `<span class="value-line">${v}</span>`).join("");
		return `
		<div class="mon-info-row">
		  <span class="label">${label}</span>
		  <span class="value value--stacked">
			${itemsHtml}
		  </span>
		</div>`;
	}

	const v = valueOrArr;
	if (v === "") return "";
	return `
	  <div class="mon-info-row">
		<span class="label">${label}</span>
		<span class="value">${v}</span>
	  </div>`;
}

const RADAR_ORDER = ["hp", "atk", "def", "spe", "spd", "spa"];
const RADAR_LABELS = ["HP", "Atk", "Def", "Spe", "SpD", "SpA"];

function renderRadarBlock({ title, statsObj, extraClass = "" } = {}) {
	if (!statsObj) return "";
	const values = RADAR_ORDER.map((k) => Number(statsObj[k] ?? 0));
	const maxVal = Math.max(...values, 1);
	const total = values.reduce((sum, v) => sum + v, 0);
	const center = 50;
	const radius = 65;

	const points = values.map((v, idx) => {
		const ratio = v / maxVal;
		const r = radius * ratio;
		const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / RADAR_ORDER.length;
		const x = center + r * Math.cos(angle);
		const y = center + r * Math.sin(angle);
		return { x, y, r, angle, value: v, label: RADAR_LABELS[idx] };
	});

	const polygonPoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
	const gridLevels = [0.33, 0.66, 1];
	const gridPolys = gridLevels.map((lvl) => {
		const pts = RADAR_ORDER.map((_, i) => {
			const r = radius * lvl;
			const angle = -Math.PI / 2 + (i * 2 * Math.PI) / RADAR_ORDER.length;
			const x = center + r * Math.cos(angle);
			const y = center + r * Math.sin(angle);
			return `${x.toFixed(1)},${y.toFixed(1)}`;
		}).join(" ");
		return `<polygon points="${pts}" class="stat-grid-ring" />`;
	}).join("");

	const vertexDots = points.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1.6" class="stat-vertex-dot" />`).join("");

	const labelRadius = radius + 12;
	const labelsSvg = points.map((p) => {
		const lx = center + labelRadius * Math.cos(p.angle);
		const ly = center + labelRadius * Math.sin(p.angle);
		return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" class="stat-label" text-anchor="middle" dominant-baseline="central">${p.label}</text>`;
	}).join("");

	const numbersSvg = points.map((p) => {
		const innerR = p.r * 0.7;
		const nx = center + innerR * Math.cos(p.angle);
		const ny = center + innerR * Math.sin(p.angle);
		return `<text x="${nx.toFixed(1)}" y="${ny.toFixed(1)}" class="stat-value" text-anchor="middle" dominant-baseline="central">${p.value}</text>`;
	}).join("");

	const totalSvg = `<text x="${center}" y="${center}" class="stat-total" text-anchor="middle" dominant-baseline="central">${total}</text>`;

	return `
	  <div class="mon-info-block mon-info-stats ${extraClass}">
		<h3>${title}</h3>
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
}

export const renderStatsRadar = (statsObj) => renderRadarBlock({ title: "Base Stats", statsObj });
export const renderEvRadar = (evObj) => renderRadarBlock({ title: "EV Yield", statsObj: evObj, extraClass: "mon-info-ev" });

const TYPE_CHART = {
	Normal: { Rock: 0.5, Steel: 0.5, Ghost: 0 },
	Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
	Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
	Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
	Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
	Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5, Ice: 0.5 },
	Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5, Ghost: 0 },
	Poison: { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
	Ground: { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
	Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
	Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
	Bug: { Grass: 2, Psychic: 2, Dark: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
	Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
	Ghost: { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
	Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
	Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
	Steel: { Rock: 2, Ice: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
	Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 },
};
const ALL_TYPES = ["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"];
const ABBR = { Normal:"Nor", Fire:"Fir", Water:"Wat", Electric:"Ele", Grass:"Gra", Ice:"Ice", Fighting:"Fig", Poison:"Poi", Ground:"Gro", Flying:"Fly", Psychic:"Psy", Bug:"Bug", Rock:"Roc", Ghost:"Gho", Dragon:"Dra", Dark:"Dar", Steel:"Ste", Fairy:"Fai" };

function normalizeTypeName(t) {
	if (!t) return null;
	const s = String(t).toLowerCase();
	return s.charAt(0).toUpperCase() + s.slice(1);
}

export function renderTypeChart(types = []) {
	const defTypes = (types || []).map(normalizeTypeName).filter(Boolean);
	if (!defTypes.length) return "";

	const dmg = { "4x": [], "2x": [], "1.5x": [], "1x": [], "0.5x": [], "0.25x": [], "0x": [] };
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

	const groups = [ALL_TYPES.slice(0, 6), ALL_TYPES.slice(6, 12), ALL_TYPES.slice(12, 18)];
	const tablesHtml = groups.map((group) => {
		const head = group.map((t) => `<th><span class="type-abbr type-${t.toLowerCase()}">${ABBR[t]}</span></th>`).join("");
		const body = group.map((t) => {
			const m = dmg["4x"].includes(t) ? 4 : dmg["2x"].includes(t) ? 2 : dmg["1.5x"].includes(t) ? 1.5 : dmg["0.25x"].includes(t) ? 0.25 : dmg["0.5x"].includes(t) ? 0.5 : dmg["0x"].includes(t) ? 0 : 1;
			let cls = "type-fx-100";
			let label = "";
			if (m === 4) { cls = "type-fx-400"; label = "4"; }
			else if (m === 2) { cls = "type-fx-200"; label = "2"; }
			else if (m === 1.5) { cls = "type-fx-150"; label = "1½"; }
			else if (m === 0.5) { cls = "type-fx-50"; label = "½"; }
			else if (m === 0.25) { cls = "type-fx-25"; label = "¼"; }
			else if (m === 0) { cls = "type-fx-0"; label = "0"; }
			return `<td class="type-fx-cell ${cls}">${label}</td>`;
		}).join("");
		return `<table class="type-table-pokedex"><thead><tr>${head}</tr></thead><tbody><tr>${body}</tr></tbody></table>`;
	}).join("");

	return `<div class="mon-info-block mon-info-typechart"><h3>Type Defenses</h3><div class="typechart-matrix">${tablesHtml}</div></div>`;
}

export function renderEvolutionHtml(evo, dexList = []) {
	if (!evo) return "";
	const findDexEntry = (step) => step ? dexList.find((e) => e && String(e.id) === String(step.id)) || null : null;
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
	const linkHtml = (step) => `<div class="evo-link"><div class="evo-method">${methodLabel(step) || ""}</div><div class="evo-arrow">→</div></div>`;
	const stepNodeHtml = (step) => {
		const entry = findDexEntry(step);
		const resolve = (v) => { try { return typeof v === "function" ? v() : v; } catch { return v; } };
		const pad4 = (v) => String(v).padStart(4, "0");
		const natId = step?.natiId ?? step?.natId ?? step?.nationalId ?? step?.id ?? entry?.natiId ?? entry?.natId ?? entry?.nationalId ?? entry?.id ?? null;
		const homeSprite = natId != null ? _assetPath(`sprites/pokemon_home/base-front/${pad4(natId)}.png`) : null;
		const imgSrc = step?.sprite || homeSprite || resolve(entry?.img) || null;
		return `<div class="evo-node">${imgSrc ? `<img class="evo-img" src="${imgSrc}" alt="${step.name}" loading="lazy" />` : ""}<div class="evo-name">${step.name}</div></div>`;
	};
	const segHtml = (step) => `<div class="evo-seg">${linkHtml(step)}${stepNodeHtml(step)}</div>`;
	const normalizeEvoToPaths = (evoObj) => {
		if (!evoObj) return [];
		if (Array.isArray(evoObj.paths) && evoObj.paths.length) return evoObj.paths.map((p) => (Array.isArray(p) ? p.filter(Boolean) : [])).filter((p) => p.length);
		if (Array.isArray(evoObj.chain) && evoObj.chain.length) {
			if (!Array.isArray(evoObj.chain[0])) return [evoObj.chain.filter(Boolean)];
			return evoObj.chain.map((p) => (Array.isArray(p) ? p.filter(Boolean) : [])).filter((p) => p.length);
		}
		if (Array.isArray(evoObj.shared) && Array.isArray(evoObj.branches)) {
			const shared = evoObj.shared.filter(Boolean);
			return evoObj.branches.map((b) => (Array.isArray(b) ? b.filter(Boolean) : b && typeof b === "object" ? [b] : [])).filter((b) => b.length).map((b) => shared.concat(b));
		}
		if (Array.isArray(evoObj.branches) && evoObj.branches.length) return evoObj.branches.map((b) => (Array.isArray(b) ? b.filter(Boolean) : b && typeof b === "object" ? [b] : [])).filter((b) => b.length);
		if (Array.isArray(evoObj) && Array.isArray(evoObj[0])) return evoObj.map((p) => p.filter(Boolean)).filter((p) => p.length);
		return [];
	};

	const evoPaths = normalizeEvoToPaths(evo);
	if (!evoPaths.length) return "";
	if (evoPaths.length === 1) {
		const rowHtml = evoPaths[0].map((step, i) => (i === 0 ? stepNodeHtml(step) : segHtml(step))).join("");
		return `<div class="mon-info-block mon-info-evo-block"><h3>Evolution</h3><div class="evo-linear">${rowHtml}</div></div>`;
	}
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
	const trunkRowHtml = commonPrefix.map((step, i) => (i === 0 ? stepNodeHtml(step) : segHtml(step))).join("");
	const branchesColHtml = evoPaths.map((path) => {
		const suffix = path.slice(sharedLen);
		if (!suffix.length) return "";
		let row = `<div class="evo-branch-row">`;
		for (const step of suffix) row += segHtml(step);
		row += `</div>`;
		return row;
	}).filter(Boolean).join("");
	return `<div class="mon-info-block mon-info-evo-block"><h3>Evolution</h3><div class="evo-split"><div class="evo-trunk-row">${trunkRowHtml}</div><div class="evo-branches-col">${branchesColHtml}</div></div></div>`;
}

export function renderLocationsHtml({ locations = [], resolvedInfo = {} } = {}) {
	const locEncounterRarity = resolvedInfo?.encounter?.rarity || null;
	const locCatchRate = resolvedInfo?.catchRate || null;
	const formatCatchRate = (v) => {
		if (v == null || v === "") return null;
		const s = String(v).trim();
		if (s.includes("/")) return s;
		const n = Number(s);
		const percent = (n / 225 * 100).toFixed(2);
		if (Number.isFinite(n)) return `${n} / 225 (${percent}%)`;
		return s;
	};
	if (!Array.isArray(locations) || !locations.length) return "";
	const renderMetaItem = (label, value) => value == null || value === "" ? "" : `<div class="mon-info-profile-item"><div class="label">${label}</div><div class="value">${value}</div></div>`;
	const metaHtml = [renderMetaItem("Encounter Rarity", locEncounterRarity), renderMetaItem("Catch Rate", formatCatchRate(locCatchRate))].filter(Boolean).join("");
	const items = locations.map((loc) => {
		if (typeof loc === "string") return `<li>${loc}</li>`;
		const area = loc.area || "";
		const notes = loc.notes || "";
		const extra = [];
		if (loc.rarity) extra.push(`Rarity: ${loc.rarity}`);
		if (loc.rate != null) extra.push(`Rate: ${loc.rate}`);
		const extraText = extra.length ? ` <span class="mon-info-locations-extra">(${extra.join(", ")})</span>` : "";
		if (area && notes) return `<li><strong>${area}</strong> — ${notes}${extraText}</li>`;
		return `<li>${(area || notes)}${extraText}</li>`;
	}).join("");
	return `<div class="mon-info-block mon-info-locations"><h3>Locations</h3>${metaHtml ? `<div class="mon-info-locations-meta">${metaHtml}</div>` : ""}<ul class="mon-info-locations-list">${items}</ul></div>`;
}

const TM_GEN_BY_GAME = { legendsza: "gen9_2" };
function getTmIconSrc(game, move) {
	const genFolder = TM_GEN_BY_GAME[game] || "gen9_2";
	let typeKey = "normal";
	if (move && typeof move === "object" && move.type) typeKey = String(move.type).toLowerCase();
	return _assetPath(`tms/${genFolder}/${typeKey}.png`);
}
function renderMoveLine(gameKey, m) {
	let text;
	if (typeof m === "string") text = m;
	else {
		const prefix = m.level != null ? `Lv. ${m.level}: ` : "";
		text = `${prefix}${m.name}`;
	}
	const tmIconSrc = getTmIconSrc(gameKey, m);
	return `<li class="mon-info-move"><span class="mon-info-move-tm-icon">${tmIconSrc ? `<img src="${tmIconSrc}" alt="" loading="lazy" />` : ""}</span><span class="mon-info-move-name">${text}</span></li>`;
}
export function renderMovesHtml({ moves = {}, gameKey } = {}) {
	const movesSection = (label, arr) => !arr || !arr.length ? "" : `<div class="mon-info-subblock"><h4>${label}</h4><ul>${arr.map((m) => renderMoveLine(gameKey, m)).join("")}</ul></div>`;
	return moves && (moves.levelUp || moves.tm || moves.egg) ? `<div class="mon-info-block"><h3>Move Pool</h3><div class="mon-info-moves-grid">${movesSection("Level-up", moves.levelUp)}${movesSection("TM / TR", moves.tm)}${movesSection("Egg Moves", moves.egg)}</div></div>` : "";
}

export function renderCompletionTopHtml({ gameKey, mon, resolvedInfo, dexStatusClass, dexStatusLabel, researchProg, researchState, canOpenResearch, isLegendsArceus } = {}) {
	const maxStatusRaw = resolvedInfo?.maxStatus ?? mon?.maxStatus ?? (mon?.tags && (mon.tags.maxStatus || mon.tags.maxstatus)) ?? null;
	const maxStatus = maxStatusRaw == null ? null : String(maxStatusRaw).toLowerCase();
	const computeAvailabilityFromMaxStatus = () => {
		if (!maxStatus) return { shiny: true, alpha: true };
		if (maxStatus === "caught") return { shiny: false, alpha: false };
		if (maxStatus === "shiny") return { shiny: true, alpha: false };
		return { shiny: true, alpha: true };
	};
	const avail = computeAvailabilityFromMaxStatus();
	const showAlphaPill = gameKey === "legendsarceus" || gameKey === "legendsza";
	const pillCount = 1 + (isLegendsArceus && researchProg.tasks ? 1 : 0) + 1 + (showAlphaPill ? 1 : 0);
	const pillCols = Math.min(4, Math.max(2, pillCount));
	return `<div class="mon-info-completion-grid" style="grid-template-columns: repeat(${pillCols}, minmax(0, 1fr));"><button class="mon-info-pill ${dexStatusClass}" type="button" data-pill="dexStatus"><span class="pill-title">${dexStatusLabel}</span></button>${isLegendsArceus && researchProg.tasks ? `<button class="mon-info-pill ${researchState === "gold" ? "is-gold" : researchState === "green" ? "is-green" : "is-red"} ${canOpenResearch ? "is-clickable" : ""}" type="button" data-pill="research" title="${canOpenResearch ? "Open Research Tasks" : "Research modal not available for this entry"}"><span class="pill-title">Research</span><span class="pill-sub">${Number(researchProg.researchLevel || 0)}</span></button>` : ``}<button class="mon-info-pill ${avail.shiny ? "is-green" : "is-red"}" type="button" data-pill="shinyAvail"><span class="pill-title">${avail.shiny ? "Can be Shiny" : "Cannot be Shiny"}</span></button>${showAlphaPill ? `<button class="mon-info-pill ${avail.alpha ? "is-green" : "is-red"}" type="button" data-pill="alphaAvail"><span class="pill-title">${avail.alpha ? "Can be Alpha" : "Cannot be Alpha"}</span></button>` : `<div></div>`}</div>`;
}

export function renderVariantsHtml(resolvedInfo = {}) {
	const variants = resolvedInfo?.variants || resolvedInfo?.specialVariants || {};
	const forms = variants.forms ?? resolvedInfo?.forms ?? null;
	const regional = variants.regional ?? variants.regionalForms ?? resolvedInfo?.regionalForms ?? null;
	const mega = variants.mega ?? variants.megaForms ?? resolvedInfo?.megaForms ?? null;
	const gmax = variants.gmax ?? variants.gigantamax ?? resolvedInfo?.gigantamax ?? null;
	const other = variants.other ?? variants.otherForms ?? null;
	return forms || regional || mega || gmax || other ? `<div class="mon-info-block"><h3>Forms &amp; Variants</h3>${renderListRow("Forms", forms)}${renderListRow("Regional", regional)}${renderListRow("Mega", mega)}${renderListRow("Gigantamax", gmax)}${renderListRow("Other", other)}</div>` : "";
}

export function renderNotesHtml(resolvedInfo = {}) {
	return Array.isArray(resolvedInfo?.notes) && resolvedInfo.notes.filter(Boolean).length ? `<div class="mon-info-block"><h3>Notes</h3><ul class="mon-info-notes">${resolvedInfo.notes.filter((n) => n != null && n !== "").map((n) => `<li>${n}</li>`).join("")}</ul></div>` : "";
}

export function renderProfileHtml({ resolvedInfo = {}, fallbackInfo = {}, abilities = [], eggGroups = [], expGroup = null, baseEggSteps = null } = {}) {
	const sizeObj = resolvedInfo?.size || {};
	const height = sizeObj.height ?? resolvedInfo?.height ?? null;
	const weight = sizeObj.weight ?? resolvedInfo?.weight ?? null;
	const genderObj = resolvedInfo?.gender || null;
	const genderRatioText = genderObj && (genderObj.maleRatio != null || genderObj.femaleRatio != null) ? `${genderObj.maleRatio ?? "?"}% ♂ / ${genderObj.femaleRatio ?? "?"}% ♀` : resolvedInfo?.genderRatio ?? null;
	const baseFriendshipProfile = resolvedInfo?.battle?.baseFriendship ?? resolvedInfo?.baseFriendship ?? fallbackInfo?.baseHappiness ?? null;
	const renderProfileItem = (label, valueOrArr) => {
		if (valueOrArr == null) return "";
		if (Array.isArray(valueOrArr)) {
			const cleaned = valueOrArr.filter((v) => v != null && v !== "");
			if (!cleaned.length) return "";
			const itemsHtml = cleaned.map((v) => `<span class="value-line">${v}</span>`).join("");
			return `<div class="mon-info-profile-item"><div class="label">${label}</div><div class="value value--stacked">${itemsHtml}</div></div>`;
		}
		const v = String(valueOrArr);
		if (!v) return "";
		const itemHtml = label === "Base Friendship" ? `<div class="value">${v} / 255</div>` : `<div class="value">${v}</div>`;
		return `<div class="mon-info-profile-item"><div class="label">${label}</div>${itemHtml}</div>`;
	};
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
	return resolvedInfo ? `<div class="mon-info-block mon-info-profile"><h3>Profile</h3><div class="mon-info-profile-grid">${profileItems}</div></div>` : "";
}
