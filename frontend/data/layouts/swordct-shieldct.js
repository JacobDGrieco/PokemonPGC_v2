import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["swordct", "shieldct"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 10),
			[P(2)],
			...childRows(2, 1, 4),
			[P(3)],
			[C(3, 1), C(3, 2)],
			[P(4)],
			...childRows(4, 1, 35),
			[P(5)],
			...childRows(5, 1, 9),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 10),
			[P(2)],
			...childRows(2, 1, 5),
			[P(3)],
			...childRows(3, 1, 3),
		],
		sideQuests: [
			...parentRows(1, 5, 1),
		],
		battle: [
			...parentRows(1, 4, 1),
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 7),
			[P(2)],
			...childRows(2, 1, 3),
		],
		trainerCards: [
			[P(1)],
			[C(1, 1)],
			[P(2)],
			[C(2, 1)],
			[P(3)],
			...childRows(3, 1, 32),
			[P(4)],
			...childRows(4, 1, 3),
			[P(5)],
			...childRows(5, 1, 3),
		],
		fashion: [
			[P(1)],
			...childRows(1, 1, 6, 6),
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
