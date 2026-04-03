(() => {
	const natiId = 870;
	const nameVal = "Falinks";
	const games = gameSearch("swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
