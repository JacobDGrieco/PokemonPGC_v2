(() => {
	const natiId = 800;
	const nameVal = "Necrozma";
	const games = gameSearch("gen7", "swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
