(() => {
	const natiId = 849;
	const nameVal = "Toxtricity";
	const games = gameSearch("swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
