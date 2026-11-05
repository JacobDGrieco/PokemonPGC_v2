/** Read-only accessors for the compact generated Mon Info routing manifest. */
import compactManifest from "./catalog/runtime-manifest.json" with { type: "json" };
import { runtimeFormSlug, runtimeShardKey } from "./runtime-paths.js";

const speciesCache = new Map();

function baseNum(natiId) {
	const num = parseInt(String(natiId).split("-")[0], 10);
	return Number.isFinite(num) ? num : null;
}

/** Return the generated catalog identity without loading a data shard. */
export function getMonInfoManifestSpecies(natiId) {
	const num = baseNum(natiId);
	if (num == null) return null;
	if (speciesCache.has(num)) return speciesCache.get(num);
	const compactSpecies = compactManifest.s?.[num];
	if (!compactSpecies) return null;
	const [name, defaultFormKey, compactForms = {}] = compactSpecies;
	const forms = Object.fromEntries(
		Object.entries(compactForms).map(([formKey, compactForm]) => {
			const [label, gameKeyIndexes = []] = compactForm;
			return [
				formKey,
				{
					label,
					path: runtimeShardKey(num, formKey),
					gameKeys: gameKeyIndexes
						.map((index) => compactManifest.g?.[index])
						.filter(Boolean),
				},
			];
		}),
	);
	const species = {
		name,
		defaultFormKey,
		forms,
		gameKeys: [...new Set(Object.values(forms).flatMap((form) => form.gameKeys))],
	};
	speciesCache.set(num, species);
	return species;
}

/** Match exact authored form keys first, then their stable URL-safe slug. */
export function resolveRuntimeFormKey(natiId, formKey = null) {
	const species = getMonInfoManifestSpecies(natiId);
	if (!species?.forms) return null;
	const formKeys = Object.keys(species.forms);
	if (!formKeys.length) return null;
	if (formKey != null && species.forms[formKey]) return String(formKey);
	if (formKey != null) {
		const requestedSlug = runtimeFormSlug(formKey);
		const slugMatches = formKeys.filter(
			(candidate) => runtimeFormSlug(candidate) === requestedSlug,
		);
		if (slugMatches.length === 1) return slugMatches[0];
	}
	if (species.defaultFormKey && species.forms[species.defaultFormKey]) {
		return species.defaultFormKey;
	}
	return species.forms.base ? "base" : preferredRuntimeFormKey(formKeys);
}

function preferredRuntimeFormKey(formKeys) {
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
		formKeys.find((formKey) => !isSpecialBattleForm(formKey)) ||
		formKeys[0]
	);
}

function isSpecialBattleForm(formKey) {
	return /(^|-)mega($|-)|gigantamax|gmax|primal|eternamax/i.test(formKey);
}
