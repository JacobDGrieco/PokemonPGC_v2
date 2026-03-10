(() => {
	const natiId = 829;
	const nameVal = "Gossifleur";
	const games = gameSearch("swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
