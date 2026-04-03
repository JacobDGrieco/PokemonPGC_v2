(() => {
	const natiId = 945;
	const nameVal = "Grafaiai";
	const games = gameSearch("scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
