import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 9;
	const GAME_KEYS = ["scarlettm", "violettm"];
	const DEX_NAME = "Kitakami Dex";

	const baseSprite = (gameKey, natiId) => dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 167, name: "Spinarak", img: ({ gameKey }) => baseSprite(gameKey, 167), imgS: ({ gameKey }) => shinySprite(gameKey, 167), },
		{ id: 2, natiId: 168, name: "Ariados", img: ({ gameKey }) => baseSprite(gameKey, 168), imgS: ({ gameKey }) => shinySprite(gameKey, 168), },
		{ id: 3, natiId: 193, name: "Yanma", img: ({ gameKey }) => baseSprite(gameKey, 193), imgS: ({ gameKey }) => shinySprite(gameKey, 193), },
		{ id: 4, natiId: 469, name: "Yanmega", img: ({ gameKey }) => baseSprite(gameKey, 469), imgS: ({ gameKey }) => shinySprite(gameKey, 469), },
		{
			id: 5, natiId: 194, name: "Wooper", img: ({ gameKey }) => baseSprite(gameKey, "0194-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0194-p"), tags: ["gender"], forms: [
				{ name: "Johtonian Male", img: ({ gameKey }) => baseSprite(gameKey, 194), imgS: ({ gameKey }) => shinySprite(gameKey, 194), },
				{ name: "Johtonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0194-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0194-f"), },
				{ name: "Paldean", img: ({ gameKey }) => baseSprite(gameKey, "0194-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0194-p"), }
			],
		},
		{
			id: 6, natiId: 195, name: "Quagsire", img: ({ gameKey }) => baseSprite(gameKey, 195), imgS: ({ gameKey }) => shinySprite(gameKey, 195), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 195), imgS: ({ gameKey }) => shinySprite(gameKey, 195) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0195-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0195-f") },
			],
		},
		{ id: 7, natiId: 261, name: "Poochyena", img: ({ gameKey }) => baseSprite(gameKey, 261), imgS: ({ gameKey }) => shinySprite(gameKey, 261), },
		{ id: 8, natiId: 262, name: "Mightyena", img: ({ gameKey }) => baseSprite(gameKey, 262), imgS: ({ gameKey }) => shinySprite(gameKey, 262), },
		{ id: 9, natiId: 313, name: "Volbeat", img: ({ gameKey }) => baseSprite(gameKey, 313), imgS: ({ gameKey }) => shinySprite(gameKey, 313), },
		{ id: 10, natiId: 314, name: "Illumise", img: ({ gameKey }) => baseSprite(gameKey, 314), imgS: ({ gameKey }) => shinySprite(gameKey, 314), },
		{ id: 11, natiId: 341, name: "Corphish", img: ({ gameKey }) => baseSprite(gameKey, 341), imgS: ({ gameKey }) => shinySprite(gameKey, 341), },
		{ id: 12, natiId: 342, name: "Crawdaunt", img: ({ gameKey }) => baseSprite(gameKey, 342), imgS: ({ gameKey }) => shinySprite(gameKey, 342), },
		{ id: 13, natiId: 540, name: "Sewaddle", img: ({ gameKey }) => baseSprite(gameKey, 540), imgS: ({ gameKey }) => shinySprite(gameKey, 540), },
		{ id: 14, natiId: 541, name: "Swadloon", img: ({ gameKey }) => baseSprite(gameKey, 541), imgS: ({ gameKey }) => shinySprite(gameKey, 541), },
		{ id: 15, natiId: 542, name: "Leavanny", img: ({ gameKey }) => baseSprite(gameKey, 542), imgS: ({ gameKey }) => shinySprite(gameKey, 542), },
		{ id: 16, natiId: 742, name: "Cutiefly", img: ({ gameKey }) => baseSprite(gameKey, 742), imgS: ({ gameKey }) => shinySprite(gameKey, 742), },
		{ id: 17, natiId: 743, name: "Ribombee", img: ({ gameKey }) => baseSprite(gameKey, 743), imgS: ({ gameKey }) => shinySprite(gameKey, 743), },
		{ id: 18, natiId: 23, name: "Ekans", img: ({ gameKey }) => baseSprite(gameKey, 23), imgS: ({ gameKey }) => shinySprite(gameKey, 23), },
		{ id: 19, natiId: 24, name: "Arbok", img: ({ gameKey }) => baseSprite(gameKey, 24), imgS: ({ gameKey }) => shinySprite(gameKey, 24), },
		{ id: 20, natiId: 172, name: "Pichu", img: ({ gameKey }) => baseSprite(gameKey, 172), imgS: ({ gameKey }) => shinySprite(gameKey, 172), },
		{
			id: 21, natiId: 25, name: "Pikachu", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0025-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-f"), },
				{ name: "Alola Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-a"), tags: ["mythical"], },
				{ name: "Hoenn Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-h"), tags: ["mythical"], },
				{ name: "Kalos Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-k"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-k"), tags: ["mythical"], },
				{ name: "Original Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-o"), tags: ["mythical"], },
				{ name: "Partner Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-p"), tags: ["mythical"], },
				{ name: "Sinnoh Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-s"), tags: ["mythical"], },
				{ name: "Unova Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-u"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-u"), tags: ["mythical"], },
				{ name: "World Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-w"), tags: ["mythical"], }
			],
		},
		{
			id: 22, natiId: 26, name: "Raichu", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), tags: ["gender"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0026-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0026-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-a"), tags: ["alolan"], }
			],
		},
		{ id: 23, natiId: 69, name: "Bellsprout", img: ({ gameKey }) => baseSprite(gameKey, 69), imgS: ({ gameKey }) => shinySprite(gameKey, 69), },
		{ id: 24, natiId: 70, name: "Weepinbell", img: ({ gameKey }) => baseSprite(gameKey, 70), imgS: ({ gameKey }) => shinySprite(gameKey, 70), },
		{ id: 25, natiId: 71, name: "Victreebel", img: ({ gameKey }) => baseSprite(gameKey, 71), imgS: ({ gameKey }) => shinySprite(gameKey, 71), },
		{ id: 26, natiId: 161, name: "Sentret", img: ({ gameKey }) => baseSprite(gameKey, 161), imgS: ({ gameKey }) => shinySprite(gameKey, 161), },
		{ id: 27, natiId: 162, name: "Furret", img: ({ gameKey }) => baseSprite(gameKey, 162), imgS: ({ gameKey }) => shinySprite(gameKey, 162), },
		{
			id: 28, natiId: 396, name: "Starly", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0396-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0396-f"), }
			],
		},
		{
			id: 29, natiId: 397, name: "Staravia", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0397-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0397-f"), }
			],
		},
		{
			id: 30, natiId: 398, name: "Staraptor", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0398-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0398-f"), }
			],
		},
		{ id: 31, natiId: 753, name: "Fomantis", img: ({ gameKey }) => baseSprite(gameKey, 753), imgS: ({ gameKey }) => shinySprite(gameKey, 753), },
		{ id: 32, natiId: 754, name: "Lurantis", img: ({ gameKey }) => baseSprite(gameKey, 754), imgS: ({ gameKey }) => shinySprite(gameKey, 754), },
		{ id: 33, natiId: 840, name: "Applin", img: ({ gameKey }) => baseSprite(gameKey, 840), imgS: ({ gameKey }) => shinySprite(gameKey, 840), },
		{ id: 34, natiId: 841, name: "Flapple", img: ({ gameKey }) => baseSprite(gameKey, 841), imgS: ({ gameKey }) => shinySprite(gameKey, 841), },
		{ id: 35, natiId: 842, name: "Appletun", img: ({ gameKey }) => baseSprite(gameKey, 842), imgS: ({ gameKey }) => shinySprite(gameKey, 842), },
		{ id: 36, natiId: 1011, name: "Dipplin", img: ({ gameKey }) => baseSprite(gameKey, 1011), imgS: ({ gameKey }) => shinySprite(gameKey, 1011), },
		{
			id: 37, natiId: 37, name: "Vulpix", img: ({ gameKey }) => baseSprite(gameKey, 37), imgS: ({ gameKey }) => shinySprite(gameKey, 37), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 37), imgS: ({ gameKey }) => shinySprite(gameKey, 37), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0037-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0037-a"), tags: ["alolan"], }
			],
		},
		{
			id: 38, natiId: 38, name: "Ninetales", img: ({ gameKey }) => baseSprite(gameKey, 38), imgS: ({ gameKey }) => shinySprite(gameKey, 38), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 38), imgS: ({ gameKey }) => shinySprite(gameKey, 38), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0038-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0038-a"), tags: ["alolan"], }
			],
		},
		{ id: 39, natiId: 60, name: "Poliwag", img: ({ gameKey }) => baseSprite(gameKey, 60), imgS: ({ gameKey }) => shinySprite(gameKey, 60), },
		{ id: 40, natiId: 61, name: "Poliwhirl", img: ({ gameKey }) => baseSprite(gameKey, 61), imgS: ({ gameKey }) => shinySprite(gameKey, 61), },
		{ id: 41, natiId: 62, name: "Poliwrath", img: ({ gameKey }) => baseSprite(gameKey, 62), imgS: ({ gameKey }) => shinySprite(gameKey, 62), },
		{
			id: 42, natiId: 186, name: "Politoed", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0186-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0186-f") },
			],
		},
		{
			id: 43, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), }
			],
		},
		{
			id: 44, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },],
		},
		{ id: 45, natiId: 163, name: "Hoothoot", img: ({ gameKey }) => baseSprite(gameKey, 163), imgS: ({ gameKey }) => shinySprite(gameKey, 163), },
		{ id: 46, natiId: 164, name: "Noctowl", img: ({ gameKey }) => baseSprite(gameKey, 164), imgS: ({ gameKey }) => shinySprite(gameKey, 164), },
		{
			id: 47, natiId: 190, name: "Aipom", img: ({ gameKey }) => baseSprite(gameKey, 190), imgS: ({ gameKey }) => shinySprite(gameKey, 190), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 190), imgS: ({ gameKey }) => shinySprite(gameKey, 190) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0190-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0190-f") },
			],
		},
		{
			id: 48, natiId: 424, name: "Ambipom", img: ({ gameKey }) => baseSprite(gameKey, 424), imgS: ({ gameKey }) => shinySprite(gameKey, 424), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 424), imgS: ({ gameKey }) => shinySprite(gameKey, 424) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0424-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0424-f") },
			],
		},
		{
			id: 49, natiId: 214, name: "Heracross", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0214-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0214-f"), },],
		},
		{ id: 50, natiId: 220, name: "Swinub", img: ({ gameKey }) => baseSprite(gameKey, 220), imgS: ({ gameKey }) => shinySprite(gameKey, 220), },
		{
			id: 51, natiId: 221, name: "Piloswine", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0221-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0221-f") },
			],
		},
		{
			id: 52, natiId: 473, name: "Mamoswine", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0473-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0473-f") },
			],
		},
		{ id: 53, natiId: 234, name: "Stantler", img: ({ gameKey }) => baseSprite(gameKey, 234), imgS: ({ gameKey }) => shinySprite(gameKey, 234), },
		{ id: 54, natiId: 273, name: "Seedot", img: ({ gameKey }) => baseSprite(gameKey, 273), imgS: ({ gameKey }) => shinySprite(gameKey, 273), },
		{
			id: 55, natiId: 274, name: "Nuzleaf", img: ({ gameKey }) => baseSprite(gameKey, 274), imgS: ({ gameKey }) => shinySprite(gameKey, 274), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 274), imgS: ({ gameKey }) => shinySprite(gameKey, 274) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0274-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0274-f") },
			],
		},
		{
			id: 56, natiId: 275, name: "Shiftry", img: ({ gameKey }) => baseSprite(gameKey, 275), imgS: ({ gameKey }) => shinySprite(gameKey, 275), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 275), imgS: ({ gameKey }) => shinySprite(gameKey, 275) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0275-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0275-f") },
			],
		},
		{ id: 57, natiId: 280, name: "Ralts", img: ({ gameKey }) => baseSprite(gameKey, 280), imgS: ({ gameKey }) => shinySprite(gameKey, 280), },
		{ id: 58, natiId: 281, name: "Kirlia", img: ({ gameKey }) => baseSprite(gameKey, 281), imgS: ({ gameKey }) => shinySprite(gameKey, 281), },
		{ id: 59, natiId: 282, name: "Gardevoir", img: ({ gameKey }) => baseSprite(gameKey, 282), imgS: ({ gameKey }) => shinySprite(gameKey, 282), },
		{ id: 60, natiId: 475, name: "Gallade", img: ({ gameKey }) => baseSprite(gameKey, 475), imgS: ({ gameKey }) => shinySprite(gameKey, 475), },
		{
			id: 61, natiId: 401, name: "Kricketot", img: ({ gameKey }) => baseSprite(gameKey, 401), imgS: ({ gameKey }) => shinySprite(gameKey, 401), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 401), imgS: ({ gameKey }) => shinySprite(gameKey, 401), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0401-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0401-f"), }
			],
		},
		{
			id: 62, natiId: 402, name: "Kricketune", img: ({ gameKey }) => baseSprite(gameKey, 402), imgS: ({ gameKey }) => shinySprite(gameKey, 402), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 402), imgS: ({ gameKey }) => shinySprite(gameKey, 402), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0402-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0402-f"), }
			],
		},
		{
			id: 63, natiId: 417, name: "Pachirisu", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0417-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0417-f"), }
			],
		},
		{ id: 64, natiId: 447, name: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447), imgS: ({ gameKey }) => shinySprite(gameKey, 447), },
		{ id: 65, natiId: 448, name: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), imgS: ({ gameKey }) => shinySprite(gameKey, 448), },
		{ id: 66, natiId: 548, name: "Petilil", img: ({ gameKey }) => baseSprite(gameKey, 548), imgS: ({ gameKey }) => shinySprite(gameKey, 548), },
		{
			id: 67, natiId: 549, name: "Lilligant", img: ({ gameKey }) => baseSprite(gameKey, 549), imgS: ({ gameKey }) => shinySprite(gameKey, 549), forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 549), imgS: ({ gameKey }) => shinySprite(gameKey, 549), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0549-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0549-h"), tags: ["hisuian"], }
			],
		},
		{ id: 68, natiId: 708, name: "Phantump", img: ({ gameKey }) => baseSprite(gameKey, 708), imgS: ({ gameKey }) => shinySprite(gameKey, 708), },
		{ id: 69, natiId: 709, name: "Trevenant", img: ({ gameKey }) => baseSprite(gameKey, 709), imgS: ({ gameKey }) => shinySprite(gameKey, 709), },
		{ id: 70, natiId: 744, name: "Rockruff", img: ({ gameKey }) => baseSprite(gameKey, 744), imgS: ({ gameKey }) => shinySprite(gameKey, 744), },
		{
			id: 71, natiId: 745, name: "Lycanroc", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), tags: ["other"], forms: [
				{ name: "Midday", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), },
				{ name: "Midnight", img: ({ gameKey }) => baseSprite(gameKey, "0745-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-m"), },
				{ name: "Dusk", img: ({ gameKey }) => baseSprite(gameKey, "0745-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-d"), },],
		},
		{ id: 72, natiId: 819, name: "Skwovet", img: ({ gameKey }) => baseSprite(gameKey, 819), imgS: ({ gameKey }) => shinySprite(gameKey, 819), },
		{ id: 73, natiId: 820, name: "Greedent", img: ({ gameKey }) => baseSprite(gameKey, 820), imgS: ({ gameKey }) => shinySprite(gameKey, 820), },
		{ id: 74, natiId: 948, name: "Toedscool", img: ({ gameKey }) => baseSprite(gameKey, 948), imgS: ({ gameKey }) => shinySprite(gameKey, 948), },
		{ id: 75, natiId: 949, name: "Toedscruel", img: ({ gameKey }) => baseSprite(gameKey, 949), imgS: ({ gameKey }) => shinySprite(gameKey, 949), },
		{
			id: 76, natiId: 1012, name: "Poltchageist", img: ({ gameKey }) => baseSprite(gameKey, 1012), imgS: ({ gameKey }) => shinySprite(gameKey, 1012), tags: ["other"], forms: [
				{ name: "Unremarkable", img: ({ gameKey }) => baseSprite(gameKey, 1012), imgS: ({ gameKey }) => shinySprite(gameKey, 1012), },
				{ name: "Masterpiece", img: ({ gameKey }) => baseSprite(gameKey, "01012-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "01012-m"), },]
		},
		{
			id: 77, natiId: 1013, name: "Sinistcha", img: ({ gameKey }) => baseSprite(gameKey, 1013), imgS: ({ gameKey }) => shinySprite(gameKey, 1013), tags: ["other"], forms: [
				{ name: "Unremarkable", img: ({ gameKey }) => baseSprite(gameKey, 1013), imgS: ({ gameKey }) => shinySprite(gameKey, 1013), },
				{ name: "Masterpiece", img: ({ gameKey }) => baseSprite(gameKey, "01013-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "01013-m"), },]
		},
		{
			id: 78, natiId: 58, name: "Growlithe", img: ({ gameKey }) => baseSprite(gameKey, 58), imgS: ({ gameKey }) => shinySprite(gameKey, 58), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 58), imgS: ({ gameKey }) => shinySprite(gameKey, 58), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0058-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0058-h"), tags: ["hisuian"], }
			],
		},
		{
			id: 79, natiId: 59, name: "Arcanine", img: ({ gameKey }) => baseSprite(gameKey, 59), imgS: ({ gameKey }) => shinySprite(gameKey, 59), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 59), imgS: ({ gameKey }) => shinySprite(gameKey, 59), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0059-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0059-h"), tags: ["hisuian"], }
			],
		},
		{
			id: 80, natiId: 74, name: "Geodude", img: ({ gameKey }) => baseSprite(gameKey, 74), imgS: ({ gameKey }) => shinySprite(gameKey, 74), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 74), imgS: ({ gameKey }) => shinySprite(gameKey, 74), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0074-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0074-a"), tags: ["alolan"], }
			],
		},
		{
			id: 81, natiId: 75, name: "Graveler", img: ({ gameKey }) => baseSprite(gameKey, 75), imgS: ({ gameKey }) => shinySprite(gameKey, 75), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 75), imgS: ({ gameKey }) => shinySprite(gameKey, 75), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0075-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0075-a"), tags: ["alolan"], }
			],
		},
		{
			id: 82, natiId: 76, name: "Golem", img: ({ gameKey }) => baseSprite(gameKey, 76), imgS: ({ gameKey }) => shinySprite(gameKey, 76), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 76), imgS: ({ gameKey }) => shinySprite(gameKey, 76), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0076-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0076-a"), tags: ["alolan"], }
			],
		},
		{ id: 83, natiId: 438, name: "Bonsly", img: ({ gameKey }) => baseSprite(gameKey, 438), imgS: ({ gameKey }) => shinySprite(gameKey, 438), },
		{
			id: 84, natiId: 185, name: "Sudowoodo", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0185-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0185-f"), }
			],
		},
		{ id: 85, natiId: 532, name: "Timburr", img: ({ gameKey }) => baseSprite(gameKey, 532), imgS: ({ gameKey }) => shinySprite(gameKey, 532), },
		{ id: 86, natiId: 533, name: "Gurdurr", img: ({ gameKey }) => baseSprite(gameKey, 533), imgS: ({ gameKey }) => shinySprite(gameKey, 533), },
		{ id: 87, natiId: 534, name: "Conkeldurr", img: ({ gameKey }) => baseSprite(gameKey, 534), imgS: ({ gameKey }) => shinySprite(gameKey, 534), },
		{ id: 88, natiId: 714, name: "Noibat", img: ({ gameKey }) => baseSprite(gameKey, 714), imgS: ({ gameKey }) => shinySprite(gameKey, 714), },
		{ id: 89, natiId: 715, name: "Noivern", img: ({ gameKey }) => baseSprite(gameKey, 715), imgS: ({ gameKey }) => shinySprite(gameKey, 715), },
		{ id: 90, natiId: 846, name: "Arrokuda", img: ({ gameKey }) => baseSprite(gameKey, 846), imgS: ({ gameKey }) => shinySprite(gameKey, 846), },
		{ id: 91, natiId: 847, name: "Barraskewda", img: ({ gameKey }) => baseSprite(gameKey, 847), imgS: ({ gameKey }) => shinySprite(gameKey, 847), },
		{ id: 92, natiId: 856, name: "Hatenna", img: ({ gameKey }) => baseSprite(gameKey, 856), imgS: ({ gameKey }) => shinySprite(gameKey, 856), },
		{ id: 93, natiId: 857, name: "Hattrem", img: ({ gameKey }) => baseSprite(gameKey, 857), imgS: ({ gameKey }) => shinySprite(gameKey, 857), },
		{ id: 94, natiId: 858, name: "Hatterene", img: ({ gameKey }) => baseSprite(gameKey, 858), imgS: ({ gameKey }) => shinySprite(gameKey, 858), },
		{ id: 95, natiId: 877, name: "Morpeko", img: ({ gameKey }) => baseSprite(gameKey, 877), imgS: ({ gameKey }) => shinySprite(gameKey, 877), },
		{ id: 96, natiId: 968, name: "Orthworm", img: ({ gameKey }) => baseSprite(gameKey, 968), imgS: ({ gameKey }) => shinySprite(gameKey, 968), },
		{ id: 97, natiId: 924, name: "Tandemaus", img: ({ gameKey }) => baseSprite(gameKey, 924), imgS: ({ gameKey }) => shinySprite(gameKey, 924), },
		{
			id: 98, natiId: 925, name: "Maushold", img: ({ gameKey }) => baseSprite(gameKey, 925), imgS: ({ gameKey }) => shinySprite(gameKey, 925), tags: ["other"], forms: [
				{ name: "Family of Four", img: ({ gameKey }) => baseSprite(gameKey, 925), imgS: ({ gameKey }) => shinySprite(gameKey, 925), },
				{ name: "Family of Three", img: ({ gameKey }) => baseSprite(gameKey, "0925-3"), imgS: ({ gameKey }) => shinySprite(gameKey, "0925-3"), }
			],
		},
		{ id: 99, natiId: 56, name: "Mankey", img: ({ gameKey }) => baseSprite(gameKey, 56), imgS: ({ gameKey }) => shinySprite(gameKey, 56), },
		{ id: 100, natiId: 57, name: "Primeape", img: ({ gameKey }) => baseSprite(gameKey, 57), imgS: ({ gameKey }) => shinySprite(gameKey, 57), },
		{ id: 101, natiId: 979, name: "Annihilape", img: ({ gameKey }) => baseSprite(gameKey, 979), imgS: ({ gameKey }) => shinySprite(gameKey, 979), },
		{ id: 102, natiId: 446, name: "Munchlax", img: ({ gameKey }) => baseSprite(gameKey, 446), imgS: ({ gameKey }) => shinySprite(gameKey, 446), },
		{ id: 103, natiId: 143, name: "Snorlax", img: ({ gameKey }) => baseSprite(gameKey, 143), imgS: ({ gameKey }) => shinySprite(gameKey, 143), },
		{ id: 104, natiId: 270, name: "Lotad", img: ({ gameKey }) => baseSprite(gameKey, 270), imgS: ({ gameKey }) => shinySprite(gameKey, 270), },
		{ id: 105, natiId: 271, name: "Lombre", img: ({ gameKey }) => baseSprite(gameKey, 271), imgS: ({ gameKey }) => shinySprite(gameKey, 271), },
		{
			id: 106, natiId: 272, name: "Ludicolo", img: ({ gameKey }) => baseSprite(gameKey, 272), imgS: ({ gameKey }) => shinySprite(gameKey, 272), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 272), imgS: ({ gameKey }) => shinySprite(gameKey, 272) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0272-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0272-f") },
			],
		},
		{ id: 107, natiId: 299, name: "Nosepass", img: ({ gameKey }) => baseSprite(gameKey, 299), imgS: ({ gameKey }) => shinySprite(gameKey, 299), },
		{ id: 108, natiId: 476, name: "Probopass", img: ({ gameKey }) => baseSprite(gameKey, 476), imgS: ({ gameKey }) => shinySprite(gameKey, 476), },
		{
			id: 109, natiId: 403, name: "Shinx", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0403-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0403-f"), }
			],
		},
		{
			id: 110, natiId: 404, name: "Luxio", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0404-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0404-f"), }
			],
		},
		{
			id: 111, natiId: 405, name: "Luxray", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0405-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0405-f"), }
			],
		},
		{ id: 112, natiId: 736, name: "Grubbin", img: ({ gameKey }) => baseSprite(gameKey, 736), imgS: ({ gameKey }) => shinySprite(gameKey, 736), },
		{ id: 113, natiId: 737, name: "Charjabug", img: ({ gameKey }) => baseSprite(gameKey, 737), imgS: ({ gameKey }) => shinySprite(gameKey, 737), },
		{ id: 114, natiId: 738, name: "Vikavolt", img: ({ gameKey }) => baseSprite(gameKey, 738), imgS: ({ gameKey }) => shinySprite(gameKey, 738), },
		{
			id: 115, natiId: 741, name: "Oricorio", img: ({ gameKey }) => baseSprite(gameKey, 741), imgS: ({ gameKey }) => shinySprite(gameKey, 741), tags: ["other"], forms: [
				{ name: "Baile Style", img: ({ gameKey }) => baseSprite(gameKey, 741), imgS: ({ gameKey }) => shinySprite(gameKey, 741), },
				{ name: "Pa'u Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-p"), },
				{ name: "Pom-Pom Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-p"), },
				{ name: "Sensu Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-s"), }
			],
		},
		{
			id: 116, natiId: 27, name: "Sandshrew", img: ({ gameKey }) => baseSprite(gameKey, 27), imgS: ({ gameKey }) => shinySprite(gameKey, 27), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 27), imgS: ({ gameKey }) => shinySprite(gameKey, 27), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0027-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0027-a"), tags: ["alolan"], }
			],
		},
		{
			id: 117, natiId: 28, name: "Sandslash", img: ({ gameKey }) => baseSprite(gameKey, 28), imgS: ({ gameKey }) => shinySprite(gameKey, 28), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 28), imgS: ({ gameKey }) => shinySprite(gameKey, 28), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0028-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0028-a"), tags: ["alolan"], }
			],
		},
		{ id: 118, natiId: 92, name: "Gastly", img: ({ gameKey }) => baseSprite(gameKey, 92), imgS: ({ gameKey }) => shinySprite(gameKey, 92), },
		{ id: 119, natiId: 93, name: "Haunter", img: ({ gameKey }) => baseSprite(gameKey, 93), imgS: ({ gameKey }) => shinySprite(gameKey, 93), },
		{ id: 120, natiId: 94, name: "Gengar", img: ({ gameKey }) => baseSprite(gameKey, 94), imgS: ({ gameKey }) => shinySprite(gameKey, 94), },
		{
			id: 121, natiId: 207, name: "Gligar", img: ({ gameKey }) => baseSprite(gameKey, 207), imgS: ({ gameKey }) => shinySprite(gameKey, 207), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 207), imgS: ({ gameKey }) => shinySprite(gameKey, 207) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0207-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0207-f") },
			],
		},
		{ id: 122, natiId: 472, name: "Gliscor", img: ({ gameKey }) => baseSprite(gameKey, 472), imgS: ({ gameKey }) => shinySprite(gameKey, 472), },
		{ id: 123, natiId: 228, name: "Houndour", img: ({ gameKey }) => baseSprite(gameKey, 228), imgS: ({ gameKey }) => shinySprite(gameKey, 228), },
		{
			id: 124, natiId: 229, name: "Houndoom", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0229-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0229-f"), },],
		},
		{ id: 125, natiId: 325, name: "Spoink", img: ({ gameKey }) => baseSprite(gameKey, 325), imgS: ({ gameKey }) => shinySprite(gameKey, 325), },
		{ id: 126, natiId: 326, name: "Grumpig", img: ({ gameKey }) => baseSprite(gameKey, 326), imgS: ({ gameKey }) => shinySprite(gameKey, 326), },
		{ id: 127, natiId: 629, name: "Vullaby", img: ({ gameKey }) => baseSprite(gameKey, 629), imgS: ({ gameKey }) => shinySprite(gameKey, 629), },
		{ id: 128, natiId: 630, name: "Mandibuzz", img: ({ gameKey }) => baseSprite(gameKey, 630), imgS: ({ gameKey }) => shinySprite(gameKey, 630), },
		{ id: 129, natiId: 749, name: "Mudbray", img: ({ gameKey }) => baseSprite(gameKey, 749), imgS: ({ gameKey }) => shinySprite(gameKey, 749), },
		{ id: 130, natiId: 750, name: "Mudsdale", img: ({ gameKey }) => baseSprite(gameKey, 750), imgS: ({ gameKey }) => shinySprite(gameKey, 750), },
		{ id: 131, natiId: 782, name: "Jangmo-o", img: ({ gameKey }) => baseSprite(gameKey, 782), imgS: ({ gameKey }) => shinySprite(gameKey, 782), tags: ["pseudo"] },
		{ id: 132, natiId: 783, name: "Hakamo-o", img: ({ gameKey }) => baseSprite(gameKey, 783), imgS: ({ gameKey }) => shinySprite(gameKey, 783), tags: ["pseudo"] },
		{ id: 133, natiId: 784, name: "Kommo-o", img: ({ gameKey }) => baseSprite(gameKey, 784), imgS: ({ gameKey }) => shinySprite(gameKey, 784), tags: ["pseudo"] },
		{ id: 134, natiId: 962, name: "Bombirdier", img: ({ gameKey }) => baseSprite(gameKey, 962), imgS: ({ gameKey }) => shinySprite(gameKey, 962), },
		{ id: 135, natiId: 109, name: "Koffing", img: ({ gameKey }) => baseSprite(gameKey, 109), imgS: ({ gameKey }) => shinySprite(gameKey, 109), },
		{
			id: 136, natiId: 110, name: "Weezing", img: ({ gameKey }) => baseSprite(gameKey, 110), imgS: ({ gameKey }) => shinySprite(gameKey, 110), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 110), imgS: ({ gameKey }) => shinySprite(gameKey, 110) },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0110-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0110-g"), tags: ["galarian"], },
			],
		},
		{ id: 137, natiId: 619, name: "Mienfoo", img: ({ gameKey }) => baseSprite(gameKey, 619), imgS: ({ gameKey }) => shinySprite(gameKey, 619), },
		{ id: 138, natiId: 620, name: "Mienshao", img: ({ gameKey }) => baseSprite(gameKey, 620), imgS: ({ gameKey }) => shinySprite(gameKey, 620), },
		{ id: 139, natiId: 355, name: "Duskull", img: ({ gameKey }) => baseSprite(gameKey, 355), imgS: ({ gameKey }) => shinySprite(gameKey, 355), },
		{ id: 140, natiId: 356, name: "Dusclops", img: ({ gameKey }) => baseSprite(gameKey, 356), imgS: ({ gameKey }) => shinySprite(gameKey, 356), },
		{ id: 141, natiId: 477, name: "Dusknoir", img: ({ gameKey }) => baseSprite(gameKey, 477), imgS: ({ gameKey }) => shinySprite(gameKey, 477), },
		{ id: 142, natiId: 433, name: "Chingling", img: ({ gameKey }) => baseSprite(gameKey, 433), imgS: ({ gameKey }) => shinySprite(gameKey, 433), },
		{ id: 143, natiId: 358, name: "Chimecho", img: ({ gameKey }) => baseSprite(gameKey, 358), imgS: ({ gameKey }) => shinySprite(gameKey, 358), },
		{ id: 144, natiId: 218, name: "Slugma", img: ({ gameKey }) => baseSprite(gameKey, 218), imgS: ({ gameKey }) => shinySprite(gameKey, 218), },
		{ id: 145, natiId: 219, name: "Magcargo", img: ({ gameKey }) => baseSprite(gameKey, 219), imgS: ({ gameKey }) => shinySprite(gameKey, 219), },
		{ id: 146, natiId: 607, name: "Litwick", img: ({ gameKey }) => baseSprite(gameKey, 607), imgS: ({ gameKey }) => shinySprite(gameKey, 607), },
		{ id: 147, natiId: 608, name: "Lampent", img: ({ gameKey }) => baseSprite(gameKey, 608), imgS: ({ gameKey }) => shinySprite(gameKey, 608), },
		{ id: 148, natiId: 609, name: "Chandelure", img: ({ gameKey }) => baseSprite(gameKey, 609), imgS: ({ gameKey }) => shinySprite(gameKey, 609), },
		{ id: 149, natiId: 283, name: "Surskit", img: ({ gameKey }) => baseSprite(gameKey, 283), imgS: ({ gameKey }) => shinySprite(gameKey, 283), },
		{ id: 150, natiId: 284, name: "Masquerain", img: ({ gameKey }) => baseSprite(gameKey, 284), imgS: ({ gameKey }) => shinySprite(gameKey, 284), },
		{ id: 151, natiId: 173, name: "Cleffa", img: ({ gameKey }) => baseSprite(gameKey, 173), imgS: ({ gameKey }) => shinySprite(gameKey, 173), },
		{ id: 152, natiId: 35, name: "Clefairy", img: ({ gameKey }) => baseSprite(gameKey, 35), imgS: ({ gameKey }) => shinySprite(gameKey, 35), },
		{ id: 153, natiId: 36, name: "Clefable", img: ({ gameKey }) => baseSprite(gameKey, 36), imgS: ({ gameKey }) => shinySprite(gameKey, 36), },
		{ id: 154, natiId: 436, name: "Bronzor", img: ({ gameKey }) => baseSprite(gameKey, 436), imgS: ({ gameKey }) => shinySprite(gameKey, 436), },
		{ id: 155, natiId: 437, name: "Bronzong", img: ({ gameKey }) => baseSprite(gameKey, 437), imgS: ({ gameKey }) => shinySprite(gameKey, 437), },
		{ id: 156, natiId: 969, name: "Glimmet", img: ({ gameKey }) => baseSprite(gameKey, 969), imgS: ({ gameKey }) => shinySprite(gameKey, 969), },
		{ id: 157, natiId: 970, name: "Glimmora", img: ({ gameKey }) => baseSprite(gameKey, 970), imgS: ({ gameKey }) => shinySprite(gameKey, 970), },
		{ id: 158, natiId: 349, name: "Feebas", img: ({ gameKey }) => baseSprite(gameKey, 349), imgS: ({ gameKey }) => shinySprite(gameKey, 349), },
		{
			id: 159, natiId: 350, name: "Milotic", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0350-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0350-f") },
			],
		},
		{ id: 160, natiId: 206, name: "Dunsparce", img: ({ gameKey }) => baseSprite(gameKey, 206), imgS: ({ gameKey }) => shinySprite(gameKey, 206), },
		{
			id: 161, natiId: 982, name: "Dudunsparce", img: ({ gameKey }) => baseSprite(gameKey, 982), imgS: ({ gameKey }) => shinySprite(gameKey, 982), tags: ["other"], forms: [
				{ name: "Three-Segment", img: ({ gameKey }) => baseSprite(gameKey, 982), imgS: ({ gameKey }) => shinySprite(gameKey, 982), },
				{ name: "Two-Segment", img: ({ gameKey }) => baseSprite(gameKey, "0982-2"), imgS: ({ gameKey }) => shinySprite(gameKey, "0982-2"), }
			],
		},
		{ id: 162, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339), },
		{ id: 163, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340), },
		{
			id: 164, natiId: 443, name: "Gible", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0443-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0443-f"), }
			],
		},
		{
			id: 165, natiId: 444, name: "Gabite", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0444-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0444-f"), }
			],
		},
		{
			id: 166, natiId: 445, name: "Garchomp", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0445-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0445-f"), },],
		},
		{ id: 167, natiId: 703, name: "Carbink", img: ({ gameKey }) => baseSprite(gameKey, 703), imgS: ({ gameKey }) => shinySprite(gameKey, 703), },
		{ id: 168, natiId: 757, name: "Salandit", img: ({ gameKey }) => baseSprite(gameKey, 757), imgS: ({ gameKey }) => shinySprite(gameKey, 757), },
		{ id: 169, natiId: 758, name: "Salazzle", img: ({ gameKey }) => baseSprite(gameKey, 758), imgS: ({ gameKey }) => shinySprite(gameKey, 758), },
		{
			id: 170, natiId: 215, name: "Sneasel", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), tags: ["gender"], forms: [
				{ name: "Johtonian Male", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), },
				{ name: "Johtonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-f"), },
				{ name: "Hisuian Male", img: ({ gameKey }) => baseSprite(gameKey, "0215-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-h"), tags: ["hisuian"], },
				{ name: "Hisuian Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-h-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-h-f"), tags: ["hisuian"], }
			],
		},
		{
			id: 171, natiId: 461, name: "Weavile", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0461-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0461-f"), }
			],
		},
		{ id: 172, natiId: 361, name: "Snorunt", img: ({ gameKey }) => baseSprite(gameKey, 361), imgS: ({ gameKey }) => shinySprite(gameKey, 361), },
		{ id: 173, natiId: 362, name: "Glalie", img: ({ gameKey }) => baseSprite(gameKey, 362), imgS: ({ gameKey }) => shinySprite(gameKey, 362), },
		{ id: 174, natiId: 478, name: "Froslass", img: ({ gameKey }) => baseSprite(gameKey, 478), imgS: ({ gameKey }) => shinySprite(gameKey, 478), },
		{ id: 175, natiId: 602, name: "Tynamo", img: ({ gameKey }) => baseSprite(gameKey, 602), imgS: ({ gameKey }) => shinySprite(gameKey, 602), },
		{ id: 176, natiId: 603, name: "Eelektrik", img: ({ gameKey }) => baseSprite(gameKey, 603), imgS: ({ gameKey }) => shinySprite(gameKey, 603), },
		{ id: 177, natiId: 604, name: "Eelektross", img: ({ gameKey }) => baseSprite(gameKey, 604), imgS: ({ gameKey }) => shinySprite(gameKey, 604), },
		{ id: 178, natiId: 704, name: "Goomy", img: ({ gameKey }) => baseSprite(gameKey, 704), imgS: ({ gameKey }) => shinySprite(gameKey, 704), tags: ["pseudo"] },
		{
			id: 179, natiId: 705, name: "Sliggoo", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), forms: [
				{ name: "Kalosian", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0705-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0705-h"), tags: ["hisuian", "pseudo"], }
			],
		},
		{
			id: 180, natiId: 706, name: "Goodra", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), forms: [
				{ name: "Kalosian", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0706-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0706-h"), tags: ["hisuian", "pseudo"], }
			],
		},
		{ id: 181, natiId: 580, name: "Ducklett", img: ({ gameKey }) => baseSprite(gameKey, 580), imgS: ({ gameKey }) => shinySprite(gameKey, 580), },
		{ id: 182, natiId: 581, name: "Swanna", img: ({ gameKey }) => baseSprite(gameKey, 581), imgS: ({ gameKey }) => shinySprite(gameKey, 581), },
		{ id: 183, natiId: 833, name: "Chewtle", img: ({ gameKey }) => baseSprite(gameKey, 833), imgS: ({ gameKey }) => shinySprite(gameKey, 833), },
		{ id: 184, natiId: 834, name: "Drednaw", img: ({ gameKey }) => baseSprite(gameKey, 834), imgS: ({ gameKey }) => shinySprite(gameKey, 834), },
		{ id: 185, natiId: 845, name: "Cramorant", img: ({ gameKey }) => baseSprite(gameKey, 845), imgS: ({ gameKey }) => shinySprite(gameKey, 845), },
		{ id: 186, natiId: 624, name: "Pawniard", img: ({ gameKey }) => baseSprite(gameKey, 624), imgS: ({ gameKey }) => shinySprite(gameKey, 624), },
		{ id: 187, natiId: 625, name: "Bisharp", img: ({ gameKey }) => baseSprite(gameKey, 625), imgS: ({ gameKey }) => shinySprite(gameKey, 625), },
		{ id: 188, natiId: 983, name: "Kingambit", img: ({ gameKey }) => baseSprite(gameKey, 983), imgS: ({ gameKey }) => shinySprite(gameKey, 983), },
		{ id: 189, natiId: 778, name: "Mimikyu", img: ({ gameKey }) => baseSprite(gameKey, 778), imgS: ({ gameKey }) => shinySprite(gameKey, 778), },
		{ id: 190, natiId: 859, name: "Impidimp", img: ({ gameKey }) => baseSprite(gameKey, 859), imgS: ({ gameKey }) => shinySprite(gameKey, 859), },
		{ id: 191, natiId: 860, name: "Morgrem", img: ({ gameKey }) => baseSprite(gameKey, 860), imgS: ({ gameKey }) => shinySprite(gameKey, 860), },
		{ id: 192, natiId: 861, name: "Grimmsnarl", img: ({ gameKey }) => baseSprite(gameKey, 861), imgS: ({ gameKey }) => shinySprite(gameKey, 861), },
		{
			id: 193, natiId: 876, name: "Indeedee", img: ({ gameKey }) => baseSprite(gameKey, 876), imgS: ({ gameKey }) => shinySprite(gameKey, 876), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 876), imgS: ({ gameKey }) => shinySprite(gameKey, 876), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0876-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0876-f"), }
			],
		},
		{
			id: 194, natiId: 550, name: "Basculin", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), tags: ["other"], forms: [
				{ name: "Blue-Striped", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), },
				{ name: "Red-Striped", img: ({ gameKey }) => baseSprite(gameKey, "0550-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0550-r"), },
				{ name: "White-Striped", img: ({ gameKey }) => baseSprite(gameKey, "0550-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0550-w"), }
			],
		},
		{
			id: 195, natiId: 902, name: "Basculegion", img: ({ gameKey }) => baseSprite(gameKey, 902), imgS: ({ gameKey }) => shinySprite(gameKey, 902), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 902), imgS: ({ gameKey }) => shinySprite(gameKey, 902) },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0902-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0902-f") },
			],
		},
		{
			id: 196, natiId: 901, name: "Ursaluna", img: ({ gameKey }) => baseSprite(gameKey, 901), imgS: ({ gameKey }) => shinySprite(gameKey, 901), tags: ["other"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 901), imgS: ({ gameKey }) => shinySprite(gameKey, 901) },
				{ name: "Bloodmoon", img: ({ gameKey }) => baseSprite(gameKey, "0901-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0901-b"), maxStatus: "caught", }
			],
		},
		{ id: 197, natiId: 1014, name: "Okidogi", img: ({ gameKey }) => baseSprite(gameKey, 1014), imgS: ({ gameKey }) => shinySprite(gameKey, 1014), maxStatus: "caught", tags: ["legendary"], },
		{ id: 198, natiId: 1015, name: "Munkidori", img: ({ gameKey }) => baseSprite(gameKey, 1015), imgS: ({ gameKey }) => shinySprite(gameKey, 1015), maxStatus: "caught", tags: ["legendary"], },
		{ id: 199, natiId: 1016, name: "Fezandipiti", img: ({ gameKey }) => baseSprite(gameKey, 1016), imgS: ({ gameKey }) => shinySprite(gameKey, 1016), maxStatus: "caught", tags: ["legendary"], },
		{ id: 200, natiId: 1017, name: "Ogerpon", img: ({ gameKey }) => baseSprite(gameKey, 1017), imgS: ({ gameKey }) => shinySprite(gameKey, 1017), maxStatus: "caught", tags: ["legendary"], }
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();