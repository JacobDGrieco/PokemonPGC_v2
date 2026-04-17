import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["yellow"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 4),
			[P(2)],
			...childRows(2, 1, 5),
			[P(3)],
			...childRows(3, 1, 9),
			[P(4)],
			...childRows(4, 1, 7, 4),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9),
		],
		activities: [
			[P(1)],
		],
		collectables: [
			[P(1)],
			...childRows(1, 1, 13, 7),
			[P(2), P(3)],
		],
		thms: [
			[P(1)],
			...childRows(1, 1, 5),
			[P(2)],
			...childRows(2, 1, 50),
		],
		extraCredit: [
			[P(1)],
			[C(1, 1)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();