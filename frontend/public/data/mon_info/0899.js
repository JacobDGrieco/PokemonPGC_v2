(() => {
	const natiId = 899;
	const nameVal = "Wyrdeer";
	const games = gameSearch("la");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
