/** Lazy move-summary access keeps the reference catalog off critical routes. */
import { _hm, _tm, _tr } from "../../data/helpers/images.js";
import {
	machineSpriteGenerationForGameKey,
	versionGroupForGameKey,
} from "../../data/reference-indexes/game-mapping.js";
import { loadReferenceManifest } from "../../data/reference-indexes/_loader.js";
import { assetPath } from "./assetPath.js";

let moveManifestPromise = null;

export function normalizeReferenceLookupKey(value) {
	return String(value || "")
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[^a-z0-9]+/g, "");
}

export const normalizeMoveLookupKey = normalizeReferenceLookupKey;

export function referenceEntryHref(kind, value) {
	const referenceKind = kind === "abilities" ? "abilities" : "moves";
	const lookupValue =
		referenceKind === "abilities"
			? String(value || "").replace(/\s*\(Hidden\)\s*$/i, "")
			: value;
	const lookupKey = normalizeReferenceLookupKey(lookupValue);
	return lookupKey
		? `#/tools/${referenceKind}/${encodeURIComponent(lookupKey)}`
		: `#/tools/${referenceKind}`;
}

export async function loadMoveReferenceManifest() {
	moveManifestPromise ||= loadReferenceManifest("moves");
	return moveManifestPromise;
}

export function findMoveSummary(manifest, moveName) {
	if (!manifest || !moveName) return null;
	const slug = manifest.aliases?.[normalizeReferenceLookupKey(moveName)];
	return slug ? manifest.entries?.[slug] || null : null;
}

/** Resolve the existing HOME-style type icon, including its legacy Poison filename. */
export function moveTypeIconSource(type) {
	if (!type) return null;
	const normalizedType = String(type).trim().toLowerCase();
	if (!normalizedType) return null;
	const assetType = normalizedType === "poison" ? "posion" : normalizedType;
	return assetPath(`typings/${assetType}.png`);
}

export function moveMetadataParts(move) {
	if (!move || typeof move !== "object") return [];
	return [
		move.level != null ? `Lv. ${move.level}` : "",
		move.power != null ? `Pow ${move.power}` : "",
	].filter(Boolean);
}

export function moveGroupDisplayLabel(learnMethod, entries = []) {
	if (!/machine|tm|tr|hm/i.test(String(learnMethod || ""))) {
		return learnMethod;
	}
	const machineKinds = new Set(
		entries
			.map((entry) => String(entry?.machine?.kind || "").toUpperCase())
			.filter(Boolean),
	);
	const orderedKinds = ["TM", "TR", "HM"].filter((kind) =>
		machineKinds.has(kind),
	);
	if (orderedKinds.length) return orderedKinds.join(" / ");
	const explicitKinds = String(learnMethod || "")
		.toUpperCase()
		.match(/TM|TR|HM/g);
	return explicitKinds?.length
		? [...new Set(explicitKinds)].join(" / ")
		: "TM";
}

export function resolveMachinePresentation({
	manifest,
	moveName,
	learnMethod,
	gameKey,
}) {
	if (!/machine|tm|tr|hm/i.test(String(learnMethod || ""))) return null;
	const summary = findMoveSummary(manifest, moveName);
	const versionGroup = versionGroupForGameKey(gameKey);
	const machine = summary?.machines?.find(
		(candidate) => candidate.versionGroup === versionGroup,
	);
	const kind = String(machine?.kind || "TM").toUpperCase();
	const type = String(summary?.type || "Normal").toLowerCase();
	const generation = machineSpriteGenerationForGameKey(gameKey);
	const src =
		kind === "TR"
			? _tr(0, type)
			: kind === "HM"
				? _hm(generation, type)
				: _tm(generation, type);
	return {
		kind,
		number: machine?.number ?? null,
		type,
		src,
		label: `${kind}${machine?.number != null ? String(machine.number).padStart(2, "0") : ""} ${capitalize(type)}-type machine`,
	};
}

/** Add reference type and machine presentation without mutating source JSON. */
export function enrichMoveGroups(moves, gameKey, manifest) {
	if (!moves || typeof moves !== "object") return moves;
	return Object.fromEntries(
		Object.entries(moves).map(([learnMethod, entries]) => [
			learnMethod,
			(Array.isArray(entries) ? entries : []).map((entry) => {
				const normalizedEntry =
					typeof entry === "string" ? { name: entry } : { ...entry };
				const moveName = normalizedEntry.name || normalizedEntry.move;
				const summary = findMoveSummary(manifest, moveName);
				return {
					...normalizedEntry,
					type: normalizedEntry.type || summary?.type || null,
					machine: resolveMachinePresentation({
						manifest,
						moveName,
						learnMethod,
						gameKey,
					}),
				};
			}),
		]),
	);
}

function capitalize(value) {
	return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}
