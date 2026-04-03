(() => {
	const natiId = 94;
	const form = "mega";
	const games = gameSearch("gen6", "gen7", "lgpe", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();