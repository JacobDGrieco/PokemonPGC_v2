(() => {
	const natiId = 277;
	const nameVal = "Swellow";
	const games = gameSearch("gen3", "gen4", "gen5", "gen6", "gen7", "bdsp");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
