import { defineLayoutsMany, P, C, parentRows, childRows } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["brilliantdiamond", "shiningpearl"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 4), C(1, 5), C(1, 6)],
			[C(1, 7), C(1, 8), C(1, 9)],
			[P(2)],
			...childRows(2, 1, 18, 6),
			[P(3)],
			...childRows(3, 1, 2),
			[P(4)],
			...childRows(4, 1, 3),
			[P(5)],
			...childRows(5, 1, 4),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9, 5),
		],
		activites: [
			[P(1)],
			...childRows(1, 1, 6),
			[P(2)],
			...childRows(2, 1, 6, 3),
		],
		battle: [
			[P(4), P(1)],
			...childRows(1, 1, 13, 5),
			[P(2)],
			...childRows(2, 1, 2),
			[P(3)],
			...childRows(3, 1, 2),
		],
		upgrades: [
			[P(1)],
			[P(2)],
			[P(3)],
			...childRows(3, 1, 5),
			[P(4)],
			...childRows(4, 1, 20, 5),
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 10, 5),
			[P(2)],
			...childRows(2, 1, 5),
			[P(3)],
			...childRows(3, 1, 17, 6),
			[P(4)],
		],
		fashion: [
			...parentRows(1, 11, 4),
		],
		underground: [
			[P(1)],
			...childRows(1, 1, 223, 6),
			[P(2)],
			...childRows(2, 1, 206, 6),
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 8, 4),
			[P(2)],
			...childRows(2, 1, 100, 5),
		],
		extraCredit: [
			[P(1)],
			...childRows(1, 1, 7, 4),
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
