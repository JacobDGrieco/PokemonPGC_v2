(() => {
	const natiId = 502;
	const nameVal = "Dewott";
	const games = gameSearch("gen5", "gen6", "gen7", "la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
