(() => {
	const natiId = 996;
	const nameVal = "Frigibax";
	const games = gameSearch("scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
