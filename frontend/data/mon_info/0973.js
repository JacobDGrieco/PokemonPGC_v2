(() => {
	const natiId = 973;
	const nameVal = "Flamigo";
	const games = gameSearch("scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
