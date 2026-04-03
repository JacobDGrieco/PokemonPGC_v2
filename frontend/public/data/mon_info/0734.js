(() => {
	const natiId = 734;
	const nameVal = "Yungoos";
	const games = gameSearch("gen7", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
