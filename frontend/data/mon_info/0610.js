(() => {
	const natiId = 610;
	const nameVal = "Axew";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
