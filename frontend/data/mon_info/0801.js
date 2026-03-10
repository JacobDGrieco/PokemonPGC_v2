(() => {
	const natiId = 801;
	const nameVal = "Magearna";
	const games = gameSearch("gen7", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
