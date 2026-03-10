(() => {
	const natiId = 796;
	const nameVal = "Xurkitree";
	const games = gameSearch("gen7", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
