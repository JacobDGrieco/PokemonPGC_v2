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
	const GAME_KEYS = ["yellow"];

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
		{ id: "activities", title: "Activities" },
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
				id: 2, text: "Catch/Defeat all Static Encounters", children: [
					{ id: 1, text: "Route 12 Snorlax", img: ({ gameKey }) => bwTask(gameKey, "snorlax-12"), imgS: ({ gameKey }) => coloredTask(gameKey, "snorlax-12") },
					{ id: 2, text: "Route 16 Snorlax", img: ({ gameKey }) => bwTask(gameKey, "snorlax-16"), imgS: ({ gameKey }) => coloredTask(gameKey, "snorlax-16") },
					{ id: 3, text: "Pokémon Tower Marowak", img: ({ gameKey }) => baseSprite(gameKey, 105), imgS: ({ gameKey }) => shinySprite(gameKey, 105), tooltip: "Pokémon Tower 6F - must be defeated to progress" },
					{ id: 4, text: "Power Plant Electrode", img: ({ gameKey }) => baseSprite(gameKey, 101), imgS: ({ gameKey }) => shinySprite(gameKey, 101), tooltip: "Tracks both disguised Electrode in the Power Plant", type: "tiered", tiers: [range(1, 2)] },
					{ id: 5, text: "Power Plant Voltorb", img: ({ gameKey }) => baseSprite(gameKey, 100), imgS: ({ gameKey }) => shinySprite(gameKey, 100), tooltip: "Tracks all six disguised Voltorb in the Power Plant", type: "tiered", tiers: [range(1, 6)] },
				],
			},
			{
				id: 3, text: "Obtain all In-Game Gift Pokémon", children: [
					{ id: 1, text: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tooltip: "Purchased from the salesman in the Route 4 Pokémon Center" },
					{ id: 2, text: "Bulbasaur", img: ({ gameKey }) => baseSprite(gameKey, 1), imgS: ({ gameKey }) => shinySprite(gameKey, 1), tooltip: "Gift from the girl in Cerulean City if Pikachu's friendship is high enough" },
					{ id: 3, text: "Charmander", img: ({ gameKey }) => baseSprite(gameKey, 4), imgS: ({ gameKey }) => shinySprite(gameKey, 4), tooltip: "Gift from the trainer north of Route 24" },
					{ id: 4, text: "Squirtle", img: ({ gameKey }) => baseSprite(gameKey, 7), imgS: ({ gameKey }) => shinySprite(gameKey, 7), tooltip: "Gift from Officer Jenny in Vermilion City after defeating Lt. Surge" },
					{
						id: 5, text: "Hitmonlee/Hitmonchan", img: ({ gameKey }) => bwTask(gameKey, "hitmonlee-hitmonchan"), imgS: ({ gameKey }) => coloredTask(gameKey, "hitmonlee-hitmonchan"), eithers: {
							1: { text: "" }, 2: { text: "" },
						},
					},
					{
						id: 6, text: "Omanyte/Kabuto", img: ({ gameKey }) => bwTask(gameKey, "omanyte-kabuto"), imgS: ({ gameKey }) => coloredTask(gameKey, "omanyte-kabuto"), eithers: {
							1: { text: "" }, 2: { text: "" },
						},
					},
					{ id: 7, text: "Lapras", img: ({ gameKey }) => baseSprite(gameKey, 131), imgS: ({ gameKey }) => shinySprite(gameKey, 131) },
					{ id: 8, text: "Aerodactyl", img: ({ gameKey }) => baseSprite(gameKey, 142), imgS: ({ gameKey }) => shinySprite(gameKey, 142) },
					{ id: 9, text: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133) },
				],
			},
			{
				id: 4, text: "Complete all In-Game Trades", children: [
					{ id: 1, text: "Clefairy for Mr. Mime", img: ({ gameKey }) => bwTask(gameKey, "clefairy-for-mrmime"), imgS: ({ gameKey }) => coloredTask(gameKey, "clefairy-for-mrmime") },
					{ id: 2, text: "Cubone for Machoke", img: ({ gameKey }) => bwTask(gameKey, "cubone-for-machoke"), imgS: ({ gameKey }) => coloredTask(gameKey, "cubone-for-machoke") },
					{ id: 3, text: "Lickitung for Dugtrio", img: ({ gameKey }) => bwTask(gameKey, "lickitung-for-dugtrio"), imgS: ({ gameKey }) => coloredTask(gameKey, "lickitung-for-dugtrio") },
					{ id: 4, text: "Parasect for Tangela", img: ({ gameKey }) => bwTask(gameKey, "parasect-for-tangela"), imgS: ({ gameKey }) => coloredTask(gameKey, "parasect-for-tangela") },
					{ id: 5, text: "Golduck for Rhydon", img: ({ gameKey }) => bwTask(gameKey, "golduck-for-rhydon"), imgS: ({ gameKey }) => coloredTask(gameKey, "golduck-for-rhydon") },
					{ id: 6, text: "Growlithe for Dewgong", img: ({ gameKey }) => bwTask(gameKey, "growlithe-for-dewgong"), imgS: ({ gameKey }) => coloredTask(gameKey, "growlithe-for-dewgong") },
					{ id: 7, text: "Kangaskhan for Muk", img: ({ gameKey }) => bwTask(gameKey, "kangaskhan-for-muk"), imgS: ({ gameKey }) => coloredTask(gameKey, "kangaskhan-for-muk") },
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
		"activities": [
			{ id: 1, text: "Get a high-score in the Pikachu Surfing Mini-Game", tooltip: "In original Yellow, you need a Pikachu that knows Surf. In Virtual Console releases, your partner Pikachu can access it normally." },
		],
		"collectables": [
			{
				id: 1, text: "Obtain all Key Items", children: [
					{ id: 1, text: "Bicycle", img: () => keyItem("bicycle") },
					{ id: 2, text: "Card Key", img: () => keyItem("card-key") },
					{ id: 3, text: "Coin Case", img: () => keyItem("coin-case") },
					{ id: 4, text: "Exp. All", img: () => heldItem("exp-all") },
					{ id: 5, text: "Good Rod", img: () => keyItem("good-rod") },
					{ id: 6, text: "Item Finder", img: () => keyItem("item-finder") },
					{ id: 7, text: "Lift Key", img: () => keyItem("lift-key") },
					{ id: 8, text: "Old Rod", img: () => keyItem("old-rod") },
					{ id: 9, text: "Poke Flute", img: () => keyItem("poke-flute") },
					{ id: 10, text: "Secret Key", img: () => keyItem("secret-key") },
					{ id: 11, text: "Silph Scope", img: () => keyItem("silph-scope") },
					{ id: 12, text: "Super Rod", img: () => keyItem("super-rod") },
					{ id: 13, text: "Town Map", img: () => keyItem("town-map") },
				]
			},
			{ id: 2, text: "Find all hidden items with the Item Finder", img: () => keyItem("item-finder"), noCenter: true, type: "tiered", tiers: [range(1, 54)], },
			{ id: 3, text: "Collect all hidden Game Corner coins", img: () => keyItem("coin-case"), noCenter: true, type: "tiered", tiers: [range(1, 10)], tooltip: "Tracks the 10 hidden coin spots in the Celadon Game Corner" },
		],
		"thms": [
			{
				id: 1, text: "Collect all HMs", children: [
					{ id: 1, text: "HM01 (Cut)", img: () => hm("normal") },
					{ id: 2, text: "HM02 (Fly)", img: () => hm("flying") },
					{ id: 3, text: "HM03 (Surf)", img: () => hm("water") },
					{ id: 4, text: "HM04 (Strength)", img: () => hm("normal") },
					{ id: 5, text: "HM05 (Flash)", img: () => hm("normal") },
				],
			},
			{
				id: 2, text: "Collect all TMs", children: [
					{ id: 1, text: "TM01 (Mega Punch)", img: () => tm("normal") },
					{ id: 2, text: "TM02 (Razor Wind)", img: () => tm("normal") },
					{ id: 3, text: "TM03 (Swords Dance)", img: () => tm("normal") },
					{ id: 4, text: "TM04 (Whirlwind)", img: () => tm("normal") },
					{ id: 5, text: "TM05 (Mega Kick)", img: () => tm("normal") },
					{ id: 6, text: "TM06 (Toxic)", img: () => tm("poison") },
					{ id: 7, text: "TM07 (Horn Drill)", img: () => tm("normal") },
					{ id: 8, text: "TM08 (Body Slam)", img: () => tm("normal") },
					{ id: 9, text: "TM09 (Take Down)", img: () => tm("normal") },
					{ id: 10, text: "TM10 (Double-Edge)", img: () => tm("normal") },
					{ id: 11, text: "TM11 (Bubble Beam)", img: () => tm("water") },
					{ id: 12, text: "TM12 (Water Gun)", img: () => tm("water") },
					{ id: 13, text: "TM13 (Ice Beam)", img: () => tm("ice") },
					{ id: 14, text: "TM14 (Blizzard)", img: () => tm("ice") },
					{ id: 15, text: "TM15 (Hyper Beam)", img: () => tm("normal") },
					{ id: 16, text: "TM16 (Pay Day)", img: () => tm("normal") },
					{ id: 17, text: "TM17 (Submission)", img: () => tm("fighting") },
					{ id: 18, text: "TM18 (Counter)", img: () => tm("fighting") },
					{ id: 19, text: "TM19 (Seismic Toss)", img: () => tm("fighting") },
					{ id: 20, text: "TM20 (Rage)", img: () => tm("normal") },
					{ id: 21, text: "TM21 (Mega Drain)", img: () => tm("grass") },
					{ id: 22, text: "TM22 (Solar Beam)", img: () => tm("grass") },
					{ id: 23, text: "TM23 (Dragon Rage)", img: () => tm("dragon") },
					{ id: 24, text: "TM24 (Thunderbolt)", img: () => tm("electric") },
					{ id: 25, text: "TM25 (Thunder)", img: () => tm("electric") },
					{ id: 26, text: "TM26 (Earthquake)", img: () => tm("ground") },
					{ id: 27, text: "TM27 (Fissure)", img: () => tm("ground") },
					{ id: 28, text: "TM28 (Dig)", img: () => tm("ground") },
					{ id: 29, text: "TM29 (Psychic)", img: () => tm("psychic") },
					{ id: 30, text: "TM30 (Teleport)", img: () => tm("psychic") },
					{ id: 31, text: "TM31 (Mimic)", img: () => tm("normal") },
					{ id: 32, text: "TM32 (Double Team)", img: () => tm("normal") },
					{ id: 33, text: "TM33 (Reflect)", img: () => tm("psychic") },
					{ id: 34, text: "TM34 (Bide)", img: () => tm("normal") },
					{ id: 35, text: "TM35 (Metronome)", img: () => tm("normal") },
					{ id: 36, text: "TM36 (Self-Destruct)", img: () => tm("normal") },
					{ id: 37, text: "TM37 (Egg Bomb)", img: () => tm("normal") },
					{ id: 38, text: "TM38 (Fire Blast)", img: () => tm("fire") },
					{ id: 39, text: "TM39 (Swift)", img: () => tm("normal") },
					{ id: 40, text: "TM40 (Skull Bash)", img: () => tm("normal") },
					{ id: 41, text: "TM41 (Soft-Boiled)", img: () => tm("normal") },
					{ id: 42, text: "TM42 (Dream Eater)", img: () => tm("psychic") },
					{ id: 43, text: "TM43 (Sky Attack)", img: () => tm("flying") },
					{ id: 44, text: "TM44 (Rest)", img: () => tm("psychic") },
					{ id: 45, text: "TM45 (Thunder Wave)", img: () => tm("electric") },
					{ id: 46, text: "TM46 (Psywave)", img: () => tm("psychic") },
					{ id: 47, text: "TM47 (Explosion)", img: () => tm("normal") },
					{ id: 48, text: "TM48 (Rock Slide)", img: () => tm("rock") },
					{ id: 49, text: "TM49 (Tri Attack)", img: () => tm("normal") },
					{ id: 50, text: "TM50 (Substitute)", img: () => tm("normal") },
				]
			},
		],
		"extra-credit": [
			{ id: 1, text: "Obtain Mew", img: ({ gameKey }) => baseSprite(gameKey, 151), imgS: ({ gameKey }) => shinySprite(gameKey, 151) },
		],
	};

	defineTasksMany(GAME_KEYS, SECTIONS, TASKS_BY_SECTION);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();
