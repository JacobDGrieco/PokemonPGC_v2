(() => {
	const gen = 4;
	const GAME_KEYS = ["diamond-national", "pearl-national"];
	const DEX_NAME = "National Dex";

	const baseSprite = (gameKey, natiId) => window.dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => window.dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 1, name: "Bulbasaur", img: ({ gameKey }) => baseSprite(gameKey, 1), imgS: ({ gameKey }) => shinySprite(gameKey, 1), tags: ["starter"], },
		{ id: 2, natiId: 2, name: "Ivysaur", img: ({ gameKey }) => baseSprite(gameKey, 2), imgS: ({ gameKey }) => shinySprite(gameKey, 2), tags: ["starter"], },
		{
			id: 3, natiId: 3, name: "Venusaur", img: ({ gameKey }) => baseSprite(gameKey, 3), imgS: ({ gameKey }) => shinySprite(gameKey, 3), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 3), imgS: ({ gameKey }) => shinySprite(gameKey, 3), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0003-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0003-f"), },
			],
		},
		{ id: 4, natiId: 4, name: "Charmander", img: ({ gameKey }) => baseSprite(gameKey, 4), imgS: ({ gameKey }) => shinySprite(gameKey, 4), tags: ["starter"], },
		{ id: 5, natiId: 5, name: "Charmeleon", img: ({ gameKey }) => baseSprite(gameKey, 5), imgS: ({ gameKey }) => shinySprite(gameKey, 5), tags: ["starter"], },
		{ id: 6, natiId: 6, name: "Charizard", img: ({ gameKey }) => baseSprite(gameKey, 6), imgS: ({ gameKey }) => shinySprite(gameKey, 6), tags: ["starter"], },
		{ id: 7, natiId: 7, name: "Squirtle", img: ({ gameKey }) => baseSprite(gameKey, 7), imgS: ({ gameKey }) => shinySprite(gameKey, 7), tags: ["starter"], },
		{ id: 8, natiId: 8, name: "Wartortle", img: ({ gameKey }) => baseSprite(gameKey, 8), imgS: ({ gameKey }) => shinySprite(gameKey, 8), tags: ["starter"], },
		{ id: 9, natiId: 9, name: "Blastoise", img: ({ gameKey }) => baseSprite(gameKey, 9), imgS: ({ gameKey }) => shinySprite(gameKey, 9), tags: ["starter"], },
		{ id: 10, natiId: 10, name: "Caterpie", img: ({ gameKey }) => baseSprite(gameKey, 10), imgS: ({ gameKey }) => shinySprite(gameKey, 10), },
		{ id: 11, natiId: 11, name: "Metapod", img: ({ gameKey }) => baseSprite(gameKey, 11), imgS: ({ gameKey }) => shinySprite(gameKey, 11), },
		{
			id: 12, natiId: 12, name: "Butterfree", img: ({ gameKey }) => baseSprite(gameKey, 12), imgS: ({ gameKey }) => shinySprite(gameKey, 12), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 12), imgS: ({ gameKey }) => shinySprite(gameKey, 12), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0012-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0012-f"), },
			],
		},
		{ id: 13, natiId: 13, name: "Weedle", img: ({ gameKey }) => baseSprite(gameKey, 13), imgS: ({ gameKey }) => shinySprite(gameKey, 13), },
		{ id: 14, natiId: 14, name: "Kakuna", img: ({ gameKey }) => baseSprite(gameKey, 14), imgS: ({ gameKey }) => shinySprite(gameKey, 14), },
		{ id: 15, natiId: 15, name: "Beedrill", img: ({ gameKey }) => baseSprite(gameKey, 15), imgS: ({ gameKey }) => shinySprite(gameKey, 15), },
		{ id: 16, natiId: 16, name: "Pidgey", img: ({ gameKey }) => baseSprite(gameKey, 16), imgS: ({ gameKey }) => shinySprite(gameKey, 16), },
		{ id: 17, natiId: 17, name: "Pidgeotto", img: ({ gameKey }) => baseSprite(gameKey, 17), imgS: ({ gameKey }) => shinySprite(gameKey, 17), },
		{ id: 18, natiId: 18, name: "Pidgeot", img: ({ gameKey }) => baseSprite(gameKey, 18), imgS: ({ gameKey }) => shinySprite(gameKey, 18), },
		{
			id: 19, natiId: 19, name: "Rattata", img: ({ gameKey }) => baseSprite(gameKey, 19), imgS: ({ gameKey }) => shinySprite(gameKey, 19), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 19), imgS: ({ gameKey }) => shinySprite(gameKey, 19), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0019-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0019-f"), },
			],
		},
		{
			id: 20, natiId: 20, name: "Raticate", img: ({ gameKey }) => baseSprite(gameKey, 20), imgS: ({ gameKey }) => shinySprite(gameKey, 20), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 20), imgS: ({ gameKey }) => shinySprite(gameKey, 20), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0020-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-f"), },
			],
		},
		{ id: 21, natiId: 21, name: "Spearow", img: ({ gameKey }) => baseSprite(gameKey, 21), imgS: ({ gameKey }) => shinySprite(gameKey, 21), },
		{ id: 22, natiId: 22, name: "Fearow", img: ({ gameKey }) => baseSprite(gameKey, 22), imgS: ({ gameKey }) => shinySprite(gameKey, 22), },
		{ id: 23, natiId: 23, name: "Ekans", img: ({ gameKey }) => baseSprite(gameKey, 23), imgS: ({ gameKey }) => shinySprite(gameKey, 23), },
		{ id: 24, natiId: 24, name: "Arbok", img: ({ gameKey }) => baseSprite(gameKey, 24), imgS: ({ gameKey }) => shinySprite(gameKey, 24), },
		{
			id: 25, natiId: 25, name: "Pikachu", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0025-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-f"), },
			],
		},
		{
			id: 26, natiId: 26, name: "Raichu", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0026-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-f"), },
			],
		},
		{ id: 27, natiId: 27, name: "Sandshrew", img: ({ gameKey }) => baseSprite(gameKey, 27), imgS: ({ gameKey }) => shinySprite(gameKey, 27), },
		{ id: 28, natiId: 28, name: "Sandslash", img: ({ gameKey }) => baseSprite(gameKey, 28), imgS: ({ gameKey }) => shinySprite(gameKey, 28), },
		{ id: 29, natiId: 29, name: "Nidoran♀", img: ({ gameKey }) => baseSprite(gameKey, 29), imgS: ({ gameKey }) => shinySprite(gameKey, 29), },
		{ id: 30, natiId: 30, name: "Nidorina", img: ({ gameKey }) => baseSprite(gameKey, 30), imgS: ({ gameKey }) => shinySprite(gameKey, 30), },
		{ id: 31, natiId: 31, name: "Nidoqueen", img: ({ gameKey }) => baseSprite(gameKey, 31), imgS: ({ gameKey }) => shinySprite(gameKey, 31), },
		{ id: 32, natiId: 32, name: "Nidoran♂", img: ({ gameKey }) => baseSprite(gameKey, 32), imgS: ({ gameKey }) => shinySprite(gameKey, 32), },
		{ id: 33, natiId: 33, name: "Nidorino", img: ({ gameKey }) => baseSprite(gameKey, 33), imgS: ({ gameKey }) => shinySprite(gameKey, 33), },
		{ id: 34, natiId: 34, name: "Nidoking", img: ({ gameKey }) => baseSprite(gameKey, 34), imgS: ({ gameKey }) => shinySprite(gameKey, 34), },
		{ id: 35, natiId: 35, name: "Clefairy", img: ({ gameKey }) => baseSprite(gameKey, 35), imgS: ({ gameKey }) => shinySprite(gameKey, 35), },
		{ id: 36, natiId: 36, name: "Clefable", img: ({ gameKey }) => baseSprite(gameKey, 36), imgS: ({ gameKey }) => shinySprite(gameKey, 36), },
		{ id: 37, natiId: 37, name: "Vulpix", img: ({ gameKey }) => baseSprite(gameKey, 37), imgS: ({ gameKey }) => shinySprite(gameKey, 37), },
		{ id: 38, natiId: 38, name: "Ninetales", img: ({ gameKey }) => baseSprite(gameKey, 38), imgS: ({ gameKey }) => shinySprite(gameKey, 38), },
		{ id: 39, natiId: 39, name: "Jigglypuff", img: ({ gameKey }) => baseSprite(gameKey, 39), imgS: ({ gameKey }) => shinySprite(gameKey, 39), },
		{ id: 40, natiId: 40, name: "Wigglytuff", img: ({ gameKey }) => baseSprite(gameKey, 40), imgS: ({ gameKey }) => shinySprite(gameKey, 40), },
		{
			id: 41, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), },
			],
		},
		{
			id: 42, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), },
			],
		},
		{ id: 43, natiId: 43, name: "Oddish", img: ({ gameKey }) => baseSprite(gameKey, 43), imgS: ({ gameKey }) => shinySprite(gameKey, 43), },
		{
			id: 44, natiId: 44, name: "Gloom", img: ({ gameKey }) => baseSprite(gameKey, 44), imgS: ({ gameKey }) => shinySprite(gameKey, 44), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 44), imgS: ({ gameKey }) => shinySprite(gameKey, 44), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0044-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0044-f"), },
			],
		},
		{
			id: 45, natiId: 45, name: "Vileplume", img: ({ gameKey }) => baseSprite(gameKey, 45), imgS: ({ gameKey }) => shinySprite(gameKey, 45), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 45), imgS: ({ gameKey }) => shinySprite(gameKey, 45), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0045-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0045-f"), },
			],
		},
		{ id: 46, natiId: 46, name: "Paras", img: ({ gameKey }) => baseSprite(gameKey, 46), imgS: ({ gameKey }) => shinySprite(gameKey, 46), },
		{ id: 47, natiId: 47, name: "Parasect", img: ({ gameKey }) => baseSprite(gameKey, 47), imgS: ({ gameKey }) => shinySprite(gameKey, 47), },
		{ id: 48, natiId: 48, name: "Venonat", img: ({ gameKey }) => baseSprite(gameKey, 48), imgS: ({ gameKey }) => shinySprite(gameKey, 48), },
		{ id: 49, natiId: 49, name: "Venomoth", img: ({ gameKey }) => baseSprite(gameKey, 49), imgS: ({ gameKey }) => shinySprite(gameKey, 49), },
		{ id: 50, natiId: 50, name: "Diglett", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), },
		{ id: 51, natiId: 51, name: "Dugtrio", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), },
		{ id: 52, natiId: 52, name: "Meowth", img: ({ gameKey }) => baseSprite(gameKey, 52), imgS: ({ gameKey }) => shinySprite(gameKey, 52), },
		{ id: 53, natiId: 53, name: "Persian", img: ({ gameKey }) => baseSprite(gameKey, 53), imgS: ({ gameKey }) => shinySprite(gameKey, 53), },
		{ id: 54, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54), },
		{ id: 55, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55), },
		{ id: 56, natiId: 56, name: "Mankey", img: ({ gameKey }) => baseSprite(gameKey, 56), imgS: ({ gameKey }) => shinySprite(gameKey, 56), },
		{ id: 57, natiId: 57, name: "Primeape", img: ({ gameKey }) => baseSprite(gameKey, 57), imgS: ({ gameKey }) => shinySprite(gameKey, 57), },
		{ id: 58, natiId: 58, name: "Growlithe", img: ({ gameKey }) => baseSprite(gameKey, 58), imgS: ({ gameKey }) => shinySprite(gameKey, 58), },
		{ id: 59, natiId: 59, name: "Arcanine", img: ({ gameKey }) => baseSprite(gameKey, 59), imgS: ({ gameKey }) => shinySprite(gameKey, 59), },
		{ id: 60, natiId: 60, name: "Poliwag", img: ({ gameKey }) => baseSprite(gameKey, 60), imgS: ({ gameKey }) => shinySprite(gameKey, 60), },
		{ id: 61, natiId: 61, name: "Poliwhirl", img: ({ gameKey }) => baseSprite(gameKey, 61), imgS: ({ gameKey }) => shinySprite(gameKey, 61), },
		{ id: 62, natiId: 62, name: "Poliwrath", img: ({ gameKey }) => baseSprite(gameKey, 62), imgS: ({ gameKey }) => shinySprite(gameKey, 62), },
		{ id: 63, natiId: 63, name: "Abra", img: ({ gameKey }) => baseSprite(gameKey, 63), imgS: ({ gameKey }) => shinySprite(gameKey, 63), },
		{
			id: 64, natiId: 64, name: "Kadabra", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0064-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0064-f"), },
			],
		},
		{
			id: 65, natiId: 65, name: "Alakazam", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0065-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0065-f"), },
			],
		},
		{ id: 66, natiId: 66, name: "Machop", img: ({ gameKey }) => baseSprite(gameKey, 66), imgS: ({ gameKey }) => shinySprite(gameKey, 66), },
		{ id: 67, natiId: 67, name: "Machoke", img: ({ gameKey }) => baseSprite(gameKey, 67), imgS: ({ gameKey }) => shinySprite(gameKey, 67), },
		{ id: 68, natiId: 68, name: "Machamp", img: ({ gameKey }) => baseSprite(gameKey, 68), imgS: ({ gameKey }) => shinySprite(gameKey, 68), },
		{ id: 69, natiId: 69, name: "Bellsprout", img: ({ gameKey }) => baseSprite(gameKey, 69), imgS: ({ gameKey }) => shinySprite(gameKey, 69), },
		{ id: 70, natiId: 70, name: "Weepinbell", img: ({ gameKey }) => baseSprite(gameKey, 70), imgS: ({ gameKey }) => shinySprite(gameKey, 70), },
		{ id: 71, natiId: 71, name: "Victreebel", img: ({ gameKey }) => baseSprite(gameKey, 71), imgS: ({ gameKey }) => shinySprite(gameKey, 71), },
		{ id: 72, natiId: 72, name: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72), imgS: ({ gameKey }) => shinySprite(gameKey, 72), },
		{ id: 73, natiId: 73, name: "Tentacruel", img: ({ gameKey }) => baseSprite(gameKey, 73), imgS: ({ gameKey }) => shinySprite(gameKey, 73), },
		{ id: 74, natiId: 74, name: "Geodude", img: ({ gameKey }) => baseSprite(gameKey, 74), imgS: ({ gameKey }) => shinySprite(gameKey, 74), },
		{ id: 75, natiId: 75, name: "Graveler", img: ({ gameKey }) => baseSprite(gameKey, 75), imgS: ({ gameKey }) => shinySprite(gameKey, 75), },
		{ id: 76, natiId: 76, name: "Golem", img: ({ gameKey }) => baseSprite(gameKey, 76), imgS: ({ gameKey }) => shinySprite(gameKey, 76), },
		{ id: 77, natiId: 77, name: "Ponyta", img: ({ gameKey }) => baseSprite(gameKey, 77), imgS: ({ gameKey }) => shinySprite(gameKey, 77), },
		{ id: 78, natiId: 78, name: "Rapidash", img: ({ gameKey }) => baseSprite(gameKey, 78), imgS: ({ gameKey }) => shinySprite(gameKey, 78), },
		{ id: 79, natiId: 79, name: "Slowpoke", img: ({ gameKey }) => baseSprite(gameKey, 79), imgS: ({ gameKey }) => shinySprite(gameKey, 79), },
		{ id: 80, natiId: 80, name: "Slowbro", img: ({ gameKey }) => baseSprite(gameKey, 80), imgS: ({ gameKey }) => shinySprite(gameKey, 80), },
		{ id: 81, natiId: 81, name: "Magnemite", img: ({ gameKey }) => baseSprite(gameKey, 81), imgS: ({ gameKey }) => shinySprite(gameKey, 81), },
		{ id: 82, natiId: 82, name: "Magneton", img: ({ gameKey }) => baseSprite(gameKey, 82), imgS: ({ gameKey }) => shinySprite(gameKey, 82), },
		{ id: 83, natiId: 83, name: "Farfetch'd", img: ({ gameKey }) => baseSprite(gameKey, 83), imgS: ({ gameKey }) => shinySprite(gameKey, 83), },
		{
			id: 84, natiId: 84, name: "Doduo", img: ({ gameKey }) => baseSprite(gameKey, 84), imgS: ({ gameKey }) => shinySprite(gameKey, 84), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 84), imgS: ({ gameKey }) => shinySprite(gameKey, 84), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0084-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0084-f"), },
			],
		},
		{
			id: 85, natiId: 85, name: "Dodrio", img: ({ gameKey }) => baseSprite(gameKey, 85), imgS: ({ gameKey }) => shinySprite(gameKey, 85), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 85), imgS: ({ gameKey }) => shinySprite(gameKey, 85), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0085-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0085-f"), },
			],
		},
		{ id: 86, natiId: 86, name: "Seel", img: ({ gameKey }) => baseSprite(gameKey, 86), imgS: ({ gameKey }) => shinySprite(gameKey, 86), },
		{ id: 87, natiId: 87, name: "Dewgong", img: ({ gameKey }) => baseSprite(gameKey, 87), imgS: ({ gameKey }) => shinySprite(gameKey, 87), },
		{ id: 88, natiId: 88, name: "Grimer", img: ({ gameKey }) => baseSprite(gameKey, 88), imgS: ({ gameKey }) => shinySprite(gameKey, 88), },
		{ id: 89, natiId: 89, name: "Muk", img: ({ gameKey }) => baseSprite(gameKey, 89), imgS: ({ gameKey }) => shinySprite(gameKey, 89), },
		{ id: 90, natiId: 90, name: "Shellder", img: ({ gameKey }) => baseSprite(gameKey, 90), imgS: ({ gameKey }) => shinySprite(gameKey, 90), },
		{ id: 91, natiId: 91, name: "Cloyster", img: ({ gameKey }) => baseSprite(gameKey, 91), imgS: ({ gameKey }) => shinySprite(gameKey, 91), },
		{ id: 92, natiId: 92, name: "Gastly", img: ({ gameKey }) => baseSprite(gameKey, 92), imgS: ({ gameKey }) => shinySprite(gameKey, 92), },
		{ id: 93, natiId: 93, name: "Haunter", img: ({ gameKey }) => baseSprite(gameKey, 93), imgS: ({ gameKey }) => shinySprite(gameKey, 93), },
		{ id: 94, natiId: 94, name: "Gengar", img: ({ gameKey }) => baseSprite(gameKey, 94), imgS: ({ gameKey }) => shinySprite(gameKey, 94), },
		{ id: 95, natiId: 95, name: "Onix", img: ({ gameKey }) => baseSprite(gameKey, 95), imgS: ({ gameKey }) => shinySprite(gameKey, 95), },
		{ id: 96, natiId: 96, name: "Drowzee", img: ({ gameKey }) => baseSprite(gameKey, 96), imgS: ({ gameKey }) => shinySprite(gameKey, 96), },
		{
			id: 97, natiId: 97, name: "Hypno", img: ({ gameKey }) => baseSprite(gameKey, 97), imgS: ({ gameKey }) => shinySprite(gameKey, 97), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 97), imgS: ({ gameKey }) => shinySprite(gameKey, 97), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0097-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0097-f"), },
			],
		},
		{ id: 98, natiId: 98, name: "Krabby", img: ({ gameKey }) => baseSprite(gameKey, 98), imgS: ({ gameKey }) => shinySprite(gameKey, 98), },
		{ id: 99, natiId: 99, name: "Kingler", img: ({ gameKey }) => baseSprite(gameKey, 99), imgS: ({ gameKey }) => shinySprite(gameKey, 99), },
		{ id: 100, natiId: 100, name: "Voltorb", img: ({ gameKey }) => baseSprite(gameKey, 100), imgS: ({ gameKey }) => shinySprite(gameKey, 100), },
		{ id: 101, natiId: 101, name: "Electrode", img: ({ gameKey }) => baseSprite(gameKey, 101), imgS: ({ gameKey }) => shinySprite(gameKey, 101), },
		{ id: 102, natiId: 102, name: "Exeggcute", img: ({ gameKey }) => baseSprite(gameKey, 102), imgS: ({ gameKey }) => shinySprite(gameKey, 102), },
		{ id: 103, natiId: 103, name: "Exeggutor", img: ({ gameKey }) => baseSprite(gameKey, 103), imgS: ({ gameKey }) => shinySprite(gameKey, 103), },
		{ id: 104, natiId: 104, name: "Cubone", img: ({ gameKey }) => baseSprite(gameKey, 104), imgS: ({ gameKey }) => shinySprite(gameKey, 104), },
		{ id: 105, natiId: 105, name: "Marowak", img: ({ gameKey }) => baseSprite(gameKey, 105), imgS: ({ gameKey }) => shinySprite(gameKey, 105), },
		{ id: 106, natiId: 106, name: "Hitmonlee", img: ({ gameKey }) => baseSprite(gameKey, 106), imgS: ({ gameKey }) => shinySprite(gameKey, 106), },
		{ id: 107, natiId: 107, name: "Hitmonchan", img: ({ gameKey }) => baseSprite(gameKey, 107), imgS: ({ gameKey }) => shinySprite(gameKey, 107), },
		{ id: 108, natiId: 108, name: "Lickitung", img: ({ gameKey }) => baseSprite(gameKey, 108), imgS: ({ gameKey }) => shinySprite(gameKey, 108), },
		{ id: 109, natiId: 109, name: "Koffing", img: ({ gameKey }) => baseSprite(gameKey, 109), imgS: ({ gameKey }) => shinySprite(gameKey, 109), },
		{ id: 110, natiId: 110, name: "Weezing", img: ({ gameKey }) => baseSprite(gameKey, 110), imgS: ({ gameKey }) => shinySprite(gameKey, 110), },
		{
			id: 111, natiId: 111, name: "Rhyhorn", img: ({ gameKey }) => baseSprite(gameKey, 111), imgS: ({ gameKey }) => shinySprite(gameKey, 111), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 111), imgS: ({ gameKey }) => shinySprite(gameKey, 111), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0111-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0111-f"), },
			],
		},
		{
			id: 112, natiId: 112, name: "Rhydon", img: ({ gameKey }) => baseSprite(gameKey, 112), imgS: ({ gameKey }) => shinySprite(gameKey, 112), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 112), imgS: ({ gameKey }) => shinySprite(gameKey, 112), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0112-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0112-f"), },
			],
		},
		{ id: 113, natiId: 113, name: "Chansey", img: ({ gameKey }) => baseSprite(gameKey, 113), imgS: ({ gameKey }) => shinySprite(gameKey, 113), },
		{ id: 114, natiId: 114, name: "Tangela", img: ({ gameKey }) => baseSprite(gameKey, 114), imgS: ({ gameKey }) => shinySprite(gameKey, 114), },
		{ id: 115, natiId: 115, name: "Kangaskhan", img: ({ gameKey }) => baseSprite(gameKey, 115), imgS: ({ gameKey }) => shinySprite(gameKey, 115), },
		{ id: 116, natiId: 116, name: "Horsea", img: ({ gameKey }) => baseSprite(gameKey, 116), imgS: ({ gameKey }) => shinySprite(gameKey, 116), },
		{ id: 117, natiId: 117, name: "Seadra", img: ({ gameKey }) => baseSprite(gameKey, 117), imgS: ({ gameKey }) => shinySprite(gameKey, 117), },
		{
			id: 118, natiId: 118, name: "Goldeen", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0118-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0118-f"), },
			],
		},
		{
			id: 119, natiId: 119, name: "Seaking", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0119-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0119-f"), },
			],
		},
		{ id: 120, natiId: 120, name: "Staryu", img: ({ gameKey }) => baseSprite(gameKey, 120), imgS: ({ gameKey }) => shinySprite(gameKey, 120), },
		{ id: 121, natiId: 121, name: "Starmie", img: ({ gameKey }) => baseSprite(gameKey, 121), imgS: ({ gameKey }) => shinySprite(gameKey, 121), },
		{ id: 122, natiId: 122, name: "Mr. Mime", img: ({ gameKey }) => baseSprite(gameKey, 122), imgS: ({ gameKey }) => shinySprite(gameKey, 122), },
		{
			id: 123, natiId: 123, name: "Scyther", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0123-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0123-f"), },
			],
		},
		{ id: 124, natiId: 124, name: "Jynx", img: ({ gameKey }) => baseSprite(gameKey, 124), imgS: ({ gameKey }) => shinySprite(gameKey, 124), },
		{ id: 125, natiId: 125, name: "Electabuzz", img: ({ gameKey }) => baseSprite(gameKey, 125), imgS: ({ gameKey }) => shinySprite(gameKey, 125), },
		{ id: 126, natiId: 126, name: "Magmar", img: ({ gameKey }) => baseSprite(gameKey, 126), imgS: ({ gameKey }) => shinySprite(gameKey, 126), },
		{ id: 127, natiId: 127, name: "Pinsir", img: ({ gameKey }) => baseSprite(gameKey, 127), imgS: ({ gameKey }) => shinySprite(gameKey, 127), },
		{ id: 128, natiId: 128, name: "Tauros", img: ({ gameKey }) => baseSprite(gameKey, 128), imgS: ({ gameKey }) => shinySprite(gameKey, 128), },
		{
			id: 129, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), },
			],
		},
		{
			id: 130, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },
			],
		},
		{ id: 131, natiId: 131, name: "Lapras", img: ({ gameKey }) => baseSprite(gameKey, 131), imgS: ({ gameKey }) => shinySprite(gameKey, 131), },
		{ id: 132, natiId: 132, name: "Ditto", img: ({ gameKey }) => baseSprite(gameKey, 132), imgS: ({ gameKey }) => shinySprite(gameKey, 132), },
		{ id: 133, natiId: 133, name: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133), },
		{ id: 134, natiId: 134, name: "Vaporeon", img: ({ gameKey }) => baseSprite(gameKey, 134), imgS: ({ gameKey }) => shinySprite(gameKey, 134), },
		{ id: 135, natiId: 135, name: "Jolteon", img: ({ gameKey }) => baseSprite(gameKey, 135), imgS: ({ gameKey }) => shinySprite(gameKey, 135), },
		{ id: 136, natiId: 136, name: "Flareon", img: ({ gameKey }) => baseSprite(gameKey, 136), imgS: ({ gameKey }) => shinySprite(gameKey, 136), },
		{ id: 137, natiId: 137, name: "Porygon", img: ({ gameKey }) => baseSprite(gameKey, 137), imgS: ({ gameKey }) => shinySprite(gameKey, 137), },
		{ id: 138, natiId: 138, name: "Omanyte", img: ({ gameKey }) => baseSprite(gameKey, 138), imgS: ({ gameKey }) => shinySprite(gameKey, 138), tags: ["fossil"], },
		{ id: 139, natiId: 139, name: "Omastar", img: ({ gameKey }) => baseSprite(gameKey, 139), imgS: ({ gameKey }) => shinySprite(gameKey, 139), tags: ["fossil"], },
		{ id: 140, natiId: 140, name: "Kabuto", img: ({ gameKey }) => baseSprite(gameKey, 140), imgS: ({ gameKey }) => shinySprite(gameKey, 140), tags: ["fossil"], },
		{ id: 141, natiId: 141, name: "Kabutops", img: ({ gameKey }) => baseSprite(gameKey, 141), imgS: ({ gameKey }) => shinySprite(gameKey, 141), tags: ["fossil"], },
		{ id: 142, natiId: 142, name: "Aerodactyl", img: ({ gameKey }) => baseSprite(gameKey, 142), imgS: ({ gameKey }) => shinySprite(gameKey, 142), tags: ["fossil"], },
		{ id: 143, natiId: 143, name: "Snorlax", img: ({ gameKey }) => baseSprite(gameKey, 143), imgS: ({ gameKey }) => shinySprite(gameKey, 143), },
		{ id: 144, natiId: 144, name: "Articuno", img: ({ gameKey }) => baseSprite(gameKey, 144), imgS: ({ gameKey }) => shinySprite(gameKey, 144), tags: ["legendary"], },
		{ id: 145, natiId: 145, name: "Zapdos", img: ({ gameKey }) => baseSprite(gameKey, 145), imgS: ({ gameKey }) => shinySprite(gameKey, 145), tags: ["legendary"], },
		{ id: 146, natiId: 146, name: "Moltres", img: ({ gameKey }) => baseSprite(gameKey, 146), imgS: ({ gameKey }) => shinySprite(gameKey, 146), tags: ["legendary"], },
		{ id: 147, natiId: 147, name: "Dratini", img: ({ gameKey }) => baseSprite(gameKey, 147), imgS: ({ gameKey }) => shinySprite(gameKey, 147), tags: ["pseudo"], },
		{ id: 148, natiId: 148, name: "Dragonair", img: ({ gameKey }) => baseSprite(gameKey, 148), imgS: ({ gameKey }) => shinySprite(gameKey, 148), tags: ["pseudo"], },
		{ id: 149, natiId: 149, name: "Dragonite", img: ({ gameKey }) => baseSprite(gameKey, 149), imgS: ({ gameKey }) => shinySprite(gameKey, 149), tags: ["pseudo"], },
		{ id: 150, natiId: 150, name: "Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150), imgS: ({ gameKey }) => shinySprite(gameKey, 150), tags: ["legendary"], },
		{ id: 151, natiId: 151, name: "Mew", img: ({ gameKey }) => baseSprite(gameKey, 151), imgS: ({ gameKey }) => shinySprite(gameKey, 151), tags: ["mythical"], },
		{ id: 152, natiId: 152, name: "Chikorita", img: ({ gameKey }) => baseSprite(gameKey, 152), imgS: ({ gameKey }) => shinySprite(gameKey, 152), tags: ["starter"], },
		{ id: 153, natiId: 153, name: "Bayleef", img: ({ gameKey }) => baseSprite(gameKey, 153), imgS: ({ gameKey }) => shinySprite(gameKey, 153), tags: ["starter"], },
		{
			id: 154, natiId: 154, name: "Meganium", img: ({ gameKey }) => baseSprite(gameKey, 154), imgS: ({ gameKey }) => shinySprite(gameKey, 154), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 154), imgS: ({ gameKey }) => shinySprite(gameKey, 154), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0154-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0154-f"), },
			],
		},
		{ id: 155, natiId: 155, name: "Cyndaquil", img: ({ gameKey }) => baseSprite(gameKey, 155), imgS: ({ gameKey }) => shinySprite(gameKey, 155), tags: ["starter"], },
		{ id: 156, natiId: 156, name: "Quilava", img: ({ gameKey }) => baseSprite(gameKey, 156), imgS: ({ gameKey }) => shinySprite(gameKey, 156), tags: ["starter"], },
		{ id: 157, natiId: 157, name: "Typhlosion", img: ({ gameKey }) => baseSprite(gameKey, 157), imgS: ({ gameKey }) => shinySprite(gameKey, 157), tags: ["starter"], },
		{ id: 158, natiId: 158, name: "Totodile", img: ({ gameKey }) => baseSprite(gameKey, 158), imgS: ({ gameKey }) => shinySprite(gameKey, 158), tags: ["starter"], },
		{ id: 159, natiId: 159, name: "Croconaw", img: ({ gameKey }) => baseSprite(gameKey, 159), imgS: ({ gameKey }) => shinySprite(gameKey, 159), tags: ["starter"], },
		{ id: 160, natiId: 160, name: "Feraligatr", img: ({ gameKey }) => baseSprite(gameKey, 160), imgS: ({ gameKey }) => shinySprite(gameKey, 160), tags: ["starter"], },
		{ id: 161, natiId: 161, name: "Sentret", img: ({ gameKey }) => baseSprite(gameKey, 161), imgS: ({ gameKey }) => shinySprite(gameKey, 161), },
		{ id: 162, natiId: 162, name: "Furret", img: ({ gameKey }) => baseSprite(gameKey, 162), imgS: ({ gameKey }) => shinySprite(gameKey, 162), },
		{ id: 163, natiId: 163, name: "Hoothoot", img: ({ gameKey }) => baseSprite(gameKey, 163), imgS: ({ gameKey }) => shinySprite(gameKey, 163), },
		{ id: 164, natiId: 164, name: "Noctowl", img: ({ gameKey }) => baseSprite(gameKey, 164), imgS: ({ gameKey }) => shinySprite(gameKey, 164), },
		{
			id: 165, natiId: 165, name: "Ledyba", img: ({ gameKey }) => baseSprite(gameKey, 165), imgS: ({ gameKey }) => shinySprite(gameKey, 165), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 165), imgS: ({ gameKey }) => shinySprite(gameKey, 165), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0165-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0165-f"), },
			],
		},
		{
			id: 166, natiId: 166, name: "Ledian", img: ({ gameKey }) => baseSprite(gameKey, 166), imgS: ({ gameKey }) => shinySprite(gameKey, 166), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 166), imgS: ({ gameKey }) => shinySprite(gameKey, 166), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0166-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0166-f"), },
			],
		},
		{ id: 167, natiId: 167, name: "Spinarak", img: ({ gameKey }) => baseSprite(gameKey, 167), imgS: ({ gameKey }) => shinySprite(gameKey, 167), },
		{ id: 168, natiId: 168, name: "Ariados", img: ({ gameKey }) => baseSprite(gameKey, 168), imgS: ({ gameKey }) => shinySprite(gameKey, 168), },
		{ id: 169, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169), },
		{ id: 170, natiId: 170, name: "Chinchou", img: ({ gameKey }) => baseSprite(gameKey, 170), imgS: ({ gameKey }) => shinySprite(gameKey, 170), },
		{ id: 171, natiId: 171, name: "Lanturn", img: ({ gameKey }) => baseSprite(gameKey, 171), imgS: ({ gameKey }) => shinySprite(gameKey, 171), },
		{ id: 172, natiId: 172, name: "Pichu", img: ({ gameKey }) => baseSprite(gameKey, 172), imgS: ({ gameKey }) => shinySprite(gameKey, 172), },
		{ id: 173, natiId: 173, name: "Cleffa", img: ({ gameKey }) => baseSprite(gameKey, 173), imgS: ({ gameKey }) => shinySprite(gameKey, 173), },
		{ id: 174, natiId: 174, name: "Igglybuff", img: ({ gameKey }) => baseSprite(gameKey, 174), imgS: ({ gameKey }) => shinySprite(gameKey, 174), },
		{ id: 175, natiId: 175, name: "Togepi", img: ({ gameKey }) => baseSprite(gameKey, 175), imgS: ({ gameKey }) => shinySprite(gameKey, 175), },
		{ id: 176, natiId: 176, name: "Togetic", img: ({ gameKey }) => baseSprite(gameKey, 176), imgS: ({ gameKey }) => shinySprite(gameKey, 176), },
		{ id: 177, natiId: 177, name: "Natu", img: ({ gameKey }) => baseSprite(gameKey, 177), imgS: ({ gameKey }) => shinySprite(gameKey, 177), },
		{
			id: 178, natiId: 178, name: "Xatu", img: ({ gameKey }) => baseSprite(gameKey, 178), imgS: ({ gameKey }) => shinySprite(gameKey, 178), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 178), imgS: ({ gameKey }) => shinySprite(gameKey, 178), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0178-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0178-f"), },
			],
		},
		{ id: 179, natiId: 179, name: "Mareep", img: ({ gameKey }) => baseSprite(gameKey, 179), imgS: ({ gameKey }) => shinySprite(gameKey, 179), },
		{ id: 180, natiId: 180, name: "Flaaffy", img: ({ gameKey }) => baseSprite(gameKey, 180), imgS: ({ gameKey }) => shinySprite(gameKey, 180), },
		{ id: 181, natiId: 181, name: "Ampharos", img: ({ gameKey }) => baseSprite(gameKey, 181), imgS: ({ gameKey }) => shinySprite(gameKey, 181), },
		{ id: 182, natiId: 182, name: "Bellossom", img: ({ gameKey }) => baseSprite(gameKey, 182), imgS: ({ gameKey }) => shinySprite(gameKey, 182), },
		{ id: 183, natiId: 183, name: "Marill", img: ({ gameKey }) => baseSprite(gameKey, 183), imgS: ({ gameKey }) => shinySprite(gameKey, 183), },
		{ id: 184, natiId: 184, name: "Azumarill", img: ({ gameKey }) => baseSprite(gameKey, 184), imgS: ({ gameKey }) => shinySprite(gameKey, 184), },
		{
			id: 185, natiId: 185, name: "Sudowoodo", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0185-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0185-f"), },
			],
		},
		{
			id: 186, natiId: 186, name: "Politoed", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0186-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0186-f"), },
			],
		},
		{ id: 187, natiId: 187, name: "Hoppip", img: ({ gameKey }) => baseSprite(gameKey, 187), imgS: ({ gameKey }) => shinySprite(gameKey, 187), },
		{ id: 188, natiId: 188, name: "Skiploom", img: ({ gameKey }) => baseSprite(gameKey, 188), imgS: ({ gameKey }) => shinySprite(gameKey, 188), },
		{ id: 189, natiId: 189, name: "Jumpluff", img: ({ gameKey }) => baseSprite(gameKey, 189), imgS: ({ gameKey }) => shinySprite(gameKey, 189), },
		{
			id: 190, natiId: 190, name: "Aipom", img: ({ gameKey }) => baseSprite(gameKey, 190), imgS: ({ gameKey }) => shinySprite(gameKey, 190), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 190), imgS: ({ gameKey }) => shinySprite(gameKey, 190), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0190-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0190-f"), },
			],
		},
		{ id: 191, natiId: 191, name: "Sunkern", img: ({ gameKey }) => baseSprite(gameKey, 191), imgS: ({ gameKey }) => shinySprite(gameKey, 191), },
		{ id: 192, natiId: 192, name: "Sunflora", img: ({ gameKey }) => baseSprite(gameKey, 192), imgS: ({ gameKey }) => shinySprite(gameKey, 192), },
		{ id: 193, natiId: 193, name: "Yanma", img: ({ gameKey }) => baseSprite(gameKey, 193), imgS: ({ gameKey }) => shinySprite(gameKey, 193), },
		{
			id: 194, natiId: 194, name: "Wooper", img: ({ gameKey }) => baseSprite(gameKey, 194), imgS: ({ gameKey }) => shinySprite(gameKey, 194), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 194), imgS: ({ gameKey }) => shinySprite(gameKey, 194), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0194-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0194-f"), },
			],
		},
		{
			id: 195, natiId: 195, name: "Quagsire", img: ({ gameKey }) => baseSprite(gameKey, 195), imgS: ({ gameKey }) => shinySprite(gameKey, 195), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 195), imgS: ({ gameKey }) => shinySprite(gameKey, 195), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0195-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0195-f"), },
			],
		},
		{ id: 196, natiId: 196, name: "Espeon", img: ({ gameKey }) => baseSprite(gameKey, 196), imgS: ({ gameKey }) => shinySprite(gameKey, 196), },
		{ id: 197, natiId: 197, name: "Umbreon", img: ({ gameKey }) => baseSprite(gameKey, 197), imgS: ({ gameKey }) => shinySprite(gameKey, 197), },
		{
			id: 198, natiId: 198, name: "Murkrow", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0198-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0198-f"), },
			],
		},
		{ id: 199, natiId: 199, name: "Slowking", img: ({ gameKey }) => baseSprite(gameKey, 199), imgS: ({ gameKey }) => shinySprite(gameKey, 199), },
		{ id: 200, natiId: 200, name: "Misdreavus", img: ({ gameKey }) => baseSprite(gameKey, 200), imgS: ({ gameKey }) => shinySprite(gameKey, 200), },
		{
			id: 201, natiId: 201, name: "Unown", img: ({ gameKey }) => baseSprite(gameKey, 201), imgS: ({ gameKey }) => shinySprite(gameKey, 201), tags: ["other"], forms: [
				{ name: "A", img: ({ gameKey }) => baseSprite(gameKey, "0201-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-a"), },
				{ name: "B", img: ({ gameKey }) => baseSprite(gameKey, "0201-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-b"), },
				{ name: "C", img: ({ gameKey }) => baseSprite(gameKey, "0201-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-c"), },
				{ name: "D", img: ({ gameKey }) => baseSprite(gameKey, "0201-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-d"), },
				{ name: "E", img: ({ gameKey }) => baseSprite(gameKey, "0201-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-e"), },
				{ name: "F", img: ({ gameKey }) => baseSprite(gameKey, "0201-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-f"), },
				{ name: "G", img: ({ gameKey }) => baseSprite(gameKey, "0201-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-g"), },
				{ name: "H", img: ({ gameKey }) => baseSprite(gameKey, "0201-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-h"), },
				{ name: "I", img: ({ gameKey }) => baseSprite(gameKey, "0201-i"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-i"), },
				{ name: "J", img: ({ gameKey }) => baseSprite(gameKey, "0201-j"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-j"), },
				{ name: "K", img: ({ gameKey }) => baseSprite(gameKey, "0201-k"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-k"), },
				{ name: "L", img: ({ gameKey }) => baseSprite(gameKey, "0201-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-l"), },
				{ name: "M", img: ({ gameKey }) => baseSprite(gameKey, "0201-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-m"), },
				{ name: "N", img: ({ gameKey }) => baseSprite(gameKey, "0201-n"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-n"), },
				{ name: "O", img: ({ gameKey }) => baseSprite(gameKey, "0201-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-o"), },
				{ name: "P", img: ({ gameKey }) => baseSprite(gameKey, "0201-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-p"), },
				{ name: "Q", img: ({ gameKey }) => baseSprite(gameKey, "0201-q"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-q"), },
				{ name: "R", img: ({ gameKey }) => baseSprite(gameKey, "0201-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-r"), },
				{ name: "S", img: ({ gameKey }) => baseSprite(gameKey, "0201-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-s"), },
				{ name: "T", img: ({ gameKey }) => baseSprite(gameKey, "0201-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-t"), },
				{ name: "U", img: ({ gameKey }) => baseSprite(gameKey, "0201-u"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-u"), },
				{ name: "V", img: ({ gameKey }) => baseSprite(gameKey, "0201-v"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-v"), },
				{ name: "W", img: ({ gameKey }) => baseSprite(gameKey, "0201-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-w"), },
				{ name: "X", img: ({ gameKey }) => baseSprite(gameKey, "0201-x"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-x"), },
				{ name: "Y", img: ({ gameKey }) => baseSprite(gameKey, "0201-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-y"), },
				{ name: "Z", img: ({ gameKey }) => baseSprite(gameKey, "0201-z"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-z"), },
				{ name: "!", img: ({ gameKey }) => baseSprite(gameKey, "0201-em"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-em"), },
				{ name: "?", img: ({ gameKey }) => baseSprite(gameKey, "0201-qm"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-qm"), },
			],
		},
		{
			id: 202, natiId: 202, name: "Wobbuffet", img: ({ gameKey }) => baseSprite(gameKey, 202), imgS: ({ gameKey }) => shinySprite(gameKey, 202), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 202), imgS: ({ gameKey }) => shinySprite(gameKey, 202), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0202-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0202-f"), },
			],
		},
		{
			id: 203, natiId: 203, name: "Girafarig", img: ({ gameKey }) => baseSprite(gameKey, 203), imgS: ({ gameKey }) => shinySprite(gameKey, 203), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 203), imgS: ({ gameKey }) => shinySprite(gameKey, 203), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0203-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0203-f"), },
			],
		},
		{ id: 204, natiId: 204, name: "Pineco", img: ({ gameKey }) => baseSprite(gameKey, 204), imgS: ({ gameKey }) => shinySprite(gameKey, 204), },
		{ id: 205, natiId: 205, name: "Forretress", img: ({ gameKey }) => baseSprite(gameKey, 205), imgS: ({ gameKey }) => shinySprite(gameKey, 205), },
		{ id: 206, natiId: 206, name: "Dunsparce", img: ({ gameKey }) => baseSprite(gameKey, 206), imgS: ({ gameKey }) => shinySprite(gameKey, 206), },
		{
			id: 207, natiId: 207, name: "Gligar", img: ({ gameKey }) => baseSprite(gameKey, 207), imgS: ({ gameKey }) => shinySprite(gameKey, 207), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 207), imgS: ({ gameKey }) => shinySprite(gameKey, 207), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0207-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0207-f"), },
			],
		},
		{
			id: 208, natiId: 208, name: "Steelix", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0208-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0208-f"), },
			],
		},
		{ id: 209, natiId: 209, name: "Snubbull", img: ({ gameKey }) => baseSprite(gameKey, 209), imgS: ({ gameKey }) => shinySprite(gameKey, 209), },
		{ id: 210, natiId: 210, name: "Granbull", img: ({ gameKey }) => baseSprite(gameKey, 210), imgS: ({ gameKey }) => shinySprite(gameKey, 210), },
		{ id: 211, natiId: 211, name: "Qwilfish", img: ({ gameKey }) => baseSprite(gameKey, 211), imgS: ({ gameKey }) => shinySprite(gameKey, 211), },
		{
			id: 212, natiId: 212, name: "Scizor", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0212-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0212-f"), },
			],
		},
		{ id: 213, natiId: 213, name: "Shuckle", img: ({ gameKey }) => baseSprite(gameKey, 213), imgS: ({ gameKey }) => shinySprite(gameKey, 213), },
		{
			id: 214, natiId: 214, name: "Heracross", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0214-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0214-f"), },
			],
		},
		{
			id: 215, natiId: 215, name: "Sneasel", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-f"), },
			],
		},
		{ id: 216, natiId: 216, name: "Teddiursa", img: ({ gameKey }) => baseSprite(gameKey, 216), imgS: ({ gameKey }) => shinySprite(gameKey, 216), },
		{
			id: 217, natiId: 217, name: "Ursaring", img: ({ gameKey }) => baseSprite(gameKey, 217), imgS: ({ gameKey }) => shinySprite(gameKey, 217), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 217), imgS: ({ gameKey }) => shinySprite(gameKey, 217), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0217-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0217-f"), },
			],
		},
		{ id: 218, natiId: 218, name: "Slugma", img: ({ gameKey }) => baseSprite(gameKey, 218), imgS: ({ gameKey }) => shinySprite(gameKey, 218), },
		{ id: 219, natiId: 219, name: "Magcargo", img: ({ gameKey }) => baseSprite(gameKey, 219), imgS: ({ gameKey }) => shinySprite(gameKey, 219), },
		{ id: 220, natiId: 220, name: "Swinub", img: ({ gameKey }) => baseSprite(gameKey, 220), imgS: ({ gameKey }) => shinySprite(gameKey, 220), },
		{
			id: 221, natiId: 221, name: "Piloswine", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0221-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0221-f"), },
			],
		},
		{ id: 222, natiId: 222, name: "Corsola", img: ({ gameKey }) => baseSprite(gameKey, 222), imgS: ({ gameKey }) => shinySprite(gameKey, 222), },
		{ id: 223, natiId: 223, name: "Remoraid", img: ({ gameKey }) => baseSprite(gameKey, 223), imgS: ({ gameKey }) => shinySprite(gameKey, 223), },
		{
			id: 224, natiId: 224, name: "Octillery", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0224-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0224-f"), },
			],
		},
		{ id: 225, natiId: 225, name: "Delibird", img: ({ gameKey }) => baseSprite(gameKey, 225), imgS: ({ gameKey }) => shinySprite(gameKey, 225), },
		{ id: 226, natiId: 226, name: "Mantine", img: ({ gameKey }) => baseSprite(gameKey, 226), imgS: ({ gameKey }) => shinySprite(gameKey, 226), },
		{ id: 227, natiId: 227, name: "Skarmory", img: ({ gameKey }) => baseSprite(gameKey, 227), imgS: ({ gameKey }) => shinySprite(gameKey, 227), },
		{ id: 228, natiId: 228, name: "Houndour", img: ({ gameKey }) => baseSprite(gameKey, 228), imgS: ({ gameKey }) => shinySprite(gameKey, 228), },
		{
			id: 229, natiId: 229, name: "Houndoom", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0229-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0229-f"), },
			],
		},
		{ id: 230, natiId: 230, name: "Kingdra", img: ({ gameKey }) => baseSprite(gameKey, 230), imgS: ({ gameKey }) => shinySprite(gameKey, 230), },
		{ id: 231, natiId: 231, name: "Phanpy", img: ({ gameKey }) => baseSprite(gameKey, 231), imgS: ({ gameKey }) => shinySprite(gameKey, 231), },
		{
			id: 232, natiId: 232, name: "Donphan", img: ({ gameKey }) => baseSprite(gameKey, 232), imgS: ({ gameKey }) => shinySprite(gameKey, 232), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 232), imgS: ({ gameKey }) => shinySprite(gameKey, 232), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0232-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0232-f"), },
			],
		},
		{ id: 233, natiId: 233, name: "Porygon2", img: ({ gameKey }) => baseSprite(gameKey, 233), imgS: ({ gameKey }) => shinySprite(gameKey, 233), },
		{ id: 234, natiId: 234, name: "Stantler", img: ({ gameKey }) => baseSprite(gameKey, 234), imgS: ({ gameKey }) => shinySprite(gameKey, 234), },
		{ id: 235, natiId: 235, name: "Smeargle", img: ({ gameKey }) => baseSprite(gameKey, 235), imgS: ({ gameKey }) => shinySprite(gameKey, 235), },
		{ id: 236, natiId: 236, name: "Tyrogue", img: ({ gameKey }) => baseSprite(gameKey, 236), imgS: ({ gameKey }) => shinySprite(gameKey, 236), },
		{ id: 237, natiId: 237, name: "Hitmontop", img: ({ gameKey }) => baseSprite(gameKey, 237), imgS: ({ gameKey }) => shinySprite(gameKey, 237), },
		{ id: 238, natiId: 238, name: "Smoochum", img: ({ gameKey }) => baseSprite(gameKey, 238), imgS: ({ gameKey }) => shinySprite(gameKey, 238), },
		{ id: 239, natiId: 239, name: "Elekid", img: ({ gameKey }) => baseSprite(gameKey, 239), imgS: ({ gameKey }) => shinySprite(gameKey, 239), },
		{ id: 240, natiId: 240, name: "Magby", img: ({ gameKey }) => baseSprite(gameKey, 240), imgS: ({ gameKey }) => shinySprite(gameKey, 240), },
		{ id: 241, natiId: 241, name: "Miltank", img: ({ gameKey }) => baseSprite(gameKey, 241), imgS: ({ gameKey }) => shinySprite(gameKey, 241), },
		{ id: 242, natiId: 242, name: "Blissey", img: ({ gameKey }) => baseSprite(gameKey, 242), imgS: ({ gameKey }) => shinySprite(gameKey, 242), },
		{ id: 243, natiId: 243, name: "Raikou", img: ({ gameKey }) => baseSprite(gameKey, 243), imgS: ({ gameKey }) => shinySprite(gameKey, 243), tags: ["legendary"], },
		{ id: 244, natiId: 244, name: "Entei", img: ({ gameKey }) => baseSprite(gameKey, 244), imgS: ({ gameKey }) => shinySprite(gameKey, 244), tags: ["legendary"], },
		{ id: 245, natiId: 245, name: "Suicune", img: ({ gameKey }) => baseSprite(gameKey, 245), imgS: ({ gameKey }) => shinySprite(gameKey, 245), tags: ["legendary"], },
		{ id: 246, natiId: 246, name: "Larvitar", img: ({ gameKey }) => baseSprite(gameKey, 246), imgS: ({ gameKey }) => shinySprite(gameKey, 246), tags: ["pseudo"], },
		{ id: 247, natiId: 247, name: "Pupitar", img: ({ gameKey }) => baseSprite(gameKey, 247), imgS: ({ gameKey }) => shinySprite(gameKey, 247), tags: ["pseudo"], },
		{ id: 248, natiId: 248, name: "Tyranitar", img: ({ gameKey }) => baseSprite(gameKey, 248), imgS: ({ gameKey }) => shinySprite(gameKey, 248), tags: ["pseudo"], },
		{ id: 249, natiId: 249, name: "Lugia", img: ({ gameKey }) => baseSprite(gameKey, 249), imgS: ({ gameKey }) => shinySprite(gameKey, 249), tags: ["legendary"], },
		{ id: 250, natiId: 250, name: "Ho-oh", img: ({ gameKey }) => baseSprite(gameKey, 250), imgS: ({ gameKey }) => shinySprite(gameKey, 250), tags: ["legendary"], },
		{ id: 251, natiId: 251, name: "Celebi", img: ({ gameKey }) => baseSprite(gameKey, 251), imgS: ({ gameKey }) => shinySprite(gameKey, 251), tags: ["mythical"], },
		{ id: 252, natiId: 252, name: "Treecko", img: ({ gameKey }) => baseSprite(gameKey, 252), imgS: ({ gameKey }) => shinySprite(gameKey, 252), tags: ["starter"], },
		{ id: 253, natiId: 253, name: "Grovyle", img: ({ gameKey }) => baseSprite(gameKey, 253), imgS: ({ gameKey }) => shinySprite(gameKey, 253), tags: ["starter"], },
		{ id: 254, natiId: 254, name: "Sceptile", img: ({ gameKey }) => baseSprite(gameKey, 254), imgS: ({ gameKey }) => shinySprite(gameKey, 254), tags: ["starter"], },
		{
			id: 255, natiId: 255, name: "Torchic", img: ({ gameKey }) => baseSprite(gameKey, 255), imgS: ({ gameKey }) => shinySprite(gameKey, 255), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 255), imgS: ({ gameKey }) => shinySprite(gameKey, 255), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0255-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0255-f"), },
			],
		},
		{
			id: 256, natiId: 256, name: "Combusken", img: ({ gameKey }) => baseSprite(gameKey, 256), imgS: ({ gameKey }) => shinySprite(gameKey, 256), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 256), imgS: ({ gameKey }) => shinySprite(gameKey, 256), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0256-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0256-f"), },
			],
		},
		{
			id: 257, natiId: 257, name: "Blaziken", img: ({ gameKey }) => baseSprite(gameKey, 257), imgS: ({ gameKey }) => shinySprite(gameKey, 257), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 257), imgS: ({ gameKey }) => shinySprite(gameKey, 257), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0257-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0257-f"), },
			],
		},
		{ id: 258, natiId: 258, name: "Mudkip", img: ({ gameKey }) => baseSprite(gameKey, 258), imgS: ({ gameKey }) => shinySprite(gameKey, 258), tags: ["starter"], },
		{ id: 259, natiId: 259, name: "Marshtomp", img: ({ gameKey }) => baseSprite(gameKey, 259), imgS: ({ gameKey }) => shinySprite(gameKey, 259), tags: ["starter"], },
		{ id: 260, natiId: 260, name: "Swampert", img: ({ gameKey }) => baseSprite(gameKey, 260), imgS: ({ gameKey }) => shinySprite(gameKey, 260), tags: ["starter"], },
		{ id: 261, natiId: 261, name: "Poochyena", img: ({ gameKey }) => baseSprite(gameKey, 261), imgS: ({ gameKey }) => shinySprite(gameKey, 261), },
		{ id: 262, natiId: 262, name: "Mightyena", img: ({ gameKey }) => baseSprite(gameKey, 262), imgS: ({ gameKey }) => shinySprite(gameKey, 262), },
		{ id: 263, natiId: 263, name: "Zigzagoon", img: ({ gameKey }) => baseSprite(gameKey, 263), imgS: ({ gameKey }) => shinySprite(gameKey, 263), },
		{ id: 264, natiId: 264, name: "Linoone", img: ({ gameKey }) => baseSprite(gameKey, 264), imgS: ({ gameKey }) => shinySprite(gameKey, 264), },
		{ id: 265, natiId: 265, name: "Wurmple", img: ({ gameKey }) => baseSprite(gameKey, 265), imgS: ({ gameKey }) => shinySprite(gameKey, 265), },
		{ id: 266, natiId: 266, name: "Silcoon", img: ({ gameKey }) => baseSprite(gameKey, 266), imgS: ({ gameKey }) => shinySprite(gameKey, 266), },
		{
			id: 267, natiId: 267, name: "Beautifly", img: ({ gameKey }) => baseSprite(gameKey, 267), imgS: ({ gameKey }) => shinySprite(gameKey, 267), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 267), imgS: ({ gameKey }) => shinySprite(gameKey, 267), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0267-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0267-f"), },
			],
		},
		{ id: 268, natiId: 268, name: "Cascoon", img: ({ gameKey }) => baseSprite(gameKey, 268), imgS: ({ gameKey }) => shinySprite(gameKey, 268), },
		{
			id: 269, natiId: 269, name: "Dustox", img: ({ gameKey }) => baseSprite(gameKey, 269), imgS: ({ gameKey }) => shinySprite(gameKey, 269), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 269), imgS: ({ gameKey }) => shinySprite(gameKey, 269), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0269-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0269-f"), },
			],
		},
		{ id: 270, natiId: 270, name: "Lotad", img: ({ gameKey }) => baseSprite(gameKey, 270), imgS: ({ gameKey }) => shinySprite(gameKey, 270), },
		{ id: 271, natiId: 271, name: "Lombre", img: ({ gameKey }) => baseSprite(gameKey, 271), imgS: ({ gameKey }) => shinySprite(gameKey, 271), },
		{
			id: 272, natiId: 272, name: "Ludicolo", img: ({ gameKey }) => baseSprite(gameKey, 272), imgS: ({ gameKey }) => shinySprite(gameKey, 272), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 272), imgS: ({ gameKey }) => shinySprite(gameKey, 272), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0272-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0272-f"), },
			],
		},
		{ id: 273, natiId: 273, name: "Seedot", img: ({ gameKey }) => baseSprite(gameKey, 273), imgS: ({ gameKey }) => shinySprite(gameKey, 273), },
		{
			id: 274, natiId: 274, name: "Nuzleaf", img: ({ gameKey }) => baseSprite(gameKey, 274), imgS: ({ gameKey }) => shinySprite(gameKey, 274), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 274), imgS: ({ gameKey }) => shinySprite(gameKey, 274), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0274-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0274-f"), },
			],
		},
		{
			id: 275, natiId: 275, name: "Shiftry", img: ({ gameKey }) => baseSprite(gameKey, 275), imgS: ({ gameKey }) => shinySprite(gameKey, 275), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 275), imgS: ({ gameKey }) => shinySprite(gameKey, 275), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0275-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0275-f"), },
			],
		},
		{ id: 276, natiId: 276, name: "Taillow", img: ({ gameKey }) => baseSprite(gameKey, 276), imgS: ({ gameKey }) => shinySprite(gameKey, 276), },
		{ id: 277, natiId: 277, name: "Swellow", img: ({ gameKey }) => baseSprite(gameKey, 277), imgS: ({ gameKey }) => shinySprite(gameKey, 277), },
		{ id: 278, natiId: 278, name: "Wingull", img: ({ gameKey }) => baseSprite(gameKey, 278), imgS: ({ gameKey }) => shinySprite(gameKey, 278), },
		{ id: 279, natiId: 279, name: "Pelipper", img: ({ gameKey }) => baseSprite(gameKey, 279), imgS: ({ gameKey }) => shinySprite(gameKey, 279), },
		{ id: 280, natiId: 280, name: "Ralts", img: ({ gameKey }) => baseSprite(gameKey, 280), imgS: ({ gameKey }) => shinySprite(gameKey, 280), },
		{ id: 281, natiId: 281, name: "Kirlia", img: ({ gameKey }) => baseSprite(gameKey, 281), imgS: ({ gameKey }) => shinySprite(gameKey, 281), },
		{ id: 282, natiId: 282, name: "Gardevoir", img: ({ gameKey }) => baseSprite(gameKey, 282), imgS: ({ gameKey }) => shinySprite(gameKey, 282), },
		{ id: 283, natiId: 283, name: "Surskit", img: ({ gameKey }) => baseSprite(gameKey, 283), imgS: ({ gameKey }) => shinySprite(gameKey, 283), },
		{ id: 284, natiId: 284, name: "Masquerain", img: ({ gameKey }) => baseSprite(gameKey, 284), imgS: ({ gameKey }) => shinySprite(gameKey, 284), },
		{ id: 285, natiId: 285, name: "Shroomish", img: ({ gameKey }) => baseSprite(gameKey, 285), imgS: ({ gameKey }) => shinySprite(gameKey, 285), },
		{ id: 286, natiId: 286, name: "Breloom", img: ({ gameKey }) => baseSprite(gameKey, 286), imgS: ({ gameKey }) => shinySprite(gameKey, 286), },
		{ id: 287, natiId: 287, name: "Slakoth", img: ({ gameKey }) => baseSprite(gameKey, 287), imgS: ({ gameKey }) => shinySprite(gameKey, 287), },
		{ id: 288, natiId: 288, name: "Vigoroth", img: ({ gameKey }) => baseSprite(gameKey, 288), imgS: ({ gameKey }) => shinySprite(gameKey, 288), },
		{ id: 289, natiId: 289, name: "Slaking", img: ({ gameKey }) => baseSprite(gameKey, 289), imgS: ({ gameKey }) => shinySprite(gameKey, 289), },
		{ id: 290, natiId: 290, name: "Nincada", img: ({ gameKey }) => baseSprite(gameKey, 290), imgS: ({ gameKey }) => shinySprite(gameKey, 290), },
		{ id: 291, natiId: 291, name: "Ninjask", img: ({ gameKey }) => baseSprite(gameKey, 291), imgS: ({ gameKey }) => shinySprite(gameKey, 291), },
		{ id: 292, natiId: 292, name: "Shedinja", img: ({ gameKey }) => baseSprite(gameKey, 292), imgS: ({ gameKey }) => shinySprite(gameKey, 292), },
		{ id: 293, natiId: 293, name: "Whismur", img: ({ gameKey }) => baseSprite(gameKey, 293), imgS: ({ gameKey }) => shinySprite(gameKey, 293), },
		{ id: 294, natiId: 294, name: "Loudred", img: ({ gameKey }) => baseSprite(gameKey, 294), imgS: ({ gameKey }) => shinySprite(gameKey, 294), },
		{ id: 295, natiId: 295, name: "Exploud", img: ({ gameKey }) => baseSprite(gameKey, 295), imgS: ({ gameKey }) => shinySprite(gameKey, 295), },
		{ id: 296, natiId: 296, name: "Makuhita", img: ({ gameKey }) => baseSprite(gameKey, 296), imgS: ({ gameKey }) => shinySprite(gameKey, 296), },
		{ id: 297, natiId: 297, name: "Hariyama", img: ({ gameKey }) => baseSprite(gameKey, 297), imgS: ({ gameKey }) => shinySprite(gameKey, 297), },
		{ id: 298, natiId: 298, name: "Azurill", img: ({ gameKey }) => baseSprite(gameKey, 298), imgS: ({ gameKey }) => shinySprite(gameKey, 298), },
		{ id: 299, natiId: 299, name: "Nosepass", img: ({ gameKey }) => baseSprite(gameKey, 299), imgS: ({ gameKey }) => shinySprite(gameKey, 299), },
		{ id: 300, natiId: 300, name: "Skitty", img: ({ gameKey }) => baseSprite(gameKey, 300), imgS: ({ gameKey }) => shinySprite(gameKey, 300), },
		{ id: 301, natiId: 301, name: "Delcatty", img: ({ gameKey }) => baseSprite(gameKey, 301), imgS: ({ gameKey }) => shinySprite(gameKey, 301), },
		{ id: 302, natiId: 302, name: "Sableye", img: ({ gameKey }) => baseSprite(gameKey, 302), imgS: ({ gameKey }) => shinySprite(gameKey, 302), },
		{ id: 303, natiId: 303, name: "Mawile", img: ({ gameKey }) => baseSprite(gameKey, 303), imgS: ({ gameKey }) => shinySprite(gameKey, 303), },
		{ id: 304, natiId: 304, name: "Aron", img: ({ gameKey }) => baseSprite(gameKey, 304), imgS: ({ gameKey }) => shinySprite(gameKey, 304), },
		{ id: 305, natiId: 305, name: "Lairon", img: ({ gameKey }) => baseSprite(gameKey, 305), imgS: ({ gameKey }) => shinySprite(gameKey, 305), },
		{ id: 306, natiId: 306, name: "Aggron", img: ({ gameKey }) => baseSprite(gameKey, 306), imgS: ({ gameKey }) => shinySprite(gameKey, 306), },
		{
			id: 307, natiId: 307, name: "Meditite", img: ({ gameKey }) => baseSprite(gameKey, 307), imgS: ({ gameKey }) => shinySprite(gameKey, 307), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 307), imgS: ({ gameKey }) => shinySprite(gameKey, 307), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0307-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0307-f"), },
			],
		},
		{
			id: 308, natiId: 308, name: "Medicham", img: ({ gameKey }) => baseSprite(gameKey, 308), imgS: ({ gameKey }) => shinySprite(gameKey, 308), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 308), imgS: ({ gameKey }) => shinySprite(gameKey, 308), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0308-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0308-f"), },
			],
		},
		{ id: 309, natiId: 309, name: "Electrike", img: ({ gameKey }) => baseSprite(gameKey, 309), imgS: ({ gameKey }) => shinySprite(gameKey, 309), },
		{ id: 310, natiId: 310, name: "Manectric", img: ({ gameKey }) => baseSprite(gameKey, 310), imgS: ({ gameKey }) => shinySprite(gameKey, 310), },
		{ id: 311, natiId: 311, name: "Plusle", img: ({ gameKey }) => baseSprite(gameKey, 311), imgS: ({ gameKey }) => shinySprite(gameKey, 311), },
		{ id: 312, natiId: 312, name: "Minun", img: ({ gameKey }) => baseSprite(gameKey, 312), imgS: ({ gameKey }) => shinySprite(gameKey, 312), },
		{ id: 313, natiId: 313, name: "Volbeat", img: ({ gameKey }) => baseSprite(gameKey, 313), imgS: ({ gameKey }) => shinySprite(gameKey, 313), },
		{ id: 314, natiId: 314, name: "Illumise", img: ({ gameKey }) => baseSprite(gameKey, 314), imgS: ({ gameKey }) => shinySprite(gameKey, 314), },
		{
			id: 315, natiId: 315, name: "Roselia", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0315-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0315-f"), },
			],
		},
		{
			id: 316, natiId: 316, name: "Gulpin", img: ({ gameKey }) => baseSprite(gameKey, 316), imgS: ({ gameKey }) => shinySprite(gameKey, 316), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 316), imgS: ({ gameKey }) => shinySprite(gameKey, 316), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0316-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0316-f"), },
			],
		},
		{
			id: 317, natiId: 317, name: "Swalot", img: ({ gameKey }) => baseSprite(gameKey, 317), imgS: ({ gameKey }) => shinySprite(gameKey, 317), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 317), imgS: ({ gameKey }) => shinySprite(gameKey, 317), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0317-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0317-f"), },
			],
		},
		{ id: 318, natiId: 318, name: "Carvanha", img: ({ gameKey }) => baseSprite(gameKey, 318), imgS: ({ gameKey }) => shinySprite(gameKey, 318), },
		{ id: 319, natiId: 319, name: "Sharpedo", img: ({ gameKey }) => baseSprite(gameKey, 319), imgS: ({ gameKey }) => shinySprite(gameKey, 319), },
		{ id: 320, natiId: 320, name: "Wailmer", img: ({ gameKey }) => baseSprite(gameKey, 320), imgS: ({ gameKey }) => shinySprite(gameKey, 320), },
		{ id: 321, natiId: 321, name: "Wailord", img: ({ gameKey }) => baseSprite(gameKey, 321), imgS: ({ gameKey }) => shinySprite(gameKey, 321), },
		{
			id: 322, natiId: 322, name: "Numel", img: ({ gameKey }) => baseSprite(gameKey, 322), imgS: ({ gameKey }) => shinySprite(gameKey, 322), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 322), imgS: ({ gameKey }) => shinySprite(gameKey, 322), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0322-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0322-f"), },
			],
		},
		{
			id: 323, natiId: 323, name: "Camerupt", img: ({ gameKey }) => baseSprite(gameKey, 323), imgS: ({ gameKey }) => shinySprite(gameKey, 323), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 323), imgS: ({ gameKey }) => shinySprite(gameKey, 323), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0323-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0323-f"), },
			],
		},
		{ id: 324, natiId: 324, name: "Torkoal", img: ({ gameKey }) => baseSprite(gameKey, 324), imgS: ({ gameKey }) => shinySprite(gameKey, 324), },
		{ id: 325, natiId: 325, name: "Spoink", img: ({ gameKey }) => baseSprite(gameKey, 325), imgS: ({ gameKey }) => shinySprite(gameKey, 325), },
		{ id: 326, natiId: 326, name: "Grumpig", img: ({ gameKey }) => baseSprite(gameKey, 326), imgS: ({ gameKey }) => shinySprite(gameKey, 326), },
		{ id: 327, natiId: 327, name: "Spinda", img: ({ gameKey }) => baseSprite(gameKey, 327), imgS: ({ gameKey }) => shinySprite(gameKey, 327), },
		{ id: 328, natiId: 328, name: "Trapinch", img: ({ gameKey }) => baseSprite(gameKey, 328), imgS: ({ gameKey }) => shinySprite(gameKey, 328), },
		{ id: 329, natiId: 329, name: "Vibrava", img: ({ gameKey }) => baseSprite(gameKey, 329), imgS: ({ gameKey }) => shinySprite(gameKey, 329), },
		{ id: 330, natiId: 330, name: "Flygon", img: ({ gameKey }) => baseSprite(gameKey, 330), imgS: ({ gameKey }) => shinySprite(gameKey, 330), },
		{ id: 331, natiId: 331, name: "Cacnea", img: ({ gameKey }) => baseSprite(gameKey, 331), imgS: ({ gameKey }) => shinySprite(gameKey, 331), },
		{
			id: 332, natiId: 332, name: "Cacturne", img: ({ gameKey }) => baseSprite(gameKey, 332), imgS: ({ gameKey }) => shinySprite(gameKey, 332), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 332), imgS: ({ gameKey }) => shinySprite(gameKey, 332), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0332-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0332-f"), },
			],
		},
		{ id: 333, natiId: 333, name: "Swablu", img: ({ gameKey }) => baseSprite(gameKey, 333), imgS: ({ gameKey }) => shinySprite(gameKey, 333), },
		{ id: 334, natiId: 334, name: "Altaria", img: ({ gameKey }) => baseSprite(gameKey, 334), imgS: ({ gameKey }) => shinySprite(gameKey, 334), },
		{ id: 335, natiId: 335, name: "Zangoose", img: ({ gameKey }) => baseSprite(gameKey, 335), imgS: ({ gameKey }) => shinySprite(gameKey, 335), },
		{ id: 336, natiId: 336, name: "Seviper", img: ({ gameKey }) => baseSprite(gameKey, 336), imgS: ({ gameKey }) => shinySprite(gameKey, 336), },
		{ id: 337, natiId: 337, name: "Lunatone", img: ({ gameKey }) => baseSprite(gameKey, 337), imgS: ({ gameKey }) => shinySprite(gameKey, 337), },
		{ id: 338, natiId: 338, name: "Solrock", img: ({ gameKey }) => baseSprite(gameKey, 338), imgS: ({ gameKey }) => shinySprite(gameKey, 338), },
		{ id: 339, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339), },
		{ id: 340, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340), },
		{ id: 341, natiId: 341, name: "Corphish", img: ({ gameKey }) => baseSprite(gameKey, 341), imgS: ({ gameKey }) => shinySprite(gameKey, 341), },
		{ id: 342, natiId: 342, name: "Crawdaunt", img: ({ gameKey }) => baseSprite(gameKey, 342), imgS: ({ gameKey }) => shinySprite(gameKey, 342), },
		{ id: 343, natiId: 343, name: "Baltoy", img: ({ gameKey }) => baseSprite(gameKey, 343), imgS: ({ gameKey }) => shinySprite(gameKey, 343), },
		{ id: 344, natiId: 344, name: "Claydol", img: ({ gameKey }) => baseSprite(gameKey, 344), imgS: ({ gameKey }) => shinySprite(gameKey, 344), },
		{ id: 345, natiId: 345, name: "Lileep", img: ({ gameKey }) => baseSprite(gameKey, 345), imgS: ({ gameKey }) => shinySprite(gameKey, 345), tags: ["fossil"], },
		{ id: 346, natiId: 346, name: "Cradily", img: ({ gameKey }) => baseSprite(gameKey, 346), imgS: ({ gameKey }) => shinySprite(gameKey, 346), tags: ["fossil"], },
		{ id: 347, natiId: 347, name: "Anorith", img: ({ gameKey }) => baseSprite(gameKey, 347), imgS: ({ gameKey }) => shinySprite(gameKey, 347), tags: ["fossil"], },
		{ id: 348, natiId: 348, name: "Armaldo", img: ({ gameKey }) => baseSprite(gameKey, 348), imgS: ({ gameKey }) => shinySprite(gameKey, 348), tags: ["fossil"], },
		{ id: 349, natiId: 349, name: "Feebas", img: ({ gameKey }) => baseSprite(gameKey, 349), imgS: ({ gameKey }) => shinySprite(gameKey, 349), },
		{
			id: 350, natiId: 350, name: "Milotic", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0350-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0350-f"), },
			],
		},
		{
			id: 351, natiId: 351, name: "Castform", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), tags: ["gender"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), },
				{ name: "Rainy", img: ({ gameKey }) => baseSprite(gameKey, "0351-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-r"), },
				{ name: "Snowy", img: ({ gameKey }) => baseSprite(gameKey, "0351-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-s"), },
				{ name: "Sunny", img: ({ gameKey }) => baseSprite(gameKey, "0351-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-s"), },
			],
		},
		{ id: 352, natiId: 352, name: "Kecleon", img: ({ gameKey }) => baseSprite(gameKey, 352), imgS: ({ gameKey }) => shinySprite(gameKey, 352), },
		{ id: 353, natiId: 353, name: "Shuppet", img: ({ gameKey }) => baseSprite(gameKey, 353), imgS: ({ gameKey }) => shinySprite(gameKey, 353), },
		{ id: 354, natiId: 354, name: "Banette", img: ({ gameKey }) => baseSprite(gameKey, 354), imgS: ({ gameKey }) => shinySprite(gameKey, 354), },
		{ id: 355, natiId: 355, name: "Duskull", img: ({ gameKey }) => baseSprite(gameKey, 355), imgS: ({ gameKey }) => shinySprite(gameKey, 355), },
		{ id: 356, natiId: 356, name: "Dusclops", img: ({ gameKey }) => baseSprite(gameKey, 356), imgS: ({ gameKey }) => shinySprite(gameKey, 356), },
		{ id: 357, natiId: 357, name: "Tropius", img: ({ gameKey }) => baseSprite(gameKey, 357), imgS: ({ gameKey }) => shinySprite(gameKey, 357), },
		{ id: 358, natiId: 358, name: "Chimecho", img: ({ gameKey }) => baseSprite(gameKey, 358), imgS: ({ gameKey }) => shinySprite(gameKey, 358), },
		{ id: 359, natiId: 359, name: "Absol", img: ({ gameKey }) => baseSprite(gameKey, 359), imgS: ({ gameKey }) => shinySprite(gameKey, 359), },
		{ id: 360, natiId: 360, name: "Wynaut", img: ({ gameKey }) => baseSprite(gameKey, 360), imgS: ({ gameKey }) => shinySprite(gameKey, 360), },
		{ id: 361, natiId: 361, name: "Snorunt", img: ({ gameKey }) => baseSprite(gameKey, 361), imgS: ({ gameKey }) => shinySprite(gameKey, 361), },
		{ id: 362, natiId: 362, name: "Glalie", img: ({ gameKey }) => baseSprite(gameKey, 362), imgS: ({ gameKey }) => shinySprite(gameKey, 362), },
		{ id: 363, natiId: 363, name: "Spheal", img: ({ gameKey }) => baseSprite(gameKey, 363), imgS: ({ gameKey }) => shinySprite(gameKey, 363), },
		{ id: 364, natiId: 364, name: "Sealeo", img: ({ gameKey }) => baseSprite(gameKey, 364), imgS: ({ gameKey }) => shinySprite(gameKey, 364), },
		{ id: 365, natiId: 365, name: "Walrein", img: ({ gameKey }) => baseSprite(gameKey, 365), imgS: ({ gameKey }) => shinySprite(gameKey, 365), },
		{ id: 366, natiId: 366, name: "Clamperl", img: ({ gameKey }) => baseSprite(gameKey, 366), imgS: ({ gameKey }) => shinySprite(gameKey, 366), },
		{ id: 367, natiId: 367, name: "Huntail", img: ({ gameKey }) => baseSprite(gameKey, 367), imgS: ({ gameKey }) => shinySprite(gameKey, 367), },
		{ id: 368, natiId: 368, name: "Gorebyss", img: ({ gameKey }) => baseSprite(gameKey, 368), imgS: ({ gameKey }) => shinySprite(gameKey, 368), },
		{
			id: 369, natiId: 369, name: "Relicanth", img: ({ gameKey }) => baseSprite(gameKey, 369), imgS: ({ gameKey }) => shinySprite(gameKey, 369), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 369), imgS: ({ gameKey }) => shinySprite(gameKey, 369), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0369-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0369-f"), },
			],
		},
		{ id: 370, natiId: 370, name: "Luvdisc", img: ({ gameKey }) => baseSprite(gameKey, 370), imgS: ({ gameKey }) => shinySprite(gameKey, 370), },
		{ id: 371, natiId: 371, name: "Bagon", img: ({ gameKey }) => baseSprite(gameKey, 371), imgS: ({ gameKey }) => shinySprite(gameKey, 371), tags: ["pseudo"], },
		{ id: 372, natiId: 372, name: "Shelgon", img: ({ gameKey }) => baseSprite(gameKey, 372), imgS: ({ gameKey }) => shinySprite(gameKey, 372), tags: ["pseudo"], },
		{ id: 373, natiId: 373, name: "Salamence", img: ({ gameKey }) => baseSprite(gameKey, 373), imgS: ({ gameKey }) => shinySprite(gameKey, 373), tags: ["pseudo"], },
		{ id: 374, natiId: 374, name: "Beldum", img: ({ gameKey }) => baseSprite(gameKey, 374), imgS: ({ gameKey }) => shinySprite(gameKey, 374), tags: ["pseudo"], },
		{ id: 375, natiId: 375, name: "Metang", img: ({ gameKey }) => baseSprite(gameKey, 375), imgS: ({ gameKey }) => shinySprite(gameKey, 375), tags: ["pseudo"], },
		{ id: 376, natiId: 376, name: "Metagross", img: ({ gameKey }) => baseSprite(gameKey, 376), imgS: ({ gameKey }) => shinySprite(gameKey, 376), tags: ["pseudo"], },
		{ id: 377, natiId: 377, name: "Regirock", img: ({ gameKey }) => baseSprite(gameKey, 377), imgS: ({ gameKey }) => shinySprite(gameKey, 377), tags: ["legendary"], },
		{ id: 378, natiId: 378, name: "Regice", img: ({ gameKey }) => baseSprite(gameKey, 378), imgS: ({ gameKey }) => shinySprite(gameKey, 378), tags: ["legendary"], },
		{ id: 379, natiId: 379, name: "Registeel", img: ({ gameKey }) => baseSprite(gameKey, 379), imgS: ({ gameKey }) => shinySprite(gameKey, 379), tags: ["legendary"], },
		{ id: 380, natiId: 380, name: "Latias", img: ({ gameKey }) => baseSprite(gameKey, 380), imgS: ({ gameKey }) => shinySprite(gameKey, 380), tags: ["legendary"], },
		{ id: 381, natiId: 381, name: "Latios", img: ({ gameKey }) => baseSprite(gameKey, 381), imgS: ({ gameKey }) => shinySprite(gameKey, 381), tags: ["legendary"], },
		{ id: 382, natiId: 382, name: "Kyogre", img: ({ gameKey }) => baseSprite(gameKey, 382), imgS: ({ gameKey }) => shinySprite(gameKey, 382), tags: ["legendary"], },
		{ id: 383, natiId: 383, name: "Groudon", img: ({ gameKey }) => baseSprite(gameKey, 383), imgS: ({ gameKey }) => shinySprite(gameKey, 383), tags: ["legendary"], },
		{ id: 384, natiId: 384, name: "Rayquaza", img: ({ gameKey }) => baseSprite(gameKey, 384), imgS: ({ gameKey }) => shinySprite(gameKey, 384), tags: ["legendary"], },
		{ id: 385, natiId: 385, name: "Jirachi", img: ({ gameKey }) => baseSprite(gameKey, 385), imgS: ({ gameKey }) => shinySprite(gameKey, 385), tags: ["mythical"], },
		{
			id: 386, natiId: 386, name: "Deoxys", img: ({ gameKey }) => baseSprite(gameKey, 386), imgS: ({ gameKey }) => shinySprite(gameKey, 386), tags: ["mythical"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 386), imgS: ({ gameKey }) => shinySprite(gameKey, 386), },
				{ name: "Attack", img: ({ gameKey }) => baseSprite(gameKey, "0386-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0386-a"), },
				{ name: "Defense", img: ({ gameKey }) => baseSprite(gameKey, "0386-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0386-d"), },
				{ name: "Speed", img: ({ gameKey }) => baseSprite(gameKey, "0386-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0386-s"), },
			],
		},
		{ id: 387, natiId: 387, name: "Turtwig", img: ({ gameKey }) => baseSprite(gameKey, 387), imgS: ({ gameKey }) => shinySprite(gameKey, 387), tags: ["starter"], },
		{ id: 388, natiId: 388, name: "Grotle", img: ({ gameKey }) => baseSprite(gameKey, 388), imgS: ({ gameKey }) => shinySprite(gameKey, 388), tags: ["starter"], },
		{ id: 389, natiId: 389, name: "Torterra", img: ({ gameKey }) => baseSprite(gameKey, 389), imgS: ({ gameKey }) => shinySprite(gameKey, 389), tags: ["starter"], },
		{ id: 390, natiId: 390, name: "Chimchar", img: ({ gameKey }) => baseSprite(gameKey, 390), imgS: ({ gameKey }) => shinySprite(gameKey, 390), tags: ["starter"], },
		{ id: 391, natiId: 391, name: "Monferno", img: ({ gameKey }) => baseSprite(gameKey, 391), imgS: ({ gameKey }) => shinySprite(gameKey, 391), tags: ["starter"], },
		{ id: 392, natiId: 392, name: "Infernape", img: ({ gameKey }) => baseSprite(gameKey, 392), imgS: ({ gameKey }) => shinySprite(gameKey, 392), tags: ["starter"], },
		{ id: 393, natiId: 393, name: "Piplup", img: ({ gameKey }) => baseSprite(gameKey, 393), imgS: ({ gameKey }) => shinySprite(gameKey, 393), tags: ["starter"], },
		{ id: 394, natiId: 394, name: "Prinplup", img: ({ gameKey }) => baseSprite(gameKey, 394), imgS: ({ gameKey }) => shinySprite(gameKey, 394), tags: ["starter"], },
		{ id: 395, natiId: 395, name: "Empoleon", img: ({ gameKey }) => baseSprite(gameKey, 395), imgS: ({ gameKey }) => shinySprite(gameKey, 395), tags: ["starter"], },
		{
			id: 396, natiId: 396, name: "Starly", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0396-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0396-f"), },
			],
		},
		{
			id: 397, natiId: 397, name: "Staravia", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0397-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0397-f"), },
			],
		},
		{
			id: 398, natiId: 398, name: "Staraptor", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0398-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0398-f"), },
			],
		},
		{
			id: 399, natiId: 399, name: "Bidoof", img: ({ gameKey }) => baseSprite(gameKey, 399), imgS: ({ gameKey }) => shinySprite(gameKey, 399), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 399), imgS: ({ gameKey }) => shinySprite(gameKey, 399), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0399-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0399-f"), },
			],
		},
		{
			id: 400, natiId: 400, name: "Bibarel", img: ({ gameKey }) => baseSprite(gameKey, 400), imgS: ({ gameKey }) => shinySprite(gameKey, 400), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 400), imgS: ({ gameKey }) => shinySprite(gameKey, 400), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0400-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0400-f"), },
			],
		},
		{
			id: 401, natiId: 401, name: "Kricketot", img: ({ gameKey }) => baseSprite(gameKey, 401), imgS: ({ gameKey }) => shinySprite(gameKey, 401), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 401), imgS: ({ gameKey }) => shinySprite(gameKey, 401), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0401-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0401-f"), },
			],
		},
		{
			id: 402, natiId: 402, name: "Kricketune", img: ({ gameKey }) => baseSprite(gameKey, 402), imgS: ({ gameKey }) => shinySprite(gameKey, 402), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 402), imgS: ({ gameKey }) => shinySprite(gameKey, 402), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0402-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0402-f"), },
			],
		},
		{
			id: 403, natiId: 403, name: "Shinx", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0403-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0403-f"), },
			],
		},
		{
			id: 404, natiId: 404, name: "Luxio", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0404-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0404-f"), },
			],
		},
		{
			id: 405, natiId: 405, name: "Luxray", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0405-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0405-f"), },
			],
		},
		{ id: 406, natiId: 406, name: "Budew", img: ({ gameKey }) => baseSprite(gameKey, 406), imgS: ({ gameKey }) => shinySprite(gameKey, 406), },
		{
			id: 407, natiId: 407, name: "Roserade", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0407-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0407-f"), },
			],
		},
		{ id: 408, natiId: 408, name: "Cranidos", img: ({ gameKey }) => baseSprite(gameKey, 408), imgS: ({ gameKey }) => shinySprite(gameKey, 408), tags: ["fossil"], },
		{ id: 409, natiId: 409, name: "Rampardos", img: ({ gameKey }) => baseSprite(gameKey, 409), imgS: ({ gameKey }) => shinySprite(gameKey, 409), tags: ["fossil"], },
		{ id: 410, natiId: 410, name: "Shieldon", img: ({ gameKey }) => baseSprite(gameKey, 410), imgS: ({ gameKey }) => shinySprite(gameKey, 410), tags: ["fossil"], },
		{ id: 411, natiId: 411, name: "Bastiodon", img: ({ gameKey }) => baseSprite(gameKey, 411), imgS: ({ gameKey }) => shinySprite(gameKey, 411), tags: ["fossil"], },
		{
			id: 412, natiId: 412, name: "Burmy", img: ({ gameKey }) => baseSprite(gameKey, 412), imgS: ({ gameKey }) => shinySprite(gameKey, 412), tags: ["other"], forms: [
				{ name: "Plant Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0412-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0412-p"), },
				{ name: "Sandy Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0412-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0412-s"), },
				{ name: "Trash Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0412-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0412-t"), },
			],
		},
		{
			id: 413, natiId: 413, name: "Wormadam", img: ({ gameKey }) => baseSprite(gameKey, 413), imgS: ({ gameKey }) => shinySprite(gameKey, 413), tags: ["other"], forms: [
				{ name: "Plant Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0413-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0413-p"), },
				{ name: "Sandy Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0413-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0413-s"), },
				{ name: "Trash Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0413-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0413-t"), },
			],
		},
		{ id: 414, natiId: 414, name: "Mothim", img: ({ gameKey }) => baseSprite(gameKey, 414), imgS: ({ gameKey }) => shinySprite(gameKey, 414), },
		{
			id: 415, natiId: 415, name: "Combee", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0415-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0415-f"), },
			],
		},
		{ id: 416, natiId: 416, name: "Vespiquen", img: ({ gameKey }) => baseSprite(gameKey, 416), imgS: ({ gameKey }) => shinySprite(gameKey, 416), },
		{
			id: 417, natiId: 417, name: "Pachirisu", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0417-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0417-f"), },
			],
		},
		{
			id: 418, natiId: 418, name: "Buizel", img: ({ gameKey }) => baseSprite(gameKey, 418), imgS: ({ gameKey }) => shinySprite(gameKey, 418), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 418), imgS: ({ gameKey }) => shinySprite(gameKey, 418), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0418-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0418-f"), },
			],
		},
		{
			id: 419, natiId: 419, name: "Floatzel", img: ({ gameKey }) => baseSprite(gameKey, 419), imgS: ({ gameKey }) => shinySprite(gameKey, 419), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 419), imgS: ({ gameKey }) => shinySprite(gameKey, 419), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0419-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0419-f"), },
			],
		},
		{ id: 420, natiId: 420, name: "Cherubi", img: ({ gameKey }) => baseSprite(gameKey, 420), imgS: ({ gameKey }) => shinySprite(gameKey, 420), },
		{
			id: 421, natiId: 421, name: "Cherrim", img: ({ gameKey }) => baseSprite(gameKey, 421), imgS: ({ gameKey }) => shinySprite(gameKey, 421), tags: ["other"], forms: [
				{ name: "Overcast", img: ({ gameKey }) => baseSprite(gameKey, "0421-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0421-o"), },
				{ name: "Sunshine", img: ({ gameKey }) => baseSprite(gameKey, "0421-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0421-s"), },
			],
		},
		{
			id: 422, natiId: 422, name: "Shellos", img: ({ gameKey }) => baseSprite(gameKey, 422), imgS: ({ gameKey }) => shinySprite(gameKey, 422), tags: ["other"], forms: [
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0422-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0422-e"), },
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, "0422-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0422-w"), },
			],
		},
		{
			id: 423, natiId: 423, name: "Gastrodon", img: ({ gameKey }) => baseSprite(gameKey, 423), imgS: ({ gameKey }) => shinySprite(gameKey, 423), tags: ["other"], forms: [
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0423-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0423-e"), },
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, "0423-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0423-w"), },
			],
		},
		{
			id: 424, natiId: 424, name: "Ambipom", img: ({ gameKey }) => baseSprite(gameKey, 424), imgS: ({ gameKey }) => shinySprite(gameKey, 424), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 424), imgS: ({ gameKey }) => shinySprite(gameKey, 424), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0424-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0424-f"), },
			],
		},
		{ id: 425, natiId: 425, name: "Drifloon", img: ({ gameKey }) => baseSprite(gameKey, 425), imgS: ({ gameKey }) => shinySprite(gameKey, 425), },
		{ id: 426, natiId: 426, name: "Drifblim", img: ({ gameKey }) => baseSprite(gameKey, 426), imgS: ({ gameKey }) => shinySprite(gameKey, 426), },
		{ id: 427, natiId: 427, name: "Buneary", img: ({ gameKey }) => baseSprite(gameKey, 427), imgS: ({ gameKey }) => shinySprite(gameKey, 427), },
		{ id: 428, natiId: 428, name: "Lopunny", img: ({ gameKey }) => baseSprite(gameKey, 428), imgS: ({ gameKey }) => shinySprite(gameKey, 428), },
		{ id: 429, natiId: 429, name: "Mismagius", img: ({ gameKey }) => baseSprite(gameKey, 429), imgS: ({ gameKey }) => shinySprite(gameKey, 429), },
		{ id: 430, natiId: 430, name: "Honchkrow", img: ({ gameKey }) => baseSprite(gameKey, 430), imgS: ({ gameKey }) => shinySprite(gameKey, 430), },
		{ id: 431, natiId: 431, name: "Glameow", img: ({ gameKey }) => baseSprite(gameKey, 431), imgS: ({ gameKey }) => shinySprite(gameKey, 431), },
		{ id: 432, natiId: 432, name: "Purugly", img: ({ gameKey }) => baseSprite(gameKey, 432), imgS: ({ gameKey }) => shinySprite(gameKey, 432), },
		{ id: 433, natiId: 433, name: "Chingling", img: ({ gameKey }) => baseSprite(gameKey, 433), imgS: ({ gameKey }) => shinySprite(gameKey, 433), },
		{ id: 434, natiId: 434, name: "Stunky", img: ({ gameKey }) => baseSprite(gameKey, 434), imgS: ({ gameKey }) => shinySprite(gameKey, 434), },
		{ id: 435, natiId: 435, name: "Skuntank", img: ({ gameKey }) => baseSprite(gameKey, 435), imgS: ({ gameKey }) => shinySprite(gameKey, 435), },
		{ id: 436, natiId: 436, name: "Bronzor", img: ({ gameKey }) => baseSprite(gameKey, 436), imgS: ({ gameKey }) => shinySprite(gameKey, 436), },
		{ id: 437, natiId: 437, name: "Bronzong", img: ({ gameKey }) => baseSprite(gameKey, 437), imgS: ({ gameKey }) => shinySprite(gameKey, 437), },
		{ id: 438, natiId: 438, name: "Bonsly", img: ({ gameKey }) => baseSprite(gameKey, 438), imgS: ({ gameKey }) => shinySprite(gameKey, 438), },
		{ id: 439, natiId: 439, name: "Mime Jr.", img: ({ gameKey }) => baseSprite(gameKey, 439), imgS: ({ gameKey }) => shinySprite(gameKey, 439), },
		{ id: 440, natiId: 440, name: "Happiny", img: ({ gameKey }) => baseSprite(gameKey, 440), imgS: ({ gameKey }) => shinySprite(gameKey, 440), },
		{ id: 441, natiId: 441, name: "Chatot", img: ({ gameKey }) => baseSprite(gameKey, 441), imgS: ({ gameKey }) => shinySprite(gameKey, 441), },
		{ id: 442, natiId: 442, name: "Spiritomb", img: ({ gameKey }) => baseSprite(gameKey, 442), imgS: ({ gameKey }) => shinySprite(gameKey, 442), },
		{
			id: 443, natiId: 443, name: "Gible", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0443-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0443-f"), },
			],
		},
		{
			id: 444, natiId: 444, name: "Gabite", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0444-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0444-f"), },
			],
		},
		{
			id: 445, natiId: 445, name: "Garchomp", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0445-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0445-f"), },
			],
		},
		{ id: 446, natiId: 446, name: "Munchlax", img: ({ gameKey }) => baseSprite(gameKey, 446), imgS: ({ gameKey }) => shinySprite(gameKey, 446), },
		{ id: 447, natiId: 447, name: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447), imgS: ({ gameKey }) => shinySprite(gameKey, 447), },
		{ id: 448, natiId: 448, name: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), imgS: ({ gameKey }) => shinySprite(gameKey, 448), },
		{
			id: 449, natiId: 449, name: "Hippopotas", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0449-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0449-f"), },
			],
		},
		{
			id: 450, natiId: 450, name: "Hippowdon", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0450-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0450-f"), },
			],
		},
		{ id: 451, natiId: 451, name: "Skorupi", img: ({ gameKey }) => baseSprite(gameKey, 451), imgS: ({ gameKey }) => shinySprite(gameKey, 451), },
		{ id: 452, natiId: 452, name: "Drapion", img: ({ gameKey }) => baseSprite(gameKey, 452), imgS: ({ gameKey }) => shinySprite(gameKey, 452), },
		{
			id: 453, natiId: 453, name: "Croagunk", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0453-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0453-f"), },
			],
		},
		{
			id: 454, natiId: 454, name: "Toxicroak", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0454-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0454-f"), },
			],
		},
		{ id: 455, natiId: 455, name: "Carnivine", img: ({ gameKey }) => baseSprite(gameKey, 455), imgS: ({ gameKey }) => shinySprite(gameKey, 455), },
		{
			id: 456, natiId: 456, name: "Finneon", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0456-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0456-f"), },
			],
		},
		{
			id: 457, natiId: 457, name: "Lumineon", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0457-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0457-f"), },
			],
		},
		{ id: 458, natiId: 458, name: "Mantyke", img: ({ gameKey }) => baseSprite(gameKey, 458), imgS: ({ gameKey }) => shinySprite(gameKey, 458), },
		{
			id: 459, natiId: 459, name: "Snover", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0459-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0459-f"), },
			],
		},
		{
			id: 460, natiId: 460, name: "Abomasnow", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0460-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0460-f"), },
			],
		},
		{
			id: 461, natiId: 461, name: "Weavile", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0461-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0461-f"), },
			],
		},
		{ id: 462, natiId: 462, name: "Magnezone", img: ({ gameKey }) => baseSprite(gameKey, 462), imgS: ({ gameKey }) => shinySprite(gameKey, 462), },
		{ id: 463, natiId: 463, name: "Lickilicky", img: ({ gameKey }) => baseSprite(gameKey, 463), imgS: ({ gameKey }) => shinySprite(gameKey, 463), },
		{
			id: 464, natiId: 464, name: "Rhyperior", img: ({ gameKey }) => baseSprite(gameKey, 464), imgS: ({ gameKey }) => shinySprite(gameKey, 464), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 464), imgS: ({ gameKey }) => shinySprite(gameKey, 464), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0464-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0464-f"), },
			],
		},
		{
			id: 465, natiId: 465, name: "Tangrowth", img: ({ gameKey }) => baseSprite(gameKey, 465), imgS: ({ gameKey }) => shinySprite(gameKey, 465), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 465), imgS: ({ gameKey }) => shinySprite(gameKey, 465), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0465-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0465-f"), },
			],
		},
		{ id: 466, natiId: 466, name: "Electivire", img: ({ gameKey }) => baseSprite(gameKey, 466), imgS: ({ gameKey }) => shinySprite(gameKey, 466), },
		{ id: 467, natiId: 467, name: "Magmortar", img: ({ gameKey }) => baseSprite(gameKey, 467), imgS: ({ gameKey }) => shinySprite(gameKey, 467), },
		{ id: 468, natiId: 468, name: "Togekiss", img: ({ gameKey }) => baseSprite(gameKey, 468), imgS: ({ gameKey }) => shinySprite(gameKey, 468), },
		{ id: 469, natiId: 469, name: "Yanmega", img: ({ gameKey }) => baseSprite(gameKey, 469), imgS: ({ gameKey }) => shinySprite(gameKey, 469), },
		{ id: 470, natiId: 470, name: "Leafeon", img: ({ gameKey }) => baseSprite(gameKey, 470), imgS: ({ gameKey }) => shinySprite(gameKey, 470), },
		{ id: 471, natiId: 471, name: "Glaceon", img: ({ gameKey }) => baseSprite(gameKey, 471), imgS: ({ gameKey }) => shinySprite(gameKey, 471), },
		{ id: 472, natiId: 472, name: "Gliscor", img: ({ gameKey }) => baseSprite(gameKey, 472), imgS: ({ gameKey }) => shinySprite(gameKey, 472), },
		{
			id: 473, natiId: 473, name: "Mamoswine", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0473-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0473-f"), },
			],
		},
		{ id: 474, natiId: 474, name: "Porygon-Z", img: ({ gameKey }) => baseSprite(gameKey, 474), imgS: ({ gameKey }) => shinySprite(gameKey, 474), },
		{ id: 475, natiId: 475, name: "Gallade", img: ({ gameKey }) => baseSprite(gameKey, 475), imgS: ({ gameKey }) => shinySprite(gameKey, 475), },
		{ id: 476, natiId: 476, name: "Probopass", img: ({ gameKey }) => baseSprite(gameKey, 476), imgS: ({ gameKey }) => shinySprite(gameKey, 476), },
		{ id: 477, natiId: 477, name: "Dusknoir", img: ({ gameKey }) => baseSprite(gameKey, 477), imgS: ({ gameKey }) => shinySprite(gameKey, 477), },
		{ id: 478, natiId: 478, name: "Froslass", img: ({ gameKey }) => baseSprite(gameKey, 478), imgS: ({ gameKey }) => shinySprite(gameKey, 478), },
		{ id: 479, natiId: 479, name: "Rotom", img: ({ gameKey }) => baseSprite(gameKey, 479), imgS: ({ gameKey }) => shinySprite(gameKey, 479), },
		{ id: 480, natiId: 480, name: "Uxie", img: ({ gameKey }) => baseSprite(gameKey, 480), imgS: ({ gameKey }) => shinySprite(gameKey, 480), tags: ["legendary"], },
		{ id: 481, natiId: 481, name: "Mesprit", img: ({ gameKey }) => baseSprite(gameKey, 481), imgS: ({ gameKey }) => shinySprite(gameKey, 481), tags: ["legendary"], },
		{ id: 482, natiId: 482, name: "Azelf", img: ({ gameKey }) => baseSprite(gameKey, 482), imgS: ({ gameKey }) => shinySprite(gameKey, 482), tags: ["legendary"], },
		{ id: 483, natiId: 483, name: "Dialga", img: ({ gameKey }) => baseSprite(gameKey, 483), imgS: ({ gameKey }) => shinySprite(gameKey, 483), tags: ["legendary"], },
		{ id: 484, natiId: 484, name: "Palkia", img: ({ gameKey }) => baseSprite(gameKey, 484), imgS: ({ gameKey }) => shinySprite(gameKey, 484), tags: ["legendary"], },
		{ id: 485, natiId: 485, name: "Heatran", img: ({ gameKey }) => baseSprite(gameKey, 485), imgS: ({ gameKey }) => shinySprite(gameKey, 485), tags: ["legendary"], },
		{ id: 486, natiId: 486, name: "Regigigas", img: ({ gameKey }) => baseSprite(gameKey, 486), imgS: ({ gameKey }) => shinySprite(gameKey, 486), tags: ["legendary"], },
		{ id: 487, natiId: 487, name: "Giratina", img: ({ gameKey }) => baseSprite(gameKey, 487), imgS: ({ gameKey }) => shinySprite(gameKey, 487), tags: ["legendary"], },
		{ id: 488, natiId: 488, name: "Cresselia", img: ({ gameKey }) => baseSprite(gameKey, 488), imgS: ({ gameKey }) => shinySprite(gameKey, 488), tags: ["legendary"], },
		{ id: 489, natiId: 489, name: "Phione", img: ({ gameKey }) => baseSprite(gameKey, 489), imgS: ({ gameKey }) => shinySprite(gameKey, 489), tags: ["mythical"], },
		{ id: 490, natiId: 490, name: "Manaphy", img: ({ gameKey }) => baseSprite(gameKey, 490), imgS: ({ gameKey }) => shinySprite(gameKey, 490), tags: ["mythical"], },
		{ id: 491, natiId: 491, name: "Darkrai", img: ({ gameKey }) => baseSprite(gameKey, 491), imgS: ({ gameKey }) => shinySprite(gameKey, 491), tags: ["mythical"], },
		{ id: 492, natiId: 492, name: "Shaymin", img: ({ gameKey }) => baseSprite(gameKey, 492), imgS: ({ gameKey }) => shinySprite(gameKey, 492), tags: ["mythical"], },
		{ id: 493, natiId: 493, name: "Arceus", img: ({ gameKey }) => baseSprite(gameKey, 493), imgS: ({ gameKey }) => shinySprite(gameKey, 493), tags: ["mythical"], },
	];

	window._registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();