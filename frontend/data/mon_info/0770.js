(() => {
	const natiId = 770;
	const nameVal = "Palossand";
	const games = gameSearch("gen7", "swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
