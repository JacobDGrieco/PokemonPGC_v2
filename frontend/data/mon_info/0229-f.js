(() => {
	const natiId = 229;
	const form = "female";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "swsh", "bdsp", "scvi", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();