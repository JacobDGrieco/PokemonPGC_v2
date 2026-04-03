(() => {
	const natiId = 1012;
	const nameVal = "Poltchageist";
	const games = gameSearch("scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
