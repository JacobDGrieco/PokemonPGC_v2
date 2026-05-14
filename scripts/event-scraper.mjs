#!/usr/bin/env node

/**
 * event-scrape-v2.mjs
 *
 * Better ProjectPokemon/EventsGallery scraper for PPGC distributions.
 *
 * Important:
 * - File paths/filenames only contain partial event metadata.
 * - For .pk3 files, this script downloads and decrypts the Gen 3 Pokémon payload
 *   so it can fill species, dex number, level, OT, TID, moves, nature, gender,
 *   ball, shiny, held item id, and approximate ability.
 * - .wc3/.wc4/etc. are still mostly filename/path metadata until you add Wonder Card
 *   parsers for those formats.
 *
 * Basic usage:
 *   node scripts/event-scrape.mjs --games ruby,sapphire --generation 3 --out data/distributions/ruby-sapphire.js
 *
 * Optional:
 *   GITHUB_TOKEN=ghp_xxx node tools/event-scrape-v2.mjs ...
 *   --dry-run
 *   --max 50
 *   --no-payload     skips downloading/parsing .pk3 files
 */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const OWNER = "projectpokemon";
const REPO = "EventsGallery";
const BRANCH = "master";
const DEFAULT_GEN1_SOURCE_DIR = "C:\\Users\\gamin\\Downloads\\EventsGallery-master\\EventsGallery-master\\Released\\Gen 1";

const EVENT_EXTENSIONS = new Set([
	".wc3", ".wc4", ".wc5", ".wc6", ".wc6full", ".wc7", ".wc7full", ".wc8", ".wc9",
	".pcd", ".pgt", ".pgf",
	".pk1", ".pk3", ".pk4", ".pk5", ".pk6", ".pk7", ".pk8", ".pk9",
	".pb7", ".pb8", ".pa8",
]);

const REGION_ALIASES = new Map([
	["usa", "USA"], ["us", "USA"], ["america", "USA"], ["na", "NA"], ["north america", "NA"],
	["eur", "EUR"], ["eu", "EUR"], ["europe", "EUR"],
	["jpn", "JPN"], ["jp", "JPN"], ["japan", "JPN"],
	["kor", "KOR"], ["kr", "KOR"], ["korea", "KOR"], ["korean", "KOR"],
	["chn", "CHN"], ["china", "CHN"], ["tw", "TWN"], ["taiwan", "TWN"], ["hk", "HKG"], ["hong kong", "HKG"],
	["sg", "SGP"], ["singapore", "SGP"], ["aus", "AUS"], ["australia", "AUS"],
	["can", "CAN"], ["canada", "CAN"], ["canadian", "CAN"],
	["gbr", "GBR"], ["great britain", "GBR"],
	["aut", "AUT"], ["austria", "AUT"],
	["dnk", "DNK"], ["denmark", "DNK"],
	["fin", "FIN"], ["finland", "FIN"],
	["nor", "NOR"], ["norway", "NOR"],
	["uk", "UK"], ["gb", "UK"], ["united kingdom", "UK"],
	["fr", "FRA"], ["france", "FRA"], ["de", "DEU"], ["germany", "DEU"],
	["italy", "ITA"], ["it", "ITA"], ["spain", "ESP"], ["es", "ESP"],
	["netherlands", "NLD"], ["nederland", "NLD"], ["nld", "NLD"],
	["global", "GLOBAL"], ["worldwide", "GLOBAL"], ["region free", "GLOBAL"],
	["wi-fi", "GLOBAL"], ["wifi", "GLOBAL"], ["internet", "GLOBAL"],
]);

const LANGUAGE_ALIASES = new Map([
	["eng", "en"], ["english", "en"], ["jpn", "ja"], ["japanese", "ja"],
	["fre", "fr"], ["french", "fr"], ["ger", "de"], ["german", "de"],
	["ita", "it"], ["italian", "it"], ["spa", "es"], ["spanish", "es"],
	["kor", "ko"], ["korean", "ko"], ["chs", "zh-Hans"], ["cht", "zh-Hant"], ["chi", "zh"],
	["all", "all"], ["multi", "all"],
]);

const HIERARCHY_REGION_FOLDERS = new Map([
	["jpn", "JPN"],
	["jp", "JPN"],
	["japanese", "JPN"],
	["kor", "KOR"],
	["kr", "KOR"],
	["korean", "KOR"],
	["usa", "USA"],
	["us", "USA"],
	["north america", "NA"],
	["eur", "EUR"],
	["eu", "EUR"],
	["europe", "EUR"],
	["international", "GLOBAL"],
	["worldwide", "GLOBAL"],
	["global", "GLOBAL"],
]);

const GENERIC_COLLECTION_SEGMENTS = new Set([
	"classic",
	"vc",
	"wondercards",
	"trade distribution",
	"hex extracted cards",
	"my pokemon ranch",
	"palparked from gen 3",
	"pokemon ranger manaphy egg",
	"pokemon box",
	"e card raws",
	"e card berries",
	"e card trainers",
	"e reader pokemon",
]);

const GEN_TO_GAMES = {
	"1": ["red", "blue", "yellow"],
	"3": ["ruby", "sapphire", "emerald", "firered", "leafgreen"],
	"4": ["diamond", "pearl", "platinum", "heartgold", "soulsilver"],
	"5": ["black", "white", "black2", "white2"],
	"6": ["x", "y", "omegaruby", "alphasapphire"],
	"7": ["sun", "moon", "ultrasun", "ultramoon"],
	"7_switch": ["letsgopikachu", "letsgoeevee"],
	"8": ["sword", "shield", "brilliantdiamond", "shiningpearl", "legendsarceus"],
	"9": ["scarlet", "violet"],
	"9_2": ["legendsza"],
};

const GAME_HINTS = [
	["ruby", /\bruby\b|pokemon ruby|\br\b/i],
	["sapphire", /\bsapphire\b|pokemon sapphire|\bs\b/i],
	["emerald", /\bemerald\b|\be\b/i],
	["firered", /fire\s*red|firered|\bfr\b/i],
	["leafgreen", /leaf\s*green|leafgreen|\blg\b/i],
	["diamond", /\bdiamond\b|\bd\b/i],
	["pearl", /\bpearl\b|\bp\b/i],
	["platinum", /\bplatinum\b|\bpt\b/i],
	["heartgold", /heart\s*gold|heartgold|\bhg\b/i],
	["soulsilver", /soul\s*silver|soulsilver|\bss\b/i],
	["black", /\bblack\b|\bb\b/i],
	["white", /\bwhite\b|\bw\b/i],
	["black2", /black\s*2|black2|b2/i],
	["white2", /white\s*2|white2|w2/i],
	["x", /pokemon x|\bx\b/i],
	["y", /pokemon y|\by\b/i],
	["omegaruby", /omega\s*ruby|omegaruby|\bor\b/i],
	["alphasapphire", /alpha\s*sapphire|alphasapphire|\bas\b/i],
	["sun", /\bsun\b/i],
	["moon", /\bmoon\b/i],
	["ultrasun", /ultra\s*sun|ultrasun|\bus\b/i],
	["ultramoon", /ultra\s*moon|ultramoon|\bum\b/i],
	["letsgopikachu", /let'?s\s*go\s*pikachu|lgpe.*pikachu|lgp/i],
	["letsgoeevee", /let'?s\s*go\s*eevee|lgpe.*eevee|lge/i],
	["sword", /\bsword\b|\bsw\b/i],
	["shield", /\bshield\b|\bsh\b/i],
	["brilliantdiamond", /brilliant\s*diamond|\bbd\b/i],
	["shiningpearl", /shining\s*pearl|\bsp\b/i],
	["legendsarceus", /legends\s*arceus|\bpla\b|arceus/i],
	["scarlet", /\bscarlet\b|\bsc\b/i],
	["violet", /\bviolet\b|\bvi\b/i],
	["legendsza", /legends\s*z-a|legends\s*za|\bza\b/i],
];

const NATURES = [
	"Hardy", "Lonely", "Brave", "Adamant", "Naughty",
	"Bold", "Docile", "Relaxed", "Impish", "Lax",
	"Timid", "Hasty", "Serious", "Jolly", "Naive",
	"Modest", "Mild", "Quiet", "Bashful", "Rash",
	"Calm", "Gentle", "Sassy", "Careful", "Quirky",
];

const GEN3_BALLS = {
	1: "master-ball", 2: "ultra-ball", 3: "great-ball", 4: "poke-ball", 5: "safari-ball",
	6: "net-ball", 7: "dive-ball", 8: "nest-ball", 9: "repeat-ball", 10: "timer-ball",
	11: "luxury-ball", 12: "premier-ball",
};

// English Gen 3 string table subset. Japanese names will not decode perfectly yet,
// but English PCNY/WISHMKR/etc. names decode well enough for display.
const GEN3_CHARMAP = new Map([
	[0x00, " "], [0x01, "À"], [0x02, "Á"], [0x03, "Â"], [0x04, "Ç"], [0x05, "È"], [0x06, "É"], [0x07, "Ê"], [0x08, "Ë"], [0x09, "Ì"],
	[0x0b, "Î"], [0x0c, "Ï"], [0x0d, "Ò"], [0x0e, "Ó"], [0x0f, "Ô"], [0x10, "Œ"], [0x11, "Ù"], [0x12, "Ú"], [0x13, "Û"], [0x14, "Ñ"], [0x15, "ß"],
	[0x16, "à"], [0x17, "á"], [0x19, "ç"], [0x1a, "è"], [0x1b, "é"], [0x1c, "ê"], [0x1d, "ë"], [0x1e, "ì"],
	[0x20, "î"], [0x21, "ï"], [0x22, "ò"], [0x23, "ó"], [0x24, "ô"], [0x25, "œ"], [0x26, "ù"], [0x27, "ú"], [0x28, "û"], [0x29, "ñ"],
	[0x2a, "º"], [0x2b, "ª"],
	[0xA1, "0"], [0xA2, "1"], [0xA3, "2"], [0xA4, "3"], [0xA5, "4"], [0xA6, "5"], [0xA7, "6"], [0xA8, "7"], [0xA9, "8"], [0xAA, "9"],
	[0xAB, "!"], [0xAC, "?"], [0xAD, "."], [0xAE, "-"], [0xAF, "·"], [0xB0, "…"], [0xB1, "“"], [0xB2, "”"], [0xB3, "‘"], [0xB4, "'"],
	[0xB5, "♂"], [0xB6, "♀"], [0xB7, "$"], [0xB8, ","], [0xB9, "×"], [0xBA, "/"],
	[0xBB, "A"], [0xBC, "B"], [0xBD, "C"], [0xBE, "D"], [0xBF, "E"], [0xC0, "F"], [0xC1, "G"], [0xC2, "H"], [0xC3, "I"], [0xC4, "J"], [0xC5, "K"], [0xC6, "L"], [0xC7, "M"], [0xC8, "N"], [0xC9, "O"], [0xCA, "P"], [0xCB, "Q"], [0xCC, "R"], [0xCD, "S"], [0xCE, "T"], [0xCF, "U"], [0xD0, "V"], [0xD1, "W"], [0xD2, "X"], [0xD3, "Y"], [0xD4, "Z"],
	[0xD5, "a"], [0xD6, "b"], [0xD7, "c"], [0xD8, "d"], [0xD9, "e"], [0xDA, "f"], [0xDB, "g"], [0xDC, "h"], [0xDD, "i"], [0xDE, "j"], [0xDF, "k"], [0xE0, "l"], [0xE1, "m"], [0xE2, "n"], [0xE3, "o"], [0xE4, "p"], [0xE5, "q"], [0xE6, "r"], [0xE7, "s"], [0xE8, "t"], [0xE9, "u"], [0xEA, "v"], [0xEB, "w"], [0xEC, "x"], [0xED, "y"], [0xEE, "z"],
	[0xF0, ":"], [0xF1, "Ä"], [0xF2, "Ö"], [0xF3, "Ü"], [0xF4, "ä"], [0xF5, "ö"], [0xF6, "ü"], [0xF7, " "],
]);

const GEN1_PARTY_OFFSET = 3;
const GEN1_PARTY_DATA_SIZE = 44;
const GEN1_OT_OFFSET = GEN1_PARTY_OFFSET + GEN1_PARTY_DATA_SIZE;
const GEN1_STRING_SIZE = 11;
const GEN1_GENERIC_SEGMENTS = new Set([
	"released",
	"gen 1",
	"classic",
	"international",
	"jpn",
	"eng",
	"japanese",
]);
const GEN1_ENGLISH_CHARMAP = new Map([
	[0x4A, "â™€"], [0x4B, "â™‚"], [0x50, ""], [0x7F, " "],
	[0x80, "A"], [0x81, "B"], [0x82, "C"], [0x83, "D"], [0x84, "E"], [0x85, "F"], [0x86, "G"], [0x87, "H"], [0x88, "I"], [0x89, "J"],
	[0x8A, "K"], [0x8B, "L"], [0x8C, "M"], [0x8D, "N"], [0x8E, "O"], [0x8F, "P"], [0x90, "Q"], [0x91, "R"], [0x92, "S"], [0x93, "T"],
	[0x94, "U"], [0x95, "V"], [0x96, "W"], [0x97, "X"], [0x98, "Y"], [0x99, "Z"],
	[0x9A, "("], [0x9B, ")"], [0x9C, ":"], [0x9D, ";"], [0x9E, "["], [0x9F, "]"],
	[0xA0, "a"], [0xA1, "b"], [0xA2, "c"], [0xA3, "d"], [0xA4, "e"], [0xA5, "f"], [0xA6, "g"], [0xA7, "h"], [0xA8, "i"], [0xA9, "j"],
	[0xAA, "k"], [0xAB, "l"], [0xAC, "m"], [0xAD, "n"], [0xAE, "o"], [0xAF, "p"], [0xB0, "q"], [0xB1, "r"], [0xB2, "s"], [0xB3, "t"],
	[0xB4, "u"], [0xB5, "v"], [0xB6, "w"], [0xB7, "x"], [0xB8, "y"], [0xB9, "z"],
	[0xBA, "Ã©"], [0xE0, "'"], [0xE3, "-"], [0xE6, "?"], [0xE7, "!"], [0xF1, "Ã—"], [0xF3, "/"], [0xF4, ","], [0xF5, "â™€"], [0xF6, "0"],
	[0xF7, "1"], [0xF8, "2"], [0xF9, "3"], [0xFA, "4"], [0xFB, "5"], [0xFC, "6"], [0xFD, "7"], [0xFE, "8"], [0xFF, "9"],
]);
const pokemonCache = new Map();
const speciesCache = new Map();
const moveCache = new Map();
const itemCache = new Map();
let speciesIndexPromise = null;

const BALL_DISPLAY = {
	masterball: { label: "Master Ball", slug: "master-ball" },
	ultraball: { label: "Ultra Ball", slug: "ultra-ball" },
	greatball: { label: "Great Ball", slug: "great-ball" },
	pokeball: { label: "Poké Ball", slug: "poke-ball" },
	safariball: { label: "Safari Ball", slug: "safari-ball" },
	netball: { label: "Net Ball", slug: "net-ball" },
	diveball: { label: "Dive Ball", slug: "dive-ball" },
	nestball: { label: "Nest Ball", slug: "nest-ball" },
	repeatball: { label: "Repeat Ball", slug: "repeat-ball" },
	timerball: { label: "Timer Ball", slug: "timer-ball" },
	luxuryball: { label: "Luxury Ball", slug: "luxury-ball" },
	premierball: { label: "Premier Ball", slug: "premier-ball" },
};

const EVENT_REGION_HINTS = new Map([
	["pokemon rocks america", ["USA"]],
	["journey across america", ["USA"]],
	["poketour", ["USA"]],
	["poke tour", ["USA"]],
	["toys r us", ["USA"]],
	["pokemon center new york", ["USA"]],
	["pcny", ["USA"]],
	["doel", ["EUR"]],
	["channel jirachi", ["EUR", "AUS"]],
	["pokemon channel jirachi", ["EUR", "AUS"]],
	["wishmkr jirachi", ["USA"]],
	["wish eggs", ["USA"]],
	["berry glitch shiny zigzagoon", ["USA", "EUR", "AUS"]],
	["mystry", ["USA"]],
	["mystery mew", ["USA"]],
	["hadou", ["JPN"]],
	["negai boshi", ["JPN"]],
	["tanabata", ["JPN"]],
	["pokopark", ["JPN"]],
	["pokepark", ["JPN"]],
]);

const METHOD_HINTS = [
	[/wondercards?/i, "wonder-card"],
	[/pokemon box/i, "bonus-disc"],
	[/channel jirachi|pokemon channel|wishmkr|colosseum|bonus disc|gamecube/i, "bonus-disc"],
	[/pokemon center new york|pcny|pokemon rocks america|journey across america|10th anniversary|10 aniv|aura mew|mystry|mystery mew|tanabata|hadou|pokepark|pokopark|toys r us/i, "in-person"],
];

function parseArgs(argv) {
	const args = { games: [], generation: null, out: null, sourceDir: null, includeAllCompatible: true, max: null, dryRun: false, parsePayload: true };
	for (let i = 2; i < argv.length; i++) {
		const a = argv[i];
		if (a === "--games") args.games = String(argv[++i] || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
		else if (a === "--generation") args.generation = String(argv[++i] || "").trim();
		else if (a === "--out") args.out = String(argv[++i] || "").trim();
		else if (a === "--source-dir") args.sourceDir = String(argv[++i] || "").trim();
		else if (a === "--max") args.max = Number(argv[++i]);
		else if (a === "--exact-games-only") args.includeAllCompatible = false;
		else if (a === "--dry-run") args.dryRun = true;
		else if (a === "--no-payload") args.parsePayload = false;
		else throw new Error(`Unknown argument: ${a}`);
	}
	if (!args.games.length) throw new Error("Missing --games. Example: --games ruby,sapphire,emerald");
	if (!args.generation) throw new Error("Missing --generation. Example: --generation 3");
	if (args.generation === "1" && !args.sourceDir) args.sourceDir = DEFAULT_GEN1_SOURCE_DIR;
	if (!args.out && !args.dryRun) throw new Error("Missing --out. Example: --out src/data/distributions/gen3.generated.js");
	return args;
}

function isReleasedPath(filePath) {
	return /^Released\//i.test(String(filePath || ""));
}

function toPosixPath(filePath) {
	return String(filePath || "").replace(/\\/g, "/");
}

async function walkLocalFiles(dir, allowedExts) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const out = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			out.push(...await walkLocalFiles(fullPath, allowedExts));
			continue;
		}
		if (allowedExts.has(path.extname(entry.name).toLowerCase())) out.push(fullPath);
	}
	return out;
}

async function githubFetchJson(url) {
	const headers = { Accept: "application/vnd.github+json", "User-Agent": "ppgc-events-scraper", "X-GitHub-Api-Version": "2022-11-28" };
	if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`GitHub request failed ${res.status}: ${url}\n${await res.text().catch(() => "")}`);
	return res.json();
}

async function fetchArrayBuffer(url) {
	const headers = { "User-Agent": "ppgc-events-scraper" };
	if (process.env.GITHUB_TOKEN && url.includes("api.github.com")) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
	return res.arrayBuffer();
}

async function getRecursiveTree() {
	const ref = await githubFetchJson(`https://api.github.com/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
	const sha = ref?.object?.sha;
	if (!sha) throw new Error(`Could not resolve branch SHA for ${BRANCH}`);
	const tree = await githubFetchJson(`https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${sha}?recursive=1`);
	if (tree.truncated) console.warn("Warning: GitHub returned a truncated tree. Use GITHUB_TOKEN if needed.");
	return tree.tree || [];
}

function rawGithubUrl(filePath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${filePath.split("/").map(encodeURIComponent).join("/")}`;
}

function getFileExtension(filePath) {
	const lower = filePath.toLowerCase();
	for (const ext of [...EVENT_EXTENSIONS].sort((a, b) => b.length - a.length)) if (lower.endsWith(ext)) return ext;
	return path.extname(lower);
}
const isEventFile = (filePath) => EVENT_EXTENSIONS.has(getFileExtension(filePath));

function inferGeneration(filePath, ext) {
	const s = filePath.toLowerCase();
	const folderMatch = s.match(/(?:^|\/)gen(?:eration)?\s*([0-9])(?:\/|$)/i) || s.match(/(?:^|\/)gen\s*([0-9])(?:\/|$)/i);
	if (folderMatch) return folderMatch[1];
	if ([".pk1"].includes(ext)) return "1";
	if ([".wc3", ".pk3"].includes(ext)) return "3";
	if ([".wc4", ".pcd", ".pgt", ".pk4"].includes(ext)) return "4";
	if ([".wc5", ".pgf", ".pk5"].includes(ext)) return "5";
	if ([".wc6", ".wc6full", ".pk6"].includes(ext)) return "6";
	if ([".wc7", ".wc7full", ".pk7", ".pb7"].includes(ext)) return "7";
	if ([".wc8", ".pk8", ".pb8", ".pa8"].includes(ext)) return "8";
	if ([".wc9", ".pk9"].includes(ext)) return "9";
	return "unknown";
}

function normalizeTokenText(s) {
	return String(s || "").replace(/[_\-+.()[\]{}]/g, " ").replace(/\s+/g, " ").trim();
}

function splitPathSegments(filePath) {
	return String(filePath || "").split("/").filter(Boolean);
}

function exactAliasLookup(map, text) {
	return map.get(normalizeLookupText(text));
}

function inferGamesFromText(text) {
	const normalized = normalizeTokenText(text);
	const found = new Set();
	for (const [game, re] of GAME_HINTS) if (re.test(normalized)) found.add(game);
	return [...found];
}

function inferPathContext(filePath) {
	const segments = splitPathSegments(filePath);
	const genIndex = segments.findIndex((segment) => /^gen(?:eration)?\s*\d+/i.test(segment));
	const folders = genIndex >= 0 ? segments.slice(genIndex + 1, -1) : segments.slice(0, -1);
	const regions = new Set();
	const languages = new Set();
	const games = new Set();
	const collections = [];
	const sources = [];

	for (const folder of folders) {
		const normalized = normalizeLookupText(folder);
		if (!normalized) continue;

		const regionCode = HIERARCHY_REGION_FOLDERS.get(normalized) || exactAliasLookup(REGION_ALIASES, folder);
		if (regionCode) {
			regions.add(regionCode);
			sources.push(`region:${folder}`);
		}

		const languageCode = exactAliasLookup(LANGUAGE_ALIASES, folder);
		if (languageCode) {
			languages.add(languageCode);
			sources.push(`language:${folder}`);
		}

		for (const game of inferGamesFromText(folder)) {
			games.add(game);
			sources.push(`game:${folder}`);
		}

		if (!regionCode && !languageCode && !GENERIC_COLLECTION_SEGMENTS.has(normalized)) collections.push(folder);
	}

	return {
		segments,
		folders,
		regions: [...regions],
		languages: [...languages],
		games: [...games],
		collections,
		sources,
	};
}

function inferRegions(filePath, pathContext) {
	const found = new Set(pathContext?.regions || []);
	const normalized = normalizeTokenText(filePath).toLowerCase();
	for (const [needle, code] of REGION_ALIASES.entries()) {
		const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		if (new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, "i").test(normalized)) found.add(code);
	}

	const hintSource = normalizeLookupText([filePath, ...(pathContext?.collections || [])].join(" "));
	for (const [needle, codes] of EVENT_REGION_HINTS.entries()) {
		if (!hintSource.includes(needle)) continue;
		for (const code of codes) found.add(code);
	}

	return [...found];
}

function inferLanguages(filePath, pathContext) {
	const found = new Set(pathContext?.languages || []);
	const normalized = normalizeTokenText(filePath).toLowerCase();
	for (const [needle, code] of LANGUAGE_ALIASES.entries()) {
		const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		if (new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, "i").test(normalized)) found.add(code);
	}
	return [...found];
}

function stripHashChunks(s) {
	// Prevent fake years like 2091 from IDs/hashes: (4F3D2091), 5FC2061E, etc.
	return String(s || "")
		.replace(/\([0-9A-F]{6,10}\)/gi, " ")
		.replace(/\b[0-9A-F]{8}\b/gi, " ");
}

function inferDate(filePath) {
	const s = stripHashChunks(filePath);
	let m = s.match(/((?:19|20)\d{2})[-_. ](0[1-9]|1[0-2])[-_. ](0[1-9]|[12]\d|3[01])\D+((?:19|20)\d{2})[-_. ](0[1-9]|1[0-2])[-_. ](0[1-9]|[12]\d|3[01])/);
	if (m) {
		return {
			startDate: `${m[1]}-${m[2]}-${m[3]}`,
			endDate: `${m[4]}-${m[5]}-${m[6]}`,
			datePrecision: "day",
		};
	}
	m = s.match(/(?:^|[^0-9])((?:19|20)\d{2})[-_. ](0[1-9]|1[0-2])[-_. ](0[1-9]|[12]\d|3[01])(?:[^0-9]|$)/);
	if (m) return { startDate: `${m[1]}-${m[2]}-${m[3]}`, datePrecision: "day" };
	m = s.match(/(?:^|[^0-9])((?:19|20)\d{2})[-_. ](0[1-9]|1[0-2])(?:[^0-9]|$)/);
	if (m) return { startDate: `${m[1]}-${m[2]}-01`, startDateDisplay: `${m[1]}-${m[2]}`, datePrecision: "month" };
	m = s.match(/(?:^|[^0-9])((?:19|20)\d{2})(?:[^0-9]|$)/);
	if (m) return { startDate: `${m[1]}-01-01`, startDateDisplay: m[1], datePrecision: "year" };
	return { datePrecision: "unknown" };
}

function titleCase(s) {
	return String(s || "").replace(/[_\-+.()[\]{}]/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

function stripKnownNoise(base) {
	return stripHashChunks(base)
		.replace(/\.(wc3|wc4|wc5|wc6full|wc6|wc7full|wc7|wc8|wc9|pcd|pgt|pgf|pk3|pk4|pk5|pk6|pk7|pk8|pk9|pb7|pb8|pa8)$/i, "")
		.replace(/(?:^|[^0-9])((?:19|20)\d{2})[-_. ](0[1-9]|1[0-2])[-_. ](0[1-9]|[12]\d|3[01])(?:[^0-9]|$)/g, " ")
		.replace(/(?:^|[^0-9])((?:19|20)\d{2})[-_. ](0[1-9]|1[0-2])(?:[^0-9]|$)/g, " ")
		.replace(/\b(19|20)\d{2}\b/g, "")
		.replace(/\b(eng|jpn|fre|ger|ita|spa|kor|chs|cht|usa|eur|japan|korea|global|worldwide)\b/gi, "")
		.replace(/[_\-+.()[\]{}]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function inferEventTitle(filePath) {
	const base = path.basename(filePath);
	const cleaned = stripKnownNoise(base)
		.replace(/^(RS|RSE|FRLG|FL|E)\s+/i, (m) => m.trim().toUpperCase() + " ");
	return titleCase(cleaned || base);
}

function prettifyItemName(raw) {
	return titleCase(
		String(raw || "")
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.replace(/\bAuroraticket\b/i, "Aurora Ticket")
			.replace(/\bEonticket\b/i, "Eon Ticket")
			.replace(/\bMysticticket\b/i, "Mystic Ticket")
			.replace(/\bOldseamap\b/i, "Old Sea Map")
	);
}

function inferRewardFromMetadata(eventTitle, category) {
	if (category !== "key-item") return {};
	const raw = eventTitle.match(/\bItem\s+(.+)$/i)?.[1]
		|| eventTitle.match(/\b(AuroraTicket|EonTicket|MysticTicket|OldSeaMap|Aurora Ticket|Eon Ticket|Mystic Ticket|Old Sea Map)\b/i)?.[1];
	if (!raw) return {};
	return {
		type: "item",
		name: prettifyItemName(raw),
	};
}

function inferPokemonNameFromTitle(eventTitle, species, otList = []) {
	const title = cleanMergedEventTitle(eventTitle);
	const speciesName = String(species || "").trim();
	if (!title || !speciesName) return "";
	const match = title.match(new RegExp(`^(.*?)\\s+${speciesName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\s+Egg)?$`, "i"));
	if (!match) return "";
	const prefix = String(match[1] || "")
		.replace(/\b(rs|rse|frlg|rsefl|emerald|ruby|sapphire)\b/gi, "")
		.replace(/\s+/g, " ")
		.trim();
	if (!prefix) return "";
	const hasNonAscii = /[^\u0000-\u007f]/.test(prefix);
	const normalizedPrefix = normalizeLookupText(prefix);
	if (!normalizedPrefix && !hasNonAscii) return "";
	const otValues = uniqueStrings(otList).map((entry) => normalizeLookupText(entry));
	if (normalizedPrefix && otValues.includes(normalizedPrefix)) return "";
	if (normalizedPrefix && /^(egg|gift|event|distribution)$/.test(normalizedPrefix)) return "";
	if (hasNonAscii && uniqueStrings(otList).includes(prefix)) return "";
	return prefix;
}

function inferLevelFromTitle(eventTitle) {
	const title = String(eventTitle || "");
	const explicit = title.match(/\b(?:level|lvl?|lv\.?)\s*(\d{1,3})\b/i);
	if (explicit) return Number(explicit[1]);
	if (/\begg\b/i.test(title)) return 5;
	return undefined;
}

function inferNatureFromTitle(eventTitle) {
	const title = String(eventTitle || "");
	for (const nature of NATURES) {
		const escaped = nature.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		if (new RegExp(`\\b${escaped}\\b`, "i").test(title)) return [nature];
	}
	return undefined;
}

function inferTidFromText(text) {
	const source = String(text || "");
	const match = source.match(/\b(?:tid|trainer id|id(?:\s*no)?\.?)\s*[:#-]?\s*(\d{1,5})\b/i);
	if (!match) return undefined;
	return String(match[1]).padStart(5, "0");
}

function inferBallFromMetadata(eventTitle) {
	const title = String(eventTitle || "");
	if (/\begg\b/i.test(title)) return { ...BALL_DISPLAY.pokeball };
	const match = title.match(/\b(master|ultra|great|poke|safari|net|dive|nest|repeat|timer|luxury|premier)\s*ball\b/i);
	if (!match) return undefined;
	const key = `${match[1].toLowerCase()}ball`;
	return BALL_DISPLAY[key] ? { ...BALL_DISPLAY[key] } : undefined;
}

function sanitizeTrainerName(name) {
	const text = String(name || "").trim();
	if (!text || /^[-\s]+$/.test(text)) return "";
	return text;
}

function isDistinctPokemonName(name, species) {
	const cleanName = normalizeLookupText(name);
	const cleanSpecies = normalizeLookupText(species);
	if (!cleanName || !cleanSpecies) return false;
	return cleanName !== cleanSpecies;
}

function buildRewardName(name, species) {
	return isDistinctPokemonName(name, species) ? String(name || "").trim() : undefined;
}

function isPlausibleMoveId(id) {
	return Number.isFinite(id) && id > 0 && id <= 10000;
}

function isPlausibleItemId(id) {
	return Number.isFinite(id) && id > 0 && id <= 10000;
}

function normalizeHeldItemAsset(name, slug) {
	const displayName = String(name || "").trim();
	const rawSlug = String(slug || slugify(displayName)).trim();
	const isBerry = /(?:^|-)berry$/i.test(rawSlug) || /\bberry\b/i.test(displayName);
	return cleanUndefined({
		name: displayName || undefined,
		slug: isBerry ? rawSlug.replace(/-berry$/i, "") : rawSlug,
		kind: isBerry ? "berry" : undefined,
	});
}

async function buildPokemonAbilityList(speciesOrDex) {
	if (!speciesOrDex) return [];
	const pokemon = await pokeApiJson("pokemon", speciesOrDex).catch(() => null);
	return uniqueStrings((pokemon?.abilities || [])
		.filter((entry) => !entry.is_hidden)
		.sort((a, b) => a.slot - b.slot)
		.map((entry) => prettyApiName(entry?.ability?.name || "")));
}

async function inferHeldItemsFromTitle(eventTitle) {
	const title = String(eventTitle || "").trim();
	if (!title) return [];
	const candidates = [];
	const berryMatch = title.match(/\b([A-Z][A-Za-z]+)\s+Berry\b/i);
	if (berryMatch) candidates.push(`${berryMatch[1]} Berry`);
	const itemPatterns = [
		/Aurora Ticket/i,
		/Eon Ticket/i,
		/Mystic Ticket/i,
		/Old Sea Map/i,
		/Light Ball/i,
		/Liechi Berry/i,
		/Ganlon Berry/i,
		/Salac Berry/i,
		/Petaya Berry/i,
		/Apicot Berry/i,
		/Enigma Berry/i,
		/Starf Berry/i,
		/Lansat Berry/i,
	];
	for (const pattern of itemPatterns) {
		const match = title.match(pattern);
		if (match) candidates.push(match[0]);
	}
	const uniqueNames = uniqueStrings(candidates);
	const results = [];
	for (const name of uniqueNames) {
		const item = await pokeApiJson("item", slugify(name)).catch(() => null);
		if (!item) continue;
		results.push(normalizeHeldItemAsset(
			item?.names?.find((n) => n.language?.name === "en")?.name || prettyApiName(item?.name),
			item?.name || slugify(name),
		));
	}
	return results;
}

function slugify(s) {
	return String(s || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}

function inferMethod(filePath) {
	const s = normalizeTokenText(filePath).toLowerCase();
	if (/\bserial\b|\bcode\b|password/.test(s)) return "serial-code";
	if (/\bwifi\b|\bwi fi\b|\binternet\b|\bnintendo network\b/.test(s)) return "internet";
	if (/joyspot|\blocal\b|wireless/.test(s)) return "local-wireless";
	if (/\binfrared\b|\bir\b/.test(s)) return "infrared";
	if (/bonus disc|bonusdisc|gamecube|colosseum|channel/.test(s)) return "bonus-disc";
	if (/pokemon center|pokémon center|pcny|toys r us|gamestop|eb games|store|event|poképark|ポケパーク/.test(s)) return "in-person";
	if (/save data|savedata/.test(s)) return "save-data";
	if (/\bdlc\b|downloadable content/.test(s)) return "dlc";
	return "unknown";
}

function inferCompatibleGames(filePath, generation, pathContext) {
	if (pathContext?.games?.length) return pathContext.games;

	const base = path.basename(filePath).toUpperCase();
	const prefix = base.match(/^(RS|RSE|FRLG|FL|E)\s*-/);
	if (prefix) {
		const p = prefix[1];
		if (p === "RS") return ["ruby", "sapphire"];
		if (p === "RSE") return ["ruby", "sapphire", "emerald"];
		if (p === "E") return ["emerald"];
		if (p === "FRLG" || p === "FL") return ["firered", "leafgreen"];
	}

	const text = normalizeTokenText(filePath);
	const found = new Set();
	for (const [game, re] of GAME_HINTS) if (re.test(text)) found.add(game);
	if (found.size) return [...found];
	return GEN_TO_GAMES[generation] || [];
}

function eventMatchesGames(eventGames, requestedGames, includeAllCompatible) {
	const req = new Set(requestedGames.map((x) => x.toLowerCase()));
	const ev = new Set(eventGames.map((x) => x.toLowerCase()));
	if (!eventGames.length) return false;
	if (includeAllCompatible) return [...ev].some((game) => req.has(game));
	if (eventGames.length !== requestedGames.length) return false;
	return [...ev].every((game) => req.has(game));
}

async function pokeApiJson(kind, idOrName) {
	const key = `${kind}:${idOrName}`;
	const cache = kind === "pokemon"
		? pokemonCache
		: kind === "pokemon-species"
			? speciesCache
			: kind === "item"
				? itemCache
				: moveCache;
	if (cache.has(key)) return cache.get(key);
	const res = await fetch(`https://pokeapi.co/api/v2/${kind}/${idOrName}`);
	if (!res.ok) throw new Error(`PokeAPI ${kind}/${idOrName} failed ${res.status}`);
	const json = await res.json();
	cache.set(key, json);
	return json;
}

function prettyApiName(s) {
	return String(s || "").split("-").map((p) => p ? p[0].toUpperCase() + p.slice(1) : p).join(" ");
}

function normalizeEventTitleForMatch(s) {
	return normalizeLookupText(s)
		.replace(/\b(rsefl|rselg|rse|frlg|rs|fl|fr|lg|dppthgss|dppthgss|dppt|dpp|dp|pt|hgss|hg|ss)\b/g, " ")
		.replace(/\b[0-9a-f]{4,8}\b/g, " ")
		.replace(/\b\d+\s+of\s+\d+\b/g, " ")
		.replace(/\bmystry\b/g, " mystery ")
		.replace(/\bwshmkr\b/g, " wishmkr ")
		.replace(/\bchannel jirachi\b/g, " pokemon channel jirachi ")
		.replace(/\bpoke park\b/g, " pokepark ")
		.replace(/\bpokemon\s+pokemon\b/g, " pokemon ")
		.replace(/\s+/g, " ")
		.trim();
}

function normalizeLookupText(s) {
	return String(s || "")
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[♀]/g, " female ")
		.replace(/[♂]/g, " male ")
		.replace(/['’.]/g, "")
		.replace(/[^a-z0-9]+/gi, " ")
		.replace(/\bpok\s+female\s+mon\b/gi, " pokemon ")
		.replace(/\bpok\s+male\s+mon\b/gi, " pokemon ")
		.trim()
		.toLowerCase();
}

async function loadSpeciesIndex() {
	if (!speciesIndexPromise) {
		speciesIndexPromise = (async () => {
			const dexPath = path.resolve(process.cwd(), "data/natidexs/home.js");
			const source = await fs.readFile(dexPath, "utf8");
			const byDex = new Map();
			const byToken = [];
			const seenDex = new Set();
			const re = /natiId:\s*(\d+),\s*name:\s*"([^"]+)"/g;
			let match;
			while ((match = re.exec(source))) {
				const dex = Number(match[1]);
				if (!Number.isFinite(dex) || seenDex.has(dex)) continue;
				seenDex.add(dex);
				const name = match[2];
				const token = normalizeLookupText(name);
				const entry = { dex, name, token };
				byDex.set(dex, entry);
				byToken.push(entry);
			}
			byToken.sort((a, b) => b.token.length - a.token.length);
			return { byDex, byToken };
		})();
	}
	return speciesIndexPromise;
}

async function inferSpeciesFromTitle(title) {
	const normalizedTitle = normalizeLookupText(title);
	if (!normalizedTitle) return null;
	const { byToken } = await loadSpeciesIndex();
	for (const entry of byToken) {
		if (!entry.token) continue;
		const escaped = entry.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		if (new RegExp(`(?:^| )${escaped}(?: |$)`, "i").test(normalizedTitle)) return entry;
	}
	return null;
}

async function getSpeciesByDex(dex) {
	if (!Number.isFinite(dex)) return null;
	const { byDex } = await loadSpeciesIndex();
	return byDex.get(Number(dex)) || null;
}

async function getSpeciesByName(name) {
	const token = normalizeLookupText(name);
	if (!token) return null;
	const { byToken } = await loadSpeciesIndex();
	return byToken.find((entry) => entry.token === token) || null;
}

function slugFromDisplayName(name) {
	return slugify(String(name || "").replace(/\bPoké\b/gi, "poke"));
}

function growthExp(rateName, n) {
	const L = n;
	switch (rateName) {
		case "erratic":
			if (L <= 50) return Math.floor((Math.pow(L, 3) * (100 - L)) / 50);
			if (L <= 68) return Math.floor((Math.pow(L, 3) * (150 - L)) / 100);
			if (L <= 98) return Math.floor((Math.pow(L, 3) * Math.floor((1911 - 10 * L) / 3)) / 500);
			return Math.floor((Math.pow(L, 3) * (160 - L)) / 100);
		case "fast": return Math.floor((4 * Math.pow(L, 3)) / 5);
		case "medium":
		case "medium-fast": return Math.pow(L, 3);
		case "medium-slow": return Math.floor((6 / 5) * Math.pow(L, 3) - 15 * Math.pow(L, 2) + 100 * L - 140);
		case "slow": return Math.floor((5 * Math.pow(L, 3)) / 4);
		case "fluctuating":
			if (L <= 15) return Math.floor(Math.pow(L, 3) * ((((L + 1) / 3) + 24) / 50));
			if (L <= 36) return Math.floor(Math.pow(L, 3) * ((L + 14) / 50));
			return Math.floor(Math.pow(L, 3) * (((L / 2) + 32) / 50));
		default: return Math.pow(L, 3);
	}
}

function levelFromExp(exp, growthRate) {
	let level = 1;
	for (let L = 1; L <= 100; L++) {
		if (exp >= growthExp(growthRate, L)) level = L;
		else break;
	}
	return level;
}

function decodeGen3String(bytes) {
	let out = "";
	for (const b of bytes) {
		if (b === 0xFF) break;
		out += GEN3_CHARMAP.get(b) ?? "";
	}
	return out.trim();
}

function readU16LE(buf, off) { return buf[off] | (buf[off + 1] << 8); }
function readU32LE(buf, off) { return (buf[off] | (buf[off + 1] << 8) | (buf[off + 2] << 16) | (buf[off + 3] << 24)) >>> 0; }
function writeU32LE(buf, off, val) { buf[off] = val & 255; buf[off + 1] = (val >>> 8) & 255; buf[off + 2] = (val >>> 16) & 255; buf[off + 3] = (val >>> 24) & 255; }

const PK3_ORDERS = [
	"GAEM", "GAME", "GEAM", "GEMA", "GMAE", "GMEA",
	"AGEM", "AGME", "AEGM", "AEMG", "AMGE", "AMEG",
	"EGAM", "EGMA", "EAGM", "EAMG", "EMGA", "EMAG",
	"MGAE", "MGEA", "MAGE", "MAEG", "MEGA", "MEAG",
];

function pk3Checksum(data) {
	let sum = 0;
	for (let i = 0; i < data.length; i += 2) sum = (sum + readU16LE(data, i)) & 0xffff;
	return sum;
}

function readPk3Blocks(buf, personality, otFull, checksum) {
	const raw = buf.slice(32, 80);
	if (pk3Checksum(raw) === checksum) {
		return {
			storageKind: "box-decrypted",
			checksumOk: true,
			blocks: {
				G: raw.slice(0, 12),
				A: raw.slice(12, 24),
				E: raw.slice(24, 36),
				M: raw.slice(36, 48),
			},
		};
	}

	const key = (personality ^ otFull) >>> 0;
	const dec = new Uint8Array(48);
	for (let i = 0; i < 48; i += 4) writeU32LE(dec, i, (readU32LE(buf, 32 + i) ^ key) >>> 0);
	const order = PK3_ORDERS[personality % 24];
	const blocks = {};
	for (let i = 0; i < 4; i++) blocks[order[i]] = dec.slice(i * 12, i * 12 + 12);

	return {
		storageKind: "party-encrypted",
		checksumOk: pk3Checksum(dec) === checksum,
		blocks,
	};
}

async function parsePk3Payload(arrayBuffer, options = {}) {
	const buf = new Uint8Array(arrayBuffer);
	if (buf.length < 80) throw new Error(`PK3 file too short: ${buf.length} bytes`);

	const personality = readU32LE(buf, 0);
	const otFull = readU32LE(buf, 4);
	const tid = otFull & 0xffff;
	const sid = otFull >>> 16;
	const nickname = decodeGen3String(buf.slice(8, 18));
	const languageId = buf[18];
	const otName = decodeGen3String(buf.slice(20, 27));
	const checksum = readU16LE(buf, 28);
	const { blocks, checksumOk, storageKind } = readPk3Blocks(buf, personality, otFull, checksum);

	const G = blocks.G;
	const A = blocks.A;
	const M = blocks.M;

	const speciesId = readU16LE(G, 0);
	const heldItemId = readU16LE(G, 2);
	const exp = readU32LE(G, 4);
	const friendship = G[9];
	const moveIds = [readU16LE(A, 0), readU16LE(A, 2), readU16LE(A, 4), readU16LE(A, 6)].filter(Boolean);

	const originInfo = readU16LE(M, 2);
	const metLevel = originInfo & 0x7f;
	const ballId = (originInfo >> 11) & 0x0f;
	const ivEggAbility = readU32LE(M, 4);
	const abilityBit = (ivEggAbility >>> 31) & 1;

	const shinyValue = ((tid ^ sid) ^ ((personality >>> 16) ^ (personality & 0xffff))) & 0xffff;
	const shiny = shinyValue < 8;
	const inferredSpecies = await inferSpeciesFromTitle(options.eventTitle || "");
	const directDexMatch = Number.isFinite(speciesId) && speciesId > 0
		? await getSpeciesByDex(speciesId)
		: null;
	const looksLikeNationalDex = !!directDexMatch;
	const speciesLookupId = inferredSpecies?.dex
		|| directDexMatch?.dex
		|| (storageKind === "party-encrypted" ? speciesId : undefined)
		|| (looksLikeNationalDex ? speciesId : undefined);
	const canUseStructuredFields = checksumOk && Number.isFinite(speciesLookupId);

	let species = null;
	let pokemon = null;
	let speciesName = inferredSpecies?.name || undefined;
	let level = undefined;
	let abilityName = undefined;
	let gender = undefined;
	let heldItem = null;
	let moves = [];
	let ball = undefined;

	if (canUseStructuredFields && Number.isFinite(speciesLookupId)) {
		species = await pokeApiJson("pokemon-species", speciesLookupId).catch(() => null);
		pokemon = await pokeApiJson("pokemon", speciesLookupId).catch(() => null);
		speciesName = species?.names?.find((n) => n.language?.name === "en")?.name
			|| prettyApiName(pokemon?.name || "")
			|| inferredSpecies?.name
			|| undefined;
		const growthRate = species?.growth_rate?.name || "medium-fast";
		if (Number.isFinite(exp) && exp >= 0) level = levelFromExp(exp, growthRate);
		ball = GEN3_BALLS[ballId]
			? { ...BALL_DISPLAY[GEN3_BALLS[ballId]] }
			: { ...BALL_DISPLAY.pokeball };

		const abilities = (pokemon?.abilities || [])
			.filter((a) => !a.is_hidden)
			.sort((a, b) => a.slot - b.slot);
		const pickedAbility = abilities[abilityBit] || abilities[0];
		abilityName = pickedAbility?.ability?.name ? prettyApiName(pickedAbility.ability.name) : undefined;

		const genderRate = species?.gender_rate;
		if (genderRate === -1) gender = "none";
		else if (genderRate === 0) gender = "male";
		else if (genderRate === 8) gender = "female";
		else if (Number.isFinite(genderRate)) {
			const threshold = Math.floor((genderRate / 8) * 255);
			gender = (personality & 0xff) < threshold ? "female" : "male";
		}

		if (isPlausibleItemId(heldItemId)) {
			heldItem = await pokeApiJson("item", heldItemId)
				.then((item) => normalizeHeldItemAsset(
					item?.names?.find((n) => n.language?.name === "en")?.name || prettyApiName(item?.name),
					item?.name || slugify(item?.names?.find((n) => n.language?.name === "en")?.name || `item-${heldItemId}`),
				))
				.catch(() => null);
		}

		for (const id of moveIds.filter(isPlausibleMoveId)) {
			const move = await pokeApiJson("move", id).catch(() => null);
			moves.push({
				name: prettyApiName(move?.names?.find((n) => n.language?.name === "en")?.name || move?.name || `Move ${id}`),
				type: prettyApiName(move?.type?.name || ""),
			});
		}
	}

	const cleanOtName = sanitizeTrainerName(otName);
	const rewardName = buildRewardName(nickname, speciesName);

	if (!checksumOk) {
		return cleanUndefined({
			payloadParsed: true,
			payloadKind: "pk3",
			checksumOk,
			storageKind,
			reward: {
				type: "pokemon",
				species: speciesName,
				name: rewardName,
				nationalDex: inferredSpecies?.dex,
				level,
				gender,
				ball,
				ot: cleanOtName ? [cleanOtName] : [],
				tid: String(tid).padStart(5, "0"),
				ability: abilityName ? [abilityName] : [],
				nature: [NATURES[personality % 25]],
				heldItems: heldItem ? [heldItem] : [],
				moves,
				shiny: shiny || undefined,
			},
		});
	}

	return cleanUndefined({
		payloadParsed: true,
		payloadKind: "pk3",
		checksumOk,
		storageKind,
		reward: {
			type: "pokemon",
			species: prettyApiName(speciesName),
			name: rewardName,
			nationalDex: species?.id || pokemon?.id || inferredSpecies?.dex || speciesId,
			level,
			gender,
			shiny: shiny || undefined,
			ball,
			ot: cleanOtName ? [cleanOtName] : [],
			tid: String(tid).padStart(5, "0"),
			ability: abilityName ? [abilityName] : [],
			nature: [NATURES[personality % 25]],
			heldItems: heldItem ? [heldItem] : [],
			moves,
			friendship,
			metLevel: metLevel || undefined,
		},
	});
}

async function maybeParsePayload(filePath, ext, args) {
	if (!args.parsePayload) return {};
	if (ext !== ".pk3") return {};
	try {
		const buf = await fetchArrayBuffer(rawGithubUrl(filePath));
		return await parsePk3Payload(buf, { eventTitle: inferEventTitle(filePath) });
	} catch (err) {
		return {};
	}
}

function normalizeWhitespace(value) {
	return String(value || "").replace(/\s+/g, " ").trim();
}

function parseGen1Filename(filePath) {
	const baseName = path.basename(filePath, path.extname(filePath));
	const match = baseName.match(/^([A-Z]+)\s*-\s*(.+?)\s*\((\d+)\)\s*(.+)$/u);
	if (!match) return null;
	return {
		gameCode: match[1].trim(),
		ot: normalizeWhitespace(match[2]),
		tid: match[3],
		species: normalizeWhitespace(match[4]),
	};
}

function inferGen1GamesFromCode(gameCode) {
	const code = String(gameCode || "").toUpperCase();
	const games = [];
	if (code.includes("R")) games.push("red");
	if (code.includes("B")) games.push("blue");
	if (code.includes("Y")) games.push("yellow");
	return uniqueStrings(games);
}

function inferGen1EventTitle(relativePath) {
	const segments = String(relativePath || "").split("/").map((part) => normalizeWhitespace(part)).filter(Boolean);
	const folderSegments = segments.slice(0, -1);
	const preferred = folderSegments.filter((part) => !GEN1_GENERIC_SEGMENTS.has(part.toLowerCase()));
	return preferred.at(-1) || folderSegments.at(-1) || "Unknown Event";
}

function decodeEnglishGen1String(bytes) {
	let out = "";
	for (const byte of bytes) {
		if (byte === 0x50) break;
		out += GEN1_ENGLISH_CHARMAP.get(byte) ?? "";
	}
	return normalizeWhitespace(out);
}

function isProbablyEnglishString(text) {
	return !!text && /[A-Za-z0-9â™€â™‚]/.test(text);
}

async function parsePk1Payload(buffer, filenameMeta) {
	if (buffer.length < GEN1_OT_OFFSET + (GEN1_STRING_SIZE * 2)) return null;

	const party = buffer.subarray(GEN1_PARTY_OFFSET, GEN1_PARTY_OFFSET + GEN1_PARTY_DATA_SIZE);
	const otBytes = buffer.subarray(GEN1_OT_OFFSET, GEN1_OT_OFFSET + GEN1_STRING_SIZE);
	const nickBytes = buffer.subarray(GEN1_OT_OFFSET + GEN1_STRING_SIZE, GEN1_OT_OFFSET + (GEN1_STRING_SIZE * 2));

	const level = party[0x21] || party[0x03] || null;
	const speciesEntry = await getSpeciesByName(filenameMeta?.species || "");
	const moveIds = [party[0x08], party[0x09], party[0x0A], party[0x0B]].filter((id) => id > 0 && id <= 165);
	const moves = [];
	for (const id of moveIds) {
		const move = await pokeApiJson("move", id).catch(() => null);
		moves.push(move ? { name: prettyApiName(move.name), type: prettyApiName(move.type?.name || "") } : { name: `Move ${id}` });
	}
	const decodedOt = decodeEnglishGen1String(otBytes);
	const decodedNickname = decodeEnglishGen1String(nickBytes);
	const speciesName = speciesEntry?.name || filenameMeta?.species || null;
	const nickname = isProbablyEnglishString(decodedNickname) ? decodedNickname : speciesName;
	const ot = isProbablyEnglishString(decodedOt) ? decodedOt : filenameMeta?.ot || null;
	const tid = filenameMeta?.tid || String((party[0x0C] << 8) | party[0x0D]).padStart(5, "0");

	return cleanUndefined({
		level,
		species: speciesName,
		nationalDex: speciesEntry?.dex || null,
		nickname,
		ot,
		tid,
		moves,
		ball: { name: "PokÃ© Ball", slug: "poke-ball" },
	});
}

function inferGen1Regions(title, relativePath) {
	const haystack = `${title} ${relativePath}`.toLowerCase();
	const regions = [];
	const push = (code) => { if (!regions.includes(code)) regions.push(code); };
	if (/(^|[\\/ ]|\.)(jpn|japanese)([\\/ ]|$)|space world|japan/.test(haystack)) push("JPN");
	if (/\bu\.s\.\b|\busa\b|\bnintendo power\b|\bpok[eÃ©]mon power\b|\bpok[eÃ©] tour\b|\byoshira\b|\byoshiba\b/.test(haystack)) push("USA");
	if (/\bcanadian\b|\bcanada\b/.test(haystack)) push("CAN");
	if (/\buk\b|united kingdom|great britain/.test(haystack)) push("GBR");
	if (/\bspain\b|\bspanish\b/.test(haystack)) push("ESP");
	if (/\baustria\b/.test(haystack)) push("AUT");
	if (/\bdenmark\b/.test(haystack)) push("DNK");
	if (/\bfinland\b/.test(haystack)) push("FIN");
	if (/\bnorway\b/.test(haystack)) push("NOR");
	if (/\beurope\b|\bstadium tour\b|\bclub nintendo\b|\blinkw\b|\bluigi/.test(haystack)) push("EUR");
	return regions;
}

function inferGen1Languages(relativePath) {
	const lower = String(relativePath || "").toLowerCase();
	if (/(^|\\|\/)(jpn|japanese)($|\\|\/)/.test(lower)) return ["ja"];
	if (/spanish/.test(lower)) return ["es"];
	return ["en"];
}

function readableLocalPathNote(relativePath, eventTitle) {
	const segments = String(relativePath || "").split("/").map((part) => normalizeWhitespace(part)).filter(Boolean);
	const folders = segments.slice(0, -1);
	const useful = folders.filter((part) => !GEN1_GENERIC_SEGMENTS.has(part.toLowerCase()) && !/^(ENG|JPN|KOR|FRE|GER|ITA|SPA)$/i.test(part));
	const filtered = useful.filter((part, index) => index !== useful.length - 1 || normalizeLookupText(part) !== normalizeLookupText(eventTitle));
	const parts = filtered.length ? filtered : useful;
	return parts.length ? parts.join(" | ") : undefined;
}

async function buildEventFromLocalGen1File(filePath, args) {
	const filenameMeta = parseGen1Filename(filePath);
	if (!filenameMeta) return null;

	const games = inferGen1GamesFromCode(filenameMeta.gameCode).filter((game) => args.games.includes(game));
	if (!games.length) return null;

	const relativePath = toPosixPath(path.relative(args.sourceDir, filePath));
	const eventTitle = inferGen1EventTitle(relativePath);
	const date = inferDate(`${eventTitle} ${relativePath}`);
	const payload = await parsePk1Payload(await fs.readFile(filePath), filenameMeta);
	if (!payload) return null;

	return cleanUndefined({
		id: slugify([`gen${args.generation}`, eventTitle, payload.species, payload.ot || filenameMeta.ot, payload.nickname || payload.species].filter(Boolean).join(" ")),
		eventTitle,
		category: "pokemon",
		method: "in-person",
		status: "released",
		regions: inferGen1Regions(eventTitle, relativePath),
		languages: inferGen1Languages(relativePath),
		startDate: date.startDate,
		endDate: date.endDate,
		startDateDisplay: date.startDateDisplay,
		datePrecision: date.datePrecision,
		obtainMethod: { delivery: "in-person" },
		reward: cleanUndefined({
			type: "pokemon",
			species: payload.species,
			name: payload.nickname,
			nationalDex: payload.nationalDex,
			level: payload.level,
			ball: payload.ball,
			ot: payload.ot ? [payload.ot] : [],
			tid: payload.tid ? [payload.tid] : [],
			moves: payload.moves,
		}),
		notes: [readableLocalPathNote(relativePath, eventTitle)],
	});
}

function cleanUndefined(obj) {
	if (Array.isArray(obj)) return obj.map(cleanUndefined).filter((x) => x !== undefined && x !== null && !(Array.isArray(x) && x.length === 0));
	if (!obj || typeof obj !== "object") return obj;
	const out = {};
	for (const [k, v] of Object.entries(obj)) {
		const cleaned = cleanUndefined(v);
		const isEmptyArray = Array.isArray(cleaned) && cleaned.length === 0;
		const isEmptyObject = cleaned && typeof cleaned === "object" && !Array.isArray(cleaned) && Object.keys(cleaned).length === 0;
		if (cleaned === undefined || cleaned === null || cleaned === "" || isEmptyArray || isEmptyObject) continue;
		out[k] = cleaned;
	}
	return out;
}

function mergeReward(baseReward, parsedReward) {
	return cleanUndefined({ ...(baseReward || {}), ...(parsedReward || {}) });
}

async function applyRewardFallbacks(reward, eventTitle, category) {
	const nextReward = { ...(reward || {}) };

	Object.assign(nextReward, inferRewardFromMetadata(eventTitle, category));

	if (Number.isFinite(nextReward.nationalDex) && !nextReward.species) {
		const species = await getSpeciesByDex(nextReward.nationalDex);
		if (species) nextReward.species = species.name;
	}

	if (!nextReward.species || !Number.isFinite(nextReward.nationalDex)) {
		const inferredSpecies = await inferSpeciesFromTitle(eventTitle);
		if (inferredSpecies) {
			if (!nextReward.species) nextReward.species = inferredSpecies.name;
			if (!Number.isFinite(nextReward.nationalDex)) nextReward.nationalDex = inferredSpecies.dex;
		}
	}

	if (!nextReward.level) nextReward.level = inferLevelFromTitle(eventTitle);
	if (!nextReward.name && nextReward.type === "pokemon" && nextReward.species) {
		nextReward.name = inferPokemonNameFromTitle(eventTitle, nextReward.species, nextReward.ot || []);
	}
	if (!Array.isArray(nextReward.nature) || !nextReward.nature.length) {
		nextReward.nature = inferNatureFromTitle(eventTitle);
	}
	if (!nextReward.tid) nextReward.tid = inferTidFromText(eventTitle);
	if (!nextReward.ball) nextReward.ball = inferBallFromMetadata(eventTitle);

	if (!Array.isArray(nextReward.ability) || !nextReward.ability.length) {
		const abilityList = await buildPokemonAbilityList(nextReward.nationalDex || nextReward.species);
		if (abilityList.length) nextReward.ability = abilityList;
	}

	if ((!Array.isArray(nextReward.heldItems) || !nextReward.heldItems.length) && nextReward.type === "pokemon") {
		const heldItems = await inferHeldItemsFromTitle(eventTitle);
		if (heldItems.length) nextReward.heldItems = heldItems;
	}

	return cleanUndefined(nextReward);
}

async function buildEventFromTreeItem(item, args) {
	const filePath = item.path;
	if (!isReleasedPath(filePath)) return null;
	const ext = getFileExtension(filePath);
	const inferredGeneration = inferGeneration(filePath, ext);
	const targetGeneration = String(args.generation);
	const generationMatches = inferredGeneration === "unknown" || inferredGeneration === targetGeneration || (targetGeneration === "9_2" && inferredGeneration === "9");
	if (!generationMatches) return null;

	const pathContext = inferPathContext(filePath);
	const games = inferCompatibleGames(filePath, targetGeneration, pathContext);
	if (!eventMatchesGames(games, args.games, args.includeAllCompatible)) return null;

	const date = inferDate(filePath);
	const eventTitle = inferEventTitle(filePath);
	const category = ext.startsWith(".pk") ? "pokemon" : inferCategoryFromTitle(eventTitle);
	const regions = inferRegions(filePath, pathContext);
	const languages = inferLanguages(filePath, pathContext);
	const method = refineMethod(inferMethod(filePath), filePath, eventTitle, pathContext);
	const status = inferStatus(filePath, pathContext);
	const parsed = await maybeParsePayload(filePath, ext, args);
	const baseReward = { type: ext.startsWith(".pk") ? "pokemon" : "unknown" };
	const mergedReward = mergeReward(baseReward, parsed.reward);
	const reward = await applyRewardFallbacks(mergedReward, eventTitle, category);
	if (ext === ".pk3" && reward?.type === "pokemon" && !reward.ball) {
		reward.ball = { ...BALL_DISPLAY.pokeball };
	}
	const finalRegions = regions.length ? regions : undefined;
	const finalStartDate = date.startDate;
	const finalEndDate = date.endDate;
	const finalDatePrecision = date.datePrecision;

	const regionForId = finalRegions?.[0] || "unknown";
	const dateForId = date.startDateDisplay || finalStartDate || "unknown-date";
	const speciesForId = reward?.species;
	const id = slugify([`gen${targetGeneration}`, eventTitle, speciesForId, regionForId, dateForId].filter(Boolean).join(" "));

	const event = {
		id,
		eventTitle,
		category,
		method,
		status,
		regions: finalRegions,
		languages: languages.length ? languages : undefined,
		startDate: finalStartDate,
		endDate: finalEndDate,
		startDateDisplay: date.startDateDisplay,
		datePrecision: finalDatePrecision,
		obtainMethod: inferObtainMethod(filePath, method),
		reward,
		notes: [
			readablePathNoteClean(filePath, pathContext),
			...(parsed.notes || []),
		],
	};

	return cleanUndefined(event);
}

function inferCategoryFromTitle(title) {
	const s = String(title || "").toLowerCase();
	if (/ticket|item|berry|ball|key/.test(s)) return "key-item";
	return "pokemon";
}

function inferStatus(filePath, pathContext) {
	const text = normalizeLookupText([filePath, ...(pathContext?.segments || [])].join(" "));
	if (/\bunreleased\b|\bprototype\b|\bbeta\b|\bdebug\b/.test(text)) return "unreleased";
	if (/\breleased\b/.test(text)) return "released";
	return "unknown";
}

function refineMethod(method, filePath, eventTitle, pathContext) {
	if (method && method !== "unknown") return method;
	const text = normalizeLookupText([filePath, eventTitle, ...(pathContext?.collections || [])].join(" "));
	for (const [pattern, value] of METHOD_HINTS) {
		if (pattern.test(text)) return value;
	}
	return method;
}

function inferObtainMethod(filePath, method) {
	const req = [];
	const s = String(filePath || "");
	if (/JoySpot/i.test(s)) req.push("JoySpot distribution");
	if (/Pokémon Center New York|Pokemon Center New York|PCNY/i.test(s)) req.push("Pokémon Center New York event distribution");
	if (/ポケパーク|Pok[eé]Park/i.test(s)) req.push("PokéPark event distribution");
	return cleanUndefined({ requirements: req, location: inferLocationFromPath(filePath), delivery: method });
}

function inferLocationFromPath(filePath) {
	if (/Pokémon Center New York|Pokemon Center New York|PCNY/i.test(filePath)) return "Pokémon Center New York";
	if (/ポケパーク|Pok[eé]Park/i.test(filePath)) return "PokéPark";
	return undefined;
}

function readablePathNote(filePath) {
	const parts = filePath.split("/").slice(2, -1).filter(Boolean);
	const useful = parts.filter((p) => !/^Gen \d$/i.test(p) && !/^(ENG|JPN|KOR|FRE|GER|ITA|SPA)$/i.test(p));
	return useful.length ? useful.join(" • ") : `Imported path: ${filePath}`;
}

function readablePathNoteClean(filePath, pathContext) {
	const parts = pathContext?.collections?.length
		? pathContext.collections
		: filePath.split("/").slice(1, -1).filter(Boolean);
	const useful = parts.filter((p) => !/^Gen \d$/i.test(p) && !/^(ENG|JPN|KOR|FRE|GER|ITA|SPA)$/i.test(p));
	return useful.length ? useful.join(" | ") : `Imported path: ${filePath}`;
}

function jsString(value) {
	return JSON.stringify(value, null, 2).replace(/"([^"\\]*(?:\\.[^"\\]*)*)":/g, "$1:");
}

function rawExpr(code) {
	return { __raw: code };
}

function quoteKey(key) {
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
}

function getBallDisplayName(value) {
	if (value?.slug) {
		if (value.slug === "poke-ball") return "Pok\u00E9 Ball";
		const lookup = Object.values(BALL_DISPLAY).find((ballValue) => ballValue.slug === value.slug)?.label;
		if (lookup) return lookup;
	}
	return value?.label || value?.name;
}

function toRenderable(value, parentKey = "") {
	if (Array.isArray(value)) {
		const items = value.map((item) => toRenderable(item, parentKey));
		if (parentKey === "nature") {
			const inline = items.map((item) => inlineScalar(item));
			if (!inline.some((item) => item == null)) return rawExpr(`[${inline.join(", ")}]`);
		}
		return items;
	}
	if (!value || typeof value !== "object") return value;

	if (parentKey === "ball" && value.slug) {
		const ballName = getBallDisplayName(value);
		if (ballName) return rawExpr(`{ name: ${JSON.stringify(ballName)}, img: () => ball(${JSON.stringify(value.slug)}) }`);
	}

	if (parentKey === "heldItems" && value.slug && value.name) {
		const resolver = value.kind === "berry" ? "berry" : "heldItem";
		return rawExpr(`{ name: ${JSON.stringify(value.name)}, img: () => ${resolver}(${JSON.stringify(value.slug)}) }`);
	}

	const out = {};
	for (const [k, v] of Object.entries(value)) out[k] = toRenderable(v, k);
	return out;
}

function inlineScalar(value) {
	if (value && typeof value === "object" && value.__raw) return value.__raw;
	if (Array.isArray(value) || (value && typeof value === "object")) return null;
	return JSON.stringify(value);
}

function tryInline(value) {
	if (value && typeof value === "object" && value.__raw) return value.__raw;

	const scalar = inlineScalar(value);
	if (scalar != null) return scalar;

	if (Array.isArray(value)) {
		if (value.length > 4) return null;
		const parts = value.map((item) => tryInline(item));
		if (parts.some((part) => part == null)) return null;
		const rendered = `[${parts.join(", ")}]`;
		return rendered.length <= 140 ? rendered : null;
	}

	const entries = Object.entries(value || {});
	if (entries.length > 5) return null;
	const parts = [];
	for (const [key, val] of entries) {
		const rendered = tryInline(val);
		if (rendered == null) return null;
		parts.push(`${quoteKey(key)}: ${rendered}`);
	}
	const text = `{ ${parts.join(", ")} }`;
	return text.length <= 180 ? text : null;
}

function renderJs(value, indent = 0) {
	const inline = tryInline(value);
	if (inline != null) return inline;

	const pad = "\t".repeat(indent);
	const childPad = "\t".repeat(indent + 1);

	if (Array.isArray(value)) {
		const items = value.map((item) => `${childPad}${renderJs(item, indent + 1)}`);
		return `[\n${items.join(",\n")}\n${pad}]`;
	}

	if (value && typeof value === "object") {
		const entries = Object.entries(value);
		const lines = entries.map(([key, val]) => `${childPad}${quoteKey(key)}: ${renderJs(val, indent + 1)}`);
		return `{\n${lines.join(",\n")}\n${pad}}`;
	}

	return JSON.stringify(value);
}

function renderEventObject(event) {
	return renderJs(toRenderable(event), 1);
}

function uniqueStrings(values) {
	return [...new Set((values || []).filter(Boolean).map((value) => String(value)))];
}

function uniqueObjectsByKey(values, keyFn) {
	const out = [];
	const seen = new Set();
	for (const value of values || []) {
		if (!value) continue;
		const key = keyFn(value);
		if (!key || seen.has(key)) continue;
		seen.add(key);
		out.push(value);
	}
	return out;
}

function mergeStringArrays(...arrays) {
	return uniqueStrings(arrays.flat());
}

function mergeObjectArrays(values, keyFn) {
	return uniqueObjectsByKey(values.flat(), keyFn);
}

function collapseNatureValues(natures) {
	const list = uniqueStrings(natures);
	if (!list.length) return undefined;
	if (list.includes("Random")) return ["Random"];
	return list.length >= NATURES.length ? ["Random"] : list;
}

function eventGroupKey(event) {
	const reward = event?.reward || {};
	const method = event?.method || "";
	const regionKey = method === "in-person"
		? uniqueStrings(event?.regions).join(",")
		: "";
	return [
		event?.category || "",
		normalizeEventTitleForMatch(event?.eventTitle || ""),
		normalizeLookupText(reward.species || reward.name || reward.type || ""),
		regionKey,
		uniqueStrings(event?.languages).join(","),
		method,
	].join("|");
}

function cleanMergedEventTitle(title) {
	return String(title || "")
		.replace(/^\s*(?:rs|rse|rselg|rsefl|frlg|fr|lg|fl|e|c|xd|dppt|dp|pt|hgss|hg|ss|bw|bw2|b2w2|xy|oras|sm|usum|swsh|bdsp|pla|sv)\b[\s-]*/i, "")
		.replace(/\b[0-9A-F]{4,8}\b/gi, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function buildMergedEventId(event) {
	const reward = event?.reward || {};
	const cleanedTitle = cleanMergedEventTitle(event?.eventTitle || "");
	const speciesOrName = reward.species || reward.name;
	const includeRewardInId = speciesOrName
		&& !normalizeEventTitleForMatch(cleanedTitle).includes(normalizeLookupText(speciesOrName));
	return slugify([
		`gen${event?.id?.match(/^gen([^-\s]+)/)?.[1] || ""}`,
		cleanedTitle,
		includeRewardInId ? speciesOrName : undefined,
		uniqueStrings(event?.regions)[0] || "unknown",
		event?.startDateDisplay || event?.startDate || "unknown-date",
	].filter(Boolean).join(" "));
}

function pickPreferredScalar(...values) {
	for (const value of values) {
		if (value === undefined || value === null || value === "") continue;
		return value;
	}
	return undefined;
}

function mergeRewards(rewards) {
	const merged = {
		type: pickPreferredScalar(...rewards.map((reward) => reward?.type)),
		species: pickPreferredScalar(...rewards.map((reward) => reward?.species)),
		name: pickPreferredScalar(...rewards.map((reward) => reward?.name)),
		nationalDex: pickPreferredScalar(...rewards.map((reward) => reward?.nationalDex)),
		level: pickPreferredScalar(...rewards.map((reward) => reward?.level)),
		gender: pickPreferredScalar(...rewards.map((reward) => reward?.gender)),
		shiny: pickPreferredScalar(...rewards.map((reward) => reward?.shiny)),
		ball: pickPreferredScalar(...rewards.map((reward) => reward?.ball)),
		friendship: pickPreferredScalar(...rewards.map((reward) => reward?.friendship)),
		metLevel: pickPreferredScalar(...rewards.map((reward) => reward?.metLevel)),
	};

	const genders = uniqueStrings(rewards.map((reward) => reward?.gender).filter(Boolean));
	if (genders.length > 1) merged.gender = "Random";

	merged.ot = mergeStringArrays(...rewards.map((reward) => reward?.ot || []));
	merged.tid = mergeStringArrays(...rewards.map((reward) => Array.isArray(reward?.tid) ? reward.tid : reward?.tid ? [reward.tid] : []));
	merged.ability = mergeStringArrays(...rewards.map((reward) => reward?.ability || []));
	merged.nature = collapseNatureValues(rewards.flatMap((reward) => reward?.nature || []));
	merged.moves = mergeObjectArrays(rewards.map((reward) => reward?.moves || []), (move) => `${move.name}|${move.type || ""}`);
	merged.heldItems = mergeObjectArrays(rewards.map((reward) => reward?.heldItems || []), (item) => item.slug || item.name);

	return cleanUndefined(merged);
}

function mergeEvents(events) {
	const groups = new Map();

	for (const event of events) {
		const key = eventGroupKey(event);
		const group = groups.get(key);
		if (!group) {
			groups.set(key, { ...event, reward: { ...(event.reward || {}) } });
			continue;
		}

		group.regions = mergeStringArrays(group.regions || [], event.regions || []);
		group.languages = mergeStringArrays(group.languages || [], event.languages || []);
		group.notes = mergeStringArrays(group.notes || [], event.notes || []);
		group.status = pickPreferredScalar(group.status === "unknown" ? undefined : group.status, event.status === "unknown" ? undefined : event.status, group.status, event.status);
		group.startDate = pickPreferredScalar(group.startDate, event.startDate);
		group.endDate = pickPreferredScalar(group.endDate, event.endDate);
		group.startDateDisplay = pickPreferredScalar(group.startDateDisplay, event.startDateDisplay);
		group.datePrecision = pickPreferredScalar(group.datePrecision === "unknown" ? undefined : group.datePrecision, event.datePrecision === "unknown" ? undefined : event.datePrecision, group.datePrecision, event.datePrecision);
		group.obtainMethod = cleanUndefined({
			delivery: pickPreferredScalar(group.obtainMethod?.delivery, event.obtainMethod?.delivery),
			location: pickPreferredScalar(group.obtainMethod?.location, event.obtainMethod?.location),
			requirements: mergeStringArrays(group.obtainMethod?.requirements || [], event.obtainMethod?.requirements || []),
		});
		group.reward = mergeRewards([group.reward || {}, event.reward || {}]);
	}

	return [...groups.values()].map((event) => cleanUndefined({
		...event,
		eventTitle: cleanMergedEventTitle(event.eventTitle),
		id: buildMergedEventId({
			...event,
			eventTitle: cleanMergedEventTitle(event.eventTitle),
		}),
		reward: mergeRewards([event.reward || {}]),
	}));
}

function renderOutput(events, args) {
	const genValue = Number.isFinite(Number(args.generation)) ? Number(args.generation) : JSON.stringify(args.generation);
	const gameKeys = `[${args.games.map((game) => JSON.stringify(game)).join(", ")}]`;
	const renderableEvents = events.map(({ games, generation, ...event }) => event);
	const eventBlocks = renderableEvents.map((event) => `\t${renderEventObject(event)}`).join(",\n");
	return `// AUTO-GENERATED by scripts/scrapers/gen3-scrape.mjs
// Review before committing. Payload-backed fields are included when the source format supports them.

import {
\tdefineDistributionsMany,
\t_ball,
\t_berry,
\t_heldItem,
\t_ribbon,
\t_frontSprite,
\t_frontSpriteShiny,
} from '../helpers/index.js';

const gen = ${genValue};
const GAME_KEYS = ${gameKeys};

const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
const shinySprite = (gameKey, natiId) => _frontSpriteShiny(gen, gameKey, natiId);
const berry = (name) => _berry(gen, name);
const ball = (name) => _ball(gen, name);
const heldItem = (name) => _heldItem(gen, name);
const ribbon = (name) => _ribbon(gen, name);

const DISTRIBUTIONS = [
${eventBlocks}
];

window.DATA = window.DATA || {};
window.DATA.distributions = window.DATA.distributions || {};

defineDistributionsMany(GAME_KEYS, () => DISTRIBUTIONS);
`;
}

function logScrapeSummary(events) {
	const items = events.filter((event) => event.reward?.type === "item").length;
	const withRegions = events.filter((event) => Array.isArray(event.regions) && event.regions.length).length;
	const withLanguages = events.filter((event) => Array.isArray(event.languages) && event.languages.length).length;
	const withHeldItems = events.filter((event) => Array.isArray(event.reward?.heldItems) && event.reward.heldItems.length).length;
	console.log(`Summary: ${items} item events, ${withRegions} with regions, ${withLanguages} with languages, ${withHeldItems} with held items.`);
}

export async function runScraperCli(argv = process.argv) {
	const args = parseArgs(argv);
	const events = [];

	if (String(args.generation) === "1") {
		const files = await walkLocalFiles(args.sourceDir, new Set([".pk1"]));
		console.log(`Found ${files.length} local Gen 1 event files in ${args.sourceDir}`);
		for (const filePath of files) {
			const event = await buildEventFromLocalGen1File(filePath, args);
			if (event) {
				events.push(event);
				if (events.length % 25 === 0) console.log(`Matched/parsed ${events.length}...`);
			}
			if (args.max && events.length >= args.max) break;
		}
	} else {
		console.log(`Fetching ${OWNER}/${REPO} tree...`);
		const tree = await getRecursiveTree();
		const files = tree.filter((x) => x.type === "blob").filter((x) => isReleasedPath(x.path)).filter((x) => isEventFile(x.path));
		console.log(`Found ${files.length} likely event files.`);
		for (const item of files) {
			const event = await buildEventFromTreeItem(item, args);
			if (event) {
				events.push(event);
				if (events.length % 25 === 0) console.log(`Matched/parsed ${events.length}...`);
			}
			if (args.max && events.length >= args.max) break;
		}
	}

	const mergedEvents = mergeEvents(events);

	mergedEvents.sort((a, b) => {
		const ad = a.startDate || "";
		const bd = b.startDate || "";
		if (ad && bd) return bd.localeCompare(ad);
		if (ad && !bd) return -1;
		if (!ad && bd) return 1;
		return String(a.eventTitle).localeCompare(String(b.eventTitle));
	});

	console.log(`Matched ${events.length} raw files and collapsed them into ${mergedEvents.length} events for games: ${args.games.join(", ")}`);
	logScrapeSummary(mergedEvents);
	if (args.dryRun) {
		console.log(JSON.stringify(mergedEvents.slice(0, args.max || 10), null, 2));
		return;
	}
	const outText = renderOutput(mergedEvents, args);
	await fs.mkdir(path.dirname(args.out), { recursive: true });
	await fs.writeFile(args.out, outText, "utf8");
	console.log(`Wrote ${args.out}`);
}

const isDirectRun = !!process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
	runScraperCli().catch((err) => {
		console.error(err);
		process.exit(1);
	});
}
