(() => {
	const natiId = 767;
	const nameVal = "Wimpod";
	const games = gameSearch("gen7", "swsh", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
