(() => {
	const natiId = 380;
	const form = "mega";
	const games = gameSearch("gen6", "gen7", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();