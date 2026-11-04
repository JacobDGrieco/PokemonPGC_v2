/** Shared evolution-tree, requirement, item-art, and form-routing helpers. */
import { _imageByGen } from "../../data/helpers/images.js";
import { machineSpriteGenerationForGameKey } from "../../data/reference-indexes/game-mapping.js";
import { getMonInfoManifestSpecies } from "../../data/mon-info/manifest.js";
import {
	getMonInfoFormOptions,
	resolveMonInfoFormForGame,
} from "./monInfoForms.js";

const ITEM_REQUIREMENT_METHODS = new Set([
	"level up",
	"spin",
	"trade",
	"use item",
]);

const ITEM_DISPLAY_NAMES = new Map([
	["kings-rock", "King's Rock"],
	["up-grade", "Up-Grade"],
]);

function evolutionStepId(step) {
	const rawId =
		step?.natiId ?? step?.natId ?? step?.nationalId ?? step?.id ?? null;
	const numericId = Number(rawId);
	return Number.isFinite(numericId) && numericId > 0 ? numericId : null;
}

function explicitEvolutionFormKey(step) {
	return step?.formKey ?? step?.form ?? step?.targetFormKey ?? null;
}

function evolutionNodeKey(step) {
	return [
		evolutionStepId(step) ?? String(step?.name || "unknown").toLowerCase(),
		explicitEvolutionFormKey(step) || "",
	].join(":");
}

/** Accept current and legacy evolution payload shapes as complete root-to-leaf paths. */
export function normalizeEvolutionPaths(evolution) {
	if (!evolution) return [];
	if (Array.isArray(evolution.paths) && evolution.paths.length) {
		return evolution.paths
			.map((path) => (Array.isArray(path) ? path.filter(Boolean) : []))
			.filter((path) => path.length);
	}
	if (Array.isArray(evolution.chain) && evolution.chain.length) {
		return Array.isArray(evolution.chain[0])
			? evolution.chain
					.map((path) =>
						Array.isArray(path) ? path.filter(Boolean) : [],
					)
					.filter((path) => path.length)
			: [evolution.chain.filter(Boolean)];
	}
	if (Array.isArray(evolution.shared) && Array.isArray(evolution.branches)) {
		const shared = evolution.shared.filter(Boolean);
		return evolution.branches
			.map((branch) =>
				shared.concat(
					Array.isArray(branch)
						? branch.filter(Boolean)
						: branch && typeof branch === "object"
							? [branch]
							: [],
				),
			)
			.filter((path) => path.length);
	}
	if (Array.isArray(evolution.branches)) {
		return evolution.branches
			.map((branch) =>
				Array.isArray(branch)
					? branch.filter(Boolean)
					: branch && typeof branch === "object"
						? [branch]
						: [],
			)
			.filter((path) => path.length);
	}
	if (Array.isArray(evolution) && Array.isArray(evolution[0])) {
		return evolution
			.map((path) => path.filter(Boolean))
			.filter((path) => path.length);
	}
	return [];
}

/** Merge duplicated root-to-leaf paths into a tree without losing edge requirements. */
export function isEvolutionStepAvailableInGame(step, gameKey) {
	if (!gameKey) return true;
	const targetId = evolutionStepId(step);
	if (!targetId) return false;
	const species = getMonInfoManifestSpecies(targetId);
	if (!species) return true;
	return species.gameKeys?.includes(String(gameKey)) ?? true;
}

export function buildEvolutionForest(evolution, { gameKey = null } = {}) {
	const roots = [];
	for (const rawPath of normalizeEvolutionPaths(evolution)) {
		// Removing unavailable stages also handles later-introduced babies: a
		// Gen I Pikachu chain starts at Pikachu instead of showing Pichu.
		const path = rawPath.filter((step) =>
			isEvolutionStepAvailableInGame(step, gameKey),
		);
		if (!path.length) continue;
		let siblings = roots;
		for (const step of path) {
			const key = evolutionNodeKey(step);
			let node = siblings.find((candidate) => candidate.key === key);
			if (!node) {
				node = { key, step, children: [] };
				siblings.push(node);
			}
			siblings = node.children;
		}
	}
	return roots;
}

/**
 * Build Eevee's radial layout only after both Johto evolutions are available.
 * Earlier games retain the compact linear branch presentation.
 */
export function buildEeveeEvolutionWheel(forest) {
	if (!Array.isArray(forest) || forest.length !== 1) return null;
	const root = forest[0];
	if (evolutionStepId(root?.step) !== 133) return null;
	const childIds = new Set(
		root.children.map((child) => evolutionStepId(child.step)),
	);
	if (!childIds.has(196) || !childIds.has(197)) return null;

	const childCount = root.children.length;
	const size = childCount >= 7 ? 720 : 640;
	const center = size / 2;
	const radius = childCount >= 7 ? 280 : 235;
	const nodeClearance = 62;
	const labelRadius = radius * 0.54;
	const round = (value) => Math.round(value * 100) / 100;

	return {
		root,
		size,
		center,
		branches: root.children.map((node, index) => {
			const angle = -Math.PI / 2 + (index * Math.PI * 2) / childCount;
			const unitX = Math.cos(angle);
			const unitY = Math.sin(angle);
			const perpendicularX = -unitY;
			const perpendicularY = unitX;
			const endX = center + unitX * (radius - nodeClearance);
			const endY = center + unitY * (radius - nodeClearance);
			const arrowBaseX = endX - unitX * 16;
			const arrowBaseY = endY - unitY * 16;

			return {
				node,
				nodeX: round(center + unitX * radius),
				nodeY: round(center + unitY * radius),
				startX: round(center + unitX * nodeClearance),
				startY: round(center + unitY * nodeClearance),
				endX: round(endX),
				endY: round(endY),
				arrowPoints: [
					`${round(arrowBaseX + perpendicularX * 8)},${round(arrowBaseY + perpendicularY * 8)}`,
					`${round(endX)},${round(endY)}`,
					`${round(arrowBaseX - perpendicularX * 8)},${round(arrowBaseY - perpendicularY * 8)}`,
				].join(" "),
				labelX: round(
					center + unitX * labelRadius + perpendicularX * 16,
				),
				labelY: round(
					center + unitY * labelRadius + perpendicularY * 16,
				),
			};
		}),
	};
}

export function evolutionTargetId(step) {
	return evolutionStepId(step);
}

/**
 * Honor explicit target forms first. Generated data currently omits them, so a
 * regional form is preserved only when that same key exists for the target.
 */
export function resolveEvolutionTargetForm({
	step,
	gameKey,
	currentFormKey = null,
} = {}) {
	const targetId = evolutionStepId(step);
	if (!targetId) return null;
	const requestedForm = explicitEvolutionFormKey(step);
	if (requestedForm != null) {
		return resolveMonInfoFormForGame(targetId, gameKey, requestedForm);
	}
	const options = getMonInfoFormOptions(targetId, gameKey);
	if (
		currentFormKey &&
		options.some((option) => option.key === String(currentFormKey))
	) {
		return String(currentFormKey);
	}
	return resolveMonInfoFormForGame(targetId, gameKey, null);
}

export function formatEvolutionRequirement(step) {
	if (!step) return "";
	const method = step.method != null ? String(step.method).trim() : "";
	const value = step.value != null ? String(step.value).trim() : "";
	if (!method && step.level != null) return `Lv. ${step.level}`;
	if (!method) return String(step.trigger || "");
	if (method.toLowerCase() === "level") {
		return value ? `Lv. ${value}` : "Level";
	}
	if (!value) return method;
	if (method.toLowerCase() === "use item") return `Use ${value}`;
	if (method.toLowerCase() === "trade") return `Trade with ${value}`;
	if (method.toLowerCase() === "level up") {
		return `Level up holding ${value}`;
	}
	if (method.toLowerCase() === "spin") return `Spin with ${value}`;
	if (method.toLowerCase() === "level up near") {
		return value ? `Level up near ${value}` : "Level up nearby";
	}
	if (method.toLowerCase().startsWith("level up with")) {
		return value ? `${method} ${value}` : method;
	}
	return `${method}: ${value}`;
}

export function evolutionItemSlug(value) {
	return String(value || "")
		.normalize("NFKD")
		.toLowerCase()
		.replace(/[’']/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/** Return generation-correct item artwork only for item-based requirements. */
export function evolutionRequirementItem(step, gameKey) {
	const method = String(step?.method || "").toLowerCase();
	const name = String(step?.value || "").trim();
	if (!name || !ITEM_REQUIREMENT_METHODS.has(method)) return null;
	const slug = evolutionItemSlug(name);
	if (!slug) return null;
	const category = method === "use item" ? "usable-items" : "held-items";
	return {
		name: ITEM_DISPLAY_NAMES.get(slug) || name,
		category,
		src: _imageByGen(
			category,
			machineSpriteGenerationForGameKey(gameKey),
			slug,
		),
	};
}

/** Split item requirements into a compact action label plus named item detail. */
export function evolutionRequirementPresentation(step, gameKey) {
	const item = evolutionRequirementItem(step, gameKey);
	const alternatives = Array.isArray(step?.alternatives)
		? step.alternatives
				.map((alternative) => formatEvolutionRequirement(alternative))
				.filter(Boolean)
		: [];
	if (!item) {
		return {
			label: formatEvolutionRequirement(step),
			detail: alternatives.length
				? `or ${alternatives.join(" or ")}`
				: null,
			item: null,
		};
	}
	const method = String(step?.method || "").toLowerCase();
	const label =
		method === "use item"
			? "Use item"
			: method === "level up"
				? "Level up"
				: method.charAt(0).toUpperCase() + method.slice(1);
	const detail = [
		item.name,
		...alternatives.map((value) => `or ${value}`),
	].join(" · ");
	return { label, detail, item };
}
