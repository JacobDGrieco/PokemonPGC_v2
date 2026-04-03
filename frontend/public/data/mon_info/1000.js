(() => {
	const natiId = 1000;
	const nameVal = "Gholdengo";
	const games = gameSearch("scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
