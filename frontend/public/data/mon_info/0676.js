(() => {
	const natiId = 676;
	const nameVal = "Furfrou";
	const games = gameSearch("gen6", "gen7", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
