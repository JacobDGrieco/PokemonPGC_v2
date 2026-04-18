import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["x", "y"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 7),
			[P(2)],
			[C(2, 1)],
			[P(3)],
			...childRows(3, 1, 3),
			[P(4)],
			...childRows(4, 1, 7),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9),
			[P(2)],
			...childRows(2, 1, 6, 3),
		],
		activities: [
			[P(1), P(2)],
			[P(3)],
			...childRows(3, 1, 12),
			[P(4)],
			...childRows(4, 1, 5),
		],
		battle: [
			...parentRows(1, 3),
			[P(4)],
			...childRows(4, 1, 4),
		],
		upgrades: [
			[P(1), P(2)],
			[P(3)],
			...childRows(3, 1, 3),
			[P(4)],
			...childRows(4, 1, 4),
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 13),
			[P(2)],
			...childRows(2, 1, 10),
			[P(3)],
			...childRows(3, 1, 17),
			[P(4)],
			...childRows(4, 1, 17),
			[P(5)],
		],
		megaStones: [
			...parentRows(1, 26),
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 5),
			[P(2)],
			...childRows(2, 1, 100),
		],
		extraCredit: [
			[P(1)],
			...childRows(1, 1, 3),
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
