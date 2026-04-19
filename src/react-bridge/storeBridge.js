const EVENT_NAME = 'ppgc:ui-sync';

function cloneState(state = {}) {
  return { ...state };
}

export function getPpgcUiSnapshot() {
  const state = window.PPGC?.reactSnapshot || null;
  if (state) return state;

  const liveState = window.PPGC?._storeRef?.state || window.store?.state || null;
  return {
    state: liveState ? cloneState(liveState) : null,
    loading: false,
    timestamp: Date.now(),
  };
}

export function emitPpgcUiSync(payload = {}) {
  window.PPGC = window.PPGC || {};
  const baseState = payload.state || window.PPGC?._storeRef?.state || window.store?.state || {};

  const snapshot = {
    state: cloneState(baseState),
    loading: !!payload.loading,
    timestamp: Date.now(),
  };

  window.PPGC.reactSnapshot = snapshot;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: snapshot }));
  return snapshot;
}

export function subscribeToPpgcUiSync(callback) {
  const handler = (event) => callback(event.detail || getPpgcUiSnapshot());
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
