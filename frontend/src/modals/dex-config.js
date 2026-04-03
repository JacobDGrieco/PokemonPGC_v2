import { ensureDataRoot, ensurePpgcRoot } from "../runtime/globals.js";

export const DEX_VARIANTS = {
  ruby: ["ruby", "ruby-national"],
  sapphire: ["sapphire", "sapphire-national"],
  firered: ["firered", "firered-national"],
  leafgreen: ["leafgreen", "leafgreen-national"],
  emerald: ["emerald", "emerald-national"],
  diamond: ["diamond", "diamond-national"],
  pearl: ["pearl", "pearl-national"],
  platinum: ["platinum", "platinum-national"],
  heartgold: ["heartgold", "heartgold-national"],
  soulsilver: ["soulsilver", "soulsilver-national"],
  black: ["black", "black-national"],
  white: ["white", "white-national"],
  black2: ["black2", "black2-national"],
  white2: ["white2", "white2-national"],
  x: ["x-central", "x-coastal", "x-mountain", "x-national"],
  y: ["y-central", "y-coastal", "y-mountain", "y-national"],
  sun: ["sun-alola", "sun-melemele", "sun-akala", "sun-ulaula", "sun-poni"],
  moon: ["moon-alola", "moon-melemele", "moon-akala", "moon-ulaula", "moon-poni"],
  ultrasun: ["ultrasun-alola", "ultrasun-melemele", "ultrasun-akala", "ultrasun-ulaula", "ultrasun-poni"],
  ultramoon: ["ultramoon-alola", "ultramoon-melemele", "ultramoon-akala", "ultramoon-ulaula", "ultramoon-poni"],
  sword: ["sword", "swordioa", "swordct"],
  swordioa: ["sword", "swordioa", "swordct"],
  swordct: ["sword", "swordioa", "swordct"],
  shield: ["shield", "shieldioa", "shieldct"],
  shieldioa: ["shield", "shieldioa", "shieldct"],
  shieldct: ["shield", "shieldioa", "shieldct"],
  scarlet: ["scarlet", "scarlettm", "scarletid"],
  scarlettm: ["scarlet", "scarlettm", "scarletid"],
  scarletid: ["scarlet", "scarlettm", "scarletid"],
  violet: ["violet", "violettm", "violetid"],
  violettm: ["violet", "violettm", "violetid"],
  violetid: ["violet", "violettm", "violetid"],
  legendsza: ["legendsza", "legendszamd"],
  legendszamd: ["legendsza", "legendszamd"],
};

const TAG_ORDER = [
  "gender",
  "alolan",
  "galarian",
  "hisuian",
  "paldean",
  "other",
  "starter",
  "fossil",
  "pseudo",
  "legendary",
  "mythical",
  "mega",
  "zcrystal",
  "ultrabeast",
  "gigantamax",
  "paradox",
];

export function installDexVariants() {
  const data = ensureDataRoot() || {};
  if (typeof window !== "undefined") {
    window.DATA = window.DATA || data;
  }
  if (!window?.DATA?.dexVariants) {
    window.DATA.dexVariants = { ...DEX_VARIANTS };
  }
  return window?.DATA?.dexVariants || data.dexVariants;
}

export function extractTags(obj) {
  if (!obj) return [];

  let tags = [];
  if (Array.isArray(obj.tags)) {
    tags = obj.tags.map((t) => String(t).toLowerCase());
  }

  tags.sort((a, b) => {
    const ia = TAG_ORDER.indexOf(a);
    const ib = TAG_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return tags;
}

export function hasTag(obj, tag) {
  const needle = String(tag || "").toLowerCase();
  if (!needle) return false;
  return extractTags(obj).includes(needle);
}

export const isMythicalForm = (form) => typeof form === "object" && hasTag(form, "mythical");

export function isNatKey(key) {
  return String(key || "").endsWith("-national");
}

export function baseOf(key) {
  const str = String(key || "");
  const withoutNat = str.endsWith("-national") ? str.replace(/-national$/, "") : str;
  return withoutNat.split("-")[0];
}

export function labelForDexKey(baseKey, key) {
  if (!key) return "";

  const names = ensureDataRoot().dexNames || {};
  const value = names[key];

  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    if (typeof value[key] === "string") return value[key];
    if (typeof value.name === "string") return value.name;
    if (typeof value.label === "string") return value.label;
  }

  if (isNatKey(key)) return "National Dex";

  const strKey = String(key);
  const baseGuess = baseKey || baseOf(strKey);
  const rawBase = strKey.startsWith(baseGuess) ? baseGuess : baseOf(strKey);
  let raw = strKey.replace(rawBase, "").replace(/^-/, "");
  if (!raw) return "Regional Dex";

  const pretty = raw.charAt(0).toUpperCase() + raw.slice(1);
  return `${pretty} Dex`;
}

export function shortLabelForDexKey(baseKey, key) {
  return labelForDexKey(baseKey, key).replace(/\s*Dex$/i, "");
}

export function buildNatDexIndex() {
  const dexRoot = ensureDataRoot().dex || {};
  const index = {};

  for (const [gameKey, raw] of Object.entries(dexRoot)) {
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : Array.isArray(raw?.[gameKey]) ? raw[gameKey] : [];
    if (!list.length) continue;

    const baseKey = baseOf(gameKey);
    if (!baseKey) continue;

    if (!index[baseKey]) index[baseKey] = new Map();
    const map = index[baseKey];

    for (const entry of list) {
      if (!entry || typeof entry !== "object") continue;
      const nat = entry.natiId;
      if (nat === undefined || nat === null) continue;
      const natKey = String(nat);
      if (!map.has(natKey)) map.set(natKey, []);
      map.get(natKey).push({ gameKey, id: entry.id });
    }
  }

  ensurePpgcRoot()._natDexIndex = index;
  return index;
}

export function ensureNatDexIndex() {
  const ppgc = ensurePpgcRoot();
  if (!ppgc._natDexIndex) buildNatDexIndex();
  return ppgc._natDexIndex || null;
}

export function getNatIndexForGame(gameKey) {
  const root = ensureNatDexIndex();
  if (!root) return null;
  return root[baseOf(gameKey)] || null;
}
