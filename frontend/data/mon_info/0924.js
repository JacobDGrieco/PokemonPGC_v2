(() => {
	const natiId = 924;
	const nameVal = "Tandemaus";
	const games = gameSearch("scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
