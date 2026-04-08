import {
  _heldItem,
  _hm,
  _keyItem,
  _tm,
  _task,
  _badges,
  _frontSprite,
  _frontSpriteShiny,
  defineTasksMany,
  range,
} from '../helpers/index.js';

(() => {
	const gen = 1;
	const GAME_KEYS = ["red", "blue"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const shinySprite = (gameKey, natiId) => _frontSpriteShiny(gen, gameKey, natiId);
	const bwTask = (gameKey, name) => _task(gameKey, name, false);
	const coloredTask = (gameKey, name) => _task(gameKey, name, true);
	const heldItem = (name) => _heldItem(gen, name);
	const keyItem = (name) => _keyItem(gen, name);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "collectables", title: "Collectables" },
		{ id: "thms", title: "TMs/HMs" },
		{ id: "extra-credit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch Articuno", img: ({ gameKey }) => baseSprite(gameKey, 144), imgS: ({ gameKey }) => shinySprite(gameKey, 144), tooltip: "Found at the bottom of the Seafoam Islands" },
					{ id: 2, text: "Catch Zapdos", img: ({ gameKey }) => baseSprite(gameKey, 145), imgS: ({ gameKey }) => shinySprite(gameKey, 145), tooltip: "Found at the end of the Power Plant" },
					{ id: 3, text: "Catch Moltres", img: ({ gameKey }) => baseSprite(gameKey, 146), imgS: ({ gameKey }) => shinySprite(gameKey, 146), tooltip: "Found in the middle of Victory Road" },
					{ id: 4, text: "Catch Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150), imgS: ({ gameKey }) => shinySprite(gameKey, 150), tooltip: "Found at the bottom of Cerulean Cave" },
				],
			},
			{
				id: 2, text: "Catch both Snorlax", children: [
					{ id: 1, text: "Route 12", img: ({ gameKey }) => bwTask(gameKey, "snorlax-12"), imgS: ({ gameKey }) => coloredTask(gameKey, "snorlax-12") },
					{ id: 2, text: "Route 16", img: ({ gameKey }) => bwTask(gameKey, "snorlax-16"), imgS: ({ gameKey }) => coloredTask(gameKey, "snorlax-16") },
				],
			},
			{
				id: 3, text: "Obtain all In-Game Gift Pokémon", children: [
					{
						id: 1, text: "Hitmonlee/Hitmonchan", img: ({ gameKey }) => bwTask(gameKey, "hitmonlee-hitmonchan"), imgS: ({ gameKey }) => coloredTask(gameKey, "hitmonlee-hitmonchan"), eithers: {
							1: { text: "" }, 2: { text: "" },
						},
					},
					{
						id: 2, text: "Omanyte/Kabuto", img: ({ gameKey }) => bwTask(gameKey, "omanyte-kabuto"), imgS: ({ gameKey }) => coloredTask(gameKey, "omanyte-kabuto"), eithers: {
							1: { text: "" }, 2: { text: "" },
						},
					},
					{ id: 3, text: "Lapras", img: ({ gameKey }) => baseSprite(gameKey, 131), imgS: ({ gameKey }) => shinySprite(gameKey, 131) },
					{ id: 4, text: "Aerodactyl", img: ({ gameKey }) => baseSprite(gameKey, 142), imgS: ({ gameKey }) => shinySprite(gameKey, 142) },
					{ id: 5, text: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133) },
				],
			},
			{
				id: 4, text: "Complete all In-Game Trades", children: [
					{ id: 1, text: "Abra for Mr. Mime", img: ({ gameKey }) => bwTask(gameKey, "abra-for-mrmime"), imgS: ({ gameKey }) => coloredTask(gameKey, "abra-for-mrmime") },
					{ id: 2, text: "Nidoran ♂ for Nidoran ♀", img: ({ gameKey }) => bwTask(gameKey, "nidoranm-for-nidoranf"), imgS: ({ gameKey }) => coloredTask(gameKey, "nidoranm-for-nidoranf") },
					{ id: 3, text: "Nidorino for Nidorina", img: ({ gameKey }) => bwTask(gameKey, "nidorino-for-nidorina"), imgS: ({ gameKey }) => coloredTask(gameKey, "nidorino-for-nidorina") },
					{ id: 4, text: "Slowbro for Lickitung", img: ({ gameKey }) => bwTask(gameKey, "slowbro-for-lickitung"), imgS: ({ gameKey }) => coloredTask(gameKey, "slowbro-for-lickitung") },
					{ id: 5, text: "Poliwhirl for Jynx", img: ({ gameKey }) => bwTask(gameKey, "poliwhirl-for-jynx"), imgS: ({ gameKey }) => coloredTask(gameKey, "poliwhirl-for-jynx") },
					{ id: 6, text: "Spearow for Farfetch'd", img: ({ gameKey }) => bwTask(gameKey, "spearow-for-farfetchd"), imgS: ({ gameKey }) => coloredTask(gameKey, "spearow-for-farfetchd") },
					{ id: 7, text: "Ponyta for Seel", img: ({ gameKey }) => bwTask(gameKey, "ponyta-for-seel"), imgS: ({ gameKey }) => coloredTask(gameKey, "ponyta-for-seel") },
					{ id: 8, text: "Raichu for Electrode", img: ({ gameKey }) => bwTask(gameKey, "raichu-for-electrode"), imgS: ({ gameKey }) => coloredTask(gameKey, "raichu-for-electrode") },
					{ id: 9, text: "Venonant for Tangela", img: ({ gameKey }) => bwTask(gameKey, "venonat-for-tangela"), imgS: ({ gameKey }) => coloredTask(gameKey, "venonat-for-tangela") },
				],
			},
		],
		"story": [
			{ id: 1, text: "Collect all 8 Gym Badges and Defeat the Elite 4", img: () => _badges(["boulder", "cascade", "thunder", "rainbow", "soul", "marsh", "volcano", "earth"]), noCenter: true },
			{
				id: 2, text: "Epilogue", noCenter: true, children: [
					{ id: 1, text: "Catch Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150), imgS: ({ gameKey }) => shinySprite(gameKey, 150), tooltip: "Found at the bottom of Cerulean Cave" },
				],
			},
		],
		"collectables": [
			{
				id: 1, text: "Obtain all Key Items", children: [
					{ id: 1, text: "Coin Case", img: () => keyItem("coin-case") },
					{ id: 2, text: "Exp. All", img: () => heldItem("exp-all") },
					{ id: 3, text: "Good Rod", img: () => keyItem("good-rod") },
					{ id: 4, text: "Item Finder", img: () => keyItem("item-finder") },
					{ id: 5, text: "Old Rod", img: () => keyItem("old-rod") },
					{ id: 6, text: "Poke Flute", img: () => keyItem("poke-flute") },
					{ id: 7, text: "Super Rod", img: () => keyItem("super-rod") },
				]
			},
			{ id: 2, text: "Find all hidden items with the Item Finder", img: () => keyItem("item-finder"), noCenter: true, type: "tiered", tiers: [range(1, 54)], },
		],
		"thms": [
			{
				id: 1, text: "Collect all HMs", children: [
					{ id: 1, text: "HM01: Cut", img: () => hm("normal") },
					{ id: 2, text: "HM02: Fly", img: () => hm("flying") },
					{ id: 3, text: "HM03: Surf", img: () => hm("water") },
					{ id: 4, text: "HM04: Strength", img: () => hm("normal") },
					{ id: 5, text: "HM05: Flash", img: () => hm("normal") },
				],
			},
			{
				id: 2, text: "Collect all TMs", children: [
					{ id: 1, text: "TM 01 - Mega Punch", img: () => tm("normal") },
					{ id: 2, text: "TM 02 - Razor Wind", img: () => tm("normal") },
					{ id: 3, text: "TM 03 - Swords Dance", img: () => tm("normal") },
					{ id: 4, text: "TM 04 - Whirlwind", img: () => tm("normal") },
					{ id: 5, text: "TM 05 - Mega Kick", img: () => tm("normal") },
					{ id: 6, text: "TM 06 - Toxic", img: () => tm("poison") },
					{ id: 7, text: "TM 07 - Horn Drill", img: () => tm("normal") },
					{ id: 8, text: "TM 08 - Body Slam", img: () => tm("normal") },
					{ id: 9, text: "TM 09 - Take Down", img: () => tm("normal") },
					{ id: 10, text: "TM 10 - Double-Edge", img: () => tm("normal") },
					{ id: 11, text: "TM 11 - Bubble Beam", img: () => tm("water") },
					{ id: 12, text: "TM 12 - Water Gun", img: () => tm("water") },
					{ id: 13, text: "TM 13 - Ice Beam", img: () => tm("ice") },
					{ id: 14, text: "TM 14 - Blizzard", img: () => tm("ice") },
					{ id: 15, text: "TM 15 - Hyper Beam", img: () => tm("normal") },
					{ id: 16, text: "TM 16 - Pay Day", img: () => tm("normal") },
					{ id: 17, text: "TM 17 - Submission", img: () => tm("fighting") },
					{ id: 18, text: "TM 18 - Counter", img: () => tm("fighting") },
					{ id: 19, text: "TM 19 - Seismic Toss", img: () => tm("fighting") },
					{ id: 20, text: "TM 20 - Rage", img: () => tm("normal") },
					{ id: 21, text: "TM 21 - Mega Drain", img: () => tm("grass") },
					{ id: 22, text: "TM 22 - Solar Beam", img: () => tm("grass") },
					{ id: 23, text: "TM 23 - Dragon Rage", img: () => tm("dragon") },
					{ id: 24, text: "TM 24 - Thunderbolt", img: () => tm("electric") },
					{ id: 25, text: "TM 25 - Thunder", img: () => tm("electric") },
					{ id: 26, text: "TM 26 - Earthquake", img: () => tm("ground") },
					{ id: 27, text: "TM 27 - Fissure", img: () => tm("ground") },
					{ id: 28, text: "TM 28 - Dig", img: () => tm("ground") },
					{ id: 29, text: "TM 29 - Psychic", img: () => tm("psychic") },
					{ id: 30, text: "TM 30 - Teleport", img: () => tm("psychic") },
					{ id: 31, text: "TM 31 - Mimic", img: () => tm("normal") },
					{ id: 32, text: "TM 32 - Double Team", img: () => tm("normal") },
					{ id: 33, text: "TM 33 - Reflect", img: () => tm("psychic") },
					{ id: 34, text: "TM 34 - Bide", img: () => tm("normal") },
					{ id: 35, text: "TM 35 - Metronome", img: () => tm("normal") },
					{ id: 36, text: "TM 36 - Self-Destruct", img: () => tm("normal") },
					{ id: 37, text: "TM 37 - Egg Bomb", img: () => tm("normal") },
					{ id: 38, text: "TM 38 - Fire Blast", img: () => tm("fire") },
					{ id: 39, text: "TM 39 - Swift", img: () => tm("normal") },
					{ id: 40, text: "TM 40 - Skull Bash", img: () => tm("normal") },
					{ id: 41, text: "TM 41 - Soft-Boiled", img: () => tm("normal") },
					{ id: 42, text: "TM 42 - Dream Eater", img: () => tm("psychic") },
					{ id: 43, text: "TM 43 - Sky Attack", img: () => tm("flying") },
					{ id: 44, text: "TM 44 - Rest", img: () => tm("psychic") },
					{ id: 45, text: "TM 45 - Thunder Wave", img: () => tm("electric") },
					{ id: 46, text: "TM 46 - Psywave", img: () => tm("psychic") },
					{ id: 47, text: "TM 47 - Explosion", img: () => tm("normal") },
					{ id: 48, text: "TM 48 - Rock Slide", img: () => tm("rock") },
					{ id: 49, text: "TM 49 - Tri Attack", img: () => tm("normal") },
					{ id: 50, text: "TM 50 - Substitute", img: () => tm("normal") },
				]
			},
		],
		"extra-credit": [
			{ id: 1, text: "Obtain Mew", img: ({ gameKey }) => baseSprite(gameKey, 151), imgS: ({ gameKey }) => shinySprite(gameKey, 151) },
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