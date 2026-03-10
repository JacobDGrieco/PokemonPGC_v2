(() => {
	const natiId = 1004;
	const nameVal = "Chi-Yu";
	const games = gameSearch("scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
