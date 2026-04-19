import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 9.5;
	const GAME_KEYS = ["legendszamd"];
	const DEX_NAME = "Hyperspace Dex";

	const baseSprite = (gameKey, natiId) => dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 56, name: "Mankey", img: ({ gameKey }) => baseSprite(gameKey, 56), imgS: ({ gameKey }) => shinySprite(gameKey, 56), },
		{ id: 2, natiId: 57, name: "Primeape", img: ({ gameKey }) => baseSprite(gameKey, 57), imgS: ({ gameKey }) => shinySprite(gameKey, 57), },
		{ id: 3, natiId: 979, name: "Annihilape", img: ({ gameKey }) => baseSprite(gameKey, 979), imgS: ({ gameKey }) => shinySprite(gameKey, 979), },
		{
			id: 4, natiId: 52, name: "Meowth", img: ({ gameKey }) => baseSprite(gameKey, 52), imgS: ({ gameKey }) => shinySprite(gameKey, 52), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 52), imgS: ({ gameKey }) => shinySprite(gameKey, 52), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0052-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0052-a"), tags: ["alolan"], },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0052-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0052-g"), tags: ["galarian"], },
			],
		},
		{
			id: 5, natiId: 53, name: "Persian", img: ({ gameKey }) => baseSprite(gameKey, 53), imgS: ({ gameKey }) => shinySprite(gameKey, 53), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 53), imgS: ({ gameKey }) => shinySprite(gameKey, 53), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0053-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0053-a"), tags: ["alolan"], },
			],
		},
		{ id: 6, natiId: 863, name: "Perrserker", img: ({ gameKey }) => baseSprite(gameKey, 863), imgS: ({ gameKey }) => shinySprite(gameKey, 863), },
		{
			id: 7, natiId: 83, name: "Farfetch'd", img: ({ gameKey }) => baseSprite(gameKey, 83), imgS: ({ gameKey }) => shinySprite(gameKey, 83), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 83), imgS: ({ gameKey }) => shinySprite(gameKey, 83), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0083-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0083-g"), tags: ["galarian"], },
			],
		},
		{ id: 8, natiId: 865, name: "Sirfetch'd", img: ({ gameKey }) => baseSprite(gameKey, 865), imgS: ({ gameKey }) => shinySprite(gameKey, 865), },
		{ id: 9, natiId: 104, name: "Cubone", img: ({ gameKey }) => baseSprite(gameKey, 104), imgS: ({ gameKey }) => shinySprite(gameKey, 104), },
		{
			id: 10, natiId: 105, name: "Marowak", img: ({ gameKey }) => baseSprite(gameKey, 105), imgS: ({ gameKey }) => shinySprite(gameKey, 105), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 105), imgS: ({ gameKey }) => shinySprite(gameKey, 105), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0105-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0105-a"), tags: ["alolan"], },
			],
		},
		{ id: 11, natiId: 137, name: "Porygon", img: ({ gameKey }) => baseSprite(gameKey, 137), imgS: ({ gameKey }) => shinySprite(gameKey, 137), },
		{ id: 12, natiId: 233, name: "Porygon2", img: ({ gameKey }) => baseSprite(gameKey, 233), imgS: ({ gameKey }) => shinySprite(gameKey, 233), },
		{ id: 13, natiId: 474, name: "Porygon-Z", img: ({ gameKey }) => baseSprite(gameKey, 474), imgS: ({ gameKey }) => shinySprite(gameKey, 474), },
		{ id: 14, natiId: 951, name: "Capsakid", img: ({ gameKey }) => baseSprite(gameKey, 951), imgS: ({ gameKey }) => shinySprite(gameKey, 951), },
		{ id: 15, natiId: 952, name: "Scovillain", img: ({ gameKey }) => baseSprite(gameKey, 952), imgS: ({ gameKey }) => shinySprite(gameKey, 952), tags: ["mega"], },
		{ id: 16, natiId: 957, name: "Tinkatink", img: ({ gameKey }) => baseSprite(gameKey, 957), imgS: ({ gameKey }) => shinySprite(gameKey, 957), },
		{ id: 17, natiId: 958, name: "Tinkatuff", img: ({ gameKey }) => baseSprite(gameKey, 958), imgS: ({ gameKey }) => shinySprite(gameKey, 958), },
		{ id: 18, natiId: 959, name: "Tinkaton", img: ({ gameKey }) => baseSprite(gameKey, 959), imgS: ({ gameKey }) => shinySprite(gameKey, 959), },
		{ id: 19, natiId: 967, name: "Cyclizar", img: ({ gameKey }) => baseSprite(gameKey, 967), imgS: ({ gameKey }) => shinySprite(gameKey, 967), },
		{ id: 20, natiId: 969, name: "Glimmet", img: ({ gameKey }) => baseSprite(gameKey, 969), imgS: ({ gameKey }) => shinySprite(gameKey, 969), },
		{ id: 21, natiId: 970, name: "Glimmora", img: ({ gameKey }) => baseSprite(gameKey, 970), imgS: ({ gameKey }) => shinySprite(gameKey, 970), tags: ["mega"], },
		{
			id: 22, natiId: 479, name: "Rotom", img: ({ gameKey }) => baseSprite(gameKey, 479), imgS: ({ gameKey }) => shinySprite(gameKey, 479), tags: ["other"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 479), imgS: ({ gameKey }) => shinySprite(gameKey, 479), },
				{ name: "Fan", img: ({ gameKey }) => baseSprite(gameKey, "0479-fa"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-fa"), },
				{ name: "Frost", img: ({ gameKey }) => baseSprite(gameKey, "0479-fr"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-fr"), },
				{ name: "Heat", img: ({ gameKey }) => baseSprite(gameKey, "0479-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-h"), },
				{ name: "Mow", img: ({ gameKey }) => baseSprite(gameKey, "0479-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-m"), },
				{ name: "Wash", img: ({ gameKey }) => baseSprite(gameKey, "0479-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-w"), },
			],
		},
		{ id: 23, natiId: 971, name: "Greavard", img: ({ gameKey }) => baseSprite(gameKey, 971), imgS: ({ gameKey }) => shinySprite(gameKey, 971), },
		{ id: 24, natiId: 972, name: "Houndstone", img: ({ gameKey }) => baseSprite(gameKey, 972), imgS: ({ gameKey }) => shinySprite(gameKey, 972), },
		{ id: 25, natiId: 769, name: "Sandygast", img: ({ gameKey }) => baseSprite(gameKey, 769), imgS: ({ gameKey }) => shinySprite(gameKey, 769), },
		{ id: 26, natiId: 770, name: "Palossand", img: ({ gameKey }) => baseSprite(gameKey, 770), imgS: ({ gameKey }) => shinySprite(gameKey, 770), },
		{ id: 27, natiId: 352, name: "Kecleon", img: ({ gameKey }) => baseSprite(gameKey, 352), imgS: ({ gameKey }) => shinySprite(gameKey, 352), },
		{ id: 28, natiId: 973, name: "Flamigo", img: ({ gameKey }) => baseSprite(gameKey, 973), imgS: ({ gameKey }) => shinySprite(gameKey, 973), },
		{ id: 29, natiId: 615, name: "Cryogonal", img: ({ gameKey }) => baseSprite(gameKey, 615), imgS: ({ gameKey }) => shinySprite(gameKey, 615), },
		{ id: 30, natiId: 977, name: "Dondozo", img: ({ gameKey }) => baseSprite(gameKey, 977), imgS: ({ gameKey }) => shinySprite(gameKey, 977), },
		{
			id: 31, natiId: 978, name: "Tatsugiri", img: ({ gameKey }) => baseSprite(gameKey, 978), imgS: ({ gameKey }) => shinySprite(gameKey, 978), tags: ["other", "mega"], forms: [
				{ name: "Curly", img: ({ gameKey }) => baseSprite(gameKey, 978), imgS: ({ gameKey }) => shinySprite(gameKey, 978), },
				{ name: "Droopy", img: ({ gameKey }) => baseSprite(gameKey, "0978-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0978-d"), },
				{ name: "Stretchy", img: ({ gameKey }) => baseSprite(gameKey, "0978-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0978-s"), },
			],
		},
		{ id: 32, natiId: 996, name: "Frigibax", img: ({ gameKey }) => baseSprite(gameKey, 996), imgS: ({ gameKey }) => shinySprite(gameKey, 996), tags: ["psuedo"], },
		{ id: 33, natiId: 997, name: "Arctibax", img: ({ gameKey }) => baseSprite(gameKey, 997), imgS: ({ gameKey }) => shinySprite(gameKey, 997), tags: ["psuedo"], },
		{ id: 34, natiId: 998, name: "Baxcalibur", img: ({ gameKey }) => baseSprite(gameKey, 998), imgS: ({ gameKey }) => shinySprite(gameKey, 998), tags: ["psuedo", "mega"], },
		{ id: 35, natiId: 999, name: "Gimmighoul", img: ({ gameKey }) => baseSprite(gameKey, 999), imgS: ({ gameKey }) => shinySprite(gameKey, 999), },
		{ id: 36, natiId: 1000, name: "Gholdengo", img: ({ gameKey }) => baseSprite(gameKey, 1000), imgS: ({ gameKey }) => shinySprite(gameKey, 1000), },
		{
			id: 37, natiId: 211, name: "Qwilfish", img: ({ gameKey }) => baseSprite(gameKey, 211), imgS: ({ gameKey }) => shinySprite(gameKey, 211), forms: [
				{ name: "Johtonian", img: ({ gameKey }) => baseSprite(gameKey, 211), imgS: ({ gameKey }) => shinySprite(gameKey, 211), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0211-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0211-h"), tags: ["hisuian"], },
			],
		},
		{ id: 38, natiId: 904, name: "Overqwil", img: ({ gameKey }) => baseSprite(gameKey, 904), imgS: ({ gameKey }) => shinySprite(gameKey, 904), },
		{ id: 39, natiId: 252, name: "Treecko", img: ({ gameKey }) => baseSprite(gameKey, 252), imgS: ({ gameKey }) => shinySprite(gameKey, 252), tags: ["starter"], },
		{ id: 40, natiId: 253, name: "Grovyle", img: ({ gameKey }) => baseSprite(gameKey, 253), imgS: ({ gameKey }) => shinySprite(gameKey, 253), tags: ["starter"], },
		{ id: 41, natiId: 254, name: "Sceptile", img: ({ gameKey }) => baseSprite(gameKey, 254), imgS: ({ gameKey }) => shinySprite(gameKey, 254), tags: ["starter", "mega"], },
		{
			id: 42, natiId: 255, name: "Torchic", img: ({ gameKey }) => baseSprite(gameKey, 255), imgS: ({ gameKey }) => shinySprite(gameKey, 255), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 255), imgS: ({ gameKey }) => shinySprite(gameKey, 255), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0255-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0255-f"), },
			],
		},
		{
			id: 43, natiId: 256, name: "Combusken", img: ({ gameKey }) => baseSprite(gameKey, 256), imgS: ({ gameKey }) => shinySprite(gameKey, 256), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 256), imgS: ({ gameKey }) => shinySprite(gameKey, 256), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0256-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0256-f"), },
			],
		},
		{
			id: 44, natiId: 257, name: "Blaziken", img: ({ gameKey }) => baseSprite(gameKey, 257), imgS: ({ gameKey }) => shinySprite(gameKey, 257), tags: ["gender", "starter", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 257), imgS: ({ gameKey }) => shinySprite(gameKey, 257), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0257-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0257-f"), },
			],
		},
		{ id: 45, natiId: 258, name: "Mudkip", img: ({ gameKey }) => baseSprite(gameKey, 258), imgS: ({ gameKey }) => shinySprite(gameKey, 258), tags: ["starter"], },
		{ id: 46, natiId: 259, name: "Marshtomp", img: ({ gameKey }) => baseSprite(gameKey, 259), imgS: ({ gameKey }) => shinySprite(gameKey, 259), tags: ["starter"], },
		{ id: 47, natiId: 260, name: "Swampert", img: ({ gameKey }) => baseSprite(gameKey, 260), imgS: ({ gameKey }) => shinySprite(gameKey, 260), tags: ["starter", "mega"], },
		{ id: 48, natiId: 349, name: "Feebas", img: ({ gameKey }) => baseSprite(gameKey, 349), imgS: ({ gameKey }) => shinySprite(gameKey, 349), },
		{
			id: 49, natiId: 350, name: "Milotic", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0350-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0350-f"), },
			],
		},
		{ id: 50, natiId: 433, name: "Chingling", img: ({ gameKey }) => baseSprite(gameKey, 433), imgS: ({ gameKey }) => shinySprite(gameKey, 433), },
		{ id: 51, natiId: 358, name: "Chimecho", img: ({ gameKey }) => baseSprite(gameKey, 358), imgS: ({ gameKey }) => shinySprite(gameKey, 358), tags: ["mega"], },
		{
			id: 52, natiId: 876, name: "Indeedee", img: ({ gameKey }) => baseSprite(gameKey, 876), imgS: ({ gameKey }) => shinySprite(gameKey, 876), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 876), imgS: ({ gameKey }) => shinySprite(gameKey, 876), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0876-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0876-f"), },
			],
		},
		{ id: 53, natiId: 509, name: "Purrloin", img: ({ gameKey }) => baseSprite(gameKey, 509), imgS: ({ gameKey }) => shinySprite(gameKey, 509), },
		{ id: 54, natiId: 510, name: "Liepard", img: ({ gameKey }) => baseSprite(gameKey, 510), imgS: ({ gameKey }) => shinySprite(gameKey, 510), },
		{ id: 55, natiId: 517, name: "Munna", img: ({ gameKey }) => baseSprite(gameKey, 517), imgS: ({ gameKey }) => shinySprite(gameKey, 517), },
		{ id: 56, natiId: 518, name: "Musharna", img: ({ gameKey }) => baseSprite(gameKey, 518), imgS: ({ gameKey }) => shinySprite(gameKey, 518), },
		{ id: 57, natiId: 538, name: "Throh", img: ({ gameKey }) => baseSprite(gameKey, 538), imgS: ({ gameKey }) => shinySprite(gameKey, 538), },
		{ id: 58, natiId: 539, name: "Sawk", img: ({ gameKey }) => baseSprite(gameKey, 539), imgS: ({ gameKey }) => shinySprite(gameKey, 539), },
		{
			id: 59, natiId: 562, name: "Yamask", img: ({ gameKey }) => baseSprite(gameKey, 562), imgS: ({ gameKey }) => shinySprite(gameKey, 562), forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 562), imgS: ({ gameKey }) => shinySprite(gameKey, 562), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0562-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0562-g"), tags: ["galarian"], },
			],
		},
		{ id: 60, natiId: 563, name: "Cofagrigus", img: ({ gameKey }) => baseSprite(gameKey, 563), imgS: ({ gameKey }) => shinySprite(gameKey, 563), },
		{ id: 61, natiId: 867, name: "Runerigus", img: ({ gameKey }) => baseSprite(gameKey, 867), imgS: ({ gameKey }) => shinySprite(gameKey, 867), },
		{ id: 62, natiId: 767, name: "Wimpod", img: ({ gameKey }) => baseSprite(gameKey, 767), imgS: ({ gameKey }) => shinySprite(gameKey, 767), },
		{ id: 63, natiId: 768, name: "Golisopod", img: ({ gameKey }) => baseSprite(gameKey, 768), imgS: ({ gameKey }) => shinySprite(gameKey, 768), tags: ["mega"], },
		{ id: 64, natiId: 827, name: "Nickit", img: ({ gameKey }) => baseSprite(gameKey, 827), imgS: ({ gameKey }) => shinySprite(gameKey, 827), },
		{ id: 65, natiId: 828, name: "Thievul", img: ({ gameKey }) => baseSprite(gameKey, 828), imgS: ({ gameKey }) => shinySprite(gameKey, 828), },
		{ id: 66, natiId: 852, name: "Clobbopus", img: ({ gameKey }) => baseSprite(gameKey, 852), imgS: ({ gameKey }) => shinySprite(gameKey, 852), },
		{ id: 67, natiId: 853, name: "Grapploct", img: ({ gameKey }) => baseSprite(gameKey, 853), imgS: ({ gameKey }) => shinySprite(gameKey, 853), },
		{ id: 68, natiId: 778, name: "Mimikyu", img: ({ gameKey }) => baseSprite(gameKey, 778), imgS: ({ gameKey }) => shinySprite(gameKey, 778), },
		{ id: 69, natiId: 900, name: "Kleavor", img: ({ gameKey }) => baseSprite(gameKey, 900), imgS: ({ gameKey }) => shinySprite(gameKey, 900), },
		{ id: 70, natiId: 877, name: "Morpeko", img: ({ gameKey }) => baseSprite(gameKey, 877), imgS: ({ gameKey }) => shinySprite(gameKey, 877), },
		{ id: 71, natiId: 622, name: "Golett", img: ({ gameKey }) => baseSprite(gameKey, 622), imgS: ({ gameKey }) => shinySprite(gameKey, 622), },
		{ id: 72, natiId: 623, name: "Golurk", img: ({ gameKey }) => baseSprite(gameKey, 623), imgS: ({ gameKey }) => shinySprite(gameKey, 623), tags: ["mega"], },
		{ id: 73, natiId: 821, name: "Rookidee", img: ({ gameKey }) => baseSprite(gameKey, 821), imgS: ({ gameKey }) => shinySprite(gameKey, 821), },
		{ id: 74, natiId: 822, name: "Corvisquire", img: ({ gameKey }) => baseSprite(gameKey, 822), imgS: ({ gameKey }) => shinySprite(gameKey, 822), },
		{ id: 75, natiId: 823, name: "Corviknight", img: ({ gameKey }) => baseSprite(gameKey, 823), imgS: ({ gameKey }) => shinySprite(gameKey, 823), },
		{ id: 76, natiId: 174, name: "Igglybuff", img: ({ gameKey }) => baseSprite(gameKey, 174), imgS: ({ gameKey }) => shinySprite(gameKey, 174), },
		{ id: 77, natiId: 39, name: "Jigglypuff", img: ({ gameKey }) => baseSprite(gameKey, 39), imgS: ({ gameKey }) => shinySprite(gameKey, 39), },
		{ id: 78, natiId: 40, name: "Wigglytuff", img: ({ gameKey }) => baseSprite(gameKey, 40), imgS: ({ gameKey }) => shinySprite(gameKey, 40), },
		{ id: 79, natiId: 926, name: "Fidough", img: ({ gameKey }) => baseSprite(gameKey, 926), imgS: ({ gameKey }) => shinySprite(gameKey, 926), },
		{ id: 80, natiId: 927, name: "Dachsbun", img: ({ gameKey }) => baseSprite(gameKey, 927), imgS: ({ gameKey }) => shinySprite(gameKey, 927), },
		{
			id: 81, natiId: 396, name: "Starly", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0396-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0396-f"), },
			],
		},
		{
			id: 82, natiId: 397, name: "Staravia", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0397-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0397-f"), },
			],
		},
		{
			id: 83, natiId: 398, name: "Staraptor", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0398-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0398-f"), },
			],
		},
		{ id: 84, natiId: 325, name: "Spoink", img: ({ gameKey }) => baseSprite(gameKey, 325), imgS: ({ gameKey }) => shinySprite(gameKey, 325), },
		{ id: 85, natiId: 326, name: "Grumpig", img: ({ gameKey }) => baseSprite(gameKey, 326), imgS: ({ gameKey }) => shinySprite(gameKey, 326), },
		{
			id: 86, natiId: 931, name: "Squawkabilly", img: ({ gameKey }) => baseSprite(gameKey, 931), imgS: ({ gameKey }) => shinySprite(gameKey, 931), tags: ["other"], forms: [
				{ name: "Green Plumage", img: ({ gameKey }) => baseSprite(gameKey, 931), imgS: ({ gameKey }) => shinySprite(gameKey, 931), },
				{ name: "Blue Plumage", img: ({ gameKey }) => baseSprite(gameKey, "0931-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0931-b"), },
				{ name: "White Plumage", img: ({ gameKey }) => baseSprite(gameKey, "0931-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0931-w"), },
				{ name: "Yellow Plumage", img: ({ gameKey }) => baseSprite(gameKey, "0931-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0931-y"), },
			],
		},
		{ id: 87, natiId: 739, name: "Crabrawler", img: ({ gameKey }) => baseSprite(gameKey, 739), imgS: ({ gameKey }) => shinySprite(gameKey, 739), },
		{ id: 88, natiId: 740, name: "Crabominable", img: ({ gameKey }) => baseSprite(gameKey, 740), imgS: ({ gameKey }) => shinySprite(gameKey, 740), tags: ["mega"], },
		{ id: 89, natiId: 932, name: "Nacli", img: ({ gameKey }) => baseSprite(gameKey, 932), imgS: ({ gameKey }) => shinySprite(gameKey, 932), },
		{ id: 90, natiId: 933, name: "Naclstack", img: ({ gameKey }) => baseSprite(gameKey, 933), imgS: ({ gameKey }) => shinySprite(gameKey, 933), },
		{ id: 91, natiId: 934, name: "Garganacl", img: ({ gameKey }) => baseSprite(gameKey, 934), imgS: ({ gameKey }) => shinySprite(gameKey, 934), },
		{
			id: 92, natiId: 316, name: "Gulpin", img: ({ gameKey }) => baseSprite(gameKey, 316), imgS: ({ gameKey }) => shinySprite(gameKey, 316), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 316), imgS: ({ gameKey }) => shinySprite(gameKey, 316), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0316-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0316-f"), },
			],
		},
		{
			id: 93, natiId: 317, name: "Swalot", img: ({ gameKey }) => baseSprite(gameKey, 317), imgS: ({ gameKey }) => shinySprite(gameKey, 317), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 317), imgS: ({ gameKey }) => shinySprite(gameKey, 317), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0317-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0317-f"), },
			],
		},
		{
			id: 94, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), },
			],
		},
		{
			id: 95, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), },
			],
		},
		{ id: 96, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169), },
		{ id: 97, natiId: 935, name: "Charcadet", img: ({ gameKey }) => baseSprite(gameKey, 935), imgS: ({ gameKey }) => shinySprite(gameKey, 935), },
		{ id: 98, natiId: 936, name: "Armarouge", img: ({ gameKey }) => baseSprite(gameKey, 936), imgS: ({ gameKey }) => shinySprite(gameKey, 936), },
		{ id: 99, natiId: 937, name: "Ceruledge", img: ({ gameKey }) => baseSprite(gameKey, 937), imgS: ({ gameKey }) => shinySprite(gameKey, 937), },
		{ id: 100, natiId: 942, name: "Maschiff", img: ({ gameKey }) => baseSprite(gameKey, 942), imgS: ({ gameKey }) => shinySprite(gameKey, 942), },
		{ id: 101, natiId: 943, name: "Mabosstiff", img: ({ gameKey }) => baseSprite(gameKey, 943), imgS: ({ gameKey }) => shinySprite(gameKey, 943), },
		{ id: 102, natiId: 848, name: "Toxel", img: ({ gameKey }) => baseSprite(gameKey, 848), imgS: ({ gameKey }) => shinySprite(gameKey, 848), },
		{
			id: 103, natiId: 849, name: "Toxtricity", img: ({ gameKey }) => baseSprite(gameKey, 849), imgS: ({ gameKey }) => shinySprite(gameKey, 849), tags: ["other"], forms: [
				{ name: "Amped", img: ({ gameKey }) => baseSprite(gameKey, 849), imgS: ({ gameKey }) => shinySprite(gameKey, 849), },
				{ name: "Low Key", img: ({ gameKey }) => baseSprite(gameKey, "0849-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0849-l"), },
			],
		},
		{ id: 104, natiId: 944, name: "Shroodle", img: ({ gameKey }) => baseSprite(gameKey, 944), imgS: ({ gameKey }) => shinySprite(gameKey, 944), },
		{ id: 105, natiId: 945, name: "Grafaiai", img: ({ gameKey }) => baseSprite(gameKey, 945), imgS: ({ gameKey }) => shinySprite(gameKey, 945), },
		{ id: 106, natiId: 335, name: "Zangoose", img: ({ gameKey }) => baseSprite(gameKey, 335), imgS: ({ gameKey }) => shinySprite(gameKey, 335), },
		{ id: 107, natiId: 336, name: "Seviper", img: ({ gameKey }) => baseSprite(gameKey, 336), imgS: ({ gameKey }) => shinySprite(gameKey, 336), },
		{ id: 108, natiId: 439, name: "Mime Jr.", img: ({ gameKey }) => baseSprite(gameKey, 439), imgS: ({ gameKey }) => shinySprite(gameKey, 439), },
		{
			id: 109, natiId: 122, name: "Mr. Mime", img: ({ gameKey }) => baseSprite(gameKey, 122), imgS: ({ gameKey }) => shinySprite(gameKey, 122), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 122), imgS: ({ gameKey }) => shinySprite(gameKey, 122), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0122-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0122-g"), tags: ["galarian"], },
			],
		},
		{ id: 110, natiId: 866, name: "Mr. Rime", img: ({ gameKey }) => baseSprite(gameKey, 866), imgS: ({ gameKey }) => shinySprite(gameKey, 866), },
		{ id: 111, natiId: 590, name: "Foongus", img: ({ gameKey }) => baseSprite(gameKey, 590), imgS: ({ gameKey }) => shinySprite(gameKey, 590), },
		{ id: 112, natiId: 591, name: "Amoonguss", img: ({ gameKey }) => baseSprite(gameKey, 591), imgS: ({ gameKey }) => shinySprite(gameKey, 591), },
		{ id: 113, natiId: 485, name: "Heatran", img: ({ gameKey }) => baseSprite(gameKey, 485), imgS: ({ gameKey }) => shinySprite(gameKey, 485), tags: ["mega", "legendary"], },
		{ id: 114, natiId: 721, name: "Volcanion", img: ({ gameKey }) => baseSprite(gameKey, 721), imgS: ({ gameKey }) => shinySprite(gameKey, 721), tags: ["legendary"], maxStatus: "caught", },
		{ id: 115, natiId: 638, name: "Cobalion", img: ({ gameKey }) => baseSprite(gameKey, 638), imgS: ({ gameKey }) => shinySprite(gameKey, 638), tags: ["legendary"], },
		{ id: 116, natiId: 639, name: "Terrakion", img: ({ gameKey }) => baseSprite(gameKey, 639), imgS: ({ gameKey }) => shinySprite(gameKey, 639), tags: ["legendary"], },
		{ id: 117, natiId: 640, name: "Virizion", img: ({ gameKey }) => baseSprite(gameKey, 640), imgS: ({ gameKey }) => shinySprite(gameKey, 640), tags: ["legendary"], },
		{
			id: 118, natiId: 647, name: "Keldeo", img: ({ gameKey }) => baseSprite(gameKey, 647), imgS: ({ gameKey }) => shinySprite(gameKey, 647), tags: ["other"], forms: [
				{ name: "Ordinary", img: ({ gameKey }) => baseSprite(gameKey, 647), imgS: ({ gameKey }) => shinySprite(gameKey, 647), },
				{ name: "Resolute", img: ({ gameKey }) => baseSprite(gameKey, "0647-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0647-r"), },
			],
		},
		{ id: 119, natiId: 648, name: "Meloetta", img: ({ gameKey }) => baseSprite(gameKey, 648), imgS: ({ gameKey }) => shinySprite(gameKey, 648), },
		{ id: 120, natiId: 649, name: "Genesect", img: ({ gameKey }) => baseSprite(gameKey, 649), imgS: ({ gameKey }) => shinySprite(gameKey, 649), },
		{
			id: 121, natiId: 720, name: "Hoopa", img: ({ gameKey }) => baseSprite(gameKey, 720), imgS: ({ gameKey }) => shinySprite(gameKey, 720), tags: ["other"], maxStatus: "caught", forms: [
				{ name: "Confined", img: ({ gameKey }) => baseSprite(gameKey, 720), imgS: ({ gameKey }) => shinySprite(gameKey, 720), maxStatus: "caught", },
				{ name: "Unbound", img: ({ gameKey }) => baseSprite(gameKey, "0720-u"), imgS: ({ gameKey }) => shinySprite(gameKey, "0720-u"), maxStatus: "caught", },
			],
		},
		{ id: 122, natiId: 802, name: "Marshadow", img: ({ gameKey }) => baseSprite(gameKey, 802), imgS: ({ gameKey }) => shinySprite(gameKey, 802), maxStatus: "caught", },
		{ id: 123, natiId: 808, name: "Meltan", img: ({ gameKey }) => baseSprite(gameKey, 808), imgS: ({ gameKey }) => shinySprite(gameKey, 808), },
		{ id: 124, natiId: 809, name: "Melmetal", img: ({ gameKey }) => baseSprite(gameKey, 809), imgS: ({ gameKey }) => shinySprite(gameKey, 809), },
		{ id: 125, natiId: 491, name: "Darkrai", img: ({ gameKey }) => baseSprite(gameKey, 491), imgS: ({ gameKey }) => shinySprite(gameKey, 491), tags: ["mega"] },
		{ id: 126, natiId: 380, name: "Latias", img: ({ gameKey }) => baseSprite(gameKey, 380), imgS: ({ gameKey }) => shinySprite(gameKey, 380), tags: ["mega", "legendary"], },
		{ id: 127, natiId: 381, name: "Latios", img: ({ gameKey }) => baseSprite(gameKey, 381), imgS: ({ gameKey }) => shinySprite(gameKey, 381), tags: ["mega", "legendary"], },
		{ id: 128, natiId: 382, name: "Kyogre", img: ({ gameKey }) => baseSprite(gameKey, 382), imgS: ({ gameKey }) => shinySprite(gameKey, 382), tags: ["mega", "legendary"], },
		{ id: 129, natiId: 383, name: "Groudon", img: ({ gameKey }) => baseSprite(gameKey, 383), imgS: ({ gameKey }) => shinySprite(gameKey, 383), tags: ["mega", "legendary"], },
		{ id: 130, natiId: 384, name: "Rayquaza", img: ({ gameKey }) => baseSprite(gameKey, 384), imgS: ({ gameKey }) => shinySprite(gameKey, 384), tags: ["mega", "legendary"], },
		{
			id: 131, natiId: 801, name: "Magearna", img: ({ gameKey }) => baseSprite(gameKey, 801), imgS: ({ gameKey }) => shinySprite(gameKey, 801), tags: ["other", "mega",], maxStatus: "caught", forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 801), imgS: ({ gameKey }) => shinySprite(gameKey, 801), maxStatus: "caught", },
				{ name: "Original Color", img: ({ gameKey }) => baseSprite(gameKey, "0801-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0801-o"), maxStatus: "caught", },
			],
		},
		{ id: 132, natiId: 807, name: "Zeraora", img: ({ gameKey }) => baseSprite(gameKey, 807), imgS: ({ gameKey }) => shinySprite(gameKey, 807), tags: ["mega"] },
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();