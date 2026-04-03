(() => {
	const gen = "home";
	const GAME_KEYS = ["home"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "mobile", title: "Mobile Challenges" },
		{ id: "research", title: "Research Tasks" },
		{ id: "extra-credit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{ id: 1, text: "Obtain Original Color Magearna", img: ({ gameKey }) => baseSprite(gameKey, "801-o"), },
		],
	};

	window.defineTasksMany(GAME_KEYS, SECTIONS, TASKS_BY_SECTION);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();