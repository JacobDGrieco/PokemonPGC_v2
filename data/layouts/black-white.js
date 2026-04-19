import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["black", "white"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 9),
			[P(2)],
			...childRows(2, 1, 5),
			[P(3)],
			...childRows(3, 1, 4),
			[P(4)],
			...childRows(4, 1, 5, 3),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9),
		],
		activites: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 6),
			[P(3)],
			...childRows(3, 1, 4),
		],
		battle: [
			...parentRows(1, 4),
			[P(5)],
			...childRows(5, 1, 6, 3),
			[P(6)],
			...childRows(6, 1, 6, 6),
			[P(7), P(8)],
		],
		upgrades: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 5, 3),
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 4),
			[P(2)],
			...childRows(2, 1, 16, 4),
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
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
