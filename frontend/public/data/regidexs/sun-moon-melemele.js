(() => {
	const gen = 7;
	const GAME_KEYS = ["sun-melemele", "moon-melemele"];
	const DEX_NAME = "Melemele Dex";

	const baseSprite = (gameKey, natiId) => window.dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => window.dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 722, name: "Rowlet", img: ({ gameKey }) => baseSprite(gameKey, 722), imgS: ({ gameKey }) => shinySprite(gameKey, 722), tags: ["starter"], },
		{ id: 2, natiId: 723, name: "Dartrix", img: ({ gameKey }) => baseSprite(gameKey, 723), imgS: ({ gameKey }) => shinySprite(gameKey, 723), tags: ["starter"], },
		{ id: 3, natiId: 724, name: "Decidueye", img: ({ gameKey }) => baseSprite(gameKey, 724), imgS: ({ gameKey }) => shinySprite(gameKey, 724), tags: ["starter", "zcrystal"], },
		{ id: 4, natiId: 725, name: "Litten", img: ({ gameKey }) => baseSprite(gameKey, 725), imgS: ({ gameKey }) => shinySprite(gameKey, 725), tags: ["starter"], },
		{ id: 5, natiId: 726, name: "Torracat", img: ({ gameKey }) => baseSprite(gameKey, 726), imgS: ({ gameKey }) => shinySprite(gameKey, 726), tags: ["starter"], },
		{ id: 6, natiId: 727, name: "Incineroar", img: ({ gameKey }) => baseSprite(gameKey, 727), imgS: ({ gameKey }) => shinySprite(gameKey, 727), tags: ["starter", "zcrystal"], },
		{ id: 7, natiId: 728, name: "Popplio", img: ({ gameKey }) => baseSprite(gameKey, 728), imgS: ({ gameKey }) => shinySprite(gameKey, 728), tags: ["starter"], },
		{ id: 8, natiId: 729, name: "Brionne", img: ({ gameKey }) => baseSprite(gameKey, 729), imgS: ({ gameKey }) => shinySprite(gameKey, 729), tags: ["starter"], },
		{ id: 9, natiId: 730, name: "Primarina", img: ({ gameKey }) => baseSprite(gameKey, 730), imgS: ({ gameKey }) => shinySprite(gameKey, 730), tags: ["starter", "zcrystal"], },
		{ id: 10, natiId: 731, name: "Pikipek", img: ({ gameKey }) => baseSprite(gameKey, 731), imgS: ({ gameKey }) => shinySprite(gameKey, 731), },
		{ id: 11, natiId: 732, name: "Trumbeak", img: ({ gameKey }) => baseSprite(gameKey, 732), imgS: ({ gameKey }) => shinySprite(gameKey, 732), },
		{ id: 12, natiId: 733, name: "Toucannon", img: ({ gameKey }) => baseSprite(gameKey, 733), imgS: ({ gameKey }) => shinySprite(gameKey, 733), },
		{ id: 13, natiId: 734, name: "Yungoos", img: ({ gameKey }) => baseSprite(gameKey, 734), imgS: ({ gameKey }) => shinySprite(gameKey, 734), },
		{ id: 14, natiId: 735, name: "Gumshoos", img: ({ gameKey }) => baseSprite(gameKey, 735), imgS: ({ gameKey }) => shinySprite(gameKey, 735), },
		{
			id: 15, natiId: 19, name: "Rattata", img: ({ gameKey }) => baseSprite(gameKey, "0019-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0019-a"), tags: ["gender"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 19), imgS: ({ gameKey }) => shinySprite(gameKey, 19), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0019-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0019-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0019-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0019-a"), tags: ["alolan", "zcrystal"] },
			],
		},
		{
			id: 16, natiId: 20, name: "Raticate", img: ({ gameKey }) => baseSprite(gameKey, "0020-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-a"), tags: ["gender"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 20), imgS: ({ gameKey }) => shinySprite(gameKey, 20), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0020-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0020-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-a"), tags: ["alolan"] },
			],
		},
		{ id: 17, natiId: 10, name: "Caterpie", img: ({ gameKey }) => baseSprite(gameKey, 10), imgS: ({ gameKey }) => shinySprite(gameKey, 10), },
		{ id: 18, natiId: 11, name: "Metapod", img: ({ gameKey }) => baseSprite(gameKey, 11), imgS: ({ gameKey }) => shinySprite(gameKey, 11), },
		{
			id: 19, natiId: 12, name: "Butterfree", img: ({ gameKey }) => baseSprite(gameKey, 12), imgS: ({ gameKey }) => shinySprite(gameKey, 12), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 12), imgS: ({ gameKey }) => shinySprite(gameKey, 12), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0012-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0012-f"), },
			],
		},
		{
			id: 20, natiId: 165, name: "Ledyba", img: ({ gameKey }) => baseSprite(gameKey, 165), imgS: ({ gameKey }) => shinySprite(gameKey, 165), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 165), imgS: ({ gameKey }) => shinySprite(gameKey, 165), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0165-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0165-f"), },
			],
		},
		{
			id: 21, natiId: 166, name: "Ledian", img: ({ gameKey }) => baseSprite(gameKey, 166), imgS: ({ gameKey }) => shinySprite(gameKey, 166), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 166), imgS: ({ gameKey }) => shinySprite(gameKey, 166), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0166-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0166-f"), },
			],
		},
		{ id: 22, natiId: 167, name: "Spinarak", img: ({ gameKey }) => baseSprite(gameKey, 167), imgS: ({ gameKey }) => shinySprite(gameKey, 167), },
		{ id: 23, natiId: 168, name: "Ariados", img: ({ gameKey }) => baseSprite(gameKey, 168), imgS: ({ gameKey }) => shinySprite(gameKey, 168), },
		{ id: 24, natiId: 172, name: "Pichu", img: ({ gameKey }) => baseSprite(gameKey, 172), imgS: ({ gameKey }) => shinySprite(gameKey, 172), },
		{
			id: 25, natiId: 25, name: "Pikachu", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), tags: ["gender", "other"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0025-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-f"), },
				{ name: "Alola Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-a"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Hoenn Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-h"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Kalos Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-k"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-k"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Original Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-o"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Partner Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-p"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Sinnoh Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-s"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Unova Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-u"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-u"), maxStatus: "caught", tags: ["mythical"], },
			],
		},
		{
			id: 26, natiId: 26, name: "Raichu", img: ({ gameKey }) => baseSprite(gameKey, "0026-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-a"), tags: ["gender", "zcrystal"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0026-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0026-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-a"), tags: ["alolan"] },
			],
		},
		{ id: 27, natiId: 736, name: "Grubbin", img: ({ gameKey }) => baseSprite(gameKey, 736), imgS: ({ gameKey }) => shinySprite(gameKey, 736), },
		{ id: 28, natiId: 737, name: "Charjabug", img: ({ gameKey }) => baseSprite(gameKey, 737), imgS: ({ gameKey }) => shinySprite(gameKey, 737), },
		{ id: 29, natiId: 738, name: "Vikavolt", img: ({ gameKey }) => baseSprite(gameKey, 738), imgS: ({ gameKey }) => shinySprite(gameKey, 738), },
		{ id: 30, natiId: 438, name: "Bonsly", img: ({ gameKey }) => baseSprite(gameKey, 438), imgS: ({ gameKey }) => shinySprite(gameKey, 438), },
		{
			id: 31, natiId: 185, name: "Sudowoodo", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0185-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0185-f"), },
			],
		},
		{ id: 32, natiId: 440, name: "Happiny", img: ({ gameKey }) => baseSprite(gameKey, 440), imgS: ({ gameKey }) => shinySprite(gameKey, 440), },
		{ id: 33, natiId: 113, name: "Chansey", img: ({ gameKey }) => baseSprite(gameKey, 113), imgS: ({ gameKey }) => shinySprite(gameKey, 113), },
		{ id: 34, natiId: 242, name: "Blissey", img: ({ gameKey }) => baseSprite(gameKey, 242), imgS: ({ gameKey }) => shinySprite(gameKey, 242), },
		{ id: 35, natiId: 446, name: "Munchlax", img: ({ gameKey }) => baseSprite(gameKey, 446), imgS: ({ gameKey }) => shinySprite(gameKey, 446), },
		{ id: 36, natiId: 143, name: "Snorlax", img: ({ gameKey }) => baseSprite(gameKey, 143), imgS: ({ gameKey }) => shinySprite(gameKey, 143), },
		{ id: 37, natiId: 79, name: "Slowpoke", img: ({ gameKey }) => baseSprite(gameKey, 79), imgS: ({ gameKey }) => shinySprite(gameKey, 79), },
		{ id: 38, natiId: 80, name: "Slowbro", img: ({ gameKey }) => baseSprite(gameKey, 80), imgS: ({ gameKey }) => shinySprite(gameKey, 80), tags: ["mega"], },
		{ id: 39, natiId: 199, name: "Slowking", img: ({ gameKey }) => baseSprite(gameKey, 199), imgS: ({ gameKey }) => shinySprite(gameKey, 199), },
		{ id: 40, natiId: 278, name: "Wingull", img: ({ gameKey }) => baseSprite(gameKey, 278), imgS: ({ gameKey }) => shinySprite(gameKey, 278), },
		{ id: 41, natiId: 279, name: "Pelipper", img: ({ gameKey }) => baseSprite(gameKey, 279), imgS: ({ gameKey }) => shinySprite(gameKey, 279), },
		{ id: 42, natiId: 63, name: "Abra", img: ({ gameKey }) => baseSprite(gameKey, 63), imgS: ({ gameKey }) => shinySprite(gameKey, 63), },
		{
			id: 43, natiId: 64, name: "Kadabra", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0064-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0064-f"), },
			],
		},
		{
			id: 44, natiId: 65, name: "Alakazam", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0065-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0065-f"), },
			],
		},
		{
			id: 45, natiId: 52, name: "Meowth", img: ({ gameKey }) => baseSprite(gameKey, "0052-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0052-a"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 52), imgS: ({ gameKey }) => shinySprite(gameKey, 52), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0052-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0052-a"), tags: ["alolan"] },
			],
		},
		{
			id: 46, natiId: 53, name: "Persian", img: ({ gameKey }) => baseSprite(gameKey, "0053-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0053-a"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 53), imgS: ({ gameKey }) => shinySprite(gameKey, 53), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0053-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0053-a"), tags: ["alolan"] },
			],
		},
		{ id: 47, natiId: 81, name: "Magnemite", img: ({ gameKey }) => baseSprite(gameKey, 81), imgS: ({ gameKey }) => shinySprite(gameKey, 81), },
		{ id: 48, natiId: 82, name: "Magneton", img: ({ gameKey }) => baseSprite(gameKey, 82), imgS: ({ gameKey }) => shinySprite(gameKey, 82), },
		{ id: 49, natiId: 462, name: "Magnezone", img: ({ gameKey }) => baseSprite(gameKey, 462), imgS: ({ gameKey }) => shinySprite(gameKey, 462), },
		{
			id: 50, natiId: 88, name: "Grimer", img: ({ gameKey }) => baseSprite(gameKey, "0088-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0088-a"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 88), imgS: ({ gameKey }) => shinySprite(gameKey, 88), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0088-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0088-a"), tags: ["alolan"] },
			],
		},
		{
			id: 51, natiId: 89, name: "Muk", img: ({ gameKey }) => baseSprite(gameKey, "0089-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0089-a"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 89), imgS: ({ gameKey }) => shinySprite(gameKey, 89), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0089-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0089-a"), tags: ["alolan"] },
			],
		},
		{ id: 52, natiId: 58, name: "Growlithe", img: ({ gameKey }) => baseSprite(gameKey, 58), imgS: ({ gameKey }) => shinySprite(gameKey, 58), },
		{ id: 53, natiId: 59, name: "Arcanine", img: ({ gameKey }) => baseSprite(gameKey, 59), imgS: ({ gameKey }) => shinySprite(gameKey, 59), },
		{ id: 54, natiId: 96, name: "Drowzee", img: ({ gameKey }) => baseSprite(gameKey, 96), imgS: ({ gameKey }) => shinySprite(gameKey, 96), },
		{
			id: 55, natiId: 97, name: "Hypno", img: ({ gameKey }) => baseSprite(gameKey, 97), imgS: ({ gameKey }) => shinySprite(gameKey, 97), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 97), imgS: ({ gameKey }) => shinySprite(gameKey, 97), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0097-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0097-f"), },
			],
		},
		{ id: 56, natiId: 296, name: "Makuhita", img: ({ gameKey }) => baseSprite(gameKey, 296), imgS: ({ gameKey }) => shinySprite(gameKey, 296), },
		{ id: 57, natiId: 297, name: "Hariyama", img: ({ gameKey }) => baseSprite(gameKey, 297), imgS: ({ gameKey }) => shinySprite(gameKey, 297), },
		{ id: 58, natiId: 235, name: "Smeargle", img: ({ gameKey }) => baseSprite(gameKey, 235), imgS: ({ gameKey }) => shinySprite(gameKey, 235), },
		{ id: 59, natiId: 739, name: "Crabrawler", img: ({ gameKey }) => baseSprite(gameKey, 739), imgS: ({ gameKey }) => shinySprite(gameKey, 739), },
		{ id: 60, natiId: 740, name: "Crabominable", img: ({ gameKey }) => baseSprite(gameKey, 740), imgS: ({ gameKey }) => shinySprite(gameKey, 740), },
		{ id: 61, natiId: 92, name: "Gastly", img: ({ gameKey }) => baseSprite(gameKey, 92), imgS: ({ gameKey }) => shinySprite(gameKey, 92), },
		{ id: 62, natiId: 93, name: "Haunter", img: ({ gameKey }) => baseSprite(gameKey, 93), imgS: ({ gameKey }) => shinySprite(gameKey, 93), },
		{ id: 63, natiId: 94, name: "Gengar", img: ({ gameKey }) => baseSprite(gameKey, 94), imgS: ({ gameKey }) => shinySprite(gameKey, 94), tags: ["mega"], },
		{ id: 64, natiId: 425, name: "Drifloon", img: ({ gameKey }) => baseSprite(gameKey, 425), imgS: ({ gameKey }) => shinySprite(gameKey, 425), },
		{ id: 65, natiId: 426, name: "Drifblim", img: ({ gameKey }) => baseSprite(gameKey, 426), imgS: ({ gameKey }) => shinySprite(gameKey, 426), },
		{ id: 66, natiId: 200, name: "Misdreavus", img: ({ gameKey }) => baseSprite(gameKey, 200), imgS: ({ gameKey }) => shinySprite(gameKey, 200), },
		{ id: 67, natiId: 429, name: "Mismagius", img: ({ gameKey }) => baseSprite(gameKey, 429), imgS: ({ gameKey }) => shinySprite(gameKey, 429), },
		{
			id: 68, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), },
			],
		},
		{
			id: 69, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), },
			],
		},
		{ id: 70, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169), },
		{
			id: 71, natiId: 50, name: "Diglett", img: ({ gameKey }) => baseSprite(gameKey, "0050-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0050-a"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0050-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0050-a"), tags: ["alolan"] },
			],
		},
		{
			id: 72, natiId: 51, name: "Dugtrio", img: ({ gameKey }) => baseSprite(gameKey, "0051-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0051-a"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0051-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0051-a"), tags: ["alolan"] },
			],
		},
		{ id: 73, natiId: 21, name: "Spearow", img: ({ gameKey }) => baseSprite(gameKey, 21), imgS: ({ gameKey }) => shinySprite(gameKey, 21), },
		{ id: 74, natiId: 22, name: "Fearow", img: ({ gameKey }) => baseSprite(gameKey, 22), imgS: ({ gameKey }) => shinySprite(gameKey, 22), },
		{ id: 75, natiId: 627, name: "Rufflet", img: ({ gameKey }) => baseSprite(gameKey, 627), imgS: ({ gameKey }) => shinySprite(gameKey, 627), },
		{ id: 76, natiId: 628, name: "Braviary", img: ({ gameKey }) => baseSprite(gameKey, 628), imgS: ({ gameKey }) => shinySprite(gameKey, 628), },
		{ id: 77, natiId: 629, name: "Vullaby", img: ({ gameKey }) => baseSprite(gameKey, 629), imgS: ({ gameKey }) => shinySprite(gameKey, 629), },
		{ id: 78, natiId: 630, name: "Mandibuzz", img: ({ gameKey }) => baseSprite(gameKey, 630), imgS: ({ gameKey }) => shinySprite(gameKey, 630), },
		{ id: 79, natiId: 56, name: "Mankey", img: ({ gameKey }) => baseSprite(gameKey, 56), imgS: ({ gameKey }) => shinySprite(gameKey, 56), },
		{ id: 80, natiId: 57, name: "Primeape", img: ({ gameKey }) => baseSprite(gameKey, 57), imgS: ({ gameKey }) => shinySprite(gameKey, 57), },
		{ id: 81, natiId: 225, name: "Delibird", img: ({ gameKey }) => baseSprite(gameKey, 225), imgS: ({ gameKey }) => shinySprite(gameKey, 225), },
		{
			id: 82, natiId: 741, name: "Oricorio", img: ({ gameKey }) => baseSprite(gameKey, "0741-po"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-po"), tags: ["other"], forms: [
				{ name: "Baile Style", img: ({ gameKey }) => baseSprite(gameKey, 741), imgS: ({ gameKey }) => shinySprite(gameKey, 741), },
				{ name: "Pa'u Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-pa"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-p"), },
				{ name: "Pom-Pom Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-po"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-p"), },
				{ name: "Sensu Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-s"), },
			],
		},
		{ id: 83, natiId: 742, name: "Cutiefly", img: ({ gameKey }) => baseSprite(gameKey, 742), imgS: ({ gameKey }) => shinySprite(gameKey, 742), },
		{ id: 84, natiId: 743, name: "Ribombee", img: ({ gameKey }) => baseSprite(gameKey, 743), imgS: ({ gameKey }) => shinySprite(gameKey, 743), },
		{ id: 85, natiId: 548, name: "Petilil", img: ({ gameKey }) => baseSprite(gameKey, 548), imgS: ({ gameKey }) => shinySprite(gameKey, 548), },
		{ id: 86, natiId: 549, name: "Lilligant", img: ({ gameKey }) => baseSprite(gameKey, 549), imgS: ({ gameKey }) => shinySprite(gameKey, 549), },
		{ id: 87, natiId: 546, name: "Cottonee", img: ({ gameKey }) => baseSprite(gameKey, 546), imgS: ({ gameKey }) => shinySprite(gameKey, 546), },
		{ id: 88, natiId: 547, name: "Whimsicott", img: ({ gameKey }) => baseSprite(gameKey, 547), imgS: ({ gameKey }) => shinySprite(gameKey, 547), },
		{ id: 89, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54), },
		{ id: 90, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55), },
		{
			id: 91, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), },
			],
		},
		{
			id: 92, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },
			],
		},
		{ id: 93, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339), },
		{ id: 94, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340), },
		{ id: 95, natiId: 66, name: "Machop", img: ({ gameKey }) => baseSprite(gameKey, 66), imgS: ({ gameKey }) => shinySprite(gameKey, 66), },
		{ id: 96, natiId: 67, name: "Machoke", img: ({ gameKey }) => baseSprite(gameKey, 67), imgS: ({ gameKey }) => shinySprite(gameKey, 67), },
		{ id: 97, natiId: 68, name: "Machamp", img: ({ gameKey }) => baseSprite(gameKey, 68), imgS: ({ gameKey }) => shinySprite(gameKey, 68), },
		{ id: 98, natiId: 524, name: "Roggenrola", img: ({ gameKey }) => baseSprite(gameKey, 524), imgS: ({ gameKey }) => shinySprite(gameKey, 524), },
		{ id: 99, natiId: 525, name: "Boldore", img: ({ gameKey }) => baseSprite(gameKey, 525), imgS: ({ gameKey }) => shinySprite(gameKey, 525), },
		{ id: 100, natiId: 526, name: "Gigalith", img: ({ gameKey }) => baseSprite(gameKey, 526), imgS: ({ gameKey }) => shinySprite(gameKey, 526), },
		{ id: 101, natiId: 703, name: "Carbink", img: ({ gameKey }) => baseSprite(gameKey, 703), imgS: ({ gameKey }) => shinySprite(gameKey, 703), },
		{ id: 102, natiId: 302, name: "Sableye", img: ({ gameKey }) => baseSprite(gameKey, 302), imgS: ({ gameKey }) => shinySprite(gameKey, 302), tags: ["mega"], },
		{ id: 103, natiId: 744, name: "Rockruff", img: ({ gameKey }) => baseSprite(gameKey, 744), imgS: ({ gameKey }) => shinySprite(gameKey, 744), },
		{
			id: 104, natiId: 745, name: "Lycanroc", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), tags: ["other"], forms: [
				{ name: "Midday", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), },
				{ name: "Midnight", img: ({ gameKey }) => baseSprite(gameKey, "0745-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-m"), },
				{ name: "Dusk", img: ({ gameKey }) => baseSprite(gameKey, "0745-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-d"), },
			],
		},
		{ id: 105, natiId: 327, name: "Spinda", img: ({ gameKey }) => baseSprite(gameKey, 327), imgS: ({ gameKey }) => shinySprite(gameKey, 327), },
		{ id: 106, natiId: 72, name: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72), imgS: ({ gameKey }) => shinySprite(gameKey, 72), },
		{ id: 107, natiId: 73, name: "Tentacruel", img: ({ gameKey }) => baseSprite(gameKey, 73), imgS: ({ gameKey }) => shinySprite(gameKey, 73), },
		{
			id: 108, natiId: 456, name: "Finneon", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0456-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0456-f"), },
			],
		},
		{
			id: 109, natiId: 457, name: "Lumineon", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0457-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0457-f"), },
			],
		},
		{ id: 110, natiId: 746, name: "Wishiwashi", img: ({ gameKey }) => baseSprite(gameKey, 746), imgS: ({ gameKey }) => shinySprite(gameKey, 746), },
		{ id: 111, natiId: 370, name: "Luvdisc", img: ({ gameKey }) => baseSprite(gameKey, 370), imgS: ({ gameKey }) => shinySprite(gameKey, 370), },
		{ id: 112, natiId: 222, name: "Corsola", img: ({ gameKey }) => baseSprite(gameKey, 222), imgS: ({ gameKey }) => shinySprite(gameKey, 222), },
		{ id: 113, natiId: 747, name: "Mareanie", img: ({ gameKey }) => baseSprite(gameKey, 747), imgS: ({ gameKey }) => shinySprite(gameKey, 747), },
		{ id: 114, natiId: 748, name: "Toxapex", img: ({ gameKey }) => baseSprite(gameKey, 748), imgS: ({ gameKey }) => shinySprite(gameKey, 748), },
		{ id: 115, natiId: 90, name: "Shellder", img: ({ gameKey }) => baseSprite(gameKey, 90), imgS: ({ gameKey }) => shinySprite(gameKey, 90), },
		{ id: 116, natiId: 91, name: "Cloyster", img: ({ gameKey }) => baseSprite(gameKey, 91), imgS: ({ gameKey }) => shinySprite(gameKey, 91), },
		{ id: 117, natiId: 371, name: "Bagon", img: ({ gameKey }) => baseSprite(gameKey, 371), imgS: ({ gameKey }) => shinySprite(gameKey, 371), tags: ["pseudo"], },
		{ id: 118, natiId: 372, name: "Shelgon", img: ({ gameKey }) => baseSprite(gameKey, 372), imgS: ({ gameKey }) => shinySprite(gameKey, 372), tags: ["pseudo"], },
		{ id: 119, natiId: 373, name: "Salamence", img: ({ gameKey }) => baseSprite(gameKey, 373), imgS: ({ gameKey }) => shinySprite(gameKey, 373), tags: ["pseudo", "mega"], },
		{ id: 120, natiId: 785, name: "Tapu Koko", img: ({ gameKey }) => baseSprite(gameKey, 785), imgS: ({ gameKey }) => shinySprite(gameKey, 785), tags: ["legendary", "zcrystal"], },
	];

	window._registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();