(() => {
	const natiId = 398;
	const nameVal = "Staraptor";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "bdsp", "la", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
