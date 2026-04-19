import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["ultrasun", "ultramoon"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 10),
			[P(2)],
			...childRows(2, 1, 10),
			[P(3)],
			...childRows(3, 1, 34),
			[P(4)],
			...childRows(4, 1, 7, 4),
			[P(5)],
			...childRows(5, 1, 6, 3),
			[P(6)],
			...childRows(6, 1, 7, 4),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 12, 4),
			[P(2)],
			...childRows(2, 1, 8, 4),
		],
		sideQuests: [
			[P(1), P(2)],
			[P(3)],
			...childRows(3, 1, 7, 4),
			[P(4)],
			...childRows(4, 1, 3),
			...parentRows(5, 21),
		],
		activities: [
			[P(1)],
			...childRows(1, 1, 10),
			[P(2)],
			...childRows(2, 1, 4),
			[P(3)],
			...childRows(3, 1, 20),
		],
		battle: [
			...parentRows(1, 3),
			[P(4)],
			...childRows(4, 1, 8, 4),
			[P(5)],
			[C(5, 1), C(5, 2)],
		],
		upgrades: [
			...parentRows(1, 3),
			[P(4)],
			...childRows(4, 1, 5),
			[P(5)],
			...childRows(5, 1, 15),
			[P(6)],
			...childRows(6, 1, 9),
			[P(7)],
			...childRows(7, 1, 4),
		],
		collectables: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 13),
			[P(3)],
			...childRows(3, 1, 17, 6),
			[P(4)],
			...childRows(4, 1, 17, 6),
			[P(5)],
			...childRows(5, 1, 17, 6),
			[P(6)],
			...childRows(6, 1, 7, 4),
		],
		megaStones: [
			...parentRows(1, 46),
		],
		zcrystals: [
			[P(1)],
			...childRows(1, 1, 18, 6),
			[P(2)],
			...childRows(2, 1, 13),
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 8, 4),
			[P(2)],
			...childRows(2, 1, 100),
		],
		extraCredit: [
			[P(1)],
			...childRows(1, 1, 3),
			[P(2)],
			...childRows(2, 1, 4),
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
