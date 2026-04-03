(() => {
	const natiId = 723;
	const nameVal = "Dartrix";
	const games = gameSearch("gen7", "la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
