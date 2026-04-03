(() => {
	const natiId = 469;
	const nameVal = "Yanmega";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "bdsp", "la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
