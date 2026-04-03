(() => {
	const natiId = 725;
	const nameVal = "Litten";
	const games = gameSearch("gen7", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
