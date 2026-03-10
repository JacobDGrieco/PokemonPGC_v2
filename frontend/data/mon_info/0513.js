(() => {
	const natiId = 513;
	const nameVal = "Pansear";
	const games = gameSearch("gen5", "gen6", "gen7", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
