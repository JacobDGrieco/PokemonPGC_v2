(() => {
	const natiId = 128;
	const form = "paldea-aqua-breed";
	const games = gameSearch("scvi", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();