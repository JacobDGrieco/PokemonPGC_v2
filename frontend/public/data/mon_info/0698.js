(() => {
	const natiId = 698;
	const nameVal = "Amaura";
	const games = gameSearch("gen6", "gen7", "swsh", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
