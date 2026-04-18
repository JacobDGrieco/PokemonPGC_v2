import { defineLayoutsMany, P, C, parentRows, childRows, spacer } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["brilliantdiamond", "shiningpearl"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 3),
		],
		fashion: [
			...parentRows(1, 1, 11, 4),
		],
		underground: [
			[P(1)],
			...childRows(1, 1, 223, 6),
			[spacer], [spacer],
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
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();