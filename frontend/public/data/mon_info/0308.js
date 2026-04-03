(() => {
	const natiId = 308;
	const nameVal = "Medicham";
	const games = gameSearch("gen3", "gen4", "gen5", "gen6", "gen7", "bdsp", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
