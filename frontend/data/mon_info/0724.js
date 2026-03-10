(() => {
	const natiId = 724;
	const nameVal = "Decidueye";
	const games = gameSearch("gen7", "la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
