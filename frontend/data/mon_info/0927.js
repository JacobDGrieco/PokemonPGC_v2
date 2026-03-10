(() => {
	const natiId = 927;
	const nameVal = "Dachsbun";
	const games = gameSearch("scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
