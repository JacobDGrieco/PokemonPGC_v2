(() => {
	const natiId = 581;
	const nameVal = "Swanna";
	const games = gameSearch("gen5", "gen6", "gen7", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
