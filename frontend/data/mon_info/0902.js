(() => {
	const natiId = 902;
	const nameVal = "Basculegion";
	const games = gameSearch("la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
