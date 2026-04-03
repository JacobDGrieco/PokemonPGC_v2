(() => {
	const natiId = 641;
	const form = "therian";
	const games = gameSearch("bw2", "gen6", "gen7", "swsh", "la", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();