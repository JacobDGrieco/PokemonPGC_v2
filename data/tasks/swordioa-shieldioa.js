import {
	_keyItem,
	_task,
	_trainerCard,
	_frontSprite,
	range,
	defineTasksMany,
	overrideTasks,
} from '../helpers/index.js';

(() => {
	const gen = 8;
	const GAME_KEYS = ["swordioa", "shieldioa"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const keyItem = (name) => _keyItem(gen, name);
	const task = (gameKey, name) => _task(gameKey, name);
	const trainerCard = (gameKey, type, name) => _trainerCard(gameKey, type, name);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "sideQuests", title: "Side Quests" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "trainerCards", title: "Trainer Card" },
		{ id: "fashion", title: "Fashion" },
		{ id: "extraCredit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		catching: [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Obtain Kubfu", img: ({ gameKey }) => baseSprite(gameKey, 891), tooltip: "Master Dojo\nReward for clearing Mustard's three trials" },
				],
			},
			{
				id: 2, text: "Obtain all In-Game Gift Pokémon", children: [
					{
						id: 1, text: "Bulbasaur/Squirtle", img: ({ gameKey }) => task(gameKey, "kanto-starter"), tooltip: "Honey's gift after clearing the first trial\nBoth have the Gigantamax Factor", eithers: {
							1: { text: "" }, 2: { text: "" },
						},
					},
					{ id: 2, text: "Kubfu", img: ({ gameKey }) => baseSprite(gameKey, 891), tooltip: "Mustard's gift after clearing the third trial" },
					{ id: 3, text: "Porygon", img: ({ gameKey }) => baseSprite(gameKey, 137), tooltip: "Hyde's gift after defeating Mustard at the Battle Court" },
					{ id: 4, text: "Alolan Meowth", img: ({ gameKey }) => baseSprite(gameKey, "0052-a"), tooltip: "Diglett reward for finding 5 Alolan Diglett" },
					{ id: 5, text: "Slowpoke", img: ({ gameKey }) => baseSprite(gameKey, 79), tooltip: "Diglett reward for finding 10 Alolan Diglett" },
					{ id: 6, text: "Alolan Vulpix", img: ({ gameKey }) => baseSprite(gameKey, "0037-a"), tooltip: "Diglett reward for finding 20 Alolan Diglett" },
					{ id: 7, text: "Alolan Sandshrew", img: ({ gameKey }) => baseSprite(gameKey, "0027-a"), tooltip: "Diglett reward for finding 30 Alolan Diglett" },
					{ id: 8, text: "Alolan Raichu", img: ({ gameKey }) => baseSprite(gameKey, "0026-a"), tooltip: "Diglett reward for finding 40 Alolan Diglett" },
					{ id: 9, text: "Alolan Marowak", img: ({ gameKey }) => baseSprite(gameKey, "0105-a"), tooltip: "Diglett reward for finding 50 Alolan Diglett" },
					{ id: 10, text: "Alolan Exeggutor", img: ({ gameKey }) => baseSprite(gameKey, "0103-a"), tooltip: "Diglett reward for finding 75 Alolan Diglett" },
					{
						id: 11, text: "Rowlet/Litten/Popplio", img: ({ gameKey }) => task(gameKey, "alola-starter"), tooltip: "Diglett reward for finding 100 Alolan Diglett\nThe gift depends on your Galar starter", eithers: {
							1: { text: "" }, 2: { text: "" }, 3: { text: "" },
						},
					},
					{ id: 12, text: "Alolan Diglett", img: ({ gameKey }) => baseSprite(gameKey, "0050-a"), tooltip: "Diglett reward for finding all 150 Alolan Diglett" },
				],
			},
		],
		story: [
			{
				id: 1, text: "Beat the amin story", children: [
					{ id: 1, text: "Join the Master Dojo", tooltip: "Receive the Dojo Uniform and the Exp. Charm" },
					{ id: 2, text: "Clear Trial 1", tooltip: "Soothing Wetlands" },
					{ id: 3, text: "Clear Trial 2", tooltip: "Warm-Up Tunnel" },
					{ id: 4, text: "Clear Trial 3", tooltip: "Your rival cheats before the Dynamax battle" },
					{ id: 5, text: "Obtain Kubfu", tooltip: "Mustard reveals the 'secret armor' of the dojo" },
					{ id: 6, text: "Clear the Tower of Darkness/Waters", tooltip: "Only Kubfu may enter\nYour choice determines Urshifu's form" },
					{ id: 7, text: "Evolve Kubfu into Urshifu", tooltip: "Read the Scroll of Darkness or Scroll of Waters" },
				],
			},
			{
				id: 2, text: "Complete the Epilogue: Gigantamax Urshifu", children: [
					{ id: 1, text: "Become Champion and finish the Sordward & Shielbert postgame", tooltip: "Required before Mustard's postgame quest begins" },
					{ id: 2, text: "Meet Hop at the Master Dojo", tooltip: "Starts the Max Honey investigation" },
					{ id: 3, text: "Investigate the nectar trail in the Forest of Focus", tooltip: "Follow Hop's clues to Honeycalm Island" },
					{ id: 4, text: "Defeat the Dynamax Vespiquen at Honeycalm Island", tooltip: "Max Raid Battle" },
					{ id: 5, text: "Give Urshifu the special Max Soup", tooltip: "Uses Max Honey plus Max Mushrooms" },
					{ id: 6, text: "Defeat Mustard's full-power battle", tooltip: "Battle Court\nMustard uses Gigantamax Urshifu" },
				],
			},
		],
		sideQuests: [
			{ id: 1, text: "Find all 150 Alolan Diglett", tiers: [range(1, 150)], tooltip: "Talk to the Diglett Trainer in the Fields of Honor\nReward milestones give Alolan and other gift Pokémon" },
		],
		battle: [
			{ id: 1, text: "Defeat Honey", tooltip: "Unlocked after donating 1,000,000 Watts to the dojo" },
			{
				id: 2, text: "Complete Restricted Sparring for all 18 types", tooltip: "Win 5 battles with each type to earn the Masterly Mustard Casual Tee", children: [
					{ id: 1, text: "Normal" },
					{ id: 2, text: "Fire" },
					{ id: 3, text: "Water" },
					{ id: 4, text: "Electric" },
					{ id: 5, text: "Grass" },
					{ id: 6, text: "Ice" },
					{ id: 7, text: "Fighting" },
					{ id: 8, text: "Poison" },
					{ id: 9, text: "Ground" },
					{ id: 10, text: "Flying" },
					{ id: 11, text: "Psychic" },
					{ id: 12, text: "Bug" },
					{ id: 13, text: "Rock" },
					{ id: 14, text: "Ghost" },
					{ id: 15, text: "Dragon" },
					{ id: 16, text: "Dark" },
					{ id: 17, text: "Steel" },
					{ id: 18, text: "Fairy" },
				],
			},
		],
		upgrades: [
			{ id: 1, text: "Unlock the Cram-o-matic", tooltip: "Give Hyde 500 Watts in Mustard's room" },
			{
				id: 2, text: "Upgrade the Master Dojo", children: [
					{ id: 1, text: "Hair Stylist", tooltip: "5,000 Watts" },
					{ id: 2, text: "Install the Rotomi", tooltip: "10,000 Watts" },
					{ id: 3, text: "Fix the Rotomi", tooltip: "20,000 Watts" },
					{ id: 4, text: "Add the drinks vending machine", tooltip: "30,000 Watts" },
					{ id: 5, text: "Add Soda Pop to the vending machine", tooltip: "40,000 Watts" },
					{ id: 6, text: "Add Lemonade to the vending machine", tooltip: "50,000 Watts" },
					{ id: 7, text: "Unlock bulk ingredients", tooltip: "100,000 Watts" },
					{ id: 8, text: "Unlock vitamins vending machine", tooltip: "200,000 Watts" },
					{ id: 9, text: "Add Calcium and Zinc", tooltip: "300,000 Watts" },
					{ id: 10, text: "Add HP Up and Carbos", tooltip: "400,000 Watts" },
					{ id: 11, text: "Master Dojo Kitchen background", tooltip: "500,000 Watts" },
					{ id: 12, text: "Honey's League Card", tooltip: "800,000 Watts" },
					{ id: 13, text: "Unlock Honey's battle", tooltip: "1,000,000 Watts" },
					{ id: 14, text: "Honey's rare League Card", tooltip: "3,280,000 Watts" },
				],
			},
		],
		collectables: [
			{
				id: 1, text: "Collect all Key Items", children: [
					{ id: 1, text: "Armor Pass", img: () => keyItem("armor-pass"), tooltip: "Lets you travel to the Isle of Armor from Wedgehurst Station" },
					{ id: 2, text: "Exp. Charm", img: () => keyItem("exp-charm"), tooltip: "Hyde's gift when you first arrive at the Master Dojo" },
					{ id: 3, text: "Style Card", img: () => keyItem("style-card"), tooltip: "Reward for defeating Klara/Avery at Fields of Honor" },
					{ id: 4, text: "Mark Charm", img: () => keyItem("mark-charm"), tooltip: "Armor Station\nReward for completing the Isle of Armor Pokedex" },
				],
			},
			{ id: 3, text: "Obtain the Diploma", tooltip: "Armor Station\nReward for completing the Isle of Armor Pokedex" },
		],
		trainerCards: [
			{
				id: 1, text: "Obtain all Regular League Cards", children: [
					{ id: 1, text: "Mustard", tooltip: "Towers of Two Fists" },
					{ id: 2, text: "Honey", tooltip: "Master Dojo" },
					{ id: 3, text: "Klara/Avery", tooltip: "Battle Court" },
				]
			},
			{
				id: 2, text: "Obtain all Rare League Cards", children: [
					{ id: 1, text: "Mustard", tooltip: "Battle Court" },
					{ id: 2, text: "Honey", tooltip: "Fields of Honor" },
					{ id: 3, text: "Klara/Avery", tooltip: "Potbottom Desert" },
				]
			},
			{
				id: 3, text: "Obtain all League Card Backgrounds", children: [
					{ id: 1, text: "Master Dojo (Kitchen)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "master-dojo-kitchen") },
					{ id: 2, text: "Master Dojo", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "master-dojo") },
					{ id: 3, text: "Master Dojo (Night)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "master-dojo-night") },
					{ id: 4, text: "Master Dojo (Path)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "master-dojo-path") },
					{ id: 5, text: "Master Dojo (Dojo)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "master-dojo-dojo") },
					{ id: 6, text: "Cram-o-matic", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "cram-o-matic") },
					{ id: 7, text: "Tower of Darkness/Waters", img: ({ gameKey }) => [trainerCard(gameKey, "backgrounds", "tower-of-darkness"), trainerCard(gameKey, "backgrounds", "tower-of-waters")] },
					{ id: 8, text: "Tower of Darkness/Waters (Night)", img: ({ gameKey }) => [trainerCard(gameKey, "backgrounds", "tower-of-darkness-night"), trainerCard(gameKey, "backgrounds", "tower-of-waters-night")] },
					{ id: 9, text: "Soothing Wetlands", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "soothing-wetlands") },
					{ id: 10, text: "Soothing Wetlands (Night)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "soothing-wetlands-night") },
					{ id: 11, text: "Loop Lagoon", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "loop-lagoon") },
					{ id: 12, text: "Loop Lagoon (Night)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "loop-lagoon-night") },
					{ id: 13, text: "Workout Sea", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "workout-sea") },
					{ id: 14, text: "Workout Sea (Night)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "workout-sea-night") },
					{ id: 15, text: "Forest of Focus", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "forest-of-focus") },
					{ id: 16, text: "Forest of Focus (Night)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "forest-of-focus-night") },
					{ id: 17, text: "Potbottom Desert", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "potbottom-desert") },
					{ id: 18, text: "Potbottom Desert (Night)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "potbottom-desert-night") },
					{ id: 19, text: "Honeycalm Island", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "honeycalm-island") },
					{ id: 20, text: "Honeycalm Island (Night)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "honeycalm-island-night") },
					{ id: 21, text: "Master Dojo (Logo)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "master-dojo-logo") },
				]
			},
			{
				id: 4, text: "Obtain all League Card Effects", children: [
					{ id: 1, text: "Effect 21", img: ({ gameKey }) => trainerCard(gameKey, "effects", "22") },
					{ id: 2, text: "Effect 22", img: ({ gameKey }) => trainerCard(gameKey, "effects", "23") },
					{ id: 3, text: "Effect 23", img: ({ gameKey }) => trainerCard(gameKey, "effects", "24") },
				]
			},
			{
				id: 5, text: "Obtain all League Card Frames", children: [
					{ id: 1, text: "Frame 18", img: ({ gameKey }) => trainerCard(gameKey, "frames", "20") },
					{ id: 2, text: "Frame 19", img: ({ gameKey }) => trainerCard(gameKey, "frames", "21") },
					{ id: 3, text: "Frame 20", img: ({ gameKey }) => trainerCard(gameKey, "frames", "22") },
					{ id: 4, text: "Frame 21", img: ({ gameKey }) => trainerCard(gameKey, "frames", "23") },
				]
			},
		],
		extraCredit: [
			{
				id: 1, text: "Obtain all Event Mythical Pokémon", children: [
					{ id: 1, text: "Zarude", img: ({ gameKey }) => baseSprite(gameKey, 893) },
				],
			},
		]
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
		trainerCards: overrideTasks(TASKS_BY_SECTION.trainerCards, {
			1: {
				3: { text: "Klara", tooltip: "Battle Court" },
			},
			2: {
				3: { text: "Klara", tooltip: "Potbottom Desert" },
			},
		}),
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
		trainerCards: overrideTasks(TASKS_BY_SECTION.trainerCards, {
			1: {
				3: { text: "Avery", tooltip: "Battle Court" },
			},
			2: {
				3: { text: "Avery", tooltip: "Potbottom Desert" },
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
