import {
  defineLayoutsMany,
} from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["letsgopikachu", "letsgoeevee"];

	const P = (parentId) => [parentId];          			// parent-only task
	const C = (parentId, childId) => [parentId, childId]; 	// parent + child task

	const DESKTOP_LAYOUT = {
		"catching": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4)],
		],
		"mega-stones": [
			[P(1), P(2), P(3), P(4), P(5)],
			[P(6), P(7), P(8), P(9), P(10)],
			[P(11), P(12), P(13), P(14), P(15)],
		],
		"fashion": [
			[P(1), P(2), P(3), P(4), P(5)],
			[P(6), P(7), P(8), P(9), P(10)],
		],
		"thms": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4), C(1, 5)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3), C(2, 4), C(2, 5)],
			[C(2, 6), C(2, 7), C(2, 8), C(2, 9), C(2, 10)],
			[C(2, 11), C(2, 12), C(2, 13), C(2, 14), C(2, 15)],
			[C(2, 16), C(2, 17), C(2, 18), C(2, 19), C(2, 20)],
			[C(2, 21), C(2, 22), C(2, 23), C(2, 24), C(2, 25)],
			[C(2, 26), C(2, 27), C(2, 28), C(2, 29), C(2, 30)],
			[C(2, 31), C(2, 32), C(2, 33), C(2, 34), C(2, 35)],
			[C(2, 36), C(2, 37), C(2, 38), C(2, 39), C(2, 40)],
			[C(2, 41), C(2, 42), C(2, 43), C(2, 44), C(2, 45)],
			[C(2, 46), C(2, 47), C(2, 48), C(2, 49), C(2, 50)],
			[C(2, 51), C(2, 52), C(2, 53), C(2, 54), C(2, 55)],
			[C(2, 56), C(2, 57), C(2, 58), C(2, 59), C(2, 60)],
		],
	};

	const DESTOP_LAYOUT_GAME1 = {
		...DESKTOP_LAYOUT,
	};

	const DESTOP_LAYOUT_GAME2 = {
		...DESKTOP_LAYOUT,
		"fashion": [
			[P(1), P(2), P(3), P(4), P(5)],
			[P(6), P(7), P(8), P(9), P(10)],
			[P(11), P(12), P(13), P(14), P(15)],
			[P(16), P(17)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;
	const COMPACT_LAYOUT_GAME1 = COMPACT_LAYOUT;
	const COMPACT_LAYOUT_GAME2 = COMPACT_LAYOUT;

	defineLayoutsMany(GAME_KEYS[0], DESTOP_LAYOUT_GAME1, COMPACT_LAYOUT_GAME1);
	defineLayoutsMany(GAME_KEYS[1], DESTOP_LAYOUT_GAME2, COMPACT_LAYOUT_GAME2);
})();