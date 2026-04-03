(() => {
	const gen = 2;
	const GAME_KEYS = ["crystal"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const shinySprite = (gameKey, natiId) => _frontSpriteShiny(gen, gameKey, natiId);
	const task = (gameKey, id) => _task(gameKey, id);
	const npc = (gameKey, id) => _npc(gameKey, id);
	const location = (gameKey, id) => _location(gameKey, id);
	const heldItem = (name) => _heldItem(gen, name);
	const keyItem = (name) => _keyItem(gen, name);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "side-quests", title: "Side Quests" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "thms", title: "TMs/HMs" },
		{ id: "extra-credit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Trade for Articuno", img: ({ gameKey }) => baseSprite(gameKey, 144), },
					{ id: 2, text: "Trade for Zapdos", img: ({ gameKey }) => baseSprite(gameKey, 145), },
					{ id: 3, text: "Trade for Moltres", img: ({ gameKey }) => baseSprite(gameKey, 146), },
					{ id: 4, text: "Trade for Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150), },
					{ id: 5, text: "Catch Raikou", img: ({ gameKey }) => baseSprite(gameKey, 243), },
					{ id: 6, text: "Catch Entei", img: ({ gameKey }) => baseSprite(gameKey, 244), },
					{ id: 7, text: "Catch Suicune", img: ({ gameKey }) => baseSprite(gameKey, 245), },
					{ id: 8, text: "Catch Lugia", img: ({ gameKey }) => baseSprite(gameKey, 249), },
					{ id: 9, text: "Catch Ho-Oh", img: ({ gameKey }) => baseSprite(gameKey, 250), },
				],
			},
			{ id: 2, text: "Catch/Defeat the Sudowoodo on Route 36", img: ({ gameKey }) => baseSprite(gameKey, 185) },
			{ id: 3, text: 'Catch/Defeat the "Red" Gyarados in the Lake of Rage', img: ({ gameKey }) => shinySprite(gameKey, 130) },
			{ id: 4, text: "Catch/Defeat the Snorlax in Vermillion City", img: ({ gameKey }) => baseSprite(gameKey, 143) },
			{
				id: 5, text: "Obtain all In-Game Gift Pokémon", children: [
					{ id: 1, text: "Odd Egg", img: ({ gameKey }) => baseSprite(gameKey, 0) },
					{ id: 2, text: "Spearow", img: ({ gameKey }) => baseSprite(gameKey, 21) },
					{ id: 3, text: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133) },
					{ id: 4, text: "Togepi", img: ({ gameKey }) => baseSprite(gameKey, 175) },
					{ id: 5, text: "Dratini", img: ({ gameKey }) => baseSprite(gameKey, 147) },
					{ id: 6, text: "Shuckle", img: ({ gameKey }) => baseSprite(gameKey, 213) },
					{ id: 7, text: "Tyrogue", img: ({ gameKey }) => baseSprite(gameKey, 236) },
				],
			},
			{
				id: 6, text: "Complete all In-Game Trades", children: [
					{ id: 1, text: "Bellsprout for Onix", img: ({ gameKey }) => task(gameKey, "bellsprout-for-onix") },
					{ id: 2, text: "Drowzee for Machop", img: ({ gameKey }) => task(gameKey, "drowzee-for-machop") },
					{ id: 3, text: "Krabby for Voltorb", img: ({ gameKey }) => task(gameKey, "krabby-for-voltorb") },
					{ id: 4, text: "Dragonair for Rhydon", img: ({ gameKey }) => task(gameKey, "dragonair-for-rhydon") },
					{ id: 5, text: "Gloom for Rapidash", img: ({ gameKey }) => task(gameKey, "gloom-for-rapidash") },
					{ id: 6, text: "Chansey for Aerodactyl", img: ({ gameKey }) => task(gameKey, "chansey-for-aerodactyl") },
				],
			},
		],
		"story": [
			{ id: 1, text: "Collect all 8 Gym Badges and Defeat the Elite 4", img: () => _badges(["zephyr", "hive", "plain", "fog", "storm", "mineral", "glacier", "rising"]), noCenter: true },
			{
				id: 2, text: "Explore the Kanto Region", children: [
					{ id: 1, text: "Restore power to the Kanto Power Plant", img: ({ gameKey }) => location(gameKey, "kanto-power-plant") },
					{ id: 2, text: "Find Blue", img: ({ gameKey }) => npc(gameKey, "blue"), tooltip: "Can be found on Cinnabar Island" },
					{ id: 3, text: "Defeat Blaine", img: ({ gameKey }) => npc(gameKey, "blaine"), tooltip: "Can be found at the Seafoam Islands", },
					{ id: 4, text: "Defeat Red", img: ({ gameKey }) => npc(gameKey, "red"), tooltip: "Can be found atop Mt. Silver" },
				],
			},
			{
				id: 3, text: "Collect all 8 Kanto Gym Badges", children: [
					{ id: 1, text: "Thunder Badge", img: () => _badges("thunder"), tooltip: "Defeat Lt. Surge at the Vermillion City Gym" },
					{ id: 2, text: "Marsh Badge", img: () => _badges("marsh"), tooltip: "Defeat Sabrina at the Saffron City Gym" },
					{ id: 3, text: "Rainbow Badge", img: () => _badges("rainbow"), tooltip: "Defeat Erika at the Celdaon City Gym" },
					{ id: 4, text: "Soul Badge", img: () => _badges("soul"), tooltip: "Defeat Janine at the Fuchsia City Gym" },
					{ id: 5, text: "Cascade Badge", img: () => _badges("cascade"), tooltip: "Defeat Misty at the Cerulean City Gym" },
					{ id: 6, text: "Boulder Badge", img: () => _badges("boulder"), tooltip: "Defeat Brock at the Pewter City Gym" },
					{ id: 7, text: "Volcano Badge", img: () => _badges("volcano"), tooltip: "Defeat Blane at the Seafoam Islands", },
					{ id: 8, text: "Earth Badge", img: () => _badges("earth"), tooltip: "Defeat Blue at the Viridian City Gym" },
				],
			},
		],
		"side-quests": [
			{ id: 1, text: "Show Elm the hatched Egg", img: ({ gameKey }) => npc(gameKey, "elm"), tooltip: "You get an Everstone in return" },
			{ id: 2, text: "Deliver the mail for Randy to his friend", img: ({ gameKey }) => npc(gameKey, "randy"), tooltip: "Randy (Route 36), Friend (Route 31)" },
			{ id: 3, text: "Cure the Miltank", img: ({ gameKey }) => baseSprite(gameKey, 242), tooltip: "Route 39 - Miltank Farm" },
			{ id: 4, text: "Talk to DJ Mary in the Radio Tower", img: ({ gameKey }) => npc(gameKey, "dj-mary"), tooltip: "Talk after defeating Team Rocket in the Radio Tower" },
			{ id: 5, text: "Return the lost doll", img: () => keyItem("lost-item-c"), tooltip: "The woman is in Saffron City" },
			{
				id: 6, text: "Meet all the Week Siblings", children: [
					{ id: 1, text: "Monica", img: ({ gameKey }) => npc(gameKey, "monica") },
					{ id: 2, text: "Tuscany", img: ({ gameKey }) => npc(gameKey, "tuscany") },
					{ id: 3, text: "Wesley", img: ({ gameKey }) => npc(gameKey, "wesley") },
					{ id: 4, text: "Arthur", img: ({ gameKey }) => npc(gameKey, "arthur") },
					{ id: 5, text: "Frieda", img: ({ gameKey }) => npc(gameKey, "frieda") },
					{ id: 6, text: "Santos", img: ({ gameKey }) => npc(gameKey, "santos") },
					{ id: 7, text: "Sunny", img: ({ gameKey }) => npc(gameKey, "sunny") },
				],
			},
		],
		"upgrades": [
			{
				id: 1, text: "Upgrade your PokeGear", img: ({ gameKey }) => task(gameKey, "pokegear"), children: [
					{ id: 1, text: "Phone", img: ({ gameKey }) => task(gameKey, "phone") },
					{ id: 2, text: "Radio", img: ({ gameKey }) => task(gameKey, "radio") },
				],
			},
		],
		"collectables": [
			{
				id: 1, text: "Obtain all extra Key Items", children: [
					{ id: 1, text: "Bike", img: () => keyItem("bicycle") },
					{ id: 2, text: "Coin Case", img: () => keyItem("coin-case") },
					{ id: 3, text: "Exp. Share", img: () => heldItem("exp-share") },
					{ id: 4, text: "Good Rod", img: () => keyItem("good-rod") },
					{ id: 5, text: "Item Finder", img: () => keyItem("item-finder") },
					{ id: 6, text: "Old Rod", img: () => keyItem("old-rod") },
					{ id: 7, text: "Squirtbottle", img: () => keyItem("squirt-bottle") },
					{ id: 8, text: "Super Rod", img: () => keyItem("super-rod") },
				],
			},
			{ id: 2, text: "Find all hidden items with the Item Finder", img: () => keyItem("item-finder"), noCenter: true, type: "tiered", tiers: [range(1, 88)], },
		],
		"thms": [
			{
				id: 1, text: "Collect all HMs", children: [
					{ id: 1, text: "HM01: Cut", img: () => hm("normal") },
					{ id: 2, text: "HM02: Fly", img: () => hm("flying") },
					{ id: 3, text: "HM03: Surf", img: () => hm("water") },
					{ id: 4, text: "HM04: Strength", img: () => hm("normal") },
					{ id: 5, text: "HM05: Flash", img: () => hm("normal") },
					{ id: 6, text: "HM06: Whirlpool", img: () => hm("water") },
					{ id: 7, text: "HM07: Waterfall", img: () => hm("water") },
				],
			},
			{
				id: 2, text: "Collect all TMs", children: [
					{ id: 1, text: "TM 1 - Dynamic Punch", img: () => tm("fighting") },
					{ id: 2, text: "TM 2 - Headbutt", img: () => tm("normal") },
					{ id: 3, text: "TM 3 - Curse", img: () => tm("ghost") },
					{ id: 4, text: "TM 4 - Rollout", img: () => tm("rock") },
					{ id: 5, text: "TM 5 - Roar", img: () => tm("normal") },
					{ id: 6, text: "TM 6 - Toxic", img: () => tm("poison") },
					{ id: 7, text: "TM 7 - Zap Cannon", img: () => tm("electric") },
					{ id: 8, text: "TM 8 - Rock Smash", img: () => tm("fighting") },
					{ id: 9, text: "TM 9 - Psych Up", img: () => tm("normal") },
					{ id: 10, text: "TM 10 - Hidden Power", img: () => tm("normal") },
					{ id: 11, text: "TM 11 - Sunny Day", img: () => tm("fire") },
					{ id: 12, text: "TM 12 - Sweet Scent", img: () => tm("normal") },
					{ id: 13, text: "TM 13 - Snore", img: () => tm("normal") },
					{ id: 14, text: "TM 14 - Blizzard", img: () => tm("ice") },
					{ id: 15, text: "TM 15 - Hyper Beam", img: () => tm("normal") },
					{ id: 16, text: "TM 16 - Icy Wind", img: () => tm("ice") },
					{ id: 17, text: "TM 17 - Protect", img: () => tm("normal") },
					{ id: 18, text: "TM 18 - Rain Dance", img: () => tm("water") },
					{ id: 19, text: "TM 19 - Giga Drain", img: () => tm("grass") },
					{ id: 20, text: "TM 20 - Endure", img: () => tm("normal") },
					{ id: 21, text: "TM 21 - Frustration", img: () => tm("normal") },
					{ id: 22, text: "TM 22 - Solar Beam", img: () => tm("grass") },
					{ id: 23, text: "TM 23 - Iron Tail", img: () => tm("steel") },
					{ id: 24, text: "TM 24 - Dragon Breath", img: () => tm("dragon") },
					{ id: 25, text: "TM 25 - Thunder", img: () => tm("electric") },
					{ id: 26, text: "TM 26 - Earthquake", img: () => tm("ground") },
					{ id: 27, text: "TM 27 - Return", img: () => tm("normal") },
					{ id: 28, text: "TM 28 - Dig", img: () => tm("ground") },
					{ id: 29, text: "TM 29 - Psychic", img: () => tm("psychic") },
					{ id: 30, text: "TM 30 - Shadow Ball", img: () => tm("ghost") },
					{ id: 31, text: "TM 31 - Mud-Slap", img: () => tm("ground") },
					{ id: 32, text: "TM 32 - Double Team", img: () => tm("normal") },
					{ id: 33, text: "TM 33 - Ice Punch", img: () => tm("ice") },
					{ id: 34, text: "TM 34 - Swagger", img: () => tm("normal") },
					{ id: 35, text: "TM 35 - Sleep Talk", img: () => tm("normal") },
					{ id: 36, text: "TM 36 - Sludge Bomb", img: () => tm("poison") },
					{ id: 37, text: "TM 37 - Sandstorm", img: () => tm("rock") },
					{ id: 38, text: "TM 38 - Fire Blast", img: () => tm("fire") },
					{ id: 39, text: "TM 39 - Swift", img: () => tm("normal") },
					{ id: 40, text: "TM 40 - Defense Curl", img: () => tm("normal") },
					{ id: 41, text: "TM 41 - Thunder Punch", img: () => tm("electric") },
					{ id: 42, text: "TM 42 - Dream Eater", img: () => tm("psychic") },
					{ id: 43, text: "TM 43 - Detect", img: () => tm("fighting") },
					{ id: 44, text: "TM 44 - Rest", img: () => tm("psychic") },
					{ id: 45, text: "TM 45 - Attract", img: () => tm("normal") },
					{ id: 46, text: "TM 46 - Thief", img: () => tm("dark") },
					{ id: 47, text: "TM 47 - Steel Wing", img: () => tm("steel") },
					{ id: 48, text: "TM 48 - Fire Punch", img: () => tm("fire") },
					{ id: 49, text: "TM 49 - Fury Cutter", img: () => tm("bug") },
					{ id: 50, text: "TM 50 - Nightmare", img: () => tm("ghost") },
				],
			},
		],
		"extra-credit": [
			{ id: 1, text: "Obtain Mew", img: ({ gameKey }) => baseSprite(gameKey, 151), },
			{ id: 2, text: "Obtain Celebi", img: ({ gameKey }) => baseSprite(gameKey, 251), },
		],
	};

	window.defineTasksMany(GAME_KEYS, SECTIONS, TASKS_BY_SECTION);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();