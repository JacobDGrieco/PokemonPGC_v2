(() => {
	const natiId = 9;
	const form = "gigantamax";
	const games = gameSearch("swsh");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();