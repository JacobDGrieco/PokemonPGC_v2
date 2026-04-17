import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["home"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();