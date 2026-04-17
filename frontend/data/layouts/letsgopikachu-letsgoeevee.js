import {
  defineLayoutsMany,
} from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["letsgopikachu", "letsgoeevee"];

	const P = (parentId) => [parentId];          			// parent-only task
	const C = (parentId, childId) => [parentId, childId]; 	// parent + child task
	const childRows = (parentId, start, end, rowSize = 5) => {
		const rows = [];
		for (let childId = start; childId <= end; childId += rowSize) {
			rows.push(
				Array.from(
					{ length: Math.min(rowSize, end - childId + 1) },
					(_, offset) => C(parentId, childId + offset),
				),
			);
		}
		return rows;
	};

	const DESKTOP_LAYOUT = {
		"catching": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3)],
			[P(3)],
			[C(3, 1), C(3, 2), C(3, 3), C(3, 4), C(3, 5)],
			[C(3, 6), C(3, 7), C(3, 8), C(3, 9), C(3, 10)],
			[P(4)],
			[C(4, 1), C(4, 2), C(4, 3), C(4, 4)],
			[C(4, 5), C(4, 6), C(4, 7), C(4, 8)],
		],
		"story": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4), C(1, 5)],
			[C(1, 6), C(1, 7), C(1, 8), C(1, 9)],
		],
		"battle": [
			[P(1), P(2)],
			[P(3)],
			[C(3, 1), C(3, 2), C(3, 3), C(3, 4)],
			[C(3, 5), C(3, 6), C(3, 7), C(3, 8)],
		],
		"trainers": [
			[P(1)],
			...childRows(1, 1, 153, 6),
		],
		"upgrades": [
			[P(1)],
		],
		"collectables": [
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3), C(2, 4)],
			[C(2, 5), C(2, 6), C(2, 7), C(2, 8)],
		],
		"mega-stones": [
			[P(1), P(2), P(3), P(4), P(5)],
			[P(6), P(7), P(8), P(9), P(10)],
			[P(11), P(12), P(13), P(14), P(15)],
		],
		"fashion": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4), C(1, 5)],
			[C(1, 6), C(1, 7), C(1, 8), C(1, 9), C(1, 10)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3), C(2, 4)],
			[C(2, 5), C(2, 6), C(2, 7), C(2, 8)],
			[C(2, 9), C(2, 10), C(2, 11), C(2, 12)],
			[C(2, 13), C(2, 14), C(2, 15), C(2, 16)],
			[P(3)],
			[C(3, 1), C(3, 2), C(3, 3), C(3, 4)],
			[C(3, 5), C(3, 6), C(3, 7), C(3, 8)],
			[P(4)],
			[C(4, 1), C(4, 2), C(4, 3), C(4, 4)],
			[C(4, 5), C(4, 6), C(4, 7), C(4, 8)],
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
		"extra-credit": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3)],
		],
	};

	const DESTOP_LAYOUT_GAME1 = {
		...DESKTOP_LAYOUT,
	};

	const DESTOP_LAYOUT_GAME2 = {
		...DESKTOP_LAYOUT,
		"fashion": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4), C(1, 5)],
			[C(1, 6), C(1, 7), C(1, 8), C(1, 9), C(1, 10)],
			[C(1, 11), C(1, 12), C(1, 13), C(1, 14), C(1, 15)],
			[C(1, 16), C(1, 17)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3), C(2, 4)],
			[C(2, 5), C(2, 6), C(2, 7), C(2, 8)],
			[C(2, 9), C(2, 10), C(2, 11), C(2, 12)],
			[C(2, 13), C(2, 14), C(2, 15), C(2, 16)],
			[P(3)],
			[C(3, 1), C(3, 2), C(3, 3), C(3, 4)],
			[C(3, 5), C(3, 6), C(3, 7), C(3, 8)],
			[P(4)],
			[C(4, 1), C(4, 2), C(4, 3), C(4, 4)],
			[C(4, 5), C(4, 6), C(4, 7), C(4, 8)],
		],
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;
	const COMPACT_LAYOUT_GAME1 = COMPACT_LAYOUT;
	const COMPACT_LAYOUT_GAME2 = {
		...COMPACT_LAYOUT,
		"fashion": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4), C(1, 5)],
			[C(1, 6), C(1, 7), C(1, 8), C(1, 9), C(1, 10)],
			[C(1, 11), C(1, 12), C(1, 13), C(1, 14), C(1, 15)],
			[C(1, 16), C(1, 17)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3), C(2, 4)],
			[C(2, 5), C(2, 6), C(2, 7), C(2, 8)],
			[C(2, 9), C(2, 10), C(2, 11), C(2, 12)],
			[C(2, 13), C(2, 14), C(2, 15), C(2, 16)],
			[P(3)],
			[C(3, 1), C(3, 2), C(3, 3), C(3, 4)],
			[C(3, 5), C(3, 6), C(3, 7), C(3, 8)],
			[P(4)],
			[C(4, 1), C(4, 2), C(4, 3), C(4, 4)],
			[C(4, 5), C(4, 6), C(4, 7), C(4, 8)],
		],
	};

	defineLayoutsMany(GAME_KEYS[0], DESTOP_LAYOUT_GAME1, COMPACT_LAYOUT_GAME1);
	defineLayoutsMany(GAME_KEYS[1], DESTOP_LAYOUT_GAME2, COMPACT_LAYOUT_GAME2);
})();
