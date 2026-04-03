(() => {
	const natiId = 866;
	const nameVal = "Mr. Rime";
	const games = gameSearch("swsh", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
