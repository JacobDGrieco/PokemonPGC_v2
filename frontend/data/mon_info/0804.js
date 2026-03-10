(() => {
	const natiId = 804;
	const nameVal = "Naganadel";
	const games = gameSearch("usum", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
