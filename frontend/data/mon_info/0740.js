(() => {
	const natiId = 740;
	const nameVal = "Crabominable";
	const games = gameSearch("gen7", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
