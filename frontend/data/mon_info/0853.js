(() => {
	const natiId = 853;
	const nameVal = "Grapploct";
	const games = gameSearch("swsh", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
