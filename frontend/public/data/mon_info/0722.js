(() => {
	const natiId = 722;
	const nameVal = "Rowlet";
	const games = gameSearch("gen7", "la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
