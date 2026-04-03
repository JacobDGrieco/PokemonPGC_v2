(() => {
	const natiId = 628;
	const nameVal = "Braviary";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh", "la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
