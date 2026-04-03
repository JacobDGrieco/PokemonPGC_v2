(() => {
	const natiId = 58;
	const form = "hisuian";
	const games = gameSearch("gen7", "lgpe", "swsh", "scvi", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();