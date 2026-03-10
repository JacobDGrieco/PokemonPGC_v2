(() => {
	const natiId = 219;
	const nameVal = "Magcargo";
	const games = gameSearch("gen2", "gen3", "gen4", "gen5", "gen6", "gen7", "bdsp", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
