(() => {
	const natiId = 499;
	const nameVal = "Pignite";
	const games = gameSearch("gen5", "gen6", "gen7", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
