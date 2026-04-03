(() => {
	const natiId = 555;
	const form = "galarian-zen-mode";
	const games = gameSearch("swsh");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();