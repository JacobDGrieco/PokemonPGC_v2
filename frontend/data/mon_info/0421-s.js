(() => {
	const natiId = 421;
	const form = "sunshine";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "swsh", "bdsp", "la");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();