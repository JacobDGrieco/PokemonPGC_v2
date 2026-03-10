(() => {
	const gen = 8;
	const GAME_KEYS = ["swordct", "shieldct"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const trainerCard = (gameKey, type, name) => _trainerCard(gameKey, type, name);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "side-quests", title: "Side Quests" },
		{ id: "battle", title: "Battle" },
		{ id: "collectables", title: "Collectables" },
		{ id: "trainer-cards", title: "Trainer Card" },
		{ id: "fashion", title: "Fashion" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch/Trade for Glastrier", img: ({ gameKey }) => baseSprite(gameKey, 896) },
					{ id: 2, text: "Catch/Trade for Spectrier", img: ({ gameKey }) => baseSprite(gameKey, 897) },
					{ id: 3, text: "Catch Calyrex", img: ({ gameKey }) => baseSprite(gameKey, 898) },
				],
			},
		],
		"trainer-cards": [
			{
				id: 1, text: "Obtain all League Card Backgrounds", children: [
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
					{ id: 21, text: "Stow-on-Side Symbol (Fighting)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "stow-on-side-symbol-fighting") },
					{ id: 22, text: "Ballonlea Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "ballonlea-symbol") },
					{ id: 23, text: "Circhester Symbol (Rock)", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "circhester-symbol-rock") },
					{ id: 24, text: "Spikemuth Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "spikemuth-symbol") },
					{ id: 25, text: "Hammerlocke Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "hammerlocke-symbol") },
					{ id: 26, text: "Klara Symbol", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "klara-symbol") },
					{ id: 27, text: "White", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "white") },
					{ id: 28, text: "Black", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "black") },
					{ id: 29, text: "Blue", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "blue") },
					{ id: 30, text: "Red", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "red") },
					{ id: 31, text: "Yellow", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "yellow") },
					{ id: 32, text: "Green", img: ({ gameKey }) => trainerCard(gameKey, "backgrounds", "green") },
				]
			},
			{
				id: 2, text: "Obtain all League Card Effects", children: [
					{ id: 1, text: "Effect 24", img: ({ gameKey }) => trainerCard(gameKey, "effects", "25") },
					{ id: 2, text: "Effect 25", img: ({ gameKey }) => trainerCard(gameKey, "effects", "26") },
					{ id: 3, text: "Effect 26", img: ({ gameKey }) => trainerCard(gameKey, "effects", "27") },
				]
			},
			{
				id: 3, text: "Obtain all League Card Frames", children: [
					{ id: 1, text: "Frame 22", img: ({ gameKey }) => trainerCard(gameKey, "frames", "24") },
					{ id: 2, text: "Frame 23", img: ({ gameKey }) => trainerCard(gameKey, "frames", "25") },
					{ id: 3, text: "Frame 24", img: ({ gameKey }) => trainerCard(gameKey, "frames", "26") },
				]
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