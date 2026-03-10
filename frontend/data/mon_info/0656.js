(() => {
	const natiId = 656;
	const nameVal = "Froakie";
	const games = gameSearch("gen6", "gen7", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
