import {
	_keyItem,
	_trainerCard,
	_frontSprite,
	defineTasksMany,
	overrideTasks,
} from '../helpers/index.js';

(() => {
	const gen = 8;
	const GAME_KEYS = ["swordct", "shieldct"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const keyItem = (name) => _keyItem(gen, name);
	const trainerCard = (gameKey, type, name) => _trainerCard(gameKey, type, name);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "battle", title: "Battle" },
		{ id: "collectables", title: "Collectables" },
		{ id: "trainerCards", title: "Trainer Card" },
		{ id: "fashion", title: "Fashion" },
	];

	const TASKS_BY_SECTION = {
		catching: [
			{
				id: 1, text: "Catch all the Legendaries/Mythicals", children: [
					{ id: 1, text: "Catch Galarian Articuno", img: ({ gameKey }) => baseSprite(gameKey, "144-g"), tooltip: "Roams around the Crown Tundra after the Dyna Tree encounter" },
					{ id: 2, text: "Catch Galarian Zapdos", img: ({ gameKey }) => baseSprite(gameKey, "145-g"), tooltip: "Roams the mainland Wild Area after the Dyna Tree encounter" },
					{ id: 3, text: "Catch Galarian Moltres", img: ({ gameKey }) => baseSprite(gameKey, "146-g"), tooltip: "Roams the Isle of Armor after the Dyna Tree encounter" },
					{ id: 4, text: "Catch Regirock", img: ({ gameKey }) => baseSprite(gameKey, 377), tooltip: "Rock Peak Ruins" },
					{ id: 5, text: "Catch Regice", img: ({ gameKey }) => baseSprite(gameKey, 378), tooltip: "Iceberg Ruins" },
					{ id: 6, text: "Catch Registeel", img: ({ gameKey }) => baseSprite(gameKey, 379), tooltip: "Iron Ruins" },
					{
						id: 7, text: "Catch Regieleki/Regidrago", img: ({ gameKey }) => [baseSprite(gameKey, 894), baseSprite(gameKey, 895)], tooltip: "Split-Decision Ruins\nYou can only choose one per save file", eithers: {
							1: { text: "" }, 2: { text: "" },
						},
					},
					{ id: 8, text: "Catch Regigigas", img: ({ gameKey }) => baseSprite(gameKey, 486), tooltip: "Giant's Bed\nRequires Regirock, Regice, Registeel, Regieleki, and Regidrago in your party" },
					{
						id: 9, text: "Catch Glastrier/Spectrier", img: ({ gameKey }) => [baseSprite(gameKey, 896), baseSprite(gameKey, 897)], tooltip: "Your carrot choice determines which steed appears", eithers: {
							1: { text: "" }, 2: { text: "" },
						},
					},
					{ id: 10, text: "Catch Calyrex", img: ({ gameKey }) => baseSprite(gameKey, 898), tooltip: "Crown Shrine" },
					{ id: 11, text: "Cosmog", img: ({ gameKey }) => baseSprite(gameKey, 789), tooltip: "Freezington\nGift from an elderly woman after catching Calyrex" },
					{ id: 12, text: "Poipole", img: ({ gameKey }) => baseSprite(gameKey, 803), tooltip: "Max Lair\nGift after catching 5 Ultra Beasts in Dynamax Adventures" },
					{ id: 13, text: "Catch Cobalion", img: ({ gameKey }) => baseSprite(gameKey, 638), tooltip: "Track Sonia's Iron Will footprints" },
					{ id: 14, text: "Catch Terrakion", img: ({ gameKey }) => baseSprite(gameKey, 639), tooltip: "Track Sonia's Cavern footprints" },
					{ id: 15, text: "Catch Virizion", img: ({ gameKey }) => baseSprite(gameKey, 640), tooltip: "Track Sonia's Grassland footprints" },
					{ id: 16, text: "Catch Keldeo", img: ({ gameKey }) => baseSprite(gameKey, 647), tooltip: "Ballimere Lake\nCook curry with Cobalion, Terrakion, and Virizion in your party" },
				],
			},
			{
				id: 2, text: "Catch all Dynamax Adventure Legendaries", children: [
					{ id: 1, text: "Catch Articuno", img: ({ gameKey }) => baseSprite(gameKey, 144) },
					{ id: 2, text: "Catch Zapdos", img: ({ gameKey }) => baseSprite(gameKey, 145) },
					{ id: 3, text: "Catch Moltres", img: ({ gameKey }) => baseSprite(gameKey, 146) },
					{ id: 4, text: "Catch Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150) },
					{ id: 5, text: "Catch Raikou", img: ({ gameKey }) => baseSprite(gameKey, 243) },
					{ id: 6, text: "Catch Entei", img: ({ gameKey }) => baseSprite(gameKey, 244) },
					{ id: 7, text: "Catch Suicune", img: ({ gameKey }) => baseSprite(gameKey, 245) },
					{ id: 8, text: "Catch/Trade Ho-Oh", img: ({ gameKey }) => baseSprite(gameKey, 250) },
					{ id: 9, text: "Catch/Trade Lugia", img: ({ gameKey }) => baseSprite(gameKey, 249) },
					{ id: 10, text: "Catch/Trade Latias", img: ({ gameKey }) => baseSprite(gameKey, 380) },
					{ id: 11, text: "Catch/Trade Latios", img: ({ gameKey }) => baseSprite(gameKey, 381) },
					{ id: 12, text: "Catch/Trade Kyogre", img: ({ gameKey }) => baseSprite(gameKey, 382) },
					{ id: 13, text: "Catch/Trade Groudon", img: ({ gameKey }) => baseSprite(gameKey, 383) },
					{ id: 14, text: "Catch Rayquaza", img: ({ gameKey }) => baseSprite(gameKey, 384) },
					{ id: 15, text: "Catch Uxie", img: ({ gameKey }) => baseSprite(gameKey, 480) },
					{ id: 16, text: "Catch Mesprit", img: ({ gameKey }) => baseSprite(gameKey, 481) },
					{ id: 17, text: "Catch Azelf", img: ({ gameKey }) => baseSprite(gameKey, 482) },
					{ id: 18, text: "Catch/Trade Dialga", img: ({ gameKey }) => baseSprite(gameKey, 483) },
					{ id: 19, text: "Catch/Trade Palkia", img: ({ gameKey }) => baseSprite(gameKey, 484) },
					{ id: 20, text: "Catch Giratina", img: ({ gameKey }) => baseSprite(gameKey, 487) },
					{ id: 21, text: "Catch Cresselia", img: ({ gameKey }) => baseSprite(gameKey, 488) },
					{ id: 22, text: "Catch Heatran", img: ({ gameKey }) => baseSprite(gameKey, 485) },
					{ id: 23, text: "Catch/Trade Tornadus", img: ({ gameKey }) => baseSprite(gameKey, 641) },
					{ id: 24, text: "Catch/Trade Thundurus", img: ({ gameKey }) => baseSprite(gameKey, 642) },
					{ id: 25, text: "Catch Landorus", img: ({ gameKey }) => baseSprite(gameKey, 645) },
					{ id: 26, text: "Catch/Trade Reshiram", img: ({ gameKey }) => baseSprite(gameKey, 643) },
					{ id: 27, text: "Catch/Trade Zekrom", img: ({ gameKey }) => baseSprite(gameKey, 644) },
					{ id: 28, text: "Catch Kyurem", img: ({ gameKey }) => baseSprite(gameKey, 646) },
					{ id: 29, text: "Catch/Trade Xerneas", img: ({ gameKey }) => baseSprite(gameKey, 716) },
					{ id: 30, text: "Catch/Trade Yveltal", img: ({ gameKey }) => baseSprite(gameKey, 717) },
					{ id: 31, text: "Catch Zygarde", img: ({ gameKey }) => baseSprite(gameKey, 718) },
					{ id: 32, text: "Catch Tapu Koko", img: ({ gameKey }) => baseSprite(gameKey, 785) },
					{ id: 33, text: "Catch Tapu Lele", img: ({ gameKey }) => baseSprite(gameKey, 786) },
					{ id: 34, text: "Catch Tapu Bulu", img: ({ gameKey }) => baseSprite(gameKey, 787) },
					{ id: 35, text: "Catch Tapu Fini", img: ({ gameKey }) => baseSprite(gameKey, 788) },
					{ id: 36, text: "Catch/Trade Solgaleo", img: ({ gameKey }) => baseSprite(gameKey, 791) },
					{ id: 37, text: "Catch/Trade Lunala", img: ({ gameKey }) => baseSprite(gameKey, 792) },
					{ id: 38, text: "Catch Necrozma", img: ({ gameKey }) => baseSprite(gameKey, 800) },
				],
			},
			{
				id: 3, text: "Catch all Ultra Beasts from Dynamax Adventures", children: [
					{ id: 1, text: "Catch Nihilego", img: ({ gameKey }) => baseSprite(gameKey, 793) },
					{ id: 2, text: "Catch/Trade Buzzwole", img: ({ gameKey }) => baseSprite(gameKey, 794) },
					{ id: 3, text: "Catch/Trade Pheromosa", img: ({ gameKey }) => baseSprite(gameKey, 795) },
					{ id: 4, text: "Catch Xurkitree", img: ({ gameKey }) => baseSprite(gameKey, 796) },
					{ id: 5, text: "Catch/Trade Celesteela", img: ({ gameKey }) => baseSprite(gameKey, 797) },
					{ id: 6, text: "Catch/Trade Kartana", img: ({ gameKey }) => baseSprite(gameKey, 798) },
					{ id: 7, text: "Catch Guzzlord", img: ({ gameKey }) => baseSprite(gameKey, 799) },
					{ id: 8, text: "Catch/Trade Stakataka", img: ({ gameKey }) => baseSprite(gameKey, 805) },
					{ id: 9, text: "Catch/Trade Blacephalon", img: ({ gameKey }) => baseSprite(gameKey, 806) },
				],
			},
			{
				id: 4, text: "Obtain all In-Game Gift Pokémon", children: [
					{ id: 1, text: "Cosmog", img: ({ gameKey }) => baseSprite(gameKey, 789), tooltip: "Freezington\nGift from an elderly woman after catching Calyrex" },
					{ id: 2, text: "Poipole", img: ({ gameKey }) => baseSprite(gameKey, 803), tooltip: "Max Lair\nGift after catching 5 Ultra Beasts in Dynamax Adventures" },
				],
			},
		],
		story: [
			{
				id: 1, text: "Complete the Crown Tundra story", children: [
					{ id: 1, text: "Complete your first Dynamax Adventure", tooltip: "Max Lair" },
					{ id: 2, text: "Finish Legendary Clue 1: The King of Bounteous Harvests", tooltip: "Freeze Inn" },
					{ id: 3, text: "Finish Legendary Clue 2: The Terrible Titans", tooltip: "Catch Regirock, Regice, Registeel, and Regieleki/Regidrago" },
					{ id: 4, text: "Finish Legendary Clue 3: The Legendary Tree of Three", tooltip: "Catch the three Galarian birds" },
					{ id: 5, text: "Finish Legendary Clue ?", tooltip: "Max Lair" },
				],
			},
			{
				id: 2, text: "Complete the Epilogue: Galarian Star Tournament", children: [
					{ id: 1, text: "Complete the base game, postgame, IoA, and CT stories", tooltip: "Required before Leon's invitation" },
					{ id: 2, text: "Answer Leon's invitation to Wyndon Stadium", tooltip: "Happens after showing Peony Legendary Clue?" },
					{ id: 3, text: "Win your first Galarian Star Tournament", tooltip: "Unlocks the repeatable tournament format" },
				],
			},
		],
		battle: [
			{ id: 1, text: "Unlock Endless Dynamax Adventures", tooltip: "Requires starting the Ultra Beast quest and clearing 3 Dynamax Adventures" },
			{ id: 2, text: "Win the Galarian Star Tournament", tooltip: "Wyndon Stadium" },
			{ id: 3, text: "Win the Galarian Star Tournament 15 times", tooltip: "Unlocks Sordward and Shielbert as partners" },
		],
		collectables: [
			{
				id: 1, text: "Collect all Key Items", children: [
					{ id: 1, text: "Crown Pass", img: () => keyItem("crown-pass"), tooltip: "Lets you travel to the Crown Tundra from Wedgehurst Station" },
					{ id: 2, text: "Legendary Clue 1", tooltip: "The King of Bountiful Harvests" },
					{ id: 3, text: "Legendary Clue 2", tooltip: "The Terrible Titans" },
					{ id: 4, text: "Legendary Clue 3", tooltip: "A Legendary Tree of a Legendary Three" },
					{ id: 5, text: "Legendary Clue?", tooltip: "They Came From The Ultra Beyond!" },
					{ id: 6, text: "Wooden Crown", tooltip: "Freezington" },
					{ id: 7, text: "Reins of Unity", tooltip: "Used to fuse and separate Calyrex and its steed" },
				],
			},
		],
		trainerCards: [
			{
				id: 1, text: "Obtain all Regular League Cards", children: [
					{ id: 1, text: "Peony", tooltip: "Max Lair" },
				]
			},
			{
				id: 2, text: "Obtain all Rare League Cards", children: [
					{ id: 1, text: "Peony", tooltip: "Freezington" },
				]
			},
			{
				id: 3, text: "Obtain all League Card Backgrounds", children: [
					{ id: 1, text: "Freezington", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "freezington") },
					{ id: 2, text: "Old Cemetery", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "old-cemetery") },
					{ id: 3, text: "Old Cemetery (Grayscale)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "old-cemetery-grayscale") },
					{ id: 4, text: "Path to the Peak", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "path-to-the-peak") },
					{ id: 5, text: "Crown Shrine", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "crown-shrine") },
					{ id: 6, text: "Crown Shrine (Night)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "crown-shrine-night") },
					{ id: 7, text: "Crown Shrine (Tree)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "crown-shrine-tree") },
					{ id: 8, text: "Frigid Sea", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "frigid-sea") },
					{ id: 9, text: "Dyna Tree Hill", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "dyna-tree-hill") },
					{ id: 10, text: "Dyna Tree Hill (Night)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "dyna-tree-hill-night") },
					{ id: 11, text: "Rock Peak Ruins", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "rock-peak-ruins") },
					{ id: 12, text: "Iceberg Ruins", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "iceberg-ruins") },
					{ id: 13, text: "Iron Ruins", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "iron-ruins") },
					{ id: 14, text: "SplitDecis-Ruins", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "splitdecis-ruins") },
					{ id: 15, text: "Expedition Team (Logo)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "expedition-team-logo") },
					{ id: 16, text: "Champion Cup", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "champion-cup") },
					{ id: 17, text: "Galarian Star Tournament", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "galarian-star-tournament") },
					{ id: 18, text: "Turrfield Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "turrfield-symbol") },
					{ id: 19, text: "Hulbury Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "hulbury-symbol") },
					{ id: 20, text: "Motostoke Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "motostoke-symbol") },
					{ id: 21, text: "Stow-on-Side Symbol" },
					{ id: 22, text: "Ballonlea Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "ballonlea-symbol") },
					{ id: 23, text: "Circhester Symbol" },
					{ id: 24, text: "Spikemuth Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "spikemuth-symbol") },
					{ id: 25, text: "Hammerlocke Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "hammerlocke-symbol") },
					{ id: 26, text: "Klara/Avery Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "klara-symbol") },
					{ id: 27, text: "White", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "white") },
					{ id: 28, text: "Black", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "black") },
					{ id: 29, text: "Blue", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "blue") },
					{ id: 30, text: "Red", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "red") },
					{ id: 31, text: "Yellow", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "yellow") },
					{ id: 32, text: "Green", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "green") },
				]
			},
			{
				id: 4, text: "Obtain all League Card Effects", children: [
					{ id: 1, text: "Effect 24", img: ({ gameKey }) => trainerCard(gameKey, "effects", "25") },
					{ id: 2, text: "Effect 25", img: ({ gameKey }) => trainerCard(gameKey, "effects", "26") },
					{ id: 3, text: "Effect 26", img: ({ gameKey }) => trainerCard(gameKey, "effects", "27") },
				]
			},
			{
				id: 5, text: "Obtain all League Card Frames", children: [
					{ id: 1, text: "Frame 22", img: ({ gameKey }) => trainerCard(gameKey, "frames", "24") },
					{ id: 2, text: "Frame 23", img: ({ gameKey }) => trainerCard(gameKey, "frames", "25") },
					{ id: 3, text: "Frame 24", img: ({ gameKey }) => trainerCard(gameKey, "frames", "26") },
				]
			},
		],
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
		catching: overrideTasks(TASKS_BY_SECTION.catching, {
			4: {
				5: { text: "Catch Ho-Oh" },
				6: { text: "Trade Lugia" },
				7: { text: "Trade Latias" },
				8: { text: "Catch Latios" },
				9: { text: "Trade Kyogre" },
				10: { text: "Catch Groudon" },
				15: { text: "Catch Dialga" },
				16: { text: "Trade Palkia" },
				20: { text: "Catch Tornadus" },
				21: { text: "Trade Thundurus" },
				23: { text: "Catch Reshiram" },
				24: { text: "Trade Zekrom" },
				26: { text: "Catch Xerneas" },
				27: { text: "Trade Yveltal" },
				33: { text: "Catch Solgaleo" },
				34: { text: "Trade Lunala" },
			},
			5: {
				2: { text: "Catch Buzzwole" },
				3: { text: "Trade Pheromosa" },
				5: { text: "Trade Celesteela" },
				6: { text: "Catch Kartana" },
				8: { text: "Trade Stakataka" },
				9: { text: "Catch Blacephalon" },
			},
		}),
		trainerCards: overrideTasks(TASKS_BY_SECTION.trainerCards, {
			3: {
				21: { text: "Stow-on-Side Symbol (Fighting)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "stow-on-side-symbol-fighting") },
				23: { text: "Circhester Symbol (Rock)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "circhester-symbol-rock") },
				26: { text: "Klara Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "klara-symbol") },
			},
		}),
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
		catching: overrideTasks(TASKS_BY_SECTION.catching, {
			4: {
				5: { text: "Trade Ho-Oh" },
				6: { text: "Catch Lugia" },
				7: { text: "Catch Latias" },
				8: { text: "Trade Latios" },
				9: { text: "Catch Kyogre" },
				10: { text: "Trade Groudon" },
				15: { text: "Trade Dialga" },
				16: { text: "Catch Palkia" },
				20: { text: "Trade Tornadus" },
				21: { text: "Catch Thundurus" },
				23: { text: "Trade Reshiram" },
				24: { text: "Catch Zekrom" },
				26: { text: "Trade Xerneas" },
				27: { text: "Catch Yveltal" },
				33: { text: "Trade Solgaleo" },
				34: { text: "Catch Lunala" },
			},
			5: {
				2: { text: "Trade Buzzwole" },
				3: { text: "Catch Pheromosa" },
				5: { text: "Catch Celesteela" },
				6: { text: "Trade Kartana" },
				8: { text: "Catch Stakataka" },
				9: { text: "Trade Blacephalon" },
			},
		}),
		trainerCards: overrideTasks(TASKS_BY_SECTION.trainerCards, {
			3: {
				21: { text: "Stow-on-Side Symbol (Ghost)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "stow-on-side-symbol-ghost") },
				23: { text: "Circhester Symbol (Ice)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "circhester-symbol-ice") },
				26: { text: "Avery Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "avery-symbol") },
			},
		}),
	};

	defineTasksMany(GAME_KEYS[0], SECTIONS, TASKS_BY_SECTION_GAME1);
	defineTasksMany(GAME_KEYS[1], SECTIONS, TASKS_BY_SECTION_GAME2);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();
