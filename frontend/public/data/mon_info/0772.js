(() => {
	const natiId = 772;
	const nameVal = "Type: Null";
	const games = gameSearch("gen7", "swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
