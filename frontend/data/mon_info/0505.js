(() => {
	const natiId = 505;
	const nameVal = "Watchog";
	const games = gameSearch("gen5", "gen6", "gen7", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
