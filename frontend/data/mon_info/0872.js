(() => {
	const natiId = 872;
	const nameVal = "Snom";
	const games = gameSearch("swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
