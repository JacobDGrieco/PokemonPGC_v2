(() => {
	const natiId = 648;
	const nameVal = "Meloetta";
	const games = gameSearch("gen5", "gen6", "gen7", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
