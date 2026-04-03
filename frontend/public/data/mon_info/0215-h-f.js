(() => {
	const natiId = 215;
	const form = "hisuian-female";
	const games = gameSearch("la", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();