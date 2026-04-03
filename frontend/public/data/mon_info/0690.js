(() => {
	const natiId = 690;
	const nameVal = "Skrelp";
	const games = gameSearch("gen6", "gen7", "swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
