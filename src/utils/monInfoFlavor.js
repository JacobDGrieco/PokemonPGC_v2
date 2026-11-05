/** Reduce localized paired-version descriptions to the boxes the UI should show. */
export function presentMonInfoFlavorEntries(entries = []) {
	const availableEntries = entries.filter((entry) =>
		String(entry?.flavor || "").trim(),
	);
	const distinctFlavorText = new Set(
		availableEntries.map((entry) => String(entry.flavor).trim()),
	);
	const hasVersionDifferences = distinctFlavorText.size > 1;

	return {
		hasVersionDifferences,
		entries: hasVersionDifferences
			? availableEntries
			: availableEntries.slice(0, 1),
	};
}
