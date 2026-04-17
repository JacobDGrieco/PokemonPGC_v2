import {
	defineLayoutsMany,
} from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["sword", "shield"];

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
			[C(1, 1), C(1, 2), C(1, 3)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3)],
			[P(3)],
			[C(3, 1), C(3, 2), C(3, 3), C(3, 4), C(3, 5)],
			[C(3, 6), C(3, 7), C(3, 8), C(3, 9)],
		],
		"story": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3), C(1, 4), C(1, 5)],
			[C(1, 6), C(1, 7), C(1, 8), C(1, 9), C(1, 10)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3), C(2, 4), C(2, 5)],
		],
		"battle": [
			[P(1), P(2), P(3)],
		],
		"upgrades": [
			[P(1), P(2)],
		],
		"collectables": [
			[P(1)],
			...childRows(1, 1, 7, 4),
			[P(2)],
			...childRows(2, 1, 16, 5),
			[P(3)],
			...childRows(3, 1, 17, 5),
			[P(4)],
			...childRows(4, 1, 17, 5),
			[P(5)],
			...childRows(5, 1, 6, 3),
		],
		"trainer-cards": [
			[P(1)],
			...childRows(1, 1, 53, 5),
			[P(2)],
			...childRows(2, 1, 20, 5),
			[P(3)],
			...childRows(3, 1, 18, 5),
			[P(4)],
			...childRows(4, 1, 8, 4),
		],
		"thms": [
			[P(1), P(2), P(3), P(4), P(5)],
			[P(6), P(7), P(8), P(9), P(10)],
			[P(11), P(12), P(13), P(14), P(15)],
			[P(16), P(17), P(18), P(19), P(20)],
			[P(21), P(22), P(23), P(24), P(25)],
			[P(26), P(27), P(28), P(29), P(30)],
			[P(31), P(32), P(33), P(34), P(35)],
			[P(36), P(37), P(38), P(39), P(40)],
			[P(41), P(42), P(43), P(44), P(45)],
			[P(46), P(47), P(48), P(49), P(50)],
			[P(51), P(52), P(53), P(54), P(55)],
			[P(56), P(57), P(58), P(59), P(60)],
		],
		"trs": [
			[P(1), P(2), P(3), P(4), P(5)],
			[P(6), P(7), P(8), P(9), P(10)],
			[P(11), P(12), P(13), P(14), P(15)],
			[P(16), P(17), P(18), P(19), P(20)],
			[P(21), P(22), P(23), P(24), P(25)],
			[P(26), P(27), P(28), P(29), P(30)],
			[P(31), P(32), P(33), P(34), P(35)],
			[P(36), P(37), P(38), P(39), P(40)],
			[P(41), P(42), P(43), P(44), P(45)],
			[P(46), P(47), P(48), P(49), P(50)],
			[P(51), P(52), P(53), P(54), P(55)],
			[P(56), P(57), P(58), P(59), P(60)],
			[P(61), P(62), P(63), P(64), P(65)],
			[P(66), P(67), P(68), P(69), P(70)],
			[P(71), P(72), P(73), P(74), P(75)],
			[P(76), P(77), P(78), P(79), P(80)],
			[P(81), P(82), P(83), P(84), P(85)],
			[P(86), P(87), P(88), P(89), P(90)],
			[P(91), P(92), P(93), P(94), P(95)],
			[P(96), P(97), P(98), P(99), P(100)],
		],
		"extra-credit": [
			[P(1)],
			[C(1, 1), C(1, 2), C(1, 3)],
			[P(2)],
			[C(2, 1), C(2, 2), C(2, 3)],
		],
	};

	const DESTOP_LAYOUT_GAME1 = {
		...DESKTOP_LAYOUT,
	};

	const DESTOP_LAYOUT_GAME2 = {
		...DESKTOP_LAYOUT,
	};

	const COMPACT_LAYOUT = DESKTOP_LAYOUT;
	const COMPACT_LAYOUT_GAME1 = COMPACT_LAYOUT;
	const COMPACT_LAYOUT_GAME2 = COMPACT_LAYOUT;

	defineLayoutsMany(GAME_KEYS[0], DESTOP_LAYOUT_GAME1, COMPACT_LAYOUT_GAME1);
	defineLayoutsMany(GAME_KEYS[1], DESTOP_LAYOUT_GAME2, COMPACT_LAYOUT_GAME2);
})();
