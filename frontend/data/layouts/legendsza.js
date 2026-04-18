import { defineLayoutsMany, P, C, parentRows, childRows, spacer } from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["legendsza"];

	const DESKTOP_LAYOUT = {
		catching: [
			[P(1)],
			...childRows(1, 1, 3),
			[P(2)],
			...childRows(2, 1, 9),
			[P(3)],
			...childRows(3, 1, 4),
		],
		story: [
			[P(1)],
			...childRows(1, 1, 38, 7),
			[P(2)],
			...childRows(2, 1, 4),
		],
		sideQuests: [
			...parentRows(1, 119, 7),
		],
		mabelsResearch: [
			...parentRows(1, 49),
		],
		activities: [
			[P(1)]
		],
		battle: [
			[P(1)],
			...childRows(1, 1, 12, 4),
		],
		upgrades: [
			[P(1)],
			...childRows(1, 1, 5),
		],
		collectables: [
			[P(1), P(2)],
		],
		megaStones: [
			...parentRows(1, 62, 7),
		],
		thms: [
			...parentRows(1, 107, 5),
		],
		extraCredit: [
			[P(1)],
			...childRows(1, 1, 7, 7),
			[P(2)],
			[P(3)],
			...childRows(3, 1, 35),
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;

	defineLayoutsMany(GAME_KEYS, DESKTOP_LAYOUT, COMPACT_LAYOUT);
})();
