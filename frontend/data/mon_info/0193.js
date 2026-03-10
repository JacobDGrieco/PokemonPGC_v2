(() => {
	const natiId = 193;
	const nameVal = "Yanma";
	const games = gameSearch("gen2", "gen3", "gen4", "gen5", "gen6", "gen7", "bdsp", "la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
