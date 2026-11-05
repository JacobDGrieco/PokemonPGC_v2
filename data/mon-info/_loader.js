/**
 * Lazily loads authored Mon Info modules and generated form-scoped JSON.
 * The manifest is the routing index; only the selected Pokemon form shard is
 * fetched and registered for the current view.
 */
import { formKeyToSuffix } from "../helpers/index.js";
import { PPGC } from "../../src/registry.js";
import {
	getMonInfoManifestSpecies,
	resolveRuntimeFormKey,
} from "./manifest.js";

export {
	getMonInfoManifestSpecies,
	resolveRuntimeFormKey,
} from "./manifest.js";

const monInfoModules = import.meta.glob([
	"./*.js",
	"!./_loader.js",
	"!./manifest.js",
	"!./runtime-paths.js",
]);
const runtimeCatalogModules = import.meta.glob(
	[
		"./catalog/**/*.json",
		"!./catalog/manifest.json",
		"!./catalog/runtime-manifest.json",
	],
	{
		import: "default",
	},
);
const loadedModules = new Set();
const pendingModules = new Map();

function pad4(n) {
	return String(n).padStart(4, "0");
}

function baseNum(natiId) {
	const num = parseInt(String(natiId).split("-")[0], 10);
	return Number.isFinite(num) ? num : null;
}

function moduleKeyForBase(num) {
	return `./${pad4(num)}.js`;
}

function moduleKeyForForm(num, formKey) {
	const suffix = formKeyToSuffix(num, formKey);
	if (!suffix) return null;
	return `./${pad4(num)}-${suffix}.js`;
}

export function monInfoUrl(natiId) {
	const num = baseNum(natiId);
	if (num == null) return null;
	return new URL(moduleKeyForBase(num), import.meta.url).href;
}

export function monInfoFormUrl(natiId, formKey) {
	const num = baseNum(natiId);
	if (num == null || !formKey) return null;
	const key = moduleKeyForForm(num, formKey);
	return key ? new URL(key, import.meta.url).href : null;
}

async function importByKey(key, { optional = false } = {}) {
	if (!key || loadedModules.has(key)) return false;
	const loader = monInfoModules[key];
	if (!loader) {
		if (optional) return false;
		throw new Error(`Missing mon info module: ${key}`);
	}
	await loadOnce(key, loader);
	return true;
}

async function loadOnce(key, loader) {
	if (loadedModules.has(key)) return null;
	if (pendingModules.has(key)) return pendingModules.get(key);
	const pending = Promise.resolve(loader())
		.then((loadedValue) => {
			loadedModules.add(key);
			return loadedValue;
		})
		.finally(() => pendingModules.delete(key));
	pendingModules.set(key, pending);
	return pending;
}

function registerRuntimeShard(shard) {
	if (!shard?.nationalDexId || !Array.isArray(shard.profiles)) return;
	const nationalDexId = Number(shard.nationalDexId);
	const isBaseForm = shard.formKey === "base";
	const chunk = { monInfo: {}, monInfoForms: {} };

	for (const profile of shard.profiles) {
		for (const appGameKey of profile.appGameKeys || []) {
			const payload = {
				...profile.payload,
				flavor: profile.flavorByGame?.[appGameKey] || "",
				localizedFlavor:
					profile.localizedFlavorByGame?.[appGameKey] || {},
			};
			if (isBaseForm) {
				(chunk.monInfo[appGameKey] ||= {})[nationalDexId] = payload;
				continue;
			}
			const speciesForms = (chunk.monInfoForms[appGameKey] ||= {});
			(speciesForms[nationalDexId] ||= {})[shard.formKey] = payload;
		}
	}

	PPGC.register(chunk);
}

async function importRuntimeShard(natiId, formKey) {
	const species = getMonInfoManifestSpecies(natiId);
	const canonicalFormKey = resolveRuntimeFormKey(natiId, formKey);
	const relativePath = species?.forms?.[canonicalFormKey]?.path;
	if (!relativePath) return false;
	const catalogKey = `./catalog/${relativePath}`;
	const loader = runtimeCatalogModules[catalogKey];
	if (!loader) {
		throw new Error(`Missing generated mon info shard: ${catalogKey}`);
	}
	if (loadedModules.has(catalogKey)) return false;
	const shard = await loadOnce(catalogKey, loader);
	registerRuntimeShard(shard);
	return true;
}

export async function ensureMonInfoLoaded(natiId, formKey = null) {
	const num = baseNum(natiId);
	if (num == null) return false;

	await importRuntimeShard(num, formKey);
	// Hand-authored modules remain supported as final local overrides.
	await importByKey(moduleKeyForBase(num), { optional: true });

	const legacyFormPath = formKey ? moduleKeyForForm(num, formKey) : null;
	if (legacyFormPath) {
		await importByKey(legacyFormPath, { optional: true });
	}

	return true;
}
