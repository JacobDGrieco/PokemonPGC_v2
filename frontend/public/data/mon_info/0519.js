(() => {
	const natiId = 519;
	const nameVal = "Pidove";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
