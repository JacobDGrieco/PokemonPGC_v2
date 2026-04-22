import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["firered", "leafgreen"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 4),
			[P(2)],
			...childRows(2, 1, 5),
			[P(3)],
			...childRows(3, 1, 6, 6),
			[P(4)],
			...childRows(4, 1, 9),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 9),
		],
		battle: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 4),
		],
		upgrades: [
			[P(1)],
			[P(2)],
			...childRows(2, 1, 5, 3),
		],
		collectables: [
			[P(1), P(2)],
			[P(3)],
			...childRows(3, 1, 6, 6),
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
