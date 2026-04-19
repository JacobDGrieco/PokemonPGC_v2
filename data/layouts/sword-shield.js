import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["sword", "shield"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 3),
			[P(2)],
			...childRows(2, 1, 3),
			[P(3)],
			...childRows(3, 1, 9),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 10),
			[P(2)],
			...childRows(2, 1, 5),
		],
		battle: [
			...parentRows(1, 3),
		],
		upgrades: [
			[P(1), P(2)],
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 7, 4),
			[P(2)],
			...childRows(2, 1, 16),
			[P(3)],
			...childRows(3, 1, 17, 6),
			[P(4)],
			...childRows(4, 1, 17, 6),
			[P(5)],
			...childRows(5, 1, 6, 6),
			[P(6)],
		],
		trainerCards: [
			[P(1)],
			...childRows(1, 1, 14),
			[P(2)],
			...childRows(2, 1, 13),
			[P(3)],
			...childRows(3, 1, 53),
			[P(4)],
			...childRows(4, 1, 20),
			[P(5)],
			...childRows(5, 1, 18),
			[P(6)],
			...childRows(6, 1, 8, 4),
		],
		thms: [
			...parentRows(1, 60),
		],
		trs: [
			...parentRows(1, 100),
		],
		extraCredit: [
			[P(1)],
			...childRows(1, 1, 3),
			[P(2)],
			...childRows(2, 1, 3),
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
