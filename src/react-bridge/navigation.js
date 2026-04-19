export function navigateToState(nextState) {
  window.PPGC?.navigateToState?.(nextState);
}

export function navigateHome() {
  navigateToState({
    level: 'gen',
    genKey: null,
    gameKey: null,
    sectionId: null,
    monInfoId: null,
    monInfoGameKey: null,
    monInfoForm: null,
  });
}

export function navigateToToolsInfo() {
  navigateToState({
    level: 'tools',
    toolsKey: 'info',
    genKey: null,
    gameKey: null,
    sectionId: null,
    monInfoId: null,
    monInfoGameKey: null,
    monInfoForm: null,
  });
}
