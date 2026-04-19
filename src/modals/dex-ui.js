import { normalizeFlag } from "./helpers.js";
import { baseOf, labelForDexKey } from "./dex-config.js";
import { getDexList as _getDexList } from "./dex-store.js";

export function ensureDexHelpDropdown(dexSearch, dexHelpDropdown) {
  if (!dexSearch || dexHelpDropdown) return dexHelpDropdown;
  const dropdown = document.createElement("div");
  dropdown.className = "dex-help-dropdown";
  dropdown.style.position = "absolute";
  dropdown.style.zIndex = "25";
  dropdown.style.padding = "8px 10px";
  dropdown.style.borderRadius = "6px";
  dropdown.style.fontSize = "12px";
  dropdown.style.maxWidth = "360px";
  dropdown.style.background = "var(--card-bg, #111827)";
  dropdown.style.border = "1px solid rgba(255,255,255,.1)";
  dropdown.style.boxShadow = "0 8px 16px rgba(0,0,0,.45)";
  dropdown.style.display = "none";
  dropdown.innerHTML = `
    <div style="font-weight:600;margin-bottom:4px;">Dex commands</div>
    <div><code>/status &lt;status&gt;</code> – unknown, seen, caught, shiny, alpha, shinyalpha</div>
    <div><code>/form &lt;status&gt;</code> – gender, mega, regional, alolan, galarian, hisuian, paldean, other</div>
    <div><code>/species &lt;tag&gt;</code> – starter, fossil, pseudo, mega, ultrabeast, paradox, legendary, mythical</div>
    <div><code>/type &lt;type&gt;</code> – filter by typings (e.g. <code>/type fire</code>) (WIP)</div>
    <div><code>/evolution &lt;method&gt;</code> – level, stone, item, trade, happiness, other (WIP)</div>
    <div><code>/location &lt;text&gt;</code> – filter by game location (WIP)</div>
    <div><code>/stage &lt;n&gt;</code> – evolution stage 1, 2, or 3 (WIP)</div>
  `;
  document.body.appendChild(dropdown);
  return dropdown;
}

export function updateDexHelpDropdown({ dexSearch, dexHelpDropdown, rawQ }) {
  if (!dexSearch) return dexHelpDropdown;
  const dropdown = ensureDexHelpDropdown(dexSearch, dexHelpDropdown);
  if (!dropdown) return dropdown;
  const v = (rawQ || "").trim().toLowerCase();
  if (v === "/help") {
    const rect = dexSearch.getBoundingClientRect();
    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.top = `${rect.bottom + window.scrollY + 4}px`;
    dropdown.style.display = "";
  } else {
    dropdown.style.display = "none";
  }
  return dropdown;
}

export function resolveInitialDexKey(rawKey) {
  if (!rawKey) return rawKey;
  const base = baseOf(rawKey);
  const direct = _getDexList(rawKey);
  if (Array.isArray(direct) && direct.length > 0) return rawKey;
  const variants = window.DATA.dexVariants?.[base];
  if (Array.isArray(variants) && variants.length) {
    for (const v of variants) {
      const arr = _getDexList(v);
      if (Array.isArray(arr) && arr.length > 0) return v;
    }
    return variants[0];
  }
  return rawKey;
}

function computeDexScopeOptions(baseKey) {
  if (!baseKey) return [];
  const variantsCfg = window.DATA.dexVariants?.[baseKey];
  const hasVariantsCfg = Array.isArray(variantsCfg) && variantsCfg.length > 0;
  let list = [];
  if (hasVariantsCfg) {
    list = variantsCfg.slice();
  } else {
    const baseDex = _getDexList(baseKey);
    if (Array.isArray(baseDex) && baseDex.length) list.push(baseKey);
  }
  const natKey = `${baseKey}-national`;
  const natDex = _getDexList(natKey);
  const hasNat = Array.isArray(natDex) && natDex.length > 0;
  if (hasNat && !list.includes(natKey)) list.push(natKey);
  if (!hasVariantsCfg && !list.includes(baseKey)) list.unshift(baseKey);
  return list.length <= 1 ? [] : list;
}

export function populateBulkStatusSelect({ bulkStatusSelect, gameKey, game }) {
  if (!bulkStatusSelect || bulkStatusSelect.tagName !== "SELECT") return;
  if (bulkStatusSelect.dataset.forGameKey === String(gameKey) && bulkStatusSelect.options.length) return;
  bulkStatusSelect.innerHTML = "";
  bulkStatusSelect.dataset.forGameKey = String(gameKey || "");
  const canonicalOrder = ["shiny_alpha", "alpha", "shiny", "caught", "seen", "unknown"];
  const rawFlags = Array.isArray(game?.flags) && game.flags.length ? game.flags.slice() : canonicalOrder.slice();
  const present = new Set(rawFlags.map((f) => normalizeFlag(f)).filter(Boolean));
  present.add("unknown");
  const finalFlags = canonicalOrder.filter((f) => present.has(f));
  finalFlags.forEach((val) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = val.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
    bulkStatusSelect.appendChild(opt);
  });
  bulkStatusSelect.value = finalFlags.includes("caught") ? "caught" : (finalFlags[0] || "");
}

export function refreshScopeControls({ scopeMount, scopeSelect, currentGameKey, onChange }) {
  if (!scopeMount || !currentGameKey) return scopeSelect;
  const baseKey = baseOf(currentGameKey || "");
  const options = computeDexScopeOptions(baseKey);
  if (!options.length) {
    if (scopeSelect) {
      scopeSelect.remove();
      return null;
    }
    return scopeSelect;
  }
  let nextSelect = scopeSelect;
  if (!nextSelect) {
    nextSelect = document.createElement("select");
    nextSelect.className = "dex-scope-select";
    nextSelect.title = "Choose Dex";
    scopeMount.appendChild(nextSelect);
    nextSelect.addEventListener("change", () => onChange?.(nextSelect.value));
  }
  nextSelect.innerHTML = "";
  options.forEach((key) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = labelForDexKey(baseKey, key);
    nextSelect.appendChild(opt);
  });
  nextSelect.value = currentGameKey;
  return nextSelect;
}

export function resetBulkStatusSelect(bulkStatusSelect) {
  if (!bulkStatusSelect || bulkStatusSelect.tagName !== "SELECT") return;
  const normalizedOptions = Array.from(bulkStatusSelect.options).map((opt) =>
    normalizeFlag(opt.value || opt.textContent || "")
  );
  if (normalizedOptions.includes("unknown")) {
    bulkStatusSelect.value = "unknown";
  } else if (bulkStatusSelect.options.length > 0) {
    bulkStatusSelect.selectedIndex = bulkStatusSelect.options.length - 1;
  }
}
