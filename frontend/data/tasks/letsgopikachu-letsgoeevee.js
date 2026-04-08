import {
  _hm,
  _keyItem,
  _megaStone,
  _tm,
  _location,
  _npc,
  _task,
  _frontSprite,
  defineTasksMany,
} from '../helpers/index.js';

(() => {
	const gen = 7.5;
	const GAME_KEYS = ["letsgopikachu", "letsgoeevee"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const megaStone = (name) => _megaStone(gen, name);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "mega-stones", title: "Mega Stones" },
		{ id: "fashion", title: "Fashion" },
		{ id: "thms", title: "TMs/STs" },
		{ id: "distributions", title: "Distributions" },
		{ id: "extra-credit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch Articuno", img: ({ gameKey }) => baseSprite(gameKey, 144), },
					{ id: 2, text: "Catch Zapdos", img: ({ gameKey }) => baseSprite(gameKey, 145), },
					{ id: 3, text: "Catch Moltres", img: ({ gameKey }) => baseSprite(gameKey, 146), },
					{ id: 4, text: "Catch Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150), },
				],
			},
		],
		"mega-stones": [
			{ id: 1, text: "Venusaurite", img: ({ gameKey }) => [baseSprite(gameKey, "003-m"), megaStone("venusaurite")], },
			{ id: 2, text: "Charizardite X", img: ({ gameKey }) => [baseSprite(gameKey, "006-mx"), megaStone("charizardite-x")], },
			{ id: 3, text: "Charizardite Y", img: ({ gameKey }) => [baseSprite(gameKey, "006-my"), megaStone("charizardite-y")], },
			{ id: 4, text: "Blastoisinite", img: ({ gameKey }) => [baseSprite(gameKey, "009-m"), megaStone("blastoisinite")], },
			{ id: 5, text: "Beedrillite", img: ({ gameKey }) => [baseSprite(gameKey, "015-m"), megaStone("beedrillite")], },
			{ id: 6, text: "Pidgeotite", img: ({ gameKey }) => [baseSprite(gameKey, "018-m"), megaStone("pidgeotite")], },
			{ id: 7, text: "Alakazite", img: ({ gameKey }) => [baseSprite(gameKey, "065-m"), megaStone("alakazite")], },
			{ id: 8, text: "Slowbronite", img: ({ gameKey }) => [baseSprite(gameKey, "080-m"), megaStone("slowbronite")], },
			{ id: 9, text: "Gengarite", img: ({ gameKey }) => [baseSprite(gameKey, "094-m"), megaStone("gengarite")], },
			{ id: 10, text: "Kangaskhanite", img: ({ gameKey }) => [baseSprite(gameKey, "115-m"), megaStone("kangaskhanite")], },
			{ id: 11, text: "Pinsirite", img: ({ gameKey }) => [baseSprite(gameKey, "127-m"), megaStone("pinsirite")], },
			{ id: 12, text: "Gyaradosite", img: ({ gameKey }) => [baseSprite(gameKey, "130-m"), megaStone("gyaradosite")], },
			{ id: 13, text: "Aerodactylite", img: ({ gameKey }) => [baseSprite(gameKey, "142-m"), megaStone("aerodactylite")], },
			{ id: 14, text: "Mewtwonite X", img: ({ gameKey }) => [baseSprite(gameKey, "150-mx"), megaStone("mewtwonite-x")], },
			{ id: 15, text: "Mewtwonite Y", img: ({ gameKey }) => [baseSprite(gameKey, "150-my"), megaStone("mewtwonite-y")], },
		],
		"thms": [
			{
				id: 1, text: "Collect all HMs", children: [
					{ id: 1, text: "Chop Down", img: () => hm("chop-down") },
					{ id: 2, text: "Light Up", img: () => hm("light-up") },
					{ id: 3, text: "Sea Skim", img: () => hm("sea-skim") },
					{ id: 4, text: "Sky Dash", img: () => hm("sky-dash") },
					{ id: 5, text: "Strong Push", img: () => hm("strong-push") },
				],
			},
			{
				id: 2, text: "Collect all HMs", children: [
					{ id: 1, text: "TM 01 - Headbutt", img: () => tm("normal") },
					{ id: 2, text: "TM 02 - Taunt", img: () => tm("dark") },
					{ id: 3, text: "TM 03 - Helping Hand", img: () => tm("normal") },
					{ id: 4, text: "TM 04 - Teleport", img: () => tm("psychic") },
					{ id: 5, text: "TM 05 - Rest", img: () => tm("psychic") },
					{ id: 6, text: "TM 06 - Light Screen", img: () => tm("psychic") },
					{ id: 7, text: "TM 07 - Protect", img: () => tm("normal") },
					{ id: 8, text: "TM 08 - Substitute", img: () => tm("normal") },
					{ id: 9, text: "TM 09 - Reflect", img: () => tm("psychic") },
					{ id: 10, text: "TM 10 - Dig", img: () => tm("ground") },
					{ id: 11, text: "TM 11 - Will-O-Wisp", img: () => tm("fire") },
					{ id: 12, text: "TM 12 - Facade", img: () => tm("normal") },
					{ id: 13, text: "TM 13 - Brick Break", img: () => tm("fighting") },
					{ id: 14, text: "TM 14 - Fly", img: () => tm("flying") },
					{ id: 15, text: "TM 15 - Seismic Toss", img: () => tm("fighting") },
					{ id: 16, text: "TM 16 - Thunder Wave", img: () => tm("electric") },
					{ id: 17, text: "TM 17 - Dragon Tail", img: () => tm("dragon") },
					{ id: 18, text: "TM 18 - U-turn", img: () => tm("bug") },
					{ id: 19, text: "TM 19 - Iron Tail", img: () => tm("steel") },
					{ id: 20, text: "TM 20 - Dark Pulse", img: () => tm("dark") },
					{ id: 21, text: "TM 21 - Foul Play", img: () => tm("dark") },
					{ id: 22, text: "TM 22 - Rock Slide", img: () => tm("rock") },
					{ id: 23, text: "TM 23 - Thunder Punch", img: () => tm("electric") },
					{ id: 24, text: "TM 24 - X-Scissor", img: () => tm("bug") },
					{ id: 25, text: "TM 25 - Waterfall", img: () => tm("water") },
					{ id: 26, text: "TM 26 - Poison Jab", img: () => tm("poison") },
					{ id: 27, text: "TM 27 - Toxic", img: () => tm("poison") },
					{ id: 28, text: "TM 28 - Tri Attack", img: () => tm("normal") },
					{ id: 29, text: "TM 29 - Scald", img: () => tm("water") },
					{ id: 30, text: "TM 30 - Bulk Up", img: () => tm("fighting") },
					{ id: 31, text: "TM 31 - Fire Punch", img: () => tm("fire") },
					{ id: 32, text: "TM 32 - Dazzling Gleam", img: () => tm("fairy") },
					{ id: 33, text: "TM 33 - Calm Mind", img: () => tm("psychic") },
					{ id: 34, text: "TM 34 - Dragon Pulse", img: () => tm("dragon") },
					{ id: 35, text: "TM 35 - Ice Punch", img: () => tm("ice") },
					{ id: 36, text: "TM 36 - Thunderbolt", img: () => tm("electric") },
					{ id: 37, text: "TM 37 - Flamethrower", img: () => tm("fire") },
					{ id: 38, text: "TM 38 - Thunder", img: () => tm("electric") },
					{ id: 39, text: "TM 39 - Outrage", img: () => tm("dragon") },
					{ id: 40, text: "TM 40 - Psychic", img: () => tm("psychic") },
					{ id: 41, text: "TM 41 - Earthquake", img: () => tm("ground") },
					{ id: 42, text: "TM 42 - Self-Destruct", img: () => tm("normal") },
					{ id: 43, text: "TM 43 - Shadow Ball", img: () => tm("ghost") },
					{ id: 44, text: "TM 44 - Play Rough", img: () => tm("fairy") },
					{ id: 45, text: "TM 45 - Solar Beam", img: () => tm("grass") },
					{ id: 46, text: "TM 46 - Fire Blast", img: () => tm("fire") },
					{ id: 47, text: "TM 47 - Surf", img: () => tm("water") },
					{ id: 48, text: "TM 48 - Hyper Beam", img: () => tm("normal") },
					{ id: 49, text: "TM 49 - Superpower", img: () => tm("fighting") },
					{ id: 50, text: "TM 50 - Roost", img: () => tm("flying") },
					{ id: 51, text: "TM 51 - Blizzard", img: () => tm("ice") },
					{ id: 52, text: "TM 52 - Sludge Bomb", img: () => tm("poison") },
					{ id: 53, text: "TM 53 - Mega Drain", img: () => tm("grass") },
					{ id: 54, text: "TM 54 - Flash Cannon", img: () => tm("steel") },
					{ id: 55, text: "TM 55 - Ice Beam", img: () => tm("ice") },
					{ id: 56, text: "TM 56 - Stealth Rock", img: () => tm("rock") },
					{ id: 57, text: "TM 57 - Pay Day", img: () => tm("normal") },
					{ id: 58, text: "TM 58 - Drill Run", img: () => tm("ground") },
					{ id: 59, text: "TM 59 - Dream Eater", img: () => tm("psychic") },
					{ id: 60, text: "TM 60 - Megahorn", img: () => tm("bug") }
				],
			},
		],
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
		"fashion": [
			{ id: 1, text: "Sportswear Set" },
			{ id: 2, text: "Sailor Set" },
			{ id: 3, text: "Formal Set" },
			{ id: 4, text: "Assistant Set" },
			{ id: 5, text: "Safari Set" },
			{ id: 6, text: "Police Set" },
			{ id: 7, text: "Pikachu Set" },
			{ id: 8, text: "Raichu Set" },
			{ id: 9, text: "Team Rocket Set" },
			{ id: 10, text: "Blast-off Set" },
		]
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
		"fashion": [
			{ id: 1, text: "Sportswear Set" },
			{ id: 2, text: "Sailor Set" },
			{ id: 3, text: "Formal Set" },
			{ id: 4, text: "Assistant Set" },
			{ id: 5, text: "Safari Set" },
			{ id: 6, text: "Police Set" },
			{ id: 7, text: "Eevee Set" },
			{ id: 8, text: "Vaporeon Set" },
			{ id: 9, text: "Jolteon Set" },
			{ id: 10, text: "Flareon Set" },
			{ id: 11, text: "Espeon Set" },
			{ id: 12, text: "Umbreon Set" },
			{ id: 13, text: "Leafeon Set" },
			{ id: 14, text: "Glaceon Set" },
			{ id: 15, text: "Sylveon Set" },
			{ id: 16, text: "Team Rocket Set" },
			{ id: 17, text: "Blast-off Set" },
		]
	};

	defineTasksMany(GAME_KEYS[0], SECTIONS, TASKS_BY_SECTION_GAME1);
	defineTasksMany(GAME_KEYS[1], SECTIONS, TASKS_BY_SECTION_GAME2);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();