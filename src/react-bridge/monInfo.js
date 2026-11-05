import { ensureMonInfoLoaded } from "../../data/mon-info/_loader.js";
import { getMonInfoManifestSpecies } from "../../data/mon-info/manifest.js";

export const MONINFO_GAME_PRIORITY = [
	"red",
	"blue",
	"green",
	"yellow",
	"gold",
	"silver",
	"crystal",
	"ruby-national",
	"sapphire-national",
	"emerald-national",
	"firered-national",
	"leafgreen-national",
	"diamond-national",
	"pearl-national",
	"platinum-national",
	"heartgold-national",
	"soulsilver-national",
	"black-national",
	"white-national",
	"black2-national",
	"white2-national",
	"x-national",
	"y-national",
	"omegaruby-national",
	"alphasapphire-national",
	"sun-alola",
	"moon-alola",
	"ultrasun-alola",
	"ultramoon-alola",
	"letsgopikachu",
	"letsgoeevee",
	"sword",
	"shield",
	"swordioa",
	"shieldioa",
	"swordct",
	"shieldct",
	"brilliantdiamond-national",
	"shiningpearl-national",
	"legendsarceus",
	"scarlet",
	"violet",
	"scarlettm",
	"violettm",
	"scarletid",
	"violetid",
	"legendsza",
	"legendszamd",
];

/** Collapse regional-Dex aliases while preserving releases and DLC identities. */
export function canonicalMonInfoGameKey(gameKey) {
	const key = String(gameKey || "").toLowerCase();
	if (/^(ruby|sapphire|emerald)(?:-national)?$/.test(key))
		return `${key.split("-")[0]}-national`;
	if (/^(firered|leafgreen)(?:-national)?$/.test(key))
		return `${key.split("-")[0]}-national`;
	if (/^(diamond|pearl|platinum)(?:-national)?$/.test(key))
		return `${key.split("-")[0]}-national`;
	if (/^(heartgold|soulsilver)(?:-national)?$/.test(key))
		return `${key.split("-")[0]}-national`;
	if (/^(black2?|white2?)(?:-national)?$/.test(key))
		return `${key.split("-")[0]}-national`;
	if (/^[xy](?:-|$)/.test(key)) return `${key.charAt(0)}-national`;
	if (/^(omegaruby|alphasapphire)(?:-national)?$/.test(key))
		return `${key.split("-")[0]}-national`;
	if (/^sun-(?:alola|melemele|akala|ulaula|poni)$/.test(key))
		return "sun-alola";
	if (/^moon-(?:alola|melemele|akala|ulaula|poni)$/.test(key))
		return "moon-alola";
	if (/^ultrasun-(?:alola|melemele|akala|ulaula|poni)$/.test(key))
		return "ultrasun-alola";
	if (/^ultramoon-(?:alola|melemele|akala|ulaula|poni)$/.test(key))
		return "ultramoon-alola";
	if (/^(brilliantdiamond|shiningpearl)(?:-national)?$/.test(key))
		return `${key.split("-")[0]}-national`;
	return key;
}

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

export function monInfoLabelForGameKey(gameKey) {
	const gk = canonicalMonInfoGameKey(gameKey);
	if (!gk) return "Unknown";
	const labels = {
		red: "Red",
		blue: "Blue",
		green: "Green (Japan)",
		yellow: "Yellow",
		gold: "Gold",
		silver: "Silver",
		crystal: "Crystal",
		"ruby-national": "Ruby",
		"sapphire-national": "Sapphire",
		"emerald-national": "Emerald",
		"firered-national": "FireRed",
		"leafgreen-national": "LeafGreen",
		"diamond-national": "Diamond",
		"pearl-national": "Pearl",
		"platinum-national": "Platinum",
		"heartgold-national": "HeartGold",
		"soulsilver-national": "SoulSilver",
		"black-national": "Black",
		"white-national": "White",
		"black2-national": "Black 2",
		"white2-national": "White 2",
		"x-national": "X",
		"y-national": "Y",
		"omegaruby-national": "Omega Ruby",
		"alphasapphire-national": "Alpha Sapphire",
		"sun-alola": "Sun",
		"moon-alola": "Moon",
		"ultrasun-alola": "Ultra Sun",
		"ultramoon-alola": "Ultra Moon",
		letsgopikachu: "Let's Go, Pikachu!",
		letsgoeevee: "Let's Go, Eevee!",
		sword: "Sword",
		shield: "Shield",
		swordioa: "Sword: The Isle of Armor",
		shieldioa: "Shield: The Isle of Armor",
		swordct: "Sword: The Crown Tundra",
		shieldct: "Shield: The Crown Tundra",
		"brilliantdiamond-national": "Brilliant Diamond",
		"shiningpearl-national": "Shining Pearl",
		legendsarceus: "Legends: Arceus",
		scarlet: "Scarlet",
		violet: "Violet",
		scarlettm: "Scarlet: The Teal Mask",
		violettm: "Violet: The Teal Mask",
		scarletid: "Scarlet: The Indigo Disk",
		violetid: "Violet: The Indigo Disk",
		legendsza: "Legends: Z-A",
		legendszamd: "Legends: Z-A, Mega Dimension",
	};
	if (labels[gk]) return labels[gk];
	return gk
		.split(/[-_]/g)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

export function sortGameKeysForMonInfo(keys) {
	const pri = new Map(
		MONINFO_GAME_PRIORITY.map((key, index) => [key, index]),
	);
	return [...keys].sort((a, b) => {
		const ai = pri.has(a) ? pri.get(a) : 9999;
		const bi = pri.has(b) ? pri.get(b) : 9999;
		if (ai !== bi) return ai - bi;
		return String(a).localeCompare(String(b));
	});
}

export function buildMonInfoGameOptions(gameKeys) {
	const ordered = sortGameKeysForMonInfo(
		gameKeys.map(canonicalMonInfoGameKey),
	);
	const seenKeys = new Set();
	const options = [];

	for (const key of ordered) {
		if (!key || seenKeys.has(key)) continue;
		const label = monInfoLabelForGameKey(key);
		seenKeys.add(key);
		options.push({ key, label });
	}

	return options;
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
	const keys = options.map((option) => option.key);
	if (currentGameKey && keys.includes(currentGameKey)) return currentGameKey;
	return keys[0] || null;
}
