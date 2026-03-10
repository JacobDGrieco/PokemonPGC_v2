(() => {
	const gen = 8.5;
	const GAME_KEYS = ["legendsarceus"];

	const baseSpriteIcon = (gameKey, natiId) => _iconSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "side-quests", title: "Side Quests" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "fashion", title: "Fashion" },
		{ id: "thms", title: "Ride Pokemon" },
		{ id: "distributions", title: "Distributions" },
		{ id: "extra-credit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch Dialga", img: ({ gameKey }) => baseSpriteIcon(gameKey, 483) },
					{ id: 2, text: "Catch Palkia", img: ({ gameKey }) => baseSpriteIcon(gameKey, 484) },
					{ id: 3, text: "Catch Giratina", img: ({ gameKey }) => baseSpriteIcon(gameKey, 487) },
				],
			},
		],
		"thms": [
			{ id: 1, text: "Wydeer", img: ({ gameKey }) => baseSpriteIcon(gameKey, 899) },
			{ id: 2, text: "Ursaluna", img: ({ gameKey }) => baseSpriteIcon(gameKey, 901) },
			{ id: 3, text: "Basculegion", img: ({ gameKey }) => baseSpriteIcon(gameKey, 902) },
			{ id: 4, text: "Sneasler", img: ({ gameKey }) => baseSpriteIcon(gameKey, 903) },
			{ id: 5, text: "Braviary", img: ({ gameKey }) => baseSpriteIcon(gameKey, "628-h") },
		],
	};

	window.defineTasksMany(GAME_KEYS, SECTIONS, TASKS_BY_SECTION);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();