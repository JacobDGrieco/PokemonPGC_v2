(() => {
	const natiId = 501;
	const nameVal = "Oshawott";
	const games = gameSearch("gen5", "gen6", "gen7", "la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
