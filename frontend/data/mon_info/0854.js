(() => {
	const natiId = 854;
	const nameVal = "Sinistea";
	const games = gameSearch("swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
