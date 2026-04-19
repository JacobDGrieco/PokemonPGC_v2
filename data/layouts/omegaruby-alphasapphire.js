import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["omegaruby", "alphasapphire"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 8),
			[P(2)],
			...childRows(2, 1, 23),
			[P(3)],
			[C(3, 1)],
			[P(4)],
			...childRows(4, 1, 4),
			[P(5)],
			...childRows(5, 1, 10),
			[P(6)],
			...childRows(6, 1, 3),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9),
			[P(2)],
			...childRows(1, 1, 17),
		],
		activities: [
			...parentRows(1, 4),
			[P(5)],
			...childRows(5, 1, 5),
			[P(6)],
			...childRows(6, 1, 3),
		],
		battle: [
			...parentRows(1, 3),
			[P(4)],
			...childRows(4, 1, 3),
		],
		upgrades: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 3),
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 17),
			[P(2)],
			...childRows(2, 1, 10),
			[P(3)],
			...childRows(3, 1, 17),
			[P(4)],
			...childRows(4, 1, 18),
			[P(5)],
			...childRows(5, 1, 157),
			[P(6)],
		],
		megaStones: [
			...parentRows(1, 46),
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 7, 4),
			[P(2)],
			...childRows(2, 1, 100),
		],
		extraCredit: [
			[P(1)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
