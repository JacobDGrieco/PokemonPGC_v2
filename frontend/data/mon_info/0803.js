(() => {
	const natiId = 803;
	const nameVal = "Poipole";
	const games = gameSearch("usum", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
