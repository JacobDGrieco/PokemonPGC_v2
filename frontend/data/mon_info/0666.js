(() => {
	const natiId = 666;
	const nameVal = "Vivillon";
	const games = gameSearch("gen6", "gen7", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
