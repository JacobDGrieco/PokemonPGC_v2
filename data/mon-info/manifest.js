/** Read-only accessors for the generated Mon Info routing manifest. */
import runtimeManifest from "./catalog/manifest.json" with { type: "json" };
import { runtimeFormSlug } from "./runtime-paths.js";

function baseNum(natiId) {
	const num = parseInt(String(natiId).split("-")[0], 10);
	return Number.isFinite(num) ? num : null;
}

/** Return the generated catalog identity without loading a data shard. */
export function getMonInfoManifestSpecies(natiId) {
	const num = baseNum(natiId);
	return num == null ? null : runtimeManifest.species?.[num] || null;
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
