(() => {
	const natiId = 586;
	const form = "winter";
	const games = gameSearch("gen5", "gen6", "gen7", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();