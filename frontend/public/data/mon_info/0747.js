(() => {
	const natiId = 747;
	const nameVal = "Mareanie";
	const games = gameSearch("gen7", "swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
