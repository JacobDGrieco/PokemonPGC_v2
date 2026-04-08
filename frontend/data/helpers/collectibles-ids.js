import { _fullId, _slugify } from './core.js';
import { _medal } from './images.js';

export const _curryFullId = (g, type, flavor) => _fullId(g, 'curries', type, flavor);
export const _sandwichFullId = (g, type, tier) => _fullId(g, 'sandwiches', type, tier);
export const _stickerFullId = (g, type, form) => _fullId(g, 'stickers', type, form);
export const _medalFullId = (g, type, medal) => _fullId(g, 'medals', type, medal);

export function defineCollectiblesMany({
  gameKeys,
  bucketKey,
  bucketId,
  builder,
  baseSlugFrom,
  formSlugFrom,
  ensureLabel = false,
}) {
  const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

  window.DATA = window.DATA || {};
  window.DATA[bucketKey] = window.DATA[bucketKey] || {};

  for (const gameKey of keys) {
    const built = builder(gameKey, { gameKey });
    const list = Array.isArray(built) ? built : [];

    const normalized = list.map((it) => {
      if (!it || typeof it !== 'object') return it;

      const out = { ...it };
      const baseStr = baseSlugFrom ? baseSlugFrom(out) : (out.id ?? out.name ?? out.label);
      const baseSlug = _slugify(baseStr);
      out.id = _fullId(gameKey, bucketId, baseSlug);

      if (ensureLabel && !out.label && out.name) out.label = out.name;

      if (Array.isArray(out.forms)) {
        out.forms = out.forms.map((f) => {
          const fObj = typeof f === 'string' ? { name: f } : (f && typeof f === 'object' ? { ...f } : null);
          if (!fObj) return f;

          const formStr = formSlugFrom ? formSlugFrom(fObj) : fObj.name;
          const formSlug = _slugify(formStr);
          fObj.id = _fullId(gameKey, bucketId, baseSlug, formSlug);
          return fObj;
        });
      }

      return out;
    });

    window.DATA[bucketKey][gameKey] = normalized;
  }
}

export function defineCurryMany(gameKeys, builder) {
  return defineCollectiblesMany({
    gameKeys,
    bucketKey: 'curry',
    bucketId: 'curries',
    builder,
    baseSlugFrom: (it) => it.id,
    formSlugFrom: (f) => f.name,
  });
}

export function defineSandwichMany(gameKeys, builder) {
  return defineCollectiblesMany({
    gameKeys,
    bucketKey: 'sandwich',
    bucketId: 'sandwiches',
    builder,
    baseSlugFrom: (it) => it.name || it.label || it.id,
    formSlugFrom: (f) => f.name,
    ensureLabel: true,
  });
}

export function defineStickersMany(gameKeys, builder) {
  return defineCollectiblesMany({
    gameKeys,
    bucketKey: 'sticker',
    bucketId: 'stickers',
    builder,
    baseSlugFrom: (it) => it.label || it.name || it.id,
    formSlugFrom: (f) => f.name,
  });
}

export function defineMedalsMany(gameKeys, builder) {
  const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

  window.DATA = window.DATA || {};
  window.DATA.medals = window.DATA.medals || {};

  for (const gameKey of keys) {
    const built = builder(gameKey, { gameKey }) || { sections: [] };
    window.DATA.medals[gameKey] = _finalizeMedalsIdsAndImgs(gameKey, built);
  }
}

function _medalSlug(name) {
  return _slugify(name, { keepPlus: true });
}

export function mapMedalItem(sectionId, item) {
  const out = { ...item };
  const nameSlug = _medalSlug(out.name);
  if (out.idSlug == null) out.idSlug = nameSlug;

  const imgKey =
    (typeof out._imgKey === 'string' && out._imgKey.trim())
      ? out._imgKey.trim()
      : nameSlug;

  out._imgKey = imgKey;
  out.img = out.img ?? (() => _medal(sectionId, imgKey));
  return out;
}

export function buildMedalsFor(SECTIONS, ITEMS_BY_SECTION) {
  return {
    sections: (SECTIONS || []).map((s) => ({
      ...s,
      items: (ITEMS_BY_SECTION?.[s.id] || []).map((it) => mapMedalItem(s.id, it)),
    })),
  };
}

function _finalizeMedalsIdsAndImgs(gameKey, medalsObj) {
  if (!medalsObj || !Array.isArray(medalsObj.sections)) return medalsObj;

  for (const sec of medalsObj.sections) {
    if (!sec || !Array.isArray(sec.items)) continue;

    const folder = String(sec.type || sec.id || '').trim();

    for (const it of sec.items) {
      if (!it) continue;

      const rawId = it._rawId ?? it.id;
      it._rawId = rawId;

      const idNum =
        rawId != null && rawId !== '' && !isNaN(Number(rawId))
          ? Number(rawId)
          : rawId;

      if (typeof idNum === 'number') it.id = _medalFullId(gameKey, sec.id, idNum);
      else it.id = `${String(gameKey)}:${String(sec.id)}:${String(idNum)}`;

      const rawImgKey = it._imgKey;
      const slug =
        (typeof rawImgKey === 'string' && rawImgKey.trim())
          ? rawImgKey.trim()
          : _medalSlug(it.name);

      it._imgKey = slug;

      if (!it.img && folder) {
        it.img = () => _medal(folder, slug);
      }
    }
  }

  return medalsObj;
}
