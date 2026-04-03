(() => {
	const natiId = 518;
	const nameVal = "Musharna";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
