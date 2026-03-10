(() => {
	const GAME_KEYS = ["firered", "leafgreen"];

	const P = (parentId) => [parentId];          			// parent-only task
	const C = (parentId, childId) => [parentId, childId]; 	// parent + child task

	const DESKTOP_LAYOUT = {
		"catching": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4)],
			[P(2)],
			[C(2, 1), C(2, 2)],
			[P(3)],
			[C(3, 1), C(3, 2), C(3, 3)],
			[C(3, 4), C(3, 5), C(3, 6)],
			[P(4)],
			[C(4, 1), C(4, 2), C(4, 3)],
			[C(4, 4), C(4, 5), C(4, 6)],
			[C(4, 7), C(4, 8), C(4, 9)],
		],
		"story": [
			[P(1)],
			[P(2)],
			[C(2, 1)],
		],
		"battle": [
			[P(1)],
			[P(2)],
			[C(2, 1), C(2, 2)],
			[C(2, 3), C(2, 4)],
		],
		"upgrades": [
			[P(1)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3)],
			[C(2, 4), C(2, 5)],
		],
		"collectables": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3)],
			[C(1, 4), C(1, 5), C(1, 6)],
			[P(2)],
		],
		"thms": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4), C(1, 5)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3), C(2, 4), C(2, 5)],
			[C(2, 6), C(2, 7), C(2, 8), C(2, 9), C(2, 10)],
			[C(2, 11), C(2, 12), C(2, 13), C(2, 14), C(2, 15)],
			[C(2, 16), C(2, 17), C(2, 18), C(2, 19), C(2, 20)],
			[C(2, 21), C(2, 22), C(2, 23), C(2, 24), C(2, 25)],
			[C(2, 26), C(2, 27), C(2, 28), C(2, 29), C(2, 30)],
			[C(2, 31), C(2, 32), C(2, 33), C(2, 34), C(2, 35)],
			[C(2, 36), C(2, 37), C(2, 38), C(2, 39), C(2, 40)],
			[C(2, 41), C(2, 42), C(2, 43), C(2, 44), C(2, 45)],
			[C(2, 46), C(2, 47), C(2, 48), C(2, 49), C(2, 50)],
		],
		"extra-credit": [
			[P(1)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	window.defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();