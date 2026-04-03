(() => {
	const natiId = 494;
	const nameVal = "Victini";
	const games = gameSearch("gen5", "gen6", "gen7");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
