(() => {
	const natiId = 865;
	const nameVal = "Sirfetch'd";
	const games = gameSearch("swsh", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
