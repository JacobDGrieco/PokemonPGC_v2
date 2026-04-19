import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 8;
	const GAME_KEYS = ["swordct", "shieldct"];
	const DEX_NAME = "Crown Tundra Dex";

	const baseSprite = (gameKey, natiId) => dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 872, name: "Snom", img: ({ gameKey }) => baseSprite(gameKey, 872), imgS: ({ gameKey }) => shinySprite(gameKey, 872), },
		{ id: 2, natiId: 873, name: "Frosmoth", img: ({ gameKey }) => baseSprite(gameKey, 873), imgS: ({ gameKey }) => shinySprite(gameKey, 873), },
		{ id: 3, natiId: 831, name: "Wooloo", img: ({ gameKey }) => baseSprite(gameKey, 831), imgS: ({ gameKey }) => shinySprite(gameKey, 831), },
		{ id: 4, natiId: 832, name: "Dubwool", img: ({ gameKey }) => baseSprite(gameKey, 832), imgS: ({ gameKey }) => shinySprite(gameKey, 832), },
		{ id: 5, natiId: 819, name: "Skwovet", img: ({ gameKey }) => baseSprite(gameKey, 819), imgS: ({ gameKey }) => shinySprite(gameKey, 819), },
		{ id: 6, natiId: 820, name: "Greedent", img: ({ gameKey }) => baseSprite(gameKey, 820), imgS: ({ gameKey }) => shinySprite(gameKey, 820), },
		{ id: 7, natiId: 220, name: "Swinub", img: ({ gameKey }) => baseSprite(gameKey, 220), imgS: ({ gameKey }) => shinySprite(gameKey, 220), },
		{
			id: 8, natiId: 221, name: "Piloswine", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0221-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0221-f"), },
			],
		},
		{
			id: 9, natiId: 473, name: "Mamoswine", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0473-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0473-f"), },
			],
		},
		{ id: 10, natiId: 439, name: "Mime Jr.", img: ({ gameKey }) => baseSprite(gameKey, 439), imgS: ({ gameKey }) => shinySprite(gameKey, 439), },
		{
			id: 11, natiId: 122, name: "Mr. Mime", img: ({ gameKey }) => baseSprite(gameKey, "0122-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0122-g"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 122), imgS: ({ gameKey }) => shinySprite(gameKey, 122), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0122-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0122-g"), tags: ["galarian"], },
			],
		},
		{ id: 12, natiId: 866, name: "Mr. Rime", img: ({ gameKey }) => baseSprite(gameKey, 866), imgS: ({ gameKey }) => shinySprite(gameKey, 866), },
		{ id: 13, natiId: 238, name: "Smoochum", img: ({ gameKey }) => baseSprite(gameKey, 238), imgS: ({ gameKey }) => shinySprite(gameKey, 238), },
		{ id: 14, natiId: 124, name: "Jynx", img: ({ gameKey }) => baseSprite(gameKey, 124), imgS: ({ gameKey }) => shinySprite(gameKey, 124), },
		{ id: 15, natiId: 239, name: "Elekid", img: ({ gameKey }) => baseSprite(gameKey, 239), imgS: ({ gameKey }) => shinySprite(gameKey, 239), },
		{ id: 16, natiId: 125, name: "Electabuzz", img: ({ gameKey }) => baseSprite(gameKey, 125), imgS: ({ gameKey }) => shinySprite(gameKey, 125), },
		{ id: 17, natiId: 466, name: "Electivire", img: ({ gameKey }) => baseSprite(gameKey, 466), imgS: ({ gameKey }) => shinySprite(gameKey, 466), },
		{ id: 18, natiId: 240, name: "Magby", img: ({ gameKey }) => baseSprite(gameKey, 240), imgS: ({ gameKey }) => shinySprite(gameKey, 240), },
		{ id: 19, natiId: 126, name: "Magmar", img: ({ gameKey }) => baseSprite(gameKey, 126), imgS: ({ gameKey }) => shinySprite(gameKey, 126), },
		{ id: 20, natiId: 467, name: "Magmortar", img: ({ gameKey }) => baseSprite(gameKey, 467), imgS: ({ gameKey }) => shinySprite(gameKey, 467), },
		{ id: 21, natiId: 531, name: "Audino", img: ({ gameKey }) => baseSprite(gameKey, 531), imgS: ({ gameKey }) => shinySprite(gameKey, 531), },
		{ id: 22, natiId: 582, name: "Vanillite", img: ({ gameKey }) => baseSprite(gameKey, 582), imgS: ({ gameKey }) => shinySprite(gameKey, 582), },
		{ id: 23, natiId: 583, name: "Vanillish", img: ({ gameKey }) => baseSprite(gameKey, 583), imgS: ({ gameKey }) => shinySprite(gameKey, 583), },
		{ id: 24, natiId: 584, name: "Vanilluxe", img: ({ gameKey }) => baseSprite(gameKey, 584), imgS: ({ gameKey }) => shinySprite(gameKey, 584), },
		{ id: 25, natiId: 361, name: "Snorunt", img: ({ gameKey }) => baseSprite(gameKey, 361), imgS: ({ gameKey }) => shinySprite(gameKey, 361), },
		{ id: 26, natiId: 362, name: "Glalie", img: ({ gameKey }) => baseSprite(gameKey, 362), imgS: ({ gameKey }) => shinySprite(gameKey, 362), },
		{ id: 27, natiId: 478, name: "Froslass", img: ({ gameKey }) => baseSprite(gameKey, 478), imgS: ({ gameKey }) => shinySprite(gameKey, 478), },
		{
			id: 28, natiId: 215, name: "Sneasel", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-f"), },
			],
		},
		{
			id: 29, natiId: 461, name: "Weavile", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0461-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0461-f"), },
			],
		},
		{ id: 30, natiId: 615, name: "Cryogonal", img: ({ gameKey }) => baseSprite(gameKey, 615), imgS: ({ gameKey }) => shinySprite(gameKey, 615), },
		{
			id: 31, natiId: 459, name: "Snover", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0459-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0459-f"), },
			],
		},
		{
			id: 32, natiId: 460, name: "Abomasnow", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0460-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0460-f"), },
			],
		},
		{ id: 33, natiId: 708, name: "Phantump", img: ({ gameKey }) => baseSprite(gameKey, 708), imgS: ({ gameKey }) => shinySprite(gameKey, 708), },
		{ id: 34, natiId: 709, name: "Trevenant", img: ({ gameKey }) => baseSprite(gameKey, 709), imgS: ({ gameKey }) => shinySprite(gameKey, 709), },
		{ id: 35, natiId: 333, name: "Swablu", img: ({ gameKey }) => baseSprite(gameKey, 333), imgS: ({ gameKey }) => shinySprite(gameKey, 333), },
		{ id: 36, natiId: 334, name: "Altaria", img: ({ gameKey }) => baseSprite(gameKey, 334), imgS: ({ gameKey }) => shinySprite(gameKey, 334), },
		{ id: 37, natiId: 859, name: "Impidimp", img: ({ gameKey }) => baseSprite(gameKey, 859), imgS: ({ gameKey }) => shinySprite(gameKey, 859), },
		{ id: 38, natiId: 860, name: "Morgrem", img: ({ gameKey }) => baseSprite(gameKey, 860), imgS: ({ gameKey }) => shinySprite(gameKey, 860), },
		{ id: 39, natiId: 861, name: "Grimmsnarl", img: ({ gameKey }) => baseSprite(gameKey, 861), imgS: ({ gameKey }) => shinySprite(gameKey, 861), tags: ["gigantamax"], },
		{ id: 40, natiId: 856, name: "Hatenna", img: ({ gameKey }) => baseSprite(gameKey, 856), imgS: ({ gameKey }) => shinySprite(gameKey, 856), },
		{ id: 41, natiId: 857, name: "Hattrem", img: ({ gameKey }) => baseSprite(gameKey, 857), imgS: ({ gameKey }) => shinySprite(gameKey, 857), },
		{ id: 42, natiId: 858, name: "Hatterene", img: ({ gameKey }) => baseSprite(gameKey, 858), imgS: ({ gameKey }) => shinySprite(gameKey, 858), tags: ["gigantamax"], },
		{ id: 43, natiId: 173, name: "Cleffa", img: ({ gameKey }) => baseSprite(gameKey, 173), imgS: ({ gameKey }) => shinySprite(gameKey, 173), },
		{ id: 44, natiId: 35, name: "Clefairy", img: ({ gameKey }) => baseSprite(gameKey, 35), imgS: ({ gameKey }) => shinySprite(gameKey, 35), },
		{ id: 45, natiId: 36, name: "Clefable", img: ({ gameKey }) => baseSprite(gameKey, 36), imgS: ({ gameKey }) => shinySprite(gameKey, 36), },
		{ id: 46, natiId: 778, name: "Mimikyu", img: ({ gameKey }) => baseSprite(gameKey, 778), imgS: ({ gameKey }) => shinySprite(gameKey, 778), },
		{ id: 47, natiId: 442, name: "Spiritomb", img: ({ gameKey }) => baseSprite(gameKey, 442), imgS: ({ gameKey }) => shinySprite(gameKey, 442), },
		{ id: 48, natiId: 607, name: "Litwick", img: ({ gameKey }) => baseSprite(gameKey, 607), imgS: ({ gameKey }) => shinySprite(gameKey, 607), },
		{ id: 49, natiId: 608, name: "Lampent", img: ({ gameKey }) => baseSprite(gameKey, 608), imgS: ({ gameKey }) => shinySprite(gameKey, 608), },
		{ id: 50, natiId: 609, name: "Chandelure", img: ({ gameKey }) => baseSprite(gameKey, 609), imgS: ({ gameKey }) => shinySprite(gameKey, 609), },
		{ id: 51, natiId: 574, name: "Gothita", img: ({ gameKey }) => baseSprite(gameKey, 574), imgS: ({ gameKey }) => shinySprite(gameKey, 574), },
		{ id: 52, natiId: 575, name: "Gothorita", img: ({ gameKey }) => baseSprite(gameKey, 575), imgS: ({ gameKey }) => shinySprite(gameKey, 575), },
		{ id: 53, natiId: 576, name: "Gothitelle", img: ({ gameKey }) => baseSprite(gameKey, 576), imgS: ({ gameKey }) => shinySprite(gameKey, 576), },
		{ id: 54, natiId: 577, name: "Solosis", img: ({ gameKey }) => baseSprite(gameKey, 577), imgS: ({ gameKey }) => shinySprite(gameKey, 577), },
		{ id: 55, natiId: 578, name: "Duosion", img: ({ gameKey }) => baseSprite(gameKey, 578), imgS: ({ gameKey }) => shinySprite(gameKey, 578), },
		{ id: 56, natiId: 579, name: "Reuniclus", img: ({ gameKey }) => baseSprite(gameKey, 579), imgS: ({ gameKey }) => shinySprite(gameKey, 579), },
		{ id: 57, natiId: 532, name: "Timburr", img: ({ gameKey }) => baseSprite(gameKey, 532), imgS: ({ gameKey }) => shinySprite(gameKey, 532), },
		{ id: 58, natiId: 533, name: "Gurdurr", img: ({ gameKey }) => baseSprite(gameKey, 533), imgS: ({ gameKey }) => shinySprite(gameKey, 533), },
		{ id: 59, natiId: 534, name: "Conkeldurr", img: ({ gameKey }) => baseSprite(gameKey, 534), imgS: ({ gameKey }) => shinySprite(gameKey, 534), },
		{ id: 60, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339), },
		{ id: 61, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340), },
		{
			id: 62, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), },
			],
		},
		{
			id: 63, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },
			],
		},
		{
			id: 64, natiId: 550, name: "Basculin", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), tags: ["other"], forms: [
				{ name: "Blue-Striped", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), },
				{ name: "Red-Striped", img: ({ gameKey }) => baseSprite(gameKey, "0550-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0550-r"), },
			],
		},
		{ id: 65, natiId: 29, name: "Nidoran♀", img: ({ gameKey }) => baseSprite(gameKey, 29), imgS: ({ gameKey }) => shinySprite(gameKey, 29), },
		{ id: 66, natiId: 30, name: "Nidorina", img: ({ gameKey }) => baseSprite(gameKey, 30), imgS: ({ gameKey }) => shinySprite(gameKey, 30), },
		{ id: 67, natiId: 31, name: "Nidoqueen", img: ({ gameKey }) => baseSprite(gameKey, 31), imgS: ({ gameKey }) => shinySprite(gameKey, 31), },
		{ id: 68, natiId: 32, name: "Nidoran♂", img: ({ gameKey }) => baseSprite(gameKey, 32), imgS: ({ gameKey }) => shinySprite(gameKey, 32), },
		{ id: 69, natiId: 33, name: "Nidorino", img: ({ gameKey }) => baseSprite(gameKey, 33), imgS: ({ gameKey }) => shinySprite(gameKey, 33), },
		{ id: 70, natiId: 34, name: "Nidoking", img: ({ gameKey }) => baseSprite(gameKey, 34), imgS: ({ gameKey }) => shinySprite(gameKey, 34), },
		{
			id: 71, natiId: 263, name: "Zigzagoon", img: ({ gameKey }) => baseSprite(gameKey, "0263-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0263-g"), forms: [
				{ name: "Hoennian", img: ({ gameKey }) => baseSprite(gameKey, 263), imgS: ({ gameKey }) => shinySprite(gameKey, 263), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0263-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0263-g"), tags: ["galarian"], },
			],
		},
		{
			id: 72, natiId: 264, name: "Linoone", img: ({ gameKey }) => baseSprite(gameKey, "0264-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0264-g"), forms: [
				{ name: "Hoennian", img: ({ gameKey }) => baseSprite(gameKey, 264), imgS: ({ gameKey }) => shinySprite(gameKey, 264), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0264-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0264-g"), tags: ["galarian"], },
			],
		},
		{ id: 73, natiId: 862, name: "Obstagoon", img: ({ gameKey }) => baseSprite(gameKey, 862), imgS: ({ gameKey }) => shinySprite(gameKey, 862), },
		{
			id: 74, natiId: 133, name: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133), tags: ["gender", "gigantamax"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0133-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0133-f"), },
			],
		},
		{ id: 75, natiId: 134, name: "Vaporeon", img: ({ gameKey }) => baseSprite(gameKey, 134), imgS: ({ gameKey }) => shinySprite(gameKey, 134), },
		{ id: 76, natiId: 135, name: "Jolteon", img: ({ gameKey }) => baseSprite(gameKey, 135), imgS: ({ gameKey }) => shinySprite(gameKey, 135), },
		{ id: 77, natiId: 136, name: "Flareon", img: ({ gameKey }) => baseSprite(gameKey, 136), imgS: ({ gameKey }) => shinySprite(gameKey, 136), },
		{ id: 78, natiId: 197, name: "Umbreon", img: ({ gameKey }) => baseSprite(gameKey, 197), imgS: ({ gameKey }) => shinySprite(gameKey, 197), },
		{ id: 79, natiId: 196, name: "Espeon", img: ({ gameKey }) => baseSprite(gameKey, 196), imgS: ({ gameKey }) => shinySprite(gameKey, 196), },
		{ id: 80, natiId: 471, name: "Glaceon", img: ({ gameKey }) => baseSprite(gameKey, 471), imgS: ({ gameKey }) => shinySprite(gameKey, 471), },
		{ id: 81, natiId: 470, name: "Leafeon", img: ({ gameKey }) => baseSprite(gameKey, 470), imgS: ({ gameKey }) => shinySprite(gameKey, 470), },
		{ id: 82, natiId: 700, name: "Sylveon", img: ({ gameKey }) => baseSprite(gameKey, 700), imgS: ({ gameKey }) => shinySprite(gameKey, 700), },
		{ id: 83, natiId: 696, name: "Tyrunt", img: ({ gameKey }) => baseSprite(gameKey, 696), imgS: ({ gameKey }) => shinySprite(gameKey, 696), tags: ["fossil"], },
		{ id: 84, natiId: 697, name: "Tyrantrum", img: ({ gameKey }) => baseSprite(gameKey, 697), imgS: ({ gameKey }) => shinySprite(gameKey, 697), tags: ["fossil"], },
		{ id: 85, natiId: 698, name: "Amaura", img: ({ gameKey }) => baseSprite(gameKey, 698), imgS: ({ gameKey }) => shinySprite(gameKey, 698), tags: ["fossil"], },
		{ id: 86, natiId: 699, name: "Aurorus", img: ({ gameKey }) => baseSprite(gameKey, 699), imgS: ({ gameKey }) => shinySprite(gameKey, 699), tags: ["fossil"], },
		{ id: 87, natiId: 436, name: "Bronzor", img: ({ gameKey }) => baseSprite(gameKey, 436), imgS: ({ gameKey }) => shinySprite(gameKey, 436), },
		{ id: 88, natiId: 437, name: "Bronzong", img: ({ gameKey }) => baseSprite(gameKey, 437), imgS: ({ gameKey }) => shinySprite(gameKey, 437), },
		{ id: 89, natiId: 874, name: "Stonjourner", img: ({ gameKey }) => baseSprite(gameKey, 874), imgS: ({ gameKey }) => shinySprite(gameKey, 874), },
		{ id: 90, natiId: 875, name: "Eiscue", img: ({ gameKey }) => baseSprite(gameKey, 875), imgS: ({ gameKey }) => shinySprite(gameKey, 875), },
		{ id: 91, natiId: 751, name: "Dewpider", img: ({ gameKey }) => baseSprite(gameKey, 751), imgS: ({ gameKey }) => shinySprite(gameKey, 751), },
		{ id: 92, natiId: 752, name: "Araquanid", img: ({ gameKey }) => baseSprite(gameKey, 752), imgS: ({ gameKey }) => shinySprite(gameKey, 752), },
		{ id: 93, natiId: 595, name: "Joltik", img: ({ gameKey }) => baseSprite(gameKey, 595), imgS: ({ gameKey }) => shinySprite(gameKey, 595), },
		{ id: 94, natiId: 596, name: "Galvantula", img: ({ gameKey }) => baseSprite(gameKey, 596), imgS: ({ gameKey }) => shinySprite(gameKey, 596), },
		{ id: 95, natiId: 588, name: "Karrablast", img: ({ gameKey }) => baseSprite(gameKey, 588), imgS: ({ gameKey }) => shinySprite(gameKey, 588), },
		{ id: 96, natiId: 589, name: "Escavalier", img: ({ gameKey }) => baseSprite(gameKey, 589), imgS: ({ gameKey }) => shinySprite(gameKey, 589), },
		{ id: 97, natiId: 616, name: "Shelmet", img: ({ gameKey }) => baseSprite(gameKey, 616), imgS: ({ gameKey }) => shinySprite(gameKey, 616), },
		{ id: 98, natiId: 617, name: "Accelgor", img: ({ gameKey }) => baseSprite(gameKey, 617), imgS: ({ gameKey }) => shinySprite(gameKey, 617), },
		{ id: 99, natiId: 850, name: "Sizzlipede", img: ({ gameKey }) => baseSprite(gameKey, 850), imgS: ({ gameKey }) => shinySprite(gameKey, 850), },
		{ id: 100, natiId: 851, name: "Centiskorch", img: ({ gameKey }) => baseSprite(gameKey, 851), imgS: ({ gameKey }) => shinySprite(gameKey, 851), tags: ["gigantamax"], },
		{ id: 101, natiId: 632, name: "Durant", img: ({ gameKey }) => baseSprite(gameKey, 632), imgS: ({ gameKey }) => shinySprite(gameKey, 632), },
		{ id: 102, natiId: 631, name: "Heatmor", img: ({ gameKey }) => baseSprite(gameKey, 631), imgS: ({ gameKey }) => shinySprite(gameKey, 631), },
		{
			id: 103, natiId: 554, name: "Darumaka", img: ({ gameKey }) => baseSprite(gameKey, "0554-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0554-g"), forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 554), imgS: ({ gameKey }) => shinySprite(gameKey, 554), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0554-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0554-g"), },
			],
		},
		{
			id: 104, natiId: 555, name: "Darmanitan", img: ({ gameKey }) => baseSprite(gameKey, "0555-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0555-g"), forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 555), imgS: ({ gameKey }) => shinySprite(gameKey, 555), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0555-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0555-g"), tags: ["galarian"], },
			],
		},
		{
			id: 105, natiId: 77, name: "Ponyta", img: ({ gameKey }) => baseSprite(gameKey, "0077-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0077-g"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 77), imgS: ({ gameKey }) => shinySprite(gameKey, 77), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0077-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0077-g"), tags: ["galarian"], },
			],
		},
		{
			id: 106, natiId: 78, name: "Rapidash", img: ({ gameKey }) => baseSprite(gameKey, "0078-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0078-g"), forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 78), imgS: ({ gameKey }) => shinySprite(gameKey, 78), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0078-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0078-g"), tags: ["galarian"], },
			],
		},
		{ id: 107, natiId: 359, name: "Absol", img: ({ gameKey }) => baseSprite(gameKey, 359), imgS: ({ gameKey }) => shinySprite(gameKey, 359), },
		{ id: 108, natiId: 878, name: "Cufant", img: ({ gameKey }) => baseSprite(gameKey, 878), imgS: ({ gameKey }) => shinySprite(gameKey, 878), },
		{ id: 109, natiId: 879, name: "Copperajah", img: ({ gameKey }) => baseSprite(gameKey, 879), imgS: ({ gameKey }) => shinySprite(gameKey, 879), tags: ["gigantamax"], },
		{ id: 110, natiId: 885, name: "Dreepy", img: ({ gameKey }) => baseSprite(gameKey, 885), imgS: ({ gameKey }) => shinySprite(gameKey, 885), tags: ["pseudo"], },
		{ id: 111, natiId: 886, name: "Drakloak", img: ({ gameKey }) => baseSprite(gameKey, 886), imgS: ({ gameKey }) => shinySprite(gameKey, 886), tags: ["pseudo"], },
		{ id: 112, natiId: 887, name: "Dragapult", img: ({ gameKey }) => baseSprite(gameKey, 887), imgS: ({ gameKey }) => shinySprite(gameKey, 887), tags: ["pseudo"], },
		{ id: 113, natiId: 371, name: "Bagon", img: ({ gameKey }) => baseSprite(gameKey, 371), imgS: ({ gameKey }) => shinySprite(gameKey, 371), tags: ["pseudo"], },
		{ id: 114, natiId: 372, name: "Shelgon", img: ({ gameKey }) => baseSprite(gameKey, 372), imgS: ({ gameKey }) => shinySprite(gameKey, 372), tags: ["pseudo"], },
		{ id: 115, natiId: 373, name: "Salamence", img: ({ gameKey }) => baseSprite(gameKey, 373), imgS: ({ gameKey }) => shinySprite(gameKey, 373), tags: ["pseudo"], },
		{
			id: 116, natiId: 443, name: "Gible", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0443-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0443-f"), },
			],
		},
		{
			id: 117, natiId: 444, name: "Gabite", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0444-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0444-f"), },
			],
		},
		{
			id: 118, natiId: 445, name: "Garchomp", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0445-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0445-f"), },
			],
		},
		{ id: 119, natiId: 621, name: "Druddigon", img: ({ gameKey }) => baseSprite(gameKey, 621), imgS: ({ gameKey }) => shinySprite(gameKey, 621), },
		{ id: 120, natiId: 225, name: "Delibird", img: ({ gameKey }) => baseSprite(gameKey, 225), imgS: ({ gameKey }) => shinySprite(gameKey, 225), },
		{ id: 121, natiId: 613, name: "Cubchoo", img: ({ gameKey }) => baseSprite(gameKey, 613), imgS: ({ gameKey }) => shinySprite(gameKey, 613), },
		{ id: 122, natiId: 614, name: "Beartic", img: ({ gameKey }) => baseSprite(gameKey, 614), imgS: ({ gameKey }) => shinySprite(gameKey, 614), },
		{ id: 123, natiId: 138, name: "Omanyte", img: ({ gameKey }) => baseSprite(gameKey, 138), imgS: ({ gameKey }) => shinySprite(gameKey, 138), tags: ["fossil"], },
		{ id: 124, natiId: 139, name: "Omastar", img: ({ gameKey }) => baseSprite(gameKey, 139), imgS: ({ gameKey }) => shinySprite(gameKey, 139), tags: ["fossil"], },
		{ id: 125, natiId: 140, name: "Kabuto", img: ({ gameKey }) => baseSprite(gameKey, 140), imgS: ({ gameKey }) => shinySprite(gameKey, 140), tags: ["fossil"], },
		{ id: 126, natiId: 141, name: "Kabutops", img: ({ gameKey }) => baseSprite(gameKey, 141), imgS: ({ gameKey }) => shinySprite(gameKey, 141), tags: ["fossil"], },
		{ id: 127, natiId: 142, name: "Aerodactyl", img: ({ gameKey }) => baseSprite(gameKey, 142), imgS: ({ gameKey }) => shinySprite(gameKey, 142), tags: ["fossil"], },
		{ id: 128, natiId: 703, name: "Carbink", img: ({ gameKey }) => baseSprite(gameKey, 703), imgS: ({ gameKey }) => shinySprite(gameKey, 703), },
		{ id: 129, natiId: 374, name: "Beldum", img: ({ gameKey }) => baseSprite(gameKey, 374), imgS: ({ gameKey }) => shinySprite(gameKey, 374), tags: ["pseudo"], },
		{ id: 130, natiId: 375, name: "Metang", img: ({ gameKey }) => baseSprite(gameKey, 375), imgS: ({ gameKey }) => shinySprite(gameKey, 375), tags: ["pseudo"], },
		{ id: 131, natiId: 376, name: "Metagross", img: ({ gameKey }) => baseSprite(gameKey, 376), imgS: ({ gameKey }) => shinySprite(gameKey, 376), tags: ["pseudo"], },
		{
			id: 132, natiId: 854, name: "Sinistea", img: ({ gameKey }) => baseSprite(gameKey, 854), imgS: ({ gameKey }) => shinySprite(gameKey, 854), tags: ["other"], forms: [
				{ name: "Phony", img: ({ gameKey }) => baseSprite(gameKey, 854), imgS: ({ gameKey }) => shinySprite(gameKey, 854), },
				{ name: "Authentic", img: ({ gameKey }) => baseSprite(gameKey, "0854-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0854-a"), },]
		},
		{
			id: 133, natiId: 855, name: "Polteageist", img: ({ gameKey }) => baseSprite(gameKey, 855), imgS: ({ gameKey }) => shinySprite(gameKey, 855), tags: ["other"], forms: [
				{ name: "Phony", img: ({ gameKey }) => baseSprite(gameKey, 855), imgS: ({ gameKey }) => shinySprite(gameKey, 855), },
				{ name: "Authentic", img: ({ gameKey }) => baseSprite(gameKey, "0855-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0855-a"), },]
		},
		{ id: 134, natiId: 447, name: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447), imgS: ({ gameKey }) => shinySprite(gameKey, 447), },
		{ id: 135, natiId: 448, name: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), imgS: ({ gameKey }) => shinySprite(gameKey, 448), },
		{ id: 136, natiId: 633, name: "Deino", img: ({ gameKey }) => baseSprite(gameKey, 633), imgS: ({ gameKey }) => shinySprite(gameKey, 633), tags: ["pseudo"], },
		{ id: 137, natiId: 634, name: "Zweilous", img: ({ gameKey }) => baseSprite(gameKey, 634), imgS: ({ gameKey }) => shinySprite(gameKey, 634), tags: ["pseudo"], },
		{ id: 138, natiId: 635, name: "Hydreigon", img: ({ gameKey }) => baseSprite(gameKey, 635), imgS: ({ gameKey }) => shinySprite(gameKey, 635), tags: ["pseudo"], },
		{ id: 139, natiId: 246, name: "Larvitar", img: ({ gameKey }) => baseSprite(gameKey, 246), imgS: ({ gameKey }) => shinySprite(gameKey, 246), tags: ["pseudo"], },
		{ id: 140, natiId: 247, name: "Pupitar", img: ({ gameKey }) => baseSprite(gameKey, 247), imgS: ({ gameKey }) => shinySprite(gameKey, 247), tags: ["pseudo"], },
		{ id: 141, natiId: 248, name: "Tyranitar", img: ({ gameKey }) => baseSprite(gameKey, 248), imgS: ({ gameKey }) => shinySprite(gameKey, 248), tags: ["pseudo"], },
		{ id: 142, natiId: 712, name: "Bergmite", img: ({ gameKey }) => baseSprite(gameKey, 712), imgS: ({ gameKey }) => shinySprite(gameKey, 712), },
		{ id: 143, natiId: 713, name: "Avalugg", img: ({ gameKey }) => baseSprite(gameKey, 713), imgS: ({ gameKey }) => shinySprite(gameKey, 713), },
		{
			id: 144, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), },
			],
		},
		{
			id: 145, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), },
			],
		},
		{ id: 146, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169), },
		{ id: 147, natiId: 564, name: "Tirtouga", img: ({ gameKey }) => baseSprite(gameKey, 564), imgS: ({ gameKey }) => shinySprite(gameKey, 564), tags: ["fossil"], },
		{ id: 148, natiId: 565, name: "Carracosta", img: ({ gameKey }) => baseSprite(gameKey, 565), imgS: ({ gameKey }) => shinySprite(gameKey, 565), tags: ["fossil"], },
		{ id: 149, natiId: 566, name: "Archen", img: ({ gameKey }) => baseSprite(gameKey, 566), imgS: ({ gameKey }) => shinySprite(gameKey, 566), tags: ["fossil"], },
		{ id: 150, natiId: 567, name: "Archeops", img: ({ gameKey }) => baseSprite(gameKey, 567), imgS: ({ gameKey }) => shinySprite(gameKey, 567), tags: ["fossil"], },
		{ id: 151, natiId: 343, name: "Baltoy", img: ({ gameKey }) => baseSprite(gameKey, 343), imgS: ({ gameKey }) => shinySprite(gameKey, 343), },
		{ id: 152, natiId: 344, name: "Claydol", img: ({ gameKey }) => baseSprite(gameKey, 344), imgS: ({ gameKey }) => shinySprite(gameKey, 344), },
		{ id: 153, natiId: 622, name: "Golett", img: ({ gameKey }) => baseSprite(gameKey, 622), imgS: ({ gameKey }) => shinySprite(gameKey, 622), },
		{ id: 154, natiId: 623, name: "Golurk", img: ({ gameKey }) => baseSprite(gameKey, 623), imgS: ({ gameKey }) => shinySprite(gameKey, 623), },
		{ id: 155, natiId: 835, name: "Yamper", img: ({ gameKey }) => baseSprite(gameKey, 835), imgS: ({ gameKey }) => shinySprite(gameKey, 835), },
		{ id: 156, natiId: 836, name: "Boltund", img: ({ gameKey }) => baseSprite(gameKey, 836), imgS: ({ gameKey }) => shinySprite(gameKey, 836), },
		{ id: 157, natiId: 877, name: "Morpeko", img: ({ gameKey }) => baseSprite(gameKey, 877), imgS: ({ gameKey }) => shinySprite(gameKey, 877), },
		{ id: 158, natiId: 871, name: "Pincurchin", img: ({ gameKey }) => baseSprite(gameKey, 871), imgS: ({ gameKey }) => shinySprite(gameKey, 871), },
		{ id: 159, natiId: 363, name: "Spheal", img: ({ gameKey }) => baseSprite(gameKey, 363), imgS: ({ gameKey }) => shinySprite(gameKey, 363), },
		{ id: 160, natiId: 364, name: "Sealeo", img: ({ gameKey }) => baseSprite(gameKey, 364), imgS: ({ gameKey }) => shinySprite(gameKey, 364), },
		{ id: 161, natiId: 365, name: "Walrein", img: ({ gameKey }) => baseSprite(gameKey, 365), imgS: ({ gameKey }) => shinySprite(gameKey, 365), },
		{ id: 162, natiId: 781, name: "Dhelmise", img: ({ gameKey }) => baseSprite(gameKey, 781), imgS: ({ gameKey }) => shinySprite(gameKey, 781), },
		{ id: 163, natiId: 821, name: "Rookidee", img: ({ gameKey }) => baseSprite(gameKey, 821), imgS: ({ gameKey }) => shinySprite(gameKey, 821), },
		{ id: 164, natiId: 822, name: "Corvisquire", img: ({ gameKey }) => baseSprite(gameKey, 822), imgS: ({ gameKey }) => shinySprite(gameKey, 822), },
		{ id: 165, natiId: 823, name: "Corviknight", img: ({ gameKey }) => baseSprite(gameKey, 823), imgS: ({ gameKey }) => shinySprite(gameKey, 823), tags: ["gigantamax"], },
		{ id: 166, natiId: 829, name: "Gossifleur", img: ({ gameKey }) => baseSprite(gameKey, 829), imgS: ({ gameKey }) => shinySprite(gameKey, 829), },
		{ id: 167, natiId: 830, name: "Eldegoss", img: ({ gameKey }) => baseSprite(gameKey, 830), imgS: ({ gameKey }) => shinySprite(gameKey, 830), },
		{ id: 168, natiId: 546, name: "Cottonee", img: ({ gameKey }) => baseSprite(gameKey, 546), imgS: ({ gameKey }) => shinySprite(gameKey, 546), },
		{ id: 169, natiId: 547, name: "Whimsicott", img: ({ gameKey }) => baseSprite(gameKey, 547), imgS: ({ gameKey }) => shinySprite(gameKey, 547), },
		{ id: 170, natiId: 213, name: "Shuckle", img: ({ gameKey }) => baseSprite(gameKey, 213), imgS: ({ gameKey }) => shinySprite(gameKey, 213), },
		{
			id: 171, natiId: 876, name: "Indeedee", img: ({ gameKey }) => baseSprite(gameKey, 876), imgS: ({ gameKey }) => shinySprite(gameKey, 876), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 876), imgS: ({ gameKey }) => shinySprite(gameKey, 876), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0876-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0876-f"), },
			],
		},
		{ id: 172, natiId: 446, name: "Munchlax", img: ({ gameKey }) => baseSprite(gameKey, 446), imgS: ({ gameKey }) => shinySprite(gameKey, 446), },
		{ id: 173, natiId: 143, name: "Snorlax", img: ({ gameKey }) => baseSprite(gameKey, 143), imgS: ({ gameKey }) => shinySprite(gameKey, 143), tags: ["gigantamax"], },
		{ id: 174, natiId: 302, name: "Sableye", img: ({ gameKey }) => baseSprite(gameKey, 302), imgS: ({ gameKey }) => shinySprite(gameKey, 302), },
		{ id: 175, natiId: 303, name: "Mawile", img: ({ gameKey }) => baseSprite(gameKey, 303), imgS: ({ gameKey }) => shinySprite(gameKey, 303), },
		{ id: 176, natiId: 837, name: "Rolycoly", img: ({ gameKey }) => baseSprite(gameKey, 837), imgS: ({ gameKey }) => shinySprite(gameKey, 837), },
		{ id: 177, natiId: 838, name: "Carkol", img: ({ gameKey }) => baseSprite(gameKey, 838), imgS: ({ gameKey }) => shinySprite(gameKey, 838), },
		{ id: 178, natiId: 839, name: "Coalossal", img: ({ gameKey }) => baseSprite(gameKey, 839), imgS: ({ gameKey }) => shinySprite(gameKey, 839), tags: ["gigantamax"], },
		{ id: 179, natiId: 597, name: "Ferroseed", img: ({ gameKey }) => baseSprite(gameKey, 597), imgS: ({ gameKey }) => shinySprite(gameKey, 597), },
		{ id: 180, natiId: 598, name: "Ferrothorn", img: ({ gameKey }) => baseSprite(gameKey, 598), imgS: ({ gameKey }) => shinySprite(gameKey, 598), },
		{ id: 181, natiId: 714, name: "Noibat", img: ({ gameKey }) => baseSprite(gameKey, 714), imgS: ({ gameKey }) => shinySprite(gameKey, 714), },
		{ id: 182, natiId: 715, name: "Noivern", img: ({ gameKey }) => baseSprite(gameKey, 715), imgS: ({ gameKey }) => shinySprite(gameKey, 715), },
		{ id: 183, natiId: 345, name: "Lileep", img: ({ gameKey }) => baseSprite(gameKey, 345), imgS: ({ gameKey }) => shinySprite(gameKey, 345), tags: ["fossil"], },
		{ id: 184, natiId: 346, name: "Cradily", img: ({ gameKey }) => baseSprite(gameKey, 346), imgS: ({ gameKey }) => shinySprite(gameKey, 346), tags: ["fossil"], },
		{ id: 185, natiId: 347, name: "Anorith", img: ({ gameKey }) => baseSprite(gameKey, 347), imgS: ({ gameKey }) => shinySprite(gameKey, 347), tags: ["fossil"], },
		{ id: 186, natiId: 348, name: "Armaldo", img: ({ gameKey }) => baseSprite(gameKey, 348), imgS: ({ gameKey }) => shinySprite(gameKey, 348), tags: ["fossil"], },
		{
			id: 187, natiId: 369, name: "Relicanth", img: ({ gameKey }) => baseSprite(gameKey, 369), imgS: ({ gameKey }) => shinySprite(gameKey, 369), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 369), imgS: ({ gameKey }) => shinySprite(gameKey, 369), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0369-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0369-f"), },
			],
		},
		{ id: 188, natiId: 349, name: "Feebas", img: ({ gameKey }) => baseSprite(gameKey, 349), imgS: ({ gameKey }) => shinySprite(gameKey, 349), },
		{
			id: 189, natiId: 350, name: "Milotic", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0350-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0350-f"), },
			],
		},
		{ id: 190, natiId: 131, name: "Lapras", img: ({ gameKey }) => baseSprite(gameKey, 131), imgS: ({ gameKey }) => shinySprite(gameKey, 131), tags: ["gigantamax"], },
		{ id: 191, natiId: 304, name: "Aron", img: ({ gameKey }) => baseSprite(gameKey, 304), imgS: ({ gameKey }) => shinySprite(gameKey, 304), },
		{ id: 192, natiId: 305, name: "Lairon", img: ({ gameKey }) => baseSprite(gameKey, 305), imgS: ({ gameKey }) => shinySprite(gameKey, 305), },
		{ id: 193, natiId: 306, name: "Aggron", img: ({ gameKey }) => baseSprite(gameKey, 306), imgS: ({ gameKey }) => shinySprite(gameKey, 306), },
		{ id: 194, natiId: 147, name: "Dratini", img: ({ gameKey }) => baseSprite(gameKey, 147), imgS: ({ gameKey }) => shinySprite(gameKey, 147), tags: ["pseudo"], },
		{ id: 195, natiId: 148, name: "Dragonair", img: ({ gameKey }) => baseSprite(gameKey, 148), imgS: ({ gameKey }) => shinySprite(gameKey, 148), tags: ["pseudo"], },
		{ id: 196, natiId: 149, name: "Dragonite", img: ({ gameKey }) => baseSprite(gameKey, 149), imgS: ({ gameKey }) => shinySprite(gameKey, 149), tags: ["pseudo"], },
		{ id: 197, natiId: 377, name: "Regirock", img: ({ gameKey }) => baseSprite(gameKey, 377), imgS: ({ gameKey }) => shinySprite(gameKey, 377), tags: ["legendary"], },
		{ id: 198, natiId: 378, name: "Regice", img: ({ gameKey }) => baseSprite(gameKey, 378), imgS: ({ gameKey }) => shinySprite(gameKey, 378), tags: ["legendary"], },
		{ id: 199, natiId: 379, name: "Registeel", img: ({ gameKey }) => baseSprite(gameKey, 379), imgS: ({ gameKey }) => shinySprite(gameKey, 379), tags: ["legendary"], },
		{ id: 200, natiId: 894, name: "Regieleki", img: ({ gameKey }) => baseSprite(gameKey, 894), imgS: ({ gameKey }) => shinySprite(gameKey, 894), tags: ["legendary"], },
		{ id: 201, natiId: 895, name: "Regidrago", img: ({ gameKey }) => baseSprite(gameKey, 895), imgS: ({ gameKey }) => shinySprite(gameKey, 895), tags: ["legendary"], },
		{
			id: 202, natiId: 144, name: "Articuno", img: ({ gameKey }) => baseSprite(gameKey, "0144-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0144-g"), tags: ["legendary"], forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 144), imgS: ({ gameKey }) => shinySprite(gameKey, 144), tags: ["legendary"], },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0144-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0144-g"), tags: ["galarian", "legendary"], },
			],
		},
		{
			id: 203, natiId: 145, name: "Zapdos", img: ({ gameKey }) => baseSprite(gameKey, "0145-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0145-g"), tags: ["legendary"], forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 145), imgS: ({ gameKey }) => shinySprite(gameKey, 145), tags: ["legendary"], },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0145-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0145-g"), tags: ["galarian", "legendary"], },
			],
		},
		{
			id: 204, natiId: 146, name: "Moltres", img: ({ gameKey }) => baseSprite(gameKey, "0146-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0146-g"), tags: ["legendary"], forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 146), imgS: ({ gameKey }) => shinySprite(gameKey, 146), tags: ["legendary"], },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0146-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0146-g"), tags: ["galarian", "legendary"], },
			],
		},
		{ id: 205, natiId: 638, name: "Cobalion", img: ({ gameKey }) => baseSprite(gameKey, 638), imgS: ({ gameKey }) => shinySprite(gameKey, 638), tags: ["legendary"], },
		{ id: 206, natiId: 639, name: "Terrakion", img: ({ gameKey }) => baseSprite(gameKey, 639), imgS: ({ gameKey }) => shinySprite(gameKey, 639), tags: ["legendary"], },
		{ id: 207, natiId: 640, name: "Virizion", img: ({ gameKey }) => baseSprite(gameKey, 640), imgS: ({ gameKey }) => shinySprite(gameKey, 640), tags: ["legendary"], },
		{ id: 208, natiId: 896, name: "Glastrier", img: ({ gameKey }) => baseSprite(gameKey, 896), imgS: ({ gameKey }) => shinySprite(gameKey, 896), tags: ["legendary"], },
		{ id: 209, natiId: 897, name: "Spectrier", img: ({ gameKey }) => baseSprite(gameKey, 897), imgS: ({ gameKey }) => shinySprite(gameKey, 897), tags: ["legendary"], },
		{ id: 210, natiId: 898, name: "Calyrex", img: ({ gameKey }) => baseSprite(gameKey, 898), imgS: ({ gameKey }) => shinySprite(gameKey, 898), tags: ["legendary"], }
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();