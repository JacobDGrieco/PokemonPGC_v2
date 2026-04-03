(() => {
	const natiId = 103;
	const form = "alolan";
	const games = gameSearch("gen7", "lgpe", "swsh", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();