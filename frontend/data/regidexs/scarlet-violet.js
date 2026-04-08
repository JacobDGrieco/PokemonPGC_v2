import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 9;
	const GAME_KEYS = ["scarlet", "violet"];
	const DEX_NAME = "Paldea Dex";

	const baseSprite = (gameKey, natiId) => dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 906, name: "Sprigatito", img: ({ gameKey }) => baseSprite(gameKey, 906), imgS: ({ gameKey }) => shinySprite(gameKey, 906), tags: ["starter"], },
		{ id: 2, natiId: 907, name: "Floragato", img: ({ gameKey }) => baseSprite(gameKey, 907), imgS: ({ gameKey }) => shinySprite(gameKey, 907), tags: ["starter"], },
		{ id: 3, natiId: 908, name: "Meowscarada", img: ({ gameKey }) => baseSprite(gameKey, 908), imgS: ({ gameKey }) => shinySprite(gameKey, 908), tags: ["starter"], },
		{ id: 4, natiId: 909, name: "Fuecoco", img: ({ gameKey }) => baseSprite(gameKey, 909), imgS: ({ gameKey }) => shinySprite(gameKey, 909), tags: ["starter"], },
		{ id: 5, natiId: 910, name: "Crocalor", img: ({ gameKey }) => baseSprite(gameKey, 910), imgS: ({ gameKey }) => shinySprite(gameKey, 910), tags: ["starter"], },
		{ id: 6, natiId: 911, name: "Skeledirge", img: ({ gameKey }) => baseSprite(gameKey, 911), imgS: ({ gameKey }) => shinySprite(gameKey, 911), tags: ["starter"], },
		{ id: 7, natiId: 912, name: "Quaxly", img: ({ gameKey }) => baseSprite(gameKey, 912), imgS: ({ gameKey }) => shinySprite(gameKey, 912), tags: ["starter"], },
		{ id: 8, natiId: 913, name: "Quaxwell", img: ({ gameKey }) => baseSprite(gameKey, 913), imgS: ({ gameKey }) => shinySprite(gameKey, 913), tags: ["starter"], },
		{ id: 9, natiId: 914, name: "Quaquaval", img: ({ gameKey }) => baseSprite(gameKey, 914), imgS: ({ gameKey }) => shinySprite(gameKey, 914), tags: ["starter"], },
		{ id: 10, natiId: 915, name: "Lechonk", img: ({ gameKey }) => baseSprite(gameKey, 915), imgS: ({ gameKey }) => shinySprite(gameKey, 915), },
		{
			id: 11, natiId: 916, name: "Oinkologne", img: ({ gameKey }) => baseSprite(gameKey, 916), imgS: ({ gameKey }) => shinySprite(gameKey, 916), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 916), imgS: ({ gameKey }) => shinySprite(gameKey, 916), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0916-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0916-f"), }
			],
		},
		{ id: 12, natiId: 917, name: "Tarountula", img: ({ gameKey }) => baseSprite(gameKey, 917), imgS: ({ gameKey }) => shinySprite(gameKey, 917), },
		{ id: 13, natiId: 918, name: "Spidops", img: ({ gameKey }) => baseSprite(gameKey, 918), imgS: ({ gameKey }) => shinySprite(gameKey, 918), },
		{ id: 14, natiId: 919, name: "Nymble", img: ({ gameKey }) => baseSprite(gameKey, 919), imgS: ({ gameKey }) => shinySprite(gameKey, 919), },
		{ id: 15, natiId: 920, name: "Lokix", img: ({ gameKey }) => baseSprite(gameKey, 920), imgS: ({ gameKey }) => shinySprite(gameKey, 920), },
		{ id: 16, natiId: 187, name: "Hoppip", img: ({ gameKey }) => baseSprite(gameKey, 187), imgS: ({ gameKey }) => shinySprite(gameKey, 187), },
		{ id: 17, natiId: 188, name: "Skiploom", img: ({ gameKey }) => baseSprite(gameKey, 188), imgS: ({ gameKey }) => shinySprite(gameKey, 188), },
		{ id: 18, natiId: 189, name: "Jumpluff", img: ({ gameKey }) => baseSprite(gameKey, 189), imgS: ({ gameKey }) => shinySprite(gameKey, 189), },
		{ id: 19, natiId: 661, name: "Fletchling", img: ({ gameKey }) => baseSprite(gameKey, 661), imgS: ({ gameKey }) => shinySprite(gameKey, 661), },
		{ id: 20, natiId: 662, name: "Fletchinder", img: ({ gameKey }) => baseSprite(gameKey, 662), imgS: ({ gameKey }) => shinySprite(gameKey, 662), },
		{ id: 21, natiId: 663, name: "Talonflame", img: ({ gameKey }) => baseSprite(gameKey, 663), imgS: ({ gameKey }) => shinySprite(gameKey, 663), },
		{ id: 22, natiId: 921, name: "Pawmi", img: ({ gameKey }) => baseSprite(gameKey, 921), imgS: ({ gameKey }) => shinySprite(gameKey, 921), },
		{ id: 23, natiId: 922, name: "Pawmo", img: ({ gameKey }) => baseSprite(gameKey, 922), imgS: ({ gameKey }) => shinySprite(gameKey, 922), },
		{ id: 24, natiId: 923, name: "Pawmot", img: ({ gameKey }) => baseSprite(gameKey, 923), imgS: ({ gameKey }) => shinySprite(gameKey, 923), },
		{ id: 25, natiId: 228, name: "Houndour", img: ({ gameKey }) => baseSprite(gameKey, 228), imgS: ({ gameKey }) => shinySprite(gameKey, 228), },
		{
			id: 26, natiId: 229, name: "Houndoom", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0229-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0229-f"), },],
		},
		{ id: 27, natiId: 734, name: "Yungoos", img: ({ gameKey }) => baseSprite(gameKey, 734), imgS: ({ gameKey }) => shinySprite(gameKey, 734), },
		{ id: 28, natiId: 735, name: "Gumshoos", img: ({ gameKey }) => baseSprite(gameKey, 735), imgS: ({ gameKey }) => shinySprite(gameKey, 735), },
		{ id: 29, natiId: 819, name: "Skwovet", img: ({ gameKey }) => baseSprite(gameKey, 819), imgS: ({ gameKey }) => shinySprite(gameKey, 819), },
		{ id: 30, natiId: 820, name: "Greedent", img: ({ gameKey }) => baseSprite(gameKey, 820), imgS: ({ gameKey }) => shinySprite(gameKey, 820), },
		{ id: 31, natiId: 191, name: "Sunkern", img: ({ gameKey }) => baseSprite(gameKey, 191), imgS: ({ gameKey }) => shinySprite(gameKey, 191), },
		{ id: 32, natiId: 192, name: "Sunflora", img: ({ gameKey }) => baseSprite(gameKey, 192), imgS: ({ gameKey }) => shinySprite(gameKey, 192), },
		{
			id: 33, natiId: 401, name: "Kricketot", img: ({ gameKey }) => baseSprite(gameKey, 401), imgS: ({ gameKey }) => shinySprite(gameKey, 401), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 401), imgS: ({ gameKey }) => shinySprite(gameKey, 401), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0401-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0401-f"), }
			],
		},
		{
			id: 34, natiId: 402, name: "Kricketune", img: ({ gameKey }) => baseSprite(gameKey, 402), imgS: ({ gameKey }) => shinySprite(gameKey, 402), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 402), imgS: ({ gameKey }) => shinySprite(gameKey, 402), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0402-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0402-f"), }
			],
		},
		{ id: 35, natiId: 664, name: "Scatterbug", img: ({ gameKey }) => baseSprite(gameKey, 664), imgS: ({ gameKey }) => shinySprite(gameKey, 664), },
		{ id: 36, natiId: 665, name: "Spewpa", img: ({ gameKey }) => baseSprite(gameKey, 665), imgS: ({ gameKey }) => shinySprite(gameKey, 665), },
		{
			id: 37, natiId: 666, name: "Vivillon", img: ({ gameKey }) => baseSprite(gameKey, 666), imgS: ({ gameKey }) => shinySprite(gameKey, 666), tags: ["other"], forms: [
				{ name: "Archipelago Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-arc"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-arc"), },
				{ name: "Continental Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-con"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-con"), },
				{ name: "Elegant Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-ele"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-ele"), },
				{ name: "Garden Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-gar"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-gar"), },
				{ name: "High Plains Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-hig"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-hig"), },
				{ name: "Icy Snow Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-icy"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-icy"), },
				{ name: "Jungle Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-jun"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-jun"), },
				{ name: "Marine Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-mar"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-mar"), },
				{ name: "Meadow Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-mea"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-mea"), },
				{ name: "Modern Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-mod"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-mod"), },
				{ name: "Monsoon Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-mon"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-mon"), },
				{ name: "Ocean Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-oce"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-oce"), },
				{ name: "Polar Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-pol"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-pol"), },
				{ name: "River Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-riv"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-riv"), },
				{ name: "Sandstorm Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-san"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-san"), },
				{ name: "Savanna Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-sav"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-sav"), },
				{ name: "Sun Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-sun"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-sun"), },
				{ name: "Tundra Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-tun"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-tun"), },
				{ name: "Fancy Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-fan"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-fan"), },
				{ name: "Poke Ball Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-pok"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-pok"), },],
		},
		{
			id: 38, natiId: 415, name: "Combee", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0415-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0415-f"), }
			],
		},
		{ id: 39, natiId: 416, name: "Vespiquen", img: ({ gameKey }) => baseSprite(gameKey, 416), imgS: ({ gameKey }) => shinySprite(gameKey, 416), },
		{ id: 40, natiId: 821, name: "Rookidee", img: ({ gameKey }) => baseSprite(gameKey, 821), imgS: ({ gameKey }) => shinySprite(gameKey, 821), },
		{ id: 41, natiId: 822, name: "Corvisquire", img: ({ gameKey }) => baseSprite(gameKey, 822), imgS: ({ gameKey }) => shinySprite(gameKey, 822), },
		{ id: 42, natiId: 823, name: "Corviknight", img: ({ gameKey }) => baseSprite(gameKey, 823), imgS: ({ gameKey }) => shinySprite(gameKey, 823), },
		{ id: 43, natiId: 440, name: "Happiny", img: ({ gameKey }) => baseSprite(gameKey, 440), imgS: ({ gameKey }) => shinySprite(gameKey, 440), },
		{ id: 44, natiId: 113, name: "Chansey", img: ({ gameKey }) => baseSprite(gameKey, 113), imgS: ({ gameKey }) => shinySprite(gameKey, 113), },
		{ id: 45, natiId: 242, name: "Blissey", img: ({ gameKey }) => baseSprite(gameKey, 242), imgS: ({ gameKey }) => shinySprite(gameKey, 242), },
		{ id: 46, natiId: 298, name: "Azurill", img: ({ gameKey }) => baseSprite(gameKey, 298), imgS: ({ gameKey }) => shinySprite(gameKey, 298), },
		{ id: 47, natiId: 183, name: "Marill", img: ({ gameKey }) => baseSprite(gameKey, 183), imgS: ({ gameKey }) => shinySprite(gameKey, 183), },
		{ id: 48, natiId: 184, name: "Azumarill", img: ({ gameKey }) => baseSprite(gameKey, 184), imgS: ({ gameKey }) => shinySprite(gameKey, 184), },
		{ id: 49, natiId: 283, name: "Surskit", img: ({ gameKey }) => baseSprite(gameKey, 283), imgS: ({ gameKey }) => shinySprite(gameKey, 283), },
		{ id: 50, natiId: 284, name: "Masquerain", img: ({ gameKey }) => baseSprite(gameKey, 284), imgS: ({ gameKey }) => shinySprite(gameKey, 284), },
		{
			id: 51, natiId: 418, name: "Buizel", img: ({ gameKey }) => baseSprite(gameKey, 418), imgS: ({ gameKey }) => shinySprite(gameKey, 418), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 418), imgS: ({ gameKey }) => shinySprite(gameKey, 418), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0418-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0418-f"), }
			],
		},
		{
			id: 52, natiId: 419, name: "Floatzel", img: ({ gameKey }) => baseSprite(gameKey, 419), imgS: ({ gameKey }) => shinySprite(gameKey, 419), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 419), imgS: ({ gameKey }) => shinySprite(gameKey, 419), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0419-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0419-f"), }
			],
		},
		{
			id: 53, natiId: 194, name: "Wooper", img: ({ gameKey }) => baseSprite(gameKey, "0194-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0194-p"), tags: ["gender"], forms: [
				{ name: "Johtonian Male", img: ({ gameKey }) => baseSprite(gameKey, 194), imgS: ({ gameKey }) => shinySprite(gameKey, 194), },
				{ name: "Johtonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0194-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0194-f"), },
				{ name: "Paldean", img: ({ gameKey }) => baseSprite(gameKey, "0194-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0194-p"), tags: ["paldean"], }
			],
		},
		{ id: 54, natiId: 980, name: "Clodsire", img: ({ gameKey }) => baseSprite(gameKey, 980), imgS: ({ gameKey }) => shinySprite(gameKey, 980), },
		{ id: 55, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54), },
		{ id: 56, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55), },
		{ id: 57, natiId: 833, name: "Chewtle", img: ({ gameKey }) => baseSprite(gameKey, 833), imgS: ({ gameKey }) => shinySprite(gameKey, 833), },
		{ id: 58, natiId: 834, name: "Drednaw", img: ({ gameKey }) => baseSprite(gameKey, 834), imgS: ({ gameKey }) => shinySprite(gameKey, 834), },
		{ id: 59, natiId: 174, name: "Igglybuff", img: ({ gameKey }) => baseSprite(gameKey, 174), imgS: ({ gameKey }) => shinySprite(gameKey, 174), },
		{ id: 60, natiId: 39, name: "Jigglypuff", img: ({ gameKey }) => baseSprite(gameKey, 39), imgS: ({ gameKey }) => shinySprite(gameKey, 39), },
		{ id: 61, natiId: 40, name: "Wigglytuff", img: ({ gameKey }) => baseSprite(gameKey, 40), imgS: ({ gameKey }) => shinySprite(gameKey, 40), },
		{ id: 62, natiId: 280, name: "Ralts", img: ({ gameKey }) => baseSprite(gameKey, 280), imgS: ({ gameKey }) => shinySprite(gameKey, 280), },
		{ id: 63, natiId: 281, name: "Kirlia", img: ({ gameKey }) => baseSprite(gameKey, 281), imgS: ({ gameKey }) => shinySprite(gameKey, 281), },
		{ id: 64, natiId: 282, name: "Gardevoir", img: ({ gameKey }) => baseSprite(gameKey, 282), imgS: ({ gameKey }) => shinySprite(gameKey, 282), },
		{ id: 65, natiId: 475, name: "Gallade", img: ({ gameKey }) => baseSprite(gameKey, 475), imgS: ({ gameKey }) => shinySprite(gameKey, 475), },
		{ id: 66, natiId: 96, name: "Drowzee", img: ({ gameKey }) => baseSprite(gameKey, 96), imgS: ({ gameKey }) => shinySprite(gameKey, 96), },
		{
			id: 67, natiId: 97, name: "Hypno", img: ({ gameKey }) => baseSprite(gameKey, 97), imgS: ({ gameKey }) => shinySprite(gameKey, 97), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 97), imgS: ({ gameKey }) => shinySprite(gameKey, 97), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0097-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0097-f"), }
			],
		},
		{ id: 68, natiId: 92, name: "Gastly", img: ({ gameKey }) => baseSprite(gameKey, 92), imgS: ({ gameKey }) => shinySprite(gameKey, 92), },
		{ id: 69, natiId: 93, name: "Haunter", img: ({ gameKey }) => baseSprite(gameKey, 93), imgS: ({ gameKey }) => shinySprite(gameKey, 93), },
		{ id: 70, natiId: 94, name: "Gengar", img: ({ gameKey }) => baseSprite(gameKey, 94), imgS: ({ gameKey }) => shinySprite(gameKey, 94), },
		{ id: 71, natiId: 924, name: "Tandemaus", img: ({ gameKey }) => baseSprite(gameKey, 924), imgS: ({ gameKey }) => shinySprite(gameKey, 924), },
		{
			id: 72, natiId: 925, name: "Maushold", img: ({ gameKey }) => baseSprite(gameKey, 925), imgS: ({ gameKey }) => shinySprite(gameKey, 925), tags: ["other"], forms: [
				{ name: "Family of Four", img: ({ gameKey }) => baseSprite(gameKey, 925), imgS: ({ gameKey }) => shinySprite(gameKey, 925), },
				{ name: "Family of Three", img: ({ gameKey }) => baseSprite(gameKey, "0925-3"), imgS: ({ gameKey }) => shinySprite(gameKey, "0925-3"), }
			],
		},
		{ id: 73, natiId: 172, name: "Pichu", img: ({ gameKey }) => baseSprite(gameKey, 172), imgS: ({ gameKey }) => shinySprite(gameKey, 172), },
		{
			id: 74, natiId: 25, name: "Pikachu", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), tags: ["gender", "other"], forms: [
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
			id: 75, natiId: 26, name: "Raichu", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), tags: ["gender"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0026-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0026-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-a"), tags: ["alolan"], }
			],
		},
		{ id: 76, natiId: 926, name: "Fidough", img: ({ gameKey }) => baseSprite(gameKey, 926), imgS: ({ gameKey }) => shinySprite(gameKey, 926), },
		{ id: 77, natiId: 927, name: "Dachsbun", img: ({ gameKey }) => baseSprite(gameKey, 927), imgS: ({ gameKey }) => shinySprite(gameKey, 927), },
		{ id: 78, natiId: 287, name: "Slakoth", img: ({ gameKey }) => baseSprite(gameKey, 287), imgS: ({ gameKey }) => shinySprite(gameKey, 287), },
		{ id: 79, natiId: 288, name: "Vigoroth", img: ({ gameKey }) => baseSprite(gameKey, 288), imgS: ({ gameKey }) => shinySprite(gameKey, 288), },
		{ id: 80, natiId: 289, name: "Slaking", img: ({ gameKey }) => baseSprite(gameKey, 289), imgS: ({ gameKey }) => shinySprite(gameKey, 289), },
		{ id: 81, natiId: 761, name: "Bounsweet", img: ({ gameKey }) => baseSprite(gameKey, 761), imgS: ({ gameKey }) => shinySprite(gameKey, 761), },
		{ id: 82, natiId: 762, name: "Steenee", img: ({ gameKey }) => baseSprite(gameKey, 762), imgS: ({ gameKey }) => shinySprite(gameKey, 762), },
		{ id: 83, natiId: 763, name: "Tsareena", img: ({ gameKey }) => baseSprite(gameKey, 763), imgS: ({ gameKey }) => shinySprite(gameKey, 763), },
		{ id: 84, natiId: 928, name: "Smoliv", img: ({ gameKey }) => baseSprite(gameKey, 928), imgS: ({ gameKey }) => shinySprite(gameKey, 928), },
		{ id: 85, natiId: 929, name: "Dolliv", img: ({ gameKey }) => baseSprite(gameKey, 929), imgS: ({ gameKey }) => shinySprite(gameKey, 929), },
		{ id: 86, natiId: 930, name: "Arboliva", img: ({ gameKey }) => baseSprite(gameKey, 930), imgS: ({ gameKey }) => shinySprite(gameKey, 930), },
		{ id: 87, natiId: 438, name: "Bonsly", img: ({ gameKey }) => baseSprite(gameKey, 438), imgS: ({ gameKey }) => shinySprite(gameKey, 438), },
		{
			id: 88, natiId: 185, name: "Sudowoodo", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0185-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0185-f"), }
			],
		},
		{ id: 89, natiId: 744, name: "Rockruff", img: ({ gameKey }) => baseSprite(gameKey, 744), imgS: ({ gameKey }) => shinySprite(gameKey, 744), },
		{
			id: 90, natiId: 745, name: "Lycanroc", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), tags: ["other"], forms: [
				{ name: "Midday", img: ({ gameKey }) => baseSprite(gameKey, 745), imgS: ({ gameKey }) => shinySprite(gameKey, 745), },
				{ name: "Midnight", img: ({ gameKey }) => baseSprite(gameKey, "0745-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-m"), },
				{ name: "Dusk", img: ({ gameKey }) => baseSprite(gameKey, "0745-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0745-d"), },],
		},
		{ id: 91, natiId: 837, name: "Rolycoly", img: ({ gameKey }) => baseSprite(gameKey, 837), imgS: ({ gameKey }) => shinySprite(gameKey, 837), },
		{ id: 92, natiId: 838, name: "Carkol", img: ({ gameKey }) => baseSprite(gameKey, 838), imgS: ({ gameKey }) => shinySprite(gameKey, 838), },
		{ id: 93, natiId: 839, name: "Coalossal", img: ({ gameKey }) => baseSprite(gameKey, 839), imgS: ({ gameKey }) => shinySprite(gameKey, 839), },
		{
			id: 94, natiId: 403, name: "Shinx", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0403-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0403-f"), }
			],
		},
		{
			id: 95, natiId: 404, name: "Luxio", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0404-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0404-f"), }
			],
		},
		{
			id: 96, natiId: 405, name: "Luxray", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0405-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0405-f"), }
			],
		},
		{
			id: 97, natiId: 396, name: "Starly", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0396-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0396-f"), }
			],
		},
		{
			id: 98, natiId: 397, name: "Staravia", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0397-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0397-f"), }
			],
		},
		{
			id: 99, natiId: 398, name: "Staraptor", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0398-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0398-f"), }
			],
		},
		{
			id: 100, natiId: 741, name: "Oricorio", img: ({ gameKey }) => baseSprite(gameKey, 741), imgS: ({ gameKey }) => shinySprite(gameKey, 741), tags: ["other"], forms: [
				{ name: "Baile Style", img: ({ gameKey }) => baseSprite(gameKey, 741), imgS: ({ gameKey }) => shinySprite(gameKey, 741), },
				{ name: "Pa'u Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-p"), },
				{ name: "Pom-Pom Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-p"), },
				{ name: "Sensu Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-s"), }
			],
		},
		{ id: 101, natiId: 179, name: "Mareep", img: ({ gameKey }) => baseSprite(gameKey, 179), imgS: ({ gameKey }) => shinySprite(gameKey, 179), },
		{ id: 102, natiId: 180, name: "Flaaffy", img: ({ gameKey }) => baseSprite(gameKey, 180), imgS: ({ gameKey }) => shinySprite(gameKey, 180), },
		{ id: 103, natiId: 181, name: "Ampharos", img: ({ gameKey }) => baseSprite(gameKey, 181), imgS: ({ gameKey }) => shinySprite(gameKey, 181), },
		{ id: 104, natiId: 548, name: "Petilil", img: ({ gameKey }) => baseSprite(gameKey, 548), imgS: ({ gameKey }) => shinySprite(gameKey, 548), },
		{
			id: 105, natiId: 549, name: "Lilligant", img: ({ gameKey }) => baseSprite(gameKey, 549), imgS: ({ gameKey }) => shinySprite(gameKey, 549), forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 549), imgS: ({ gameKey }) => shinySprite(gameKey, 549), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0549-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0549-h"), tags: ["hisuian"], }
			],
		},
		{ id: 106, natiId: 285, name: "Shroomish", img: ({ gameKey }) => baseSprite(gameKey, 285), imgS: ({ gameKey }) => shinySprite(gameKey, 285), },
		{ id: 107, natiId: 286, name: "Breloom", img: ({ gameKey }) => baseSprite(gameKey, 286), imgS: ({ gameKey }) => shinySprite(gameKey, 286), },
		{ id: 108, natiId: 840, name: "Applin", img: ({ gameKey }) => baseSprite(gameKey, 840), imgS: ({ gameKey }) => shinySprite(gameKey, 840), },
		{ id: 109, natiId: 841, name: "Flapple", img: ({ gameKey }) => baseSprite(gameKey, 841), imgS: ({ gameKey }) => shinySprite(gameKey, 841), },
		{ id: 110, natiId: 842, name: "Appletun", img: ({ gameKey }) => baseSprite(gameKey, 842), imgS: ({ gameKey }) => shinySprite(gameKey, 842), },
		{ id: 111, natiId: 325, name: "Spoink", img: ({ gameKey }) => baseSprite(gameKey, 325), imgS: ({ gameKey }) => shinySprite(gameKey, 325), },
		{ id: 112, natiId: 326, name: "Grumpig", img: ({ gameKey }) => baseSprite(gameKey, 326), imgS: ({ gameKey }) => shinySprite(gameKey, 326), },
		{
			id: 113, natiId: 931, name: "Squawkabilly", img: ({ gameKey }) => baseSprite(gameKey, 931), imgS: ({ gameKey }) => shinySprite(gameKey, 931), tags: ["other"], forms: [
				{ name: "Green Plumage", img: ({ gameKey }) => baseSprite(gameKey, 931), imgS: ({ gameKey }) => shinySprite(gameKey, 931), },
				{ name: "Blue Plumage", img: ({ gameKey }) => baseSprite(gameKey, "0931-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0931-b"), },
				{ name: "White Plumage", img: ({ gameKey }) => baseSprite(gameKey, "0931-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0931-w"), },
				{ name: "Yellow Plumage", img: ({ gameKey }) => baseSprite(gameKey, "0931-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0931-y"), }
			],
		},
		{ id: 114, natiId: 200, name: "Misdreavus", img: ({ gameKey }) => baseSprite(gameKey, 200), imgS: ({ gameKey }) => shinySprite(gameKey, 200), },
		{ id: 115, natiId: 429, name: "Mismagius", img: ({ gameKey }) => baseSprite(gameKey, 429), imgS: ({ gameKey }) => shinySprite(gameKey, 429), },
		{ id: 116, natiId: 296, name: "Makuhita", img: ({ gameKey }) => baseSprite(gameKey, 296), imgS: ({ gameKey }) => shinySprite(gameKey, 296), },
		{ id: 117, natiId: 297, name: "Hariyama", img: ({ gameKey }) => baseSprite(gameKey, 297), imgS: ({ gameKey }) => shinySprite(gameKey, 297), },
		{ id: 118, natiId: 739, name: "Crabrawler", img: ({ gameKey }) => baseSprite(gameKey, 739), imgS: ({ gameKey }) => shinySprite(gameKey, 739), },
		{ id: 119, natiId: 740, name: "Crabominable", img: ({ gameKey }) => baseSprite(gameKey, 740), imgS: ({ gameKey }) => shinySprite(gameKey, 740), },
		{ id: 120, natiId: 757, name: "Salandit", img: ({ gameKey }) => baseSprite(gameKey, 757), imgS: ({ gameKey }) => shinySprite(gameKey, 757), },
		{ id: 121, natiId: 758, name: "Salazzle", img: ({ gameKey }) => baseSprite(gameKey, 758), imgS: ({ gameKey }) => shinySprite(gameKey, 758), },
		{ id: 122, natiId: 231, name: "Phanpy", img: ({ gameKey }) => baseSprite(gameKey, 231), imgS: ({ gameKey }) => shinySprite(gameKey, 231), },
		{
			id: 123, natiId: 232, name: "Donphan", img: ({ gameKey }) => baseSprite(gameKey, 232), imgS: ({ gameKey }) => shinySprite(gameKey, 232), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 232), imgS: ({ gameKey }) => shinySprite(gameKey, 232), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0232-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0232-f"), }
			],
		},
		{ id: 124, natiId: 878, name: "Cufant", img: ({ gameKey }) => baseSprite(gameKey, 878), imgS: ({ gameKey }) => shinySprite(gameKey, 878), },
		{ id: 125, natiId: 879, name: "Copperajah", img: ({ gameKey }) => baseSprite(gameKey, 879), imgS: ({ gameKey }) => shinySprite(gameKey, 879), },
		{
			id: 126, natiId: 443, name: "Gible", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0443-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0443-f"), }
			],
		},
		{
			id: 127, natiId: 444, name: "Gabite", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0444-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0444-f"), }
			],
		},
		{
			id: 128, natiId: 445, name: "Garchomp", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0445-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0445-f"), },],
		},
		{ id: 129, natiId: 932, name: "Nacli", img: ({ gameKey }) => baseSprite(gameKey, 932), imgS: ({ gameKey }) => shinySprite(gameKey, 932), },
		{ id: 130, natiId: 933, name: "Naclstack", img: ({ gameKey }) => baseSprite(gameKey, 933), imgS: ({ gameKey }) => shinySprite(gameKey, 933), },
		{ id: 131, natiId: 934, name: "Garganacl", img: ({ gameKey }) => baseSprite(gameKey, 934), imgS: ({ gameKey }) => shinySprite(gameKey, 934), },
		{ id: 132, natiId: 278, name: "Wingull", img: ({ gameKey }) => baseSprite(gameKey, 278), imgS: ({ gameKey }) => shinySprite(gameKey, 278), },
		{ id: 133, natiId: 279, name: "Pelipper", img: ({ gameKey }) => baseSprite(gameKey, 279), imgS: ({ gameKey }) => shinySprite(gameKey, 279), },
		{
			id: 134, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), }
			],
		},
		{
			id: 135, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },],
		},
		{ id: 136, natiId: 846, name: "Arrokuda", img: ({ gameKey }) => baseSprite(gameKey, 846), imgS: ({ gameKey }) => shinySprite(gameKey, 846), },
		{ id: 137, natiId: 847, name: "Barraskewda", img: ({ gameKey }) => baseSprite(gameKey, 847), imgS: ({ gameKey }) => shinySprite(gameKey, 847), },
		{
			id: 138, natiId: 550, name: "Basculin", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), tags: ["other"], forms: [
				{ name: "Blue-Striped", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), },
				{ name: "Red-Striped", img: ({ gameKey }) => baseSprite(gameKey, "0550-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0550-r"), },
				{ name: "White-Striped", img: ({ gameKey }) => baseSprite(gameKey, "0550-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0550-w"), }
			],
		},
		{
			id: 139, natiId: 316, name: "Gulpin", img: ({ gameKey }) => baseSprite(gameKey, 316), imgS: ({ gameKey }) => shinySprite(gameKey, 316), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 316), imgS: ({ gameKey }) => shinySprite(gameKey, 316), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0316-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0316-f"), }
			],
		},
		{
			id: 140, natiId: 317, name: "Swalot", img: ({ gameKey }) => baseSprite(gameKey, 317), imgS: ({ gameKey }) => shinySprite(gameKey, 317), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 317), imgS: ({ gameKey }) => shinySprite(gameKey, 317), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0317-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0317-f"), }
			],
		},
		{
			id: 141, natiId: 52, name: "Meowth", img: ({ gameKey }) => baseSprite(gameKey, 52), imgS: ({ gameKey }) => shinySprite(gameKey, 52), tags: ["gender"], forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 52), imgS: ({ gameKey }) => shinySprite(gameKey, 52), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0052-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0052-a"), tags: ["alolan"], },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0052-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0052-g"), tags: ["galarian"], }
			],
		},
		{
			id: 142, natiId: 53, name: "Persian", img: ({ gameKey }) => baseSprite(gameKey, 53), imgS: ({ gameKey }) => shinySprite(gameKey, 53), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 53), imgS: ({ gameKey }) => shinySprite(gameKey, 53), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0053-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0053-a"), tags: ["alolan"], }
			],
		},
		{ id: 143, natiId: 425, name: "Drifloon", img: ({ gameKey }) => baseSprite(gameKey, 425), imgS: ({ gameKey }) => shinySprite(gameKey, 425), },
		{ id: 144, natiId: 426, name: "Drifblim", img: ({ gameKey }) => baseSprite(gameKey, 426), imgS: ({ gameKey }) => shinySprite(gameKey, 426), },
		{
			id: 145, natiId: 669, name: "Flabébé", img: ({ gameKey }) => baseSprite(gameKey, 669), imgS: ({ gameKey }) => shinySprite(gameKey, 669), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 669), imgS: ({ gameKey }) => shinySprite(gameKey, 669), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-w"), },],
		},
		{
			id: 146, natiId: 670, name: "Floette", img: ({ gameKey }) => baseSprite(gameKey, 670), imgS: ({ gameKey }) => shinySprite(gameKey, 670), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 670), imgS: ({ gameKey }) => shinySprite(gameKey, 670), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-w"), },],
		},
		{
			id: 147, natiId: 671, name: "Florges", img: ({ gameKey }) => baseSprite(gameKey, 671), imgS: ({ gameKey }) => shinySprite(gameKey, 671), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 671), imgS: ({ gameKey }) => shinySprite(gameKey, 671), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-w"), },],
		},
		{
			id: 148, natiId: 50, name: "Diglett", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0050-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0050-a"), }
			],
		},
		{
			id: 149, natiId: 51, name: "Dugtrio", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0051-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0051-a"), }
			],
		},
		{ id: 150, natiId: 324, name: "Torkoal", img: ({ gameKey }) => baseSprite(gameKey, 324), imgS: ({ gameKey }) => shinySprite(gameKey, 324), },
		{
			id: 151, natiId: 322, name: "Numel", img: ({ gameKey }) => baseSprite(gameKey, 322), imgS: ({ gameKey }) => shinySprite(gameKey, 322), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 322), imgS: ({ gameKey }) => shinySprite(gameKey, 322), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0322-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0322-f"), }
			],
		},
		{
			id: 152, natiId: 323, name: "Camerupt", img: ({ gameKey }) => baseSprite(gameKey, 323), imgS: ({ gameKey }) => shinySprite(gameKey, 323), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 323), imgS: ({ gameKey }) => shinySprite(gameKey, 323), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0323-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0323-f"), },],
		},
		{ id: 153, natiId: 436, name: "Bronzor", img: ({ gameKey }) => baseSprite(gameKey, 436), imgS: ({ gameKey }) => shinySprite(gameKey, 436), },
		{ id: 154, natiId: 437, name: "Bronzong", img: ({ gameKey }) => baseSprite(gameKey, 437), imgS: ({ gameKey }) => shinySprite(gameKey, 437), },
		{ id: 155, natiId: 610, name: "Axew", img: ({ gameKey }) => baseSprite(gameKey, 610), imgS: ({ gameKey }) => shinySprite(gameKey, 610), },
		{ id: 156, natiId: 611, name: "Fraxure", img: ({ gameKey }) => baseSprite(gameKey, 611), imgS: ({ gameKey }) => shinySprite(gameKey, 611), },
		{ id: 157, natiId: 612, name: "Haxorus", img: ({ gameKey }) => baseSprite(gameKey, 612), imgS: ({ gameKey }) => shinySprite(gameKey, 612), },
		{ id: 158, natiId: 56, name: "Mankey", img: ({ gameKey }) => baseSprite(gameKey, 56), imgS: ({ gameKey }) => shinySprite(gameKey, 56), },
		{ id: 159, natiId: 57, name: "Primeape", img: ({ gameKey }) => baseSprite(gameKey, 57), imgS: ({ gameKey }) => shinySprite(gameKey, 57), },
		{ id: 160, natiId: 979, name: "Annihilape", img: ({ gameKey }) => baseSprite(gameKey, 979), imgS: ({ gameKey }) => shinySprite(gameKey, 979), },
		{
			id: 161, natiId: 307, name: "Meditite", img: ({ gameKey }) => baseSprite(gameKey, 307), imgS: ({ gameKey }) => shinySprite(gameKey, 307), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 307), imgS: ({ gameKey }) => shinySprite(gameKey, 307), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0307-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0307-f"), }
			],
		},
		{
			id: 162, natiId: 308, name: "Medicham", img: ({ gameKey }) => baseSprite(gameKey, 308), imgS: ({ gameKey }) => shinySprite(gameKey, 308), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 308), imgS: ({ gameKey }) => shinySprite(gameKey, 308), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0308-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0308-f"), },],
		},
		{ id: 163, natiId: 447, name: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447), imgS: ({ gameKey }) => shinySprite(gameKey, 447), },
		{ id: 164, natiId: 448, name: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), imgS: ({ gameKey }) => shinySprite(gameKey, 448), },
		{ id: 165, natiId: 935, name: "Charcadet", img: ({ gameKey }) => baseSprite(gameKey, 935), imgS: ({ gameKey }) => shinySprite(gameKey, 935), },
		{ id: 166, natiId: 936, name: "Armarouge", img: ({ gameKey }) => baseSprite(gameKey, 936), imgS: ({ gameKey }) => shinySprite(gameKey, 936), },
		{ id: 167, natiId: 937, name: "Ceruledge", img: ({ gameKey }) => baseSprite(gameKey, 937), imgS: ({ gameKey }) => shinySprite(gameKey, 937), },
		{ id: 168, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339), },
		{ id: 169, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340), },
		{ id: 170, natiId: 938, name: "Tadbulb", img: ({ gameKey }) => baseSprite(gameKey, 938), imgS: ({ gameKey }) => shinySprite(gameKey, 938), },
		{ id: 171, natiId: 939, name: "Bellibolt", img: ({ gameKey }) => baseSprite(gameKey, 939), imgS: ({ gameKey }) => shinySprite(gameKey, 939), },
		{ id: 172, natiId: 704, name: "Goomy", img: ({ gameKey }) => baseSprite(gameKey, 704), imgS: ({ gameKey }) => shinySprite(gameKey, 704), tags: ["pseudo"], },
		{
			id: 173, natiId: 705, name: "Sliggoo", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), tags: ["pseudo"], forms: [
				{ name: "Kalosian", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0705-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0705-h"), tags: ["hisuian"], }
			],
		},
		{
			id: 174, natiId: 706, name: "Goodra", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), tags: ["pseudo"], forms: [
				{ name: "Kalosian", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0706-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0706-h"), tags: ["hisuian"], }
			],
		},
		{
			id: 175, natiId: 453, name: "Croagunk", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0453-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0453-f"), }
			],
		},
		{
			id: 176, natiId: 454, name: "Toxicroak", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0454-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0454-f"), }
			],
		},
		{ id: 177, natiId: 940, name: "Wattrel", img: ({ gameKey }) => baseSprite(gameKey, 940), imgS: ({ gameKey }) => shinySprite(gameKey, 940), },
		{ id: 178, natiId: 941, name: "Kilowattrel", img: ({ gameKey }) => baseSprite(gameKey, 941), imgS: ({ gameKey }) => shinySprite(gameKey, 941), },
		{
			id: 179, natiId: 133, name: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0133-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0133-f"), },],
		},
		{ id: 180, natiId: 134, name: "Vaporeon", img: ({ gameKey }) => baseSprite(gameKey, 134), imgS: ({ gameKey }) => shinySprite(gameKey, 134), },
		{ id: 181, natiId: 135, name: "Jolteon", img: ({ gameKey }) => baseSprite(gameKey, 135), imgS: ({ gameKey }) => shinySprite(gameKey, 135), },
		{ id: 182, natiId: 136, name: "Flareon", img: ({ gameKey }) => baseSprite(gameKey, 136), imgS: ({ gameKey }) => shinySprite(gameKey, 136), },
		{ id: 183, natiId: 196, name: "Espeon", img: ({ gameKey }) => baseSprite(gameKey, 196), imgS: ({ gameKey }) => shinySprite(gameKey, 196), },
		{ id: 184, natiId: 197, name: "Umbreon", img: ({ gameKey }) => baseSprite(gameKey, 197), imgS: ({ gameKey }) => shinySprite(gameKey, 197), },
		{ id: 185, natiId: 470, name: "Leafeon", img: ({ gameKey }) => baseSprite(gameKey, 470), imgS: ({ gameKey }) => shinySprite(gameKey, 470), },
		{ id: 186, natiId: 471, name: "Glaceon", img: ({ gameKey }) => baseSprite(gameKey, 471), imgS: ({ gameKey }) => shinySprite(gameKey, 471), },
		{ id: 187, natiId: 700, name: "Sylveon", img: ({ gameKey }) => baseSprite(gameKey, 700), imgS: ({ gameKey }) => shinySprite(gameKey, 700), },
		{ id: 188, natiId: 206, name: "Dunsparce", img: ({ gameKey }) => baseSprite(gameKey, 206), imgS: ({ gameKey }) => shinySprite(gameKey, 206), },
		{
			id: 189, natiId: 982, name: "Dudunsparce", img: ({ gameKey }) => baseSprite(gameKey, 982), imgS: ({ gameKey }) => shinySprite(gameKey, 982), tags: ["other"], forms: [
				{ name: "Three-Segment", img: ({ gameKey }) => baseSprite(gameKey, 982), imgS: ({ gameKey }) => shinySprite(gameKey, 982), },
				{ name: "Two-Segment", img: ({ gameKey }) => baseSprite(gameKey, "0982-2"), imgS: ({ gameKey }) => shinySprite(gameKey, "0982-2"), }
			],
		},
		{
			id: 190, natiId: 585, name: "Deerling", img: ({ gameKey }) => baseSprite(gameKey, 585), imgS: ({ gameKey }) => shinySprite(gameKey, 585), tags: ["other"], forms: [
				{ name: "Autumn", img: ({ gameKey }) => baseSprite(gameKey, 585), imgS: ({ gameKey }) => shinySprite(gameKey, 585), },
				{ name: "Spring", img: ({ gameKey }) => baseSprite(gameKey, "0585-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0585-s"), },
				{ name: "Summer", img: ({ gameKey }) => baseSprite(gameKey, "0585-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0585-s"), },
				{ name: "Winter", img: ({ gameKey }) => baseSprite(gameKey, "0585-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0585-w"), }
			],
		},
		{
			id: 191, natiId: 586, name: "Sawsbuck", img: ({ gameKey }) => baseSprite(gameKey, 586), imgS: ({ gameKey }) => shinySprite(gameKey, 586), tags: ["other"], forms: [
				{ name: "Autumn", img: ({ gameKey }) => baseSprite(gameKey, 586), imgS: ({ gameKey }) => shinySprite(gameKey, 586), },
				{ name: "Spring", img: ({ gameKey }) => baseSprite(gameKey, "0586-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0586-s"), },
				{ name: "Summer", img: ({ gameKey }) => baseSprite(gameKey, "0586-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0586-s"), },
				{ name: "Winter", img: ({ gameKey }) => baseSprite(gameKey, "0586-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0586-w"), }
			],
		},
		{
			id: 192, natiId: 203, name: "Girafarig", img: ({ gameKey }) => baseSprite(gameKey, 203), imgS: ({ gameKey }) => shinySprite(gameKey, 203), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 203), imgS: ({ gameKey }) => shinySprite(gameKey, 203), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0203-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0203-f"), }
			],
		},
		{ id: 193, natiId: 981, name: "Farigiraf", img: ({ gameKey }) => baseSprite(gameKey, 981), imgS: ({ gameKey }) => shinySprite(gameKey, 981), },
		{
			id: 194, natiId: 88, name: "Grimer", img: ({ gameKey }) => baseSprite(gameKey, 88), imgS: ({ gameKey }) => shinySprite(gameKey, 88), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 88), imgS: ({ gameKey }) => shinySprite(gameKey, 88), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0088-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0088-a"), tags: ["alolan"], }
			],
		},
		{
			id: 195, natiId: 89, name: "Muk", img: ({ gameKey }) => baseSprite(gameKey, 89), imgS: ({ gameKey }) => shinySprite(gameKey, 89), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 89), imgS: ({ gameKey }) => shinySprite(gameKey, 89), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0089-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0089-a"), tags: ["alolan"], }
			],
		},
		{ id: 196, natiId: 942, name: "Maschiff", img: ({ gameKey }) => baseSprite(gameKey, 942), imgS: ({ gameKey }) => shinySprite(gameKey, 942), },
		{ id: 197, natiId: 943, name: "Mabosstiff", img: ({ gameKey }) => baseSprite(gameKey, 943), imgS: ({ gameKey }) => shinySprite(gameKey, 943), },
		{ id: 198, natiId: 848, name: "Toxel", img: ({ gameKey }) => baseSprite(gameKey, 848), imgS: ({ gameKey }) => shinySprite(gameKey, 848), },
		{
			id: 199, natiId: 849, name: "Toxtricity", img: ({ gameKey }) => baseSprite(gameKey, 849), imgS: ({ gameKey }) => shinySprite(gameKey, 849), tags: ["other"], forms: [
				{ name: "Amped", img: ({ gameKey }) => baseSprite(gameKey, "0849-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0849-a"), },
				{ name: "Low Key", img: ({ gameKey }) => baseSprite(gameKey, "0849-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0849-l"), }
			],
		},
		{ id: 200, natiId: 702, name: "Dedenne", img: ({ gameKey }) => baseSprite(gameKey, 702), imgS: ({ gameKey }) => shinySprite(gameKey, 702), },
		{
			id: 201, natiId: 417, name: "Pachirisu", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0417-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0417-f"), }
			],
		},
		{ id: 202, natiId: 944, name: "Shroodle", img: ({ gameKey }) => baseSprite(gameKey, 944), imgS: ({ gameKey }) => shinySprite(gameKey, 944), },
		{ id: 203, natiId: 945, name: "Grafaiai", img: ({ gameKey }) => baseSprite(gameKey, 945), imgS: ({ gameKey }) => shinySprite(gameKey, 945), },
		{ id: 204, natiId: 234, name: "Stantler", img: ({ gameKey }) => baseSprite(gameKey, 234), imgS: ({ gameKey }) => shinySprite(gameKey, 234), },
		{ id: 205, natiId: 590, name: "Foongus", img: ({ gameKey }) => baseSprite(gameKey, 590), imgS: ({ gameKey }) => shinySprite(gameKey, 590), },
		{ id: 206, natiId: 591, name: "Amoonguss", img: ({ gameKey }) => baseSprite(gameKey, 591), imgS: ({ gameKey }) => shinySprite(gameKey, 591), },
		{
			id: 207, natiId: 100, name: "Voltorb", img: ({ gameKey }) => baseSprite(gameKey, 100), imgS: ({ gameKey }) => shinySprite(gameKey, 100), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 100), imgS: ({ gameKey }) => shinySprite(gameKey, 100), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0100-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0100-h"), tags: ["hisuian"], }
			],
		},
		{
			id: 208, natiId: 101, name: "Electrode", img: ({ gameKey }) => baseSprite(gameKey, 101), imgS: ({ gameKey }) => shinySprite(gameKey, 101), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 101), imgS: ({ gameKey }) => shinySprite(gameKey, 101), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0101-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0101-h"), tags: ["hisuian"], }
			],
		},
		{ id: 209, natiId: 81, name: "Magnemite", img: ({ gameKey }) => baseSprite(gameKey, 81), imgS: ({ gameKey }) => shinySprite(gameKey, 81), },
		{ id: 210, natiId: 82, name: "Magneton", img: ({ gameKey }) => baseSprite(gameKey, 82), imgS: ({ gameKey }) => shinySprite(gameKey, 82), },
		{ id: 211, natiId: 462, name: "Magnezone", img: ({ gameKey }) => baseSprite(gameKey, 462), imgS: ({ gameKey }) => shinySprite(gameKey, 462), },
		{ id: 212, natiId: 132, name: "Ditto", img: ({ gameKey }) => baseSprite(gameKey, 132), imgS: ({ gameKey }) => shinySprite(gameKey, 132), },
		{
			id: 213, natiId: 58, name: "Growlithe", img: ({ gameKey }) => baseSprite(gameKey, 58), imgS: ({ gameKey }) => shinySprite(gameKey, 58), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 58), imgS: ({ gameKey }) => shinySprite(gameKey, 58), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0058-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0058-h"), tags: ["hisuian"], }
			],
		},
		{
			id: 214, natiId: 59, name: "Arcanine", img: ({ gameKey }) => baseSprite(gameKey, 59), imgS: ({ gameKey }) => shinySprite(gameKey, 59), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 59), imgS: ({ gameKey }) => shinySprite(gameKey, 59), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0059-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0059-h"), tags: ["hisuian"], }
			],
		},
		{ id: 215, natiId: 216, name: "Teddiursa", img: ({ gameKey }) => baseSprite(gameKey, 216), imgS: ({ gameKey }) => shinySprite(gameKey, 216), },
		{
			id: 216, natiId: 217, name: "Ursaring", img: ({ gameKey }) => baseSprite(gameKey, 217), imgS: ({ gameKey }) => shinySprite(gameKey, 217), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 217), imgS: ({ gameKey }) => shinySprite(gameKey, 217), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0217-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0217-f"), }
			],
		},
		{ id: 217, natiId: 335, name: "Zangoose", img: ({ gameKey }) => baseSprite(gameKey, 335), imgS: ({ gameKey }) => shinySprite(gameKey, 335), },
		{ id: 218, natiId: 336, name: "Seviper", img: ({ gameKey }) => baseSprite(gameKey, 336), imgS: ({ gameKey }) => shinySprite(gameKey, 336), },
		{ id: 219, natiId: 333, name: "Swablu", img: ({ gameKey }) => baseSprite(gameKey, 333), imgS: ({ gameKey }) => shinySprite(gameKey, 333), },
		{ id: 220, natiId: 334, name: "Altaria", img: ({ gameKey }) => baseSprite(gameKey, 334), imgS: ({ gameKey }) => shinySprite(gameKey, 334), },
		{ id: 221, natiId: 672, name: "Skiddo", img: ({ gameKey }) => baseSprite(gameKey, 672), imgS: ({ gameKey }) => shinySprite(gameKey, 672), },
		{ id: 222, natiId: 673, name: "Gogoat", img: ({ gameKey }) => baseSprite(gameKey, 673), imgS: ({ gameKey }) => shinySprite(gameKey, 673), },
		{
			id: 223, natiId: 128, name: "Tauros", img: ({ gameKey }) => baseSprite(gameKey, "0128-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0128-c"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, "0128-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0128-a"), },
				{ name: "Paldean (Aqua Breed)", img: ({ gameKey }) => baseSprite(gameKey, "0128-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0128-a"), tags: ["paldean"], },
				{ name: "Paldean (Blaze Breed)", img: ({ gameKey }) => baseSprite(gameKey, "0128-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0128-b"), tags: ["paldean"], },
				{ name: "Paldean (Combat Breed)", img: ({ gameKey }) => baseSprite(gameKey, "0128-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0128-c"), tags: ["paldean"], }
			],
		},
		{ id: 224, natiId: 667, name: "Litleo", img: ({ gameKey }) => baseSprite(gameKey, 667), imgS: ({ gameKey }) => shinySprite(gameKey, 667), },
		{
			id: 225, natiId: 668, name: "Pyroar", img: ({ gameKey }) => baseSprite(gameKey, 668), imgS: ({ gameKey }) => shinySprite(gameKey, 668), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 668), imgS: ({ gameKey }) => shinySprite(gameKey, 668), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0668-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0668-f"), }
			],
		},
		{ id: 226, natiId: 434, name: "Stunky", img: ({ gameKey }) => baseSprite(gameKey, 434), imgS: ({ gameKey }) => shinySprite(gameKey, 434), },
		{ id: 227, natiId: 435, name: "Skuntank", img: ({ gameKey }) => baseSprite(gameKey, 435), imgS: ({ gameKey }) => shinySprite(gameKey, 435), },
		{
			id: 228, natiId: 570, name: "Zorua", img: ({ gameKey }) => baseSprite(gameKey, 570), imgS: ({ gameKey }) => shinySprite(gameKey, 570), forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 570), imgS: ({ gameKey }) => shinySprite(gameKey, 570), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0570-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0570-h"), tags: ["hisuian"], }
			],
		},
		{
			id: 229, natiId: 571, name: "Zoroark", img: ({ gameKey }) => baseSprite(gameKey, 571), imgS: ({ gameKey }) => shinySprite(gameKey, 571), forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 571), imgS: ({ gameKey }) => shinySprite(gameKey, 571), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0571-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0571-h"), tags: ["hisuian"], }
			],
		},
		{
			id: 230, natiId: 215, name: "Sneasel", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), tags: ["gender"], forms: [
				{ name: "Johtonian Male", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), },
				{ name: "Johtonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-f"), },
				{ name: "Hisuian Male", img: ({ gameKey }) => baseSprite(gameKey, "0215-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-h"), tags: ["hisuian"], },
				{ name: "Hisuian Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-h-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-h-f"), tags: ["hisuian"], }
			],
		},
		{
			id: 231, natiId: 461, name: "Weavile", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0461-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0461-f"), }
			],
		},
		{
			id: 232, natiId: 198, name: "Murkrow", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0198-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0198-f"), }
			],
		},
		{ id: 233, natiId: 430, name: "Honchkrow", img: ({ gameKey }) => baseSprite(gameKey, 430), imgS: ({ gameKey }) => shinySprite(gameKey, 430), },
		{ id: 234, natiId: 574, name: "Gothita", img: ({ gameKey }) => baseSprite(gameKey, 574), imgS: ({ gameKey }) => shinySprite(gameKey, 574), },
		{ id: 235, natiId: 575, name: "Gothorita", img: ({ gameKey }) => baseSprite(gameKey, 575), imgS: ({ gameKey }) => shinySprite(gameKey, 575), },
		{ id: 236, natiId: 576, name: "Gothitelle", img: ({ gameKey }) => baseSprite(gameKey, 576), imgS: ({ gameKey }) => shinySprite(gameKey, 576), },
		{
			id: 237, natiId: 854, name: "Sinistea", img: ({ gameKey }) => baseSprite(gameKey, 854), imgS: ({ gameKey }) => shinySprite(gameKey, 854), tags: ["other"], forms: [
				{ name: "Phony", img: ({ gameKey }) => baseSprite(gameKey, 854), imgS: ({ gameKey }) => shinySprite(gameKey, 854), },
				{ name: "Authentic", img: ({ gameKey }) => baseSprite(gameKey, "0854-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0854-a"), },]
		},
		{
			id: 238, natiId: 855, name: "Polteageist", img: ({ gameKey }) => baseSprite(gameKey, 855), imgS: ({ gameKey }) => shinySprite(gameKey, 855), tags: ["other"], forms: [
				{ name: "Phony", img: ({ gameKey }) => baseSprite(gameKey, 855), imgS: ({ gameKey }) => shinySprite(gameKey, 855), },
				{ name: "Authentic", img: ({ gameKey }) => baseSprite(gameKey, "0855-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0855-a"), },]
		},
		{ id: 239, natiId: 778, name: "Mimikyu", img: ({ gameKey }) => baseSprite(gameKey, 778), imgS: ({ gameKey }) => shinySprite(gameKey, 778), },
		{ id: 240, natiId: 707, name: "Klefki", img: ({ gameKey }) => baseSprite(gameKey, 707), imgS: ({ gameKey }) => shinySprite(gameKey, 707), },
		{
			id: 241, natiId: 876, name: "Indeedee", img: ({ gameKey }) => baseSprite(gameKey, 876), imgS: ({ gameKey }) => shinySprite(gameKey, 876), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 876), imgS: ({ gameKey }) => shinySprite(gameKey, 876), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0876-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0876-f"), }
			],
		},
		{ id: 242, natiId: 946, name: "Bramblin", img: ({ gameKey }) => baseSprite(gameKey, 946), imgS: ({ gameKey }) => shinySprite(gameKey, 946), },
		{ id: 243, natiId: 947, name: "Brambleghast", img: ({ gameKey }) => baseSprite(gameKey, 947), imgS: ({ gameKey }) => shinySprite(gameKey, 947), },
		{ id: 244, natiId: 948, name: "Toedscool", img: ({ gameKey }) => baseSprite(gameKey, 948), imgS: ({ gameKey }) => shinySprite(gameKey, 948), },
		{ id: 245, natiId: 949, name: "Toedscruel", img: ({ gameKey }) => baseSprite(gameKey, 949), imgS: ({ gameKey }) => shinySprite(gameKey, 949), },
		{ id: 246, natiId: 357, name: "Tropius", img: ({ gameKey }) => baseSprite(gameKey, 357), imgS: ({ gameKey }) => shinySprite(gameKey, 357), },
		{ id: 247, natiId: 753, name: "Fomantis", img: ({ gameKey }) => baseSprite(gameKey, 753), imgS: ({ gameKey }) => shinySprite(gameKey, 753), },
		{ id: 248, natiId: 754, name: "Lurantis", img: ({ gameKey }) => baseSprite(gameKey, 754), imgS: ({ gameKey }) => shinySprite(gameKey, 754), },
		{ id: 249, natiId: 950, name: "Klawf", img: ({ gameKey }) => baseSprite(gameKey, 950), imgS: ({ gameKey }) => shinySprite(gameKey, 950), },
		{ id: 250, natiId: 951, name: "Capsakid", img: ({ gameKey }) => baseSprite(gameKey, 951), imgS: ({ gameKey }) => shinySprite(gameKey, 951), },
		{ id: 251, natiId: 952, name: "Scovillain", img: ({ gameKey }) => baseSprite(gameKey, 952), imgS: ({ gameKey }) => shinySprite(gameKey, 952), },
		{ id: 252, natiId: 331, name: "Cacnea", img: ({ gameKey }) => baseSprite(gameKey, 331), imgS: ({ gameKey }) => shinySprite(gameKey, 331), },
		{
			id: 253, natiId: 332, name: "Cacturne", img: ({ gameKey }) => baseSprite(gameKey, 332), imgS: ({ gameKey }) => shinySprite(gameKey, 332), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 332), imgS: ({ gameKey }) => shinySprite(gameKey, 332), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0332-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0332-f"), }
			],
		},
		{ id: 254, natiId: 953, name: "Rellor", img: ({ gameKey }) => baseSprite(gameKey, 953), imgS: ({ gameKey }) => shinySprite(gameKey, 953), },
		{ id: 255, natiId: 954, name: "Rabsca", img: ({ gameKey }) => baseSprite(gameKey, 954), imgS: ({ gameKey }) => shinySprite(gameKey, 954), },
		{ id: 256, natiId: 48, name: "Venonat", img: ({ gameKey }) => baseSprite(gameKey, 48), imgS: ({ gameKey }) => shinySprite(gameKey, 48), },
		{ id: 257, natiId: 49, name: "Venomoth", img: ({ gameKey }) => baseSprite(gameKey, 49), imgS: ({ gameKey }) => shinySprite(gameKey, 49), },
		{ id: 258, natiId: 204, name: "Pineco", img: ({ gameKey }) => baseSprite(gameKey, 204), imgS: ({ gameKey }) => shinySprite(gameKey, 204), },
		{ id: 259, natiId: 205, name: "Forretress", img: ({ gameKey }) => baseSprite(gameKey, 205), imgS: ({ gameKey }) => shinySprite(gameKey, 205), },
		{
			id: 260, natiId: 123, name: "Scyther", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0123-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0123-f"), }
			],
		},
		{
			id: 261, natiId: 212, name: "Scizor", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0212-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0212-f"), },],
		},
		{
			id: 262, natiId: 214, name: "Heracross", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0214-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0214-f"), },],
		},
		{ id: 263, natiId: 955, name: "Flittle", img: ({ gameKey }) => baseSprite(gameKey, 955), imgS: ({ gameKey }) => shinySprite(gameKey, 955), },
		{ id: 264, natiId: 956, name: "Espathra", img: ({ gameKey }) => baseSprite(gameKey, 956), imgS: ({ gameKey }) => shinySprite(gameKey, 956), },
		{
			id: 265, natiId: 449, name: "Hippopotas", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0449-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0449-f"), }
			],
		},
		{
			id: 266, natiId: 450, name: "Hippowdon", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0450-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0450-f"), }
			],
		},
		{ id: 267, natiId: 551, name: "Sandile", img: ({ gameKey }) => baseSprite(gameKey, 551), imgS: ({ gameKey }) => shinySprite(gameKey, 551), },
		{ id: 268, natiId: 552, name: "Krokorok", img: ({ gameKey }) => baseSprite(gameKey, 552), imgS: ({ gameKey }) => shinySprite(gameKey, 552), },
		{ id: 269, natiId: 553, name: "Krookodile", img: ({ gameKey }) => baseSprite(gameKey, 553), imgS: ({ gameKey }) => shinySprite(gameKey, 553), },
		{ id: 270, natiId: 843, name: "Silicobra", img: ({ gameKey }) => baseSprite(gameKey, 843), imgS: ({ gameKey }) => shinySprite(gameKey, 843), },
		{ id: 271, natiId: 844, name: "Sandaconda", img: ({ gameKey }) => baseSprite(gameKey, 844), imgS: ({ gameKey }) => shinySprite(gameKey, 844), },
		{ id: 272, natiId: 749, name: "Mudbray", img: ({ gameKey }) => baseSprite(gameKey, 749), imgS: ({ gameKey }) => shinySprite(gameKey, 749), },
		{ id: 273, natiId: 750, name: "Mudsdale", img: ({ gameKey }) => baseSprite(gameKey, 750), imgS: ({ gameKey }) => shinySprite(gameKey, 750), },
		{ id: 274, natiId: 636, name: "Larvesta", img: ({ gameKey }) => baseSprite(gameKey, 636), imgS: ({ gameKey }) => shinySprite(gameKey, 636), },
		{ id: 275, natiId: 637, name: "Volcarona", img: ({ gameKey }) => baseSprite(gameKey, 637), imgS: ({ gameKey }) => shinySprite(gameKey, 637), },
		{ id: 276, natiId: 371, name: "Bagon", img: ({ gameKey }) => baseSprite(gameKey, 371), imgS: ({ gameKey }) => shinySprite(gameKey, 371), tags: ["pseudo"], },
		{ id: 277, natiId: 372, name: "Shelgon", img: ({ gameKey }) => baseSprite(gameKey, 372), imgS: ({ gameKey }) => shinySprite(gameKey, 372), tags: ["pseudo"], },
		{ id: 278, natiId: 373, name: "Salamence", img: ({ gameKey }) => baseSprite(gameKey, 373), imgS: ({ gameKey }) => shinySprite(gameKey, 373), tags: ["pseudo"], },
		{ id: 279, natiId: 957, name: "Tinkatink", img: ({ gameKey }) => baseSprite(gameKey, 957), imgS: ({ gameKey }) => shinySprite(gameKey, 957), },
		{ id: 280, natiId: 958, name: "Tinkatuff", img: ({ gameKey }) => baseSprite(gameKey, 958), imgS: ({ gameKey }) => shinySprite(gameKey, 958), },
		{ id: 281, natiId: 959, name: "Tinkaton", img: ({ gameKey }) => baseSprite(gameKey, 959), imgS: ({ gameKey }) => shinySprite(gameKey, 959), },
		{ id: 282, natiId: 856, name: "Hatenna", img: ({ gameKey }) => baseSprite(gameKey, 856), imgS: ({ gameKey }) => shinySprite(gameKey, 856), },
		{ id: 283, natiId: 857, name: "Hattrem", img: ({ gameKey }) => baseSprite(gameKey, 857), imgS: ({ gameKey }) => shinySprite(gameKey, 857), },
		{ id: 284, natiId: 858, name: "Hatterene", img: ({ gameKey }) => baseSprite(gameKey, 858), imgS: ({ gameKey }) => shinySprite(gameKey, 858), },
		{ id: 285, natiId: 859, name: "Impidimp", img: ({ gameKey }) => baseSprite(gameKey, 859), imgS: ({ gameKey }) => shinySprite(gameKey, 859), },
		{ id: 286, natiId: 860, name: "Morgrem", img: ({ gameKey }) => baseSprite(gameKey, 860), imgS: ({ gameKey }) => shinySprite(gameKey, 860), },
		{ id: 287, natiId: 861, name: "Grimmsnarl", img: ({ gameKey }) => baseSprite(gameKey, 861), imgS: ({ gameKey }) => shinySprite(gameKey, 861), },
		{ id: 288, natiId: 960, name: "Wiglett", img: ({ gameKey }) => baseSprite(gameKey, 960), imgS: ({ gameKey }) => shinySprite(gameKey, 960), },
		{ id: 289, natiId: 961, name: "Wugtrio", img: ({ gameKey }) => baseSprite(gameKey, 961), imgS: ({ gameKey }) => shinySprite(gameKey, 961), },
		{ id: 290, natiId: 962, name: "Bombirdier", img: ({ gameKey }) => baseSprite(gameKey, 962), imgS: ({ gameKey }) => shinySprite(gameKey, 962), },
		{ id: 291, natiId: 963, name: "Finizen", img: ({ gameKey }) => baseSprite(gameKey, 963), imgS: ({ gameKey }) => shinySprite(gameKey, 963), },
		{ id: 292, natiId: 964, name: "Palafin", img: ({ gameKey }) => baseSprite(gameKey, 964), imgS: ({ gameKey }) => shinySprite(gameKey, 964), },
		{ id: 293, natiId: 965, name: "Varoom", img: ({ gameKey }) => baseSprite(gameKey, 965), imgS: ({ gameKey }) => shinySprite(gameKey, 965), },
		{ id: 294, natiId: 966, name: "Revavroom", img: ({ gameKey }) => baseSprite(gameKey, 966), imgS: ({ gameKey }) => shinySprite(gameKey, 966), },
		{ id: 295, natiId: 967, name: "Cyclizar", img: ({ gameKey }) => baseSprite(gameKey, 967), imgS: ({ gameKey }) => shinySprite(gameKey, 967), },
		{ id: 296, natiId: 968, name: "Orthworm", img: ({ gameKey }) => baseSprite(gameKey, 968), imgS: ({ gameKey }) => shinySprite(gameKey, 968), },
		{ id: 297, natiId: 302, name: "Sableye", img: ({ gameKey }) => baseSprite(gameKey, 302), imgS: ({ gameKey }) => shinySprite(gameKey, 302), },
		{ id: 298, natiId: 353, name: "Shuppet", img: ({ gameKey }) => baseSprite(gameKey, 353), imgS: ({ gameKey }) => shinySprite(gameKey, 353), },
		{ id: 299, natiId: 354, name: "Banette", img: ({ gameKey }) => baseSprite(gameKey, 354), imgS: ({ gameKey }) => shinySprite(gameKey, 354), },
		{ id: 300, natiId: 870, name: "Falinks", img: ({ gameKey }) => baseSprite(gameKey, 870), imgS: ({ gameKey }) => shinySprite(gameKey, 870), },
		{ id: 301, natiId: 701, name: "Hawlucha", img: ({ gameKey }) => baseSprite(gameKey, 701), imgS: ({ gameKey }) => shinySprite(gameKey, 701), },
		{ id: 302, natiId: 442, name: "Spiritomb", img: ({ gameKey }) => baseSprite(gameKey, 442), imgS: ({ gameKey }) => shinySprite(gameKey, 442), },
		{ id: 303, natiId: 714, name: "Noibat", img: ({ gameKey }) => baseSprite(gameKey, 714), imgS: ({ gameKey }) => shinySprite(gameKey, 714), },
		{ id: 304, natiId: 715, name: "Noivern", img: ({ gameKey }) => baseSprite(gameKey, 715), imgS: ({ gameKey }) => shinySprite(gameKey, 715), },
		{ id: 305, natiId: 885, name: "Dreepy", img: ({ gameKey }) => baseSprite(gameKey, 885), imgS: ({ gameKey }) => shinySprite(gameKey, 885), tags: ["pseudo"], },
		{ id: 306, natiId: 886, name: "Drakloak", img: ({ gameKey }) => baseSprite(gameKey, 886), imgS: ({ gameKey }) => shinySprite(gameKey, 886), tags: ["pseudo"], },
		{ id: 307, natiId: 887, name: "Dragapult", img: ({ gameKey }) => baseSprite(gameKey, 887), imgS: ({ gameKey }) => shinySprite(gameKey, 887), tags: ["pseudo"], },
		{ id: 308, natiId: 969, name: "Glimmet", img: ({ gameKey }) => baseSprite(gameKey, 969), imgS: ({ gameKey }) => shinySprite(gameKey, 969), },
		{ id: 309, natiId: 970, name: "Glimmora", img: ({ gameKey }) => baseSprite(gameKey, 970), imgS: ({ gameKey }) => shinySprite(gameKey, 970), },
		{
			id: 310, natiId: 479, name: "Rotom", img: ({ gameKey }) => baseSprite(gameKey, 479), imgS: ({ gameKey }) => shinySprite(gameKey, 479), tags: ["other"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 479), imgS: ({ gameKey }) => shinySprite(gameKey, 479), },
				{ name: "Fan", img: ({ gameKey }) => baseSprite(gameKey, "0479-fa"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-fa"), },
				{ name: "Frost", img: ({ gameKey }) => baseSprite(gameKey, "0479-fr"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-fr"), },
				{ name: "Heat", img: ({ gameKey }) => baseSprite(gameKey, "0479-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-h"), },
				{ name: "Mow", img: ({ gameKey }) => baseSprite(gameKey, "0479-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-m"), },
				{ name: "Wash", img: ({ gameKey }) => baseSprite(gameKey, "0479-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-w"), }
			],
		},
		{ id: 311, natiId: 971, name: "Greavard", img: ({ gameKey }) => baseSprite(gameKey, 971), imgS: ({ gameKey }) => shinySprite(gameKey, 971), },
		{ id: 312, natiId: 972, name: "Houndstone", img: ({ gameKey }) => baseSprite(gameKey, 972), imgS: ({ gameKey }) => shinySprite(gameKey, 972), },
		{ id: 313, natiId: 765, name: "Oranguru", img: ({ gameKey }) => baseSprite(gameKey, 765), imgS: ({ gameKey }) => shinySprite(gameKey, 765), },
		{ id: 314, natiId: 766, name: "Passimian", img: ({ gameKey }) => baseSprite(gameKey, 766), imgS: ({ gameKey }) => shinySprite(gameKey, 766), },
		{ id: 315, natiId: 775, name: "Komala", img: ({ gameKey }) => baseSprite(gameKey, 775), imgS: ({ gameKey }) => shinySprite(gameKey, 775), },
		{ id: 316, natiId: 246, name: "Larvitar", img: ({ gameKey }) => baseSprite(gameKey, 246), imgS: ({ gameKey }) => shinySprite(gameKey, 246), tags: ["pseudo"], },
		{ id: 317, natiId: 247, name: "Pupitar", img: ({ gameKey }) => baseSprite(gameKey, 247), imgS: ({ gameKey }) => shinySprite(gameKey, 247), tags: ["pseudo"], },
		{ id: 318, natiId: 248, name: "Tyranitar", img: ({ gameKey }) => baseSprite(gameKey, 248), imgS: ({ gameKey }) => shinySprite(gameKey, 248), tags: ["pseudo"], },
		{ id: 319, natiId: 874, name: "Stonjourner", img: ({ gameKey }) => baseSprite(gameKey, 874), imgS: ({ gameKey }) => shinySprite(gameKey, 874), },
		{ id: 320, natiId: 875, name: "Eiscue", img: ({ gameKey }) => baseSprite(gameKey, 875), imgS: ({ gameKey }) => shinySprite(gameKey, 875), },
		{ id: 321, natiId: 871, name: "Pincurchin", img: ({ gameKey }) => baseSprite(gameKey, 871), imgS: ({ gameKey }) => shinySprite(gameKey, 871), },
		{ id: 322, natiId: 769, name: "Sandygast", img: ({ gameKey }) => baseSprite(gameKey, 769), imgS: ({ gameKey }) => shinySprite(gameKey, 769), },
		{ id: 323, natiId: 770, name: "Palossand", img: ({ gameKey }) => baseSprite(gameKey, 770), imgS: ({ gameKey }) => shinySprite(gameKey, 770), },
		{
			id: 324, natiId: 79, name: "Slowpoke", img: ({ gameKey }) => baseSprite(gameKey, 79), imgS: ({ gameKey }) => shinySprite(gameKey, 79), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 79), imgS: ({ gameKey }) => shinySprite(gameKey, 79), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0079-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0079-g"), tags: ["galarian"], }
			],
		},
		{
			id: 325, natiId: 80, name: "Slowbro", img: ({ gameKey }) => baseSprite(gameKey, 80), imgS: ({ gameKey }) => shinySprite(gameKey, 80), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 80), imgS: ({ gameKey }) => shinySprite(gameKey, 80), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0080-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0080-g"), tags: ["galarian"], },],
		},
		{
			id: 326, natiId: 199, name: "Slowking", img: ({ gameKey }) => baseSprite(gameKey, 199), imgS: ({ gameKey }) => shinySprite(gameKey, 199), forms: [
				{ name: "Johtonian", img: ({ gameKey }) => baseSprite(gameKey, 199), imgS: ({ gameKey }) => shinySprite(gameKey, 199), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0199-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0199-g"), tags: ["galarian"], }
			],
		},
		{
			id: 327, natiId: 422, name: "Shellos", img: ({ gameKey }) => baseSprite(gameKey, 422), imgS: ({ gameKey }) => shinySprite(gameKey, 422), tags: ["other"], forms: [
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, 422), imgS: ({ gameKey }) => shinySprite(gameKey, 422), },
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0422-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0422-e"), },],
		},
		{
			id: 328, natiId: 423, name: "Gastrodon", img: ({ gameKey }) => baseSprite(gameKey, 423), imgS: ({ gameKey }) => shinySprite(gameKey, 423), tags: ["other"], forms: [
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, 423), imgS: ({ gameKey }) => shinySprite(gameKey, 423), },
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0423-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0423-e"), },],
		},
		{ id: 329, natiId: 90, name: "Shellder", img: ({ gameKey }) => baseSprite(gameKey, 90), imgS: ({ gameKey }) => shinySprite(gameKey, 90), },
		{ id: 330, natiId: 91, name: "Cloyster", img: ({ gameKey }) => baseSprite(gameKey, 91), imgS: ({ gameKey }) => shinySprite(gameKey, 91), },
		{
			id: 331, natiId: 211, name: "Qwilfish", img: ({ gameKey }) => baseSprite(gameKey, 211), imgS: ({ gameKey }) => shinySprite(gameKey, 211), forms: [
				{ name: "Johtonian", img: ({ gameKey }) => baseSprite(gameKey, 211), imgS: ({ gameKey }) => shinySprite(gameKey, 211), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0211-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0211-h"), tags: ["hisuian"], }
			],
		},
		{ id: 332, natiId: 370, name: "Luvdisc", img: ({ gameKey }) => baseSprite(gameKey, 370), imgS: ({ gameKey }) => shinySprite(gameKey, 370), },
		{
			id: 333, natiId: 456, name: "Finneon", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0456-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0456-f"), }
			],
		},
		{
			id: 334, natiId: 457, name: "Lumineon", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0457-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0457-f"), }
			],
		},
		{ id: 335, natiId: 779, name: "Bruxish", img: ({ gameKey }) => baseSprite(gameKey, 779), imgS: ({ gameKey }) => shinySprite(gameKey, 779), },
		{ id: 336, natiId: 594, name: "Alomomola", img: ({ gameKey }) => baseSprite(gameKey, 594), imgS: ({ gameKey }) => shinySprite(gameKey, 594), },
		{ id: 337, natiId: 690, name: "Skrelp", img: ({ gameKey }) => baseSprite(gameKey, 690), imgS: ({ gameKey }) => shinySprite(gameKey, 690), },
		{ id: 338, natiId: 691, name: "Dragalge", img: ({ gameKey }) => baseSprite(gameKey, 691), imgS: ({ gameKey }) => shinySprite(gameKey, 691), },
		{ id: 339, natiId: 692, name: "Clauncher", img: ({ gameKey }) => baseSprite(gameKey, 692), imgS: ({ gameKey }) => shinySprite(gameKey, 692), },
		{ id: 340, natiId: 693, name: "Clawitzer", img: ({ gameKey }) => baseSprite(gameKey, 693), imgS: ({ gameKey }) => shinySprite(gameKey, 693), },
		{ id: 341, natiId: 602, name: "Tynamo", img: ({ gameKey }) => baseSprite(gameKey, 602), imgS: ({ gameKey }) => shinySprite(gameKey, 602), },
		{ id: 342, natiId: 603, name: "Eelektrik", img: ({ gameKey }) => baseSprite(gameKey, 603), imgS: ({ gameKey }) => shinySprite(gameKey, 603), },
		{ id: 343, natiId: 604, name: "Eelektross", img: ({ gameKey }) => baseSprite(gameKey, 604), imgS: ({ gameKey }) => shinySprite(gameKey, 604), },
		{ id: 344, natiId: 747, name: "Mareanie", img: ({ gameKey }) => baseSprite(gameKey, 747), imgS: ({ gameKey }) => shinySprite(gameKey, 747), },
		{ id: 345, natiId: 748, name: "Toxapex", img: ({ gameKey }) => baseSprite(gameKey, 748), imgS: ({ gameKey }) => shinySprite(gameKey, 748), },
		{ id: 346, natiId: 973, name: "Flamigo", img: ({ gameKey }) => baseSprite(gameKey, 973), imgS: ({ gameKey }) => shinySprite(gameKey, 973), },
		{ id: 347, natiId: 147, name: "Dratini", img: ({ gameKey }) => baseSprite(gameKey, 147), imgS: ({ gameKey }) => shinySprite(gameKey, 147), tags: ["pseudo"], },
		{ id: 348, natiId: 148, name: "Dragonair", img: ({ gameKey }) => baseSprite(gameKey, 148), imgS: ({ gameKey }) => shinySprite(gameKey, 148), tags: ["pseudo"], },
		{ id: 349, natiId: 149, name: "Dragonite", img: ({ gameKey }) => baseSprite(gameKey, 149), imgS: ({ gameKey }) => shinySprite(gameKey, 149), tags: ["pseudo"], },
		{ id: 350, natiId: 872, name: "Snom", img: ({ gameKey }) => baseSprite(gameKey, 872), imgS: ({ gameKey }) => shinySprite(gameKey, 872), },
		{ id: 351, natiId: 873, name: "Frosmoth", img: ({ gameKey }) => baseSprite(gameKey, 873), imgS: ({ gameKey }) => shinySprite(gameKey, 873), },
		{
			id: 352, natiId: 459, name: "Snover", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0459-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0459-f"), }
			],
		},
		{
			id: 353, natiId: 460, name: "Abomasnow", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0460-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0460-f"), },],
		},
		{ id: 354, natiId: 225, name: "Delibird", img: ({ gameKey }) => baseSprite(gameKey, 225), imgS: ({ gameKey }) => shinySprite(gameKey, 225), },
		{ id: 355, natiId: 613, name: "Cubchoo", img: ({ gameKey }) => baseSprite(gameKey, 613), imgS: ({ gameKey }) => shinySprite(gameKey, 613), },
		{ id: 356, natiId: 614, name: "Beartic", img: ({ gameKey }) => baseSprite(gameKey, 614), imgS: ({ gameKey }) => shinySprite(gameKey, 614), },
		{ id: 357, natiId: 361, name: "Snorunt", img: ({ gameKey }) => baseSprite(gameKey, 361), imgS: ({ gameKey }) => shinySprite(gameKey, 361), },
		{ id: 358, natiId: 362, name: "Glalie", img: ({ gameKey }) => baseSprite(gameKey, 362), imgS: ({ gameKey }) => shinySprite(gameKey, 362), },
		{ id: 359, natiId: 478, name: "Froslass", img: ({ gameKey }) => baseSprite(gameKey, 478), imgS: ({ gameKey }) => shinySprite(gameKey, 478), },
		{ id: 360, natiId: 615, name: "Cryogonal", img: ({ gameKey }) => baseSprite(gameKey, 615), imgS: ({ gameKey }) => shinySprite(gameKey, 615), },
		{ id: 361, natiId: 974, name: "Cetoddle", img: ({ gameKey }) => baseSprite(gameKey, 974), imgS: ({ gameKey }) => shinySprite(gameKey, 974), },
		{ id: 362, natiId: 975, name: "Cetitan", img: ({ gameKey }) => baseSprite(gameKey, 975), imgS: ({ gameKey }) => shinySprite(gameKey, 975), },
		{ id: 363, natiId: 712, name: "Bergmite", img: ({ gameKey }) => baseSprite(gameKey, 712), imgS: ({ gameKey }) => shinySprite(gameKey, 712), },
		{
			id: 364, natiId: 713, name: "Avalugg", img: ({ gameKey }) => baseSprite(gameKey, 713), imgS: ({ gameKey }) => shinySprite(gameKey, 713), forms: [
				{ name: "Kalosian", img: ({ gameKey }) => baseSprite(gameKey, 713), imgS: ({ gameKey }) => shinySprite(gameKey, 713), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0713-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0713-h"), tags: ["hisuian"], }
			],
		},
		{ id: 365, natiId: 627, name: "Rufflet", img: ({ gameKey }) => baseSprite(gameKey, 627), imgS: ({ gameKey }) => shinySprite(gameKey, 627), },
		{
			id: 366, natiId: 628, name: "Braviary", img: ({ gameKey }) => baseSprite(gameKey, 628), imgS: ({ gameKey }) => shinySprite(gameKey, 628), forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 628), imgS: ({ gameKey }) => shinySprite(gameKey, 628), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0628-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0628-h"), tags: ["hisuian"], }
			],
		},
		{ id: 367, natiId: 624, name: "Pawniard", img: ({ gameKey }) => baseSprite(gameKey, 624), imgS: ({ gameKey }) => shinySprite(gameKey, 624), },
		{ id: 368, natiId: 625, name: "Bisharp", img: ({ gameKey }) => baseSprite(gameKey, 625), imgS: ({ gameKey }) => shinySprite(gameKey, 625), },
		{ id: 369, natiId: 983, name: "Kingambit", img: ({ gameKey }) => baseSprite(gameKey, 983), imgS: ({ gameKey }) => shinySprite(gameKey, 983), },
		{ id: 370, natiId: 633, name: "Deino", img: ({ gameKey }) => baseSprite(gameKey, 633), imgS: ({ gameKey }) => shinySprite(gameKey, 633), tags: ["pseudo"], },
		{ id: 371, natiId: 634, name: "Zweilous", img: ({ gameKey }) => baseSprite(gameKey, 634), imgS: ({ gameKey }) => shinySprite(gameKey, 634), tags: ["pseudo"], },
		{ id: 372, natiId: 635, name: "Hydreigon", img: ({ gameKey }) => baseSprite(gameKey, 635), imgS: ({ gameKey }) => shinySprite(gameKey, 635), tags: ["pseudo"], },
		{ id: 373, natiId: 976, name: "Veluza", img: ({ gameKey }) => baseSprite(gameKey, 976), imgS: ({ gameKey }) => shinySprite(gameKey, 976), },
		{ id: 374, natiId: 977, name: "Dondozo", img: ({ gameKey }) => baseSprite(gameKey, 977), imgS: ({ gameKey }) => shinySprite(gameKey, 977), },
		{
			id: 375, natiId: 978, name: "Tatsugiri", img: ({ gameKey }) => baseSprite(gameKey, 978), imgS: ({ gameKey }) => shinySprite(gameKey, 978), tags: ["other"], forms: [
				{ name: "Curly", img: ({ gameKey }) => baseSprite(gameKey, 978), imgS: ({ gameKey }) => shinySprite(gameKey, 978), },
				{ name: "Droopy", img: ({ gameKey }) => baseSprite(gameKey, "0978-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0978-d"), },
				{ name: "Stretchy", img: ({ gameKey }) => baseSprite(gameKey, "0978-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0978-s"), }
			],
		},
		{ id: 376, natiId: 984, name: "Great Tusk", img: ({ gameKey }) => baseSprite(gameKey, 984), imgS: ({ gameKey }) => shinySprite(gameKey, 984), tags: ["paradox"], },
		{ id: 377, natiId: 985, name: "Scream Tail", img: ({ gameKey }) => baseSprite(gameKey, 985), imgS: ({ gameKey }) => shinySprite(gameKey, 985), tags: ["paradox"], },
		{ id: 378, natiId: 986, name: "Brute Bonnet", img: ({ gameKey }) => baseSprite(gameKey, 986), imgS: ({ gameKey }) => shinySprite(gameKey, 986), tags: ["paradox"], },
		{ id: 379, natiId: 987, name: "Flutter Mane", img: ({ gameKey }) => baseSprite(gameKey, 987), imgS: ({ gameKey }) => shinySprite(gameKey, 987), tags: ["paradox"], },
		{ id: 380, natiId: 988, name: "Slither Wing", img: ({ gameKey }) => baseSprite(gameKey, 988), imgS: ({ gameKey }) => shinySprite(gameKey, 988), tags: ["paradox"], },
		{ id: 381, natiId: 989, name: "Sandy Shocks", img: ({ gameKey }) => baseSprite(gameKey, 989), imgS: ({ gameKey }) => shinySprite(gameKey, 989), tags: ["paradox"], },
		{ id: 382, natiId: 990, name: "Iron Treads", img: ({ gameKey }) => baseSprite(gameKey, 990), imgS: ({ gameKey }) => shinySprite(gameKey, 990), tags: ["paradox"], },
		{ id: 383, natiId: 991, name: "Iron Bundle", img: ({ gameKey }) => baseSprite(gameKey, 991), imgS: ({ gameKey }) => shinySprite(gameKey, 991), tags: ["paradox"], },
		{ id: 384, natiId: 992, name: "Iron Hands", img: ({ gameKey }) => baseSprite(gameKey, 992), imgS: ({ gameKey }) => shinySprite(gameKey, 992), tags: ["paradox"], },
		{ id: 385, natiId: 993, name: "Iron Jugulis", img: ({ gameKey }) => baseSprite(gameKey, 993), imgS: ({ gameKey }) => shinySprite(gameKey, 993), tags: ["paradox"], },
		{ id: 386, natiId: 994, name: "Iron Moth", img: ({ gameKey }) => baseSprite(gameKey, 994), imgS: ({ gameKey }) => shinySprite(gameKey, 994), tags: ["paradox"], },
		{ id: 387, natiId: 995, name: "Iron Thorns", img: ({ gameKey }) => baseSprite(gameKey, 995), imgS: ({ gameKey }) => shinySprite(gameKey, 995), tags: ["paradox"], },
		{ id: 388, natiId: 996, name: "Frigibax", img: ({ gameKey }) => baseSprite(gameKey, 996), imgS: ({ gameKey }) => shinySprite(gameKey, 996), tags: ["pseudo"], },
		{ id: 389, natiId: 997, name: "Arctibax", img: ({ gameKey }) => baseSprite(gameKey, 997), imgS: ({ gameKey }) => shinySprite(gameKey, 997), tags: ["pseudo"], },
		{ id: 390, natiId: 998, name: "Baxcalibur", img: ({ gameKey }) => baseSprite(gameKey, 998), imgS: ({ gameKey }) => shinySprite(gameKey, 998), tags: ["pseudo"], },
		{
			id: 391, natiId: 999, name: "Gimmighoul", img: ({ gameKey }) => baseSprite(gameKey, 999), imgS: ({ gameKey }) => shinySprite(gameKey, 999), tags: ["other"], forms: [
				{ name: "Chest", img: ({ gameKey }) => baseSprite(gameKey, 999), imgS: ({ gameKey }) => shinySprite(gameKey, 999), },
				{ name: "Roaming", img: ({ gameKey }) => baseSprite(gameKey, "0999-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0999-r"), }
			],
		},
		{ id: 392, natiId: 1000, name: "Gholdengo", img: ({ gameKey }) => baseSprite(gameKey, 1000), imgS: ({ gameKey }) => shinySprite(gameKey, 1000), },
		{ id: 393, natiId: 1001, name: "Wo-Chien", img: ({ gameKey }) => baseSprite(gameKey, 1001), imgS: ({ gameKey }) => shinySprite(gameKey, 1001), tags: ["legendary"], },
		{ id: 394, natiId: 1002, name: "Chien-Pao", img: ({ gameKey }) => baseSprite(gameKey, 1002), imgS: ({ gameKey }) => shinySprite(gameKey, 1002), tags: ["legendary"], },
		{ id: 395, natiId: 1003, name: "Ting-Lu", img: ({ gameKey }) => baseSprite(gameKey, 1003), imgS: ({ gameKey }) => shinySprite(gameKey, 1003), tags: ["legendary"], },
		{ id: 396, natiId: 1004, name: "Chi-Yu", img: ({ gameKey }) => baseSprite(gameKey, 1004), imgS: ({ gameKey }) => shinySprite(gameKey, 1004), tags: ["legendary"], },
		{ id: 397, natiId: 1005, name: "Roaring Moon", img: ({ gameKey }) => baseSprite(gameKey, 1005), imgS: ({ gameKey }) => shinySprite(gameKey, 1005), tags: ["paradox"], },
		{ id: 398, natiId: 1006, name: "Iron Valiant", img: ({ gameKey }) => baseSprite(gameKey, 1006), imgS: ({ gameKey }) => shinySprite(gameKey, 1006), tags: ["paradox"], },
		{ id: 399, natiId: 1007, name: "Koraidon", img: ({ gameKey }) => baseSprite(gameKey, 1007), imgS: ({ gameKey }) => shinySprite(gameKey, 1007), tags: ["legendary"], },
		{ id: 400, natiId: 1008, name: "Miraidon", img: ({ gameKey }) => baseSprite(gameKey, 1008), imgS: ({ gameKey }) => shinySprite(gameKey, 1008), tags: ["legendary"], }
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();