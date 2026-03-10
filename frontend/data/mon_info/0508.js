(() => {
	const natiId = 508;
	const nameVal = "Stoutland";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
