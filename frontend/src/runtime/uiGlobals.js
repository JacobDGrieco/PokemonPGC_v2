import { ensurePpgcRoot } from './globals.js';

const PPGC = ensurePpgcRoot();

export function installTooltipHelpers() {
  if (PPGC.__tooltipHelpersInstalled) return;
  PPGC.__tooltipHelpersInstalled = true;

  PPGC.hideTooltips = function hideAllTooltips() {
    try {
      const nodes = document.querySelectorAll('[role="tooltip"], .tooltip, #tooltip');
      nodes.forEach((el) => el.remove());

      if (PPGC._tooltipTimer) {
        clearTimeout(PPGC._tooltipTimer);
        PPGC._tooltipTimer = null;
      }
      PPGC._tooltipEl = null;
    } catch (error) {
      console.warn('hideAllTooltips failed:', error);
    }
  };
}

export function installMissingAssetLogger() {
  if (PPGC.__missingAssetLoggerInstalled) return;
  PPGC.__missingAssetLoggerInstalled = true;

  const buckets = {
    taskImages: new Set(),
    sprites: new Set(),
    textures: new Set(),
    otherImages: new Set(),
    models: new Set(),
  };

  let flushTimer = 0;
  const pendingTaskImages = new Set();
  const trackedTaskImages = new WeakSet();

  function kindLabel(kind) {
    if (kind === 'taskImages') return 'task images';
    if (kind === 'sprites') return 'sprites';
    if (kind === 'textures') return 'textures';
    if (kind === 'models') return 'models';
    return 'images';
  }

  function normalizeName(value) {
    const text = String(value || '').trim();
    if (!text) return '(unknown)';

    const trimToFirstSlash = (input) => {
      const slashIndex = input.indexOf('/');
      return slashIndex >= 0 ? input.slice(slashIndex) : input;
    };

    try {
      const url = new URL(text, location.href);
      if (url.origin === location.origin) return `${url.pathname}${url.search}${url.hash}`;
      return trimToFirstSlash(`${url.pathname}${url.search}${url.hash}` || url.href);
    } catch {
      return trimToFirstSlash(text);
    }
  }

  function guessKindFromUrl(urlValue) {
    const url = String(urlValue || '').toLowerCase();

    if (url.includes('/tasks/') || url.includes('task-item-img')) return 'taskImages';
    if (url.includes('/sprites/') || url.includes('pokemon_home')) return 'sprites';
    if (
      url.includes('/tex') ||
      url.includes('/textures/') ||
      /(_col|_nor|_nrm|_emi|_amb|_rare|_mra|_mask)\b/.test(url)
    ) {
      return 'textures';
    }
    if (/\.(glb|gltf)(\?|$)/.test(url)) return 'models';
    return 'otherImages';
  }

  function scheduleFlush() {
    if (flushTimer) return;
    flushTimer = window.setTimeout(() => {
      flushTimer = 0;

      if (pendingTaskImages.size > 0) {
        scheduleFlush();
        return;
      }

      const emit = (kind) => {
        const items = Array.from(buckets[kind]);
        if (!items.length) return;
        buckets[kind].clear();

        console.groupCollapsed(
          `%c[assets] Missing ${kindLabel(kind)}: ${items.length}`,
          'color:#f7c948;font-weight:600;'
        );
        console.log({ missing: items });
        console.groupEnd();
      };

      emit('taskImages');
      emit('sprites');
      emit('textures');
      emit('models');
      emit('otherImages');
    }, 150);
  }

  function finalizeTaskImage(img) {
    if (!(img instanceof HTMLImageElement)) return;
    pendingTaskImages.delete(img);
    scheduleFlush();
  }

  function trackTaskImage(img) {
    if (!(img instanceof HTMLImageElement)) return;
    if (!img.classList?.contains('task-item-img')) return;
    if (trackedTaskImages.has(img)) return;

    trackedTaskImages.add(img);

    if (img.complete) return;

    pendingTaskImages.add(img);
    img.addEventListener('load', () => finalizeTaskImage(img), { once: true });
    img.addEventListener('error', () => finalizeTaskImage(img), { once: true });
  }

  function trackTaskImagesInNode(node) {
    if (!(node instanceof Element)) return;

    if (node instanceof HTMLImageElement) {
      trackTaskImage(node);
      return;
    }

    node.querySelectorAll?.('img.task-item-img').forEach(trackTaskImage);
  }

  function untrackTaskImagesInNode(node) {
    if (!(node instanceof Element)) return;

    if (node instanceof HTMLImageElement) {
      pendingTaskImages.delete(node);
      return;
    }

    node.querySelectorAll?.('img.task-item-img').forEach((img) => {
      pendingTaskImages.delete(img);
    });
  }

  PPGC.reportMissingAsset = function reportMissingAsset(kind, nameOrUrl) {
    const resolvedKind = buckets[kind] ? kind : guessKindFromUrl(nameOrUrl);
    buckets[resolvedKind].add(normalizeName(nameOrUrl));
    scheduleFlush();
  };

  window.addEventListener(
    'error',
    (event) => {
      const target = event?.target;
      if (!(target instanceof HTMLImageElement)) return;

      const src = target.currentSrc || target.src || '';
      const kind = target.classList?.contains('task-item-img')
        ? 'taskImages'
        : (target.classList?.contains('evo-img') || target.classList?.contains('moninfo-hero-img'))
          ? 'sprites'
          : guessKindFromUrl(src);

      PPGC.reportMissingAsset(kind, src);
    },
    true
  );

  trackTaskImagesInNode(document.body);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(trackTaskImagesInNode);
      mutation.removedNodes.forEach(untrackTaskImagesInNode);
    }
    scheduleFlush();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export function installUiGlobals() {
  installTooltipHelpers();
  installMissingAssetLogger();
}
