import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["sword", "shield"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3)],
			[P(3)],
			[C(3, 1), C(3, 2), C(3, 3), C(3, 4), C(3, 5)],
			[C(3, 6), C(3, 7), C(3, 8), C(3, 9)],
		],
		story: [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4), C(1, 5)],
			[C(1, 6), C(1, 7), C(1, 8), C(1, 9), C(1, 10)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3), C(2, 4), C(2, 5)],
		],
		battle: [
			[P(1), P(2), P(3)],
		],
		upgrades: [
			[P(1), P(2)],
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 7, 4),
			[P(2)],
			...childRows(2, 1, 16, 5),
			[P(3)],
			...childRows(3, 1, 17, 6),
			[P(4)],
			...childRows(4, 1, 17, 6),
			[P(5)],
			...childRows(5, 1, 6, 6),
		],
		trainerCards: [
			[P(1)],
			...childRows(1, 1, 14, 5),
			[P(2)],
			...childRows(2, 1, 13, 5),
			[P(3)],
			...childRows(3, 1, 53, 5),
			[P(4)],
			...childRows(4, 1, 20, 5),
			[P(5)],
			...childRows(5, 1, 18, 5),
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
			[C(1, 1), C(1, 2), C(1, 3)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3)],
		],
	};

	const DESTOP_LAYOUT_GAME1 = {
		...DESKTOP_LAYOUT,
	};

	const DESTOP_LAYOUT_GAME2 = {
		...DESKTOP_LAYOUT,
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;
	const COMPACT_LAYOUT_GAME1 = COMPACT_LAYOUT;
	const COMPACT_LAYOUT_GAME2 = COMPACT_LAYOUT;

	defineLayoutsMany(GAME_KEYS[0], DESTOP_LAYOUT_GAME1, COMPACT_LAYOUT_GAME1);
	defineLayoutsMany(GAME_KEYS[1], DESTOP_LAYOUT_GAME2, COMPACT_LAYOUT_GAME2);
})();
