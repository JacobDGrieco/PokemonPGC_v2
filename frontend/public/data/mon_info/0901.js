(() => {
	const natiId = 901;
	const nameVal = "Ursaluna";
	const games = gameSearch("la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
