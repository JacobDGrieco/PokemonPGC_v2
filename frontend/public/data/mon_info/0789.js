(() => {
	const natiId = 789;
	const nameVal = "Cosmog";
	const games = gameSearch("gen7", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
