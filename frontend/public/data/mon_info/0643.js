(() => {
	const natiId = 643;
	const nameVal = "Reshiram";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
