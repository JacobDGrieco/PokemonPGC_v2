(() => {
	const natiId = 759;
	const nameVal = "Stufful";
	const games = gameSearch("gen7", "swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
