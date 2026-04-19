import { pad4 } from './core.js';

export function _parseDexKey(dexGameKey) {
  const raw = String(dexGameKey || '').trim().toLowerCase();
  if (!raw) return { game: '', category: '' };

  if (raw.endsWith('-national')) {
    return { game: raw.replace(/-national$/, ''), category: 'national' };
  }

  const idx = raw.indexOf('-');
  if (idx > 0) {
    const game = raw.slice(0, idx);
    const category = raw.slice(idx + 1);
    return { game, category };
  }

  return { game: raw, category: 'regional' };
}

export function _makeDexId(dexGameKey, id, formId) {
  const { game, category } = _parseDexKey(dexGameKey);
  const n = Number(id);
  if (!game || !Number.isFinite(n) || n < 0) return '';

  const base = `${game}:dex:${category}:${pad4(n)}`;
  return formId ? `${base}:${String(formId)}` : base;
}

export function _decorateDexListIds(dexGameKey, dexList) {
  const arr = Array.isArray(dexList) ? dexList : [];
  return arr.map((m) => {
    if (!m || typeof m !== 'object') return m;

    const localId = Number.isFinite(Number(m.localId)) ? m.localId : m.id;
    const newId = _makeDexId(dexGameKey, localId);

    return { ...m, localId, id: newId };
  });
}

export function _dexIdNumber(id, localId) {
  if (Number.isFinite(Number(localId))) return Number(localId);
  if (typeof id === 'number' && Number.isFinite(id)) return id;

  const s = String(id || '');
  const m = s.match(/:dex:[^:]+:(\d+)(?::|$)/i);
  if (m) return Number(m[1]);

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
