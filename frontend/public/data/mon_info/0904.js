(() => {
	const natiId = 904;
	const nameVal = "Overqwil";
	const games = gameSearch("la", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
