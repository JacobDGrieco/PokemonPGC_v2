(() => {
	const natiId = 580;
	const nameVal = "Ducklett";
	const games = gameSearch("gen5", "gen6", "gen7", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
