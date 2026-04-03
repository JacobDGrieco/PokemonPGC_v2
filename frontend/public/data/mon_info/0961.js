(() => {
	const natiId = 961;
	const nameVal = "Wugtrio";
	const games = gameSearch("scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
