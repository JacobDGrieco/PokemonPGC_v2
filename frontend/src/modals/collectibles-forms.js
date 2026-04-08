import {
  layoutWheel,
  getGameColor,
  computeChipScale,
  prepFormsModal,
  createWheelResizeHandler,
  resetFormsWheelLayout,
  applyFormsGridLayout,
} from "./modal.js";

export function openCollectibleForms(config) {
  const {
    store,
    gameKey,
    genKey,
    item,
    kind,
    scaleMode = 'sandwich',
    imgWidth = '100%',
    getFormsNode,
    setFormsNode,
    onHeaderUpdate,
  } = config;

  window.PPGC.disableTaskTooltips();

  const forms = Array.isArray(item.forms) ? item.forms : [];
  if (!forms.length) return;

  const formsModal = document.getElementById('formsModal');
  const formsWheel = document.getElementById('formsWheel');
  if (!formsModal || !formsWheel) return;

  const gameColor = getGameColor(gameKey, genKey);
  const dialog = prepFormsModal(formsModal, formsWheel, {
    accent: gameColor,
    clearWheelGridStyles: true,
  });
  if (!dialog) return;

  const layout0 = layoutWheel(dialog, { sizeCap: 1000, shrinkMaxR: true });
  formsWheel.style.setProperty('--size', `${layout0.size}px`);

  const N = forms.length;
  const scale = computeChipScale(scaleMode, N, dialog);
  formsWheel.style.setProperty('--form-img', `${scale.img}px`);
  formsWheel.style.setProperty('--chip-font', `${scale.font}px`);
  formsWheel.style.setProperty('--chip-pad', scale.pad);
  resetFormsWheelLayout(formsWheel);

  const itemKey = String(item.id);
  const { node } = getFormsNode(store, gameKey, itemKey);

  function recomputeAndPersist() {
    const { node } = getFormsNode(store, gameKey, itemKey);
    const total = forms.length;
    const done = Object.values(node.forms || {}).filter(Boolean).length;
    const all = total > 0 && done === total;

    node.all = all;
    setFormsNode(store, gameKey, itemKey, node);

    document.querySelectorAll(`[data-${kind}-count="${itemKey}"]`).forEach((el) => {
      el.textContent = `${done}/${total}`;
    });

    document.querySelectorAll(`[data-${kind}-main="${itemKey}"]`).forEach((chk) => {
      if (chk instanceof HTMLInputElement) chk.checked = all;
    });
  }

  const chips = [];
  for (const f of forms) {
    const name = typeof f === 'string' ? f : f?.name;
    if (!name) continue;
    const img = typeof f === 'object' ? f.img : null;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'form-chip';
    btn.setAttribute('role', 'checkbox');
    btn.title = name;
    btn.style = 'display: flex; flex-direction: column;';

    const checked = !!(node.forms || {})[name];
    btn.setAttribute('aria-checked', checked ? 'true' : 'false');

    if (img) {
      const im = document.createElement('img');
      im.src = img;
      im.alt = name;
      im.loading = 'lazy';
      im.style = `width: ${imgWidth};`;
      btn.appendChild(im);
    }

    const labelSpan = document.createElement('span');
    labelSpan.className = 'chip-text';
    labelSpan.dataset.id = f.id;
    labelSpan.textContent = name;
    btn.appendChild(labelSpan);

    btn.addEventListener('click', () => {
      const nowChecked = btn.getAttribute('aria-checked') !== 'true';
      btn.setAttribute('aria-checked', nowChecked ? 'true' : 'false');

      const { node } = getFormsNode(store, gameKey, itemKey);
      node.forms = node.forms || {};
      node.forms[name] = nowChecked;
      setFormsNode(store, gameKey, itemKey, node);

      recomputeAndPersist();
      onHeaderUpdate(gameKey);
    });

    formsWheel.appendChild(btn);
    chips.push(btn);
  }

  let onResize = null;
  const useRadial = N <= 4;

  if (useRadial) {
    onResize = createWheelResizeHandler(scaleMode, dialog, formsWheel, chips, {
      sizeCap: 1000,
      shrinkMaxR: true,
      innerRadiusStrategy(minR, outerR) {
        return Math.max(minR * 0.6, outerR * 0.45);
      },
    });
    window.addEventListener('resize', onResize, { passive: true });
  } else {
    applyFormsGridLayout(formsWheel, chips, {
      columns: 'repeat(6, minmax(0, 1fr))',
      gap: '8px',
      padding: '4px 2px 10px',
      maxWidth: '100%',
    });
  }

  const resizeKey = `_${kind}OnResize`;
  if (formsModal[resizeKey]) {
    window.removeEventListener('resize', formsModal[resizeKey]);
  }
  formsModal[resizeKey] = onResize;

  const closeBtn = document.getElementById('formsModalClose');
  closeBtn?.addEventListener('click', () => {
    window.PPGC.enableTaskTooltips();
  });
  closeBtn?.focus();
}
