(() => {
	const natiId = 864;
	const nameVal = "Cursola";
	const games = gameSearch("swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
