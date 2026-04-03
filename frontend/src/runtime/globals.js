export function ensureDataRoot() {
  if (typeof window === 'undefined') return {};
  window.DATA = window.DATA || {};
  return window.DATA;
}

export function ensurePpgcRoot() {
  if (typeof window === 'undefined') return {};
  window.PPGC = window.PPGC || {};
  return window.PPGC;
}
