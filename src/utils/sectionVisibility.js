export function isTemporarilyHiddenSection(section) {
	void section;
	return false;
}

export function getVisibleSections(gameKey, ensureSections) {
	return (ensureSections?.(gameKey) || []).filter(
		(section) => !isTemporarilyHiddenSection(section),
	);
}
