(() => {
	const natiId = 905;
	const nameVal = "Enamorus";
	const games = gameSearch("la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
