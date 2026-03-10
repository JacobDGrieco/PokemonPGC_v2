(() => {
	const natiId = 110;
	const form = "galarian";
	const games = gameSearch("swsh", "scvi", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();