(() => {
	const natiId = 880;
	const nameVal = "Dracozolt";
	const games = gameSearch("swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
