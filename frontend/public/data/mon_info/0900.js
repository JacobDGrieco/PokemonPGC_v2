(() => {
	const natiId = 900;
	const nameVal = "Kleavor";
	const games = gameSearch("la", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
