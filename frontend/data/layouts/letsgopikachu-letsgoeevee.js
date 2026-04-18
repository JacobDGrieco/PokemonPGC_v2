import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["letsgopikachu", "letsgoeevee"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 4),
			[P(2)],
			...childRows(2, 1, 3),
			[P(3)],
			...childRows(3, 1, 10),
			[P(4)],
			...childRows(4, 1, 8, 4),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9),
		],
		battle: [
			[P(1), P(2)],
			[P(3)],
			...childRows(3, 1, 8),
		],
		trainers: [
			[P(1)],
			...childRows(1, 1, 153, 6),
		],
		upgrades: [
			[P(1)],
		],
		collectables: [
			[P(2)],
			...childRows(2, 1, 8, 4),
		],
		megaStones: [
			...parentRows(1, 15),
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 5),
			[P(2)],
			...childRows(2, 1, 60),
		],
		extraCredit: [
			[P(1)],
			...childRows(1, 1, 3),
		],
	};

	const DESTOP_LAYOUT_GAME1 = {
		...DESKTOP_LAYOUT,
		fashion: [
			[P(1)],
			...childRows(1, 1, 10),
			[P(2)],
			...childRows(2, 1, 16, 4),
			[P(3)],
			...childRows(3, 1, 8, 4),
			[P(4)],
			...childRows(4, 1, 8, 4),
		],
	};

	const DESTOP_LAYOUT_GAME2 = {
		...DESKTOP_LAYOUT,
		fashion: [
			[P(1)],
			...childRows(1, 1, 17, 6),
			[P(2)],
			...childRows(2, 1, 16, 4),
			[P(3)],
			...childRows(3, 1, 8, 4),
			[P(4)],
			...childRows(4, 1, 8, 4),
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS[0], DESTOP_LAYOUT_GAME1, COMPACT_LAYOUT);
	defineLayoutsMany(GAME_KEYS[1], DESTOP_LAYOUT_GAME2, COMPACT_LAYOUT);
})();
