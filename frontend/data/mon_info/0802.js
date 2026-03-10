(() => {
	const natiId = 802;
	const nameVal = "Marshadow";
	const games = gameSearch("gen7", "swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
