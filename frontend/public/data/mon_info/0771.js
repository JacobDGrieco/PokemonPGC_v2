(() => {
	const natiId = 771;
	const nameVal = "Pyukumuku";
	const games = gameSearch("gen7", "swsh");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
