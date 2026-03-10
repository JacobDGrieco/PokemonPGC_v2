(() => {
	const natiId = 769;
	const nameVal = "Sandygast";
	const games = gameSearch("gen7", "swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
