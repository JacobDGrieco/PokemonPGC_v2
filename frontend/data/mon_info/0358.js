(() => {
	const natiId = 358;
	const nameVal = "Chimecho";
	const games = gameSearch("gen3", "gen4", "gen5", "gen6", "gen7", "bdsp", "la", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
