import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["emerald"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 6, 3),
			...childRows(1, 7, 10),
			[P(2)],
			...childRows(2, 1, 4),
			[P(3)],
			...childRows(3, 1, 3),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9),
		],
		activities: [
			[P(1)],
			...childRows(1, 1, 5),
			[P(2)],
		],
		battle: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 4),
			[P(3)],
			...childRows(3, 1, 3),
			[P(4)],
			...childRows(4, 1, 7),
			[P(5)],
			...childRows(4, 1, 7),
		],
		upgrades: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 4, 2),
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 9),
			[P(2)],
			[C(2, 1), C(2, 2)],
			[P(3)],
			[P(4)],
			...childRows(4, 1, 110),
			...childRows(4, 111, 116, 6),
			[P(5)],
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 8, 4),
			[P(2)],
			...childRows(2, 1, 50),
		],
		extraCredit: [
			[P(1)],
			[C(1, 1), C(1, 2)],
			[P(2)],
			...childRows(2, 1, 3),
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
