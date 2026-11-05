/** Shared Mon Info form availability and game-transition rules. */
import {
	getMonInfoManifestSpecies,
	resolveRuntimeFormKey,
} from "../../data/mon-info/manifest.js";

/** Match form catalog game keys, including DLC suffix variants. */
export function gameMatchesMonInfoForm(metaGames, gameKey) {
	if (!Array.isArray(metaGames) || !metaGames.length) return true;
	if (!gameKey) return true;
	const normalizedGameKey = String(gameKey);
	const baseGameKey = normalizedGameKey.replace(/(ioa|ct|tm|id|md)$/i, "");
	return (
		metaGames.includes(normalizedGameKey) || metaGames.includes(baseGameKey)
	);
}

/** Return only the forms that exist in the selected game. */
export function getMonInfoFormOptions(nationalDexId, gameKey) {
	const manifestSpecies = getMonInfoManifestSpecies(nationalDexId);
	const catalogForms =
		(nationalDexId != null &&
			globalThis.window?.DATA?.formsCatalog?.[nationalDexId]) ||
		{};
	const formOptions = [];
	for (const [formKey, manifestMetadata] of Object.entries(
		manifestSpecies?.forms || {},
	)) {
		const metadata = catalogForms[formKey];
		if (!gameMatchesMonInfoForm(manifestMetadata?.gameKeys, gameKey))
			continue;
		if (
			metadata &&
			Array.isArray(metadata.games) &&
			metadata.games.length &&
			!gameMatchesMonInfoForm(metadata.games, gameKey)
		) {
			continue;
		}
		formOptions.push({
			key: String(formKey),
			label: metadata?.label
				? String(metadata.label)
				: String(manifestMetadata?.label || formKey),
		});
	}
	return formOptions;
}

/**
 * Preserve a form across games only while it remains available. Older games
 * with no authored forms use the catalog's first form as their base identity.
 */
export function resolveMonInfoFormForGame(
	nationalDexId,
	gameKey,
	requestedFormKey = null,
) {
	const formOptions = getMonInfoFormOptions(nationalDexId, gameKey);
	const normalizedRequestedFormKey =
		requestedFormKey != null ? String(requestedFormKey) : null;
	if (
		formOptions.some((option) => option.key === normalizedRequestedFormKey)
	) {
		return normalizedRequestedFormKey;
	}
	if (formOptions.length) return preferredMonInfoFormKey(formOptions);

	const manifestSpecies = getMonInfoManifestSpecies(nationalDexId);
	const gameForms = Object.entries(manifestSpecies?.forms || {})
		.filter(([, metadata]) =>
			gameMatchesMonInfoForm(metadata?.gameKeys, gameKey),
		)
		.map(([key]) => ({ key }));
	return (
		preferredMonInfoFormKey(gameForms) ||
		resolveRuntimeFormKey(nationalDexId, requestedFormKey)
	);
}

/** Choose a stable ordinary form instead of depending on object key order. */
function preferredMonInfoFormKey(formOptions) {
	const formKeys = formOptions.map((option) => option.key);
	const preferredKeys = [
		"base",
		"normal",
		"male",
		"kantonian",
		"kantonian-male",
		"johtonian",
		"johtonian-male",
	];
	return (
		preferredKeys.find((formKey) => formKeys.includes(formKey)) ||
		formKeys.find(
			(formKey) =>
				!/(^|-)mega($|-)|gigantamax|gmax|primal|eternamax/i.test(
					formKey,
				),
		) ||
		formKeys[0] ||
		null
	);
}
