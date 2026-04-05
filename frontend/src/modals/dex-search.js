import { normalizeFlag, resolveMaybeFn } from "./helpers.js";
import { baseOf, hasTag } from "./dex-config.js";

const GEN1_DEX_GAMES = new Set(["red", "blue", "yellow"]);
const STATUS_TOKEN_MAP = {
  unknown: "unknown",
  seen: "seen",
  caught: "caught",
  shiny: "shiny",
  alpha: "alpha",
  shinyalpha: "shiny_alpha",
  shiny_alpha: "shiny_alpha",
};

export function shouldUseColorSprite(gameKey, gen1SpriteColor = false) {
  if (!gameKey) return null;
  const base = baseOf(gameKey);
  if (!GEN1_DEX_GAMES.has(base)) return null;
  return gen1SpriteColor === true;
}

export function getImageForStatus(it, status, gameKey, gen1SpriteColor = false) {
  const useColor = shouldUseColorSprite(gameKey, gen1SpriteColor);
  // Resolve a possibly-function image value, passing { gameKey } so gen1 sprites pick the right path
  const resolveImg = (fn) => {
    if (fn == null) return "";
    if (typeof fn === "function") {
      try { return fn({ gameKey }) || ""; } catch { return ""; }
    }
    return fn || "";
  };

  if (useColor !== null) {
    const baseImg = resolveImg(it.img);
    const colorImg = resolveImg(it.imgS) || baseImg;
    return useColor ? colorImg : baseImg;
  }

  const isShiny = status === "shiny" || status === "shiny_alpha" || status === "shinyalpha";
  const primary = isShiny ? (it.imgS ?? it.img) : it.img;
  return resolveImg(primary);
}

export function speciesAndFormsMatch(entry, speciesFn, formFn) {
  let speciesMatch = false;
  let formsMatch = false;

  if (typeof speciesFn === "function") {
    speciesMatch = !!speciesFn(entry);
  }
  if (typeof formFn === "function" && Array.isArray(entry.forms) && entry.forms.length) {
    formsMatch = entry.forms.some((f) => {
      const obj = f && typeof f === "object" ? f : {};
      return !!formFn(obj);
    });
  }
  return speciesMatch || formsMatch;
}

function resolveStatusToken(token) {
  if (!token) return null;
  const compact = String(token).toLowerCase().replace(/[_\s]/g, "");
  if (!compact) return null;
  if (STATUS_TOKEN_MAP[compact]) {
    return normalizeFlag(STATUS_TOKEN_MAP[compact]);
  }
  for (const [key, val] of Object.entries(STATUS_TOKEN_MAP)) {
    const keyCompact = key.toLowerCase().replace(/[_\s]/g, "");
    if (keyCompact === compact) return normalizeFlag(val);
  }
  return null;
}

export function parseDexSearch(rawQ) {
  const q = String(rawQ || "").trim().toLowerCase();
  const parsed = { q, isCommandTyping: false, cmdMode: null, cmdStatus: null, cmdArg: null, cmdStage: null };
  if (!q.startsWith('/')) return parsed;
  parsed.isCommandTyping = true;
  const parts = String(rawQ || "").trim().split(/\s+/);
  const cmd = (parts[0] || "").toLowerCase();
  const rest = parts.slice(1).join(" ").trim();

  if (cmd === '/status' && rest) {
    const st = resolveStatusToken(rest);
    if (st) {
      parsed.cmdMode = 'status';
      parsed.cmdStatus = st;
    }
  } else if (cmd === '/form' && rest) {
    parsed.cmdMode = 'form';
    parsed.cmdArg = rest.toLowerCase();
  } else if (cmd === '/species' && rest) {
    parsed.cmdMode = 'species';
    parsed.cmdArg = rest.toLowerCase();
  } else if (cmd === '/type' && rest) {
    parsed.cmdMode = 'type';
    parsed.cmdArg = rest.toLowerCase();
  } else if (cmd === '/evolution' && rest) {
    parsed.cmdMode = 'evolution';
    parsed.cmdArg = rest.toLowerCase();
  } else if (cmd === '/location' && rest) {
    parsed.cmdMode = 'location';
    parsed.cmdArg = rest.toLowerCase();
  } else if (cmd === '/stage' && rest) {
    let n = parseInt(rest, 10);
    if (Number.isNaN(n)) {
      const tok = rest.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (tok === 'basic' || tok === 'stage1') n = 1;
      else if (tok === 'stage2') n = 2;
      else if (tok === 'stage3') n = 3;
    }
    if (Number.isInteger(n) && n > 0) {
      parsed.cmdMode = 'stage';
      parsed.cmdStage = n;
    }
  }
  return parsed;
}

export function filterDexEntries({ dex, parsed, rawQ, store, gameKey, monInfoForGame, effectiveSpeciesStatus }) {
  const { q, isCommandTyping, cmdMode, cmdStatus, cmdArg, cmdStage } = parsed;
  if (!q) return dex;
  if (q === '/help') return dex;
  if (isCommandTyping && !cmdMode && !q.includes(' ')) return [];
  if (isCommandTyping && !cmdMode) return dex;
  if (!cmdMode) {
    return dex.filter((it) => `${it.id} ${it.name}`.toLowerCase().includes(q));
  }

  return dex.filter((it) => {
    if (cmdMode === 'status') {
      const eff = effectiveSpeciesStatus(store, gameKey, it);
      return normalizeFlag(eff) === cmdStatus;
    }
    if (cmdMode === 'form') {
      const raw = (cmdArg || '').trim();
      if (!raw) return true;
      const tag = raw.toLowerCase();
      const allowedFormTags = new Set(['gender','regional','alolan','galarian','hisuian','paldean','other']);
      if (!allowedFormTags.has(tag)) return false;
      return speciesAndFormsMatch(
        it,
        (sp) => tag === 'regional'
          ? (hasTag(sp, 'alolan') || hasTag(sp, 'galarian') || hasTag(sp, 'hisuian') || hasTag(sp, 'paldean'))
          : hasTag(sp, tag),
        (form) => tag === 'regional'
          ? (hasTag(form, 'alolan') || hasTag(form, 'galarian') || hasTag(form, 'hisuian') || hasTag(form, 'paldean'))
          : hasTag(form, tag)
      );
    }
    if (cmdMode === 'species') {
      const tag = (cmdArg || '').toLowerCase().trim();
      if (!tag) return true;
      const allowedSpeciesTags = new Set(['starter','fossil','pseudo','legendary','mythical','mega','zcrystal','ultrabeast','paradox']);
      if (!allowedSpeciesTags.has(tag)) return false;
      return speciesAndFormsMatch(
        it,
        (sp) => tag === 'legendary' ? (hasTag(sp, 'legendary') || hasTag(sp, 'mythical')) : hasTag(sp, tag),
        (form) => tag === 'legendary' ? (hasTag(form, 'legendary') || hasTag(form, 'mythical')) : hasTag(form, tag)
      );
    }
    if (cmdMode === 'type') {
      const needle = (cmdArg || '').toLowerCase().trim();
      if (!needle) return true;
      const info = monInfoForGame ? monInfoForGame[it.id] : null;
      const baseTypes = (info?.types || it.types || []).map((t) => String(t).toLowerCase());
      const formTypesFromInfo = [];
      if (Array.isArray(info?.forms)) {
        info.forms.forEach((f) => {
          if (!f) return;
          if (Array.isArray(f.types)) f.types.forEach((t) => formTypesFromInfo.push(String(t).toLowerCase()));
          else if (f.type) formTypesFromInfo.push(String(f.type).toLowerCase());
        });
      }
      const formTypesFromDex = [];
      if (Array.isArray(it.forms)) {
        it.forms.forEach((f) => {
          if (!f || typeof f !== 'object') return;
          if (Array.isArray(f.types)) f.types.forEach((t) => formTypesFromDex.push(String(t).toLowerCase()));
          else if (f.type) formTypesFromDex.push(String(f.type).toLowerCase());
        });
      }
      const allTypes = [...baseTypes, ...formTypesFromInfo, ...formTypesFromDex];
      return allTypes.length ? allTypes.some((t) => t.includes(needle)) : false;
    }
    if (cmdMode === 'evolution') {
      const needle = (cmdArg || '').toLowerCase().trim();
      if (!needle) return true;
      const info = monInfoForGame ? monInfoForGame[it.id] : null;
      const methods = [];
      if (info?.evolution) {
        const evo = info.evolution;
        if (evo.method) methods.push(String(evo.method).toLowerCase());
        if (Array.isArray(evo.tags)) evo.tags.forEach((t) => methods.push(String(t).toLowerCase()));
      }
      if (Array.isArray(info?.forms)) {
        info.forms.forEach((f) => {
          if (!f || !f.evolution) return;
          const fe = f.evolution;
          if (fe.method) methods.push(String(fe.method).toLowerCase());
          if (Array.isArray(fe.tags)) fe.tags.forEach((t) => methods.push(String(t).toLowerCase()));
        });
      }
      const n = needle.replace(/[^a-z0-9]/g, '');
      return methods.length ? methods.some((m) => m.replace(/[^a-z0-9]/g, '').includes(n)) : false;
    }
    if (cmdMode === 'location') {
      const needle = (cmdArg || '').toLowerCase();
      if (!needle) return true;
      const info = monInfoForGame ? monInfoForGame[it.id] : null;
      const baseLocs = Array.isArray(info?.locations) ? info.locations : [];
      const allLocs = baseLocs.slice();
      if (Array.isArray(info?.forms)) {
        info.forms.forEach((f) => {
          if (!f) return;
          if (Array.isArray(f.locations)) allLocs.push(...f.locations);
          else if (typeof f.location === 'string') allLocs.push(f.location);
        });
      }
      return allLocs.length ? allLocs.some((loc) => {
        if (typeof loc === 'string') return loc.toLowerCase().includes(needle);
        const area = (loc.area || '').toLowerCase();
        const notes = (loc.notes || '').toLowerCase();
        return area.includes(needle) || notes.includes(needle);
      }) : false;
    }
    if (cmdMode === 'stage') {
      if (!cmdStage) return true;
      const info = monInfoForGame ? monInfoForGame[it.id] : null;
      const stages = [];
      if (info?.evolution && typeof info.evolution.stage === 'number') stages.push(info.evolution.stage);
      if (Array.isArray(info?.forms)) {
        info.forms.forEach((f) => {
          if (!f || !f.evolution) return;
          const st = f.evolution.stage;
          if (typeof st === 'number') stages.push(st);
        });
      }
      return stages.length ? stages.includes(cmdStage) : false;
    }
    return true;
  });
}
