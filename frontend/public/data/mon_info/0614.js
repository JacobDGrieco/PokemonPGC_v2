(() => {
	const natiId = 614;
	const nameVal = "Beartic";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
