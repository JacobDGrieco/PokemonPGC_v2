(() => {
	const natiId = 541;
	const nameVal = "Swadloon";
	const games = gameSearch("gen5", "gen6", "gen7", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
