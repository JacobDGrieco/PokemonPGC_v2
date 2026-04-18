import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["heartgold", "soulsilver"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 9),
			...childRows(1, 10, 15, 6),
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
			...childRows(4, 1, 8, 8),
		],
		sideQuests: [
			...parentRows(1, 5, 3),
			[P(6)],
			...childRows(6, 1, 7, 7),
		],
		activities: [
			[P(1)],
			...childRows(1, 1, 10),
			[P(2)],
			...childRows(2, 1, 16, 4),
			[P(3)],
			...childRows(3, 1, 46),
		],
		battle: [
			...parentRows(1, 3),
			[P(4)],
			...childRows(4, 1, 5, 3),
			[P(5)],
			...childRows(5, 1, 5, 3),
		],
		upgrades: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 5, 3),
			[C(2, 1), C(2, 2), C(2, 3)],
			[C(2, 4), C(2, 5)],
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
