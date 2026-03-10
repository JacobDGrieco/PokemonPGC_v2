(() => {
	const natiId = 658;
	const nameVal = "Greninja";
	const games = gameSearch("gen6", "gen7", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
