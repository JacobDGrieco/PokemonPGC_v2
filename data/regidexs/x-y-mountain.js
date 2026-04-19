import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 6;
	const GAME_KEYS = ["x-mountain", "y-mountain"];
	const DEX_NAME = "Mountain Kalos Dex";

	const baseSprite = (gameKey, natiId) => dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 50, name: "Diglett", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50) },
		{ id: 2, natiId: 51, name: "Dugtrio", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51) },
		{ id: 3, natiId: 328, name: "Trapinch", img: ({ gameKey }) => baseSprite(gameKey, 328), imgS: ({ gameKey }) => shinySprite(gameKey, 328) },
		{ id: 4, natiId: 329, name: "Vibrava", img: ({ gameKey }) => baseSprite(gameKey, 329), imgS: ({ gameKey }) => shinySprite(gameKey, 329) },
		{ id: 5, natiId: 330, name: "Flygon", img: ({ gameKey }) => baseSprite(gameKey, 330), imgS: ({ gameKey }) => shinySprite(gameKey, 330) },
		{
			id: 6, natiId: 443, name: "Gible", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0443-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0443-f"), },
			]
		},
		{
			id: 7, natiId: 444, name: "Gabite", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0444-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0444-f"), },
			]
		},
		{
			id: 8, natiId: 445, name: "Garchomp", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), tags: ["gender", "pseudo", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0445-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0445-f"), },]
		},
		{ id: 9, natiId: 74, name: "Geodude", img: ({ gameKey }) => baseSprite(gameKey, 74), imgS: ({ gameKey }) => shinySprite(gameKey, 74) },
		{ id: 10, natiId: 75, name: "Graveler", img: ({ gameKey }) => baseSprite(gameKey, 75), imgS: ({ gameKey }) => shinySprite(gameKey, 75) },
		{ id: 11, natiId: 76, name: "Golem", img: ({ gameKey }) => baseSprite(gameKey, 76), imgS: ({ gameKey }) => shinySprite(gameKey, 76) },
		{ id: 12, natiId: 218, name: "Slugma", img: ({ gameKey }) => baseSprite(gameKey, 218), imgS: ({ gameKey }) => shinySprite(gameKey, 218) },
		{ id: 13, natiId: 219, name: "Magcargo", img: ({ gameKey }) => baseSprite(gameKey, 219), imgS: ({ gameKey }) => shinySprite(gameKey, 219) },
		{ id: 14, natiId: 213, name: "Shuckle", img: ({ gameKey }) => baseSprite(gameKey, 213), imgS: ({ gameKey }) => shinySprite(gameKey, 213) },
		{ id: 15, natiId: 451, name: "Skorupi", img: ({ gameKey }) => baseSprite(gameKey, 451), imgS: ({ gameKey }) => shinySprite(gameKey, 451) },
		{ id: 16, natiId: 452, name: "Drapion", img: ({ gameKey }) => baseSprite(gameKey, 452), imgS: ({ gameKey }) => shinySprite(gameKey, 452) },
		{
			id: 17, natiId: 194, name: "Wooper", img: ({ gameKey }) => baseSprite(gameKey, 194), imgS: ({ gameKey }) => shinySprite(gameKey, 194), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 194), imgS: ({ gameKey }) => shinySprite(gameKey, 194), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0194-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0194-f"), },
			]
		},
		{
			id: 18, natiId: 195, name: "Quagsire", img: ({ gameKey }) => baseSprite(gameKey, 195), imgS: ({ gameKey }) => shinySprite(gameKey, 195), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 195), imgS: ({ gameKey }) => shinySprite(gameKey, 195), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0195-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0195-f"), },
			]
		},
		{ id: 19, natiId: 704, name: "Goomy", img: ({ gameKey }) => baseSprite(gameKey, 704), imgS: ({ gameKey }) => shinySprite(gameKey, 704), tags: ["pseudo"] },
		{ id: 20, natiId: 705, name: "Sliggoo", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), tags: ["pseudo"] },
		{ id: 21, natiId: 706, name: "Goodra", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), tags: ["pseudo"] },
		{ id: 22, natiId: 588, name: "Karrablast", img: ({ gameKey }) => baseSprite(gameKey, 588), imgS: ({ gameKey }) => shinySprite(gameKey, 588) },
		{ id: 23, natiId: 589, name: "Escavalier", img: ({ gameKey }) => baseSprite(gameKey, 589), imgS: ({ gameKey }) => shinySprite(gameKey, 589) },
		{ id: 24, natiId: 616, name: "Shelmet", img: ({ gameKey }) => baseSprite(gameKey, 616), imgS: ({ gameKey }) => shinySprite(gameKey, 616) },
		{ id: 25, natiId: 617, name: "Accelgor", img: ({ gameKey }) => baseSprite(gameKey, 617), imgS: ({ gameKey }) => shinySprite(gameKey, 617) },
		{ id: 26, natiId: 69, name: "Bellsprout", img: ({ gameKey }) => baseSprite(gameKey, 69), imgS: ({ gameKey }) => shinySprite(gameKey, 69) },
		{ id: 27, natiId: 70, name: "Weepinbell", img: ({ gameKey }) => baseSprite(gameKey, 70), imgS: ({ gameKey }) => shinySprite(gameKey, 70) },
		{ id: 28, natiId: 71, name: "Victreebel", img: ({ gameKey }) => baseSprite(gameKey, 71), imgS: ({ gameKey }) => shinySprite(gameKey, 71) },
		{ id: 29, natiId: 455, name: "Carnivine", img: ({ gameKey }) => baseSprite(gameKey, 455), imgS: ({ gameKey }) => shinySprite(gameKey, 455) },
		{ id: 30, natiId: 92, name: "Gastly", img: ({ gameKey }) => baseSprite(gameKey, 92), imgS: ({ gameKey }) => shinySprite(gameKey, 92) },
		{ id: 31, natiId: 93, name: "Haunter", img: ({ gameKey }) => baseSprite(gameKey, 93), imgS: ({ gameKey }) => shinySprite(gameKey, 93) },
		{ id: 32, natiId: 94, name: "Gengar", img: ({ gameKey }) => baseSprite(gameKey, 94), imgS: ({ gameKey }) => shinySprite(gameKey, 94), tags: ["mega"] },
		{ id: 33, natiId: 60, name: "Poliwag", img: ({ gameKey }) => baseSprite(gameKey, 60), imgS: ({ gameKey }) => shinySprite(gameKey, 60) },
		{ id: 34, natiId: 61, name: "Poliwhirl", img: ({ gameKey }) => baseSprite(gameKey, 61), imgS: ({ gameKey }) => shinySprite(gameKey, 61) },
		{ id: 35, natiId: 62, name: "Poliwrath", img: ({ gameKey }) => baseSprite(gameKey, 62), imgS: ({ gameKey }) => shinySprite(gameKey, 62) },
		{
			id: 36, natiId: 186, name: "Politoed", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0186-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0186-f"), },
			]
		},
		{ id: 37, natiId: 23, name: "Ekans", img: ({ gameKey }) => baseSprite(gameKey, 23), imgS: ({ gameKey }) => shinySprite(gameKey, 23) },
		{ id: 38, natiId: 24, name: "Arbok", img: ({ gameKey }) => baseSprite(gameKey, 24), imgS: ({ gameKey }) => shinySprite(gameKey, 24) },
		{ id: 39, natiId: 618, name: "Stunfisk", img: ({ gameKey }) => baseSprite(gameKey, 618), imgS: ({ gameKey }) => shinySprite(gameKey, 618) },
		{ id: 40, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339) },
		{ id: 41, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340) },
		{ id: 42, natiId: 509, name: "Purrloin", img: ({ gameKey }) => baseSprite(gameKey, 509), imgS: ({ gameKey }) => shinySprite(gameKey, 509) },
		{ id: 43, natiId: 510, name: "Liepard", img: ({ gameKey }) => baseSprite(gameKey, 510), imgS: ({ gameKey }) => shinySprite(gameKey, 510) },
		{ id: 44, natiId: 261, name: "Poochyena", img: ({ gameKey }) => baseSprite(gameKey, 261), imgS: ({ gameKey }) => shinySprite(gameKey, 261) },
		{ id: 45, natiId: 262, name: "Mightyena", img: ({ gameKey }) => baseSprite(gameKey, 262), imgS: ({ gameKey }) => shinySprite(gameKey, 262) },
		{ id: 46, natiId: 504, name: "Patrat", img: ({ gameKey }) => baseSprite(gameKey, 504), imgS: ({ gameKey }) => shinySprite(gameKey, 504) },
		{ id: 47, natiId: 505, name: "Watchog", img: ({ gameKey }) => baseSprite(gameKey, 505), imgS: ({ gameKey }) => shinySprite(gameKey, 505) },
		{ id: 48, natiId: 624, name: "Pawniard", img: ({ gameKey }) => baseSprite(gameKey, 624), imgS: ({ gameKey }) => shinySprite(gameKey, 624) },
		{ id: 49, natiId: 625, name: "Bisharp", img: ({ gameKey }) => baseSprite(gameKey, 625), imgS: ({ gameKey }) => shinySprite(gameKey, 625) },
		{ id: 50, natiId: 707, name: "Klefki", img: ({ gameKey }) => baseSprite(gameKey, 707), imgS: ({ gameKey }) => shinySprite(gameKey, 707) },
		{
			id: 51, natiId: 198, name: "Murkrow", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0198-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0198-f"), },
			]
		},
		{ id: 52, natiId: 430, name: "Honchkrow", img: ({ gameKey }) => baseSprite(gameKey, 430), imgS: ({ gameKey }) => shinySprite(gameKey, 430) },
		{ id: 53, natiId: 590, name: "Foongus", img: ({ gameKey }) => baseSprite(gameKey, 590), imgS: ({ gameKey }) => shinySprite(gameKey, 590) },
		{ id: 54, natiId: 591, name: "Amoonguss", img: ({ gameKey }) => baseSprite(gameKey, 591), imgS: ({ gameKey }) => shinySprite(gameKey, 591) },
		{ id: 55, natiId: 270, name: "Lotad", img: ({ gameKey }) => baseSprite(gameKey, 270), imgS: ({ gameKey }) => shinySprite(gameKey, 270) },
		{ id: 56, natiId: 271, name: "Lombre", img: ({ gameKey }) => baseSprite(gameKey, 271), imgS: ({ gameKey }) => shinySprite(gameKey, 271) },
		{
			id: 57, natiId: 272, name: "Ludicolo", img: ({ gameKey }) => baseSprite(gameKey, 272), imgS: ({ gameKey }) => shinySprite(gameKey, 272), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 272), imgS: ({ gameKey }) => shinySprite(gameKey, 272), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0272-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0272-f"), },
			]
		},
		{ id: 58, natiId: 418, name: "Buizel", img: ({ gameKey }) => baseSprite(gameKey, 418), imgS: ({ gameKey }) => shinySprite(gameKey, 418) },
		{ id: 59, natiId: 419, name: "Floatzel", img: ({ gameKey }) => baseSprite(gameKey, 419), imgS: ({ gameKey }) => shinySprite(gameKey, 419) },
		{
			id: 60, natiId: 550, name: "Basculin", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), tags: ["other"], forms: [
				{ name: "Blue-Striped", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), },
				{ name: "Red-Striped", img: ({ gameKey }) => baseSprite(gameKey, "0550-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0550-r"), },
			]
		},
		{ id: 61, natiId: 708, name: "Phantump", img: ({ gameKey }) => baseSprite(gameKey, 708), imgS: ({ gameKey }) => shinySprite(gameKey, 708) },
		{ id: 62, natiId: 709, name: "Trevenant", img: ({ gameKey }) => baseSprite(gameKey, 709), imgS: ({ gameKey }) => shinySprite(gameKey, 709) },
		{
			id: 63, natiId: 710, name: "Pumpkaboo", img: ({ gameKey }) => baseSprite(gameKey, 710), imgS: ({ gameKey }) => shinySprite(gameKey, 710), tags: ["other"], forms: [
				{ name: "Small Size", img: ({ gameKey }) => baseSprite(gameKey, "0710-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0710-s"), },
				{ name: "Average Size", img: ({ gameKey }) => baseSprite(gameKey, 710), imgS: ({ gameKey }) => shinySprite(gameKey, 710), },
				{ name: "Large Size", img: ({ gameKey }) => baseSprite(gameKey, "0710-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0710-l"), },
				{ name: "Super Size", img: ({ gameKey }) => baseSprite(gameKey, "0710-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0710-s"), },
			]
		},
		{
			id: 64, natiId: 711, name: "Gourgeist", img: ({ gameKey }) => baseSprite(gameKey, 711), imgS: ({ gameKey }) => shinySprite(gameKey, 711), tags: ["other"], forms: [
				{ name: "Small Size", img: ({ gameKey }) => baseSprite(gameKey, "0711-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0711-s"), },
				{ name: "Average Size", img: ({ gameKey }) => baseSprite(gameKey, 711), imgS: ({ gameKey }) => shinySprite(gameKey, 711), },
				{ name: "Large Size", img: ({ gameKey }) => baseSprite(gameKey, "0711-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0711-l"), },
				{ name: "Super Size", img: ({ gameKey }) => baseSprite(gameKey, "0711-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0711-s"), },
			]
		},
		{ id: 65, natiId: 607, name: "Litwick", img: ({ gameKey }) => baseSprite(gameKey, 607), imgS: ({ gameKey }) => shinySprite(gameKey, 607) },
		{ id: 66, natiId: 608, name: "Lampent", img: ({ gameKey }) => baseSprite(gameKey, 608), imgS: ({ gameKey }) => shinySprite(gameKey, 608) },
		{ id: 67, natiId: 609, name: "Chandelure", img: ({ gameKey }) => baseSprite(gameKey, 609), imgS: ({ gameKey }) => shinySprite(gameKey, 609) },
		{
			id: 68, natiId: 479, name: "Rotom", img: ({ gameKey }) => baseSprite(gameKey, 479), imgS: ({ gameKey }) => shinySprite(gameKey, 479), tags: ["other"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 479), imgS: ({ gameKey }) => shinySprite(gameKey, 479), },
				{ name: "Fan", img: ({ gameKey }) => baseSprite(gameKey, "0479-fa"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-fa"), },
				{ name: "Frost", img: ({ gameKey }) => baseSprite(gameKey, "0479-fr"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-fr"), },
				{ name: "Heat", img: ({ gameKey }) => baseSprite(gameKey, "0479-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-h"), },
				{ name: "Mow", img: ({ gameKey }) => baseSprite(gameKey, "0479-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-m"), },
				{ name: "Wash", img: ({ gameKey }) => baseSprite(gameKey, "0479-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-w"), },
			]
		},
		{ id: 69, natiId: 81, name: "Magnemite", img: ({ gameKey }) => baseSprite(gameKey, 81), imgS: ({ gameKey }) => shinySprite(gameKey, 81) },
		{ id: 70, natiId: 82, name: "Magneton", img: ({ gameKey }) => baseSprite(gameKey, 82), imgS: ({ gameKey }) => shinySprite(gameKey, 82) },
		{ id: 71, natiId: 462, name: "Magnezone", img: ({ gameKey }) => baseSprite(gameKey, 462), imgS: ({ gameKey }) => shinySprite(gameKey, 462) },
		{ id: 72, natiId: 100, name: "Voltorb", img: ({ gameKey }) => baseSprite(gameKey, 100), imgS: ({ gameKey }) => shinySprite(gameKey, 100) },
		{ id: 73, natiId: 101, name: "Electrode", img: ({ gameKey }) => baseSprite(gameKey, 101), imgS: ({ gameKey }) => shinySprite(gameKey, 101) },
		{ id: 74, natiId: 568, name: "Trubbish", img: ({ gameKey }) => baseSprite(gameKey, 568), imgS: ({ gameKey }) => shinySprite(gameKey, 568) },
		{ id: 75, natiId: 569, name: "Garbodor", img: ({ gameKey }) => baseSprite(gameKey, 569), imgS: ({ gameKey }) => shinySprite(gameKey, 569) },
		{ id: 76, natiId: 220, name: "Swinub", img: ({ gameKey }) => baseSprite(gameKey, 220), imgS: ({ gameKey }) => shinySprite(gameKey, 220) },
		{
			id: 77, natiId: 221, name: "Piloswine", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0221-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0221-f"), },
			]
		},
		{
			id: 78, natiId: 473, name: "Mamoswine", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0473-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0473-f"), },
			]
		},
		{ id: 79, natiId: 712, name: "Bergmite", img: ({ gameKey }) => baseSprite(gameKey, 712), imgS: ({ gameKey }) => shinySprite(gameKey, 712) },
		{ id: 80, natiId: 713, name: "Avalugg", img: ({ gameKey }) => baseSprite(gameKey, 713), imgS: ({ gameKey }) => shinySprite(gameKey, 713) },
		{ id: 81, natiId: 613, name: "Cubchoo", img: ({ gameKey }) => baseSprite(gameKey, 613), imgS: ({ gameKey }) => shinySprite(gameKey, 613) },
		{ id: 82, natiId: 614, name: "Beartic", img: ({ gameKey }) => baseSprite(gameKey, 614), imgS: ({ gameKey }) => shinySprite(gameKey, 614) },
		{ id: 83, natiId: 238, name: "Smoochum", img: ({ gameKey }) => baseSprite(gameKey, 238), imgS: ({ gameKey }) => shinySprite(gameKey, 238) },
		{ id: 84, natiId: 124, name: "Jynx", img: ({ gameKey }) => baseSprite(gameKey, 124), imgS: ({ gameKey }) => shinySprite(gameKey, 124) },
		{ id: 85, natiId: 582, name: "Vanillite", img: ({ gameKey }) => baseSprite(gameKey, 582), imgS: ({ gameKey }) => shinySprite(gameKey, 582) },
		{ id: 86, natiId: 583, name: "Vanillish", img: ({ gameKey }) => baseSprite(gameKey, 583), imgS: ({ gameKey }) => shinySprite(gameKey, 583) },
		{ id: 87, natiId: 584, name: "Vanilluxe", img: ({ gameKey }) => baseSprite(gameKey, 584), imgS: ({ gameKey }) => shinySprite(gameKey, 584) },
		{
			id: 88, natiId: 459, name: "Snover", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0459-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0459-f"), },
			]
		},
		{
			id: 89, natiId: 460, name: "Abomasnow", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0460-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0460-f"), },]
		},
		{ id: 90, natiId: 225, name: "Delibird", img: ({ gameKey }) => baseSprite(gameKey, 225), imgS: ({ gameKey }) => shinySprite(gameKey, 225) },
		{
			id: 91, natiId: 215, name: "Sneasel", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-f"), },
			]
		},
		{
			id: 92, natiId: 461, name: "Weavile", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0461-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0461-f"), },
			]
		},
		{ id: 93, natiId: 532, name: "Timburr", img: ({ gameKey }) => baseSprite(gameKey, 532), imgS: ({ gameKey }) => shinySprite(gameKey, 532) },
		{ id: 94, natiId: 533, name: "Gurdurr", img: ({ gameKey }) => baseSprite(gameKey, 533), imgS: ({ gameKey }) => shinySprite(gameKey, 533) },
		{ id: 95, natiId: 534, name: "Conkeldurr", img: ({ gameKey }) => baseSprite(gameKey, 534), imgS: ({ gameKey }) => shinySprite(gameKey, 534) },
		{ id: 96, natiId: 324, name: "Torkoal", img: ({ gameKey }) => baseSprite(gameKey, 324), imgS: ({ gameKey }) => shinySprite(gameKey, 324) },
		{ id: 97, natiId: 27, name: "Sandshrew", img: ({ gameKey }) => baseSprite(gameKey, 27), imgS: ({ gameKey }) => shinySprite(gameKey, 27) },
		{ id: 98, natiId: 28, name: "Sandslash", img: ({ gameKey }) => baseSprite(gameKey, 28), imgS: ({ gameKey }) => shinySprite(gameKey, 28) },
		{ id: 99, natiId: 304, name: "Aron", img: ({ gameKey }) => baseSprite(gameKey, 304), imgS: ({ gameKey }) => shinySprite(gameKey, 304) },
		{ id: 100, natiId: 305, name: "Lairon", img: ({ gameKey }) => baseSprite(gameKey, 305), imgS: ({ gameKey }) => shinySprite(gameKey, 305) },
		{ id: 101, natiId: 306, name: "Aggron", img: ({ gameKey }) => baseSprite(gameKey, 306), imgS: ({ gameKey }) => shinySprite(gameKey, 306), tags: ["mega"] },
		{ id: 102, natiId: 246, name: "Larvitar", img: ({ gameKey }) => baseSprite(gameKey, 246), imgS: ({ gameKey }) => shinySprite(gameKey, 246), tags: ["pseudo"] },
		{ id: 103, natiId: 247, name: "Pupitar", img: ({ gameKey }) => baseSprite(gameKey, 247), imgS: ({ gameKey }) => shinySprite(gameKey, 247), tags: ["pseudo"] },
		{ id: 104, natiId: 248, name: "Tyranitar", img: ({ gameKey }) => baseSprite(gameKey, 248), imgS: ({ gameKey }) => shinySprite(gameKey, 248), tags: ["pseudo", "mega"] },
		{ id: 105, natiId: 631, name: "Heatmor", img: ({ gameKey }) => baseSprite(gameKey, 631), imgS: ({ gameKey }) => shinySprite(gameKey, 631) },
		{ id: 106, natiId: 632, name: "Durant", img: ({ gameKey }) => baseSprite(gameKey, 632), imgS: ({ gameKey }) => shinySprite(gameKey, 632) },
		{ id: 107, natiId: 167, name: "Spinarak", img: ({ gameKey }) => baseSprite(gameKey, 167), imgS: ({ gameKey }) => shinySprite(gameKey, 167) },
		{ id: 108, natiId: 168, name: "Ariados", img: ({ gameKey }) => baseSprite(gameKey, 168), imgS: ({ gameKey }) => shinySprite(gameKey, 168) },
		{ id: 109, natiId: 21, name: "Spearow", img: ({ gameKey }) => baseSprite(gameKey, 21), imgS: ({ gameKey }) => shinySprite(gameKey, 21) },
		{ id: 110, natiId: 22, name: "Fearow", img: ({ gameKey }) => baseSprite(gameKey, 22), imgS: ({ gameKey }) => shinySprite(gameKey, 22) },
		{ id: 111, natiId: 615, name: "Cryogonal", img: ({ gameKey }) => baseSprite(gameKey, 615), imgS: ({ gameKey }) => shinySprite(gameKey, 615) },
		{ id: 112, natiId: 227, name: "Skarmory", img: ({ gameKey }) => baseSprite(gameKey, 227), imgS: ({ gameKey }) => shinySprite(gameKey, 227) },
		{ id: 113, natiId: 714, name: "Noibat", img: ({ gameKey }) => baseSprite(gameKey, 714), imgS: ({ gameKey }) => shinySprite(gameKey, 714) },
		{ id: 114, natiId: 715, name: "Noivern", img: ({ gameKey }) => baseSprite(gameKey, 715), imgS: ({ gameKey }) => shinySprite(gameKey, 715) },
		{
			id: 115, natiId: 207, name: "Gligar", img: ({ gameKey }) => baseSprite(gameKey, 207), imgS: ({ gameKey }) => shinySprite(gameKey, 207), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 207), imgS: ({ gameKey }) => shinySprite(gameKey, 207), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0207-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0207-f"), },
			]
		},
		{ id: 116, natiId: 472, name: "Gliscor", img: ({ gameKey }) => baseSprite(gameKey, 472), imgS: ({ gameKey }) => shinySprite(gameKey, 472) },
		{ id: 117, natiId: 163, name: "Hoothoot", img: ({ gameKey }) => baseSprite(gameKey, 163), imgS: ({ gameKey }) => shinySprite(gameKey, 163) },
		{ id: 118, natiId: 164, name: "Noctowl", img: ({ gameKey }) => baseSprite(gameKey, 164), imgS: ({ gameKey }) => shinySprite(gameKey, 164) },
		{ id: 119, natiId: 174, name: "Igglybuff", img: ({ gameKey }) => baseSprite(gameKey, 174), imgS: ({ gameKey }) => shinySprite(gameKey, 174) },
		{ id: 120, natiId: 39, name: "Jigglypuff", img: ({ gameKey }) => baseSprite(gameKey, 39), imgS: ({ gameKey }) => shinySprite(gameKey, 39) },
		{ id: 121, natiId: 40, name: "Wigglytuff", img: ({ gameKey }) => baseSprite(gameKey, 40), imgS: ({ gameKey }) => shinySprite(gameKey, 40) },
		{ id: 122, natiId: 353, name: "Shuppet", img: ({ gameKey }) => baseSprite(gameKey, 353), imgS: ({ gameKey }) => shinySprite(gameKey, 353) },
		{ id: 123, natiId: 354, name: "Banette", img: ({ gameKey }) => baseSprite(gameKey, 354), imgS: ({ gameKey }) => shinySprite(gameKey, 354), tags: ["mega"] },
		{ id: 124, natiId: 570, name: "Zorua", img: ({ gameKey }) => baseSprite(gameKey, 570), imgS: ({ gameKey }) => shinySprite(gameKey, 570) },
		{ id: 125, natiId: 571, name: "Zoroark", img: ({ gameKey }) => baseSprite(gameKey, 571), imgS: ({ gameKey }) => shinySprite(gameKey, 571) },
		{ id: 126, natiId: 574, name: "Gothita", img: ({ gameKey }) => baseSprite(gameKey, 574), imgS: ({ gameKey }) => shinySprite(gameKey, 574) },
		{ id: 127, natiId: 575, name: "Gothorita", img: ({ gameKey }) => baseSprite(gameKey, 575), imgS: ({ gameKey }) => shinySprite(gameKey, 575) },
		{ id: 128, natiId: 576, name: "Gothitelle", img: ({ gameKey }) => baseSprite(gameKey, 576), imgS: ({ gameKey }) => shinySprite(gameKey, 576) },
		{ id: 129, natiId: 438, name: "Bonsly", img: ({ gameKey }) => baseSprite(gameKey, 438), imgS: ({ gameKey }) => shinySprite(gameKey, 438) },
		{
			id: 130, natiId: 185, name: "Sudowoodo", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0185-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0185-f"), },
			]
		},
		{ id: 131, natiId: 327, name: "Spinda", img: ({ gameKey }) => baseSprite(gameKey, 327), imgS: ({ gameKey }) => shinySprite(gameKey, 327) },
		{ id: 132, natiId: 216, name: "Teddiursa", img: ({ gameKey }) => baseSprite(gameKey, 216), imgS: ({ gameKey }) => shinySprite(gameKey, 216) },
		{
			id: 133, natiId: 217, name: "Ursaring", img: ({ gameKey }) => baseSprite(gameKey, 217), imgS: ({ gameKey }) => shinySprite(gameKey, 217), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 217), imgS: ({ gameKey }) => shinySprite(gameKey, 217), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0217-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0217-f"), },
			]
		},
		{ id: 134, natiId: 108, name: "Lickitung", img: ({ gameKey }) => baseSprite(gameKey, 108), imgS: ({ gameKey }) => shinySprite(gameKey, 108) },
		{ id: 135, natiId: 463, name: "Lickilicky", img: ({ gameKey }) => baseSprite(gameKey, 463), imgS: ({ gameKey }) => shinySprite(gameKey, 463) },
		{
			id: 136, natiId: 123, name: "Scyther", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0123-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0123-f"), },]
		},
		{
			id: 137, natiId: 212, name: "Scizor", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0212-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0212-f"), },]
		},
		{ id: 138, natiId: 132, name: "Ditto", img: ({ gameKey }) => baseSprite(gameKey, 132), imgS: ({ gameKey }) => shinySprite(gameKey, 132) },
		{ id: 139, natiId: 333, name: "Swablu", img: ({ gameKey }) => baseSprite(gameKey, 333), imgS: ({ gameKey }) => shinySprite(gameKey, 333) },
		{ id: 140, natiId: 334, name: "Altaria", img: ({ gameKey }) => baseSprite(gameKey, 334), imgS: ({ gameKey }) => shinySprite(gameKey, 334) },
		{ id: 141, natiId: 621, name: "Druddigon", img: ({ gameKey }) => baseSprite(gameKey, 621), imgS: ({ gameKey }) => shinySprite(gameKey, 621) },
		{ id: 142, natiId: 633, name: "Deino", img: ({ gameKey }) => baseSprite(gameKey, 633), imgS: ({ gameKey }) => shinySprite(gameKey, 633), tags: ["pseudo"] },
		{ id: 143, natiId: 634, name: "Zweilous", img: ({ gameKey }) => baseSprite(gameKey, 634), imgS: ({ gameKey }) => shinySprite(gameKey, 634), tags: ["pseudo"] },
		{ id: 144, natiId: 635, name: "Hydreigon", img: ({ gameKey }) => baseSprite(gameKey, 635), imgS: ({ gameKey }) => shinySprite(gameKey, 635), tags: ["pseudo"] },
		{ id: 145, natiId: 147, name: "Dratini", img: ({ gameKey }) => baseSprite(gameKey, 147), imgS: ({ gameKey }) => shinySprite(gameKey, 147), tags: ["pseudo"] },
		{ id: 146, natiId: 148, name: "Dragonair", img: ({ gameKey }) => baseSprite(gameKey, 148), imgS: ({ gameKey }) => shinySprite(gameKey, 148), tags: ["pseudo"] },
		{ id: 147, natiId: 149, name: "Dragonite", img: ({ gameKey }) => baseSprite(gameKey, 149), imgS: ({ gameKey }) => shinySprite(gameKey, 149), tags: ["pseudo"] },
		{ id: 148, natiId: 716, name: "Xerneas", img: ({ gameKey }) => baseSprite(gameKey, 716), imgS: ({ gameKey }) => shinySprite(gameKey, 716), tags: ["legendary"] },
		{ id: 149, natiId: 717, name: "Yveltal", img: ({ gameKey }) => baseSprite(gameKey, 717), imgS: ({ gameKey }) => shinySprite(gameKey, 717), tags: ["legendary"] },
		{ id: 150, natiId: 718, name: "Zygarde", img: ({ gameKey }) => baseSprite(gameKey, 718), imgS: ({ gameKey }) => shinySprite(gameKey, 718), maxStatus: "caught", tags: ["legendary"] },
		{ id: 151, natiId: 150, name: "Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150), imgS: ({ gameKey }) => shinySprite(gameKey, 150), tags: ["mega", "legendary"] }
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();