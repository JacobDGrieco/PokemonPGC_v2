export function isTemporarilyHiddenSection(section) {
  const title = String(section?.title || '').trim().toLowerCase();
  return title === 'distributions';
}

export function getVisibleSections(gameKey, ensureSections) {
  return (ensureSections?.(gameKey) || []).filter((section) => !isTemporarilyHiddenSection(section));
}
