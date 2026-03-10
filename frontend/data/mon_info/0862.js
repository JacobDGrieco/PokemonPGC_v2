(() => {
	const natiId = 862;
	const nameVal = "Obstagoon";
	const games = gameSearch("swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
