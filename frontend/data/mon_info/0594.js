(() => {
	const natiId = 594;
	const nameVal = "Alomomola";
	const games = gameSearch("gen5", "gen6", "gen7", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
