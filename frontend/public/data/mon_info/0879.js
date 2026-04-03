(() => {
	const natiId = 879;
	const nameVal = "Copperajah";
	const games = gameSearch("swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
