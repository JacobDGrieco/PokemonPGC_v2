export function getGameMedals(gameKey) {
  return window.DATA?.medals?.[gameKey]?.sections || [];
}

export function medalItemKey(sectionId, medalId) {
  return `${sectionId}:${medalId}`;
}

export function getMedalRecord(store, gameKey) {
  if (!store.medalStatus) store.medalStatus = new Map();
  return store.medalStatus.get(gameKey) || {};
}

export function setMedalRecord(store, gameKey, record) {
  if (!store.medalStatus) store.medalStatus = new Map();
  store.medalStatus.set(gameKey, record);
}

export function isMedalChecked(store, gameKey, sectionId, medalId) {
  const record = getMedalRecord(store, gameKey);
  return !!record[medalItemKey(sectionId, medalId)];
}

export function setMedalChecked(store, gameKey, sectionId, medalId, checked) {
  const record = { ...getMedalRecord(store, gameKey) };
  record[medalItemKey(sectionId, medalId)] = !!checked;
  setMedalRecord(store, gameKey, record);
}

export function sectionProgress(store, gameKey, section) {
  const items = section.items || [];
  const total = items.length;
  let done = 0;
  for (const item of items) {
    if (isMedalChecked(store, gameKey, section.id, item.id)) done += 1;
  }
  return { done, total, pct: total ? (done / total) * 100 : 0 };
}

export function medalsPctForGame(gameKey, store) {
  const sections = getGameMedals(gameKey);
  let done = 0;
  let total = 0;
  for (const section of sections) {
    const progress = sectionProgress(store, gameKey, section);
    done += progress.done;
    total += progress.total;
  }
  return total ? (done / total) * 100 : 0;
}
