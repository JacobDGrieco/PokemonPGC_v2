(() => {
	const natiId = 157;
	const form = "hisuian";
	const games = gameSearch("la", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();