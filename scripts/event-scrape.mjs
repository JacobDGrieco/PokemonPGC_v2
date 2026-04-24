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
 *   node tools/event-scrape-v2.mjs --games ruby,sapphire --generation 3 --out src/data/distributions/ruby-sapphire.js
 *
 * Optional:
 *   GITHUB_TOKEN=ghp_xxx node tools/event-scrape-v2.mjs ...
 *   --dry-run
 *   --max 50
 *   --no-payload     skips downloading/parsing .pk3 files
 */

import fs from "node:fs/promises";
import path from "node:path";

const OWNER = "projectpokemon";
const REPO = "EventsGallery";
const BRANCH = "master";

const EVENT_EXTENSIONS = new Set([
	".wc3", ".wc4", ".wc5", ".wc6", ".wc6full", ".wc7", ".wc7full", ".wc8", ".wc9",
	".pcd", ".pgt", ".pgf",
	".pk3", ".pk4", ".pk5", ".pk6", ".pk7", ".pk8", ".pk9",
	".pb7", ".pb8", ".pa8",
]);

const REGION_ALIASES = new Map([
	["usa", "USA"], ["us", "USA"], ["america", "USA"], ["na", "NA"], ["north america", "NA"],
	["eur", "EUR"], ["eu", "EUR"], ["europe", "EUR"],
	["jpn", "JPN"], ["jp", "JPN"], ["japan", "JPN"],
	["kor", "KOR"], ["kr", "KOR"], ["korea", "KOR"], ["korean", "KOR"],
	["chn", "CHN"], ["china", "CHN"], ["tw", "TWN"], ["taiwan", "TWN"], ["hk", "HKG"], ["hong kong", "HKG"],
	["sg", "SGP"], ["singapore", "SGP"], ["aus", "AUS"], ["australia", "AUS"],
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

const GEN_TO_GAMES = {
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
	1: "masterball", 2: "ultraball", 3: "greatball", 4: "pokeball", 5: "safariball",
	6: "netball", 7: "diveball", 8: "nestball", 9: "repeatball", 10: "timerball",
	11: "luxuryball", 12: "premierball",
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

const pokemonCache = new Map();
const speciesCache = new Map();
const moveCache = new Map();

function parseArgs(argv) {
	const args = { games: [], generation: null, out: null, includeAllCompatible: true, max: null, dryRun: false, parsePayload: true };
	for (let i = 2; i < argv.length; i++) {
		const a = argv[i];
		if (a === "--games") args.games = String(argv[++i] || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
		else if (a === "--generation") args.generation = String(argv[++i] || "").trim();
		else if (a === "--out") args.out = String(argv[++i] || "").trim();
		else if (a === "--max") args.max = Number(argv[++i]);
		else if (a === "--exact-games-only") args.includeAllCompatible = false;
		else if (a === "--dry-run") args.dryRun = true;
		else if (a === "--no-payload") args.parsePayload = false;
		else throw new Error(`Unknown argument: ${a}`);
	}
	if (!args.games.length) throw new Error("Missing --games. Example: --games ruby,sapphire,emerald");
	if (!args.generation) throw new Error("Missing --generation. Example: --generation 3");
	if (!args.out && !args.dryRun) throw new Error("Missing --out. Example: --out src/data/distributions/gen3.generated.js");
	return args;
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

function inferRegions(filePath) {
	const normalized = normalizeTokenText(filePath).toLowerCase();
	const found = new Set();
	for (const [needle, code] of REGION_ALIASES.entries()) {
		const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		if (new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, "i").test(normalized)) found.add(code);
	}
	return [...found];
}

function inferLanguages(filePath) {
	const normalized = normalizeTokenText(filePath).toLowerCase();
	const found = new Set();
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
	let m = s.match(/(?:^|[^0-9])((?:19|20)\d{2})[-_. ](0[1-9]|1[0-2])[-_. ](0[1-9]|[12]\d|3[01])(?:[^0-9]|$)/);
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

function inferCompatibleGames(filePath, generation) {
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
	const cache = kind === "pokemon" ? pokemonCache : kind === "pokemon-species" ? speciesCache : moveCache;
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

async function parsePk3Payload(arrayBuffer) {
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
	const key = (personality ^ otFull) >>> 0;

	const dec = new Uint8Array(48);
	for (let i = 0; i < 48; i += 4) writeU32LE(dec, i, (readU32LE(buf, 32 + i) ^ key) >>> 0);

	let calc = 0;
	for (let i = 0; i < 48; i += 2) calc = (calc + readU16LE(dec, i)) & 0xffff;

	const order = PK3_ORDERS[personality % 24];
	const blocks = {};
	for (let i = 0; i < 4; i++) blocks[order[i]] = dec.slice(i * 12, i * 12 + 12);

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

	const species = await pokeApiJson("pokemon-species", speciesId).catch(() => null);
	const pokemon = await pokeApiJson("pokemon", speciesId).catch(() => null);
	const speciesName = species?.names?.find((n) => n.language?.name === "en")?.name || pokemon?.name || nickname;
	const growthRate = species?.growth_rate?.name || "medium-fast";
	const level = levelFromExp(exp, growthRate);

	const moves = [];
	for (const id of moveIds) {
		const move = await pokeApiJson("move", id).catch(() => null);
		moves.push({ name: prettyApiName(move?.names?.find((n) => n.language?.name === "en")?.name || move?.name || `Move ${id}`), type: prettyApiName(move?.type?.name || "") });
	}

	const abilities = (pokemon?.abilities || [])
		.filter((a) => !a.is_hidden)
		.sort((a, b) => a.slot - b.slot);
	const pickedAbility = abilities[abilityBit] || abilities[0];
	const abilityName = pickedAbility?.ability?.name ? prettyApiName(pickedAbility.ability.name) : undefined;

	let gender = undefined;
	const genderRate = species?.gender_rate;
	if (genderRate === -1) gender = "none";
	else if (genderRate === 0) gender = "male";
	else if (genderRate === 8) gender = "female";
	else if (Number.isFinite(genderRate)) {
		const threshold = Math.floor((genderRate / 8) * 255);
		gender = (personality & 0xff) < threshold ? "female" : "male";
	}

	const shinyValue = ((tid ^ sid) ^ ((personality >>> 16) ^ (personality & 0xffff))) & 0xffff;
	const shiny = shinyValue < 8;

	return cleanUndefined({
		payloadParsed: true,
		payloadKind: "pk3",
		checksumOk: calc === checksum,
		reward: {
			type: "pokemon",
			species: prettyApiName(speciesName),
			nationalDex: speciesId,
			level,
			gender,
			shiny: shiny || undefined,
			ball: GEN3_BALLS[ballId],
			ot: otName ? [otName] : [],
			tid: String(tid).padStart(5, "0"),
			ability: abilityName ? [abilityName] : [],
			nature: [NATURES[personality % 25]],
			heldItems: heldItemId ? [{ id: heldItemId, name: `Gen 3 item #${heldItemId}` }] : [],
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
		return await parsePk3Payload(buf);
	} catch (err) {
		return { notes: [`Payload parse failed for ${filePath}: ${err.message}`] };
	}
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

async function buildEventFromTreeItem(item, args) {
	const filePath = item.path;
	const ext = getFileExtension(filePath);
	const inferredGeneration = inferGeneration(filePath, ext);
	const targetGeneration = String(args.generation);
	const generationMatches = inferredGeneration === "unknown" || inferredGeneration === targetGeneration || (targetGeneration === "9_2" && inferredGeneration === "9");
	if (!generationMatches) return null;

	const games = inferCompatibleGames(filePath, targetGeneration);
	if (!eventMatchesGames(games, args.games, args.includeAllCompatible)) return null;

	const date = inferDate(filePath);
	const eventTitle = inferEventTitle(filePath);
	const regions = inferRegions(filePath);
	const languages = inferLanguages(filePath);
	const method = inferMethod(filePath);
	const parsed = await maybeParsePayload(filePath, ext, args);

	const regionForId = regions[0] || "unknown";
	const dateForId = date.startDateDisplay || date.startDate || "unknown-date";
	const speciesForId = parsed?.reward?.species;
	const id = slugify([`gen${targetGeneration}`, eventTitle, speciesForId, regionForId, dateForId].filter(Boolean).join(" "));

	const baseReward = { type: ext.startsWith(".pk") ? "pokemon" : "unknown" };
	const event = {
		id,
		eventTitle,
		category: ext.startsWith(".pk") ? "pokemon" : inferCategoryFromTitle(eventTitle),
		method,
		status: "unknown",
		games: args.games,
		generation: targetGeneration,
		regions: regions.length ? regions : undefined,
		languages: languages.length ? languages : undefined,
		startDate: date.startDate,
		startDateDisplay: date.startDateDisplay,
		datePrecision: date.datePrecision,
		obtainMethod: inferObtainMethod(filePath, method),
		reward: mergeReward(baseReward, parsed.reward),
		notes: [
			readablePathNote(filePath),
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

function jsString(value) {
	return JSON.stringify(value, null, 2).replace(/"([^"\\]*(?:\\.[^"\\]*)*)":/g, "$1:");
}

function renderEventObject(event) {
	return jsString(event).split("\n").map((line) => `\t${line}`).join("\n");
}

function renderOutput(events, args) {
	const genValue = Number.isFinite(Number(args.generation)) ? Number(args.generation) : JSON.stringify(args.generation);
	const gameKeys = JSON.stringify(args.games);
	const eventBlocks = events.map(renderEventObject).join(",\n\n");
	return `// AUTO-GENERATED by tools/event-scrape-v2.mjs
// Review before committing. .pk3 entries include parsed payload data when available.

import {
\tdefineDistributionsMany,
\t_ball,
\t_berry,
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
const ribbon = (name) => _ribbon(gen, name);

const DISTRIBUTIONS = [
${eventBlocks}
];

window.DATA = window.DATA || {};
window.DATA.distributions = window.DATA.distributions || {};

defineDistributionsMany(GAME_KEYS, () => DISTRIBUTIONS);
`;
}

async function main() {
	const args = parseArgs(process.argv);
	console.log(`Fetching ${OWNER}/${REPO} tree...`);
	const tree = await getRecursiveTree();
	const files = tree.filter((x) => x.type === "blob").filter((x) => isEventFile(x.path));
	console.log(`Found ${files.length} likely event files.`);

	const events = [];
	for (const item of files) {
		const event = await buildEventFromTreeItem(item, args);
		if (event) {
			events.push(event);
			if (events.length % 25 === 0) console.log(`Matched/parsed ${events.length}...`);
		}
		if (args.max && events.length >= args.max) break;
	}

	events.sort((a, b) => {
		const ad = a.startDate || "";
		const bd = b.startDate || "";
		if (ad && bd) return bd.localeCompare(ad);
		if (ad && !bd) return -1;
		if (!ad && bd) return 1;
		return String(a.eventTitle).localeCompare(String(b.eventTitle));
	});

	console.log(`Matched ${events.length} events for games: ${args.games.join(", ")}`);
	if (args.dryRun) {
		console.log(JSON.stringify(events.slice(0, args.max || 10), null, 2));
		return;
	}
	const outText = renderOutput(events, args);
	await fs.mkdir(path.dirname(args.out), { recursive: true });
	await fs.writeFile(args.out, outText, "utf8");
	console.log(`Wrote ${args.out}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
