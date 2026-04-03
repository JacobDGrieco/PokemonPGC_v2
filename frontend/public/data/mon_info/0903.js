(() => {
	const natiId = 903;
	const nameVal = "Sneasler";
	const games = gameSearch("la");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
