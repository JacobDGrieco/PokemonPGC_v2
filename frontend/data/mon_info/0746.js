(() => {
	const natiId = 746;
	const nameVal = "Wishiwashi";
	const games = gameSearch("gen7", "swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
