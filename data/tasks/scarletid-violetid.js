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
	const shinySprite = (gameKey, natiId) => _frontSpriteShiny(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
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
				id: 1, text: "Catch all the Legendaries/Mythicals", children: [
					{ id: 1, text: "Catch Terapagos", img: ({ gameKey }) => baseSprite(gameKey, 1024), tooltip: "Obtained during the main story in the Terarium" },
					{ id: 2, text: "Catch Meloetta", img: ({ gameKey }) => baseSprite(gameKey, 648) },
				],
			},
			{
				id: 2, text: "Catch all the Legendaries with snacks", children: [
					{ id: 1, text: "Catch Articuno", img: ({ gameKey }) => baseSprite(gameKey, 144) },
					{ id: 2, text: "Catch Zapdos", img: ({ gameKey }) => baseSprite(gameKey, 145) },
					{ id: 3, text: "Catch Moltres", img: ({ gameKey }) => baseSprite(gameKey, 146) },
					{ id: 4, text: "Catch/Trade Raikou", img: ({ gameKey }) => baseSprite(gameKey, 243) },
					{ id: 5, text: "Catch/Trade Entei", img: ({ gameKey }) => baseSprite(gameKey, 244) },
					{ id: 6, text: "Catch/Trade Suicune", img: ({ gameKey }) => baseSprite(gameKey, 245) },
					{ id: 7, text: "Catch/Trade Lugia", img: ({ gameKey }) => baseSprite(gameKey, 249) },
					{ id: 8, text: "Catch/Trade Ho-Oh", img: ({ gameKey }) => baseSprite(gameKey, 250) },
					{ id: 9, text: "Catch/Trade Latias", img: ({ gameKey }) => baseSprite(gameKey, 380) },
					{ id: 10, text: "Catch/Trade Latios", img: ({ gameKey }) => baseSprite(gameKey, 381) },
					{ id: 11, text: "Catch/Trade Kyogre", img: ({ gameKey }) => baseSprite(gameKey, 382) },
					{ id: 12, text: "Catch/Trade Groudon", img: ({ gameKey }) => baseSprite(gameKey, 383) },
					{ id: 13, text: "Catch/Trade Rayquaza", img: ({ gameKey }) => baseSprite(gameKey, 384) },
					{ id: 14, text: "Catch/Trade Cobalion", img: ({ gameKey }) => baseSprite(gameKey, 638) },
					{ id: 15, text: "Catch/Trade Terrakion", img: ({ gameKey }) => baseSprite(gameKey, 639) },
					{ id: 16, text: "Catch/Trade Virizion", img: ({ gameKey }) => baseSprite(gameKey, 640) },
					{ id: 17, text: "Catch/Trade Reshiram", img: ({ gameKey }) => baseSprite(gameKey, 643) },
					{ id: 18, text: "Catch/Trade Zekrom", img: ({ gameKey }) => baseSprite(gameKey, 644) },
					{ id: 19, text: "Catch/Trade Kyurem", img: ({ gameKey }) => baseSprite(gameKey, 646) },
					{ id: 20, text: "Catch/Trade Solgaleo", img: ({ gameKey }) => baseSprite(gameKey, 791) },
					{ id: 21, text: "Catch/Trade Lunala", img: ({ gameKey }) => baseSprite(gameKey, 792) },
					{ id: 22, text: "Catch/Trade Necrozma", img: ({ gameKey }) => baseSprite(gameKey, 800) },
					{ id: 23, text: "Catch Kubfu", img: ({ gameKey }) => baseSprite(gameKey, 891) },
					{ id: 24, text: "Catch/Trade Glastrier", img: ({ gameKey }) => baseSprite(896) },
					{ id: 25, text: "Catch/Trade Spectrier", img: ({ gameKey }) => baseSprite(gameKey, 897) },
				],
			},
			{
				id: 3, text: "Catch/Defeat all Static Encounters", children: [
					{ id: 1, text: "Gouging Fire/Iron Boulder" },
					{ id: 2, text: "Raging Bolt/Iron Crown" },
				],
			},
			{
				id: 4, text: "Obtain all In-Game Gift Pokémon", children: [
					{ id: 1, text: "Shiny Blitzle", img: ({ gameKey }) => shinySprite(522) },
				],
			},
			{
				id: 5, text: "Complete all In-Game Pokémon Trade", children: [
					{ id: 1, text: "Any for Magby" },
					{ id: 2, text: "Any for Dudunsparce" },
					{ id: 3, text: "Any for Paldean Wooper" },
					{ id: 4, text: "Any for Pawmo" },
					{ id: 5, text: "Any for Cetoddle" },
					{ id: 6, text: "Any for Veluza" },
					{ id: 7, text: "Any for Arctibax" },
					{ id: 8, text: "Any for Combee" },
					{ id: 9, text: "Any for Duraladon" },
					{ id: 10, text: "Any for Meditite" },
					{ id: 11, text: "Any for Sunflora" },
					{ id: 12, text: "Any for Mareanie" },
					{ id: 13, text: "Any for Magnemite" },
					{ id: 14, text: "Any for Skarmory" },
					{ id: 15, text: "Any for Glimmet" },
					{ id: 16, text: "Any for Tinkatuff" },
					{ id: 17, text: "Any for Geavard" },
					{ id: 18, text: "Any for Gimmighoul" },
					{ id: 19, text: "Any for Flittle" },
					{ id: 20, text: "Any for Hattrem" },
					{ id: 21, text: "Any for ALolan Meowth" },
					{ id: 22, text: "Any for Blitzle" },
					{ id: 23, text: "Any for Snubbull" },
					{ id: 24, text: "Any for Rockruff" },
					{ id: 25, text: "Any for Gulpin" },
					{ id: 26, text: "Any for Combat Paldean Tauros" },
					{ id: 27, text: "Any for Eevee" },
					{ id: 28, text: "Any for Skwovet" },
					{ id: 29, text: "Any for Applin" },
					{ id: 30, text: "Any for Poltchageist" },
				],
			},
		],
		story: [
			{
				id: 1, text: "Complete the Indigo Disk story", children: [
					{ id: 1, text: "Enroll at Blueberry Academy" },
					{ id: 2, text: "Defeat Crispin" },
					{ id: 3, text: "Defeat Amarys" },
					{ id: 4, text: "Defeat Lacey" },
					{ id: 5, text: "Defeat Drayton" },
					{ id: 6, text: "Face Kieran in the BB League" },
					{ id: 7, text: "Complete the Area Zero epilogue" },
				],
			},
		],
		activities: [
			{
				id: 1, text: "Complete all Flying Time Trial courses", children: [
					{ id: 1, text: "Easy Course" },
					{ id: 2, text: "Normal Course" },
					{ id: 3, text: "Hard Course" },
					{ id: 4, text: "Super-Hard Course" },
				],
			},
			{ id: 2, text: "Return to the Crystal Pool", tooltip: "Kitakami" },
			{ id: 3, text: "Tutor the Team Star haeds" },
		],
		battle: [
			{ id: 1, text: "Win the BB League Championship", tooltip: "Defeat all four BB Elite Four members and Kieran to become BB Champion" },
			{ id: 2, text: "Defeat the Big Boss" },
			{
				id: 3, text: "Rematch all BB Elite Four members", children: [
					{ id: 1, text: "Crispin" },
					{ id: 2, text: "Amarys" },
					{ id: 3, text: "Lacey" },
					{ id: 4, text: "Drayton" },
				],
			},
		],
		upgrades: [
			{ id: 1, text: "Upgrade the Item Printer", tiers: ["Poke Ball", "Great Ball", "Ultra Ball", "Master Ball"] },
			{
				id: 2, text: "Contribute BP to the Support Board", children: [
					{ id: 1, text: "Smug Style/Elegant Style", tooltip: "150 BP" },
					{ id: 2, text: "Galarian Star Style", tooltip: "300 BP" },
					{ id: 3, text: "Twirling Style/Ninja Style", tooltip: "150 BP" },
					{ id: 4, text: "Unlock Item Printer", tooltip: "150 BP" },
					{ id: 5, text: "Camera Effects", tooltip: "50 BP" },
					{ id: 6, text: "Unlock touch-up feature", tooltip: "150 BP" },
					{ id: 7, text: "Unlock lock-on feature for Camera", tooltip: "200 BP" },
					{ id: 8, text: "Fancy Dark", tooltip: "400 BP" },
					{ id: 9, text: "Classic Futuristic", tooltip: "400 BP" },
					{ id: 10, text: "Get a speaker", tooltip: "50 BP" },
					{ id: 11, text: "Classic Futuristic", tooltip: "400 BP" },
					{ id: 12, text: "New pokemon in the Savanna Biome", tooltip: "3000 BP" },
					{ id: 13, text: "New pokemon in the Coastal Biome", tooltip: "3000 BP" },
					{ id: 14, text: "New pokemon in the Canyon Biome", tooltip: "3000 BP" },
					{ id: 15, text: "New pokemon in the Polar Biome", tooltip: "3000 BP" },
					{ id: 16, text: "New pokemon in the Savanna Biome (2)", tooltip: "3000 BP" },
					{ id: 17, text: "New pokemon in the Coastal Biome (2)", tooltip: "3000 BP" },
					{ id: 18, text: "New pokemon in the Canyon Biome (2)", tooltip: "3000 BP" },
					{ id: 19, text: "New pokemon in the Polar Biome (2)", tooltip: "3000 BP" },
				],
			},
			{
				id: 3, text: "Unlock all League Club Coaches", children: [
					{ id: 1, text: "Kathy" },
					{ id: 2, text: "Brassius" },
					{ id: 3, text: "Iono" },
					{ id: 4, text: "Kofu" },
					{ id: 5, text: "Larry" },
					{ id: 6, text: "Ryme" },
					{ id: 7, text: "Tulip" },
					{ id: 8, text: "Grusha" },
					{ id: 9, text: "Rika" },
					{ id: 10, text: "Poppy" },
					{ id: 11, text: "Clavell" },
					{ id: 12, text: "Jacq" },
					{ id: 13, text: "Raifort" },
					{ id: 14, text: "Tyme" },
					{ id: 15, text: "Salvatore" },
					{ id: 16, text: "Dendra" },
					{ id: 17, text: "Hassel" },
					{ id: 18, text: "Saguaro" },
					{ id: 19, text: "Miriam" },
					{ id: 20, text: "Geeta" },
					{ id: 21, text: "Nemona" },
					{ id: 22, text: "Arven" },
					{ id: 23, text: "Penny" },
				],
			},
		],
		collectables: [
			{ id: 1, text: "Obtain the Diploma", tooltip: "Blueberry Academy entrance\nReward for completing the Blueberry Pokédex" },
			{
				id: 2, text: "Obtain all Key Items", children: [
					{ id: 1, text: "Mark Charm", img: () => keyItem("mark-charm"), tooltip: "Given by Director Cyrano after completing the Blueberry Pokédex\nIncreases the chance of finding Marked Pokémon in the wild" },
					{ id: 2, text: "Scarlet/Violet Book" },
					{ id: 3, text: "Synchronization Machine" },
				],
			},
			{
				id: 3, text: "Get all emotes", children: [
					{ id: 1, text: "Glow Stick Dance" },
					{ id: 2, text: "Hasta la Vistar" },
					{ id: 3, text: "Looking Good" },
				],
			},
		],
		thms: [
			{ id: 1, text: "Unlock Fly" },
		],
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
		catching: overrideTasks(TASKS_BY_SECTION.catching, {
			2: {
				4: { text: "Catch Raikou" },
				5: { text: "Catch Entei" },
				6: { text: "Catch Suicune" },
				7: { text: "Trade Lugia" },
				8: { text: "Catch Ho-Oh" },
				9: { text: "Trade Latias" },
				10: { text: "Catch Latios" },
				11: { text: "Trade Kyogre" },
				12: { text: "Catch Groudon" },
				13: { text: "Catch Rayquaza" },
				14: { text: "Trade Cobalion" },
				15: { text: "Trade Terrakion" },
				16: { text: "Trade Virizion" },
				17: { text: "Catch Reshiram" },
				18: { text: "Trade Zekrom" },
				19: { text: "Catch Kyurem" },
				20: { text: "Catch Solgaleo" },
				21: { text: "Trade Lunala" },
				22: { text: "Catch Necrozma" },
				24: { text: "Catch Glastrier" },
				25: { text: "Trade Spectrier" },
			},
			3: {
				1: { text: "Gouging Fire", img: ({ gameKey }) => baseSprite(gameKey, 1020) },
				2: { text: "Raging Bolt", img: ({ gameKey }) => baseSprite(gameKey, 1021) },
			},
		}),
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
		catching: overrideTasks(TASKS_BY_SECTION.catching, {
			2: {
				4: { text: "Trade Raikou" },
				5: { text: "Trade Entei" },
				6: { text: "Trade Suicune" },
				7: { text: "Catch Lugia" },
				8: { text: "Trade Ho-Oh" },
				9: { text: "Catch Latias" },
				10: { text: "Trade Latios" },
				11: { text: "Catch Kyogre" },
				12: { text: "Trade Groudon" },
				13: { text: "Catch Rayquaza" },
				14: { text: "Catch Cobalion" },
				15: { text: "Catch Terrakion" },
				16: { text: "Catch Virizion" },
				17: { text: "Trade Reshiram" },
				18: { text: "Catch Zekrom" },
				19: { text: "Catch Kyurem" },
				20: { text: "Trade Solgaleo" },
				21: { text: "Catch Lunala" },
				22: { text: "Catch Necrozma" },
				24: { text: "Trade Glastrier" },
				25: { text: "Catch Spectrier" },
			},
			3: {
				1: { text: "Iron Boulder", img: ({ gameKey }) => baseSprite(gameKey, 1022) },
				2: { text: "Iron Crown", img: ({ gameKey }) => baseSprite(gameKey, 1023) },
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
