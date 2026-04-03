(() => {
	const natiId = 591;
	const nameVal = "Amoonguss";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
