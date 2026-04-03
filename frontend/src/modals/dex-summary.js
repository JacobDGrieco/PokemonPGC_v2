import { isCompletedForGame, normalizeFlag } from "./helpers.js";
import { researchStatsFor } from "./dex-progress.js";
import { isMythicalForm as _isMythicalForm, baseOf, shortLabelForDexKey } from "./dex-config.js";
import {
  getDexList as _getDexList,
  getDexFormsNode as _getDexFormsNode,
  effectiveSpeciesStatus as _effectiveSpeciesStatus,
} from "./dex-store.js";

function isMythicalSpecies(m) {
  return !!m?.mythical;
}

function computeSpeciesProgress(game, store, dexKey, dex) {
  const baseDex = dex.filter((m) => !isMythicalSpecies(m));
  const extraDex = dex.filter((m) => isMythicalSpecies(m));
  const baseTotal = baseDex.length;
  const extraTotal = extraDex.length;
  const baseDone = baseDex.filter((m) => isCompletedForGame(game, _effectiveSpeciesStatus(store, dexKey, m))).length;
  const extraDone = extraDex.filter((m) => isCompletedForGame(game, _effectiveSpeciesStatus(store, dexKey, m))).length;
  const pctBase = baseTotal ? (baseDone / baseTotal) * 100 : 0;
  const pctExtended = baseTotal ? ((baseDone + extraDone) / baseTotal) * 100 : 0;
  const pctBar = Math.min(100, Math.max(0, Math.round((baseDone / Math.max(1, baseTotal)) * 100)));
  const pctExtraOverlay =
    baseTotal > 0 && baseDone === baseTotal && extraTotal > 0
      ? (extraDone / extraTotal) * 100
      : 0;
  return { baseTotal, extraTotal, baseDone, extraDone, pctBase, pctExtended, pctBar, pctExtraOverlay };
}

function computeFormsProgress(game, store, nodeKey, dex) {
  const speciesWithForms = dex.filter((m) => Array.isArray(m.forms) && m.forms.length);
  let formsBaseTotal = 0;
  let formsExtraTotal = 0;
  let formsBaseDone = 0;
  let formsExtraDone = 0;

  for (const m of speciesWithForms) {
    const { node } = _getDexFormsNode(store, nodeKey, m.id);
    for (const f of m.forms) {
      const name = typeof f === "string" ? f : f?.name;
      if (!name) continue;
      const isExtra = _isMythicalForm(f);
      const v = normalizeFlag(node.forms?.[name] || "unknown");
      const isDone = isCompletedForGame(game, v);
      if (isExtra) {
        formsExtraTotal += 1;
        if (isDone) formsExtraDone += 1;
      } else {
        formsBaseTotal += 1;
        if (isDone) formsBaseDone += 1;
      }
    }
  }

  const formsPctBase = formsBaseTotal ? (formsBaseDone / formsBaseTotal) * 100 : 0;
  const formsPctExtended = formsBaseTotal ? ((formsBaseDone + formsExtraDone) / formsBaseTotal) * 100 : 0;
  const formsPctBar = Math.min(100, Math.max(0, Math.round((formsBaseDone / Math.max(1, formsBaseTotal)) * 100)));
  const formsPctExtraOverlay =
    formsBaseTotal > 0 && formsBaseDone === formsBaseTotal && formsExtraTotal > 0
      ? (formsExtraDone / formsExtraTotal) * 100
      : 0;

  return {
    formsBaseTotal,
    formsExtraTotal,
    formsBaseDone,
    formsExtraDone,
    formsPctBase,
    formsPctExtended,
    formsPctBar,
    formsPctExtraOverlay,
    haveForms: (formsBaseTotal + formsExtraTotal) > 0,
  };
}

export function dexSummaryCardFor(gameKey, genKey, store) {
  const games = window.DATA.games?.[genKey] || [];
  const game = games.find((g) => g.key === gameKey);
  const dex = _getDexList(gameKey);

  if (!document.getElementById("ppgc-golden-meter-css")) {
    const style = document.createElement("style");
    style.id = "ppgc-golden-meter-css";
    document.head.appendChild(style);
  }

  const baseGameKey = String(gameKey).endsWith("-national")
    ? String(gameKey).replace(/-national$/, "")
    : String(gameKey);
  const natKey = `${baseGameKey}-national`;
  const natDex = _getDexList(natKey);
  const variants = window.DATA.dexVariants?.[baseGameKey] || [gameKey];
  const hasVariantsConfig =
    Array.isArray(window.DATA.dexVariants?.[baseGameKey]) &&
    window.DATA.dexVariants[baseGameKey].length > 1;

  const nat = computeSpeciesProgress(game, store, natKey, natDex);
  const haveNat = nat.baseTotal > 0;
  const formsSourceDex = haveNat ? natDex : dex;
  const formsNodeKey = haveNat ? natKey : gameKey;
  const forms = computeFormsProgress(game, store, formsNodeKey, formsSourceDex);

  const research = researchStatsFor(gameKey, genKey, store);
  const haveResearch = research.baseTotal + research.extraTotal > 0;
  let researchPctBar = 0;
  let researchPctExtraOverlay = 0;
  let researchLabelPct = 0;
  if (haveResearch) {
    const pctBase = research.baseTotal ? (research.baseDone / research.baseTotal) * 100 : 0;
    const pctExtended = research.baseTotal ? ((research.baseDone + research.extraDone) / research.baseTotal) * 100 : 0;
    researchLabelPct = research.baseDone === research.baseTotal ? pctExtended : pctBase;
    researchPctBar = Math.min(100, Math.max(0, Math.round((research.baseDone / Math.max(1, research.baseTotal)) * 100)));
    researchPctExtraOverlay =
      research.baseTotal > 0 && research.baseDone === research.baseTotal && research.extraTotal > 0
        ? (research.extraDone / research.extraTotal) * 100
        : 0;
  }

  let variantsHTML = "";
  if (variants.length) {
    for (const dk of variants) {
      const d = _getDexList(dk);
      if (!d.length) continue;
      const variantBaseKey = baseOf(dk);
      const label = shortLabelForDexKey(variantBaseKey, dk);
      const stats = computeSpeciesProgress(game, store, dk, d);
      const labelPct = stats.baseDone === stats.baseTotal ? stats.pctExtended : stats.pctBase;
      const labelDone =
        stats.baseDone === stats.baseTotal
          ? `${stats.baseDone + stats.extraDone} / ${stats.baseTotal}`
          : `${stats.baseDone}/${stats.baseTotal}`;
      variantsHTML += `
        <div class="small">
          ${label}:
          ${labelDone} (${labelPct.toFixed(2)}%)
        </div>
        <div class="progress ${stats.pctExtraOverlay > 0 ? "has-extra" : ""}">
          <span class="base" style="width:${stats.pctBar}%"></span>
          <span class="extra" style="width:${stats.pctExtraOverlay}%"></span>
          ${stats.pctExtraOverlay > 0 ? `<div class="extra-badge" title="Extra credit progress">+${stats.pctExtraOverlay.toFixed(0)}%</div>` : ``}
        </div>`;
    }
  }

  const nationalHTML = haveNat && !hasVariantsConfig
    ? `
      <div class="small">National:
        ${nat.baseDone === nat.baseTotal ? nat.baseDone + nat.extraDone : nat.baseDone}
        / ${nat.baseTotal || 0}
        (${(nat.baseDone === nat.baseTotal ? nat.pctExtended : nat.pctBase).toFixed(2)}%)
      </div>
      <div class="progress ${nat.pctExtraOverlay > 0 ? "has-extra" : ""}">
        <span class="base" style="width:${nat.pctBar}%"></span>
        <span class="extra" style="width:${nat.pctExtraOverlay}%"></span>
        ${nat.pctExtraOverlay > 0 ? `<div class="extra-badge" title="Extra credit progress">+${nat.pctExtraOverlay.toFixed(0)}%</div>` : ``}
      </div>`
    : ``;

  const formsHTML = forms.haveForms
    ? `
      <div class="small">
        Forms:
        ${forms.formsBaseDone === forms.formsBaseTotal ? forms.formsBaseDone + forms.formsExtraDone : forms.formsBaseDone}
        / ${forms.formsBaseTotal || 0}
        (${(forms.formsBaseDone === forms.formsBaseTotal ? forms.formsPctExtended : forms.formsPctBase).toFixed(2)}%)
      </div>
      <div class="progress ${forms.formsPctExtraOverlay > 0 ? "has-extra" : ""}">
        <span class="base" style="width:${forms.formsPctBar}%"></span>
        <span class="extra" style="width:${forms.formsPctExtraOverlay}%"></span>
        ${forms.formsPctExtraOverlay > 0 ? `<div class="extra-badge" title="Extra credit progress">+${forms.formsPctExtraOverlay.toFixed(0)}%</div>` : ``}
      </div>`
    : ``;

  const researchHTML = haveResearch
    ? `
      <div class="small" data-research-label="${gameKey}">
        Research Tasks:
        ${research.baseDone === research.baseTotal ? research.baseDone + research.extraDone : research.baseDone}
        / ${research.baseTotal || 0}
        (${researchLabelPct.toFixed(2)}%)
      </div>
      <div class="progress ${researchPctExtraOverlay > 0 ? "has-extra" : ""}" data-research-meter="${gameKey}">
        <span class="base" style="width:${researchPctBar}%"></span>
        <span class="extra" style="width:${researchPctExtraOverlay}%"></span>
        ${researchPctExtraOverlay > 0 ? `<div class="extra-badge" title="Extra credit progress">+${researchPctExtraOverlay.toFixed(0)}%</div>` : ``}
      </div>`
    : ``;

  const card = document.createElement("section");
  card.className = "card";
  card.innerHTML = `
    <div class="card-hd"><h3>Pokédex — <span class="small">${game?.label || gameKey}</span></h3></div>
    <div class="card-bd">
      ${variantsHTML}
      ${nationalHTML}
      ${formsHTML}
      ${researchHTML}
    </div>
  `;
  return card;
}

export function dexPctFor(gameKey, genKey, store) {
  const games = window.DATA.games?.[genKey] || [];
  const game = games.find((g) => g.key === gameKey);
  const dex = _getDexList(gameKey);
  const stats = computeSpeciesProgress(game, store, gameKey, dex);
  return stats.baseDone === stats.baseTotal ? stats.pctExtended : stats.pctBase;
}
