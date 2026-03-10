(() => {
	const natiId = 822;
	const nameVal = "Corvisquire";
	const games = gameSearch("swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
