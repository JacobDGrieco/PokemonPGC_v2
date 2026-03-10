(() => {
	const natiId = 479;
	const form = "mow";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "swsh", "bdsp", "la", "scvi", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();