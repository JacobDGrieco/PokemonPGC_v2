import { defineLayoutsMany, P, C, parentRows, childRows, } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["legendszamd"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 20),
			[P(2)],
			[C(2, 1)],
		],
		story: [
			[P(1)],
			...childRows(1, 1, 11, 4),
			[P(2)],
			...childRows(2, 1, 3),
		],
		sideQuests: [
			[P(1)],
			...childRows(1, 1, 3),
			[P(2)],
			...childRows(2, 1, 81, 6),
		],
		mabelsResearch: [
			...parentRows(1, 3),
		],
		megaStones: [
			...parentRows(1, 25),
		],
		thms: [
			...parentRows(1, 53),
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();