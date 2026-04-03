(() => {
	const natiId = 806;
	const nameVal = "Blacephalon";
	const games = gameSearch("usum", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
