(() => {
	const natiId = 352;
	const nameVal = "Kecleon";
	const games = gameSearch("gen3", "gen4", "gen5", "gen6", "gen7", "bdsp", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
