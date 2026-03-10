(() => {
	const gen = 5;
	const GAME_KEYS = ["black", "white"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "activites", title: "Activities" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "thms", title: "TMs/HMs" },
		{ id: "distributions", title: "Distributions" },
		{ id: "extra-credit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch/Trade for Reshiram", img: ({ gameKey }) => baseSprite(gameKey, 643) },
					{ id: 2, text: "Catch/Trade for Zekrom", img: ({ gameKey }) => baseSprite(gameKey, 644) },
					{ id: 3, text: "Catch Kyurem", img: ({ gameKey }) => baseSprite(gameKey, 646) },
				],
			},
		],
		"thms": [
			{
				id: 1, text: "Collect all HMs", children: [
					{ id: 1, text: "HM01: Cut", img: () => hm("normal") },
					{ id: 2, text: "HM02: Fly", img: () => hm("flying") },
					{ id: 3, text: "HM03: Surf", img: () => hm("water") },
					{ id: 4, text: "HM04: Strength", img: () => hm("normal") },
					{ id: 5, text: "HM05: Waterfall", img: () => hm("water") },
					{ id: 6, text: "HM06: Dive", img: () => hm("water") },
				],
			},
			{
				id: 2, text: "Collect all HMs", children: [
					{ id: 1, text: "TM 01 - Hone Claws", img: () => tm("dark") },
					{ id: 2, text: "TM 02 - Dragon Claw", img: () => tm("dragon") },
					{ id: 3, text: "TM 03 - Psyshock", img: () => tm("psychic") },
					{ id: 4, text: "TM 04 - Calm Mind", img: () => tm("psychic") },
					{ id: 5, text: "TM 05 - Roar", img: () => tm("normal") },
					{ id: 6, text: "TM 06 - Toxic", img: () => tm("poison") },
					{ id: 7, text: "TM 07 - Hail", img: () => tm("ice") },
					{ id: 8, text: "TM 08 - Bulk Up", img: () => tm("fighting") },
					{ id: 9, text: "TM 09 - Venoshock", img: () => tm("poison") },
					{ id: 10, text: "TM 10 - Hidden Power", img: () => tm("normal") },
					{ id: 11, text: "TM 11 - Sunny Day", img: () => tm("fire") },
					{ id: 12, text: "TM 12 - Taunt", img: () => tm("dark") },
					{ id: 13, text: "TM 13 - Ice Beam", img: () => tm("ice") },
					{ id: 14, text: "TM 14 - Blizzard", img: () => tm("ice") },
					{ id: 15, text: "TM 15 - Hyper Beam", img: () => tm("normal") },
					{ id: 16, text: "TM 16 - Light Screen", img: () => tm("psychic") },
					{ id: 17, text: "TM 17 - Protect", img: () => tm("normal") },
					{ id: 18, text: "TM 18 - Rain Dance", img: () => tm("water") },
					{ id: 19, text: "TM 19 - Telekinesis", img: () => tm("psychic") },
					{ id: 20, text: "TM 20 - Safeguard", img: () => tm("normal") },
					{ id: 21, text: "TM 21 - Frustration", img: () => tm("normal") },
					{ id: 22, text: "TM 22 - Solar Beam", img: () => tm("grass") },
					{ id: 23, text: "TM 23 - Smack Down", img: () => tm("rock") },
					{ id: 24, text: "TM 24 - Thunderbolt", img: () => tm("electric") },
					{ id: 25, text: "TM 25 - Thunder", img: () => tm("electric") },
					{ id: 26, text: "TM 26 - Earthquake", img: () => tm("ground") },
					{ id: 27, text: "TM 27 - Return", img: () => tm("normal") },
					{ id: 28, text: "TM 28 - Dig", img: () => tm("ground") },
					{ id: 29, text: "TM 29 - Psychic", img: () => tm("psychic") },
					{ id: 30, text: "TM 30 - Shadow Ball", img: () => tm("ghost") },
					{ id: 31, text: "TM 31 - Brick Break", img: () => tm("fighting") },
					{ id: 32, text: "TM 32 - Double Team", img: () => tm("normal") },
					{ id: 33, text: "TM 33 - Reflect", img: () => tm("psychic") },
					{ id: 34, text: "TM 34 - Sludge Wave", img: () => tm("poison") },
					{ id: 35, text: "TM 35 - Flamethrower", img: () => tm("fire") },
					{ id: 36, text: "TM 36 - Sludge Bomb", img: () => tm("poison") },
					{ id: 37, text: "TM 37 - Sandstorm", img: () => tm("rock") },
					{ id: 38, text: "TM 38 - Fire Blast", img: () => tm("fire") },
					{ id: 39, text: "TM 39 - Rock Blast", img: () => tm("rock") },
					{ id: 40, text: "TM 40 - Aerial Ace", img: () => tm("flying") },
					{ id: 41, text: "TM 41 - Torment", img: () => tm("dark") },
					{ id: 42, text: "TM 42 - Facade", img: () => tm("normal") },
					{ id: 43, text: "TM 43 - Flame Charge", img: () => tm("fire") },
					{ id: 44, text: "TM 44 - Rest", img: () => tm("psychic") },
					{ id: 45, text: "TM 45 - Attract", img: () => tm("normal") },
					{ id: 46, text: "TM 46 - Thief", img: () => tm("dark") },
					{ id: 47, text: "TM 47 - Low Sweep", img: () => tm("fighting") },
					{ id: 48, text: "TM 48 - Round", img: () => tm("normal") },
					{ id: 49, text: "TM 49 - Echoed Voice", img: () => tm("normal") },
					{ id: 50, text: "TM 50 - Overheat", img: () => tm("fire") },
					{ id: 51, text: "TM 51 - Ally Switch", img: () => tm("psychic") },
					{ id: 52, text: "TM 52 - Focus Blast", img: () => tm("fighting") },
					{ id: 53, text: "TM 53 - Energy Ball", img: () => tm("grass") },
					{ id: 54, text: "TM 54 - False Swipe", img: () => tm("normal") },
					{ id: 55, text: "TM 55 - Scald", img: () => tm("water") },
					{ id: 56, text: "TM 56 - Fling", img: () => tm("dark") },
					{ id: 57, text: "TM 57 - Charge Beam", img: () => tm("electric") },
					{ id: 58, text: "TM 58 - Sky Drop", img: () => tm("flying") },
					{ id: 59, text: "TM 59 - Incinerate", img: () => tm("fire") },
					{ id: 60, text: "TM 60 - Quash", img: () => tm("dark") },
					{ id: 61, text: "TM 61 - Will-O-Wisp", img: () => tm("fire") },
					{ id: 62, text: "TM 62 - Acrobatics", img: () => tm("flying") },
					{ id: 63, text: "TM 63 - Embargo", img: () => tm("dark") },
					{ id: 64, text: "TM 64 - Explosion", img: () => tm("normal") },
					{ id: 65, text: "TM 65 - Shadow Claw", img: () => tm("ghost") },
					{ id: 66, text: "TM 66 - Payback", img: () => tm("dark") },
					{ id: 67, text: "TM 67 - Retaliate", img: () => tm("normal") },
					{ id: 68, text: "TM 68 - Giga Impact", img: () => tm("normal") },
					{ id: 69, text: "TM 69 - Rock Polish", img: () => tm("rock") },
					{ id: 70, text: "TM 70 - Flash", img: () => tm("normal") },
					{ id: 71, text: "TM 71 - Stone Edge", img: () => tm("rock") },
					{ id: 72, text: "TM 72 - Volt Switch", img: () => tm("electric") },
					{ id: 73, text: "TM 73 - Thunder Wave", img: () => tm("electric") },
					{ id: 74, text: "TM 74 - Gyro Ball", img: () => tm("steel") },
					{ id: 75, text: "TM 75 - Swords Dance", img: () => tm("normal") },
					{ id: 76, text: "TM 76 - Struggle Bug", img: () => tm("bug") },
					{ id: 77, text: "TM 77 - Psych Up", img: () => tm("normal") },
					{ id: 78, text: "TM 78 - Bulldoze", img: () => tm("ground") },
					{ id: 79, text: "TM 79 - Frost Breath", img: () => tm("ice") },
					{ id: 80, text: "TM 80 - Rock Slide", img: () => tm("rock") },
					{ id: 81, text: "TM 81 - X-Scissor", img: () => tm("bug") },
					{ id: 82, text: "TM 82 - Dragon Tail", img: () => tm("dragon") },
					{ id: 83, text: "TM 83 - Work Up", img: () => tm("normal") },
					{ id: 84, text: "TM 84 - Poison Jab", img: () => tm("poison") },
					{ id: 85, text: "TM 85 - Dream Eater", img: () => tm("psychic") },
					{ id: 86, text: "TM 86 - Grass Knot", img: () => tm("grass") },
					{ id: 87, text: "TM 87 - Swagger", img: () => tm("normal") },
					{ id: 88, text: "TM 88 - Pluck", img: () => tm("flying") },
					{ id: 89, text: "TM 89 - U-turn", img: () => tm("bug") },
					{ id: 90, text: "TM 90 - Substitute", img: () => tm("normal") },
					{ id: 91, text: "TM 91 - Flash Cannon", img: () => tm("steel") },
					{ id: 92, text: "TM 92 - Trick Room", img: () => tm("psychic") },
					{ id: 93, text: "TM 93 - Wild Charge", img: () => tm("electric") },
					{ id: 94, text: "TM 94 - Rock Smash", img: () => tm("fighting") },
					{ id: 95, text: "TM 95 - Snarl", img: () => tm("dark") },
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

	window.defineTasksMany(GAME_KEYS[0], SECTIONS, TASKS_BY_SECTION_GAME1);
	window.defineTasksMany(GAME_KEYS[1], SECTIONS, TASKS_BY_SECTION_GAME2);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();