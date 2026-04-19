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
	const GAME_KEYS = ["scarletid", "violetid"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "sideQuests", title: "Side Quests" },
		{ id: "activities", title: "Activities" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "fashion", title: "Fashion" },
		{ id: "thms", title: "TMs" },
	];

	const TASKS_BY_SECTION = {
		catching: [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch Terapagos", img: ({ gameKey }) => baseSprite(gameKey, 1024), tooltip: "Normal — Level 68\nObtained during the main story in the Terarium" },
				],
			},
		],
		story: [
			{
				id: 1, text: "Complete the Indigo Disk story", children: [
					{ id: 1, text: "Arrive at Blueberry Academy as an exchange student" },
					{ id: 2, text: "Defeat BB Elite Four Crispin", tooltip: "Fire-type" },
					{ id: 3, text: "Defeat BB Elite Four Amarys", tooltip: "Steel-type" },
					{ id: 4, text: "Defeat BB Elite Four Lacey", tooltip: "Fairy-type" },
					{ id: 5, text: "Defeat BB Elite Four Drayton", tooltip: "Dragon-type" },
					{ id: 6, text: "Face Kieran in the BB League", tooltip: "Kieran challenges you after the Elite Four" },
					{ id: 7, text: "Complete the Area Zero epilogue", tooltip: "Returns to Area Zero — ties together the full Paldea arc" },
				],
			},
		],
		sideQuests: [
			{
				id: 1, text: "Complete all Blueberry Club Room activities", children: [
					{ id: 1, text: "Clear the Easy Course", tooltip: "Battle courses in the Terarium — first-time clears award BP" },
					{ id: 2, text: "Clear the Normal Course" },
					{ id: 3, text: "Clear the Hard Course" },
					{ id: 4, text: "Clear the Super-Hard Course" },
				],
			},
			{
				id: 2, text: "Invite and defeat all Coaches", tooltip: "Invite coaches via the League Club Room computer\nEach coach offers a trade after battling 3 times — you receive a Pokémon with a special ribbon",
			},
		],
		battle: [
			{ id: 1, text: "Win the BB League Championship", tooltip: "Defeat all four BB Elite Four members and Kieran to become BB Champion" },
			{
				id: 2, text: "Rematch all BB Elite Four members", children: [
					{ id: 1, text: "Rematch Crispin (Fire)", tooltip: "Talk to him in the League Club Room until he requests a rematch" },
					{ id: 2, text: "Rematch Amarys (Steel)" },
					{ id: 3, text: "Rematch Lacey (Fairy)" },
					{ id: 4, text: "Rematch Drayton (Dragon)" },
				],
			},
		],
		collectables: [
			{ id: 1, text: "Obtain the Diploma", tooltip: "Blueberry Academy entrance\nReward for completing the Blueberry Pokédex" },
			{
				id: 2, text: "Obtain all Key Items", children: [
					{ id: 1, text: "Mark Charm", img: () => keyItem("mark-charm"), tooltip: "Given by Director Cyrano after completing the Blueberry Pokédex\nIncreases the chance of finding Marked Pokémon in the wild" },
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
