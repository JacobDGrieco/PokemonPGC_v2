import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["heartgold", "soulsilver"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 9),
			...childRows(1, 10, 12),
			...childRows(1, 13, 15),
			[P(2)],
			...childRows(2, 1, 3),
			[P(3)],
			...childRows(3, 1, 9),
			[P(4)],
			...childRows(4, 1, 10),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9),
			[P(2)],
			...childRows(2, 1, 3),
			[P(3)],
			...childRows(3, 1, 4),
			[P(4)],
			...childRows(4, 1, 8, 4),
		],
		activities: [
			...parentRows(1, 5, 3),
			[P(6)],
			...childRows(6, 1, 7, 7),
			[P(7)],
			...childRows(7, 1, 10),
			[P(8)],
			...childRows(8, 1, 16, 8),
			[P(9)],
			...childRows(9, 1, 46, 6),
		],
		battle: [
			[P(1)],
			[P(2)],
			[C(2, 1)],
			[P(3)],
			...childRows(3, 1, 16, 4),
			[P(4)],
			...childRows(4, 1, 5, 3),
			[P(5)],
			...childRows(5, 1, 5, 3),
		],
		upgrades: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 5, 3),
		],
		collectables: [
			[P(1), P(2)],
			[P(3)],
			...childRows(3, 1, 13),
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 8, 4),
			[P(2)],
			...childRows(2, 1, 92),
		],
		extraCredit: [
			[P(1)],
			[C(1, 1), C(1, 2)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
