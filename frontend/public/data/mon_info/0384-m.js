(() => {
	const natiId = 384;
	const form = "mega";
	const games = gameSearch("oras", "gen7", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();