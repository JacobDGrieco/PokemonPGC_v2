(() => {
	const natiId = 592;
	const form = "female";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();