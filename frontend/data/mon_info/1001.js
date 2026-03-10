(() => {
	const natiId = 1001;
	const nameVal = "Wo-Chien";
	const games = gameSearch("scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
