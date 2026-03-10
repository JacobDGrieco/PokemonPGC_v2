(() => {
	const natiId = 20;
	const form = "female";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "lgpe", "bdsp");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();