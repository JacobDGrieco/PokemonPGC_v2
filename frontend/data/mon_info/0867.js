(() => {
	const natiId = 867;
	const nameVal = "Runerigus";
	const games = gameSearch("swsh", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
