import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 7;
	const GAME_KEYS = ["sun-poni", "moon-poni"];
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
			id: 6, natiId: 19, name: "Rattata", img: ({ gameKey }) => baseSprite(gameKey, "0019-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0019-a"), tags: ["gender"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 19), imgS: ({ gameKey }) => shinySprite(gameKey, 19), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0019-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0019-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0019-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0019-a"), tags: ["alolan"], },
			],
		},
		{
			id: 7, natiId: 20, name: "Raticate", img: ({ gameKey }) => baseSprite(gameKey, "020-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "020-a"), tags: ["gender"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 20), imgS: ({ gameKey }) => shinySprite(gameKey, 20), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0020-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0020-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-a"), tags: ["alolan"], },
			],
		},
		{ id: 8, natiId: 440, name: "Happiny", img: ({ gameKey }) => baseSprite(gameKey, 440), imgS: ({ gameKey }) => shinySprite(gameKey, 440), },
		{ id: 9, natiId: 113, name: "Chansey", img: ({ gameKey }) => baseSprite(gameKey, 113), imgS: ({ gameKey }) => shinySprite(gameKey, 113), },
		{ id: 10, natiId: 242, name: "Blissey", img: ({ gameKey }) => baseSprite(gameKey, 242), imgS: ({ gameKey }) => shinySprite(gameKey, 242), },
		{ id: 11, natiId: 278, name: "Wingull", img: ({ gameKey }) => baseSprite(gameKey, 278), imgS: ({ gameKey }) => shinySprite(gameKey, 278), },
		{ id: 12, natiId: 279, name: "Pelipper", img: ({ gameKey }) => baseSprite(gameKey, 279), imgS: ({ gameKey }) => shinySprite(gameKey, 279), },
		{ id: 13, natiId: 96, name: "Drowzee", img: ({ gameKey }) => baseSprite(gameKey, 96), imgS: ({ gameKey }) => shinySprite(gameKey, 96), },
		{
			id: 14, natiId: 97, name: "Hypno", img: ({ gameKey }) => baseSprite(gameKey, 97), imgS: ({ gameKey }) => shinySprite(gameKey, 97), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 97), imgS: ({ gameKey }) => shinySprite(gameKey, 97), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0097-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0097-f"), },
			],
		},
		{ id: 15, natiId: 296, name: "Makuhita", img: ({ gameKey }) => baseSprite(gameKey, 296), imgS: ({ gameKey }) => shinySprite(gameKey, 296), },
		{ id: 16, natiId: 297, name: "Hariyama", img: ({ gameKey }) => baseSprite(gameKey, 297), imgS: ({ gameKey }) => shinySprite(gameKey, 297), },
		{ id: 17, natiId: 739, name: "Crabrawler", img: ({ gameKey }) => baseSprite(gameKey, 739), imgS: ({ gameKey }) => shinySprite(gameKey, 739), },
		{ id: 18, natiId: 740, name: "Crabominable", img: ({ gameKey }) => baseSprite(gameKey, 740), imgS: ({ gameKey }) => shinySprite(gameKey, 740), },
		{
			id: 19, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), },
			],
		},
		{
			id: 20, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), },
			],
		},
		{ id: 21, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169), },
		{
			id: 22, natiId: 50, name: "Diglett", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0050-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0050-a"), tags: ["alolan"], },
			],
		},
		{
			id: 23, natiId: 51, name: "Dugtrio", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0051-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0051-a"), tags: ["alolan"], },
			],
		},
		{ id: 24, natiId: 21, name: "Spearow", img: ({ gameKey }) => baseSprite(gameKey, 21), imgS: ({ gameKey }) => shinySprite(gameKey, 21), },
		{ id: 25, natiId: 22, name: "Fearow", img: ({ gameKey }) => baseSprite(gameKey, 22), imgS: ({ gameKey }) => shinySprite(gameKey, 22), },
		{ id: 26, natiId: 627, name: "Rufflet", img: ({ gameKey }) => baseSprite(gameKey, 627), imgS: ({ gameKey }) => shinySprite(gameKey, 627), },
		{ id: 27, natiId: 628, name: "Braviary", img: ({ gameKey }) => baseSprite(gameKey, 628), imgS: ({ gameKey }) => shinySprite(gameKey, 628), },
		{ id: 28, natiId: 629, name: "Vullaby", img: ({ gameKey }) => baseSprite(gameKey, 629), imgS: ({ gameKey }) => shinySprite(gameKey, 629), },
		{ id: 29, natiId: 630, name: "Mandibuzz", img: ({ gameKey }) => baseSprite(gameKey, 630), imgS: ({ gameKey }) => shinySprite(gameKey, 630), },
		{ id: 30, natiId: 56, name: "Mankey", img: ({ gameKey }) => baseSprite(gameKey, 56), imgS: ({ gameKey }) => shinySprite(gameKey, 56), },
		{ id: 31, natiId: 57, name: "Primeape", img: ({ gameKey }) => baseSprite(gameKey, 57), imgS: ({ gameKey }) => shinySprite(gameKey, 57), },
		{
			id: 32, natiId: 741, name: "Oricorio", img: ({ gameKey }) => baseSprite(gameKey, "0741-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-s"), tags: ["other"], forms: [
				{ name: "Baile Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-b"), },
				{ name: "Pa'u Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-p"), },
				{ name: "Pom-Pom Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-p"), },
				{ name: "Sensu Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-s"), },
			],
		},
		{ id: 33, natiId: 742, name: "Cutiefly", img: ({ gameKey }) => baseSprite(gameKey, 742), imgS: ({ gameKey }) => shinySprite(gameKey, 742), },
		{ id: 34, natiId: 743, name: "Ribombee", img: ({ gameKey }) => baseSprite(gameKey, 743), imgS: ({ gameKey }) => shinySprite(gameKey, 743), },
		{ id: 35, natiId: 548, name: "Petilil", img: ({ gameKey }) => baseSprite(gameKey, 548), imgS: ({ gameKey }) => shinySprite(gameKey, 548), },
		{ id: 36, natiId: 549, name: "Lilligant", img: ({ gameKey }) => baseSprite(gameKey, 549), imgS: ({ gameKey }) => shinySprite(gameKey, 549), },
		{ id: 37, natiId: 546, name: "Cottonee", img: ({ gameKey }) => baseSprite(gameKey, 546), imgS: ({ gameKey }) => shinySprite(gameKey, 546), },
		{ id: 38, natiId: 547, name: "Whimsicott", img: ({ gameKey }) => baseSprite(gameKey, 547), imgS: ({ gameKey }) => shinySprite(gameKey, 547), },
		{ id: 39, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54), },
		{ id: 40, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55), },
		{
			id: 41, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), },
			],
		},
		{
			id: 42, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },
			],
		},
		{ id: 43, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339), },
		{ id: 44, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340), },
		{ id: 45, natiId: 66, name: "Machop", img: ({ gameKey }) => baseSprite(gameKey, 66), imgS: ({ gameKey }) => shinySprite(gameKey, 66), },
		{ id: 46, natiId: 67, name: "Machoke", img: ({ gameKey }) => baseSprite(gameKey, 67), imgS: ({ gameKey }) => shinySprite(gameKey, 67), },
		{ id: 47, natiId: 68, name: "Machamp", img: ({ gameKey }) => baseSprite(gameKey, 68), imgS: ({ gameKey }) => shinySprite(gameKey, 68), },
		{ id: 48, natiId: 524, name: "Roggenrola", img: ({ gameKey }) => baseSprite(gameKey, 524), imgS: ({ gameKey }) => shinySprite(gameKey, 524), },
		{ id: 49, natiId: 525, name: "Boldore", img: ({ gameKey }) => baseSprite(gameKey, 525), imgS: ({ gameKey }) => shinySprite(gameKey, 525), },
		{ id: 50, natiId: 526, name: "Gigalith", img: ({ gameKey }) => baseSprite(gameKey, 526), imgS: ({ gameKey }) => shinySprite(gameKey, 526), },
		{ id: 51, natiId: 703, name: "Carbink", img: ({ gameKey }) => baseSprite(gameKey, 703), imgS: ({ gameKey }) => shinySprite(gameKey, 703), },
		{ id: 52, natiId: 302, name: "Sableye", img: ({ gameKey }) => baseSprite(gameKey, 302), imgS: ({ gameKey }) => shinySprite(gameKey, 302), },
		{ id: 53, natiId: 744, name: "Rockruff", img: ({ gameKey }) => baseSprite(gameKey, 744), imgS: ({ gameKey }) => shinySprite(gameKey, 744), },
		{
			id: 54, natiId: 745, name: "Lycanroc", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), tags: ["other"], forms: [
				{ name: "Midday", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), },
				{ name: "Midnight", img: ({ gameKey }) => baseSprite(gameKey, "0745-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-m"), },
				{ name: "Dusk", img: ({ gameKey }) => baseSprite(gameKey, "0745-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-d"), },
			],
		},
		{ id: 55, natiId: 72, name: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72), imgS: ({ gameKey }) => shinySprite(gameKey, 72), },
		{ id: 56, natiId: 73, name: "Tentacruel", img: ({ gameKey }) => baseSprite(gameKey, 73), imgS: ({ gameKey }) => shinySprite(gameKey, 73), },
		{
			id: 57, natiId: 456, name: "Finneon", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0456-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0456-f"), },
			],
		},
		{
			id: 58, natiId: 457, name: "Lumineon", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0457-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0457-f"), },
			],
		},
		{ id: 59, natiId: 749, name: "Mudbray", img: ({ gameKey }) => baseSprite(gameKey, 749), imgS: ({ gameKey }) => shinySprite(gameKey, 749), },
		{ id: 60, natiId: 750, name: "Mudsdale", img: ({ gameKey }) => baseSprite(gameKey, 750), imgS: ({ gameKey }) => shinySprite(gameKey, 750), },
		{ id: 61, natiId: 128, name: "Tauros", img: ({ gameKey }) => baseSprite(gameKey, 128), imgS: ({ gameKey }) => shinySprite(gameKey, 128), },
		{ id: 62, natiId: 241, name: "Miltank", img: ({ gameKey }) => baseSprite(gameKey, 241), imgS: ({ gameKey }) => shinySprite(gameKey, 241), },
		{ id: 63, natiId: 759, name: "Stufful", img: ({ gameKey }) => baseSprite(gameKey, 759), imgS: ({ gameKey }) => shinySprite(gameKey, 759), },
		{ id: 64, natiId: 760, name: "Bewear", img: ({ gameKey }) => baseSprite(gameKey, 760), imgS: ({ gameKey }) => shinySprite(gameKey, 760), },
		{ id: 65, natiId: 127, name: "Pinsir", img: ({ gameKey }) => baseSprite(gameKey, 127), imgS: ({ gameKey }) => shinySprite(gameKey, 127), tags: ["mega"], },
		{ id: 66, natiId: 704, name: "Goomy", img: ({ gameKey }) => baseSprite(gameKey, 704), imgS: ({ gameKey }) => shinySprite(gameKey, 704), tags: ["pseudo"], },
		{ id: 67, natiId: 705, name: "Sliggoo", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), tags: ["pseudo"], },
		{ id: 68, natiId: 706, name: "Goodra", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), tags: ["pseudo"], },
		{
			id: 69, natiId: 351, name: "Castform", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), tags: ["other"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), },
				{ name: "Rainy", img: ({ gameKey }) => baseSprite(gameKey, "0351-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-r"), },
				{ name: "Snowy", img: ({ gameKey }) => baseSprite(gameKey, "0351-i"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-i"), },
				{ name: "Sunny", img: ({ gameKey }) => baseSprite(gameKey, "0351-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-s"), },
			],
		},
		{ id: 70, natiId: 767, name: "Wimpod", img: ({ gameKey }) => baseSprite(gameKey, 767), imgS: ({ gameKey }) => shinySprite(gameKey, 767), },
		{ id: 71, natiId: 768, name: "Golisopod", img: ({ gameKey }) => baseSprite(gameKey, 768), imgS: ({ gameKey }) => shinySprite(gameKey, 768), },
		{ id: 72, natiId: 227, name: "Skarmory", img: ({ gameKey }) => baseSprite(gameKey, 227), imgS: ({ gameKey }) => shinySprite(gameKey, 227), },
		{ id: 73, natiId: 209, name: "Snubbull", img: ({ gameKey }) => baseSprite(gameKey, 209), imgS: ({ gameKey }) => shinySprite(gameKey, 209), },
		{ id: 74, natiId: 210, name: "Granbull", img: ({ gameKey }) => baseSprite(gameKey, 210), imgS: ({ gameKey }) => shinySprite(gameKey, 210), },
		{
			id: 75, natiId: 422, name: "Shellos", img: ({ gameKey }) => baseSprite(gameKey, 422), imgS: ({ gameKey }) => shinySprite(gameKey, 422), tags: ["other"], forms: [
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, 422), imgS: ({ gameKey }) => shinySprite(gameKey, 422), },
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0422-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0422-e"), },
			],
		},
		{
			id: 76, natiId: 423, name: "Gastrodon", img: ({ gameKey }) => baseSprite(gameKey, 423), imgS: ({ gameKey }) => shinySprite(gameKey, 423), tags: ["other"], forms: [
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, 423), imgS: ({ gameKey }) => shinySprite(gameKey, 423), },
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0423-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0423-e"), },
			],
		},
		{
			id: 77, natiId: 369, name: "Relicanth", img: ({ gameKey }) => baseSprite(gameKey, 369), imgS: ({ gameKey }) => shinySprite(gameKey, 369), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 369), imgS: ({ gameKey }) => shinySprite(gameKey, 369), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0369-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0369-f"), },
			],
		},
		{ id: 78, natiId: 781, name: "Dhelmise", img: ({ gameKey }) => baseSprite(gameKey, 781), imgS: ({ gameKey }) => shinySprite(gameKey, 781), },
		{ id: 79, natiId: 318, name: "Carvanha", img: ({ gameKey }) => baseSprite(gameKey, 318), imgS: ({ gameKey }) => shinySprite(gameKey, 318), },
		{ id: 80, natiId: 319, name: "Sharpedo", img: ({ gameKey }) => baseSprite(gameKey, 319), imgS: ({ gameKey }) => shinySprite(gameKey, 319), tags: ["mega"], },
		{ id: 81, natiId: 320, name: "Wailmer", img: ({ gameKey }) => baseSprite(gameKey, 320), imgS: ({ gameKey }) => shinySprite(gameKey, 320), },
		{ id: 82, natiId: 321, name: "Wailord", img: ({ gameKey }) => baseSprite(gameKey, 321), imgS: ({ gameKey }) => shinySprite(gameKey, 321), },
		{ id: 83, natiId: 131, name: "Lapras", img: ({ gameKey }) => baseSprite(gameKey, 131), imgS: ({ gameKey }) => shinySprite(gameKey, 131), },
		{ id: 84, natiId: 102, name: "Exeggcute", img: ({ gameKey }) => baseSprite(gameKey, 102), imgS: ({ gameKey }) => shinySprite(gameKey, 102), },
		{
			id: 85, natiId: 103, name: "Exeggutor", img: ({ gameKey }) => baseSprite(gameKey, "0103-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0103-a"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 103), imgS: ({ gameKey }) => shinySprite(gameKey, 103), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0103-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0103-a"), tags: ["alolan"], },
			],
		},
		{ id: 86, natiId: 782, name: "Jangmo-o", img: ({ gameKey }) => baseSprite(gameKey, 782), imgS: ({ gameKey }) => shinySprite(gameKey, 782), tags: ["pseudo"], },
		{ id: 87, natiId: 783, name: "Hakamo-o", img: ({ gameKey }) => baseSprite(gameKey, 783), imgS: ({ gameKey }) => shinySprite(gameKey, 783), tags: ["pseudo"], },
		{ id: 88, natiId: 784, name: "Kommo-o", img: ({ gameKey }) => baseSprite(gameKey, 784), imgS: ({ gameKey }) => shinySprite(gameKey, 784), tags: ["pseudo"], },
		{ id: 89, natiId: 587, name: "Emolga", img: ({ gameKey }) => baseSprite(gameKey, 587), imgS: ({ gameKey }) => shinySprite(gameKey, 587), },
		{
			id: 90, natiId: 123, name: "Scyther", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0123-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0123-f"), },
			],
		},
		{
			id: 91, natiId: 212, name: "Scizor", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0212-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0212-f"), },
			],
		},
		{
			id: 92, natiId: 198, name: "Murkrow", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0198-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0198-f"), },
			],
		},
		{ id: 93, natiId: 430, name: "Honchkrow", img: ({ gameKey }) => baseSprite(gameKey, 430), imgS: ({ gameKey }) => shinySprite(gameKey, 430), },
		{ id: 94, natiId: 447, name: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447), imgS: ({ gameKey }) => shinySprite(gameKey, 447), },
		{ id: 95, natiId: 448, name: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), imgS: ({ gameKey }) => shinySprite(gameKey, 448), tags: ["mega"], },
		{ id: 96, natiId: 147, name: "Dratini", img: ({ gameKey }) => baseSprite(gameKey, 147), imgS: ({ gameKey }) => shinySprite(gameKey, 147), tags: ["pseudo"], },
		{ id: 97, natiId: 148, name: "Dragonair", img: ({ gameKey }) => baseSprite(gameKey, 148), imgS: ({ gameKey }) => shinySprite(gameKey, 148), tags: ["pseudo"], },
		{ id: 98, natiId: 149, name: "Dragonite", img: ({ gameKey }) => baseSprite(gameKey, 149), imgS: ({ gameKey }) => shinySprite(gameKey, 149), tags: ["pseudo"], },
		{ id: 99, natiId: 142, name: "Aerodactyl", img: ({ gameKey }) => baseSprite(gameKey, 142), imgS: ({ gameKey }) => shinySprite(gameKey, 142), tags: ["fossil", "mega"], },
		{ id: 100, natiId: 788, name: "Tapu Fini", img: ({ gameKey }) => baseSprite(gameKey, 788), imgS: ({ gameKey }) => shinySprite(gameKey, 788), tags: ["zcrystal", "legendary"], }
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();