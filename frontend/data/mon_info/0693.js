(() => {
	const natiId = 693;
	const nameVal = "Clawitzer";
	const games = gameSearch("gen6", "gen7", "swsh", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	window.PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
