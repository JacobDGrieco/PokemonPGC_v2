import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["legendsarceus"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3)],
		],
		thms: [
			[P(1), P(2), P(3), P(4), P(5)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();