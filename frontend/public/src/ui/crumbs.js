/**
 * Render the breadcrumb trail at the top of the app.
 *
 * Levels:
 *   - "gen"     → Generations
 *   - "game"    → Gen label > Game label
 *   - "section" → Gen label > Game label > Section title
 */
export function renderCrumbs(store, els) {
	const { elCrumbs } = els;
	const s = store.state;

	// Reset current crumbs
	elCrumbs.innerHTML = "";

	// Helper to append a single crumb span
	const pushCrumb = (text) => {
		if (!text) return;
		const span = document.createElement("span");
		span.className = "crumb";
		span.textContent = text;
		elCrumbs.appendChild(span);
	};

	// Top-level: just "Generations"
	if (s.level === "gen") {
		pushCrumb("Generations");
		return;
	}

	// Gen label (from DATA.tabs)
	const genLabel =
		(window.DATA.tabs || []).find((x) => x.key === s.genKey)?.label ||
		s.genKey;
	pushCrumb(genLabel);

	// Game label (from DATA.games)
	if (s.level !== "gen") {
		const gameLabel =
			(window.DATA.games?.[s.genKey] || []).find(
				(x) => x.key === s.gameKey
			)?.label || s.gameKey;
		pushCrumb(gameLabel);
	}

	// Section title (from sectionsStore)
	if (s.level === "section") {
		const sec = (store.sectionsStore.get(s.gameKey) || []).find(
			(x) => x.id === s.sectionId
		);
		if (sec) pushCrumb(sec.title);
	}
}
