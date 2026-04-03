(() => {
	const natiId = 825;
	const nameVal = "Dottler";
	const games = gameSearch("swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
