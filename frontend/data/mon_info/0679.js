(() => {
	const natiId = 679;
	const nameVal = "Honedge";
	const games = gameSearch("gen6", "gen7", "swsh", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
