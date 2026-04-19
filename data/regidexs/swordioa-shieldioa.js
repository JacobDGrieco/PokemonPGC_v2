import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 8;
	const GAME_KEYS = ["swordioa", "shieldioa"];
	const DEX_NAME = "Isle of Armor Dex";

	const baseSprite = (gameKey, natiId) => dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{
			id: 1, natiId: 79, name: "Slowpoke", img: ({ gameKey }) => baseSprite(gameKey, "0079-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0079-g"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 79), imgS: ({ gameKey }) => shinySprite(gameKey, 79), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0079-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0079-g"), tags: ["galarian"], },
			],
		},
		{
			id: 2, natiId: 80, name: "Slowbro", img: ({ gameKey }) => baseSprite(gameKey, "0080-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0080-g"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 80), imgS: ({ gameKey }) => shinySprite(gameKey, 80), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0080-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0080-g"), tags: ["galarian"], },
			],
		},
		{
			id: 3, natiId: 199, name: "Slowking", img: ({ gameKey }) => baseSprite(gameKey, "0199-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0199-g"), forms: [
				{ name: "Johtonian", img: ({ gameKey }) => baseSprite(gameKey, 199), imgS: ({ gameKey }) => shinySprite(gameKey, 199), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0199-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0199-g"), tags: ["galarian"], },
			],
		},
		{ id: 4, natiId: 427, name: "Buneary", img: ({ gameKey }) => baseSprite(gameKey, 427), imgS: ({ gameKey }) => shinySprite(gameKey, 427), },
		{ id: 5, natiId: 428, name: "Lopunny", img: ({ gameKey }) => baseSprite(gameKey, 428), imgS: ({ gameKey }) => shinySprite(gameKey, 428), },
		{ id: 6, natiId: 440, name: "Happiny", img: ({ gameKey }) => baseSprite(gameKey, 440), imgS: ({ gameKey }) => shinySprite(gameKey, 440), },
		{ id: 7, natiId: 113, name: "Chansey", img: ({ gameKey }) => baseSprite(gameKey, 113), imgS: ({ gameKey }) => shinySprite(gameKey, 113), },
		{ id: 8, natiId: 242, name: "Blissey", img: ({ gameKey }) => baseSprite(gameKey, 242), imgS: ({ gameKey }) => shinySprite(gameKey, 242), },
		{ id: 9, natiId: 819, name: "Skwovet", img: ({ gameKey }) => baseSprite(gameKey, 819), imgS: ({ gameKey }) => shinySprite(gameKey, 819), },
		{ id: 10, natiId: 820, name: "Greedent", img: ({ gameKey }) => baseSprite(gameKey, 820), imgS: ({ gameKey }) => shinySprite(gameKey, 820), },
		{ id: 11, natiId: 174, name: "Igglybuff", img: ({ gameKey }) => baseSprite(gameKey, 174), imgS: ({ gameKey }) => shinySprite(gameKey, 174), },
		{ id: 12, natiId: 39, name: "Jigglypuff", img: ({ gameKey }) => baseSprite(gameKey, 39), imgS: ({ gameKey }) => shinySprite(gameKey, 39), },
		{ id: 13, natiId: 40, name: "Wigglytuff", img: ({ gameKey }) => baseSprite(gameKey, 40), imgS: ({ gameKey }) => shinySprite(gameKey, 40), },
		{ id: 14, natiId: 824, name: "Blipbug", img: ({ gameKey }) => baseSprite(gameKey, 824), imgS: ({ gameKey }) => shinySprite(gameKey, 824), },
		{ id: 15, natiId: 825, name: "Dottler", img: ({ gameKey }) => baseSprite(gameKey, 825), imgS: ({ gameKey }) => shinySprite(gameKey, 825), },
		{ id: 16, natiId: 826, name: "Orbeetle", img: ({ gameKey }) => baseSprite(gameKey, 826), imgS: ({ gameKey }) => shinySprite(gameKey, 826), tags: ["gigantamax"] },
		{ id: 17, natiId: 753, name: "Fomantis", img: ({ gameKey }) => baseSprite(gameKey, 753), imgS: ({ gameKey }) => shinySprite(gameKey, 753), },
		{ id: 18, natiId: 754, name: "Lurantis", img: ({ gameKey }) => baseSprite(gameKey, 754), imgS: ({ gameKey }) => shinySprite(gameKey, 754), },
		{ id: 19, natiId: 840, name: "Applin", img: ({ gameKey }) => baseSprite(gameKey, 840), imgS: ({ gameKey }) => shinySprite(gameKey, 840), },
		{ id: 20, natiId: 841, name: "Flapple", img: ({ gameKey }) => baseSprite(gameKey, 841), imgS: ({ gameKey }) => shinySprite(gameKey, 841), tags: ["gigantamax"], },
		{ id: 21, natiId: 842, name: "Appletun", img: ({ gameKey }) => baseSprite(gameKey, 842), imgS: ({ gameKey }) => shinySprite(gameKey, 842), tags: ["gigantamax"], },
		{ id: 22, natiId: 661, name: "Fletchling", img: ({ gameKey }) => baseSprite(gameKey, 661), imgS: ({ gameKey }) => shinySprite(gameKey, 661), },
		{ id: 23, natiId: 662, name: "Fletchinder", img: ({ gameKey }) => baseSprite(gameKey, 662), imgS: ({ gameKey }) => shinySprite(gameKey, 662), },
		{ id: 24, natiId: 663, name: "Talonflame", img: ({ gameKey }) => baseSprite(gameKey, 663), imgS: ({ gameKey }) => shinySprite(gameKey, 663), },
		{
			id: 25, natiId: 403, name: "Shinx", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0403-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0403-f"), },
			],
		},
		{
			id: 26, natiId: 404, name: "Luxio", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0404-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0404-f"), },
			],
		},
		{
			id: 27, natiId: 405, name: "Luxray", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0405-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0405-f"), },
			],
		},
		{ id: 28, natiId: 707, name: "Klefki", img: ({ gameKey }) => baseSprite(gameKey, 707), imgS: ({ gameKey }) => shinySprite(gameKey, 707), },
		{ id: 29, natiId: 624, name: "Pawniard", img: ({ gameKey }) => baseSprite(gameKey, 624), imgS: ({ gameKey }) => shinySprite(gameKey, 624), },
		{ id: 30, natiId: 625, name: "Bisharp", img: ({ gameKey }) => baseSprite(gameKey, 625), imgS: ({ gameKey }) => shinySprite(gameKey, 625), },
		{ id: 31, natiId: 63, name: "Abra", img: ({ gameKey }) => baseSprite(gameKey, 63), imgS: ({ gameKey }) => shinySprite(gameKey, 63), },
		{
			id: 32, natiId: 64, name: "Kadabra", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0064-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0064-f"), },
			],
		},
		{
			id: 33, natiId: 65, name: "Alakazam", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0065-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0065-f"), },
			],
		},
		{ id: 34, natiId: 280, name: "Ralts", img: ({ gameKey }) => baseSprite(gameKey, 280), imgS: ({ gameKey }) => shinySprite(gameKey, 280), },
		{ id: 35, natiId: 281, name: "Kirlia", img: ({ gameKey }) => baseSprite(gameKey, 281), imgS: ({ gameKey }) => shinySprite(gameKey, 281), },
		{ id: 36, natiId: 282, name: "Gardevoir", img: ({ gameKey }) => baseSprite(gameKey, 282), imgS: ({ gameKey }) => shinySprite(gameKey, 282), },
		{ id: 37, natiId: 475, name: "Gallade", img: ({ gameKey }) => baseSprite(gameKey, 475), imgS: ({ gameKey }) => shinySprite(gameKey, 475), },
		{ id: 38, natiId: 98, name: "Krabby", img: ({ gameKey }) => baseSprite(gameKey, 98), imgS: ({ gameKey }) => shinySprite(gameKey, 98), },
		{ id: 39, natiId: 99, name: "Kingler", img: ({ gameKey }) => baseSprite(gameKey, 99), imgS: ({ gameKey }) => shinySprite(gameKey, 99), tags: ["gigantamax"], },
		{ id: 40, natiId: 72, name: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72), imgS: ({ gameKey }) => shinySprite(gameKey, 72), },
		{ id: 41, natiId: 73, name: "Tentacruel", img: ({ gameKey }) => baseSprite(gameKey, 73), imgS: ({ gameKey }) => shinySprite(gameKey, 73), },
		{
			id: 42, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), },
			],
		},
		{
			id: 43, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },
			],
		},
		{ id: 44, natiId: 223, name: "Remoraid", img: ({ gameKey }) => baseSprite(gameKey, 223), imgS: ({ gameKey }) => shinySprite(gameKey, 223), },
		{
			id: 45, natiId: 224, name: "Octillery", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0224-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0224-f"), },
			],
		},
		{ id: 46, natiId: 458, name: "Mantyke", img: ({ gameKey }) => baseSprite(gameKey, 458), imgS: ({ gameKey }) => shinySprite(gameKey, 458), },
		{ id: 47, natiId: 226, name: "Mantine", img: ({ gameKey }) => baseSprite(gameKey, 226), imgS: ({ gameKey }) => shinySprite(gameKey, 226), },
		{ id: 48, natiId: 278, name: "Wingull", img: ({ gameKey }) => baseSprite(gameKey, 278), imgS: ({ gameKey }) => shinySprite(gameKey, 278), },
		{ id: 49, natiId: 279, name: "Pelipper", img: ({ gameKey }) => baseSprite(gameKey, 279), imgS: ({ gameKey }) => shinySprite(gameKey, 279), },
		{ id: 50, natiId: 451, name: "Skorupi", img: ({ gameKey }) => baseSprite(gameKey, 451), imgS: ({ gameKey }) => shinySprite(gameKey, 451), },
		{ id: 51, natiId: 452, name: "Drapion", img: ({ gameKey }) => baseSprite(gameKey, 452), imgS: ({ gameKey }) => shinySprite(gameKey, 452), },
		{ id: 52, natiId: 206, name: "Dunsparce", img: ({ gameKey }) => baseSprite(gameKey, 206), imgS: ({ gameKey }) => shinySprite(gameKey, 206), },
		{ id: 53, natiId: 626, name: "Bouffalant", img: ({ gameKey }) => baseSprite(gameKey, 626), imgS: ({ gameKey }) => shinySprite(gameKey, 626), },
		{ id: 54, natiId: 108, name: "Lickitung", img: ({ gameKey }) => baseSprite(gameKey, 108), imgS: ({ gameKey }) => shinySprite(gameKey, 108), },
		{ id: 55, natiId: 463, name: "Lickilicky", img: ({ gameKey }) => baseSprite(gameKey, 463), imgS: ({ gameKey }) => shinySprite(gameKey, 463), },
		{ id: 56, natiId: 833, name: "Chewtle", img: ({ gameKey }) => baseSprite(gameKey, 833), imgS: ({ gameKey }) => shinySprite(gameKey, 833), },
		{ id: 57, natiId: 834, name: "Drednaw", img: ({ gameKey }) => baseSprite(gameKey, 834), imgS: ({ gameKey }) => shinySprite(gameKey, 834), tags: ["gigantamax"], },
		{
			id: 58, natiId: 194, name: "Wooper", img: ({ gameKey }) => baseSprite(gameKey, 194), imgS: ({ gameKey }) => shinySprite(gameKey, 194), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 194), imgS: ({ gameKey }) => shinySprite(gameKey, 194), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0194-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0194-f"), },
			],
		},
		{
			id: 59, natiId: 195, name: "Quagsire", img: ({ gameKey }) => baseSprite(gameKey, 195), imgS: ({ gameKey }) => shinySprite(gameKey, 195), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 195), imgS: ({ gameKey }) => shinySprite(gameKey, 195), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0195-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0195-f"), },
			],
		},
		{ id: 60, natiId: 704, name: "Goomy", img: ({ gameKey }) => baseSprite(gameKey, 704), imgS: ({ gameKey }) => shinySprite(gameKey, 704), tags: ["pseudo"], },
		{ id: 61, natiId: 705, name: "Sliggoo", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), tags: ["pseudo"], },
		{ id: 62, natiId: 706, name: "Goodra", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), tags: ["pseudo"], },
		{ id: 63, natiId: 621, name: "Druddigon", img: ({ gameKey }) => baseSprite(gameKey, 621), imgS: ({ gameKey }) => shinySprite(gameKey, 621), },
		{ id: 64, natiId: 616, name: "Shelmet", img: ({ gameKey }) => baseSprite(gameKey, 616), imgS: ({ gameKey }) => shinySprite(gameKey, 616), },
		{ id: 65, natiId: 617, name: "Accelgor", img: ({ gameKey }) => baseSprite(gameKey, 617), imgS: ({ gameKey }) => shinySprite(gameKey, 617), },
		{ id: 66, natiId: 588, name: "Karrablast", img: ({ gameKey }) => baseSprite(gameKey, 588), imgS: ({ gameKey }) => shinySprite(gameKey, 588), },
		{ id: 67, natiId: 589, name: "Escavalier", img: ({ gameKey }) => baseSprite(gameKey, 589), imgS: ({ gameKey }) => shinySprite(gameKey, 589), },
		{ id: 68, natiId: 1, name: "Bulbasaur", img: ({ gameKey }) => baseSprite(gameKey, 1), imgS: ({ gameKey }) => shinySprite(gameKey, 1), tags: ["starter"], },
		{ id: 69, natiId: 2, name: "Ivysaur", img: ({ gameKey }) => baseSprite(gameKey, 2), imgS: ({ gameKey }) => shinySprite(gameKey, 2), tags: ["starter"], },
		{
			id: 70, natiId: 3, name: "Venusaur", img: ({ gameKey }) => baseSprite(gameKey, 3), imgS: ({ gameKey }) => shinySprite(gameKey, 3), tags: ["gender", "starter", "gigantamax"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 3), imgS: ({ gameKey }) => shinySprite(gameKey, 3), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0003-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0003-f"), },
			],
		},
		{ id: 71, natiId: 7, name: "Squirtle", img: ({ gameKey }) => baseSprite(gameKey, 7), imgS: ({ gameKey }) => shinySprite(gameKey, 7), tags: ["starter"], },
		{ id: 72, natiId: 8, name: "Wartortle", img: ({ gameKey }) => baseSprite(gameKey, 8), imgS: ({ gameKey }) => shinySprite(gameKey, 8), tags: ["starter"], },
		{ id: 73, natiId: 9, name: "Blastoise", img: ({ gameKey }) => baseSprite(gameKey, 9), imgS: ({ gameKey }) => shinySprite(gameKey, 9), tags: ["starter", "gigantamax"], },
		{ id: 74, natiId: 543, name: "Venipede", img: ({ gameKey }) => baseSprite(gameKey, 543), imgS: ({ gameKey }) => shinySprite(gameKey, 543), },
		{ id: 75, natiId: 544, name: "Whirlipede", img: ({ gameKey }) => baseSprite(gameKey, 544), imgS: ({ gameKey }) => shinySprite(gameKey, 544), },
		{ id: 76, natiId: 545, name: "Scolipede", img: ({ gameKey }) => baseSprite(gameKey, 545), imgS: ({ gameKey }) => shinySprite(gameKey, 545), },
		{ id: 77, natiId: 590, name: "Foongus", img: ({ gameKey }) => baseSprite(gameKey, 590), imgS: ({ gameKey }) => shinySprite(gameKey, 590), },
		{ id: 78, natiId: 591, name: "Amoonguss", img: ({ gameKey }) => baseSprite(gameKey, 591), imgS: ({ gameKey }) => shinySprite(gameKey, 591), },
		{ id: 79, natiId: 764, name: "Comfey", img: ({ gameKey }) => baseSprite(gameKey, 764), imgS: ({ gameKey }) => shinySprite(gameKey, 764), },
		{ id: 80, natiId: 114, name: "Tangela", img: ({ gameKey }) => baseSprite(gameKey, 114), imgS: ({ gameKey }) => shinySprite(gameKey, 114), },
		{
			id: 81, natiId: 465, name: "Tangrowth", img: ({ gameKey }) => baseSprite(gameKey, 465), imgS: ({ gameKey }) => shinySprite(gameKey, 465), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 465), imgS: ({ gameKey }) => shinySprite(gameKey, 465), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0465-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0465-f"), },
			],
		},
		{
			id: 82, natiId: 453, name: "Croagunk", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0453-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0453-f"), },
			],
		},
		{
			id: 83, natiId: 454, name: "Toxicroak", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0454-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0454-f"), },
			],
		},
		{ id: 84, natiId: 172, name: "Pichu", img: ({ gameKey }) => baseSprite(gameKey, 172), imgS: ({ gameKey }) => shinySprite(gameKey, 172), },
		{
			id: 85, natiId: 25, name: "Pikachu", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), tags: ["gender", "other", "gigantamax"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0025-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-f"), },
				{ name: "Alola Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-a"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Hoenn Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-h"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Kalos Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-k"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-k"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Original Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-o"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Partner Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-p"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Sinnoh Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-s"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "Unova Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-u"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-u"), maxStatus: "caught", tags: ["mythical"], },
				{ name: "World Cap", img: ({ gameKey }) => baseSprite(gameKey, "0025-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-w"), maxStatus: "caught", tags: ["mythical"], },
			],
		},
		{
			id: 86, natiId: 26, name: "Raichu", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), tags: ["gender"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0026-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0026-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-a"), tags: ["alolan"], },
			],
		},
		{ id: 87, natiId: 570, name: "Zorua", img: ({ gameKey }) => baseSprite(gameKey, 570), imgS: ({ gameKey }) => shinySprite(gameKey, 570), },
		{ id: 88, natiId: 571, name: "Zoroark", img: ({ gameKey }) => baseSprite(gameKey, 571), imgS: ({ gameKey }) => shinySprite(gameKey, 571), },
		{ id: 89, natiId: 765, name: "Oranguru", img: ({ gameKey }) => baseSprite(gameKey, 765), imgS: ({ gameKey }) => shinySprite(gameKey, 765), },
		{ id: 90, natiId: 766, name: "Passimian", img: ({ gameKey }) => baseSprite(gameKey, 766), imgS: ({ gameKey }) => shinySprite(gameKey, 766), },
		{ id: 91, natiId: 341, name: "Corphish", img: ({ gameKey }) => baseSprite(gameKey, 341), imgS: ({ gameKey }) => shinySprite(gameKey, 341), },
		{ id: 92, natiId: 342, name: "Crawdaunt", img: ({ gameKey }) => baseSprite(gameKey, 342), imgS: ({ gameKey }) => shinySprite(gameKey, 342), },
		{ id: 93, natiId: 845, name: "Cramorant", img: ({ gameKey }) => baseSprite(gameKey, 845), imgS: ({ gameKey }) => shinySprite(gameKey, 845), },
		{
			id: 94, natiId: 118, name: "Goldeen", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0118-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0118-f"), },
			],
		},
		{
			id: 95, natiId: 119, name: "Seaking", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0119-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0119-f"), },
			],
		},
		{ id: 96, natiId: 846, name: "Arrokuda", img: ({ gameKey }) => baseSprite(gameKey, 846), imgS: ({ gameKey }) => shinySprite(gameKey, 846), },
		{ id: 97, natiId: 847, name: "Barraskewda", img: ({ gameKey }) => baseSprite(gameKey, 847), imgS: ({ gameKey }) => shinySprite(gameKey, 847), },
		{ id: 98, natiId: 120, name: "Staryu", img: ({ gameKey }) => baseSprite(gameKey, 120), imgS: ({ gameKey }) => shinySprite(gameKey, 120), },
		{ id: 99, natiId: 121, name: "Starmie", img: ({ gameKey }) => baseSprite(gameKey, 121), imgS: ({ gameKey }) => shinySprite(gameKey, 121), },
		{ id: 100, natiId: 891, name: "Kubfu", img: ({ gameKey }) => baseSprite(gameKey, 891), imgS: ({ gameKey }) => shinySprite(gameKey, 891), maxStatus: "caught", tags: ["legendary"], },
		{
			id: 101, natiId: 892, name: "Urshifu", img: ({ gameKey }) => baseSprite(gameKey, 892), imgS: ({ gameKey }) => shinySprite(gameKey, 892), maxStatus: "caught", tags: ["other", "gigantamax", "legendary"], forms: [
				{ name: "Single Strike Style", img: ({ gameKey }) => baseSprite(gameKey, 892), imgS: ({ gameKey }) => shinySprite(gameKey, 892), maxStatus: "caught", },
				{ name: "Rapid Strike Style", img: ({ gameKey }) => baseSprite(gameKey, "0892-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0892-r"), maxStatus: "caught", },
			],
		},
		{ id: 102, natiId: 587, name: "Emolga", img: ({ gameKey }) => baseSprite(gameKey, 587), imgS: ({ gameKey }) => shinySprite(gameKey, 587), },
		{ id: 103, natiId: 702, name: "Dedenne", img: ({ gameKey }) => baseSprite(gameKey, 702), imgS: ({ gameKey }) => shinySprite(gameKey, 702), },
		{ id: 104, natiId: 877, name: "Morpeko", img: ({ gameKey }) => baseSprite(gameKey, 877), imgS: ({ gameKey }) => shinySprite(gameKey, 877), },
		{ id: 105, natiId: 81, name: "Magnemite", img: ({ gameKey }) => baseSprite(gameKey, 81), imgS: ({ gameKey }) => shinySprite(gameKey, 81), },
		{ id: 106, natiId: 82, name: "Magneton", img: ({ gameKey }) => baseSprite(gameKey, 82), imgS: ({ gameKey }) => shinySprite(gameKey, 82), },
		{ id: 107, natiId: 462, name: "Magnezone", img: ({ gameKey }) => baseSprite(gameKey, 462), imgS: ({ gameKey }) => shinySprite(gameKey, 462), },
		{ id: 108, natiId: 686, name: "Inkay", img: ({ gameKey }) => baseSprite(gameKey, 686), imgS: ({ gameKey }) => shinySprite(gameKey, 686), },
		{ id: 109, natiId: 687, name: "Malamar", img: ({ gameKey }) => baseSprite(gameKey, 687), imgS: ({ gameKey }) => shinySprite(gameKey, 687), },
		{ id: 110, natiId: 746, name: "Wishiwashi", img: ({ gameKey }) => baseSprite(gameKey, 746), imgS: ({ gameKey }) => shinySprite(gameKey, 746), },
		{ id: 111, natiId: 318, name: "Carvanha", img: ({ gameKey }) => baseSprite(gameKey, 318), imgS: ({ gameKey }) => shinySprite(gameKey, 318), },
		{ id: 112, natiId: 319, name: "Sharpedo", img: ({ gameKey }) => baseSprite(gameKey, 319), imgS: ({ gameKey }) => shinySprite(gameKey, 319), },
		{ id: 113, natiId: 506, name: "Lillipup", img: ({ gameKey }) => baseSprite(gameKey, 506), imgS: ({ gameKey }) => shinySprite(gameKey, 506), },
		{ id: 114, natiId: 507, name: "Herdier", img: ({ gameKey }) => baseSprite(gameKey, 507), imgS: ({ gameKey }) => shinySprite(gameKey, 507), },
		{ id: 115, natiId: 508, name: "Stoutland", img: ({ gameKey }) => baseSprite(gameKey, 508), imgS: ({ gameKey }) => shinySprite(gameKey, 508), },
		{ id: 116, natiId: 128, name: "Tauros", img: ({ gameKey }) => baseSprite(gameKey, 128), imgS: ({ gameKey }) => shinySprite(gameKey, 128), },
		{ id: 117, natiId: 241, name: "Miltank", img: ({ gameKey }) => baseSprite(gameKey, 241), imgS: ({ gameKey }) => shinySprite(gameKey, 241), },
		{
			id: 118, natiId: 123, name: "Scyther", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0123-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0123-f"), },
			],
		},
		{
			id: 119, natiId: 212, name: "Scizor", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0212-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0212-f"), },
			],
		},
		{ id: 120, natiId: 127, name: "Pinsir", img: ({ gameKey }) => baseSprite(gameKey, 127), imgS: ({ gameKey }) => shinySprite(gameKey, 127), },
		{
			id: 121, natiId: 214, name: "Heracross", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0214-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0214-f"), },
			],
		},
		{ id: 122, natiId: 557, name: "Dwebble", img: ({ gameKey }) => baseSprite(gameKey, 557), imgS: ({ gameKey }) => shinySprite(gameKey, 557), },
		{ id: 123, natiId: 558, name: "Crustle", img: ({ gameKey }) => baseSprite(gameKey, 558), imgS: ({ gameKey }) => shinySprite(gameKey, 558), },
		{ id: 124, natiId: 767, name: "Wimpod", img: ({ gameKey }) => baseSprite(gameKey, 767), imgS: ({ gameKey }) => shinySprite(gameKey, 767), },
		{ id: 125, natiId: 768, name: "Golisopod", img: ({ gameKey }) => baseSprite(gameKey, 768), imgS: ({ gameKey }) => shinySprite(gameKey, 768), },
		{ id: 126, natiId: 871, name: "Pincurchin", img: ({ gameKey }) => baseSprite(gameKey, 871), imgS: ({ gameKey }) => shinySprite(gameKey, 871), },
		{ id: 127, natiId: 747, name: "Mareanie", img: ({ gameKey }) => baseSprite(gameKey, 747), imgS: ({ gameKey }) => shinySprite(gameKey, 747), },
		{ id: 128, natiId: 748, name: "Toxapex", img: ({ gameKey }) => baseSprite(gameKey, 748), imgS: ({ gameKey }) => shinySprite(gameKey, 748), },
		{ id: 129, natiId: 852, name: "Clobbopus", img: ({ gameKey }) => baseSprite(gameKey, 852), imgS: ({ gameKey }) => shinySprite(gameKey, 852), },
		{ id: 130, natiId: 853, name: "Grapploct", img: ({ gameKey }) => baseSprite(gameKey, 853), imgS: ({ gameKey }) => shinySprite(gameKey, 853), },
		{ id: 131, natiId: 90, name: "Shellder", img: ({ gameKey }) => baseSprite(gameKey, 90), imgS: ({ gameKey }) => shinySprite(gameKey, 90), },
		{ id: 132, natiId: 91, name: "Cloyster", img: ({ gameKey }) => baseSprite(gameKey, 91), imgS: ({ gameKey }) => shinySprite(gameKey, 91), },
		{ id: 133, natiId: 769, name: "Sandygast", img: ({ gameKey }) => baseSprite(gameKey, 769), imgS: ({ gameKey }) => shinySprite(gameKey, 769), },
		{ id: 134, natiId: 770, name: "Palossand", img: ({ gameKey }) => baseSprite(gameKey, 770), imgS: ({ gameKey }) => shinySprite(gameKey, 770), },
		{ id: 135, natiId: 425, name: "Drifloon", img: ({ gameKey }) => baseSprite(gameKey, 425), imgS: ({ gameKey }) => shinySprite(gameKey, 425), },
		{ id: 136, natiId: 426, name: "Drifblim", img: ({ gameKey }) => baseSprite(gameKey, 426), imgS: ({ gameKey }) => shinySprite(gameKey, 426), },
		{ id: 137, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339), },
		{ id: 138, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340), },
		{ id: 139, natiId: 298, name: "Azurill", img: ({ gameKey }) => baseSprite(gameKey, 298), imgS: ({ gameKey }) => shinySprite(gameKey, 298), },
		{ id: 140, natiId: 183, name: "Marill", img: ({ gameKey }) => baseSprite(gameKey, 183), imgS: ({ gameKey }) => shinySprite(gameKey, 183), },
		{ id: 141, natiId: 184, name: "Azumarill", img: ({ gameKey }) => baseSprite(gameKey, 184), imgS: ({ gameKey }) => shinySprite(gameKey, 184), },
		{ id: 142, natiId: 60, name: "Poliwag", img: ({ gameKey }) => baseSprite(gameKey, 60), imgS: ({ gameKey }) => shinySprite(gameKey, 60), },
		{ id: 143, natiId: 61, name: "Poliwhirl", img: ({ gameKey }) => baseSprite(gameKey, 61), imgS: ({ gameKey }) => shinySprite(gameKey, 61), },
		{ id: 144, natiId: 62, name: "Poliwrath", img: ({ gameKey }) => baseSprite(gameKey, 62), imgS: ({ gameKey }) => shinySprite(gameKey, 62), },
		{
			id: 145, natiId: 186, name: "Politoed", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0186-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0186-f"), },
			],
		},
		{ id: 146, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54), },
		{ id: 147, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55), },
		{ id: 148, natiId: 293, name: "Whismur", img: ({ gameKey }) => baseSprite(gameKey, 293), imgS: ({ gameKey }) => shinySprite(gameKey, 293), },
		{ id: 149, natiId: 294, name: "Loudred", img: ({ gameKey }) => baseSprite(gameKey, 294), imgS: ({ gameKey }) => shinySprite(gameKey, 294), },
		{ id: 150, natiId: 295, name: "Exploud", img: ({ gameKey }) => baseSprite(gameKey, 295), imgS: ({ gameKey }) => shinySprite(gameKey, 295), },
		{ id: 151, natiId: 527, name: "Woobat", img: ({ gameKey }) => baseSprite(gameKey, 527), imgS: ({ gameKey }) => shinySprite(gameKey, 527), },
		{ id: 152, natiId: 528, name: "Swoobat", img: ({ gameKey }) => baseSprite(gameKey, 528), imgS: ({ gameKey }) => shinySprite(gameKey, 528), },
		{ id: 153, natiId: 227, name: "Skarmory", img: ({ gameKey }) => baseSprite(gameKey, 227), imgS: ({ gameKey }) => shinySprite(gameKey, 227), },
		{ id: 154, natiId: 524, name: "Roggenrola", img: ({ gameKey }) => baseSprite(gameKey, 524), imgS: ({ gameKey }) => shinySprite(gameKey, 524), },
		{ id: 155, natiId: 525, name: "Boldore", img: ({ gameKey }) => baseSprite(gameKey, 525), imgS: ({ gameKey }) => shinySprite(gameKey, 525), },
		{ id: 156, natiId: 526, name: "Gigalith", img: ({ gameKey }) => baseSprite(gameKey, 526), imgS: ({ gameKey }) => shinySprite(gameKey, 526), },
		{ id: 157, natiId: 744, name: "Rockruff", img: ({ gameKey }) => baseSprite(gameKey, 744), imgS: ({ gameKey }) => shinySprite(gameKey, 744), },
		{
			id: 158, natiId: 745, name: "Lycanroc", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), tags: ["other"], forms: [
				{ name: "Midday", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), },
				{ name: "Midnight", img: ({ gameKey }) => baseSprite(gameKey, "0745-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-m"), },
				{ name: "Dusk", img: ({ gameKey }) => baseSprite(gameKey, "0745-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-d"), },
			],
		},
		{ id: 159, natiId: 757, name: "Salandit", img: ({ gameKey }) => baseSprite(gameKey, 757), imgS: ({ gameKey }) => shinySprite(gameKey, 757), },
		{ id: 160, natiId: 758, name: "Salazzle", img: ({ gameKey }) => baseSprite(gameKey, 758), imgS: ({ gameKey }) => shinySprite(gameKey, 758), },
		{ id: 161, natiId: 559, name: "Scraggy", img: ({ gameKey }) => baseSprite(gameKey, 559), imgS: ({ gameKey }) => shinySprite(gameKey, 559), },
		{ id: 162, natiId: 560, name: "Scrafty", img: ({ gameKey }) => baseSprite(gameKey, 560), imgS: ({ gameKey }) => shinySprite(gameKey, 560), },
		{ id: 163, natiId: 619, name: "Mienfoo", img: ({ gameKey }) => baseSprite(gameKey, 619), imgS: ({ gameKey }) => shinySprite(gameKey, 619), },
		{ id: 164, natiId: 620, name: "Mienshao", img: ({ gameKey }) => baseSprite(gameKey, 620), imgS: ({ gameKey }) => shinySprite(gameKey, 620), },
		{ id: 165, natiId: 782, name: "Jangmo-o", img: ({ gameKey }) => baseSprite(gameKey, 782), imgS: ({ gameKey }) => shinySprite(gameKey, 782), tags: ["pseudo"], },
		{ id: 166, natiId: 783, name: "Hakamo-o", img: ({ gameKey }) => baseSprite(gameKey, 783), imgS: ({ gameKey }) => shinySprite(gameKey, 783), tags: ["pseudo"], },
		{ id: 167, natiId: 784, name: "Kommo-o", img: ({ gameKey }) => baseSprite(gameKey, 784), imgS: ({ gameKey }) => shinySprite(gameKey, 784), tags: ["pseudo"], },
		{
			id: 168, natiId: 27, name: "Sandshrew", img: ({ gameKey }) => baseSprite(gameKey, 27), imgS: ({ gameKey }) => shinySprite(gameKey, 27), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 27), imgS: ({ gameKey }) => shinySprite(gameKey, 27), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0027-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0027-a"), tags: ["alolan"], },
			],
		},
		{
			id: 169, natiId: 28, name: "Sandslash", img: ({ gameKey }) => baseSprite(gameKey, 28), imgS: ({ gameKey }) => shinySprite(gameKey, 28), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 28), imgS: ({ gameKey }) => shinySprite(gameKey, 28), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0028-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0028-a"), tags: ["alolan"], },
			],
		},
		{ id: 170, natiId: 104, name: "Cubone", img: ({ gameKey }) => baseSprite(gameKey, 104), imgS: ({ gameKey }) => shinySprite(gameKey, 104), },
		{
			id: 171, natiId: 105, name: "Marowak", img: ({ gameKey }) => baseSprite(gameKey, 105), imgS: ({ gameKey }) => shinySprite(gameKey, 105), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 105), imgS: ({ gameKey }) => shinySprite(gameKey, 105), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0105-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0105-a"), tags: ["alolan"], },
			],
		},
		{ id: 172, natiId: 115, name: "Kangaskhan", img: ({ gameKey }) => baseSprite(gameKey, 115), imgS: ({ gameKey }) => shinySprite(gameKey, 115), },
		{ id: 173, natiId: 324, name: "Torkoal", img: ({ gameKey }) => baseSprite(gameKey, 324), imgS: ({ gameKey }) => shinySprite(gameKey, 324), },
		{ id: 174, natiId: 843, name: "Silicobra", img: ({ gameKey }) => baseSprite(gameKey, 843), imgS: ({ gameKey }) => shinySprite(gameKey, 843), },
		{ id: 175, natiId: 844, name: "Sandaconda", img: ({ gameKey }) => baseSprite(gameKey, 844), imgS: ({ gameKey }) => shinySprite(gameKey, 844), tags: ["gigantamax"], },
		{ id: 176, natiId: 551, name: "Sandile", img: ({ gameKey }) => baseSprite(gameKey, 551), imgS: ({ gameKey }) => shinySprite(gameKey, 551), },
		{ id: 177, natiId: 552, name: "Krokorok", img: ({ gameKey }) => baseSprite(gameKey, 552), imgS: ({ gameKey }) => shinySprite(gameKey, 552), },
		{ id: 178, natiId: 553, name: "Krookodile", img: ({ gameKey }) => baseSprite(gameKey, 553), imgS: ({ gameKey }) => shinySprite(gameKey, 553), },
		{ id: 179, natiId: 627, name: "Rufflet", img: ({ gameKey }) => baseSprite(gameKey, 627), imgS: ({ gameKey }) => shinySprite(gameKey, 627), },
		{ id: 180, natiId: 628, name: "Braviary", img: ({ gameKey }) => baseSprite(gameKey, 628), imgS: ({ gameKey }) => shinySprite(gameKey, 628), },
		{ id: 181, natiId: 629, name: "Vullaby", img: ({ gameKey }) => baseSprite(gameKey, 629), imgS: ({ gameKey }) => shinySprite(gameKey, 629), },
		{ id: 182, natiId: 630, name: "Mandibuzz", img: ({ gameKey }) => baseSprite(gameKey, 630), imgS: ({ gameKey }) => shinySprite(gameKey, 630), },
		{
			id: 183, natiId: 111, name: "Rhyhorn", img: ({ gameKey }) => baseSprite(gameKey, 111), imgS: ({ gameKey }) => shinySprite(gameKey, 111), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 111), imgS: ({ gameKey }) => shinySprite(gameKey, 111), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0111-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0111-f"), },
			],
		},
		{
			id: 184, natiId: 112, name: "Rhydon", img: ({ gameKey }) => baseSprite(gameKey, 112), imgS: ({ gameKey }) => shinySprite(gameKey, 112), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 112), imgS: ({ gameKey }) => shinySprite(gameKey, 112), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0112-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0112-f"), },
			],
		},
		{
			id: 185, natiId: 464, name: "Rhyperior", img: ({ gameKey }) => baseSprite(gameKey, 464), imgS: ({ gameKey }) => shinySprite(gameKey, 464), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 464), imgS: ({ gameKey }) => shinySprite(gameKey, 464), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0464-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0464-f"), },
			],
		},
		{ id: 186, natiId: 636, name: "Larvesta", img: ({ gameKey }) => baseSprite(gameKey, 636), imgS: ({ gameKey }) => shinySprite(gameKey, 636), },
		{ id: 187, natiId: 637, name: "Volcarona", img: ({ gameKey }) => baseSprite(gameKey, 637), imgS: ({ gameKey }) => shinySprite(gameKey, 637), },
		{ id: 188, natiId: 170, name: "Chinchou", img: ({ gameKey }) => baseSprite(gameKey, 170), imgS: ({ gameKey }) => shinySprite(gameKey, 170), },
		{ id: 189, natiId: 171, name: "Lanturn", img: ({ gameKey }) => baseSprite(gameKey, 171), imgS: ({ gameKey }) => shinySprite(gameKey, 171), },
		{ id: 190, natiId: 320, name: "Wailmer", img: ({ gameKey }) => baseSprite(gameKey, 320), imgS: ({ gameKey }) => shinySprite(gameKey, 320), },
		{ id: 191, natiId: 321, name: "Wailord", img: ({ gameKey }) => baseSprite(gameKey, 321), imgS: ({ gameKey }) => shinySprite(gameKey, 321), },
		{
			id: 192, natiId: 592, name: "Frillish", img: ({ gameKey }) => baseSprite(gameKey, 592), imgS: ({ gameKey }) => shinySprite(gameKey, 592), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 592), imgS: ({ gameKey }) => shinySprite(gameKey, 592), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0592-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0592-f"), },
			],
		},
		{
			id: 193, natiId: 593, name: "Jellicent", img: ({ gameKey }) => baseSprite(gameKey, 593), imgS: ({ gameKey }) => shinySprite(gameKey, 593), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 593), imgS: ({ gameKey }) => shinySprite(gameKey, 593), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0593-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0593-f"), },
			],
		},
		{ id: 194, natiId: 690, name: "Skrelp", img: ({ gameKey }) => baseSprite(gameKey, 690), imgS: ({ gameKey }) => shinySprite(gameKey, 690), },
		{ id: 195, natiId: 691, name: "Dragalge", img: ({ gameKey }) => baseSprite(gameKey, 691), imgS: ({ gameKey }) => shinySprite(gameKey, 691), },
		{ id: 196, natiId: 692, name: "Clauncher", img: ({ gameKey }) => baseSprite(gameKey, 692), imgS: ({ gameKey }) => shinySprite(gameKey, 692), },
		{ id: 197, natiId: 693, name: "Clawitzer", img: ({ gameKey }) => baseSprite(gameKey, 693), imgS: ({ gameKey }) => shinySprite(gameKey, 693), },
		{ id: 198, natiId: 116, name: "Horsea", img: ({ gameKey }) => baseSprite(gameKey, 116), imgS: ({ gameKey }) => shinySprite(gameKey, 116), },
		{ id: 199, natiId: 117, name: "Seadra", img: ({ gameKey }) => baseSprite(gameKey, 117), imgS: ({ gameKey }) => shinySprite(gameKey, 117), },
		{ id: 200, natiId: 230, name: "Kingdra", img: ({ gameKey }) => baseSprite(gameKey, 230), imgS: ({ gameKey }) => shinySprite(gameKey, 230), },
		{ id: 201, natiId: 548, name: "Petilil", img: ({ gameKey }) => baseSprite(gameKey, 548), imgS: ({ gameKey }) => shinySprite(gameKey, 548), },
		{ id: 202, natiId: 549, name: "Lilligant", img: ({ gameKey }) => baseSprite(gameKey, 549), imgS: ({ gameKey }) => shinySprite(gameKey, 549), },
		{
			id: 203, natiId: 415, name: "Combee", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0415-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0415-f"), },
			],
		},
		{ id: 204, natiId: 416, name: "Vespiquen", img: ({ gameKey }) => baseSprite(gameKey, 416), imgS: ({ gameKey }) => shinySprite(gameKey, 416), },
		{ id: 205, natiId: 102, name: "Exeggcute", img: ({ gameKey }) => baseSprite(gameKey, 102), imgS: ({ gameKey }) => shinySprite(gameKey, 102), },
		{
			id: 206, natiId: 103, name: "Exeggutor", img: ({ gameKey }) => baseSprite(gameKey, 103), imgS: ({ gameKey }) => shinySprite(gameKey, 103), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 103), imgS: ({ gameKey }) => shinySprite(gameKey, 103), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0103-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0103-a"), tags: ["alolan"], },
			],
		},
		{ id: 207, natiId: 132, name: "Ditto", img: ({ gameKey }) => baseSprite(gameKey, 132), imgS: ({ gameKey }) => shinySprite(gameKey, 132), },
		{ id: 208, natiId: 137, name: "Porygon", img: ({ gameKey }) => baseSprite(gameKey, 137), imgS: ({ gameKey }) => shinySprite(gameKey, 137), },
		{ id: 209, natiId: 233, name: "Porygon2", img: ({ gameKey }) => baseSprite(gameKey, 233), imgS: ({ gameKey }) => shinySprite(gameKey, 233), },
		{ id: 210, natiId: 474, name: "Porygon-Z", img: ({ gameKey }) => baseSprite(gameKey, 474), imgS: ({ gameKey }) => shinySprite(gameKey, 474), },
		{
			id: 211, natiId: 893, name: "Zarude", img: ({ gameKey }) => baseSprite(gameKey, 893), imgS: ({ gameKey }) => shinySprite(gameKey, 893), maxStatus: "caught", tags: ["other", "mythical"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 893), imgS: ({ gameKey }) => shinySprite(gameKey, 893), maxStatus: "caught", },
				{ name: "Dada", img: ({ gameKey }) => baseSprite(gameKey, "0893-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0893-d"), maxStatus: "caught", },
			],
		}
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();