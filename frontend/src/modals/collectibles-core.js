import { save } from "../store.js";

export function ensureStatusMap(store, mapName, gameKey) {
  const map = store[mapName].get(gameKey) || {};
  if (!store[mapName].has(gameKey)) store[mapName].set(gameKey, map);
  return map;
}

export function getCollectibleFormsNode(store, mapName, gameKey, itemId) {
  const gameMap = store[mapName].get(gameKey) || {};
  if (!store[mapName].has(gameKey)) {
    store[mapName].set(gameKey, gameMap);
  }
  const node = gameMap[itemId] || { all: false, forms: {} };
  return { gameMap, node };
}

export function setCollectibleFormsNode(store, mapName, gameKey, itemId, node) {
  const gameMap = store[mapName].get(gameKey) || {};
  gameMap[itemId] = node;
  store[mapName].set(gameKey, gameMap);
  save();
}

export function collectibleItemProgress(store, opts) {
  const { statusMapName, formsMapName, gameKey, item } = opts;
  const hasForms = Array.isArray(item.forms) && item.forms.length > 0;
  if (hasForms) {
    const { node } = getCollectibleFormsNode(store, formsMapName, gameKey, String(item.id));
    const total = item.forms.length;
    const done = Object.values(node.forms || {}).filter(Boolean).length;
    return { done, total };
  }

  const statusMap = ensureStatusMap(store, statusMapName, gameKey);
  const checked = !!statusMap[String(item.id)];
  return { done: checked ? 1 : 0, total: 1 };
}

export function collectiblePctFor(gameKey, store, items, opts) {
  if (!items.length) return 0;
  let done = 0;
  let total = 0;
  for (const item of items) {
    const p = collectibleItemProgress(store, { ...opts, gameKey, item });
    done += p.done;
    total += p.total;
  }
  return total ? (done / total) * 100 : 0;
}

export function updateCollectibleSectionHeader(gameKey, pctFn) {
  try {
    const store = window.PPGC?._storeRef;
    if (!store) return;

    const pct = pctFn(gameKey, store);
    const header = document.querySelector('.card-hd.section-hd');
    if (!header) return;

    const pctEl = header.querySelector('.pct');
    if (pctEl) pctEl.textContent = `${pct.toFixed(2)}%`;
    header.style.setProperty('--progress', pct.toFixed(2));
  } catch {
    // ignore DOM issues
  }
}
