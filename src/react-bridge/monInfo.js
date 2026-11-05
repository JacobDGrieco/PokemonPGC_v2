import { ensureMonInfoLoaded } from "../../data/mon-info/_loader.js";
import { getMonInfoManifestSpecies } from "../../data/mon-info/manifest.js";
import {
	buildMonInfoGameOptions,
	canonicalMonInfoGameKey,
	findMonInfoGameOption,
} from "../utils/monInfoGames.js";

export {
	buildMonInfoGameOptions,
	canonicalMonInfoGameKey,
	findMonInfoGameOption,
	MONINFO_GAME_PRIORITY,
	MON_INFO_RELEASE_GROUPS,
	monInfoLabelForGameKey,
	sortGameKeysForMonInfo,
} from "../utils/monInfoGames.js";

export function pad4(value) {
	return String(Number(value) || 0).padStart(4, "0");
}

export function normalizeMonInfoComboKeys() {
	const byGame = window.DATA?.monInfo;
	if (!byGame || typeof byGame !== "object") return;

	for (const rawKey of Object.keys(byGame)) {
		if (!rawKey || typeof rawKey !== "string" || !rawKey.includes(","))
			continue;
		const bucket = byGame[rawKey];
		if (!bucket || typeof bucket !== "object") continue;

		const parts = rawKey
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
		for (const key of parts) {
			if (!byGame[key]) byGame[key] = bucket;
		}
		delete byGame[rawKey];
	}
}

export function findGameKeysForMonInfoNati(natiId) {
	const natId = Number(natiId);
	normalizeMonInfoComboKeys();

	const byGame = window.DATA?.monInfo || {};
	const found = new Set();
	const manifestSpecies = getMonInfoManifestSpecies(natId);
	for (const gameKey of manifestSpecies?.gameKeys || []) found.add(gameKey);
	for (const form of Object.values(manifestSpecies?.forms || {})) {
		for (const gameKey of form.gameKeys || []) found.add(gameKey);
	}

	for (const gameKey of Object.keys(byGame)) {
		if (String(gameKey).startsWith("$")) continue;
		const bucket = byGame[gameKey];
		if (!bucket || typeof bucket !== "object") continue;
		if (bucket[natId] != null || bucket[String(natId)] != null)
			found.add(gameKey);
	}

	return found.size ? Array.from(found) : Object.keys(byGame);
}

export function getHomeDexMons(homeDex = window.DATA?.dex?.home || []) {
	return (Array.isArray(homeDex) ? homeDex : [])
		.map((mon) => ({
			natiId: Number(mon?.natiId ?? mon?.id ?? 0),
			name: String(mon?.name || ""),
		}))
		.filter((mon) => mon.natiId > 0)
		.sort((a, b) => a.natiId - b.natiId);
}

export async function getMonInfoDisplayName(natiId) {
	const natId = Number(natiId);
	if (!natId) return "";
	const manifestName = getMonInfoManifestSpecies(natId)?.name;
	if (manifestName) return manifestName;

	await ensureMonInfoLoaded(natId, null);

	try {
		const byGame = window.DATA?.monInfo || {};
		for (const bucket of Object.values(byGame)) {
			if (!bucket || typeof bucket !== "object") continue;
			const record = bucket[natId] || bucket[String(natId)];
			if (record?.displayName || record?.name)
				return String(record.displayName || record.name);
		}
	} catch {}

	const homeDexMatch = getHomeDexMons().find((mon) => mon.natiId === natId);
	return homeDexMatch?.name || `#${natId}`;
}

export function pickPreferredGameForMon(natiId, currentGameKey = null) {
	const options = buildMonInfoGameOptions(findGameKeysForMonInfoNati(natiId));
	return findMonInfoGameOption(options, currentGameKey)?.key || null;
}
