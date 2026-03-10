(() => {
	const natiId = 894;
	const nameVal = "Regieleki";
	const games = gameSearch("swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
