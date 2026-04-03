(() => {
	const natiId = 687;
	const nameVal = "Malamar";
	const games = gameSearch("gen6", "gen7", "swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
