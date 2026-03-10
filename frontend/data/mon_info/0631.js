(() => {
	const natiId = 631;
	const nameVal = "Heatmor";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
