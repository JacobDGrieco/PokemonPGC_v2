import { assetPath } from "../utils/assetPath.js";
import {
	buildMonInfoStatSeries,
	MON_INFO_STAT_LABEL_RADIUS_OFFSET,
	MON_INFO_STAT_VIEW_BOX,
} from "../utils/monInfoStats.js";
import { parseMonInfoGenderRatio } from "../utils/monInfoProfile.js";
import {
	moveGroupDisplayLabel,
	moveMetadataParts,
	moveTypeIconSource,
	referenceEntryHref,
} from "../utils/moveReference.js";
import {
	buildEeveeEvolutionWheel,
	buildEvolutionForest,
	evolutionRequirementPresentation,
	evolutionTargetId,
	resolveEvolutionTargetForm,
} from "../utils/monInfoEvolution.js";
import { pokemonSpriteCandidates } from "../utils/pokemonSprite.js";

// This renderer is loaded on demand, so its feature-specific styles should be
// loaded on demand too instead of increasing the homepage CSS payload.
if (typeof document !== "undefined") {
	void import("../../styles/mon-info-evolution.css");
}

export function renderListRow(label, valueOrArr) {
	if (valueOrArr == null) return "";

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

	const v = valueOrArr;
	if (v === "") return "";
	return `
	  <div class="mon-info-row">
		<span class="label">${label}</span>
		<span class="value">${v}</span>
	  </div>`;
}

function renderRadarBlock({ title, statsObj, evObj } = {}) {
	if (!statsObj) return "";
	const statSeries = buildMonInfoStatSeries(statsObj, evObj);
	const values = statSeries.map((stat) => stat.value);
	const maxVal = Math.max(...values, 1);
	const total = values.reduce((sum, v) => sum + v, 0);
	const center = 50;
	const radius = 65;

	const points = statSeries.map((stat, idx) => {
		const v = stat.value;
		const ratio = v / maxVal;
		const r = radius * ratio;
		const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / statSeries.length;
		const x = center + r * Math.cos(angle);
		const y = center + r * Math.sin(angle);
		return { ...stat, x, y, r, angle };
	});

	const polygonPoints = points
		.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
		.join(" ");
	const gridLevels = [0.33, 0.66, 1];
	const gridPolys = gridLevels
		.map((lvl) => {
			const pts = statSeries
				.map((_, i) => {
					const r = radius * lvl;
					const angle =
						-Math.PI / 2 + (i * 2 * Math.PI) / statSeries.length;
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
				`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1.6" class="stat-vertex-dot" />`,
		)
		.join("");

	const labelRadius = radius + MON_INFO_STAT_LABEL_RADIUS_OFFSET;
	const labelsSvg = points
		.map((p) => {
			const lx = center + labelRadius * Math.cos(p.angle);
			const ly = center + labelRadius * Math.sin(p.angle);
			return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" class="stat-label" text-anchor="middle" dominant-baseline="central">${p.label}</text><text x="${lx.toFixed(1)}" y="${(ly + 9).toFixed(1)}" class="stat-value" text-anchor="middle" dominant-baseline="central">${p.displayValue}</text>`;
		})
		.join("");

	const totalSvg = `<text x="${center}" y="${center}" class="stat-total" text-anchor="middle" dominant-baseline="central">${total}</text>`;

	return `
	  <div class="mon-info-block mon-info-stats">
		<h3>${title}</h3>
		<div class="mon-info-stats-graph">
		  <svg viewBox="${MON_INFO_STAT_VIEW_BOX}" class="mon-info-stats-radar" aria-hidden="true">
			${gridPolys}
			<polygon points="${polygonPoints}" class="stat-radar-fill" />
			${vertexDots}
			${labelsSvg}
			${totalSvg}
		  </svg>
		</div>
	  </div>
	`;
}

export const renderStatsRadar = (statsObj, evObj = null) =>
	renderRadarBlock({ title: "Base Stats and EV Yield", statsObj, evObj });

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
	Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
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

function normalizeTypeName(t) {
	if (!t) return null;
	const s = String(t).toLowerCase();
	return s.charAt(0).toUpperCase() + s.slice(1);
}

export function renderTypeChart(types = []) {
	const defTypes = (types || []).map(normalizeTypeName).filter(Boolean);
	if (!defTypes.length) return "";

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
						`<th><span class="type-abbr type-${t.toLowerCase()}">${ABBR[t]}</span></th>`,
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
			return `<table class="type-table-pokedex"><thead><tr>${head}</tr></thead><tbody><tr>${body}</tr></tbody></table>`;
		})
		.join("");

	return `<div class="mon-info-block mon-info-typechart"><h3>Type Defenses</h3><div class="typechart-matrix">${tablesHtml}</div></div>`;
}

export function renderEvolutionHtml(
	evolution,
	dexList = [],
	{ gameKey = null, currentNatiId = null, currentFormKey = null } = {},
) {
	const forest = buildEvolutionForest(evolution, { gameKey });
	if (!forest.length) return "";
	const wheelLayout = buildEeveeEvolutionWheel(forest);
	const escapeHtml = (value) =>
		String(value ?? "")
			.replaceAll("&", "&amp;")
			.replaceAll('"', "&quot;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;");
	const findDexEntry = (step) => {
		const targetId = evolutionTargetId(step);
		return (
			dexList.find(
				(entry) =>
					entry &&
					Number(entry.natiId ?? entry.id) === Number(targetId),
			) || null
		);
	};
	const connectorDirection = (branchIndex, branchCount) => {
		const midpoint = (branchCount - 1) / 2;
		if (branchIndex < midpoint) return "up";
		if (branchIndex > midpoint) return "down";
		return "straight";
	};
	const requirementHtml = (step, direction, style = "") => {
		const presentation = evolutionRequirementPresentation(step, gameKey);
		if (!presentation.label && !presentation.item) return "";
		return `<span class="evolution-requirement is-${direction}${presentation.item ? " has-item" : ""}"${style ? ` style="${style}"` : ""}>${presentation.item ? `<img class="evolution-item-icon" src="${escapeHtml(presentation.item.src)}" alt="" title="${escapeHtml(presentation.item.name)}" loading="lazy" />` : ""}<span class="evolution-requirement-copy"><strong>${escapeHtml(presentation.label)}</strong>${presentation.detail ? `<small>${escapeHtml(presentation.detail)}</small>` : ""}</span></span>`;
	};
	const connectorHtml = (step, direction) => {
		const path =
			direction === "up"
				? "M4 64 L104 8"
				: direction === "down"
					? "M4 8 L104 64"
					: "M4 36 L104 36";
		const arrowhead =
			direction === "up"
				? "84,8 104,8 95,26"
				: direction === "down"
					? "84,64 104,64 95,46"
					: "86,24 104,36 86,48";
		return `<div class="evolution-connector is-${direction}">${requirementHtml(step, direction)}<svg class="evolution-arrow" viewBox="0 0 108 72" preserveAspectRatio="none" aria-hidden="true"><path d="${path}"></path><polyline points="${arrowhead}"></polyline></svg></div>`;
	};
	const nodeButtonHtml = (node) => {
		const step = node.step;
		const targetId = evolutionTargetId(step);
		const targetFormKey = resolveEvolutionTargetForm({
			step,
			gameKey,
			currentFormKey,
		});
		const entry = findDexEntry(step);
		const spriteCandidates = pokemonSpriteCandidates({
			nationalDexId: targetId,
			formKey: targetFormKey,
			gameKey,
		});
		const imageSource = step?.sprite || spriteCandidates[0] || entry?.img;
		const isCurrent =
			targetId === Number(currentNatiId) &&
			(!targetFormKey || targetFormKey === currentFormKey);
		const name = step?.name || `#${targetId || "?"}`;
		return `<button type="button" class="evolution-node${isCurrent ? " is-current" : ""}" ${isCurrent ? 'aria-current="page"' : ""} ${targetId ? `data-evolution-id="${targetId}" data-evolution-form="${escapeHtml(targetFormKey || "")}"` : "disabled"}>${imageSource ? `<img class="evolution-pokemon-icon" src="${escapeHtml(imageSource)}" alt="" loading="lazy" />` : ""}<span class="evolution-name">${escapeHtml(name)}</span></button>`;
	};
	const nodeHtml = (node) => {
		const branches = node.children
			.map((child, branchIndex) => {
				const direction = connectorDirection(
					branchIndex,
					node.children.length,
				);
				return `<div class="evolution-branch">${connectorHtml(child.step, direction)}${nodeHtml(child)}</div>`;
			})
			.join("");
		return `<div class="evolution-tree-node-wrap">${nodeButtonHtml(node)}${branches ? `<div class="evolution-branches${node.children.length > 1 ? " is-split" : ""}">${branches}</div>` : ""}</div>`;
	};
	const wheelHtml = wheelLayout
		? `<div class="evolution-wheel" style="width:${wheelLayout.size}px;height:${wheelLayout.size}px"><svg class="evolution-wheel-arrows" viewBox="0 0 ${wheelLayout.size} ${wheelLayout.size}" aria-hidden="true">${wheelLayout.branches.map((branch) => `<g><line x1="${branch.startX}" y1="${branch.startY}" x2="${branch.endX}" y2="${branch.endY}"></line><polyline points="${branch.arrowPoints}"></polyline></g>`).join("")}</svg><div class="evolution-wheel-node is-center" style="left:${wheelLayout.center}px;top:${wheelLayout.center}px">${nodeButtonHtml(wheelLayout.root)}</div>${wheelLayout.branches.map((branch) => `${requirementHtml(branch.node.step, "radial", `left:${branch.labelX}px;top:${branch.labelY}px`)}<div class="evolution-wheel-node" style="left:${branch.nodeX}px;top:${branch.nodeY}px">${nodeButtonHtml(branch.node)}</div>`).join("")}</div>`
		: "";
	return `<div class="mon-info-block mon-info-evo-block"><h3>Evolution</h3><div class="evolution-tree-scroll${wheelLayout ? " has-wheel" : ""}">${wheelHtml || `<div class="evolution-forest">${forest.map(nodeHtml).join("")}</div>`}</div></div>`;
}

export function renderLocationsHtml({
	locations = [],
	resolvedInfo = {},
} = {}) {
	const locEncounterRarity = resolvedInfo?.encounter?.rarity || null;
	const locCatchRate = resolvedInfo?.catchRate || null;
	const formatCatchRate = (v) => {
		if (v == null || v === "") return null;
		const s = String(v).trim();
		if (s.includes("/")) return s;
		const n = Number(s);
		const percent = ((n / 225) * 100).toFixed(2);
		if (Number.isFinite(n)) return `${n} / 225 (${percent}%)`;
		return s;
	};
	if (!Array.isArray(locations) || !locations.length) return "";
	const renderMetaItem = (label, value) =>
		value == null || value === ""
			? ""
			: `<div class="mon-info-profile-item"><div class="label">${label}</div><div class="value">${value}</div></div>`;
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
			const extra = [];
			if (loc.rarity) extra.push(`Rarity: ${loc.rarity}`);
			if (loc.rate != null) extra.push(`Rate: ${loc.rate}`);
			const extraText = extra.length
				? ` <span class="mon-info-locations-extra">(${extra.join(", ")})</span>`
				: "";
			if (area && notes)
				return `<li><strong>${area}</strong> — ${notes}${extraText}</li>`;
			return `<li>${area || notes}${extraText}</li>`;
		})
		.join("");
	return `<div class="mon-info-block mon-info-locations"><h3>Locations</h3>${metaHtml ? `<div class="mon-info-locations-meta">${metaHtml}</div>` : ""}<ul class="mon-info-locations-list">${items}</ul></div>`;
}

function renderMoveLine(m) {
	const text = typeof m === "string" ? m : m.name || m.move || "Unknown move";
	const type = typeof m === "object" ? m.type : null;
	const typeIconSrc = moveTypeIconSource(type);
	const metadata = moveMetadataParts(m).join(" • ");
	return `<li class="mon-info-move"><a class="react-move-label mon-info-reference-link" href="${referenceEntryHref("moves", text)}">${typeIconSrc ? `<img class="react-move-type-icon" src="${typeIconSrc}" alt="${type} type" title="${type} type" loading="lazy" height="20" />` : ""}<span class="mon-info-move-name">${text}</span></a>${metadata ? `<small>${metadata}</small>` : ""}</li>`;
}
export function renderMovesHtml({ moves = {} } = {}) {
	const movesSection = (label, arr) =>
		!arr || !arr.length
			? ""
			: `<div class="mon-info-subblock"><h4>${label}</h4><ul>${arr.map((move) => renderMoveLine(move)).join("")}</ul></div>`;
	const sections = Object.entries(moves)
		.map(([learnMethod, entries]) =>
			movesSection(moveGroupDisplayLabel(learnMethod, entries), entries),
		)
		.join("");
	return sections
		? `<div class="mon-info-block"><h3>Move Pool</h3><div class="mon-info-moves-grid">${sections}</div></div>`
		: "";
}

export function renderCompletionTopHtml({
	gameKey,
	mon,
	resolvedInfo,
	dexStatusClass,
	dexStatusLabel,
	researchProg,
	researchState,
	canOpenResearch,
	isLegendsArceus,
} = {}) {
	const maxStatusRaw =
		resolvedInfo?.maxStatus ??
		mon?.maxStatus ??
		(mon?.tags && (mon.tags.maxStatus || mon.tags.maxstatus)) ??
		null;
	const maxStatus =
		maxStatusRaw == null ? null : String(maxStatusRaw).toLowerCase();
	const computeAvailabilityFromMaxStatus = () => {
		if (!maxStatus) return { shiny: true, alpha: true };
		if (maxStatus === "caught") return { shiny: false, alpha: false };
		if (maxStatus === "shiny") return { shiny: true, alpha: false };
		return { shiny: true, alpha: true };
	};
	const avail = computeAvailabilityFromMaxStatus();
	const showAlphaPill =
		gameKey === "legendsarceus" || gameKey === "legendsza";
	const pillCount =
		1 +
		(isLegendsArceus && researchProg.tasks ? 1 : 0) +
		1 +
		(showAlphaPill ? 1 : 0);
	const pillCols = Math.min(4, Math.max(2, pillCount));
	return `<div class="mon-info-completion-grid" style="grid-template-columns: repeat(${pillCols}, minmax(0, 1fr));"><button class="mon-info-pill ${dexStatusClass}" type="button" data-pill="dexStatus"><span class="pill-title">${dexStatusLabel}</span></button>${isLegendsArceus && researchProg.tasks ? `<button class="mon-info-pill ${researchState === "gold" ? "is-gold" : researchState === "green" ? "is-green" : "is-red"} ${canOpenResearch ? "is-clickable" : ""}" type="button" data-pill="research" title="${canOpenResearch ? "Open Research Tasks" : "Research modal not available for this entry"}"><span class="pill-title">Research</span><span class="pill-sub">${Number(researchProg.researchLevel || 0)}</span></button>` : ``}<button class="mon-info-pill ${avail.shiny ? "is-green" : "is-red"}" type="button" data-pill="shinyAvail"><span class="pill-title">${avail.shiny ? "Can be Shiny" : "Cannot be Shiny"}</span></button>${showAlphaPill ? `<button class="mon-info-pill ${avail.alpha ? "is-green" : "is-red"}" type="button" data-pill="alphaAvail"><span class="pill-title">${avail.alpha ? "Can be Alpha" : "Cannot be Alpha"}</span></button>` : `<div></div>`}</div>`;
}

export function renderVariantsHtml(resolvedInfo = {}) {
	const variants =
		resolvedInfo?.variants || resolvedInfo?.specialVariants || {};
	const forms = variants.forms ?? resolvedInfo?.forms ?? null;
	const regional =
		variants.regional ??
		variants.regionalForms ??
		resolvedInfo?.regionalForms ??
		null;
	const mega =
		variants.mega ?? variants.megaForms ?? resolvedInfo?.megaForms ?? null;
	const gmax =
		variants.gmax ??
		variants.gigantamax ??
		resolvedInfo?.gigantamax ??
		null;
	const other = variants.other ?? variants.otherForms ?? null;
	return forms || regional || mega || gmax || other
		? `<div class="mon-info-block"><h3>Forms &amp; Variants</h3>${renderListRow("Forms", forms)}${renderListRow("Regional", regional)}${renderListRow("Mega", mega)}${renderListRow("Gigantamax", gmax)}${renderListRow("Other", other)}</div>`
		: "";
}

export function renderNotesHtml(resolvedInfo = {}) {
	return Array.isArray(resolvedInfo?.notes) &&
		resolvedInfo.notes.filter(Boolean).length
		? `<div class="mon-info-block"><h3>Notes</h3><ul class="mon-info-notes">${resolvedInfo.notes
				.filter((n) => n != null && n !== "")
				.map((n) => `<li>${n}</li>`)
				.join("")}</ul></div>`
		: "";
}

function renderGenderRatioValue(value) {
	const ratio = parseMonInfoGenderRatio(value);
	if (!ratio) return "";
	if (ratio.text) return `<div class="value">${ratio.text}</div>`;
	return `<div class="value" aria-label="${ratio.male}% male, ${ratio.female}% female"><span style="color:oklch(72% 0.16 250)"><span aria-hidden="true">♂</span> ${ratio.male}%</span> <span aria-hidden="true">/</span> <span style="color:oklch(76% 0.16 350)"><span aria-hidden="true">♀</span> ${ratio.female}%</span></div>`;
}

export function renderProfileHtml({
	resolvedInfo = {},
	fallbackInfo = {},
	abilities = [],
	eggGroups = [],
	expGroup = null,
	baseEggSteps = null,
} = {}) {
	const sizeObj = resolvedInfo?.size || {};
	const height = sizeObj.height ?? resolvedInfo?.height ?? null;
	const weight = sizeObj.weight ?? resolvedInfo?.weight ?? null;
	const genderObj = resolvedInfo?.gender || null;
	const genderRatioText =
		genderObj &&
		(genderObj.maleRatio != null || genderObj.femaleRatio != null)
			? `${genderObj.maleRatio ?? "?"}% ♂ / ${genderObj.femaleRatio ?? "?"}% ♀`
			: (resolvedInfo?.genderRatio ?? null);
	const baseFriendshipProfile =
		resolvedInfo?.battle?.baseFriendship ??
		resolvedInfo?.baseFriendship ??
		fallbackInfo?.baseHappiness ??
		null;
	const battle = resolvedInfo?.battle || {};
	const captureRate =
		battle.captureRate ??
		resolvedInfo?.captureRate ??
		fallbackInfo?.captureRate ??
		null;
	const baseExperience =
		battle.baseExperience ??
		resolvedInfo?.baseExperience ??
		fallbackInfo?.baseExperience ??
		null;
	const renderProfileItem = (label, valueOrArr) => {
		if (valueOrArr == null) return "";
		if (Array.isArray(valueOrArr)) {
			const cleaned = valueOrArr.filter((v) => v != null && v !== "");
			if (!cleaned.length) return "";
			const itemsHtml = cleaned
				.map((v) =>
					label === "Abilities"
						? `<a class="value-line mon-info-reference-link" href="${referenceEntryHref("abilities", v)}">${v}</a>`
						: `<span class="value-line">${v}</span>`,
				)
				.join("");
			return `<div class="mon-info-profile-item"><div class="label">${label}</div><div class="value value--stacked">${itemsHtml}</div></div>`;
		}
		const v = String(valueOrArr);
		if (!v) return "";
		if (label === "Gender Ratio") {
			return `<div class="mon-info-profile-item"><div class="label">${label}</div>${renderGenderRatioValue(valueOrArr)}</div>`;
		}
		const itemHtml =
			label === "Base Friendship"
				? `<div class="value">${v} / 255</div>`
				: `<div class="value">${v}</div>`;
		return `<div class="mon-info-profile-item"><div class="label">${label}</div>${itemHtml}</div>`;
	};
	const primaryProfileItems = [
		renderProfileItem("Abilities", abilities),
		renderProfileItem("Egg Groups", eggGroups),
		renderProfileItem(
			"Base Egg Steps",
			baseEggSteps != null ? baseEggSteps : null,
		),
		renderProfileItem("Catch Rate", captureRate),
		renderProfileItem("Base Friendship", baseFriendshipProfile),
		renderProfileItem("Exp Growth", expGroup),
	]
		.filter(Boolean)
		.join("");
	const secondaryProfileItems = [
		renderProfileItem("Height", height),
		renderProfileItem("Weight", weight),
		renderProfileItem("Gender Ratio", genderRatioText),
		renderProfileItem("Base Experience", baseExperience),
		renderProfileItem("Habitat", resolvedInfo?.habitat ?? null),
		renderProfileItem("Shape", resolvedInfo?.shape ?? null),
		renderProfileItem("Color", resolvedInfo?.color ?? null),
		renderProfileItem("Species", resolvedInfo?.genus ?? null),
	]
		.filter(Boolean)
		.join("");
	return resolvedInfo && (primaryProfileItems || secondaryProfileItems)
		? `<div class="mon-info-block mon-info-profile"><h3>Profile</h3><div class="mon-info-profile-grid"><div class="mon-info-profile-column is-primary">${primaryProfileItems}</div><div class="mon-info-profile-column is-secondary">${secondaryProfileItems}</div></div></div>`
		: "";
}
