(() => {
	const natiId = 876;
	const nameVal = "Indeedee";
	const games = gameSearch("swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
