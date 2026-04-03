(() => {
	const gen = 7;
	const GAME_KEYS = ["sun", "moon"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const megaStone = (name) => _megaStone(gen, name);
	const zCrystal = (name) => _zCrystal(name);
	const typing = (type) => _typing(type);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "side-quests", title: "Side Quests" },
		{ id: "activites", title: "Activities" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "mega-stones", title: "Mega Stones" },
		{ id: "zcrystals", title: "Z-Crystals" },
		{ id: "fashion", title: "Fashion" },
		{ id: "thms", title: "TMs/RPs" },
		{ id: "distributions", title: "Distributions" },
		{ id: "extra-credit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch/Trade for Solgaleo", img: ({ gameKey }) => baseSprite(gameKey, 791) },
					{ id: 2, text: "Catch/Trade for Lunala", img: ({ gameKey }) => baseSprite(gameKey, 792) },
					{ id: 3, text: "Catch Necrozma", img: ({ gameKey }) => baseSprite(gameKey, 800) },
				],
			},
		],
		"mega-stones": [
			{ id: 1, text: "Venusaurite", img: ({ gameKey }) => [baseSprite(gameKey, "003-m"), megaStone("venusaurite")], },
			{ id: 2, text: "Charizardite X", img: ({ gameKey }) => [baseSprite(gameKey, "006-mx"), megaStone("charizardite-x")], },
			{ id: 3, text: "Charizardite Y", img: ({ gameKey }) => [baseSprite(gameKey, "006-my"), megaStone("charizardite-y")], },
			{ id: 4, text: "Blastoisinite", img: ({ gameKey }) => [baseSprite(gameKey, "009-m"), megaStone("blastoisinite")], },
			{ id: 5, text: "Alakazite", img: ({ gameKey }) => [baseSprite(gameKey, "065-m"), megaStone("alakazite")], },
			{ id: 6, text: "Slowbronite", img: ({ gameKey }) => [baseSprite(gameKey, "080-m"), megaStone("slowbronite")], },
			{ id: 7, text: "Gengarite", img: ({ gameKey }) => [baseSprite(gameKey, "094-m"), megaStone("gengarite")], },
			{ id: 8, text: "Kangaskhanite", img: ({ gameKey }) => [baseSprite(gameKey, "115-m"), megaStone("kangaskhanite")], },
			{ id: 9, text: "Pinsirite", img: ({ gameKey }) => [baseSprite(gameKey, "127-m"), megaStone("pinsirite")], },
			{ id: 10, text: "Gyaradosite", img: ({ gameKey }) => [baseSprite(gameKey, "130-m"), megaStone("gyaradosite")], },
			{ id: 11, text: "Aerodactylite", img: ({ gameKey }) => [baseSprite(gameKey, "142-m"), megaStone("aerodactylite")], },
			{ id: 12, text: "Scizorite", img: ({ gameKey }) => [baseSprite(gameKey, "212-m"), megaStone("scizorite")], },
			{ id: 13, text: "Sablenite", img: ({ gameKey }) => [baseSprite(gameKey, "302-m"), megaStone("sablenite")], },
			{ id: 14, text: "Sharpedonite", img: ({ gameKey }) => [baseSprite(gameKey, "319-m"), megaStone("sharpedonite")], },
			{ id: 15, text: "Absolite", img: ({ gameKey }) => [baseSprite(gameKey, "359-m"), megaStone("absolite")], },
			{ id: 16, text: "Glalitite", img: ({ gameKey }) => [baseSprite(gameKey, "362-m"), megaStone("glalitite")], },
			{ id: 17, text: "Salamenceite", img: ({ gameKey }) => [baseSprite(gameKey, "373-m"), megaStone("salamencite")], },
			{ id: 18, text: "Metagrossite", img: ({ gameKey }) => [baseSprite(gameKey, "376-m"), megaStone("metagrossite")], },
			{ id: 19, text: "Garchompite", img: ({ gameKey }) => [baseSprite(gameKey, "445-m"), megaStone("garchompite")], },
			{ id: 20, text: "Lucarionite", img: ({ gameKey }) => [baseSprite(gameKey, "448-m"), megaStone("lucarionite")], },
		],
		"zcrystals": [
			{
				id: 1, text: "Collect all Typing Z-Crystals", children: [
					{ id: 1, text: "Buginium Z", img: () => [typing("bug"), zCrystal("buginiumz")], },
					{ id: 2, text: "Darkinium Z", img: () => [typing("dark"), zCrystal("darkiniumz")], },
					{ id: 3, text: "Dragonium Z", img: () => [typing("dragon"), zCrystal("dragoniumz")], },
					{ id: 4, text: "Electrium Z", img: () => [typing("electric"), zCrystal("electriumz")], },
					{ id: 5, text: "Fairium Z", img: () => [typing("fairy"), zCrystal("fairiumz")], },
					{ id: 6, text: "Fightinium Z", img: () => [typing("fighting"), zCrystal("fightiniumz")], },
					{ id: 7, text: "Firium Z", img: () => [typing("fire"), zCrystal("firiumz")], },
					{ id: 8, text: "Flyinium Z", img: () => [typing("flying"), zCrystal("flyiniumz")], },
					{ id: 9, text: "Ghostium Z", img: () => [typing("ghost"), zCrystal("ghostiumz")], },
					{ id: 10, text: "Grassium Z", img: () => [typing("grass"), zCrystal("grassiumz")], },
					{ id: 11, text: "Groundium Z", img: () => [typing("ground"), zCrystal("groundiumz")], },
					{ id: 12, text: "Icium Z", img: () => [typing("ice"), zCrystal("iciumz")], },
					{ id: 13, text: "Normalium Z", img: () => [typing("normal"), zCrystal("normaliumz")], },
					{ id: 14, text: "Poisonium Z", img: () => [typing("posion"), zCrystal("poisoniumz")], },
					{ id: 15, text: "Psychium Z", img: () => [typing("psychic"), zCrystal("psychiumz")], },
					{ id: 16, text: "Rockium Z", img: () => [typing("rock"), zCrystal("rockiumz")], },
					{ id: 17, text: "Steelium Z", img: () => [typing("steel"), zCrystal("steeliumz")], },
					{ id: 18, text: "Waterium Z", img: () => [typing("water"), zCrystal("wateriumz")], }
				]
			},
			{
				id: 2, text: "Collect all Specific Z-Crystals", children: [
					{ id: 1, text: "Aloraichium Z", img: ({ gameKey }) => [baseSprite(gameKey, 26), zCrystal("aloraichiumz")], },
					{ id: 2, text: "Decidium Z", img: ({ gameKey }) => [baseSprite(gameKey, 724), zCrystal("decidiumz")], },
					{ id: 3, text: "Eevium Z", img: ({ gameKey }) => [baseSprite(gameKey, 133), zCrystal("eeviumz")], },
					{ id: 4, text: "Incinium Z", img: ({ gameKey }) => [baseSprite(gameKey, 727), zCrystal("inciniumz")], },
					{ id: 5, text: "Pikanium Z", img: ({ gameKey }) => [baseSprite(gameKey, 25), zCrystal("pikaniumz")], },
					{ id: 6, text: "Primarium Z", img: ({ gameKey }) => [baseSprite(gameKey, 730), zCrystal("primariumz")], },
					{ id: 7, text: "Tapunium Z", img: ({ gameKey }) => [baseSprite(gameKey, 785), zCrystal("tapuniumz")], },
				]
			},
		],
		"thms": [
			{
				id: 1, text: "Collect all HMs", children: [
					{ id: 1, text: "Tauros Charge", img: () => hm("tauros-charge") },
					{ id: 2, text: "Stoutland Search", img: () => hm("stoutland-search") },
					{ id: 3, text: "Lapras Dive", img: () => hm("lapras-dive") },
					{ id: 4, text: "Charizard Glide", img: () => hm("charizard-glide") },
					{ id: 5, text: "Mudsdale Gallop", img: () => hm("mudsdale-gallop") },
					{ id: 6, text: "Sharpedo Jet", img: () => hm("sharpedo-jet") },
					{ id: 7, text: "Machamp Shove", img: () => hm("machamp-shove") },
				],
			},
			{
				id: 2, text: "Collect all HMs", children: [
					{ id: 1, text: "TM 01 - Work Up", img: () => tm("normal") },
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
					{ id: 28, text: "TM 28 - Leech Life", img: () => tm("bug") },
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
					{ id: 59, text: "TM 59 - Brutal Swing", img: () => tm("dark") },
					{ id: 60, text: "TM 60 - Quash", img: () => tm("dark") },
					{ id: 61, text: "TM 61 - Will-O-Wisp", img: () => tm("fire") },
					{ id: 62, text: "TM 62 - Acrobatics", img: () => tm("flying") },
					{ id: 63, text: "TM 63 - Embargo", img: () => tm("dark") },
					{ id: 64, text: "TM 64 - Explosion", img: () => tm("normal") },
					{ id: 65, text: "TM 65 - Shadow Claw", img: () => tm("ghost") },
					{ id: 66, text: "TM 66 - Payback", img: () => tm("dark") },
					{ id: 67, text: "TM 67 - Smart Strike", img: () => tm("steel") },
					{ id: 68, text: "TM 68 - Giga Impact", img: () => tm("normal") },
					{ id: 69, text: "TM 69 - Rock Polish", img: () => tm("rock") },
					{ id: 70, text: "TM 70 - Aurora Veil", img: () => tm("ice") },
					{ id: 71, text: "TM 71 - Stone Edge", img: () => tm("rock") },
					{ id: 72, text: "TM 72 - Volt Switch", img: () => tm("electric") },
					{ id: 73, text: "TM 73 - Thunder Wave", img: () => tm("electric") },
					{ id: 74, text: "TM 74 - Gyro Ball", img: () => tm("steel") },
					{ id: 75, text: "TM 75 - Swords Dance", img: () => tm("normal") },
					{ id: 76, text: "TM 76 - Fly", img: () => tm("flying") },
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
					{ id: 94, text: "TM 94 - Surf", img: () => tm("water") },
					{ id: 95, text: "TM 95 - Snarl", img: () => tm("dark") },
					{ id: 96, text: "TM 96 - Natural Power", img: () => tm("normal") },
					{ id: 97, text: "TM 97 - Dark Pulse", img: () => tm("dark") },
					{ id: 98, text: "TM 98 - Waterfall", img: () => tm("water") },
					{ id: 99, text: "TM 99 - Dazzling Gleam", img: () => tm("fairy") },
					{ id: 100, text: "TM 100 - Confide", img: () => tm("normal") }
				],
			},
		],
		"extra-credit": [
			{
				id: 1, text: "Get Mega Stones from Distribution Codes", children: [
					{ id: 1, text: "Beedrillite", img: ({ gameKey }) => [baseSprite(gameKey, "015-m"), megaStone("beedrillite")], },
					{ id: 2, text: "Pidgeotite", img: ({ gameKey }) => [baseSprite(gameKey, "018-m"), megaStone("pidgeotite")], },
					{ id: 3, text: "Mewtwonite X", img: ({ gameKey }) => [baseSprite(gameKey, "150-mx"), megaStone("mewtwonite-x")], },
					{ id: 4, text: "Mewtwonite Y", img: ({ gameKey }) => [baseSprite(gameKey, "150-my"), megaStone("mewtwonite-y")], },
					{ id: 5, text: "Ampharosite", img: ({ gameKey }) => [baseSprite(gameKey, "181-m"), megaStone("ampharosite")], },
					{ id: 6, text: "Steelixite", img: ({ gameKey }) => [baseSprite(gameKey, "208-m"), megaStone("steelixite")], },
					{ id: 7, text: "Heracronite", img: ({ gameKey }) => [baseSprite(gameKey, "214-m"), megaStone("heracronite")], },
					{ id: 8, text: "Houndoominite", img: ({ gameKey }) => [baseSprite(gameKey, "229-m"), megaStone("houndoominite")], },
					{ id: 9, text: "Tyranitarite", img: ({ gameKey }) => [baseSprite(gameKey, "248-m"), megaStone("tyranitarite")], },
					{ id: 10, text: "Sceptilite", img: ({ gameKey }) => [baseSprite(gameKey, "254-m"), megaStone("sceptilite")], },
					{ id: 11, text: "Blazikenite", img: ({ gameKey }) => [baseSprite(gameKey, "257-m"), megaStone("blazikenite")], },
					{ id: 12, text: "Swampertite", img: ({ gameKey }) => [baseSprite(gameKey, "260-m"), megaStone("swampertite")], },
					{ id: 13, text: "Gardevoirite", img: ({ gameKey }) => [baseSprite(gameKey, "282-m"), megaStone("gardevoirite")], },
					{ id: 14, text: "Mawilite", img: ({ gameKey }) => [baseSprite(gameKey, "303-m"), megaStone("mawilite")], },
					{ id: 15, text: "Aggronite", img: ({ gameKey }) => [baseSprite(gameKey, "306-m"), megaStone("aggronite")], },
					{ id: 16, text: "Medichamite", img: ({ gameKey }) => [baseSprite(gameKey, "308-m"), megaStone("medichamite")], },
					{ id: 17, text: "Manectite", img: ({ gameKey }) => [baseSprite(gameKey, "310-m"), megaStone("manectite")], },
					{ id: 18, text: "Cameruptite", img: ({ gameKey }) => [baseSprite(gameKey, "323-m"), megaStone("cameruptite")], },
					{ id: 19, text: "Altarianite", img: ({ gameKey }) => [baseSprite(gameKey, "334-m"), megaStone("altarianite")], },
					{ id: 20, text: "Banettite", img: ({ gameKey }) => [baseSprite(gameKey, "354-m"), megaStone("banettite")], },
					{ id: 21, text: "Latiasite", img: ({ gameKey }) => [baseSprite(gameKey, "380-m"), megaStone("latiasite")] },
					{ id: 22, text: "Latiosite", img: ({ gameKey }) => [baseSprite(gameKey, "381-m"), megaStone("latiosite")] },
					{ id: 23, text: "Lopunnite", img: ({ gameKey }) => [baseSprite(gameKey, "428-m"), megaStone("lopunnite")], },
					{ id: 24, text: "Abomasite", img: ({ gameKey }) => [baseSprite(gameKey, "460-m"), megaStone("abomasite")], },
					{ id: 25, text: "Galladite", img: ({ gameKey }) => [baseSprite(gameKey, "475-m"), megaStone("galladite")], },
					{ id: 26, text: "Audinite", img: ({ gameKey }) => [baseSprite(gameKey, "531-m"), megaStone("audinite")], },
				],
			},
			{
				id: 2, text: "Get Z-Crystals from Distribution Codes", children: [
					{ id: 1, text: "Marshadium Z", img: ({ gameKey }) => [baseSprite(gameKey, 802), zCrystal("marshadiumz")], },
					{ id: 2, text: "Mewnium Z", img: ({ gameKey }) => [baseSprite(gameKey, 151), zCrystal("mewniumz")], },
					{ id: 3, text: "Pikashunium Z", img: ({ gameKey }) => [baseSprite(gameKey, "025-o"), zCrystal("pikashuniumz")], },
					{ id: 4, text: "Snorlium Z", img: ({ gameKey }) => [baseSprite(gameKey, 143), zCrystal("snorliumz")], },
				],
			},
		]
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