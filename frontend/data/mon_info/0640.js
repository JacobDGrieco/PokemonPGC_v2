(() => {
	const natiId = 640;
	const nameVal = "Virizion";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
