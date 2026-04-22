import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["gold", "silver"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 5),
			[P(2)],
			...childRows(2, 1, 3),
			...childRows(2, 4, 7),
			[P(3)],
			...childRows(3, 1, 5),
			[P(4)],
			...childRows(4, 1, 6, 3),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9),
			[P(2)],
			...childRows(2, 1, 4),
			[P(3)],
			...childRows(3, 1, 8, 4),
		],
		activities: [
			...parentRows(1, 5, 3),
			[P(6)],
			...childRows(6, 1, 7, 7),
			[P(7)],
			...childRows(7, 1, 4),
		],
		upgrades: [
			[P(1)],
			[P(2)],
			[C(2, 1), C(2, 2)],
		],
		collectables: [
			[P(1), P(2)],
			[P(3)],
			...childRows(3, 1, 13, 7),
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 7, 4),
			[P(2)],
			...childRows(2, 1, 50, 5),
		],
		extraCredit: [
			[P(1)],
			[C(1, 1), C(1, 2)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
