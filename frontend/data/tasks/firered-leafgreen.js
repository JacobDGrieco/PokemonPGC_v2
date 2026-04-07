(() => {
	const gen = 3;
	const GAME_KEYS = ["firered", "leafgreen"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
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
					{ id: 1, text: "Catch Articuno", img: ({ gameKey }) => baseSprite(gameKey, 144), },
					{ id: 2, text: "Catch Zapdos", img: ({ gameKey }) => baseSprite(gameKey, 145), },
					{ id: 3, text: "Catch Moltres", img: ({ gameKey }) => baseSprite(gameKey, 146), },
					{ id: 4, text: "Catch Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150), },
					{ id: 5, text: "Catch/Trade for Raikou", img: ({ gameKey }) => baseSprite(gameKey, 243), },
					{ id: 6, text: "Catch/Trade for Entei", img: ({ gameKey }) => baseSprite(gameKey, 244), },
					{ id: 7, text: "Catch/Trade for Suicune", img: ({ gameKey }) => baseSprite(gameKey, 245), },
				],
			},
			{
				id: 2, text: "Catch both Snorlax", children: [
					{ id: 1, text: "Route 12", img: ({ gameKey }) => task(gameKey, "snorlax-12") },
					{ id: 2, text: "Route 16", img: ({ gameKey }) => task(gameKey, "snorlax-16") },
				],
			},
			{
				id: 3, text: "Obtain all In-Game Gift Pokémon", children: [
					{
						id: 1, text: "Hitmonlee/Hitmonchan", img: ({ gameKey }) => task(gameKey, "hitmonlee-hitmonchan"), eithers: {
							1: { text: "" }, 2: { text: "" },
						},
					},
					{
						id: 2, text: "Omanyte/Kabuto", img: ({ gameKey }) => task(gameKey, "omanyte-kabuto"), type: "either", options: {
							left: { text: "" }, right: { text: "" },
						},
					},
					{ id: 3, text: "Lapras", img: ({ gameKey }) => baseSprite(gameKey, 131) },
					{ id: 4, text: "Aerodactyl", img: ({ gameKey }) => baseSprite(gameKey, 142) },
					{ id: 5, text: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133) },
					{ id: 6, text: "Togepi", img: ({ gameKey }) => baseSprite(gameKey, 175) },
				],
			},
			{
				id: 4, text: "Complete all In-Game Trades", children: [
					{ id: 1, text: "Abra for Mr. Mime", img: ({ gameKey }) => task(gameKey, "abra-for-mrmime") },
					{ id: 2, text: "Nidoran ♂ for Nidoran ♀", img: ({ gameKey }) => task(gameKey, "nidoranm-for-nidoranf") },
					{ id: 3, text: "Nidorino for Nidorina", img: ({ gameKey }) => task(gameKey, "nidorino-for-nidorina") },
					{ id: 4, text: "Slowbro for Lickitung", img: ({ gameKey }) => task(gameKey, "slowbro-for-lickitung") },
					{ id: 5, text: "Poliwhirl for Jynx", img: ({ gameKey }) => task(gameKey, "poliwhirl-for-jynx") },
					{ id: 6, text: "Spearow for Farfetch'd", img: ({ gameKey }) => task(gameKey, "spearow-for-farfetchd") },
					{ id: 7, text: "Ponyta for Seel", img: ({ gameKey }) => task(gameKey, "ponyta-for-seel") },
					{ id: 8, text: "Raichu for Electrode", img: ({ gameKey }) => task(gameKey, "raichu-for-electrode") },
					{ id: 9, text: "Venonant for Tangela", img: ({ gameKey }) => task(gameKey, "venonat-for-tangela") },
				],
			}
		],
		"story": [
			{ id: 1, text: "Collect all 8 Gym Badges and Defeat the Elite 4", img: () => _badges(["boulder", "cascade", "thunder", "rainbow", "soul", "marsh", "volcano", "earth"]), noCenter: true, },
			{
				id: 2, text: "Epilogue", noCenter: true, children: [
					{ id: 1, text: "Catch Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150), tooltip: "Found at the bottom of Cerulean Cave" },
				],
			},
		],
		"battle": [
			{ id: 1, text: "Defeat Red", img: () => npc("red"), noCenter: true },
			{
				id: 2, text: "Master the Battle Tower", children: [
					{ id: 1, text: "Single Battles", type: "tiered", tiers: [range(1, 8)], noCenter: true },
					{ id: 2, text: "Double Battles", type: "tiered", tiers: [range(1, 8)], noCenter: true },
					{ id: 3, text: "Multi Battles", type: "tiered", tiers: [range(1, 8)], noCenter: true },
					{ id: 4, text: "Knockout Battles", type: "tiered", tiers: [range(1, 8)], noCenter: true },
				],
			},
		],
		"upgrades": [
			{ id: 1, text: "Obtain the National PokeDex", img: () => keyItem("kanto-nati-dex"), noCenter: true },
			{
				id: 2, text: "Obtain the Gold 4-Star Trainer Card", noCenter: true, children: [
					{ id: 1, text: "Defeat the Elite 4/Champion" },
					{ id: 2, text: "Complete the Kanto Regional PokeDex (150)" },
					{ id: 3, text: "Complete the National PokeDex (386)" },
					{ id: 4, text: "Jump 200 times in Pokemon Jump" },
					{ id: 5, text: "Collect 200 berries in Dodrio Berry Picking" },
				],
			},
		],
		"collectables": [
			{
				id: 1, text: "Obtain all extra Key Items", children: [
					{ id: 1, text: "Good Rod", img: () => keyItem("good-rod") },
					{ id: 2, text: "Item Finder", img: () => keyItem("item-finder") },
					{ id: 3, text: "Old Rod", img: () => keyItem("old-rod") },
					{ id: 4, text: "Poke Flute", img: () => keyItem("poke-flute") },
					{ id: 5, text: "Super Rod", img: () => keyItem("super-rod") },
					{ id: 6, text: "VS Seeker", img: () => keyItem("vs-seeker") },
				],
			},
			{ id: 2, text: "Find all hidden items with the Item Finder", img: () => keyItem("item-finder"), noCenter: true, type: "tiered", tiers: [range(1, 155)], },
		],
		"thms": [
			{
				id: 1, text: "Collect all HMs", children: [
					{ id: 1, text: "HM01: Cut", img: () => hm("normal") },
					{ id: 2, text: "HM02: Fly", img: () => hm("flying") },
					{ id: 3, text: "HM03: Surf", img: () => hm("water") },
					{ id: 4, text: "HM04: Strength", img: () => hm("normal") },
					{ id: 5, text: "HM05: Flash", img: () => hm("normal") },
					{ id: 6, text: "HM06: Rock Smash", img: () => hm("fighting") },
					{ id: 7, text: "HM07: Waterfall", img: () => hm("water") },
				],
			},
			{
				id: 2, text: "Collect all HMs", children: [
					{ id: 1, text: "TM 01 - Focus Punch", img: () => tm("fighting") },
					{ id: 2, text: "TM 02 - Dragon Claw", img: () => tm("dragon") },
					{ id: 3, text: "TM 03 - Water Pulse", img: () => tm("water") },
					{ id: 4, text: "TM 04 - Calm Mind", img: () => tm("psychic") },
					{ id: 5, text: "TM 05 - Roar", img: () => tm("normal") },
					{ id: 6, text: "TM 06 - Toxic", img: () => tm("poison") },
					{ id: 7, text: "TM 07 - Hail", img: () => tm("ice") },
					{ id: 8, text: "TM 08 - Bulk Up", img: () => tm("fighting") },
					{ id: 9, text: "TM 09 - Bullet Seed", img: () => tm("grass") },
					{ id: 10, text: "TM 10 - Hidden Power", img: () => tm("normal") },
					{ id: 11, text: "TM 11 - Sunny Day", img: () => tm("fire") },
					{ id: 12, text: "TM 12 - Taunt", img: () => tm("dark") },
					{ id: 13, text: "TM 13 - Ice Beam", img: () => tm("ice") },
					{ id: 14, text: "TM 14 - Blizzard", img: () => tm("ice") },
					{ id: 15, text: "TM 15 - Hyper Beam", img: () => tm("normal") },
					{ id: 16, text: "TM 16 - Light Screen", img: () => tm("psychic") },
					{ id: 17, text: "TM 17 - Protect", img: () => tm("normal") },
					{ id: 18, text: "TM 18 - Rain Dance", img: () => tm("water") },
					{ id: 19, text: "TM 19 - Giga Drain", img: () => tm("grass") },
					{ id: 20, text: "TM 20 - Safeguard", img: () => tm("normal") },
					{ id: 21, text: "TM 21 - Frustration", img: () => tm("normal") },
					{ id: 22, text: "TM 22 - Solar Beam", img: () => tm("grass") },
					{ id: 23, text: "TM 23 - Iron Tail", img: () => tm("steel") },
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
					{ id: 34, text: "TM 34 - Shock Wave", img: () => tm("electric") },
					{ id: 35, text: "TM 35 - Flamethrower", img: () => tm("fire") },
					{ id: 36, text: "TM 36 - Sludge Bomb", img: () => tm("poison") },
					{ id: 37, text: "TM 37 - Sandstorm", img: () => tm("rock") },
					{ id: 38, text: "TM 38 - Fire Blast", img: () => tm("fire") },
					{ id: 39, text: "TM 39 - Rock Tomb", img: () => tm("rock") },
					{ id: 40, text: "TM 40 - Aerial Ace", img: () => tm("flying") },
					{ id: 41, text: "TM 41 - Torment", img: () => tm("dark") },
					{ id: 42, text: "TM 42 - Facade", img: () => tm("normal") },
					{ id: 43, text: "TM 43 - Secret Power", img: () => tm("normal") },
					{ id: 44, text: "TM 44 - Rest", img: () => tm("psychic") },
					{ id: 45, text: "TM 45 - Attract", img: () => tm("normal") },
					{ id: 46, text: "TM 46 - Thief", img: () => tm("dark") },
					{ id: 47, text: "TM 47 - Steel Wing", img: () => tm("steel") },
					{ id: 48, text: "TM 48 - Skill Swap", img: () => tm("psychic") },
					{ id: 49, text: "TM 49 - Snatch", img: () => tm("dark") },
					{ id: 50, text: "TM 50 - Overheat", img: () => tm("fire") },
				],
			},
		],
		"extra-credit": [
			{ id: 1, text: "Mew", img: ({ gameKey }) => baseSprite(gameKey, 151), },
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