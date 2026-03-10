(() => {
	const natiId = 863;
	const nameVal = "Perrserker";
	const games = gameSearch("swsh", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
