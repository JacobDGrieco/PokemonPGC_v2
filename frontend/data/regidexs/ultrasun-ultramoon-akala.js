import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 7;
	const GAME_KEYS = ["ultrasun-akala", "ultramoon-akala"];
	const DEX_NAME = "Akala Dex";

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
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0019-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0019-a"), tags: ["alolan"], },],
		},
		{
			id: 7, natiId: 20, name: "Raticate", img: ({ gameKey }) => baseSprite(gameKey, "0020-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-a"), tags: ["gender"], forms: [
				{ name: "Kantonian Male", img: ({ gameKey }) => baseSprite(gameKey, 20), imgS: ({ gameKey }) => shinySprite(gameKey, 20), },
				{ name: "Kantonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0020-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-f"), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0020-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-a"), tags: ["alolan"], },],
		},
		{ id: 8, natiId: 10, name: "Caterpie", img: ({ gameKey }) => baseSprite(gameKey, 10), imgS: ({ gameKey }) => shinySprite(gameKey, 10), },
		{ id: 9, natiId: 11, name: "Metapod", img: ({ gameKey }) => baseSprite(gameKey, 11), imgS: ({ gameKey }) => shinySprite(gameKey, 11), },
		{
			id: 10, natiId: 12, name: "Butterfree", img: ({ gameKey }) => baseSprite(gameKey, 12), imgS: ({ gameKey }) => shinySprite(gameKey, 12), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 12), imgS: ({ gameKey }) => shinySprite(gameKey, 12), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0012-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0012-f"), },],
		},
		{ id: 11, natiId: 736, name: "Grubbin", img: ({ gameKey }) => baseSprite(gameKey, 736), imgS: ({ gameKey }) => shinySprite(gameKey, 736), },
		{ id: 12, natiId: 737, name: "Charjabug", img: ({ gameKey }) => baseSprite(gameKey, 737), imgS: ({ gameKey }) => shinySprite(gameKey, 737), },
		{ id: 13, natiId: 738, name: "Vikavolt", img: ({ gameKey }) => baseSprite(gameKey, 738), imgS: ({ gameKey }) => shinySprite(gameKey, 738), },
		{ id: 14, natiId: 438, name: "Bonsly", img: ({ gameKey }) => baseSprite(gameKey, 438), imgS: ({ gameKey }) => shinySprite(gameKey, 438), },
		{
			id: 15, natiId: 185, name: "Sudowoodo", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0185-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0185-f"), },],
		},
		{ id: 16, natiId: 440, name: "Happiny", img: ({ gameKey }) => baseSprite(gameKey, 440), imgS: ({ gameKey }) => shinySprite(gameKey, 440), },
		{ id: 17, natiId: 113, name: "Chansey", img: ({ gameKey }) => baseSprite(gameKey, 113), imgS: ({ gameKey }) => shinySprite(gameKey, 113), },
		{ id: 18, natiId: 242, name: "Blissey", img: ({ gameKey }) => baseSprite(gameKey, 242), imgS: ({ gameKey }) => shinySprite(gameKey, 242), },
		{ id: 19, natiId: 278, name: "Wingull", img: ({ gameKey }) => baseSprite(gameKey, 278), imgS: ({ gameKey }) => shinySprite(gameKey, 278), },
		{ id: 20, natiId: 279, name: "Pelipper", img: ({ gameKey }) => baseSprite(gameKey, 279), imgS: ({ gameKey }) => shinySprite(gameKey, 279), },
		{ id: 21, natiId: 739, name: "Crabrawler", img: ({ gameKey }) => baseSprite(gameKey, 739), imgS: ({ gameKey }) => shinySprite(gameKey, 739), },
		{ id: 22, natiId: 740, name: "Crabominable", img: ({ gameKey }) => baseSprite(gameKey, 740), imgS: ({ gameKey }) => shinySprite(gameKey, 740), },
		{ id: 23, natiId: 92, name: "Gastly", img: ({ gameKey }) => baseSprite(gameKey, 92), imgS: ({ gameKey }) => shinySprite(gameKey, 92), },
		{ id: 24, natiId: 93, name: "Haunter", img: ({ gameKey }) => baseSprite(gameKey, 93), imgS: ({ gameKey }) => shinySprite(gameKey, 93), },
		{ id: 25, natiId: 94, name: "Gengar", img: ({ gameKey }) => baseSprite(gameKey, 94), imgS: ({ gameKey }) => shinySprite(gameKey, 94), tags: ["mega"], },
		{
			id: 26, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), },],
		},
		{
			id: 27, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), },],
		},
		{ id: 28, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169), },
		{
			id: 29, natiId: 50, name: "Diglett", img: ({ gameKey }) => baseSprite(gameKey, "0050-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0050-a"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0050-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0050-a"), tags: ["alolan"], },],
		},
		{
			id: 30, natiId: 51, name: "Dugtrio", img: ({ gameKey }) => baseSprite(gameKey, "0051-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0051-a"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0051-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0051-a"), tags: ["alolan"], },],
		},
		{
			id: 31, natiId: 741, name: "Oricorio", img: ({ gameKey }) => baseSprite(gameKey, "0741-pa"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-pa"), tags: ["other"], forms: [
				{ name: "Baile Style", img: ({ gameKey }) => baseSprite(gameKey, 741), imgS: ({ gameKey }) => shinySprite(gameKey, 741), },
				{ name: "Pa'u Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-pa"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-pa"), },
				{ name: "Pom-Pom Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-po"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-po"), },
				{ name: "Sensu Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-s"), },],
		},
		{ id: 32, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54), },
		{ id: 33, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55), },
		{
			id: 34, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), },],
		},
		{
			id: 35, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },],
		},
		{ id: 36, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339), },
		{ id: 37, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340), },
		{ id: 38, natiId: 72, name: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72), imgS: ({ gameKey }) => shinySprite(gameKey, 72), },
		{ id: 39, natiId: 73, name: "Tentacruel", img: ({ gameKey }) => baseSprite(gameKey, 73), imgS: ({ gameKey }) => shinySprite(gameKey, 73), },
		{
			id: 40, natiId: 456, name: "Finneon", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0456-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0456-f"), },],
		},
		{
			id: 41, natiId: 457, name: "Lumineon", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0457-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0457-f"), },],
		},
		{ id: 42, natiId: 746, name: "Wishiwashi", img: ({ gameKey }) => baseSprite(gameKey, 746), imgS: ({ gameKey }) => shinySprite(gameKey, 746), },
		{ id: 43, natiId: 370, name: "Luvdisc", img: ({ gameKey }) => baseSprite(gameKey, 370), imgS: ({ gameKey }) => shinySprite(gameKey, 370), },
		{ id: 44, natiId: 222, name: "Corsola", img: ({ gameKey }) => baseSprite(gameKey, 222), imgS: ({ gameKey }) => shinySprite(gameKey, 222), },
		{ id: 45, natiId: 747, name: "Mareanie", img: ({ gameKey }) => baseSprite(gameKey, 747), imgS: ({ gameKey }) => shinySprite(gameKey, 747), },
		{ id: 46, natiId: 748, name: "Toxapex", img: ({ gameKey }) => baseSprite(gameKey, 748), imgS: ({ gameKey }) => shinySprite(gameKey, 748), },
		{ id: 47, natiId: 223, name: "Remoraid", img: ({ gameKey }) => baseSprite(gameKey, 223), imgS: ({ gameKey }) => shinySprite(gameKey, 223), },
		{
			id: 48, natiId: 224, name: "Octillery", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0224-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0224-f"), },],
		},
		{ id: 49, natiId: 458, name: "Mantyke", img: ({ gameKey }) => baseSprite(gameKey, 458), imgS: ({ gameKey }) => shinySprite(gameKey, 458), },
		{ id: 50, natiId: 226, name: "Mantine", img: ({ gameKey }) => baseSprite(gameKey, 226), imgS: ({ gameKey }) => shinySprite(gameKey, 226), },
		{ id: 51, natiId: 506, name: "Lillipup", img: ({ gameKey }) => baseSprite(gameKey, 506), imgS: ({ gameKey }) => shinySprite(gameKey, 506), },
		{ id: 52, natiId: 507, name: "Herdier", img: ({ gameKey }) => baseSprite(gameKey, 507), imgS: ({ gameKey }) => shinySprite(gameKey, 507), },
		{ id: 53, natiId: 508, name: "Stoutland", img: ({ gameKey }) => baseSprite(gameKey, 508), imgS: ({ gameKey }) => shinySprite(gameKey, 508), },
		{ id: 54, natiId: 133, name: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133), tags: ["zcrystal"], },
		{ id: 55, natiId: 134, name: "Vaporeon", img: ({ gameKey }) => baseSprite(gameKey, 134), imgS: ({ gameKey }) => shinySprite(gameKey, 134), },
		{ id: 56, natiId: 135, name: "Jolteon", img: ({ gameKey }) => baseSprite(gameKey, 135), imgS: ({ gameKey }) => shinySprite(gameKey, 135), },
		{ id: 57, natiId: 136, name: "Flareon", img: ({ gameKey }) => baseSprite(gameKey, 136), imgS: ({ gameKey }) => shinySprite(gameKey, 136), },
		{ id: 58, natiId: 196, name: "Espeon", img: ({ gameKey }) => baseSprite(gameKey, 196), imgS: ({ gameKey }) => shinySprite(gameKey, 196), },
		{ id: 59, natiId: 197, name: "Umbreon", img: ({ gameKey }) => baseSprite(gameKey, 197), imgS: ({ gameKey }) => shinySprite(gameKey, 197), },
		{ id: 60, natiId: 470, name: "Leafeon", img: ({ gameKey }) => baseSprite(gameKey, 470), imgS: ({ gameKey }) => shinySprite(gameKey, 470), },
		{ id: 61, natiId: 471, name: "Glaceon", img: ({ gameKey }) => baseSprite(gameKey, 471), imgS: ({ gameKey }) => shinySprite(gameKey, 471), },
		{ id: 62, natiId: 700, name: "Sylveon", img: ({ gameKey }) => baseSprite(gameKey, 700), imgS: ({ gameKey }) => shinySprite(gameKey, 700), },
		{ id: 63, natiId: 179, name: "Mareep", img: ({ gameKey }) => baseSprite(gameKey, 179), imgS: ({ gameKey }) => shinySprite(gameKey, 179), },
		{ id: 64, natiId: 180, name: "Flaaffy", img: ({ gameKey }) => baseSprite(gameKey, 180), imgS: ({ gameKey }) => shinySprite(gameKey, 180), },
		{ id: 65, natiId: 181, name: "Ampharos", img: ({ gameKey }) => baseSprite(gameKey, 181), imgS: ({ gameKey }) => shinySprite(gameKey, 181), tags: ["mega"], },
		{ id: 66, natiId: 749, name: "Mudbray", img: ({ gameKey }) => baseSprite(gameKey, 749), imgS: ({ gameKey }) => shinySprite(gameKey, 749), },
		{ id: 67, natiId: 750, name: "Mudsdale", img: ({ gameKey }) => baseSprite(gameKey, 750), imgS: ({ gameKey }) => shinySprite(gameKey, 750), },
		{ id: 68, natiId: 174, name: "Igglybuff", img: ({ gameKey }) => baseSprite(gameKey, 174), imgS: ({ gameKey }) => shinySprite(gameKey, 174), },
		{ id: 69, natiId: 39, name: "Jigglypuff", img: ({ gameKey }) => baseSprite(gameKey, 39), imgS: ({ gameKey }) => shinySprite(gameKey, 39), },
		{ id: 70, natiId: 40, name: "Wigglytuff", img: ({ gameKey }) => baseSprite(gameKey, 40), imgS: ({ gameKey }) => shinySprite(gameKey, 40), },
		{ id: 71, natiId: 128, name: "Tauros", img: ({ gameKey }) => baseSprite(gameKey, 128), imgS: ({ gameKey }) => shinySprite(gameKey, 128), },
		{ id: 72, natiId: 241, name: "Miltank", img: ({ gameKey }) => baseSprite(gameKey, 241), imgS: ({ gameKey }) => shinySprite(gameKey, 241), },
		{ id: 73, natiId: 283, name: "Surskit", img: ({ gameKey }) => baseSprite(gameKey, 283), imgS: ({ gameKey }) => shinySprite(gameKey, 283), },
		{ id: 74, natiId: 284, name: "Masquerain", img: ({ gameKey }) => baseSprite(gameKey, 284), imgS: ({ gameKey }) => shinySprite(gameKey, 284), },
		{ id: 75, natiId: 751, name: "Dewpider", img: ({ gameKey }) => baseSprite(gameKey, 751), imgS: ({ gameKey }) => shinySprite(gameKey, 751), },
		{ id: 76, natiId: 752, name: "Araquanid", img: ({ gameKey }) => baseSprite(gameKey, 752), imgS: ({ gameKey }) => shinySprite(gameKey, 752), },
		{ id: 77, natiId: 753, name: "Fomantis", img: ({ gameKey }) => baseSprite(gameKey, 753), imgS: ({ gameKey }) => shinySprite(gameKey, 753), },
		{ id: 78, natiId: 754, name: "Lurantis", img: ({ gameKey }) => baseSprite(gameKey, 754), imgS: ({ gameKey }) => shinySprite(gameKey, 754), },
		{ id: 79, natiId: 755, name: "Morelull", img: ({ gameKey }) => baseSprite(gameKey, 755), imgS: ({ gameKey }) => shinySprite(gameKey, 755), },
		{ id: 80, natiId: 756, name: "Shiinotic", img: ({ gameKey }) => baseSprite(gameKey, 756), imgS: ({ gameKey }) => shinySprite(gameKey, 756), },
		{ id: 81, natiId: 46, name: "Paras", img: ({ gameKey }) => baseSprite(gameKey, 46), imgS: ({ gameKey }) => shinySprite(gameKey, 46), },
		{ id: 82, natiId: 47, name: "Parasect", img: ({ gameKey }) => baseSprite(gameKey, 47), imgS: ({ gameKey }) => shinySprite(gameKey, 47), },
		{ id: 83, natiId: 60, name: "Poliwag", img: ({ gameKey }) => baseSprite(gameKey, 60), imgS: ({ gameKey }) => shinySprite(gameKey, 60), },
		{ id: 84, natiId: 61, name: "Poliwhirl", img: ({ gameKey }) => baseSprite(gameKey, 61), imgS: ({ gameKey }) => shinySprite(gameKey, 61), },
		{ id: 85, natiId: 62, name: "Poliwrath", img: ({ gameKey }) => baseSprite(gameKey, 62), imgS: ({ gameKey }) => shinySprite(gameKey, 62), },
		{
			id: 86, natiId: 186, name: "Politoed", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 186), imgS: ({ gameKey }) => shinySprite(gameKey, 186), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0186-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0186-f"), },],
		},
		{
			id: 87, natiId: 118, name: "Goldeen", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0118-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0118-f"), },],
		},
		{
			id: 88, natiId: 119, name: "Seaking", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0119-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0119-f"), },],
		},
		{
			id: 89, natiId: 550, name: "Basculin", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), tags: ["other"], forms: [
				{ name: "Blue-Striped", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), },
				{ name: "Red-Striped", img: ({ gameKey }) => baseSprite(gameKey, "0550-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0550-r"), },],
		},
		{ id: 90, natiId: 349, name: "Feebas", img: ({ gameKey }) => baseSprite(gameKey, 349), imgS: ({ gameKey }) => shinySprite(gameKey, 349), },
		{
			id: 91, natiId: 350, name: "Milotic", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0350-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0350-f"), },],
		},
		{ id: 92, natiId: 594, name: "Alomomola", img: ({ gameKey }) => baseSprite(gameKey, 594), imgS: ({ gameKey }) => shinySprite(gameKey, 594), },
		{ id: 93, natiId: 661, name: "Fletchling", img: ({ gameKey }) => baseSprite(gameKey, 661), imgS: ({ gameKey }) => shinySprite(gameKey, 661), },
		{ id: 94, natiId: 662, name: "Fletchinder", img: ({ gameKey }) => baseSprite(gameKey, 662), imgS: ({ gameKey }) => shinySprite(gameKey, 662), },
		{ id: 95, natiId: 663, name: "Talonflame", img: ({ gameKey }) => baseSprite(gameKey, 663), imgS: ({ gameKey }) => shinySprite(gameKey, 663), },
		{ id: 96, natiId: 757, name: "Salandit", img: ({ gameKey }) => baseSprite(gameKey, 757), imgS: ({ gameKey }) => shinySprite(gameKey, 757), },
		{ id: 97, natiId: 758, name: "Salazzle", img: ({ gameKey }) => baseSprite(gameKey, 758), imgS: ({ gameKey }) => shinySprite(gameKey, 758), },
		{ id: 98, natiId: 104, name: "Cubone", img: ({ gameKey }) => baseSprite(gameKey, 104), imgS: ({ gameKey }) => shinySprite(gameKey, 104), },
		{
			id: 99, natiId: 105, name: "Marowak", img: ({ gameKey }) => baseSprite(gameKey, 105), imgS: ({ gameKey }) => shinySprite(gameKey, 105), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 105), imgS: ({ gameKey }) => shinySprite(gameKey, 105), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0105-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0105-a"), tags: ["alolan"], },],
		},
		{ id: 100, natiId: 115, name: "Kangaskhan", img: ({ gameKey }) => baseSprite(gameKey, 115), imgS: ({ gameKey }) => shinySprite(gameKey, 115), tags: ["mega"], },
		{ id: 101, natiId: 240, name: "Magby", img: ({ gameKey }) => baseSprite(gameKey, 240), imgS: ({ gameKey }) => shinySprite(gameKey, 240), },
		{ id: 102, natiId: 126, name: "Magmar", img: ({ gameKey }) => baseSprite(gameKey, 126), imgS: ({ gameKey }) => shinySprite(gameKey, 126), },
		{ id: 103, natiId: 467, name: "Magmortar", img: ({ gameKey }) => baseSprite(gameKey, 467), imgS: ({ gameKey }) => shinySprite(gameKey, 467), },
		{ id: 104, natiId: 636, name: "Larvesta", img: ({ gameKey }) => baseSprite(gameKey, 636), imgS: ({ gameKey }) => shinySprite(gameKey, 636), },
		{ id: 105, natiId: 637, name: "Volcarona", img: ({ gameKey }) => baseSprite(gameKey, 637), imgS: ({ gameKey }) => shinySprite(gameKey, 637), },
		{ id: 106, natiId: 759, name: "Stufful", img: ({ gameKey }) => baseSprite(gameKey, 759), imgS: ({ gameKey }) => shinySprite(gameKey, 759), },
		{ id: 107, natiId: 760, name: "Bewear", img: ({ gameKey }) => baseSprite(gameKey, 760), imgS: ({ gameKey }) => shinySprite(gameKey, 760), },
		{ id: 108, natiId: 761, name: "Bounsweet", img: ({ gameKey }) => baseSprite(gameKey, 761), imgS: ({ gameKey }) => shinySprite(gameKey, 761), },
		{ id: 109, natiId: 762, name: "Steenee", img: ({ gameKey }) => baseSprite(gameKey, 762), imgS: ({ gameKey }) => shinySprite(gameKey, 762), },
		{ id: 110, natiId: 763, name: "Tsareena", img: ({ gameKey }) => baseSprite(gameKey, 763), imgS: ({ gameKey }) => shinySprite(gameKey, 763), },
		{ id: 111, natiId: 764, name: "Comfey", img: ({ gameKey }) => baseSprite(gameKey, 764), imgS: ({ gameKey }) => shinySprite(gameKey, 764), },
		{ id: 112, natiId: 127, name: "Pinsir", img: ({ gameKey }) => baseSprite(gameKey, 127), imgS: ({ gameKey }) => shinySprite(gameKey, 127), tags: ["mega"], },
		{ id: 113, natiId: 163, name: "Hoothoot", img: ({ gameKey }) => baseSprite(gameKey, 163), imgS: ({ gameKey }) => shinySprite(gameKey, 163), },
		{ id: 114, natiId: 164, name: "Noctowl", img: ({ gameKey }) => baseSprite(gameKey, 164), imgS: ({ gameKey }) => shinySprite(gameKey, 164), },
		{ id: 115, natiId: 352, name: "Kecleon", img: ({ gameKey }) => baseSprite(gameKey, 352), imgS: ({ gameKey }) => shinySprite(gameKey, 352), },
		{ id: 116, natiId: 765, name: "Oranguru", img: ({ gameKey }) => baseSprite(gameKey, 765), imgS: ({ gameKey }) => shinySprite(gameKey, 765), },
		{ id: 117, natiId: 766, name: "Passimian", img: ({ gameKey }) => baseSprite(gameKey, 766), imgS: ({ gameKey }) => shinySprite(gameKey, 766), },
		{ id: 118, natiId: 704, name: "Goomy", img: ({ gameKey }) => baseSprite(gameKey, 704), imgS: ({ gameKey }) => shinySprite(gameKey, 704), tags: ["pseudo"], },
		{ id: 119, natiId: 705, name: "Sliggoo", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), tags: ["pseudo"], },
		{ id: 120, natiId: 706, name: "Goodra", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), tags: ["pseudo"], },
		{
			id: 121, natiId: 351, name: "Castform", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), tags: ["other"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), },
				{ name: "Rainy", img: ({ gameKey }) => baseSprite(gameKey, "0351-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-r"), },
				{ name: "Snowy", img: ({ gameKey }) => baseSprite(gameKey, "0351-i"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-i"), },
				{ name: "Sunny", img: ({ gameKey }) => baseSprite(gameKey, "0351-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-s"), },],
		},
		{ id: 122, natiId: 767, name: "Wimpod", img: ({ gameKey }) => baseSprite(gameKey, 767), imgS: ({ gameKey }) => shinySprite(gameKey, 767), },
		{ id: 123, natiId: 768, name: "Golisopod", img: ({ gameKey }) => baseSprite(gameKey, 768), imgS: ({ gameKey }) => shinySprite(gameKey, 768), },
		{ id: 124, natiId: 120, name: "Staryu", img: ({ gameKey }) => baseSprite(gameKey, 120), imgS: ({ gameKey }) => shinySprite(gameKey, 120), },
		{ id: 125, natiId: 121, name: "Starmie", img: ({ gameKey }) => baseSprite(gameKey, 121), imgS: ({ gameKey }) => shinySprite(gameKey, 121), },
		{ id: 126, natiId: 769, name: "Sandygast", img: ({ gameKey }) => baseSprite(gameKey, 769), imgS: ({ gameKey }) => shinySprite(gameKey, 769), },
		{ id: 127, natiId: 770, name: "Palossand", img: ({ gameKey }) => baseSprite(gameKey, 770), imgS: ({ gameKey }) => shinySprite(gameKey, 770), },
		{ id: 128, natiId: 138, name: "Omanyte", img: ({ gameKey }) => baseSprite(gameKey, 138), imgS: ({ gameKey }) => shinySprite(gameKey, 138), tags: ["fossil"], },
		{ id: 129, natiId: 139, name: "Omastar", img: ({ gameKey }) => baseSprite(gameKey, 139), imgS: ({ gameKey }) => shinySprite(gameKey, 139), tags: ["fossil"], },
		{ id: 130, natiId: 140, name: "Kabuto", img: ({ gameKey }) => baseSprite(gameKey, 140), imgS: ({ gameKey }) => shinySprite(gameKey, 140), tags: ["fossil"], },
		{ id: 131, natiId: 141, name: "Kabutops", img: ({ gameKey }) => baseSprite(gameKey, 141), imgS: ({ gameKey }) => shinySprite(gameKey, 141), tags: ["fossil"], },
		{ id: 132, natiId: 345, name: "Lileep", img: ({ gameKey }) => baseSprite(gameKey, 345), imgS: ({ gameKey }) => shinySprite(gameKey, 345), tags: ["fossil"], },
		{ id: 133, natiId: 346, name: "Cradily", img: ({ gameKey }) => baseSprite(gameKey, 346), imgS: ({ gameKey }) => shinySprite(gameKey, 346), tags: ["fossil"], },
		{ id: 134, natiId: 347, name: "Anorith", img: ({ gameKey }) => baseSprite(gameKey, 347), imgS: ({ gameKey }) => shinySprite(gameKey, 347), tags: ["fossil"], },
		{ id: 135, natiId: 348, name: "Armaldo", img: ({ gameKey }) => baseSprite(gameKey, 348), imgS: ({ gameKey }) => shinySprite(gameKey, 348), tags: ["fossil"], },
		{ id: 136, natiId: 408, name: "Cranidos", img: ({ gameKey }) => baseSprite(gameKey, 408), imgS: ({ gameKey }) => shinySprite(gameKey, 408), tags: ["fossil"], },
		{ id: 137, natiId: 409, name: "Rampardos", img: ({ gameKey }) => baseSprite(gameKey, 409), imgS: ({ gameKey }) => shinySprite(gameKey, 409), tags: ["fossil"], },
		{ id: 138, natiId: 410, name: "Shieldon", img: ({ gameKey }) => baseSprite(gameKey, 410), imgS: ({ gameKey }) => shinySprite(gameKey, 410), tags: ["fossil"], },
		{ id: 139, natiId: 411, name: "Bastiodon", img: ({ gameKey }) => baseSprite(gameKey, 411), imgS: ({ gameKey }) => shinySprite(gameKey, 411), tags: ["fossil"], },
		{ id: 140, natiId: 566, name: "Archen", img: ({ gameKey }) => baseSprite(gameKey, 566), imgS: ({ gameKey }) => shinySprite(gameKey, 566), tags: ["fossil"], },
		{ id: 141, natiId: 567, name: "Archeops", img: ({ gameKey }) => baseSprite(gameKey, 567), imgS: ({ gameKey }) => shinySprite(gameKey, 567), tags: ["fossil"], },
		{ id: 142, natiId: 564, name: "Tirtouga", img: ({ gameKey }) => baseSprite(gameKey, 564), imgS: ({ gameKey }) => shinySprite(gameKey, 564), tags: ["fossil"], },
		{ id: 143, natiId: 565, name: "Carracosta", img: ({ gameKey }) => baseSprite(gameKey, 565), imgS: ({ gameKey }) => shinySprite(gameKey, 565), tags: ["fossil"], },
		{ id: 144, natiId: 696, name: "Tyrunt", img: ({ gameKey }) => baseSprite(gameKey, 696), imgS: ({ gameKey }) => shinySprite(gameKey, 696), tags: ["fossil"], },
		{ id: 145, natiId: 697, name: "Tyrantrum", img: ({ gameKey }) => baseSprite(gameKey, 697), imgS: ({ gameKey }) => shinySprite(gameKey, 697), tags: ["fossil"], },
		{ id: 146, natiId: 698, name: "Amaura", img: ({ gameKey }) => baseSprite(gameKey, 698), imgS: ({ gameKey }) => shinySprite(gameKey, 698), tags: ["fossil"], },
		{ id: 147, natiId: 699, name: "Aurorus", img: ({ gameKey }) => baseSprite(gameKey, 699), imgS: ({ gameKey }) => shinySprite(gameKey, 699), tags: ["fossil"], },
		{ id: 148, natiId: 246, name: "Larvitar", img: ({ gameKey }) => baseSprite(gameKey, 246), imgS: ({ gameKey }) => shinySprite(gameKey, 246), tags: ["pseudo"], },
		{ id: 149, natiId: 247, name: "Pupitar", img: ({ gameKey }) => baseSprite(gameKey, 247), imgS: ({ gameKey }) => shinySprite(gameKey, 247), tags: ["pseudo"], },
		{ id: 150, natiId: 248, name: "Tyranitar", img: ({ gameKey }) => baseSprite(gameKey, 248), imgS: ({ gameKey }) => shinySprite(gameKey, 248), tags: ["pseudo", "mega"], },
		{ id: 151, natiId: 708, name: "Phantump", img: ({ gameKey }) => baseSprite(gameKey, 708), imgS: ({ gameKey }) => shinySprite(gameKey, 708), },
		{ id: 152, natiId: 709, name: "Trevenant", img: ({ gameKey }) => baseSprite(gameKey, 709), imgS: ({ gameKey }) => shinySprite(gameKey, 709), },
		{ id: 153, natiId: 177, name: "Natu", img: ({ gameKey }) => baseSprite(gameKey, 177), imgS: ({ gameKey }) => shinySprite(gameKey, 177), },
		{
			id: 154, natiId: 178, name: "Xatu", img: ({ gameKey }) => baseSprite(gameKey, 178), imgS: ({ gameKey }) => shinySprite(gameKey, 178), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 178), imgS: ({ gameKey }) => shinySprite(gameKey, 178), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0178-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0178-f"), },],
		},
		{ id: 155, natiId: 299, name: "Nosepass", img: ({ gameKey }) => baseSprite(gameKey, 299), imgS: ({ gameKey }) => shinySprite(gameKey, 299), },
		{ id: 156, natiId: 476, name: "Probopass", img: ({ gameKey }) => baseSprite(gameKey, 476), imgS: ({ gameKey }) => shinySprite(gameKey, 476), },
		{ id: 157, natiId: 771, name: "Pyukumuku", img: ({ gameKey }) => baseSprite(gameKey, 771), imgS: ({ gameKey }) => shinySprite(gameKey, 771), },
		{ id: 158, natiId: 170, name: "Chinchou", img: ({ gameKey }) => baseSprite(gameKey, 170), imgS: ({ gameKey }) => shinySprite(gameKey, 170), },
		{ id: 159, natiId: 171, name: "Lanturn", img: ({ gameKey }) => baseSprite(gameKey, 171), imgS: ({ gameKey }) => shinySprite(gameKey, 171), },
		{ id: 160, natiId: 786, name: "Tapu Lele", img: ({ gameKey }) => baseSprite(gameKey, 786), imgS: ({ gameKey }) => shinySprite(gameKey, 786), tags: ["zcrystal", "legendary"], },
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();