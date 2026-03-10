(() => {
	const natiId = 498;
	const nameVal = "Tepig";
	const games = gameSearch("gen5", "gen6", "gen7", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
