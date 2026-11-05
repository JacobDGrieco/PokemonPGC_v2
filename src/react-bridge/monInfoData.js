import { ensureMonInfoLoaded } from "../../data/mon-info/_loader.js";
import { fetchPokeApiMonInfo } from "../services/pokeApi.js";
import {
	enrichMoveGroups,
	loadMoveReferenceManifest,
} from "../utils/moveReference.js";
import {
	getMonInfoFormOptions,
	getMonInfoFormOptionsForGames,
	resolveMonInfoFormForGame,
	resolveMonInfoFormForGames,
} from "../utils/monInfoForms.js";
import { monInfoLabelForGameKey } from "../utils/monInfoGames.js";
import { pokemonSpriteCandidates } from "../utils/pokemonSprite.js";
import { normalizeEvolutionPaths as normalizeSharedEvolutionPaths } from "../utils/monInfoEvolution.js";
import {
	mergeMonInfoReleaseLocations,
	normalizeMonInfoLocations,
} from "../utils/monInfoLocations.js";
import {
	monInfoAbilitiesForGame,
	monInfoEggStepsForGame,
	monInfoMechanicsForGame,
} from "../utils/monInfoProfile.js";
import {
	ALL_TYPES,
	TYPE_CHART,
	computeTypeDefenseBuckets,
} from "../utils/monInfoTypes.js";

export { getMonInfoFormOptions } from "../utils/monInfoForms.js";
export { ALL_TYPES, TYPE_CHART, computeTypeDefenseBuckets };

function resolveMonInfoBucket(gameKey) {
	const byGame = window.DATA?.monInfo || {};
	if (byGame && byGame[gameKey]) return byGame[gameKey];
	for (const [k, bucket] of Object.entries(byGame)) {
		if (typeof k === "string" && k.includes(",")) {
			const parts = k.split(",").map((s) => s.trim());
			if (parts.includes(gameKey)) return bucket;
		}
	}
	return null;
}

function mergeInfo(base, patch) {
	if (!patch) return base;
	if (!base) return patch;
	const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
	const out = { ...base };
	for (const k of Object.keys(patch)) {
		const pv = patch[k];
		const bv = base[k];
		out[k] = isObj(bv) && isObj(pv) ? mergeInfo(bv, pv) : pv;
	}
	return out;
}

/** Resolve one exact version after the species shard has registered all profiles. */
function resolveRegisteredGameInfo(gameKey, natId, mon, requestedFormKey) {
	const bucket = resolveMonInfoBucket(gameKey);
	const info =
		(natId != null && bucket?.[natId]) || bucket?.[mon?.id] || null;
	const effectiveFormKey = resolveMonInfoFormForGame(
		natId,
		gameKey,
		requestedFormKey,
	);
	const formOverride =
		effectiveFormKey && natId != null
			? window.DATA?.monInfoForms?.[gameKey]?.[natId]?.[
					effectiveFormKey
				] || null
			: null;

	return {
		gameKey,
		label: monInfoLabelForGameKey(gameKey),
		info,
		formOverride,
		effectiveFormKey,
		effectiveInfo: mergeInfo(info, formOverride),
		hasLocalInfo: Boolean(info || formOverride),
	};
}

export function normalizeMovesForRender(moves) {
	if (!moves || typeof moves !== "object") return [];
	return Object.entries(moves)
		.map(([learnMethod, entries]) => ({
			learnMethod,
			entries: Array.isArray(entries) ? entries : [],
		}))
		.filter((group) => group.entries.length);
}

export function normalizeLocationsForRender(locations) {
	return normalizeMonInfoLocations(locations);
}

export const normalizeEvolutionPaths = normalizeSharedEvolutionPaths;

export async function resolveMonInfoData({
	gameKey,
	gameKeys = [gameKey],
	mon,
	formKey = null,
} = {}) {
	const natId = mon?.natiId ?? mon?.natId ?? mon?.nationalId ?? null;
	const key = natId ?? mon?.id;
	const formOptions = getMonInfoFormOptionsForGames(natId, gameKeys);
	const effectiveFormKey = resolveMonInfoFormForGames(
		natId,
		gameKeys,
		formKey,
	);

	await ensureMonInfoLoaded(key, effectiveFormKey);

	const candidateGameKeys = [
		...new Set([gameKey, ...gameKeys].filter(Boolean)),
	];
	const formGameKeys = candidateGameKeys.filter((exactGameKey) =>
		getMonInfoFormOptions(natId, exactGameKey).some(
			(option) => option.key === effectiveFormKey,
		),
	);
	const exactGameKeys = formGameKeys.length
		? formGameKeys
		: candidateGameKeys;
	const registeredGameEntries = exactGameKeys.map((exactGameKey) =>
		resolveRegisteredGameInfo(exactGameKey, natId, mon, effectiveFormKey),
	);
	const primaryGameEntry =
		registeredGameEntries.find((entry) => entry.gameKey === gameKey) ||
		registeredGameEntries[0];
	const info = primaryGameEntry?.info || null;
	const formOverride = primaryGameEntry?.formOverride || null;
	const effectiveInfo = primaryGameEntry?.effectiveInfo || null;
	const fallbackInfo =
		!effectiveInfo && natId != null
			? await fetchPokeApiMonInfo(natId)
			: null;
	const resolvedInfo = mergeInfo(fallbackInfo, effectiveInfo);
	const gameEntries = registeredGameEntries
		.filter((entry) => entry.hasLocalInfo || entry.gameKey === gameKey)
		.map((entry) => ({
			gameKey: entry.gameKey,
			label: entry.label,
			resolvedInfo:
				entry.gameKey === gameKey
					? mergeInfo(fallbackInfo, entry.effectiveInfo)
					: entry.effectiveInfo,
		}));
	const releaseLocations = mergeMonInfoReleaseLocations(
		gameEntries.map((entry) => entry.resolvedInfo),
	);
	const moveManifest = resolvedInfo?.moves
		? await loadMoveReferenceManifest()
		: null;
	const enrichedMoves = enrichMoveGroups(
		resolvedInfo?.moves,
		gameKey,
		moveManifest,
	);
	const types = resolvedInfo?.types || mon?.types || [];
	const spriteCandidates = [
		resolvedInfo?.sprites?.front,
		...pokemonSpriteCandidates({
			nationalDexId: natId,
			formKey: effectiveFormKey,
			gameKey,
		}),
		mon?.img,
	].filter((candidate, index, candidates) =>
		candidate ? candidates.indexOf(candidate) === index : false,
	);
	const spriteSrc = spriteCandidates[0] || null;
	const baseStats = resolvedInfo?.baseStats || mon?.baseStats || null;
	const evYield = resolvedInfo?.evYield || null;
	const battle = resolvedInfo?.battle || {};
	const mechanics = monInfoMechanicsForGame(gameKey);
	const eggGroups = mechanics.hasBreeding
		? resolvedInfo?.eggGroups || []
		: [];
	const profile = {
		abilities: monInfoAbilitiesForGame(resolvedInfo?.abilities, gameKey),
		eggGroups,
		expGroup:
			effectiveInfo?.expGroup ||
			mon?.expGroup ||
			resolvedInfo?.growthRate ||
			null,
		baseEggSteps: monInfoEggStepsForGame({
			gameKey,
			hatchCounter: resolvedInfo?.hatchCounter,
			eggGroups,
			authoredSteps:
				effectiveInfo?.baseEggSteps ?? mon?.baseEggSteps ?? null,
		}),
		height: resolvedInfo?.size?.height ?? resolvedInfo?.height ?? null,
		weight: resolvedInfo?.size?.weight ?? resolvedInfo?.weight ?? null,
		genderRatio: mechanics.hasGender
			? resolvedInfo?.gender &&
				(resolvedInfo.gender.maleRatio != null ||
					resolvedInfo.gender.femaleRatio != null)
				? `${resolvedInfo.gender.maleRatio ?? "?"}% ♂ / ${resolvedInfo.gender.femaleRatio ?? "?"}% ♀`
				: (resolvedInfo?.genderRatio ?? null)
			: null,
		baseFriendship: mechanics.hasFriendship
			? (battle.baseFriendship ??
				resolvedInfo?.baseFriendship ??
				resolvedInfo?.baseHappiness ??
				null)
			: null,
		captureRate: battle.captureRate ?? resolvedInfo?.captureRate ?? null,
		baseExperience:
			battle.baseExperience ?? resolvedInfo?.baseExperience ?? null,
		habitat: resolvedInfo?.habitat ?? null,
		shape: resolvedInfo?.shape ?? null,
		color: resolvedInfo?.color ?? null,
		genus: resolvedInfo?.genus ?? null,
	};

	return {
		natId,
		key,
		info,
		resolvedInfo,
		fallbackInfo,
		effectiveInfo,
		hasLocalInfo: Boolean(info || formOverride),
		gameEntries,
		formOptions,
		effectiveFormKey,
		spriteSrc,
		spriteCandidates,
		types,
		baseStats,
		evYield,
		profile,
		mechanics,
		evolutionPaths: normalizeEvolutionPaths(resolvedInfo?.evolution),
		moves: normalizeMovesForRender(enrichedMoves),
		locations: releaseLocations.length
			? releaseLocations
			: normalizeLocationsForRender(resolvedInfo?.locations),
		typeDefenses: computeTypeDefenseBuckets(types, gameKey),
	};
}
