import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["scarletid", "violetid"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			[C(1, 1)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();