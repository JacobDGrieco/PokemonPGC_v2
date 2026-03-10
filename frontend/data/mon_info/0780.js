(() => {
	const natiId = 780;
	const nameVal = "Drampa";
	const games = gameSearch("gen7", "swsh", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
