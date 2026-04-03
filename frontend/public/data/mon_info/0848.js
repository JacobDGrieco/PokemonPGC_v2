(() => {
	const natiId = 848;
	const nameVal = "Toxel";
	const games = gameSearch("swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
