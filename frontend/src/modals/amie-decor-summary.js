import { getGameCollection, registerKeywordSectionMeter } from './helpers.js';

function getStatusMap(store, gameKey) {
  return (store?.amieDecorStatus instanceof Map ? store.amieDecorStatus.get(gameKey) : null) || {};
}

export function amieDecorPctFor(gameKey, store) {
  const items = getGameCollection('amieDecor', gameKey);
  if (!items.length) return 0;

  const status = getStatusMap(store, gameKey);
  const done = items.filter((item) => !!status[String(item.id)]).length;
  return items.length ? (done / items.length) * 100 : 0;
}

(function registerAmieDecorSectionMeter() {
  registerKeywordSectionMeter({
    keyword: 'poke-amie decorations',
    flagProp: '__ppgcAmieDecorMeter',
    exposeName: 'amieDecorPctFor',
    pctFn: amieDecorPctFor,
  });
})();

export function amieDecorSummaryCardFor(gameKey, genKey, store) {
  const items = getGameCollection('amieDecor', gameKey);
  if (!items.length) return document.createTextNode('');

  const game = (window.DATA.games?.[genKey] || []).find((entry) => entry.key === gameKey);
  const status = getStatusMap(store, gameKey);
  const done = items.filter((item) => !!status[String(item.id)]).length;
  const pct = items.length ? (done / items.length) * 100 : 0;

  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.amieDecorSummary = gameKey;
  card.innerHTML = `
    <div class="card-hd">
      <h3>Poke-Amie Decorations - <span class="small">${game?.label || gameKey}</span></h3>
      <div><button class="button" data-open-amie-decor>Open Decorations</button></div>
    </div>
    <div class="card-bd">
      <div class="small" data-amie-decor-summary-text>${done} / ${items.length} (${pct.toFixed(2)}%)</div>
      <div class="progress">
        <span class="base" data-amie-decor-summary-bar style="width:${Math.max(0, Math.min(100, pct))}%"></span>
      </div>
    </div>
  `;

  card.querySelector('[data-open-amie-decor]')?.addEventListener('click', () => {
    window.PPGC?.amieDecorApi?.openAmieDecorModal?.(gameKey, genKey);
  });

  return card;
}

export function createAmieDecorSummaryUpdater(store) {
  return function updateAmieDecorSummaryCard(gameKey) {
    const items = getGameCollection('amieDecor', gameKey);
    const status = getStatusMap(store, gameKey);
    const done = items.filter((item) => !!status[String(item.id)]).length;
    const pct = items.length ? (done / items.length) * 100 : 0;

    document.querySelectorAll(`[data-amie-decor-summary="${gameKey}"]`).forEach((card) => {
      const textEl = card.querySelector('[data-amie-decor-summary-text]');
      if (textEl) textEl.textContent = `${done} / ${items.length} (${pct.toFixed(2)}%)`;
      const barEl = card.querySelector('[data-amie-decor-summary-bar]');
      if (barEl) barEl.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    });
  };
}

export function refreshAmieDecorSectionHeader() {
  window.PPGC?.refreshSectionHeaderPct?.();
}
