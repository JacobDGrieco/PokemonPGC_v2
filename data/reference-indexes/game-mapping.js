/**
 * Bridges PokemonPGC game keys to PokéAPI version groups and local machine
 * sprite generations. DLC keys intentionally share their base game's machine
 * catalog because PokéAPI models them as one version group.
 */
export const REFERENCE_GAME_RELEASE_ORDER = [
	"red-blue",
	"red-green-japan",
	"yellow",
	"gold-silver",
	"crystal",
	"ruby-sapphire",
	"colosseum",
	"firered-leafgreen",
	"emerald",
	"xd",
	"diamond-pearl",
	"platinum",
	"heartgold-soulsilver",
	"black-white",
	"black-2-white-2",
	"x-y",
	"omega-ruby-alpha-sapphire",
	"sun-moon",
	"ultra-sun-ultra-moon",
	"lets-go-pikachu-lets-go-eevee",
	"sword-shield",
	"the-isle-of-armor",
	"the-crown-tundra",
	"brilliant-diamond-shining-pearl",
	"legends-arceus",
	"scarlet-violet",
	"the-teal-mask",
	"the-indigo-disk",
	"legends-z-a",
	"legends-za",
	"mega-dimension",
	"champions",
];

const REFERENCE_GAME_RELEASE_INDEX = new Map(
	REFERENCE_GAME_RELEASE_ORDER.map((gameKey, index) => [gameKey, index]),
);

const REFERENCE_GAME_TITLES = new Map([
	["red-blue", ["Red", "Blue"]],
	["red-green-japan", ["Green"]],
	["yellow", ["Yellow"]],
	["gold-silver", ["Gold", "Silver"]],
	["crystal", ["Crystal"]],
	["ruby-sapphire", ["Ruby", "Sapphire"]],
	["colosseum", ["Colosseum"]],
	["firered-leafgreen", ["FireRed", "LeafGreen"]],
	["emerald", ["Emerald"]],
	["xd", ["XD: Gale of Darkness"]],
	["diamond-pearl", ["Diamond", "Pearl"]],
	["platinum", ["Platinum"]],
	["heartgold-soulsilver", ["HeartGold", "SoulSilver"]],
	["black-white", ["Black", "White"]],
	["black-2-white-2", ["Black 2", "White 2"]],
	["x-y", ["X", "Y"]],
	["omega-ruby-alpha-sapphire", ["Omega Ruby", "Alpha Sapphire"]],
	["sun-moon", ["Sun", "Moon"]],
	["ultra-sun-ultra-moon", ["Ultra Sun", "Ultra Moon"]],
	[
		"lets-go-pikachu-lets-go-eevee",
		["Let's Go Pikachu", "Let's Go Eevee"],
	],
	["sword-shield", ["Sword", "Shield"]],
	["the-isle-of-armor", ["The Isle of Armor"]],
	["the-crown-tundra", ["The Crown Tundra"]],
	[
		"brilliant-diamond-shining-pearl",
		["Brilliant Diamond", "Shining Pearl"],
	],
	["legends-arceus", ["Legends: Arceus"]],
	["scarlet-violet", ["Scarlet", "Violet"]],
	["the-teal-mask", ["The Teal Mask"]],
	["the-indigo-disk", ["The Indigo Disk"]],
	["legends-z-a", ["Legends: Z-A"]],
	["legends-za", ["Legends: Z-A"]],
	["mega-dimension", ["Mega Dimension"]],
	["champions", ["Champions"]],
]);

const REFERENCE_SPRITE_GAME_KEYS = Object.freeze({
	"red-blue": "red",
	"red-green-japan": "green",
	yellow: "yellow",
	"gold-silver": "gold",
	crystal: "crystal",
	"ruby-sapphire": "ruby",
	colosseum: "ruby",
	"firered-leafgreen": "firered",
	emerald: "emerald",
	xd: "ruby",
	"diamond-pearl": "diamond",
	platinum: "platinum",
	"heartgold-soulsilver": "heartgold",
	"black-white": "black",
	"black-2-white-2": "black2",
	"x-y": "x",
	"omega-ruby-alpha-sapphire": "omegaruby",
	"sun-moon": "sun",
	"ultra-sun-ultra-moon": "ultrasun",
	"lets-go-pikachu-lets-go-eevee": "letsgopikachu",
	"sword-shield": "sword",
	"the-isle-of-armor": "swordioa",
	"the-crown-tundra": "swordct",
	"brilliant-diamond-shining-pearl": "brilliantdiamond",
	"legends-arceus": "legendsarceus",
	"scarlet-violet": "scarlet",
	"the-teal-mask": "scarlettm",
	"the-indigo-disk": "scarletid",
	"legends-z-a": "legendsza",
	"legends-za": "legendsza",
	"mega-dimension": "legendszamd",
	home: "home",
});

/** Sort known games chronologically while keeping future unknown keys stable. */
export function compareReferenceGameRelease(leftGameKey, rightGameKey) {
	const leftKey = String(leftGameKey || "");
	const rightKey = String(rightGameKey || "");
	const leftIndex =
		REFERENCE_GAME_RELEASE_INDEX.get(leftKey) ?? Number.MAX_SAFE_INTEGER;
	const rightIndex =
		REFERENCE_GAME_RELEASE_INDEX.get(rightKey) ?? Number.MAX_SAFE_INTEGER;
	return leftIndex - rightIndex || leftKey.localeCompare(rightKey);
}

/** Return official display titles, split so paired releases can be stacked. */
export function referenceGameTitles(gameKey, fallbackLabel = "") {
	const normalizedKey = String(gameKey || "");
	const knownTitles = REFERENCE_GAME_TITLES.get(normalizedKey);
	if (knownTitles) return [...knownTitles];
	const fallbackTitles = String(fallbackLabel || "")
		.split(/\s*\/\s*/)
		.filter(Boolean);
	if (fallbackTitles.length) return fallbackTitles;
	return [
		normalizedKey
			.split("-")
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(" "),
	];
}

/** Return the inline form used by native select controls and compact labels. */
export function formatReferenceGameLabel(gameKey, fallbackLabel = "") {
	return referenceGameTitles(gameKey, fallbackLabel).join(" / ");
}

export function versionGroupForGameKey(gameKey) {
	const key = String(gameKey || "").toLowerCase();
	if (key.startsWith("red") || key.startsWith("blue") || key === "green")
		return "red-blue";
	if (key === "yellow") return "yellow";
	if (key === "gold" || key === "silver") return "gold-silver";
	if (key === "crystal") return "crystal";
	if (key.startsWith("ruby") || key.startsWith("sapphire"))
		return "ruby-sapphire";
	if (key.startsWith("emerald")) return "emerald";
	if (key.startsWith("firered") || key.startsWith("leafgreen"))
		return "firered-leafgreen";
	if (key.startsWith("diamond") || key.startsWith("pearl"))
		return "diamond-pearl";
	if (key.startsWith("platinum")) return "platinum";
	if (key.startsWith("heartgold") || key.startsWith("soulsilver"))
		return "heartgold-soulsilver";
	if (key.startsWith("black2") || key.startsWith("white2"))
		return "black-2-white-2";
	if (key.startsWith("black") || key.startsWith("white"))
		return "black-white";
	if (key.startsWith("omegaruby") || key.startsWith("alphasapphire"))
		return "omega-ruby-alpha-sapphire";
	if (/^[xy](?:-|$)/.test(key)) return "x-y";
	if (key.startsWith("ultrasun") || key.startsWith("ultramoon"))
		return "ultra-sun-ultra-moon";
	if (key.startsWith("sun") || key.startsWith("moon")) return "sun-moon";
	if (key.startsWith("letsgopikachu") || key.startsWith("letsgoeevee"))
		return "lets-go-pikachu-lets-go-eevee";
	if (key.startsWith("sword") || key.startsWith("shield"))
		return "sword-shield";
	if (
		key.startsWith("brilliantdiamond") ||
		key.startsWith("shiningpearl")
	)
		return "brilliant-diamond-shining-pearl";
	if (key.startsWith("legendsarceus")) return "legends-arceus";
	if (key.startsWith("scarlet") || key.startsWith("violet"))
		return "scarlet-violet";
	if (key.startsWith("legendsza")) return "legends-z-a";
	return key;
}

export function machineSpriteGenerationForGameKey(gameKey) {
	const key = String(gameKey || "").toLowerCase();
	if (
		key.startsWith("brilliantdiamond") ||
		key.startsWith("shiningpearl") ||
		key.startsWith("legendsarceus")
	)
		return "8_2";
	if (key.startsWith("letsgopikachu") || key.startsWith("letsgoeevee"))
		return "7_2";
	if (key.startsWith("legendsza")) return "9_2";
	if (key.startsWith("scarlet") || key.startsWith("violet")) return 9;
	if (key.startsWith("sword") || key.startsWith("shield")) return 8;
	if (
		key.startsWith("sun") ||
		key.startsWith("moon") ||
		key.startsWith("ultrasun") ||
		key.startsWith("ultramoon")
	)
		return 7;
	if (
		/^[xy](?:-|$)/.test(key) ||
		key.startsWith("omegaruby") ||
		key.startsWith("alphasapphire")
	)
		return 6;
	if (key.startsWith("black") || key.startsWith("white")) return 5;
	if (
		key.startsWith("diamond") ||
		key.startsWith("pearl") ||
		key.startsWith("platinum") ||
		key.startsWith("heartgold") ||
		key.startsWith("soulsilver")
	)
		return 4;
	if (
		key.startsWith("ruby") ||
		key.startsWith("sapphire") ||
		key.startsWith("emerald") ||
		key.startsWith("firered") ||
		key.startsWith("leafgreen")
	)
		return 3;
	if (key === "gold" || key === "silver" || key === "crystal") return 2;
	return 1;
}

export function versionGroupForProfileKey(profileKey) {
	const profile = String(profileKey || "");
	if (profile === "red-green-japan") return "red-blue";
	if (profile === "the-isle-of-armor" || profile === "the-crown-tundra")
		return "sword-shield";
	if (profile === "the-teal-mask" || profile === "the-indigo-disk")
		return "scarlet-violet";
	if (profile === "legends-za" || profile === "mega-dimension")
		return "legends-z-a";
	return profile;
}

/**
 * Return the representative PokemonPGC game key used to resolve a sprite for
 * a reference-index game profile. Paired releases share sprite artwork, while
 * DLC profiles deliberately retain the folder family of their host game.
 */
export function spriteGameKeyForProfileKey(profileKey) {
	const profile = String(profileKey || "").toLowerCase();
	return REFERENCE_SPRITE_GAME_KEYS[profile] || null;
}

/** Return the numbered generation represented by a PokeAPI version group. */
export function generationForVersionGroup(versionGroup) {
	const value = String(versionGroup || "");
	if (/scarlet|violet|legends-z-a/.test(value)) return 9;
	if (/sword|shield|brilliant|arceus/.test(value)) return 8;
	if (/sun|moon|lets-go/.test(value)) return 7;
	if (/x-y|omega-ruby/.test(value)) return 6;
	if (/black|white/.test(value)) return 5;
	if (/diamond|pearl|platinum|heartgold/.test(value)) return 4;
	if (/ruby|sapphire|emerald|firered/.test(value)) return 3;
	if (/gold|silver|crystal/.test(value)) return 2;
	return 1;
}
