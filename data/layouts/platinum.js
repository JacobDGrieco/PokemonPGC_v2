import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["platinum"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 6, 3),
			...childRows(1, 7, 12, 6),
			[P(2)],
			[C(2, 1), C(2, 2)],
			[P(3)],
			...childRows(3, 1, 4),
			[P(4)],
			...childRows(4, 1, 4),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9),
			[P(2)],
			...childRows(2, 1, 8, 4),
		],
		battle: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 3),
			[P(3)],
			...childRows(3, 1, 5),
			[P(4)],
			...childRows(4, 1, 5),
		],
		upgrades: [
			[P(1), P(2)],
			[P(3)],
			...childRows(3, 1, 5, 3),
			[P(4)],
			...childRows(4, 1, 25),
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 13),
			[P(2)],
			...childRows(2, 1, 11, 4),
			[P(3)],
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 8, 4),
			[P(2)],
			...childRows(2, 1, 92),
		],
		extraCredit: [
			[P(1)],
			...childRows(1, 1, 5),
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
