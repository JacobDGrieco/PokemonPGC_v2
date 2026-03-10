(() => {
	const natiId = 370;
	const nameVal = "Luvdisc";
	const games = gameSearch("gen3", "gen4", "gen5", "gen6", "gen7", "bdsp", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
