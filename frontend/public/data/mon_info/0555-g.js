(() => {
	const natiId = 554;
	const form = "galarian";
	const games = gameSearch("swsh");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();