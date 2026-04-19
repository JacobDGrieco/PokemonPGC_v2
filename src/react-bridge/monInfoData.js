import { _assetPath } from '../utils/assetPath.js';
import { ensureMonInfoLoaded } from '../../data/mon_info/_loader.js';
import { fetchPokeApiMonInfo } from '../services/pokeApi.js';

function resolveMonInfoBucket(gameKey) {
  const byGame = window.DATA?.monInfo || {};
  if (byGame && byGame[gameKey]) return byGame[gameKey];
  for (const [k, bucket] of Object.entries(byGame)) {
    if (typeof k === 'string' && k.includes(',')) {
      const parts = k.split(',').map((s) => s.trim());
      if (parts.includes(gameKey)) return bucket;
    }
  }
  return null;
}

function gameMatches(metaGames, gk) {
  if (!Array.isArray(metaGames) || !metaGames.length) return true;
  if (!gk) return true;
  const g = String(gk);
  const base = g.replace(/(ioa|ct|tm|id|md)$/i, '');
  return metaGames.includes(g) || metaGames.includes(base);
}

function mergeInfo(base, patch) {
  if (!patch) return base;
  if (!base) return patch;
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    const pv = patch[k];
    const bv = base[k];
    out[k] = isObj(bv) && isObj(pv) ? mergeInfo(bv, pv) : pv;
  }
  return out;
}

function normalizeTypeName(t) {
  if (!t) return null;
  const s = String(t).toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const TYPE_CHART = {
  Normal: { Rock: 0.5, Steel: 0.5, Ghost: 0 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5, Ice: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5, Ghost: 0 },
  Poison: { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
  Ground: { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
  Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
  Bug: { Grass: 2, Psychic: 2, Dark: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
  Ghost: { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
  Steel: { Rock: 2, Ice: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
  Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 },
};

export const ALL_TYPES = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

export function computeTypeDefenseBuckets(types) {
  const defTypes = (types || []).map(normalizeTypeName).filter(Boolean);
  const rows = ALL_TYPES.map((atk) => {
    let mult = 1;
    for (const def of defTypes) {
      const row = TYPE_CHART[atk] || {};
      mult *= row[def] != null ? row[def] : 1;
    }
    return { type: atk, mult };
  });
  return rows;
}

export function getMonInfoFormOptions(natiId, gameKey) {
  const catalogForms = (natiId != null && window.DATA?.formsCatalog?.[natiId]) || {};
  const formOpts = [];
  for (const [fk, meta] of Object.entries(catalogForms)) {
    if (meta && Array.isArray(meta.games) && meta.games.length && !gameMatches(meta.games, gameKey)) continue;
    formOpts.push({ key: String(fk), label: meta?.label ? String(meta.label) : String(fk) });
  }
  return formOpts;
}

export function normalizeMovesForRender(moves) {
  if (!moves || typeof moves !== 'object') return [];
  return Object.entries(moves)
    .map(([learnMethod, entries]) => ({
      learnMethod,
      entries: Array.isArray(entries) ? entries : [],
    }))
    .filter((group) => group.entries.length);
}

export function normalizeLocationsForRender(locations) {
  if (!Array.isArray(locations)) return [];
  return locations
    .map((loc, index) => {
      if (typeof loc === 'string') return { key: `loc-${index}`, area: '', notes: loc, extra: '' };
      return {
        key: `loc-${index}`,
        area: loc?.area || '',
        notes: loc?.notes || '',
        extra: loc?.games || loc?.method || loc?.rate || '',
      };
    })
    .filter((loc) => loc.area || loc.notes || loc.extra);
}

export function normalizeEvolutionPaths(evoObj) {
  if (!evoObj) return [];
  if (Array.isArray(evoObj.paths)) return evoObj.paths.filter((p) => Array.isArray(p) && p.length);
  if (Array.isArray(evoObj.chain)) {
    if (!Array.isArray(evoObj.chain[0])) return [evoObj.chain.filter(Boolean)];
    return evoObj.chain.map((p) => p.filter(Boolean)).filter((p) => p.length);
  }
  if (Array.isArray(evoObj.branches)) return evoObj.branches.map((p) => p.filter(Boolean)).filter((p) => p.length);
  if (Array.isArray(evoObj)) return evoObj.map((p) => p.filter(Boolean)).filter((p) => p.length);
  return [];
}

export async function resolveMonInfoData({ gameKey, mon, formKey = null } = {}) {
  const natId = mon?.natiId ?? mon?.natId ?? mon?.nationalId ?? null;
  const key = natId ?? mon?.id;
  const formOptions = getMonInfoFormOptions(natId, gameKey);
  let effectiveFormKey = formKey;
  if (!effectiveFormKey && formOptions.length) effectiveFormKey = formOptions[0].key;

  await ensureMonInfoLoaded(key, effectiveFormKey);

  const bucket = resolveMonInfoBucket(gameKey);
  const info = (natId != null && bucket?.[natId]) || bucket?.[mon?.id] || null;
  const formOverride = effectiveFormKey && natId != null ? window.DATA?.monInfoForms?.[gameKey]?.[natId]?.[effectiveFormKey] || null : null;
  const effectiveInfo = mergeInfo(info, formOverride);
  const fallbackInfo = !effectiveInfo && natId != null ? await fetchPokeApiMonInfo(natId) : null;
  const resolvedInfo = mergeInfo(fallbackInfo, effectiveInfo);
  const types = resolvedInfo?.types || mon?.types || [];
  const spriteSrc = resolvedInfo?.sprites?.front || (natId != null ? _assetPath(`sprites/pokemon_home/base-front/${String(natId).padStart(4, '0')}.png`) : null) || mon?.img || null;
  const baseStats = resolvedInfo?.baseStats || mon?.baseStats || null;
  const battle = resolvedInfo?.battle || {};
  const profile = {
    abilities: resolvedInfo?.abilities || [],
    eggGroups: resolvedInfo?.eggGroups || [],
    expGroup: effectiveInfo?.expGroup || mon?.expGroup || resolvedInfo?.growthRate || null,
    baseEggSteps: effectiveInfo?.baseEggSteps || mon?.baseEggSteps || (resolvedInfo?.hatchCounter != null ? Number(resolvedInfo.hatchCounter) * 255 : null),
    height: resolvedInfo?.size?.height ?? resolvedInfo?.height ?? null,
    weight: resolvedInfo?.size?.weight ?? resolvedInfo?.weight ?? null,
    genderRatio: (resolvedInfo?.gender && (resolvedInfo.gender.maleRatio != null || resolvedInfo.gender.femaleRatio != null))
      ? `${resolvedInfo.gender.maleRatio ?? '?'}% ♂ / ${resolvedInfo.gender.femaleRatio ?? '?'}% ♀`
      : resolvedInfo?.genderRatio ?? null,
    baseFriendship: battle.baseFriendship ?? resolvedInfo?.baseFriendship ?? resolvedInfo?.baseHappiness ?? null,
    captureRate: battle.captureRate ?? resolvedInfo?.captureRate ?? null,
    baseExperience: battle.baseExperience ?? resolvedInfo?.baseExperience ?? null,
    habitat: resolvedInfo?.habitat ?? null,
    shape: resolvedInfo?.shape ?? null,
    color: resolvedInfo?.color ?? null,
    genus: resolvedInfo?.genus ?? null,
  };

  return {
    natId,
    key,
    info,
    resolvedInfo,
    fallbackInfo,
    effectiveInfo,
    hasLocalInfo: !!info,
    formOptions,
    effectiveFormKey,
    spriteSrc,
    types,
    baseStats,
    profile,
    evolutionPaths: normalizeEvolutionPaths(resolvedInfo?.evolution),
    moves: normalizeMovesForRender(resolvedInfo?.moves),
    locations: normalizeLocationsForRender(resolvedInfo?.locations),
    typeDefenses: computeTypeDefenseBuckets(types),
  };
}
