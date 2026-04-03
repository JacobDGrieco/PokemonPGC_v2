(() => {
	const GAME_KEYS = ["scarletid", "violetid"];

	const P = (parentId) => [parentId];          			// parent-only task
	const C = (parentId, childId) => [parentId, childId]; 	// parent + child task

	const DESKTOP_LAYOUT = {
		"catching": [
			[P(1)],
			[C(1, 1)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	window.defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();