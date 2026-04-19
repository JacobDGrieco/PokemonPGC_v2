import { defineLayoutsMany, P, C, parentRows, childRows } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["legendsarceus"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 14, 5),
			[P(2)],
		],
		story: [
			[P(1)],
			...childRows(1, 1, 6, 3),
			[P(2)],
			...childRows(2, 1, 7, 4),
		],
		requests: [
			[P(1)],
			...childRows(1, 1, 30, 5),
			[P(2)],
			...childRows(2, 1, 30, 5),
			[P(3)],
			...childRows(3, 1, 34, 5),
			[P(4)],
			...childRows(4, 1, 13, 5),
			[P(5)],
			...childRows(5, 1, 15, 5),
		],
		activities: [
			[P(1), P(2), P(3)],
			...childRows(2, 1, 3),
		],
		battle: [
			[P(1), P(2)],
		],
		pathOfSolitude: [
			[P(1)],
		],
		upgrades: [
			[P(1), P(2), P(3)],
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 19, 5),
			[P(2), P(3)],
			...childRows(3, 1, 43, 5),
			[P(4), P(5)],
			...childRows(4, 1, 5, 5),
			...childRows(5, 1, 4, 4),
			[P(6), P(7)],
			...childRows(7, 1, 20, 5),
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 5),
		],
		extraCredit: [
			[P(1), P(2)],
			...childRows(1, 1, 4),
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
