(() => {
	const natiId = 78;
	const form = "galarian";
	const games = gameSearch("swsh", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();