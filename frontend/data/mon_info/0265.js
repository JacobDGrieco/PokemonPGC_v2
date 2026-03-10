(() => {
	const natiId = 265;
	const nameVal = "Wurmple";
	const games = gameSearch("gen3", "gen4", "gen5", "gen6", "gen7", "bdsp", "la");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
