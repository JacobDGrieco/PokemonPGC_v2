import {
  normalizeFlag,
  pickHighestStatus,
  clampStatusForMon,
  isOptionAllowedForMon,
  getFilterClassForStatus,
  renderBadges,
} from './helpers.js';
import { getImageForStatus } from './dex-search.js';

function buildSpriteMarkup({ src, name }) {
  if (!src) return `<div style="opacity:.5;">No image</div>`;
  if (String(src).toLowerCase().endsWith('.webm')) {
    return `<video
      class="sprite dex-webm"
      src="${src}"
      autoplay
      loop
      muted
      playsinline
      preload="metadata"
      disablepictureinpicture
      style="width:132px;height:132px;object-fit:contain;"
    ></video>`;
  }
  return `<img
    class="sprite"
    alt="${name}"
    src="${src}"
    loading="lazy"
    style="width:132px;height:132px;object-fit:contain;"
    onerror="if(this.src!==window.__PPGC_NO_IMG__){this.src=window.__PPGC_NO_IMG__||'/no-image.svg';}"
  />`;
}

function updateDexThumb({ thumb, mon, status, gameKey }) {
  const newSrc = getImageForStatus(mon, status, gameKey, window.PPGC?.gen1SpriteColor);
  const newCls = getFilterClassForStatus(status);

  thumb.classList.remove('status-unknown', 'status-seen', 'status-normal');
  thumb.classList.add(newCls);

  const oldSprite = thumb.querySelector('.sprite');
  const newIsWebm = typeof newSrc === 'string' && newSrc.toLowerCase().endsWith('.webm');
  let newSprite;

  if (newIsWebm) {
    newSprite = document.createElement('video');
    newSprite.src = newSrc;
    newSprite.autoplay = true;
    newSprite.loop = true;
    newSprite.muted = true;
    newSprite.playsInline = true;
    newSprite.preload = 'metadata';
    newSprite.setAttribute('disablepictureinpicture', '');
  } else {
    newSprite = document.createElement('img');
    newSprite.src = newSrc;
    newSprite.alt = mon.name;
    newSprite.loading = 'lazy';
  }

  newSprite.className = 'sprite' + (newIsWebm ? ' dex-webm' : '');
  newSprite.style.width = '132px';
  newSprite.style.height = '132px';
  newSprite.style.objectFit = 'contain';

  if (oldSprite) oldSprite.replaceWith(newSprite);
  else thumb.appendChild(newSprite);

  const oldBadges = thumb.querySelector('.badges');
  oldBadges?.remove();
  const newBadgesHTML = renderBadges(status, gameKey);
  if (newBadgesHTML) thumb.insertAdjacentHTML('beforeend', newBadgesHTML);
}

export function renderDexCards({
  store,
  dexGrid,
  filtered,
  gameKey,
  genKey,
  game,
  statusMap,
  options,
  getDexFormsNode,
  openMonInfo,
  openDexForms,
  openResearchModal,
  queueDexSync,
  applyDexLinksFromDexEntries,
  applyDexLinksFromForm,
  save,
}) {
  dexGrid.innerHTML = '';

  filtered.forEach((it) => {
    let current = statusMap[it.id] || 'unknown';
    const hasForms = Array.isArray(it.forms) && it.forms.length > 0;
    const hasResearch = Array.isArray(it.research) && it.research.length > 0;

    if (hasForms) {
      const { node } = getDexFormsNode(gameKey, it.id);
      const formVals = (it.forms || []).map((f) => {
        const name = typeof f === 'string' ? f : f?.name;
        return node.forms?.[name] || 'unknown';
      });
      current = pickHighestStatus(formVals);
    }

    current = clampStatusForMon(it, current);
    const src = getImageForStatus(it, current, gameKey, window.PPGC?.gen1SpriteColor);
    const cls = getFilterClassForStatus(current);
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role', 'listitem');
    card.dataset.status = current;
    card.style.setProperty('--accent', game?.color || '#6aa6ff');

    const keyForCount = `${gameKey}:${it.id}`;
    const formsCountHTML = hasForms ? `<span class="pill count" data-dex-forms-count="${keyForCount}"></span>` : '';
    const researchCountHTML = hasResearch ? `<span class="pill count" data-dex-research-count="${keyForCount}"></span>` : '';

    card.innerHTML = `
      <div class="thumb ${cls}">
        <button
          type="button"
          class="dex-info-btn"
          title="Show detailed info for ${it.name}"
          aria-label="Show detailed info for ${it.name}"
        >i</button>
        <div class="name" title="${it.id}">#${String(window._dexIdNumber(it.id, it.localId) ?? '').padStart(3, '0')}
          ${renderBadges(current, gameKey)}
        </div>
        ${buildSpriteMarkup({ src, name: it.name })}
      </div>
      <div class="card-bd">
        <div class="name" title="${it.name}" data-id="${it.id}">${it.name}</div>
        <div class="row">
          ${hasForms
            ? `<button class="forms-launch" title="Choose forms"><span class="dot"></span><span>Forms</span>${formsCountHTML}</button>`
            : `<select class="flag-select" aria-label="Status for ${it.name}">
                ${options.map((opt) => {
                  const val = normalizeFlag(opt);
                  if (!isOptionAllowedForMon(it, val)) return '';
                  const label = val.replace(/_/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase());
                  const currentVal = clampStatusForMon(it, statusMap[it.id] || 'unknown');
                  return `<option value="${val}" ${val === currentVal ? 'selected' : ''}>${label}</option>`;
                }).join('')}
              </select>`}
          ${hasResearch
            ? `<button class="research-launch" title="Research tasks" data-game="${gameKey}" data-id="${it.id}"><span class="dot"></span><span>Research</span>${researchCountHTML}</button>`
            : ''}
        </div>
      </div>`;

    if (hasResearch) {
      const rEl = card.querySelector(`[data-dex-research-count="${keyForCount}"]`);
      if (rEl) {
        const stats = window?.PPGC?.getMonResearchTierStats
          ? window.PPGC.getMonResearchTierStats(gameKey, it.id, it, store)
          : null;
        if (stats && typeof stats.totalTiers === 'number') {
          rEl.textContent = `${Number(stats.doneTiers || 0)}/${stats.totalTiers}`;
          rEl.title = `Tiers completed: ${Number(stats.doneTiers || 0)}/${stats.totalTiers} • Level: ${Math.min(10, Number(stats.researchLevel || 0))}/10`;
        } else {
          rEl.textContent = '0/0';
        }
      }
    }

    card.querySelector('.dex-info-btn')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      await openMonInfo(gameKey, genKey, it);
    });

    if (hasForms) {
      card.querySelector('.forms-launch')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openDexForms(gameKey, genKey, it);
      });

      const countEl = card.querySelector(`[data-dex-forms-count="${keyForCount}"]`);
      if (countEl) {
        const total = (it.forms || []).length;
        const { node } = getDexFormsNode(gameKey, it.id);
        const filled = (it.forms || []).reduce((acc, f) => {
          const name = typeof f === 'string' ? f : f?.name;
          return acc + ((node.forms?.[name] || 'unknown') !== 'unknown' ? 1 : 0);
        }, 0);
        countEl.textContent = `${filled}/${total}`;
      }
    }

    if (hasResearch) {
      card.querySelector('.research-launch')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openResearchModal(gameKey, genKey, it, store);
      });

      const researchCountEl = card.querySelector(`[data-dex-research-count="${keyForCount}"]`);
      if (researchCountEl) {
        const tasks = Array.isArray(it.research) ? it.research : [];
        const recAll = store.dexResearchStatus instanceof Map ? store.dexResearchStatus.get(gameKey) || {} : {};
        const rec = recAll[it.id] || {};
        let totalTiers = 0;
        let doneTiers = 0;
        tasks.forEach((t, idx) => {
          const tiers = Array.isArray(t.tiers) ? t.tiers : [];
          const steps = tiers.length || 0;
          totalTiers += steps;
          const raw = rec[idx];
          const level = typeof raw === 'number' ? raw : raw ? steps : 0;
          const clamped = Math.max(0, Math.min(steps, level));
          doneTiers += clamped;
        });
        researchCountEl.textContent = `${doneTiers}/${totalTiers}`;
        researchCountEl.title = `Tiers completed: ${doneTiers}/${totalTiers}`;
      }
    }

    const select = card.querySelector('select.flag-select');
    if (select) {
      select.addEventListener('change', () => {
        let newVal = normalizeFlag(select.value);
        newVal = clampStatusForMon(it, newVal);
        select.value = newVal;

        const curr = store.dexStatus.get(gameKey) || {};
        curr[it.id] = newVal;
        store.dexStatus.set(gameKey, curr);
        save();
        queueDexSync(gameKey, it.id, newVal);

        const changed = { [it.id]: newVal };
        try {
          applyDexLinksFromDexEntries(gameKey, changed);
        } catch (e) {
          console.error('applyDexLinksFromDexEntries (single) error:', e);
        }
        try {
          window.PPGC.applyDexSyncsFromDexEntries?.(gameKey, changed);
        } catch (e) {
          console.error('applyDexSyncsFromDexEntries (single) error:', e);
        }

        card.dataset.status = newVal;
        updateDexThumb({ thumb: card.querySelector('.thumb'), mon: it, status: newVal, gameKey });
      });
    }

    dexGrid.appendChild(card);
  });
}
