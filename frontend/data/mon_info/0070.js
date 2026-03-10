(() => {
	const natiId = 70;
	const nameVal = "Weepinbell";
	const games = gameSearch("gen1", "gen2", "gen3", "gen4", "gen5", "gen6", "gen7", "lgpe", "bdsp", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
