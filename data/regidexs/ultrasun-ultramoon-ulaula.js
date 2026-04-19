import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 7;
	const GAME_KEYS = ["ultrasun-ulaula", "ultramoon-ulaula"];
	const SUB = "";
	const DEX_NAME = "Ulaula Dex";

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
			id: 7, natiId: 20, name: "Raticate", img: ({ gameKey }) => baseSprite(gameKey, "0020-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-a"), tags: ["gender"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 20), imgS: ({ gameKey }) => shinySprite(gameKey, 20), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0020-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0020-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-a"), tags: ["alolan"], },
			],
		},
		{
			id: 8, natiId: 165, name: "Ledyba", img: ({ gameKey }) => baseSprite(gameKey, 165), imgS: ({ gameKey }) => shinySprite(gameKey, 165), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 165), imgS: ({ gameKey }) => shinySprite(gameKey, 165), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0165-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0165-f"), },
			],
		},
		{
			id: 9, natiId: 166, name: "Ledian", img: ({ gameKey }) => baseSprite(gameKey, 166), imgS: ({ gameKey }) => shinySprite(gameKey, 166), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 166), imgS: ({ gameKey }) => shinySprite(gameKey, 166), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0166-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0166-f"), },
			],
		},
		{ id: 10, natiId: 167, name: "Spinarak", img: ({ gameKey }) => baseSprite(gameKey, 167), imgS: ({ gameKey }) => shinySprite(gameKey, 167), },
		{ id: 11, natiId: 168, name: "Ariados", img: ({ gameKey }) => baseSprite(gameKey, 168), imgS: ({ gameKey }) => shinySprite(gameKey, 168), },
		{ id: 12, natiId: 736, name: "Grubbin", img: ({ gameKey }) => baseSprite(gameKey, 736), imgS: ({ gameKey }) => shinySprite(gameKey, 736), },
		{ id: 13, natiId: 737, name: "Charjabug", img: ({ gameKey }) => baseSprite(gameKey, 737), imgS: ({ gameKey }) => shinySprite(gameKey, 737), },
		{ id: 14, natiId: 738, name: "Vikavolt", img: ({ gameKey }) => baseSprite(gameKey, 738), imgS: ({ gameKey }) => shinySprite(gameKey, 738), },
		{ id: 15, natiId: 440, name: "Happiny", img: ({ gameKey }) => baseSprite(gameKey, 440), imgS: ({ gameKey }) => shinySprite(gameKey, 440), },
		{ id: 16, natiId: 113, name: "Chansey", img: ({ gameKey }) => baseSprite(gameKey, 113), imgS: ({ gameKey }) => shinySprite(gameKey, 113), },
		{ id: 17, natiId: 242, name: "Blissey", img: ({ gameKey }) => baseSprite(gameKey, 242), imgS: ({ gameKey }) => shinySprite(gameKey, 242), },
		{ id: 18, natiId: 79, name: "Slowpoke", img: ({ gameKey }) => baseSprite(gameKey, 79), imgS: ({ gameKey }) => shinySprite(gameKey, 79), },
		{ id: 19, natiId: 80, name: "Slowbro", img: ({ gameKey }) => baseSprite(gameKey, 80), imgS: ({ gameKey }) => shinySprite(gameKey, 80), tags: ["mega"], },
		{ id: 20, natiId: 199, name: "Slowking", img: ({ gameKey }) => baseSprite(gameKey, 199), imgS: ({ gameKey }) => shinySprite(gameKey, 199), },
		{ id: 21, natiId: 278, name: "Wingull", img: ({ gameKey }) => baseSprite(gameKey, 278), imgS: ({ gameKey }) => shinySprite(gameKey, 278), },
		{ id: 22, natiId: 279, name: "Pelipper", img: ({ gameKey }) => baseSprite(gameKey, 279), imgS: ({ gameKey }) => shinySprite(gameKey, 279), },
		{
			id: 23, natiId: 52, name: "Meowth", img: ({ gameKey }) => baseSprite(gameKey, 52), imgS: ({ gameKey }) => shinySprite(gameKey, 52), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 52), imgS: ({ gameKey }) => shinySprite(gameKey, 52), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0052-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0052-a"), tags: ["alolan"], },
			],
		},
		{
			id: 24, natiId: 53, name: "Persian", img: ({ gameKey }) => baseSprite(gameKey, 53), imgS: ({ gameKey }) => shinySprite(gameKey, 53), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 53), imgS: ({ gameKey }) => shinySprite(gameKey, 53), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0053-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0053-a"), tags: ["alolan"], },
			],
		},
		{ id: 25, natiId: 81, name: "Magnemite", img: ({ gameKey }) => baseSprite(gameKey, 81), imgS: ({ gameKey }) => shinySprite(gameKey, 81), },
		{ id: 26, natiId: 82, name: "Magneton", img: ({ gameKey }) => baseSprite(gameKey, 82), imgS: ({ gameKey }) => shinySprite(gameKey, 82), },
		{ id: 27, natiId: 462, name: "Magnezone", img: ({ gameKey }) => baseSprite(gameKey, 462), imgS: ({ gameKey }) => shinySprite(gameKey, 462), },
		{
			id: 28, natiId: 88, name: "Grimer", img: ({ gameKey }) => baseSprite(gameKey, 88), imgS: ({ gameKey }) => shinySprite(gameKey, 88), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 88), imgS: ({ gameKey }) => shinySprite(gameKey, 88), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0088-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0088-a"), tags: ["alolan"], },
			],
		},
		{
			id: 29, natiId: 89, name: "Muk", img: ({ gameKey }) => baseSprite(gameKey, 89), imgS: ({ gameKey }) => shinySprite(gameKey, 89), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 89), imgS: ({ gameKey }) => shinySprite(gameKey, 89), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0089-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0089-a"), tags: ["alolan"], },
			],
		},
		{ id: 30, natiId: 739, name: "Crabrawler", img: ({ gameKey }) => baseSprite(gameKey, 739), imgS: ({ gameKey }) => shinySprite(gameKey, 739), },
		{ id: 31, natiId: 740, name: "Crabominable", img: ({ gameKey }) => baseSprite(gameKey, 740), imgS: ({ gameKey }) => shinySprite(gameKey, 740), },
		{ id: 32, natiId: 92, name: "Gastly", img: ({ gameKey }) => baseSprite(gameKey, 92), imgS: ({ gameKey }) => shinySprite(gameKey, 92), },
		{ id: 33, natiId: 93, name: "Haunter", img: ({ gameKey }) => baseSprite(gameKey, 93), imgS: ({ gameKey }) => shinySprite(gameKey, 93), },
		{ id: 34, natiId: 94, name: "Gengar", img: ({ gameKey }) => baseSprite(gameKey, 94), imgS: ({ gameKey }) => shinySprite(gameKey, 94), tags: ["mega"], },
		{
			id: 35, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), },
			],
		},
		{
			id: 36, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), },
			],
		},
		{ id: 37, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169), },
		{
			id: 38, natiId: 50, name: "Diglett", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0050-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0050-a"), tags: ["alolan"], },
			],
		},
		{
			id: 39, natiId: 51, name: "Dugtrio", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0051-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0051-a"), tags: ["alolan"], },
			],
		},
		{ id: 40, natiId: 21, name: "Spearow", img: ({ gameKey }) => baseSprite(gameKey, 21), imgS: ({ gameKey }) => shinySprite(gameKey, 21), },
		{ id: 41, natiId: 22, name: "Fearow", img: ({ gameKey }) => baseSprite(gameKey, 22), imgS: ({ gameKey }) => shinySprite(gameKey, 22), },
		{
			id: 42, natiId: 741, name: "Oricorio", img: ({ gameKey }) => baseSprite(gameKey, 741), imgS: ({ gameKey }) => shinySprite(gameKey, 741), tags: ["other"], forms: [
				{ name: "Baile Style", img: ({ gameKey }) => baseSprite(gameKey, 741), imgS: ({ gameKey }) => shinySprite(gameKey, 741), },
				{ name: "Pa'u Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-pa"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-pa"), },
				{ name: "Pom-Pom Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-po"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-po"), },
				{ name: "Sensu Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-s"), },
			],
		},
		{ id: 43, natiId: 742, name: "Cutiefly", img: ({ gameKey }) => baseSprite(gameKey, 742), imgS: ({ gameKey }) => shinySprite(gameKey, 742), },
		{ id: 44, natiId: 743, name: "Ribombee", img: ({ gameKey }) => baseSprite(gameKey, 743), imgS: ({ gameKey }) => shinySprite(gameKey, 743), },
		{
			id: 45, natiId: 669, name: "Flabébé", img: ({ gameKey }) => baseSprite(gameKey, 669), imgS: ({ gameKey }) => shinySprite(gameKey, 669), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 669), imgS: ({ gameKey }) => shinySprite(gameKey, 669), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-w"), },
			],
		},
		{
			id: 46, natiId: 670, name: "Floette", img: ({ gameKey }) => baseSprite(gameKey, 670), imgS: ({ gameKey }) => shinySprite(gameKey, 670), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 670), imgS: ({ gameKey }) => shinySprite(gameKey, 670), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-w"), },
			],
		},
		{
			id: 47, natiId: 671, name: "Florges", img: ({ gameKey }) => baseSprite(gameKey, 671), imgS: ({ gameKey }) => shinySprite(gameKey, 671), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 671), imgS: ({ gameKey }) => shinySprite(gameKey, 671), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-w"), },
			],
		},
		{ id: 48, natiId: 548, name: "Petilil", img: ({ gameKey }) => baseSprite(gameKey, 548), imgS: ({ gameKey }) => shinySprite(gameKey, 548), },
		{ id: 49, natiId: 549, name: "Lilligant", img: ({ gameKey }) => baseSprite(gameKey, 549), imgS: ({ gameKey }) => shinySprite(gameKey, 549), },
		{ id: 50, natiId: 546, name: "Cottonee", img: ({ gameKey }) => baseSprite(gameKey, 546), imgS: ({ gameKey }) => shinySprite(gameKey, 546), },
		{ id: 51, natiId: 547, name: "Whimsicott", img: ({ gameKey }) => baseSprite(gameKey, 547), imgS: ({ gameKey }) => shinySprite(gameKey, 547), },
		{ id: 52, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54), },
		{ id: 53, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55), },
		{
			id: 54, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), },
			],
		},
		{
			id: 55, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },
			],
		},
		{ id: 56, natiId: 72, name: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72), imgS: ({ gameKey }) => shinySprite(gameKey, 72), },
		{ id: 57, natiId: 73, name: "Tentacruel", img: ({ gameKey }) => baseSprite(gameKey, 73), imgS: ({ gameKey }) => shinySprite(gameKey, 73), },
		{
			id: 58, natiId: 456, name: "Finneon", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0456-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0456-f"), },
			],
		},
		{
			id: 59, natiId: 457, name: "Lumineon", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0457-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0457-f"), },
			],
		},
		{ id: 60, natiId: 746, name: "Wishiwashi", img: ({ gameKey }) => baseSprite(gameKey, 746), imgS: ({ gameKey }) => shinySprite(gameKey, 746), },
		{ id: 61, natiId: 366, name: "Clamperl", img: ({ gameKey }) => baseSprite(gameKey, 366), imgS: ({ gameKey }) => shinySprite(gameKey, 366), },
		{ id: 62, natiId: 367, name: "Huntail", img: ({ gameKey }) => baseSprite(gameKey, 367), imgS: ({ gameKey }) => shinySprite(gameKey, 367), },
		{ id: 63, natiId: 368, name: "Gorebyss", img: ({ gameKey }) => baseSprite(gameKey, 368), imgS: ({ gameKey }) => shinySprite(gameKey, 368), },
		{ id: 64, natiId: 749, name: "Mudbray", img: ({ gameKey }) => baseSprite(gameKey, 749), imgS: ({ gameKey }) => shinySprite(gameKey, 749), },
		{ id: 65, natiId: 750, name: "Mudsdale", img: ({ gameKey }) => baseSprite(gameKey, 750), imgS: ({ gameKey }) => shinySprite(gameKey, 750), },
		{ id: 66, natiId: 283, name: "Surskit", img: ({ gameKey }) => baseSprite(gameKey, 283), imgS: ({ gameKey }) => shinySprite(gameKey, 283), },
		{ id: 67, natiId: 284, name: "Masquerain", img: ({ gameKey }) => baseSprite(gameKey, 284), imgS: ({ gameKey }) => shinySprite(gameKey, 284), },
		{ id: 68, natiId: 751, name: "Dewpider", img: ({ gameKey }) => baseSprite(gameKey, 751), imgS: ({ gameKey }) => shinySprite(gameKey, 751), },
		{ id: 69, natiId: 752, name: "Araquanid", img: ({ gameKey }) => baseSprite(gameKey, 752), imgS: ({ gameKey }) => shinySprite(gameKey, 752), },
		{ id: 70, natiId: 755, name: "Morelull", img: ({ gameKey }) => baseSprite(gameKey, 755), imgS: ({ gameKey }) => shinySprite(gameKey, 755), },
		{ id: 71, natiId: 756, name: "Shiinotic", img: ({ gameKey }) => baseSprite(gameKey, 756), imgS: ({ gameKey }) => shinySprite(gameKey, 756), },
		{ id: 72, natiId: 46, name: "Paras", img: ({ gameKey }) => baseSprite(gameKey, 46), imgS: ({ gameKey }) => shinySprite(gameKey, 46), },
		{ id: 73, natiId: 47, name: "Parasect", img: ({ gameKey }) => baseSprite(gameKey, 47), imgS: ({ gameKey }) => shinySprite(gameKey, 47), },
		{ id: 74, natiId: 60, name: "Poliwag", img: ({ gameKey }) => baseSprite(gameKey, 60), imgS: ({ gameKey }) => shinySprite(gameKey, 60), },
		{ id: 75, natiId: 61, name: "Poliwhirl", img: ({ gameKey }) => baseSprite(gameKey, 61), imgS: ({ gameKey }) => shinySprite(gameKey, 61), },
		{ id: 76, natiId: 62, name: "Poliwrath", img: ({ gameKey }) => baseSprite(gameKey, 62), imgS: ({ gameKey }) => shinySprite(gameKey, 62), },
		{
			id: 77, natiId: 186, name: "Politoed", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0186-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0186-f"), },
			],
		},
		{
			id: 78, natiId: 118, name: "Goldeen", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0118-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0118-f"), },
			],
		},
		{
			id: 79, natiId: 119, name: "Seaking", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0119-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0119-f"), },
			],
		},
		{
			id: 80, natiId: 550, name: "Basculin", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), tags: ["other"], forms: [
				{ name: "Blue-Striped", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), },
				{ name: "Red-Striped", img: ({ gameKey }) => baseSprite(gameKey, "0550-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0550-r"), },
			],
		},
		{ id: 81, natiId: 704, name: "Goomy", img: ({ gameKey }) => baseSprite(gameKey, 704), imgS: ({ gameKey }) => shinySprite(gameKey, 704), tags: ["pseudo"], },
		{ id: 82, natiId: 705, name: "Sliggoo", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), tags: ["pseudo"], },
		{ id: 83, natiId: 706, name: "Goodra", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), tags: ["pseudo"], },
		{
			id: 84, natiId: 351, name: "Castform", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), tags: ["other"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), },
				{ name: "Rainy", img: ({ gameKey }) => baseSprite(gameKey, "0351-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-r"), },
				{ name: "Snowy", img: ({ gameKey }) => baseSprite(gameKey, "0351-i"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-i"), },
				{ name: "Sunny", img: ({ gameKey }) => baseSprite(gameKey, "0351-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-s"), },
			],
		},
		{ id: 85, natiId: 568, name: "Trubbish", img: ({ gameKey }) => baseSprite(gameKey, 568), imgS: ({ gameKey }) => shinySprite(gameKey, 568), },
		{ id: 86, natiId: 569, name: "Garbodor", img: ({ gameKey }) => baseSprite(gameKey, 569), imgS: ({ gameKey }) => shinySprite(gameKey, 569), },
		{ id: 87, natiId: 572, name: "Minccino", img: ({ gameKey }) => baseSprite(gameKey, 572), imgS: ({ gameKey }) => shinySprite(gameKey, 572), },
		{ id: 88, natiId: 573, name: "Cinccino", img: ({ gameKey }) => baseSprite(gameKey, 573), imgS: ({ gameKey }) => shinySprite(gameKey, 573), },
		{ id: 89, natiId: 204, name: "Pineco", img: ({ gameKey }) => baseSprite(gameKey, 204), imgS: ({ gameKey }) => shinySprite(gameKey, 204), },
		{ id: 90, natiId: 205, name: "Forretress", img: ({ gameKey }) => baseSprite(gameKey, 205), imgS: ({ gameKey }) => shinySprite(gameKey, 205), },
		{ id: 91, natiId: 227, name: "Skarmory", img: ({ gameKey }) => baseSprite(gameKey, 227), imgS: ({ gameKey }) => shinySprite(gameKey, 227), },
		{ id: 92, natiId: 132, name: "Ditto", img: ({ gameKey }) => baseSprite(gameKey, 132), imgS: ({ gameKey }) => shinySprite(gameKey, 132), },
		{ id: 93, natiId: 173, name: "Cleffa", img: ({ gameKey }) => baseSprite(gameKey, 173), imgS: ({ gameKey }) => shinySprite(gameKey, 173), },
		{ id: 94, natiId: 35, name: "Clefairy", img: ({ gameKey }) => baseSprite(gameKey, 35), imgS: ({ gameKey }) => shinySprite(gameKey, 35), },
		{ id: 95, natiId: 36, name: "Clefable", img: ({ gameKey }) => baseSprite(gameKey, 36), imgS: ({ gameKey }) => shinySprite(gameKey, 36), },
		{ id: 96, natiId: 605, name: "Elgyem", img: ({ gameKey }) => baseSprite(gameKey, 605), imgS: ({ gameKey }) => shinySprite(gameKey, 605), },
		{ id: 97, natiId: 606, name: "Beheeyem", img: ({ gameKey }) => baseSprite(gameKey, 606), imgS: ({ gameKey }) => shinySprite(gameKey, 606), },
		{
			id: 98, natiId: 774, name: "Minior", img: ({ gameKey }) => baseSprite(gameKey, 774), imgS: ({ gameKey }) => shinySprite(gameKey, 774), tags: ["other"], forms: [
				{ name: "Blue Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-b"), },
				{ name: "Green Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-g"), },
				{ name: "Indigo Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-i"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-i"), },
				{ name: "Orange Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-o"), },
				{ name: "Red Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-r"), },
				{ name: "Violet Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-v"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-v"), },
				{ name: "Yellow Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-y"), },
			],
		},
		{ id: 99, natiId: 374, name: "Beldum", img: ({ gameKey }) => baseSprite(gameKey, 374), imgS: ({ gameKey }) => shinySprite(gameKey, 374), tags: ["pseudo"], },
		{ id: 100, natiId: 375, name: "Metang", img: ({ gameKey }) => baseSprite(gameKey, 375), imgS: ({ gameKey }) => shinySprite(gameKey, 375), tags: ["pseudo"], },
		{ id: 101, natiId: 376, name: "Metagross", img: ({ gameKey }) => baseSprite(gameKey, 376), imgS: ({ gameKey }) => shinySprite(gameKey, 376), tags: ["pseudo", "mega"], },
		{ id: 102, natiId: 137, name: "Porygon", img: ({ gameKey }) => baseSprite(gameKey, 137), imgS: ({ gameKey }) => shinySprite(gameKey, 137), },
		{ id: 103, natiId: 233, name: "Porygon2", img: ({ gameKey }) => baseSprite(gameKey, 233), imgS: ({ gameKey }) => shinySprite(gameKey, 233), },
		{ id: 104, natiId: 474, name: "Porygon-Z", img: ({ gameKey }) => baseSprite(gameKey, 474), imgS: ({ gameKey }) => shinySprite(gameKey, 474), },
		{ id: 105, natiId: 674, name: "Pancham", img: ({ gameKey }) => baseSprite(gameKey, 674), imgS: ({ gameKey }) => shinySprite(gameKey, 674), },
		{ id: 106, natiId: 675, name: "Pangoro", img: ({ gameKey }) => baseSprite(gameKey, 675), imgS: ({ gameKey }) => shinySprite(gameKey, 675), },
		{ id: 107, natiId: 775, name: "Komala", img: ({ gameKey }) => baseSprite(gameKey, 775), imgS: ({ gameKey }) => shinySprite(gameKey, 775), },
		{ id: 108, natiId: 324, name: "Torkoal", img: ({ gameKey }) => baseSprite(gameKey, 324), imgS: ({ gameKey }) => shinySprite(gameKey, 324), },
		{ id: 109, natiId: 776, name: "Turtonator", img: ({ gameKey }) => baseSprite(gameKey, 776), imgS: ({ gameKey }) => shinySprite(gameKey, 776), },
		{ id: 110, natiId: 228, name: "Houndour", img: ({ gameKey }) => baseSprite(gameKey, 228), imgS: ({ gameKey }) => shinySprite(gameKey, 228), },
		{
			id: 111, natiId: 229, name: "Houndoom", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0229-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0229-f"), },
			],
		},
		{ id: 112, natiId: 702, name: "Dedenne", img: ({ gameKey }) => baseSprite(gameKey, 702), imgS: ({ gameKey }) => shinySprite(gameKey, 702), },
		{ id: 113, natiId: 777, name: "Togedemaru", img: ({ gameKey }) => baseSprite(gameKey, 777), imgS: ({ gameKey }) => shinySprite(gameKey, 777), },
		{ id: 114, natiId: 309, name: "Electrike", img: ({ gameKey }) => baseSprite(gameKey, 309), imgS: ({ gameKey }) => shinySprite(gameKey, 309), },
		{ id: 115, natiId: 310, name: "Manectric", img: ({ gameKey }) => baseSprite(gameKey, 310), imgS: ({ gameKey }) => shinySprite(gameKey, 310), },
		{ id: 116, natiId: 239, name: "Elekid", img: ({ gameKey }) => baseSprite(gameKey, 239), imgS: ({ gameKey }) => shinySprite(gameKey, 239), },
		{ id: 117, natiId: 125, name: "Electabuzz", img: ({ gameKey }) => baseSprite(gameKey, 125), imgS: ({ gameKey }) => shinySprite(gameKey, 125), },
		{ id: 118, natiId: 466, name: "Electivire", img: ({ gameKey }) => baseSprite(gameKey, 466), imgS: ({ gameKey }) => shinySprite(gameKey, 466), },
		{
			id: 119, natiId: 74, name: "Geodude", img: ({ gameKey }) => baseSprite(gameKey, 74), imgS: ({ gameKey }) => shinySprite(gameKey, 74), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 74), imgS: ({ gameKey }) => shinySprite(gameKey, 74), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0074-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0074-a"), tags: ["alolan"], },
			],
		},
		{
			id: 120, natiId: 75, name: "Graveler", img: ({ gameKey }) => baseSprite(gameKey, 75), imgS: ({ gameKey }) => shinySprite(gameKey, 75), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 75), imgS: ({ gameKey }) => shinySprite(gameKey, 75), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0075-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0075-a"), tags: ["alolan"], },
			],
		},
		{
			id: 121, natiId: 76, name: "Golem", img: ({ gameKey }) => baseSprite(gameKey, 76), imgS: ({ gameKey }) => shinySprite(gameKey, 76), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 76), imgS: ({ gameKey }) => shinySprite(gameKey, 76), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0076-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0076-a"), tags: ["alolan"], },
			],
		},
		{ id: 122, natiId: 551, name: "Sandile", img: ({ gameKey }) => baseSprite(gameKey, 551), imgS: ({ gameKey }) => shinySprite(gameKey, 551), },
		{ id: 123, natiId: 552, name: "Krokorok", img: ({ gameKey }) => baseSprite(gameKey, 552), imgS: ({ gameKey }) => shinySprite(gameKey, 552), },
		{ id: 124, natiId: 553, name: "Krookodile", img: ({ gameKey }) => baseSprite(gameKey, 553), imgS: ({ gameKey }) => shinySprite(gameKey, 553), },
		{ id: 125, natiId: 328, name: "Trapinch", img: ({ gameKey }) => baseSprite(gameKey, 328), imgS: ({ gameKey }) => shinySprite(gameKey, 328), },
		{ id: 126, natiId: 329, name: "Vibrava", img: ({ gameKey }) => baseSprite(gameKey, 329), imgS: ({ gameKey }) => shinySprite(gameKey, 329), },
		{ id: 127, natiId: 330, name: "Flygon", img: ({ gameKey }) => baseSprite(gameKey, 330), imgS: ({ gameKey }) => shinySprite(gameKey, 330), },
		{
			id: 128, natiId: 443, name: "Gible", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0443-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0443-f"), },
			],
		},
		{
			id: 129, natiId: 444, name: "Gabite", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0444-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0444-f"), },
			],
		},
		{
			id: 130, natiId: 445, name: "Garchomp", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), tags: ["gender", "pseudo", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0445-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0445-f"), },
			],
		},
		{ id: 131, natiId: 343, name: "Baltoy", img: ({ gameKey }) => baseSprite(gameKey, 343), imgS: ({ gameKey }) => shinySprite(gameKey, 343), },
		{ id: 132, natiId: 344, name: "Claydol", img: ({ gameKey }) => baseSprite(gameKey, 344), imgS: ({ gameKey }) => shinySprite(gameKey, 344), },
		{ id: 133, natiId: 622, name: "Golett", img: ({ gameKey }) => baseSprite(gameKey, 622), imgS: ({ gameKey }) => shinySprite(gameKey, 622), },
		{ id: 134, natiId: 623, name: "Golurk", img: ({ gameKey }) => baseSprite(gameKey, 623), imgS: ({ gameKey }) => shinySprite(gameKey, 623), },
		{ id: 135, natiId: 707, name: "Klefki", img: ({ gameKey }) => baseSprite(gameKey, 707), imgS: ({ gameKey }) => shinySprite(gameKey, 707), },
		{ id: 136, natiId: 778, name: "Mimikyu", img: ({ gameKey }) => baseSprite(gameKey, 778), imgS: ({ gameKey }) => shinySprite(gameKey, 778), tags: ["zcrystal"], },
		{ id: 137, natiId: 353, name: "Shuppet", img: ({ gameKey }) => baseSprite(gameKey, 353), imgS: ({ gameKey }) => shinySprite(gameKey, 353), },
		{ id: 138, natiId: 354, name: "Banette", img: ({ gameKey }) => baseSprite(gameKey, 354), imgS: ({ gameKey }) => shinySprite(gameKey, 354), tags: ["mega"], },
		{
			id: 139, natiId: 592, name: "Frillish", img: ({ gameKey }) => baseSprite(gameKey, 592), imgS: ({ gameKey }) => shinySprite(gameKey, 592), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 592), imgS: ({ gameKey }) => shinySprite(gameKey, 592), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0592-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0592-f"), },
			],
		},
		{
			id: 140, natiId: 593, name: "Jellicent", img: ({ gameKey }) => baseSprite(gameKey, 593), imgS: ({ gameKey }) => shinySprite(gameKey, 593), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 593), imgS: ({ gameKey }) => shinySprite(gameKey, 593), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0593-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0593-f"), },
			],
		},
		{ id: 141, natiId: 779, name: "Bruxish", img: ({ gameKey }) => baseSprite(gameKey, 779), imgS: ({ gameKey }) => shinySprite(gameKey, 779), },
		{ id: 142, natiId: 780, name: "Drampa", img: ({ gameKey }) => baseSprite(gameKey, 780), imgS: ({ gameKey }) => shinySprite(gameKey, 780), },
		{ id: 143, natiId: 359, name: "Absol", img: ({ gameKey }) => baseSprite(gameKey, 359), imgS: ({ gameKey }) => shinySprite(gameKey, 359), tags: ["mega"], },
		{ id: 144, natiId: 361, name: "Snorunt", img: ({ gameKey }) => baseSprite(gameKey, 361), imgS: ({ gameKey }) => shinySprite(gameKey, 361), },
		{ id: 145, natiId: 362, name: "Glalie", img: ({ gameKey }) => baseSprite(gameKey, 362), imgS: ({ gameKey }) => shinySprite(gameKey, 362), tags: ["mega"], },
		{ id: 146, natiId: 478, name: "Froslass", img: ({ gameKey }) => baseSprite(gameKey, 478), imgS: ({ gameKey }) => shinySprite(gameKey, 478), },
		{
			id: 147, natiId: 215, name: "Sneasel", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-f"), },
			],
		},
		{
			id: 148, natiId: 461, name: "Weavile", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0461-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0461-f"), },
			],
		},
		{
			id: 149, natiId: 27, name: "Sandshrew", img: ({ gameKey }) => baseSprite(gameKey, 27), imgS: ({ gameKey }) => shinySprite(gameKey, 27), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 27), imgS: ({ gameKey }) => shinySprite(gameKey, 27), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0027-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0027-a"), tags: ["alolan"], },
			],
		},
		{
			id: 150, natiId: 28, name: "Sandslash", img: ({ gameKey }) => baseSprite(gameKey, 28), imgS: ({ gameKey }) => shinySprite(gameKey, 28), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 28), imgS: ({ gameKey }) => shinySprite(gameKey, 28), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0028-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0028-a"), tags: ["alolan"], },
			],
		},
		{
			id: 151, natiId: 37, name: "Vulpix", img: ({ gameKey }) => baseSprite(gameKey, 37), imgS: ({ gameKey }) => shinySprite(gameKey, 37), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 37), imgS: ({ gameKey }) => shinySprite(gameKey, 37), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0037-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0037-a"), tags: ["alolan"], },
			],
		},
		{
			id: 152, natiId: 38, name: "Ninetales", img: ({ gameKey }) => baseSprite(gameKey, 38), imgS: ({ gameKey }) => shinySprite(gameKey, 38), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 38), imgS: ({ gameKey }) => shinySprite(gameKey, 38), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0038-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0038-a"), tags: ["alolan"], },
			],
		},
		{ id: 153, natiId: 582, name: "Vanillite", img: ({ gameKey }) => baseSprite(gameKey, 582), imgS: ({ gameKey }) => shinySprite(gameKey, 582), },
		{ id: 154, natiId: 583, name: "Vanillish", img: ({ gameKey }) => baseSprite(gameKey, 583), imgS: ({ gameKey }) => shinySprite(gameKey, 583), },
		{ id: 155, natiId: 584, name: "Vanilluxe", img: ({ gameKey }) => baseSprite(gameKey, 584), imgS: ({ gameKey }) => shinySprite(gameKey, 584), },
		{ id: 156, natiId: 559, name: "Scraggy", img: ({ gameKey }) => baseSprite(gameKey, 559), imgS: ({ gameKey }) => shinySprite(gameKey, 559), },
		{ id: 157, natiId: 560, name: "Scrafty", img: ({ gameKey }) => baseSprite(gameKey, 560), imgS: ({ gameKey }) => shinySprite(gameKey, 560), },
		{ id: 158, natiId: 624, name: "Pawniard", img: ({ gameKey }) => baseSprite(gameKey, 624), imgS: ({ gameKey }) => shinySprite(gameKey, 624), },
		{ id: 159, natiId: 625, name: "Bisharp", img: ({ gameKey }) => baseSprite(gameKey, 625), imgS: ({ gameKey }) => shinySprite(gameKey, 625), },
		{ id: 160, natiId: 787, name: "Tapu Bulu", img: ({ gameKey }) => baseSprite(gameKey, 787), imgS: ({ gameKey }) => shinySprite(gameKey, 787), tags: ["zcrystal", "legendary"], },
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();