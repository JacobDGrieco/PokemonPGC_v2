import { save } from "../store.js";

export function getGameFashion(gameKey) {
  return window.DATA?.fashion?.[gameKey]?.categories || [];
}

export function gameHasGenderedFashion(gameKey) {
  const cats = getGameFashion(gameKey);
  return cats.some((category) =>
    (category?.items || []).some((item) => {
      const gender = String(item?.gender || "").toLowerCase();
      return gender === "male" || gender === "female";
    })
  );
}

export function getSelectedGenderForGame(store, gameKey) {
  const map = store.state.fashionGenderByGame || {};
  return map?.[gameKey] === "female" ? "female" : "male";
}

export function setSelectedGenderForGame(store, gameKey, gender) {
  if (!gameKey) return;
  const normalized = gender === "female" ? "female" : "male";
  const state = store.state;
  if (!state.fashionGenderByGame) state.fashionGenderByGame = {};
  state.fashionGenderByGame[gameKey] = normalized;
  save();
}

export function itemVisibleForGender(store, gameKey, item) {
  const selected = getSelectedGenderForGame(store, gameKey);
  const flag = String(item.gender || "both").toLowerCase();
  if (flag === "male" || flag === "female") return flag === selected;
  return true;
}

export function getFormsNode(store, gameKey, categoryId, itemId) {
  const catMap = store.fashionFormsStatus.get(gameKey) || new Map();
  const obj = (catMap.get(categoryId) || {})[itemId] || { all: false, forms: {} };
  return { catMap, obj };
}

export function setFormsNode(store, gameKey, categoryId, itemId, node) {
  let catMap = store.fashionFormsStatus.get(gameKey);
  if (!catMap) {
    catMap = new Map();
    store.fashionFormsStatus.set(gameKey, catMap);
  }
  const rec = catMap.get(categoryId) || {};
  rec[itemId] = node;
  catMap.set(categoryId, rec);
}

export function itemProgressSplit(store, gameKey, categoryId, item) {
  if (!itemVisibleForGender(store, gameKey, item)) {
    return { baseDone: 0, baseTotal: 0, extraDone: 0, extraTotal: 0, done: 0, total: 0 };
  }

  const itemIsExtra = !!item?.extraCredit;
  const hasForms = Array.isArray(item.forms) && item.forms.length > 0;
  const formIsExtra = (form) => itemIsExtra || (typeof form !== "string" && !!form?.extraCredit);

  if (hasForms) {
    const { obj } = getFormsNode(store, gameKey, categoryId, item.id);
    let baseTotal = 0;
    let extraTotal = 0;
    let baseDone = 0;
    let extraDone = 0;

    for (const form of item.forms) {
      const name = typeof form === "string" ? form : form?.name;
      if (!name) continue;
      const isExtra = formIsExtra(form);
      if (isExtra) extraTotal += 1;
      else baseTotal += 1;
      const checked = !!obj.forms?.[name];
      if (checked) {
        if (isExtra) extraDone += 1;
        else baseDone += 1;
      }
    }

    return { baseDone, baseTotal, extraDone, extraTotal, done: baseDone + extraDone, total: baseTotal + extraTotal };
  }

  const catMap = store.fashionStatus.get(gameKey);
  const raw = catMap?.get(categoryId) || {};
  const checked = !!raw[item.id];

  if (itemIsExtra) {
    return { baseDone: 0, baseTotal: 0, extraDone: checked ? 1 : 0, extraTotal: 1, done: checked ? 1 : 0, total: 1 };
  }

  return { baseDone: checked ? 1 : 0, baseTotal: 1, extraDone: 0, extraTotal: 0, done: checked ? 1 : 0, total: 1 };
}

export function fashionPctForGame(gameKey, store) {
  const cats = getGameFashion(gameKey);
  if (!Array.isArray(cats) || !cats.length) return 0;

  let baseDone = 0;
  let baseTotal = 0;
  for (const cat of cats) {
    for (const item of cat.items || []) {
      const progress = itemProgressSplit(store, gameKey, cat.id, item);
      baseDone += progress.baseDone;
      baseTotal += progress.baseTotal;
    }
  }

  return baseTotal ? (baseDone / baseTotal) * 100 : 0;
}

export function meterMath(baseDone, baseTotal, extraDone, extraTotal) {
  const pctBase = baseTotal ? (baseDone / baseTotal) * 100 : 0;
  const pctExtended = baseTotal ? ((baseDone + extraDone) / baseTotal) * 100 : 0;
  const labelPct = baseDone === baseTotal ? pctExtended : pctBase;
  const pctBar = Math.min(100, Math.max(0, Math.round((baseDone / Math.max(1, baseTotal)) * 100)));
  const pctExtraOverlay = baseTotal > 0 && baseDone === baseTotal && extraTotal > 0 ? (extraDone / extraTotal) * 100 : 0;
  const shownDone = baseDone === baseTotal ? baseDone + extraDone : baseDone;
  return { labelPct, pctBar, pctExtraOverlay, shownDone };
}
