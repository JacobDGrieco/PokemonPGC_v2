(() => {
	const natiId = 805;
	const nameVal = "Stakataka";
	const games = gameSearch("usum", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
