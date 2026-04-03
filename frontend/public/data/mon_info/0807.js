(() => {
	const natiId = 807;
	const nameVal = "Zeraora";
	const games = gameSearch("usum", "swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
