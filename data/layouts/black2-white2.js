import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["black2", "white2"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 3),
			...childRows(1, 4, 8),
			...childRows(1, 9, 14, 6),
			...childRows(1, 15, 17),
			[P(2)],
			...childRows(2, 1, 5),
			[P(3)],
			...childRows(3, 1, 7, 7),
			[P(4)],
			...childRows(4, 1, 6, 3),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9),
		],
		funfest: [
			[P(1)],
			...childRows(1, 1, 39, 4),
		],
		activities: [
			[P(1)],
			[P(2), P(3)],
		],
		battle: [
			[P(6), P(1), P(2)],
			[P(3)],
			...childRows(3, 1, 3),
			[P(4)],
			...childRows(4, 1, 6, 3),
			[P(5)],
			...childRows(5, 1, 14, 4),
		],
		upgrades: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 5, 3),
			[P(3)],
			...childRows(3, 1, 8, 3),
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 12, 4),
			[P(2)],
			...childRows(2, 1, 12, 4),
			[P(3)],
			...childRows(3, 1, 16, 4),
			[P(4)],
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 6, 6),
			[P(2)],
			...childRows(2, 1, 95),
		],
		extraCredit: [
			[P(1)],
			...childRows(1, 1, 4),
			[P(2)],
			...childRows(2, 1, 8, 4),
			[P(3)],
			...childRows(3, 1, 14, 4),
			[P(5)],
			[C(5, 1), C(5, 2)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
