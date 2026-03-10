(() => {
	const natiId = 793;
	const nameVal = "Nihilego";
	const games = gameSearch("gen7", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
