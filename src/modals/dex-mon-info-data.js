import { ensureMonInfoLoaded } from "../../data/mon_info/_loader.js";
import { fetchPokeApiMonInfo } from "../services/pokeApi.js";

export function resolveMonInfoBucket(gameKey) {
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

export function gameMatches(metaGames, gameKey) {
	if (!Array.isArray(metaGames) || !metaGames.length) return true;
	if (!gameKey) return true;
	const g = String(gameKey);
	const base = g.replace(/(ioa|ct|tm|id|md)$/i, "");
	return metaGames.includes(g) || metaGames.includes(base);
}

export function collectCatalogFormOptions(natId, gameKey) {
	const catalogForms = (natId != null && window.DATA?.formsCatalog?.[natId]) || {};
	const formOpts = [];
	for (const [fk, meta] of Object.entries(catalogForms)) {
		if (meta && Array.isArray(meta.games) && meta.games.length) {
			if (!gameMatches(meta.games, gameKey)) continue;
		}
		formOpts.push({ key: String(fk), label: meta?.label ? String(meta.label) : String(fk) });
	}
	return formOpts;
}

export function mergeInfo(base, patch) {
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

export async function resolveMonInfoData({ gameKey, mon, formKey = null }) {
	const natId = mon?.natiId ?? mon?.natId ?? mon?.nationalId ?? null;
	const key = natId ?? mon?.id;
	const formOpts = collectCatalogFormOptions(natId, gameKey);
	const hasForms = formOpts.length > 0;
	let effectiveFormKey = formKey;
	if (!effectiveFormKey && hasForms) effectiveFormKey = formOpts[0].key;

	await ensureMonInfoLoaded(key, effectiveFormKey);

	const bucket = resolveMonInfoBucket(gameKey);
	const info = (natId != null && bucket?.[natId]) || bucket?.[mon.id] || null;
	const formOverride = effectiveFormKey && natId != null
		? window.DATA?.monInfoForms?.[gameKey]?.[natId]?.[effectiveFormKey] || null
		: null;
	const effectiveInfo = mergeInfo(info, formOverride);
	const fallbackInfo = !effectiveInfo && natId != null ? await fetchPokeApiMonInfo(natId) : null;
	const resolvedInfo = mergeInfo(fallbackInfo, effectiveInfo);

	return { natId, key, formOpts, hasForms, effectiveFormKey, info, formOverride, effectiveInfo, fallbackInfo, resolvedInfo };
}
