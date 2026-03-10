(() => {
	const natiId = 432;
	const nameVal = "Purugly";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "bdsp", "la");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
