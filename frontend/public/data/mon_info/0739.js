(() => {
	const natiId = 739;
	const nameVal = "Crabrawler";
	const games = gameSearch("gen7", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
