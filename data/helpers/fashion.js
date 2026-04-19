import { pad3 } from './core.js';
import { _fashionItem } from './images.js';

export function _fashionSlug(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['â€™]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function _fashionFullId(gameKey, categoryId, itemId, formId) {
  const gk = String(gameKey || '');
  const cat = String(categoryId || '');
  const item = pad3(itemId);

  if (formId === undefined || formId === null || formId === '') {
    return `${gk}:${cat}:${item}`;
  }
  return `${gk}:fashion:${cat}:${item}:${pad3(formId)}`;
}

export function buildFashionFor(CATEGORIES, ITEMS_BY_CATEGORY) {
  return {
    categories: (CATEGORIES || []).map((c) => ({
      id: c.id,
      label: c.label,
      items: (ITEMS_BY_CATEGORY?.[c.id] || []).map((it) => ({
        ...it,
        forms: Array.isArray(it.forms) ? it.forms.map((f) => ({ ...f })) : it.forms,
      })),
    })),
  };
}

export function _resolveFashionPrefix(gameKey) {
  const gk = String(gameKey || '').toLowerCase();
  if (gk === 'x' || gk === 'y') return 'xy';
  return gk;
}

function _fashionGenderFolder(itemGender) {
  const g = String(itemGender || 'unisex').toLowerCase();
  if (g === 'male' || g === 'female') return g;
  return 'unisex';
}

function _finalizeFashionIdsAndImgs(gameKey, fashionObj) {
  if (!fashionObj || !Array.isArray(fashionObj.categories)) return fashionObj;

  for (const cat of fashionObj.categories) {
    const categoryId = cat?.id;
    if (!categoryId || !Array.isArray(cat.items)) continue;

    for (const item of cat.items) {
      if (!item) continue;

      const rawItemId = item._rawId ?? item.id;
      item._rawId = rawItemId;

      const itemIdNum =
        rawItemId != null && rawItemId !== '' && !isNaN(Number(rawItemId))
          ? Number(rawItemId)
          : rawItemId;

      if (typeof itemIdNum === 'number') item.id = _fashionFullId(gameKey, categoryId, itemIdNum);
      else item.id = `${String(gameKey)}:${String(categoryId)}:${String(itemIdNum)}`;

      const genderFolder = _fashionGenderFolder(item.gender);
      const rawImgKey = item._imgKey;
      const itemSlug =
        (typeof rawImgKey === 'string' && rawImgKey.trim() && !/^\d+$/.test(rawImgKey))
          ? rawImgKey.trim()
          : _fashionSlug(item.name);

      item._imgKey = itemSlug;

      const hasForms = Array.isArray(item.forms) && item.forms.length > 0;
      if (hasForms) {
        const first = item.forms[0];
        const firstName = typeof first === 'string' ? first : (first?.name ?? '');
        const firstSlug = _fashionSlug(firstName);
        const parentImgKey = `${itemSlug}-${firstSlug}`;

        if (!item.img) {
          item.img = ({ gameKey }) => _fashionItem(gameKey, genderFolder, categoryId, parentImgKey);
        }

        for (const f of item.forms) {
          if (!f || typeof f !== 'object') continue;

          const rawFormId = f._rawId ?? f.id;
          f._rawId = rawFormId;

          const formIdNum =
            rawFormId != null && rawFormId !== '' && !isNaN(Number(rawFormId))
              ? Number(rawFormId)
              : rawFormId;

          if (typeof itemIdNum === 'number' && typeof formIdNum === 'number') {
            f.id = _fashionFullId(gameKey, categoryId, itemIdNum, formIdNum);
          } else {
            f.id = `${String(gameKey)}:${String(categoryId)}:${String(itemIdNum)}:${String(formIdNum)}`;
          }

          const formName = String(f.name ?? '');
          const formSlug = _fashionSlug(formName);
          const imgKey = `${itemSlug}-${formSlug}`;

          if (!f.img) {
            f.img = ({ gameKey }) => _fashionItem(gameKey, genderFolder, categoryId, imgKey);
          }
        }
      } else if (!item.img) {
        item.img = ({ gameKey }) => _fashionItem(gameKey, genderFolder, categoryId, itemSlug);
      }
    }
  }

  return fashionObj;
}

export function defineFashionMany(gameKeys, builder) {
  const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

  window.DATA = window.DATA || {};
  window.DATA.fashion = window.DATA.fashion || {};

  for (const gameKey of keys) {
    const built = builder(gameKey, { gameKey });
    window.DATA.fashion[gameKey] = _finalizeFashionIdsAndImgs(gameKey, built);
  }
}
