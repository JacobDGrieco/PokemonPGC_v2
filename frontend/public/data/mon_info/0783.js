(() => {
	const natiId = 783;
	const nameVal = "Hakamo-o";
	const games = gameSearch("gen7", "swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
