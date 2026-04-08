import {
  _keyItem,
  _tm,
  _location,
  _npc,
  _task,
  _frontSprite,
  defineTasksMany,
} from '../helpers/index.js';

(() => {
	const gen = 9;
	const GAME_KEYS = ["scarlettm", "violettm"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "side-quests", title: "Side Quests" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "fashion", title: "Fashion" },
		{ id: "thms", title: "TMs" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch Okidogi", img: ({ gameKey }) => baseSprite(gameKey, 1014) },
					{ id: 2, text: "Catch Munkidori", img: ({ gameKey }) => baseSprite(gameKey, 1015) },
					{ id: 3, text: "Catch Fezandipiti", img: ({ gameKey }) => baseSprite(gameKey, 1016) },
					{ id: 4, text: "Catch Ogerpon", img: ({ gameKey }) => baseSprite(gameKey, 1017) },
				],
			},
		],
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
	};

	defineTasksMany(GAME_KEYS[0], SECTIONS, TASKS_BY_SECTION_GAME1);
	defineTasksMany(GAME_KEYS[1], SECTIONS, TASKS_BY_SECTION_GAME2);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();