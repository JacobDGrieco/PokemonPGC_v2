import {
  getGameColor,
  computeChipScale,
  prepFormsModal,
  createWheelResizeHandler,
} from './modal.js';
import {
  normalizeFlag,
  clampStatusForForm,
  isOptionAllowedForForm,
  getFilterClassForStatus,
  renderBadges,
} from './helpers.js';
import { attachProgressHelpers, researchStatsFor } from './dex-progress.js';
import { setupDexFormsModal } from './dex-forms.js';
import { setupMonInfoModal } from './dex-mon-info.js';
import { setupResearchModal } from './dex-research.js';
import { shouldUseColorSprite } from './dex-search.js';

export function initDexModalRuntime({
  store,
  modal,
  renderDexGrid,
  getDexFormsNode,
  setDexFormsNode,
  applyDexLinksFromForm,
}) {
  attachProgressHelpers(store);

  const formsModal = document.getElementById('formsModal');
  const formsModalClose = document.getElementById('formsModalClose');
  const formsWheel = document.getElementById('formsWheel');

  const { openDexForms } = setupDexFormsModal(store, {
    formsModal,
    formsModalClose,
    formsWheel,
    getGameColor,
    computeChipScale,
    prepFormsModal,
    createWheelResizeHandler,
    normalizeFlag,
    clampStatusForForm,
    isOptionAllowedForForm,
    getFilterClassForStatus,
    renderBadges,
    shouldUseColorSprite,
    getDexFormsNode,
    setDexFormsNode,
    applyDexLinksFromForm,
    renderDexGrid,
  });

  setupMonInfoModal();
  setupResearchModal();

  if (!window.__PPGC_DEX_RESEARCH_SAVED_WIRED) {
    window.__PPGC_DEX_RESEARCH_SAVED_WIRED = true;
    window.addEventListener('ppgc:researchSaved', (e) => {
      const d = e?.detail || {};
      const gameKey = String(d.gameKey || '');
      const monId = String(d.monId || '');
      const stats = d.stats || null;
      if (!store?.state?.dexModalFor) return;
      if (String(store.state.dexModalFor) !== gameKey) return;

      const keyForCount = `${gameKey}:${monId}`;
      const el = document.querySelector(`[data-dex-research-count="${keyForCount}"]`);
      if (el && stats && typeof stats.doneTiers === 'number' && typeof stats.totalTiers === 'number') {
        el.textContent = `${stats.doneTiers}/${stats.totalTiers}`;
        el.title = `Tiers completed: ${stats.doneTiers}/${stats.totalTiers} • Level: ${Math.min(10, Number(stats.researchLevel || 0))}/10`;
      }

      try {
        const currentGenKey = store?.state?.genKey || store?.state?.currentGenKey || store?.state?.activeGenKey || null;
        const { baseTotal, baseDone, extraTotal, extraDone } = researchStatsFor(gameKey, currentGenKey, store);
        const haveResearch = (baseTotal + extraTotal) > 0;
        if (!haveResearch) return;

        const pctBase = baseTotal ? (baseDone / baseTotal) * 100 : 0;
        const pctExtended = baseTotal ? ((baseDone + extraDone) / baseTotal) * 100 : 0;
        const labelPct = (baseDone === baseTotal) ? pctExtended : pctBase;
        const pctBar = Math.min(100, Math.max(0, Math.round((baseDone / Math.max(1, baseTotal)) * 100)));
        const pctExtraOverlay = baseTotal > 0 && baseDone === baseTotal && extraTotal > 0
          ? (extraDone / extraTotal) * 100
          : 0;

        document.querySelectorAll(`[data-research-label="${gameKey}"]`).forEach((labelEl) => {
          const shownDone = (baseDone === baseTotal) ? (baseDone + extraDone) : baseDone;
          labelEl.textContent = `Research Tasks: ${shownDone} / ${baseTotal || 0} (${labelPct.toFixed(2)}%)`;
        });

        document.querySelectorAll(`[data-research-meter="${gameKey}"]`).forEach((wrap) => {
          const baseSpan = wrap.querySelector('span.base');
          const extraSpan = wrap.querySelector('span.extra');
          if (baseSpan) baseSpan.style.width = `${pctBar}%`;
          if (extraSpan) extraSpan.style.width = `${pctExtraOverlay}%`;
          if (pctExtraOverlay > 0) wrap.classList.add('has-extra');
          else wrap.classList.remove('has-extra');
        });
      } catch (err) {
        console.warn('[PPGC] research meter refresh failed', err);
      }
    });
  }

  if (formsModal && formsModal.parentElement !== document.body) {
    document.body.appendChild(formsModal);
  }

  const modalChange = modal?.querySelector('header .modalChange')
    || modal?.querySelector('.modalChange')
    || modal?.querySelector('.modal-hd');

  return { openDexForms, modalChange };
}
