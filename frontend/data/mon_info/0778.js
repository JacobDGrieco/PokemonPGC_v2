(() => {
	const natiId = 778;
	const nameVal = "Mimikyu";
	const games = gameSearch("gen7", "swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
