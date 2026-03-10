(() => {
	const natiId = 859;
	const nameVal = "Impidimp";
	const games = gameSearch("swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
