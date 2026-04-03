(() => {
	const natiId = 758;
	const nameVal = "Salazzle";
	const games = gameSearch("gen7", "swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
