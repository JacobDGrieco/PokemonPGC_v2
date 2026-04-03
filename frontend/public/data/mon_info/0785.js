(() => {
	const natiId = 785;
	const nameVal = "Tapu Koko";
	const games = gameSearch("gen7", "swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
