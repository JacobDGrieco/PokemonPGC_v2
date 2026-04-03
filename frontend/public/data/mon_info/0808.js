(() => {
	const natiId = 808;
	const nameVal = "Meltan";
	const games = gameSearch("gen7", "lgpe", "swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
