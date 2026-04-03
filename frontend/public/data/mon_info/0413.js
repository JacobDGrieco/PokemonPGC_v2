(() => {
	const natiId = 413;
	const nameVal = "Wormadam";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "bdsp", "la");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
