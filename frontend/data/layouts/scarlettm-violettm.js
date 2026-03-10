(() => {
	const GAME_KEYS = ["scarlettm", "violettm"];

	const P = (parentId) => [parentId];          			// parent-only task
	const C = (parentId, childId) => [parentId, childId]; 	// parent + child task

	const DESKTOP_LAYOUT = {
		"catching": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	window.defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();