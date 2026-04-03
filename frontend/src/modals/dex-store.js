import { save } from "../store.js";
import { ensureDataRoot } from "../runtime/globals.js";
import { baseOf } from "./dex-config.js";
import { pickHighestStatus, rankStatus, clampStatusForForm, clampStatusForMon } from "./helpers.js";

export function normalizeDexList(gameKey, raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.items)) return raw.items;
  if (raw && typeof raw === "object" && Array.isArray(raw[gameKey])) return raw[gameKey];
  return [];
}

export function getDexList(gameKey) {
  return normalizeDexList(gameKey, ensureDataRoot().dex?.[gameKey]);
}

export function getDexFormsNode(store, gameKey, monId) {
  const map = store.dexFormsStatus.get(gameKey) || {};
  const node = map[monId] || { all: false, forms: {} };
  return { map, node };
}

export function setDexFormsNode(store, gameKey, monId, node) {
  const map = store.dexFormsStatus.get(gameKey) || {};
  map[monId] = node;
  store.dexFormsStatus.set(gameKey, map);
  save();
}

export function setAllFormsForMon(store, gameKey, monId, formsList, status) {
  const map = store.dexFormsStatus.get(gameKey) || {};
  const node = map[monId] || { all: false, forms: {} };
  node.forms = node.forms || {};

  const dexList = getDexList(gameKey);
  const mon = dexList.find((m) => m && String(m.id) === String(monId)) || null;

  for (const form of formsList || []) {
    const name = typeof form === "string" ? form : form?.name;
    if (!name) continue;
    node.forms[name] = clampStatusForForm(mon, form, status);
  }

  const total = (formsList || []).length;
  const filled = Object.values(node.forms).filter((value) => value && value !== "unknown").length;
  node.all = total > 0 && filled === total && status !== "unknown";

  map[monId] = node;
  store.dexFormsStatus.set(gameKey, map);
  return node;
}

export function effectiveSpeciesStatus(store, gameKey, mon) {
  const statusMap = store.dexStatus.get(gameKey) || {};
  let base = statusMap[mon.id] || "unknown";
  if (Array.isArray(mon.forms) && mon.forms.length) {
    const { node } = getDexFormsNode(store, gameKey, mon.id);
    const formVals = (mon.forms || []).map((form) => {
      const name = typeof form === "string" ? form : form?.name;
      return node.forms?.[name] || "unknown";
    });
    const highest = pickHighestStatus(formVals);
    if (rankStatus(highest) > rankStatus(base)) base = highest;
  }
  return clampStatusForMon(mon, base);
}

export function statusIsShiny(status) {
  return status === "shiny" || status === "shiny_alpha";
}

export function getNatIndexForGame(ppgcRoot, gameKey) {
  const root = ppgcRoot?._natDexIndex;
  if (!root) return null;
  return root[baseOf(gameKey)] || null;
}
