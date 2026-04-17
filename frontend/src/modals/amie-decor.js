import { save } from '../store.js';
import { getGameCollection } from './helpers.js';
import { createAmieDecorSummaryUpdater, refreshAmieDecorSectionHeader } from './amie-decor-summary.js';

function getStatusMap(store, gameKey) {
  return (store?.amieDecorStatus instanceof Map ? store.amieDecorStatus.get(gameKey) : null) || {};
}

function setStatusMap(store, gameKey, next) {
  store.amieDecorStatus.set(gameKey, next);
}

export function wireAmieDecorModal(store, els) {
  const {
    collectionModal: amieDecorModal,
    collectionModalClose: amieDecorModalClose,
    collectionGrid: amieDecorGrid,
    collectionSearch: amieDecorSearch,
    collectionSelectAll: amieDecorSelectAll,
    collectionClearAll: amieDecorClearAll,
    collectionModalTitle: amieDecorModalTitle,
    collectionGenderToggle,
  } = els;

  const updateSummary = createAmieDecorSummaryUpdater(store);
  const isAmieDecorViewActive = () => amieDecorModal?.dataset.view === 'amieDecor';

  function getCurrentItems() {
    return getGameCollection('amieDecor', store.state.amieDecorForGame);
  }

  function getFilteredItems() {
    const items = getCurrentItems();
    const q = String(amieDecorSearch?.value || '').trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      const haystack = [item.label, item.group, item.category].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }

  function renderGrid() {
    const gameKey = store.state.amieDecorForGame;
    if (!gameKey || !amieDecorGrid) return;

    const status = getStatusMap(store, gameKey);
    const items = getFilteredItems();
    amieDecorGrid.innerHTML = '';

    items.forEach((item) => {
      const key = String(item.id);
      const checked = !!status[key];
      const card = document.createElement('article');
      card.className = 'card';
      card.dataset.amieDecorId = key;
      card.innerHTML = `
        <div class="card-bd">
          <div class="name" title="${item.label}" data-id="${key}">${item.label}</div>
          <div class="small" style="opacity:.72; margin-top:4px;">${item.group} - ${item.category}</div>
          <div class="row" style="gap:8px; align-items:center; justify-content:center; margin-top:10px;">
            <label class="small" style="display:inline-flex; gap:8px; align-items:center; justify-content:center;">
              <input type="checkbox" data-amie-decor-main="${key}" ${checked ? 'checked' : ''} />
              <span>Collected</span>
            </label>
          </div>
        </div>
      `;

      const checkbox = card.querySelector(`[data-amie-decor-main="${key}"]`);
      if (checkbox instanceof HTMLInputElement) {
        checkbox.addEventListener('change', () => {
          const next = { ...getStatusMap(store, gameKey), [key]: !!checkbox.checked };
          setStatusMap(store, gameKey, next);
          save();
          updateSummary(gameKey);
          refreshAmieDecorSectionHeader();
        });
      }

      amieDecorGrid.appendChild(card);
    });
  }

  function setAll(checked) {
    const gameKey = store.state.amieDecorForGame;
    if (!gameKey) return;
    const next = { ...getStatusMap(store, gameKey) };
    getCurrentItems().forEach((item) => {
      next[String(item.id)] = !!checked;
    });
    setStatusMap(store, gameKey, next);
    save();
    renderGrid();
    updateSummary(gameKey);
    refreshAmieDecorSectionHeader();
  }

  function openAmieDecorModal(gameKey, genKey) {
    window.PPGC?.disableTaskTooltips?.();
    store.state.amieDecorForGame = gameKey;

    const game = (window.DATA.games?.[genKey] || []).find((entry) => entry.key === gameKey);
    amieDecorModal.style.setProperty('--accent', game?.color || '#7fd2ff');
    amieDecorModal.dataset.view = 'amieDecor';
    if (collectionGenderToggle) {
      collectionGenderToggle.classList.add('hidden');
    }
    if (amieDecorSearch) {
      amieDecorSearch.hidden = false;
      amieDecorSearch.placeholder = 'Search decorations...';
      amieDecorSearch.value = '';
    }
    if (amieDecorSelectAll) amieDecorSelectAll.hidden = false;
    if (amieDecorClearAll) amieDecorClearAll.hidden = false;
    if (amieDecorModalTitle) {
      amieDecorModalTitle.textContent = `Poke-Amie Decorations - ${game?.label || gameKey}`;
    }

    renderGrid();
    amieDecorModal.removeAttribute('inert');
    amieDecorModal.setAttribute('aria-hidden', 'false');
    amieDecorModal.classList.add('open');
    amieDecorModalClose?.focus();
  }

  function closeAmieDecorModal() {
    const active = document.activeElement;
    if (active && amieDecorModal?.contains(active)) {
      try { active.blur(); } catch {}
    }
    amieDecorModal.classList.remove('open');
    amieDecorModal.setAttribute('aria-hidden', 'true');
    amieDecorModal.setAttribute('inert', '');
    amieDecorModal.dataset.view = '';
    window.PPGC?.enableTaskTooltips?.();
  }

  amieDecorModal?.addEventListener('click', (event) => {
    if (event.target === amieDecorModal && isAmieDecorViewActive()) closeAmieDecorModal();
  });
  amieDecorModalClose?.addEventListener('click', () => {
    if (isAmieDecorViewActive()) closeAmieDecorModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isAmieDecorViewActive() && amieDecorModal?.classList.contains('open')) {
      closeAmieDecorModal();
    }
  });

  if (amieDecorSearch && !amieDecorSearch._ppgcAmieDecorBound) {
    amieDecorSearch.addEventListener('input', () => {
      if (!isAmieDecorViewActive()) return;
      renderGrid();
    });
    amieDecorSearch._ppgcAmieDecorBound = true;
  }
  if (amieDecorSelectAll && !amieDecorSelectAll._ppgcAmieDecorBound) {
    amieDecorSelectAll.addEventListener('click', (event) => {
      if (!isAmieDecorViewActive()) return;
      event.preventDefault();
      event.stopPropagation();
      setAll(true);
    });
    amieDecorSelectAll._ppgcAmieDecorBound = true;
  }
  if (amieDecorClearAll && !amieDecorClearAll._ppgcAmieDecorBound) {
    amieDecorClearAll.addEventListener('click', (event) => {
      if (!isAmieDecorViewActive()) return;
      event.preventDefault();
      event.stopPropagation();
      setAll(false);
    });
    amieDecorClearAll._ppgcAmieDecorBound = true;
  }

  return { openAmieDecorModal, renderGrid };
}
