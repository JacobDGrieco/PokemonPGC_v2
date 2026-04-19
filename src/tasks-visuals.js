import { ensurePpgcRoot } from "./runtime/globals.js";

const PPGC = ensurePpgcRoot();
const GEN1_COLOR_GAMES = new Set(["red", "blue", "yellow"]);
const TOOLTIP_DELAY_MS = 800;
const TOOLTIP_AUTOHIDE_MS = 1800;

function gameKeyFromSection(sectionId) {
  const s = String(sectionId || "");
  const i = s.indexOf("-");
  return i >= 0 ? s.slice(0, i) : s;
}

export function getAccentColor() {
  const rs = getComputedStyle(document.documentElement);
  const cssVar = rs.getPropertyValue("--accent")?.trim();
  if (cssVar) return cssVar;
  return "#7fd2ff";
}

export function resolveAccentForSection(sectionId) {
  const fallback = getAccentColor();
  const gameKey = gameKeyFromSection(sectionId);
  const gens = window.DATA?.games || {};

  for (const arr of Object.values(gens)) {
    const found = (arr || []).find((g) => g.key === gameKey);
    if (found) {
      const cand = found.color || found.accent || found.themeColor || found.primaryColor;
      return cand || fallback;
    }
  }
  return fallback;
}

export function resolveTaskImageSrcs(task, sectionId) {
  const evalMaybe = (v) => (typeof v === "function" ? v() : v);

  const normalize = (v) => {
    if (v == null) return [];
    const raw = evalMaybe(v);
    if (raw == null) return [];
    return Array.isArray(raw) ? raw.flatMap((x) => normalize(x)) : [raw];
  };

  const pickStrings = (arr) => arr.map((x) => evalMaybe(x)).filter(Boolean).map(String);

  const baseArr = normalize(task.img);
  const colorArr = normalize(task.imgS);

  const gameKey = gameKeyFromSection(sectionId);
  const useColor = window.PPGC?.gen1SpriteColor === true;
  const prefersColor = GEN1_COLOR_GAMES.has(gameKey) && useColor && colorArr.length > 0;

  return pickStrings(prefersColor ? colorArr : (baseArr.length ? baseArr : colorArr));
}

function ensureTooltipEl() {
  let el = PPGC._tooltipEl;
  if (!el) {
    el = document.createElement("div");
    el.className = "tooltip hidden";
    el.setAttribute("role", "tooltip");
    document.body.appendChild(el);
    PPGC._tooltipEl = el;
  }
  return el;
}

export function hideTooltip() {
  const el = ensureTooltipEl();
  el.classList.add("hidden");
  el.classList.remove("show");
  el.innerHTML = "";
  delete el.dataset.placement;

  if (PPGC._tooltipShowTimer) clearTimeout(PPGC._tooltipShowTimer);
  if (PPGC._tooltipHideTimer) clearTimeout(PPGC._tooltipHideTimer);
  PPGC._tooltipShowTimer = 0;
  PPGC._tooltipHideTimer = 0;
}

function showTooltipForTarget(targetEl, html) {
  if (!targetEl || !html) return;

  const el = ensureTooltipEl();
  el.innerHTML = html;
  el.classList.remove("hidden");
  el.classList.add("show");

  const r = targetEl.getBoundingClientRect();
  const tw = el.offsetWidth;
  const th = el.offsetHeight;
  const margin = 8;

  let left = r.left + window.scrollX + (r.width / 2) - (tw / 2);
  let top = r.top + window.scrollY - th - margin;
  let placement = "top";

  if (left < margin) left = margin;
  if (left + tw > window.scrollX + window.innerWidth - margin) {
    left = window.scrollX + window.innerWidth - tw - margin;
  }
  if (top < window.scrollY + margin) {
    top = r.bottom + window.scrollY + margin;
    placement = "bottom";
  }

  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
  el.dataset.placement = placement;

  if (PPGC._tooltipHideTimer) clearTimeout(PPGC._tooltipHideTimer);
  PPGC._tooltipHideTimer = 0;
}

export function attachTooltip(el, getHtml) {
  if (!el || !getHtml) return;

  const start = () => {
    if (PPGC._tooltipShowTimer) clearTimeout(PPGC._tooltipShowTimer);
    if (PPGC._tooltipHideTimer) clearTimeout(PPGC._tooltipHideTimer);

    PPGC._tooltipShowTimer = window.setTimeout(() => {
      const html = getHtml?.();
      if (!html) return;
      showTooltipForTarget(el, html);
    }, TOOLTIP_DELAY_MS);
  };

  const stop = () => {
    if (PPGC._tooltipShowTimer) clearTimeout(PPGC._tooltipShowTimer);
    if (PPGC._tooltipHideTimer) clearTimeout(PPGC._tooltipHideTimer);
    PPGC._tooltipShowTimer = 0;
    PPGC._tooltipHideTimer = window.setTimeout(hideTooltip, 80);
  };

  el.addEventListener("mouseenter", start);
  el.addEventListener("mouseleave", stop);
  el.addEventListener("focus", start);
  el.addEventListener("blur", stop);
}
