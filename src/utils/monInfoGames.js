/** Release grouping and labels shared by Mon Info routing and presentation. */
export const MON_INFO_RELEASE_GROUPS = Object.freeze([
	{
		label: "Legends: Z-A",
		gameKeys: ["legendsza", "legendszamd"],
		baseGameKeys: ["legendsza"],
		expansions: [
			{
				key: "mega-dimension",
				label: "Mega Dimension",
				gameKeys: ["legendszamd"],
			},
		],
	},
	{
		label: "Scarlet / Violet",
		gameKeys: [
			"scarlet",
			"violet",
			"scarlettm",
			"violettm",
			"scarletid",
			"violetid",
		],
		baseGameKeys: ["scarlet", "violet"],
		expansions: [
			{
				key: "the-teal-mask",
				label: "The Teal Mask",
				gameKeys: ["scarlettm", "violettm"],
			},
			{
				key: "the-indigo-disk",
				label: "The Indigo Disk",
				gameKeys: ["scarletid", "violetid"],
			},
		],
	},
	{ label: "Legends: Arceus", gameKeys: ["legendsarceus"] },
	{
		label: "Brilliant Diamond / Shining Pearl",
		gameKeys: ["brilliantdiamond-national", "shiningpearl-national"],
	},
	{
		label: "Sword / Shield",
		gameKeys: [
			"sword",
			"shield",
			"swordioa",
			"shieldioa",
			"swordct",
			"shieldct",
		],
		baseGameKeys: ["sword", "shield"],
		expansions: [
			{
				key: "the-isle-of-armor",
				label: "The Isle of Armor",
				gameKeys: ["swordioa", "shieldioa"],
			},
			{
				key: "the-crown-tundra",
				label: "The Crown Tundra",
				gameKeys: ["swordct", "shieldct"],
			},
		],
	},
	{
		label: "Let's Go, Pikachu! / Let's Go, Eevee!",
		gameKeys: ["letsgopikachu", "letsgoeevee"],
	},
	{
		label: "Ultra Sun / Ultra Moon",
		gameKeys: ["ultrasun-alola", "ultramoon-alola"],
	},
	{ label: "Sun / Moon", gameKeys: ["sun-alola", "moon-alola"] },
	{
		label: "Omega Ruby / Alpha Sapphire",
		gameKeys: ["omegaruby-national", "alphasapphire-national"],
	},
	{ label: "X / Y", gameKeys: ["x-national", "y-national"] },
	{
		label: "Black 2 / White 2",
		gameKeys: ["black2-national", "white2-national"],
	},
	{
		label: "Black / White",
		gameKeys: ["black-national", "white-national"],
	},
	{
		label: "HeartGold / SoulSilver",
		gameKeys: ["heartgold-national", "soulsilver-national"],
	},
	{ label: "Platinum", gameKeys: ["platinum-national"] },
	{
		label: "Diamond / Pearl",
		gameKeys: ["diamond-national", "pearl-national"],
	},
	{
		label: "FireRed / LeafGreen",
		gameKeys: ["firered-national", "leafgreen-national"],
	},
	{ label: "Emerald", gameKeys: ["emerald-national"] },
	{
		label: "Ruby / Sapphire",
		gameKeys: ["ruby-national", "sapphire-national"],
	},
	{ label: "Crystal", gameKeys: ["crystal"] },
	{ label: "Gold / Silver", gameKeys: ["gold", "silver"] },
	{ label: "Yellow", gameKeys: ["yellow"] },
	{ label: "Green (Japan)", gameKeys: ["green"] },
	{ label: "Red / Blue", gameKeys: ["red", "blue"] },
]);

export const MONINFO_GAME_PRIORITY = Object.freeze(
	[...MON_INFO_RELEASE_GROUPS]
		.reverse()
		.flatMap((release) => release.gameKeys),
);

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

export function monInfoLabelForGameKey(gameKey) {
	const canonicalKey = canonicalMonInfoGameKey(gameKey);
	if (!canonicalKey) return "Unknown";
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
	if (labels[canonicalKey]) return labels[canonicalKey];
	return canonicalKey
		.split(/[-_]/g)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

/** Sort exact games oldest-to-newest for compatibility with existing consumers. */
export function sortGameKeysForMonInfo(gameKeys) {
	const priority = new Map(
		MONINFO_GAME_PRIORITY.map((gameKey, index) => [gameKey, index]),
	);
	return [...gameKeys].sort((left, right) => {
		const leftIndex = priority.has(left)
			? priority.get(left)
			: Number.MAX_SAFE_INTEGER;
		const rightIndex = priority.has(right)
			? priority.get(right)
			: Number.MAX_SAFE_INTEGER;
		return (
			leftIndex - rightIndex || String(left).localeCompare(String(right))
		);
	});
}

/** Build compact release choices while retaining exact member keys for comparison. */
export function buildMonInfoGameOptions(gameKeys = []) {
	const availableKeys = new Set(
		gameKeys.map(canonicalMonInfoGameKey).filter(Boolean),
	);
	const knownKeys = new Set(
		MON_INFO_RELEASE_GROUPS.flatMap((release) => release.gameKeys),
	);
	const options = [];

	// Unknown future releases are shown first until they receive an explicit order.
	for (const gameKey of [...availableKeys]
		.filter((key) => !knownKeys.has(key))
		.sort((left, right) => String(right).localeCompare(String(left)))) {
		options.push({
			key: gameKey,
			label: monInfoLabelForGameKey(gameKey),
			gameKeys: [gameKey],
		});
	}

	for (const release of MON_INFO_RELEASE_GROUPS) {
		const releaseGameKeys = release.gameKeys.filter((gameKey) =>
			availableKeys.has(gameKey),
		);
		if (!releaseGameKeys.length) continue;
		const baseGameKeys = (release.baseGameKeys || release.gameKeys).filter(
			(gameKey) => availableKeys.has(gameKey),
		);
		const expansions = (release.expansions || [])
			.map((expansion) => ({
				...expansion,
				gameKeys: expansion.gameKeys.filter((gameKey) =>
					availableKeys.has(gameKey),
				),
			}))
			.filter((expansion) => expansion.gameKeys.length);
		options.push({
			key: baseGameKeys[0] || releaseGameKeys[0],
			label:
				releaseGameKeys.length > 1 || expansions.length
					? release.label
					: monInfoLabelForGameKey(releaseGameKeys[0]),
			gameKeys: releaseGameKeys,
			baseGameKeys,
			expansions,
		});
	}

	return options;
}

/** Match direct links to either member of a grouped release. */
export function findMonInfoGameOption(gameOptions, requestedGameKey) {
	const requestedKey = canonicalMonInfoGameKey(requestedGameKey);
	return (
		gameOptions.find((option) => option.gameKeys.includes(requestedKey)) ||
		gameOptions[0] ||
		null
	);
}
