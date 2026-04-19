import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 7;
	const GAME_KEYS = ["ultrasun-poni", "ultramoon-poni"];
	const DEX_NAME = "Poni Dex";

	const baseSprite = (gameKey, natiId) => dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 731, name: "Pikipek", img: ({ gameKey }) => baseSprite(gameKey, 731), imgS: ({ gameKey }) => shinySprite(gameKey, 731), },
		{ id: 2, natiId: 732, name: "Trumbeak", img: ({ gameKey }) => baseSprite(gameKey, 732), imgS: ({ gameKey }) => shinySprite(gameKey, 732), },
		{ id: 3, natiId: 733, name: "Toucannon", img: ({ gameKey }) => baseSprite(gameKey, 733), imgS: ({ gameKey }) => shinySprite(gameKey, 733), },
		{ id: 4, natiId: 734, name: "Yungoos", img: ({ gameKey }) => baseSprite(gameKey, 734), imgS: ({ gameKey }) => shinySprite(gameKey, 734), },
		{ id: 5, natiId: 735, name: "Gumshoos", img: ({ gameKey }) => baseSprite(gameKey, 735), imgS: ({ gameKey }) => shinySprite(gameKey, 735), },
		{
			id: 6, natiId: 19, name: "Rattata", img: ({ gameKey }) => baseSprite(gameKey, 19), imgS: ({ gameKey }) => shinySprite(gameKey, 19), tags: ["gender"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 19), imgS: ({ gameKey }) => shinySprite(gameKey, 19), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0019-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0019-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0019-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0019-a"), tags: ["alolan"], },
			],
		},
		{
			id: 7, natiId: 20, name: "Raticate", img: ({ gameKey }) => baseSprite(gameKey, 20), imgS: ({ gameKey }) => shinySprite(gameKey, 20), tags: ["gender"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 20), imgS: ({ gameKey }) => shinySprite(gameKey, 20), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0020-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0020-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-a"), tags: ["alolan"], },
			],
		},
		{ id: 8, natiId: 427, name: "Buneary", img: ({ gameKey }) => baseSprite(gameKey, 427), imgS: ({ gameKey }) => shinySprite(gameKey, 427), },
		{ id: 9, natiId: 428, name: "Lopunny", img: ({ gameKey }) => baseSprite(gameKey, 428), imgS: ({ gameKey }) => shinySprite(gameKey, 428), tags: ["mega"], },
		{ id: 10, natiId: 686, name: "Inkay", img: ({ gameKey }) => baseSprite(gameKey, 686), imgS: ({ gameKey }) => shinySprite(gameKey, 686), },
		{ id: 11, natiId: 687, name: "Malamar", img: ({ gameKey }) => baseSprite(gameKey, 687), imgS: ({ gameKey }) => shinySprite(gameKey, 687), },
		{ id: 12, natiId: 570, name: "Zorua", img: ({ gameKey }) => baseSprite(gameKey, 570), imgS: ({ gameKey }) => shinySprite(gameKey, 570), },
		{ id: 13, natiId: 571, name: "Zoroark", img: ({ gameKey }) => baseSprite(gameKey, 571), imgS: ({ gameKey }) => shinySprite(gameKey, 571), },
		{
			id: 14, natiId: 676, name: "Furfrou", img: ({ gameKey }) => baseSprite(gameKey, 676), imgS: ({ gameKey }) => shinySprite(gameKey, 676), tags: ["other"], forms: [
				{ name: "Natural Trim", img: ({ gameKey }) => baseSprite(gameKey, 676), imgS: ({ gameKey }) => shinySprite(gameKey, 676), },
				{ name: "Heart Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-he"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-he"), },
				{ name: "Star Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-st"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-st"), },
				{ name: "Diamond Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-di"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-di"), },
				{ name: "Debutante Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-de"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-de"), },
				{ name: "Matron Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-ma"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-ma"), },
				{ name: "Dandy Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-da"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-da"), },
				{ name: "Le Reine Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-la"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-la"), },
				{ name: "Kabuki Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-ka"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-ka"), },
				{ name: "Pharaoh Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-ph"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-ph"), },
			],
		},
		{ id: 15, natiId: 440, name: "Happiny", img: ({ gameKey }) => baseSprite(gameKey, 440), imgS: ({ gameKey }) => shinySprite(gameKey, 440), },
		{ id: 16, natiId: 113, name: "Chansey", img: ({ gameKey }) => baseSprite(gameKey, 113), imgS: ({ gameKey }) => shinySprite(gameKey, 113), },
		{ id: 17, natiId: 242, name: "Blissey", img: ({ gameKey }) => baseSprite(gameKey, 242), imgS: ({ gameKey }) => shinySprite(gameKey, 242), },
		{ id: 18, natiId: 278, name: "Wingull", img: ({ gameKey }) => baseSprite(gameKey, 278), imgS: ({ gameKey }) => shinySprite(gameKey, 278), },
		{ id: 19, natiId: 279, name: "Pelipper", img: ({ gameKey }) => baseSprite(gameKey, 279), imgS: ({ gameKey }) => shinySprite(gameKey, 279), },
		{ id: 20, natiId: 96, name: "Drowzee", img: ({ gameKey }) => baseSprite(gameKey, 96), imgS: ({ gameKey }) => shinySprite(gameKey, 96), },
		{
			id: 21, natiId: 97, name: "Hypno", img: ({ gameKey }) => baseSprite(gameKey, 97), imgS: ({ gameKey }) => shinySprite(gameKey, 97), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 97), imgS: ({ gameKey }) => shinySprite(gameKey, 97), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0097-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0097-f"), },
			],
		},
		{ id: 22, natiId: 296, name: "Makuhita", img: ({ gameKey }) => baseSprite(gameKey, 296), imgS: ({ gameKey }) => shinySprite(gameKey, 296), },
		{ id: 23, natiId: 297, name: "Hariyama", img: ({ gameKey }) => baseSprite(gameKey, 297), imgS: ({ gameKey }) => shinySprite(gameKey, 297), },
		{ id: 24, natiId: 739, name: "Crabrawler", img: ({ gameKey }) => baseSprite(gameKey, 739), imgS: ({ gameKey }) => shinySprite(gameKey, 739), },
		{ id: 25, natiId: 740, name: "Crabominable", img: ({ gameKey }) => baseSprite(gameKey, 740), imgS: ({ gameKey }) => shinySprite(gameKey, 740), },
		{
			id: 26, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), },
			],
		},
		{
			id: 27, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), },
			],
		},
		{ id: 28, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169), },
		{ id: 29, natiId: 714, name: "Noibat", img: ({ gameKey }) => baseSprite(gameKey, 714), imgS: ({ gameKey }) => shinySprite(gameKey, 714), },
		{ id: 30, natiId: 715, name: "Noivern", img: ({ gameKey }) => baseSprite(gameKey, 715), imgS: ({ gameKey }) => shinySprite(gameKey, 715), },
		{
			id: 31, natiId: 50, name: "Diglett", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0050-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0050-a"), tags: ["alolan"], },
			],
		},
		{
			id: 32, natiId: 51, name: "Dugtrio", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0051-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0051-a"), tags: ["alolan"], },
			],
		},
		{ id: 33, natiId: 21, name: "Spearow", img: ({ gameKey }) => baseSprite(gameKey, 21), imgS: ({ gameKey }) => shinySprite(gameKey, 21), },
		{ id: 34, natiId: 22, name: "Fearow", img: ({ gameKey }) => baseSprite(gameKey, 22), imgS: ({ gameKey }) => shinySprite(gameKey, 22), },
		{ id: 35, natiId: 627, name: "Rufflet", img: ({ gameKey }) => baseSprite(gameKey, 627), imgS: ({ gameKey }) => shinySprite(gameKey, 627), },
		{ id: 36, natiId: 628, name: "Braviary", img: ({ gameKey }) => baseSprite(gameKey, 628), imgS: ({ gameKey }) => shinySprite(gameKey, 628), },
		{ id: 37, natiId: 629, name: "Vullaby", img: ({ gameKey }) => baseSprite(gameKey, 629), imgS: ({ gameKey }) => shinySprite(gameKey, 629), },
		{ id: 38, natiId: 630, name: "Mandibuzz", img: ({ gameKey }) => baseSprite(gameKey, 630), imgS: ({ gameKey }) => shinySprite(gameKey, 630), },
		{ id: 39, natiId: 56, name: "Mankey", img: ({ gameKey }) => baseSprite(gameKey, 56), imgS: ({ gameKey }) => shinySprite(gameKey, 56), },
		{ id: 40, natiId: 57, name: "Primeape", img: ({ gameKey }) => baseSprite(gameKey, 57), imgS: ({ gameKey }) => shinySprite(gameKey, 57), },
		{
			id: 41, natiId: 741, name: "Oricorio", img: ({ gameKey }) => baseSprite(gameKey, "0741-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-s"), tags: ["other"], forms: [
				{ name: "Baile Style", img: ({ gameKey }) => baseSprite(gameKey, 741), imgS: ({ gameKey }) => shinySprite(gameKey, 741), },
				{ name: "Pa'u Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-pa"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-pa"), },
				{ name: "Pom-Pom Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-po"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-po"), },
				{ name: "Sensu Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-s"), },
			],
		},
		{ id: 42, natiId: 742, name: "Cutiefly", img: ({ gameKey }) => baseSprite(gameKey, 742), imgS: ({ gameKey }) => shinySprite(gameKey, 742), },
		{ id: 43, natiId: 743, name: "Ribombee", img: ({ gameKey }) => baseSprite(gameKey, 743), imgS: ({ gameKey }) => shinySprite(gameKey, 743), },
		{
			id: 44, natiId: 669, name: "Flabébé", img: ({ gameKey }) => baseSprite(gameKey, 669), imgS: ({ gameKey }) => shinySprite(gameKey, 669), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 669), imgS: ({ gameKey }) => shinySprite(gameKey, 669), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-w"), },
			],
		},
		{
			id: 45, natiId: 670, name: "Floette", img: ({ gameKey }) => baseSprite(gameKey, 670), imgS: ({ gameKey }) => shinySprite(gameKey, 670), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 670), imgS: ({ gameKey }) => shinySprite(gameKey, 670), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-w"), },
			],
		},
		{
			id: 46, natiId: 671, name: "Florges", img: ({ gameKey }) => baseSprite(gameKey, 671), imgS: ({ gameKey }) => shinySprite(gameKey, 671), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 671), imgS: ({ gameKey }) => shinySprite(gameKey, 671), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-w"), },
			],
		},
		{ id: 47, natiId: 548, name: "Petilil", img: ({ gameKey }) => baseSprite(gameKey, 548), imgS: ({ gameKey }) => shinySprite(gameKey, 548), },
		{ id: 48, natiId: 549, name: "Lilligant", img: ({ gameKey }) => baseSprite(gameKey, 549), imgS: ({ gameKey }) => shinySprite(gameKey, 549), },
		{ id: 49, natiId: 546, name: "Cottonee", img: ({ gameKey }) => baseSprite(gameKey, 546), imgS: ({ gameKey }) => shinySprite(gameKey, 546), },
		{ id: 50, natiId: 547, name: "Whimsicott", img: ({ gameKey }) => baseSprite(gameKey, 547), imgS: ({ gameKey }) => shinySprite(gameKey, 547), },
		{ id: 51, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54), },
		{ id: 52, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55), },
		{
			id: 53, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), },
			],
		},
		{
			id: 54, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },
			],
		},
		{ id: 55, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339), },
		{ id: 56, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340), },
		{ id: 57, natiId: 66, name: "Machop", img: ({ gameKey }) => baseSprite(gameKey, 66), imgS: ({ gameKey }) => shinySprite(gameKey, 66), },
		{ id: 58, natiId: 67, name: "Machoke", img: ({ gameKey }) => baseSprite(gameKey, 67), imgS: ({ gameKey }) => shinySprite(gameKey, 67), },
		{ id: 59, natiId: 68, name: "Machamp", img: ({ gameKey }) => baseSprite(gameKey, 68), imgS: ({ gameKey }) => shinySprite(gameKey, 68), },
		{ id: 60, natiId: 524, name: "Roggenrola", img: ({ gameKey }) => baseSprite(gameKey, 524), imgS: ({ gameKey }) => shinySprite(gameKey, 524), },
		{ id: 61, natiId: 525, name: "Boldore", img: ({ gameKey }) => baseSprite(gameKey, 525), imgS: ({ gameKey }) => shinySprite(gameKey, 525), },
		{ id: 62, natiId: 526, name: "Gigalith", img: ({ gameKey }) => baseSprite(gameKey, 526), imgS: ({ gameKey }) => shinySprite(gameKey, 526), },
		{ id: 63, natiId: 703, name: "Carbink", img: ({ gameKey }) => baseSprite(gameKey, 703), imgS: ({ gameKey }) => shinySprite(gameKey, 703), },
		{ id: 64, natiId: 302, name: "Sableye", img: ({ gameKey }) => baseSprite(gameKey, 302), imgS: ({ gameKey }) => shinySprite(gameKey, 302), },
		{ id: 65, natiId: 744, name: "Rockruff", img: ({ gameKey }) => baseSprite(gameKey, 744), imgS: ({ gameKey }) => shinySprite(gameKey, 744), },
		{
			id: 66, natiId: 745, name: "Lycanroc", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), tags: ["other", "zcrystal"], forms: [
				{ name: "Midday", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), },
				{ name: "Midnight", img: ({ gameKey }) => baseSprite(gameKey, "0745-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-m"), },
				{ name: "Dusk", img: ({ gameKey }) => baseSprite(gameKey, "0745-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-d"), },
			],
		},
		{ id: 67, natiId: 72, name: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72), imgS: ({ gameKey }) => shinySprite(gameKey, 72), },
		{ id: 68, natiId: 73, name: "Tentacruel", img: ({ gameKey }) => baseSprite(gameKey, 73), imgS: ({ gameKey }) => shinySprite(gameKey, 73), },
		{
			id: 69, natiId: 456, name: "Finneon", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0456-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0456-f"), },
			],
		},
		{
			id: 70, natiId: 457, name: "Lumineon", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0457-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0457-f"), },
			],
		},
		{ id: 71, natiId: 749, name: "Mudbray", img: ({ gameKey }) => baseSprite(gameKey, 749), imgS: ({ gameKey }) => shinySprite(gameKey, 749), },
		{ id: 72, natiId: 750, name: "Mudsdale", img: ({ gameKey }) => baseSprite(gameKey, 750), imgS: ({ gameKey }) => shinySprite(gameKey, 750), },
		{ id: 73, natiId: 128, name: "Tauros", img: ({ gameKey }) => baseSprite(gameKey, 128), imgS: ({ gameKey }) => shinySprite(gameKey, 128), },
		{ id: 74, natiId: 241, name: "Miltank", img: ({ gameKey }) => baseSprite(gameKey, 241), imgS: ({ gameKey }) => shinySprite(gameKey, 241), },
		{
			id: 75, natiId: 550, name: "Basculin", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), tags: ["other"], forms: [
				{ name: "Blue-Striped", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), },
				{ name: "Red-Striped", img: ({ gameKey }) => baseSprite(gameKey, "0550-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0550-r"), },
			],
		},
		{ id: 76, natiId: 759, name: "Stufful", img: ({ gameKey }) => baseSprite(gameKey, 759), imgS: ({ gameKey }) => shinySprite(gameKey, 759), },
		{ id: 77, natiId: 760, name: "Bewear", img: ({ gameKey }) => baseSprite(gameKey, 760), imgS: ({ gameKey }) => shinySprite(gameKey, 760), },
		{ id: 78, natiId: 127, name: "Pinsir", img: ({ gameKey }) => baseSprite(gameKey, 127), imgS: ({ gameKey }) => shinySprite(gameKey, 127), },
		{ id: 79, natiId: 704, name: "Goomy", img: ({ gameKey }) => baseSprite(gameKey, 704), imgS: ({ gameKey }) => shinySprite(gameKey, 704), tags: ["pseudo"], },
		{ id: 80, natiId: 705, name: "Sliggoo", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), tags: ["pseudo"], },
		{ id: 81, natiId: 706, name: "Goodra", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), tags: ["pseudo"], },
		{
			id: 82, natiId: 351, name: "Castform", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), tags: ["other"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), },
				{ name: "Rainy", img: ({ gameKey }) => baseSprite(gameKey, "0351-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-r"), },
				{ name: "Snowy", img: ({ gameKey }) => baseSprite(gameKey, "0351-i"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-i"), },
				{ name: "Sunny", img: ({ gameKey }) => baseSprite(gameKey, "0351-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-s"), },
			],
		},
		{ id: 83, natiId: 767, name: "Wimpod", img: ({ gameKey }) => baseSprite(gameKey, 767), imgS: ({ gameKey }) => shinySprite(gameKey, 767), },
		{ id: 84, natiId: 768, name: "Golisopod", img: ({ gameKey }) => baseSprite(gameKey, 768), imgS: ({ gameKey }) => shinySprite(gameKey, 768), },
		{ id: 85, natiId: 227, name: "Skarmory", img: ({ gameKey }) => baseSprite(gameKey, 227), imgS: ({ gameKey }) => shinySprite(gameKey, 227), },
		{ id: 86, natiId: 209, name: "Snubbull", img: ({ gameKey }) => baseSprite(gameKey, 209), imgS: ({ gameKey }) => shinySprite(gameKey, 209), },
		{ id: 87, natiId: 210, name: "Granbull", img: ({ gameKey }) => baseSprite(gameKey, 210), imgS: ({ gameKey }) => shinySprite(gameKey, 210), },
		{
			id: 88, natiId: 422, name: "Shellos", img: ({ gameKey }) => baseSprite(gameKey, 422), imgS: ({ gameKey }) => shinySprite(gameKey, 422), tags: ["other"], forms: [
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, 422), imgS: ({ gameKey }) => shinySprite(gameKey, 422), },
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0422-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0422-e"), },
			],
		},
		{
			id: 89, natiId: 423, name: "Gastrodon", img: ({ gameKey }) => baseSprite(gameKey, 423), imgS: ({ gameKey }) => shinySprite(gameKey, 423), tags: ["other"], forms: [
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, 423), imgS: ({ gameKey }) => shinySprite(gameKey, 423), },
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0423-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0423-e"), },
			],
		},
		{
			id: 90, natiId: 369, name: "Relicanth", img: ({ gameKey }) => baseSprite(gameKey, 369), imgS: ({ gameKey }) => shinySprite(gameKey, 369), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 369), imgS: ({ gameKey }) => shinySprite(gameKey, 369), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0369-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0369-f"), },
			],
		},
		{ id: 91, natiId: 781, name: "Dhelmise", img: ({ gameKey }) => baseSprite(gameKey, 781), imgS: ({ gameKey }) => shinySprite(gameKey, 781), },
		{ id: 92, natiId: 318, name: "Carvanha", img: ({ gameKey }) => baseSprite(gameKey, 318), imgS: ({ gameKey }) => shinySprite(gameKey, 318), },
		{ id: 93, natiId: 319, name: "Sharpedo", img: ({ gameKey }) => baseSprite(gameKey, 319), imgS: ({ gameKey }) => shinySprite(gameKey, 319), },
		{ id: 94, natiId: 690, name: "Skrelp", img: ({ gameKey }) => baseSprite(gameKey, 690), imgS: ({ gameKey }) => shinySprite(gameKey, 690), },
		{ id: 95, natiId: 691, name: "Dragalge", img: ({ gameKey }) => baseSprite(gameKey, 691), imgS: ({ gameKey }) => shinySprite(gameKey, 691), },
		{ id: 96, natiId: 692, name: "Clauncher", img: ({ gameKey }) => baseSprite(gameKey, 692), imgS: ({ gameKey }) => shinySprite(gameKey, 692), },
		{ id: 97, natiId: 693, name: "Clawitzer", img: ({ gameKey }) => baseSprite(gameKey, 693), imgS: ({ gameKey }) => shinySprite(gameKey, 693), },
		{ id: 98, natiId: 320, name: "Wailmer", img: ({ gameKey }) => baseSprite(gameKey, 320), imgS: ({ gameKey }) => shinySprite(gameKey, 320), },
		{ id: 99, natiId: 321, name: "Wailord", img: ({ gameKey }) => baseSprite(gameKey, 321), imgS: ({ gameKey }) => shinySprite(gameKey, 321), },
		{ id: 100, natiId: 131, name: "Lapras", img: ({ gameKey }) => baseSprite(gameKey, 131), imgS: ({ gameKey }) => shinySprite(gameKey, 131), },
		{ id: 101, natiId: 357, name: "Tropius", img: ({ gameKey }) => baseSprite(gameKey, 357), imgS: ({ gameKey }) => shinySprite(gameKey, 357), },
		{ id: 102, natiId: 102, name: "Exeggcute", img: ({ gameKey }) => baseSprite(gameKey, 102), imgS: ({ gameKey }) => shinySprite(gameKey, 102), },
		{
			id: 103, natiId: 103, name: "Exeggutor", img: ({ gameKey }) => baseSprite(gameKey, 103), imgS: ({ gameKey }) => shinySprite(gameKey, 103), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 103), imgS: ({ gameKey }) => shinySprite(gameKey, 103), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0103-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0103-a"), tags: ["alolan"], },
			],
		},
		{ id: 104, natiId: 341, name: "Corphish", img: ({ gameKey }) => baseSprite(gameKey, 341), imgS: ({ gameKey }) => shinySprite(gameKey, 341), },
		{ id: 105, natiId: 342, name: "Crawdaunt", img: ({ gameKey }) => baseSprite(gameKey, 342), imgS: ({ gameKey }) => shinySprite(gameKey, 342), },
		{ id: 106, natiId: 619, name: "Mienfoo", img: ({ gameKey }) => baseSprite(gameKey, 619), imgS: ({ gameKey }) => shinySprite(gameKey, 619), },
		{ id: 107, natiId: 620, name: "Mienshao", img: ({ gameKey }) => baseSprite(gameKey, 620), imgS: ({ gameKey }) => shinySprite(gameKey, 620), },
		{ id: 108, natiId: 782, name: "Jangmo-o", img: ({ gameKey }) => baseSprite(gameKey, 782), imgS: ({ gameKey }) => shinySprite(gameKey, 782), tags: ["pseudo"], },
		{ id: 109, natiId: 783, name: "Hakamo-o", img: ({ gameKey }) => baseSprite(gameKey, 783), imgS: ({ gameKey }) => shinySprite(gameKey, 783), tags: ["pseudo"], },
		{ id: 110, natiId: 784, name: "Kommo-o", img: ({ gameKey }) => baseSprite(gameKey, 784), imgS: ({ gameKey }) => shinySprite(gameKey, 784), tags: ["pseudo", "zcrystal"], },
		{ id: 111, natiId: 587, name: "Emolga", img: ({ gameKey }) => baseSprite(gameKey, 587), imgS: ({ gameKey }) => shinySprite(gameKey, 587), },
		{
			id: 112, natiId: 123, name: "Scyther", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0123-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0123-f"), },
			],
		},
		{
			id: 113, natiId: 212, name: "Scizor", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0212-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0212-f"), },
			],
		},
		{
			id: 114, natiId: 214, name: "Heracross", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0214-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0214-f"), },
			],
		},
		{
			id: 115, natiId: 190, name: "Aipom", img: ({ gameKey }) => baseSprite(gameKey, 190), imgS: ({ gameKey }) => shinySprite(gameKey, 190), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 190), imgS: ({ gameKey }) => shinySprite(gameKey, 190), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0190-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0190-f"), },
			],
		},
		{
			id: 116, natiId: 424, name: "Ambipom", img: ({ gameKey }) => baseSprite(gameKey, 424), imgS: ({ gameKey }) => shinySprite(gameKey, 424), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 424), imgS: ({ gameKey }) => shinySprite(gameKey, 424), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0424-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0424-f"), },
			],
		},
		{ id: 117, natiId: 667, name: "Litleo", img: ({ gameKey }) => baseSprite(gameKey, 667), imgS: ({ gameKey }) => shinySprite(gameKey, 667), },
		{
			id: 118, natiId: 668, name: "Pyroar", img: ({ gameKey }) => baseSprite(gameKey, 668), imgS: ({ gameKey }) => shinySprite(gameKey, 668), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 668), imgS: ({ gameKey }) => shinySprite(gameKey, 668), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0668-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0668-f"), },
			],
		},
		{ id: 119, natiId: 200, name: "Misdreavus", img: ({ gameKey }) => baseSprite(gameKey, 200), imgS: ({ gameKey }) => shinySprite(gameKey, 200), },
		{ id: 120, natiId: 429, name: "Mismagius", img: ({ gameKey }) => baseSprite(gameKey, 429), imgS: ({ gameKey }) => shinySprite(gameKey, 429), },
		{ id: 121, natiId: 621, name: "Druddigon", img: ({ gameKey }) => baseSprite(gameKey, 621), imgS: ({ gameKey }) => shinySprite(gameKey, 621), },
		{ id: 122, natiId: 108, name: "Lickitung", img: ({ gameKey }) => baseSprite(gameKey, 108), imgS: ({ gameKey }) => shinySprite(gameKey, 108), },
		{ id: 123, natiId: 463, name: "Lickilicky", img: ({ gameKey }) => baseSprite(gameKey, 463), imgS: ({ gameKey }) => shinySprite(gameKey, 463), },
		{ id: 124, natiId: 447, name: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447), imgS: ({ gameKey }) => shinySprite(gameKey, 447), },
		{ id: 125, natiId: 448, name: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), imgS: ({ gameKey }) => shinySprite(gameKey, 448), tags: ["mega"], },
		{ id: 126, natiId: 147, name: "Dratini", img: ({ gameKey }) => baseSprite(gameKey, 147), imgS: ({ gameKey }) => shinySprite(gameKey, 147), tags: ["pseudo"], },
		{ id: 127, natiId: 148, name: "Dragonair", img: ({ gameKey }) => baseSprite(gameKey, 148), imgS: ({ gameKey }) => shinySprite(gameKey, 148), tags: ["pseudo"], },
		{ id: 128, natiId: 149, name: "Dragonite", img: ({ gameKey }) => baseSprite(gameKey, 149), imgS: ({ gameKey }) => shinySprite(gameKey, 149), tags: ["pseudo"], },
		{ id: 129, natiId: 142, name: "Aerodactyl", img: ({ gameKey }) => baseSprite(gameKey, 142), imgS: ({ gameKey }) => shinySprite(gameKey, 142), tags: ["fossil", "mega"], },
		{ id: 130, natiId: 788, name: "Tapu Fini", img: ({ gameKey }) => baseSprite(gameKey, 788), imgS: ({ gameKey }) => shinySprite(gameKey, 788), tags: ["zcrystal", "legendary"], }
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();