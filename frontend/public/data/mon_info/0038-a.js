(() => {
	const natiId = 38;
	const form = "alolan";
	const games = gameSearch("gen7", "lgpe", "swsh", "la", "scvi", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();