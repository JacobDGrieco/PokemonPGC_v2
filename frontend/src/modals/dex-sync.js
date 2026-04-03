import { save } from "../store.js";

export function resolveDexTargetKey(link, data = window.DATA) {
  const game = link?.game;
  if (!game) return null;
  const t = String(link.dexType || 'regional').toLowerCase();
  if (t === 'national') return `${game}-national`;
  if (t === 'regional') return game;
  if (t === 'central' || t === 'coastal' || t === 'mountain') return `${game}-${t}`;
  if (t === 'melemele' || t === 'akala' || t === 'ulaula' || t === 'poni') return `${game}-${t}`;
  const candidate = `${game}-${t}`;
  if (data?.dex?.[candidate]) return candidate;
  return game;
}

export function resolveFormNameFor(link, entryId, targetGameKey, data = window.DATA) {
  if (typeof link?.form === 'undefined' || link.form === null) return null;
  if (typeof link.form === 'string') return link.form;
  const dexList = data?.dex?.[targetGameKey] || [];
  const entry = dexList.find((e) => e && e.id === entryId);
  const forms = Array.isArray(entry?.forms) ? entry.forms : [];
  const idx = typeof link.form === 'number' ? (link.form >= 1 ? link.form - 1 : link.form) : -1;
  const f = forms[idx];
  return !f ? null : (typeof f === 'string' ? f : f?.name || null);
}

export function applyDexLinksFromDexEntries({ gameKey, changedMap, store, getNatIndexForGame, renderDexGrid, batchDexSync = false, data = window.DATA }) {
  const dexList = data?.dex?.[gameKey] || [];
  if (!dexList.length) return;
  const natIndex = getNatIndexForGame(gameKey);

  for (const [idStr, newStatusRaw] of Object.entries(changedMap || {})) {
    const dexId = String(idStr);
    let entry = dexList.find((e) => e && String(e.id) === dexId);
    if (!entry) {
      const n = Number(idStr);
      if (Number.isFinite(n)) entry = dexList.find((e) => e && Number(e.localId ?? e.id) === n);
    }
    if (!entry) continue;

    const newStatus = String(newStatusRaw || 'unknown').trim().toLowerCase();
    const { natiId, dexSync } = entry;
    let usedNat = false;

    if (natIndex && natiId != null) {
      const bucket = natIndex.get(String(natiId));
      if (bucket?.length) {
        usedNat = true;
        for (const target of bucket) {
          const { gameKey: targetGameKey, id: targetId } = target;
          if (targetGameKey === gameKey && String(targetId) === String(entry.id)) continue;
          const curr = store.dexStatus.get(targetGameKey) || {};
          curr[targetId] = newStatus;
          store.dexStatus.set(targetGameKey, curr);
          if (!batchDexSync && store.state.dexModalFor === targetGameKey) renderDexGrid();
        }
      }
    }

    if (!usedNat && Array.isArray(dexSync) && dexSync.length) {
      for (const link of dexSync) {
        const targetGameKey = resolveDexTargetKey(link, data);
        const targetId = link?.id;
        if (!targetGameKey || typeof targetId !== 'number') continue;
        const formName = resolveFormNameFor(link, targetId, targetGameKey, data);
        if (!formName) {
          const curr = store.dexStatus.get(targetGameKey) || {};
          curr[targetId] = newStatus;
          store.dexStatus.set(targetGameKey, curr);
          if (!batchDexSync) {
            save();
            if (store.state.dexModalFor === targetGameKey) renderDexGrid();
          }
        } else {
          const formsMap = store.dexFormsStatus.get(targetGameKey) || {};
          const node = formsMap[targetId] || { all: false, forms: {} };
          node.forms = node.forms || {};
          node.forms[formName] = newStatus;
          const tList = (data?.dex?.[targetGameKey] || []).find((e) => e && e.id === targetId)?.forms || [];
          const total = tList.length;
          const filled = tList.reduce((a, f) => {
            const nm = typeof f === 'string' ? f : f?.name;
            return a + ((node.forms?.[nm] || 'unknown') !== 'unknown' ? 1 : 0);
          }, 0);
          node.all = total > 0 && filled === total && newStatus !== 'unknown';
          formsMap[targetId] = node;
          store.dexFormsStatus.set(targetGameKey, formsMap);
          if (!batchDexSync) save();
        }
      }
    }
  }
}

export function applyDexLinksFromForm({ sourceGameKey, sourceMonId, sourceFormName, status, store, getNatIndexForGame, batchDexSync = false, data = window.DATA }) {
  const dexList = data?.dex?.[sourceGameKey] || [];
  if (!dexList.length) return;
  const entry = dexList.find((e) => e && String(e.id) === String(sourceMonId));
  if (!entry) return;
  const formsArr = Array.isArray(entry.forms) ? entry.forms : [];
  const srcForm = formsArr.find((f) => (typeof f === 'string' ? f === sourceFormName : f?.name === sourceFormName));
  const newStatus = String(status || 'unknown').trim().toLowerCase();

  const natIndex = getNatIndexForGame(sourceGameKey);
  if (natIndex && entry.natiId != null) {
    const bucket = natIndex.get(String(entry.natiId)) || [];
    for (const target of bucket) {
      const { gameKey: targetGameKey, id: targetId } = target;
      if (targetGameKey === sourceGameKey && targetId === sourceMonId) continue;
      const targetEntry = (data?.dex?.[targetGameKey] || []).find((e) => e && e.id === targetId);
      if (!targetEntry || !Array.isArray(targetEntry.forms)) continue;
      const hasMatchingForm = targetEntry.forms.some((f) => (typeof f === 'string' ? f : f?.name) === sourceFormName);
      if (!hasMatchingForm) continue;
      const formsMap = store.dexFormsStatus.get(targetGameKey) || {};
      const node = formsMap[targetId] || { all: false, forms: {} };
      node.forms = node.forms || {};
      node.forms[sourceFormName] = newStatus;
      const total = targetEntry.forms.length;
      const filled = targetEntry.forms.reduce((a, f) => {
        const nm = typeof f === 'string' ? f : f?.name;
        const v = nm ? node.forms?.[nm] || 'unknown' : 'unknown';
        return a + (v !== 'unknown' ? 1 : 0);
      }, 0);
      node.all = total > 0 && filled === total && newStatus !== 'unknown';
      formsMap[targetId] = node;
      store.dexFormsStatus.set(targetGameKey, formsMap);
      if (!batchDexSync) save();
    }
    return;
  }

  const entryLinks = Array.isArray(entry.dexSync) ? entry.dexSync.filter((lnk) => typeof lnk?.form !== 'undefined' && lnk.form !== null) : [];
  const formLinks = srcForm && typeof srcForm === 'object' && Array.isArray(srcForm.dexSync) ? srcForm.dexSync : [];
  const links = [...entryLinks, ...formLinks];
  if (!links.length) return;

  for (const link of links) {
    const targetGameKey = resolveDexTargetKey(link, data);
    const targetId = link?.id;
    if (!targetGameKey || typeof targetId !== 'number') continue;
    const targetFormName = resolveFormNameFor(link, targetId, targetGameKey, data);
    if (!targetFormName) continue;
    const formsMap = store.dexFormsStatus.get(targetGameKey) || {};
    const node = formsMap[targetId] || { all: false, forms: {} };
    node.forms = node.forms || {};
    node.forms[targetFormName] = newStatus;
    const targetDexEntry = (data?.dex?.[targetGameKey] || []).find((e) => e && e.id === targetId);
    const targetForms = Array.isArray(targetDexEntry?.forms) ? targetDexEntry.forms : [];
    const total = targetForms.length;
    const filled = targetForms.reduce((a, f) => {
      const nm = typeof f === 'string' ? f : f?.name;
      const v = nm ? node.forms?.[nm] || 'unknown' : 'unknown';
      return a + (v !== 'unknown' ? 1 : 0);
    }, 0);
    node.all = total > 0 && filled === total && newStatus !== 'unknown';
    formsMap[targetId] = node;
    store.dexFormsStatus.set(targetGameKey, formsMap);
    if (!batchDexSync) save();
  }
}
