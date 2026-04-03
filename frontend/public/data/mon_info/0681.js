(() => {
	const natiId = 681;
	const nameVal = "Aegislash";
	const games = gameSearch("gen6", "gen7", "swsh", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
