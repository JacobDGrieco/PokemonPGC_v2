(() => {
	const natiId = 705;
	const nameVal = "Sliggoo";
	const games = gameSearch("gen6", "gen7", "swsh", "la", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
