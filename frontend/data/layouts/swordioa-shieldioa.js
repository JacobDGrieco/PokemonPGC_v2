import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["swordioa", "shieldioa"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			[C(1, 1), C(1, 2)],
			[P(2)],
			...childRows(2, 1, 12, 4),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 13, 4),
			[P(2)],
			...childRows(2, 1, 7, 4),
		],
		sideQuests: [
			[P(1)],
			[P(2)],
		],
		battle: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 18, 6),
		],
		upgrades: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 14, 4),
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 4),
			[P(2)],
			[C(2, 1), C(2, 2)],
			[P(3)],
		],
		trainerCards: [
			[P(1)],
			...childRows(1, 1, 3),
			[P(2)],
			...childRows(2, 1, 3),
			[P(3)],
			...childRows(3, 1, 21),
			[P(4)],
			...childRows(4, 1, 3),
			[P(5)],
			...childRows(5, 1, 4),
		],
		fashion: [
			[P(1)],
			...childRows(1, 1, 4),
		]
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
