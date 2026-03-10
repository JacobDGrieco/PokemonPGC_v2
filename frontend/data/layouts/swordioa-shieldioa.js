(() => {
	const GAME_KEYS = ["swordioa", "shieldioa"];

	const P = (parentId) => [parentId];          			// parent-only task
	const C = (parentId, childId) => [parentId, childId]; 	// parent + child task

	const DESKTOP_LAYOUT = {
		"catching": [
			[P(1)],
			[C(1, 1), C(1, 2)],
		],
		"trainer-cards": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4), C(1, 5)],
			[C(1, 6), C(1, 7), C(1, 8), C(1, 9), C(1, 10)],
			[C(1, 11), C(1, 12), C(1, 13), C(1, 14), C(1, 15)],
			[C(1, 16), C(1, 17), C(1, 18), C(1, 19), C(1, 20)],
			[C(1, 21)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3)],
			[P(3)],
			[C(3, 1), C(3, 2), C(3, 3), C(3, 4)],
		]
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	window.defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();