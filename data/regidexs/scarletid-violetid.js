import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 9;
	const GAME_KEYS = ["scarletid", "violetid"];
	const DEX_NAME = "Blueberry Dex";

	const baseSprite = (gameKey, natiId) => dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{
			id: 1, natiId: 84, name: "Doduo", img: ({ gameKey }) => baseSprite(gameKey, 84), imgS: ({ gameKey }) => shinySprite(gameKey, 84), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 84), imgS: ({ gameKey }) => shinySprite(gameKey, 84), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0084-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0084-f"), },
			],
		},
		{
			id: 2, natiId: 85, name: "Dodrio", img: ({ gameKey }) => baseSprite(gameKey, 85), imgS: ({ gameKey }) => shinySprite(gameKey, 85), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 85), imgS: ({ gameKey }) => shinySprite(gameKey, 85), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0085-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0085-f"), },
			],
		},
		{ id: 3, natiId: 102, name: "Exeggcute", img: ({ gameKey }) => baseSprite(gameKey, 102), imgS: ({ gameKey }) => shinySprite(gameKey, 102), },
		{
			id: 4, natiId: 103, name: "Exeggutor", img: ({ gameKey }) => baseSprite(gameKey, 103), imgS: ({ gameKey }) => shinySprite(gameKey, 103), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 103), imgS: ({ gameKey }) => shinySprite(gameKey, 103), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0103-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0103-a"), tags: ["alolan"], },
			],
		},
		{
			id: 5, natiId: 111, name: "Rhyhorn", img: ({ gameKey }) => baseSprite(gameKey, 111), imgS: ({ gameKey }) => shinySprite(gameKey, 111), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 111), imgS: ({ gameKey }) => shinySprite(gameKey, 111), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0111-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0111-f"), },
			],
		},
		{
			id: 6, natiId: 112, name: "Rhydon", img: ({ gameKey }) => baseSprite(gameKey, 112), imgS: ({ gameKey }) => shinySprite(gameKey, 112), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 112), imgS: ({ gameKey }) => shinySprite(gameKey, 112), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0112-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0112-f"), },
			],
		},
		{
			id: 7, natiId: 464, name: "Rhyperior", img: ({ gameKey }) => baseSprite(gameKey, 464), imgS: ({ gameKey }) => shinySprite(gameKey, 464), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 464), imgS: ({ gameKey }) => shinySprite(gameKey, 464), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0464-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0464-f"), },
			],
		},
		{ id: 8, natiId: 48, name: "Venonat", img: ({ gameKey }) => baseSprite(gameKey, 48), imgS: ({ gameKey }) => shinySprite(gameKey, 48), },
		{ id: 9, natiId: 49, name: "Venomoth", img: ({ gameKey }) => baseSprite(gameKey, 49), imgS: ({ gameKey }) => shinySprite(gameKey, 49), },
		{ id: 10, natiId: 239, name: "Elekid", img: ({ gameKey }) => baseSprite(gameKey, 239), imgS: ({ gameKey }) => shinySprite(gameKey, 239), },
		{ id: 11, natiId: 125, name: "Electabuzz", img: ({ gameKey }) => baseSprite(gameKey, 125), imgS: ({ gameKey }) => shinySprite(gameKey, 125), },
		{ id: 12, natiId: 466, name: "Electivire", img: ({ gameKey }) => baseSprite(gameKey, 466), imgS: ({ gameKey }) => shinySprite(gameKey, 466), },
		{ id: 13, natiId: 240, name: "Magby", img: ({ gameKey }) => baseSprite(gameKey, 240), imgS: ({ gameKey }) => shinySprite(gameKey, 240), },
		{ id: 14, natiId: 126, name: "Magmar", img: ({ gameKey }) => baseSprite(gameKey, 126), imgS: ({ gameKey }) => shinySprite(gameKey, 126), },
		{ id: 15, natiId: 467, name: "Magmortar", img: ({ gameKey }) => baseSprite(gameKey, 467), imgS: ({ gameKey }) => shinySprite(gameKey, 467), },
		{ id: 16, natiId: 440, name: "Happiny", img: ({ gameKey }) => baseSprite(gameKey, 440), imgS: ({ gameKey }) => shinySprite(gameKey, 440), },
		{ id: 17, natiId: 113, name: "Chansey", img: ({ gameKey }) => baseSprite(gameKey, 113), imgS: ({ gameKey }) => shinySprite(gameKey, 113), },
		{ id: 18, natiId: 242, name: "Blissey", img: ({ gameKey }) => baseSprite(gameKey, 242), imgS: ({ gameKey }) => shinySprite(gameKey, 242), },
		{
			id: 19, natiId: 123, name: "Scyther", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0123-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0123-f"), }
			],
		},
		{
			id: 20, natiId: 212, name: "Scizor", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0212-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0212-f"), },],
		},
		{ id: 21, natiId: 900, name: "Kleavor", img: ({ gameKey }) => baseSprite(gameKey, 900), imgS: ({ gameKey }) => shinySprite(gameKey, 900), },
		{
			id: 22, natiId: 128, name: "Tauros", img: ({ gameKey }) => baseSprite(gameKey, "0128-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0128-c"), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, "0128-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0128-a"), },
				{ name: "Paldean (Aqua Breed)", img: ({ gameKey }) => baseSprite(gameKey, "0128-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0128-a"), tags: ["paldean"], },
				{ name: "Paldean (Blaze Breed)", img: ({ gameKey }) => baseSprite(gameKey, "0128-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0128-b"), tags: ["paldean"], },
				{ name: "Paldean (Combat Breed)", img: ({ gameKey }) => baseSprite(gameKey, "0128-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0128-c"), tags: ["paldean"], }
			],
		},
		{ id: 23, natiId: 522, name: "Blitzle", img: ({ gameKey }) => baseSprite(gameKey, 522), imgS: ({ gameKey }) => shinySprite(gameKey, 522), },
		{ id: 24, natiId: 523, name: "Zebstrika", img: ({ gameKey }) => baseSprite(gameKey, 523), imgS: ({ gameKey }) => shinySprite(gameKey, 523), },
		{
			id: 25, natiId: 203, name: "Girafarig", img: ({ gameKey }) => baseSprite(gameKey, 203), imgS: ({ gameKey }) => shinySprite(gameKey, 203), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 203), imgS: ({ gameKey }) => shinySprite(gameKey, 203), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0203-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0203-f"), }
			],
		},
		{ id: 26, natiId: 981, name: "Farigiraf", img: ({ gameKey }) => baseSprite(gameKey, 981), imgS: ({ gameKey }) => shinySprite(gameKey, 981), },
		{ id: 27, natiId: 551, name: "Sandile", img: ({ gameKey }) => baseSprite(gameKey, 551), imgS: ({ gameKey }) => shinySprite(gameKey, 551), },
		{ id: 28, natiId: 552, name: "Krokorok", img: ({ gameKey }) => baseSprite(gameKey, 552), imgS: ({ gameKey }) => shinySprite(gameKey, 552), },
		{ id: 29, natiId: 553, name: "Krookodile", img: ({ gameKey }) => baseSprite(gameKey, 553), imgS: ({ gameKey }) => shinySprite(gameKey, 553), },
		{ id: 30, natiId: 953, name: "Rellor", img: ({ gameKey }) => baseSprite(gameKey, 953), imgS: ({ gameKey }) => shinySprite(gameKey, 953), },
		{ id: 31, natiId: 954, name: "Rabsca", img: ({ gameKey }) => baseSprite(gameKey, 954), imgS: ({ gameKey }) => shinySprite(gameKey, 954), },
		{ id: 32, natiId: 627, name: "Rufflet", img: ({ gameKey }) => baseSprite(gameKey, 627), imgS: ({ gameKey }) => shinySprite(gameKey, 627), },
		{
			id: 33, natiId: 628, name: "Braviary", img: ({ gameKey }) => baseSprite(gameKey, 628), imgS: ({ gameKey }) => shinySprite(gameKey, 628), forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 628), imgS: ({ gameKey }) => shinySprite(gameKey, 628), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0628-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0628-h"), tags: ["hisuian"], }
			],
		},
		{ id: 34, natiId: 629, name: "Vullaby", img: ({ gameKey }) => baseSprite(gameKey, 629), imgS: ({ gameKey }) => shinySprite(gameKey, 629), },
		{ id: 35, natiId: 630, name: "Mandibuzz", img: ({ gameKey }) => baseSprite(gameKey, 630), imgS: ({ gameKey }) => shinySprite(gameKey, 630), },
		{ id: 36, natiId: 667, name: "Litleo", img: ({ gameKey }) => baseSprite(gameKey, 667), imgS: ({ gameKey }) => shinySprite(gameKey, 667), },
		{
			id: 37, natiId: 668, name: "Pyroar", img: ({ gameKey }) => baseSprite(gameKey, 668), imgS: ({ gameKey }) => shinySprite(gameKey, 668), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 668), imgS: ({ gameKey }) => shinySprite(gameKey, 668), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0668-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0668-f"), }
			],
		},
		{
			id: 38, natiId: 585, name: "Deerling", img: ({ gameKey }) => baseSprite(gameKey, 585), imgS: ({ gameKey }) => shinySprite(gameKey, 585), tags: ["other"], forms: [
				{ name: "Autumn", img: ({ gameKey }) => baseSprite(gameKey, 585), imgS: ({ gameKey }) => shinySprite(gameKey, 585), },
				{ name: "Spring", img: ({ gameKey }) => baseSprite(gameKey, "0585-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0585-s"), },
				{ name: "Summer", img: ({ gameKey }) => baseSprite(gameKey, "0585-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0585-s"), },
				{ name: "Winter", img: ({ gameKey }) => baseSprite(gameKey, "0585-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0585-w"), }
			],
		},
		{
			id: 39, natiId: 586, name: "Sawsbuck", img: ({ gameKey }) => baseSprite(gameKey, 586), imgS: ({ gameKey }) => shinySprite(gameKey, 586), tags: ["other"], forms: [
				{ name: "Autumn", img: ({ gameKey }) => baseSprite(gameKey, 586), imgS: ({ gameKey }) => shinySprite(gameKey, 586), },
				{ name: "Spring", img: ({ gameKey }) => baseSprite(gameKey, "0586-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0586-s"), },
				{ name: "Summer", img: ({ gameKey }) => baseSprite(gameKey, "0586-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0586-s"), },
				{ name: "Winter", img: ({ gameKey }) => baseSprite(gameKey, "0586-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0586-w"), }
			],
		},
		{ id: 40, natiId: 235, name: "Smeargle", img: ({ gameKey }) => baseSprite(gameKey, 235), imgS: ({ gameKey }) => shinySprite(gameKey, 235), },
		{
			id: 41, natiId: 479, name: "Rotom", img: ({ gameKey }) => baseSprite(gameKey, 479), imgS: ({ gameKey }) => shinySprite(gameKey, 479), tags: ["other"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 479), imgS: ({ gameKey }) => shinySprite(gameKey, 479), },
				{ name: "Fan", img: ({ gameKey }) => baseSprite(gameKey, "0479-fa"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-fa"), },
				{ name: "Frost", img: ({ gameKey }) => baseSprite(gameKey, "0479-fr"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-fr"), },
				{ name: "Heat", img: ({ gameKey }) => baseSprite(gameKey, "0479-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-h"), },
				{ name: "Mow", img: ({ gameKey }) => baseSprite(gameKey, "0479-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-m"), },
				{ name: "Wash", img: ({ gameKey }) => baseSprite(gameKey, "0479-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-w"), }
			],
		},
		{ id: 42, natiId: 868, name: "Milcery", img: ({ gameKey }) => baseSprite(gameKey, 868), imgS: ({ gameKey }) => shinySprite(gameKey, 868), },
		{
			id: 43, name: "Alcremie", img: ({ gameKey }) => baseSprite(gameKey, "0869-va"), imgS: ({ gameKey }) => shinySprite(gameKey, 869), tags: ["other"], forms: [
				{ name: "Vanilla Cream\nStrawberry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-va"), imgS: ({ gameKey }) => shinySprite(gameKey, 869), },
				{ name: "Vanilla Cream\nBerry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-va-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-b"), },
				{ name: "Vanilla Cream\nLove Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-va-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-l"), },
				{ name: "Vanilla Cream\nStar Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-va-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-s"), },
				{ name: "Vanilla Cream\nClover Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-va-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-c"), },
				{ name: "Vanilla Cream\nFlower Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-va-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-f"), },
				{ name: "Vanilla Cream\nRibbon Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-va-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-r"), },
				{ name: "Ruby Cream\nStrawberry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rc"), imgS: ({ gameKey }) => shinySprite(gameKey, 869), },
				{ name: "Ruby Cream\nBerry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rc-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-b"), },
				{ name: "Ruby Cream\nLove Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rc-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-b"), },
				{ name: "Ruby Cream\nStar Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rc-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-s"), },
				{ name: "Ruby Cream\nClover Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rc-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-c"), },
				{ name: "Ruby Cream\nFlower Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rc-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-f"), },
				{ name: "Ruby Cream\nRibbon Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rc-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-r"), },
				{ name: "Matcha Cream\nStrawberry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mac"), imgS: ({ gameKey }) => shinySprite(gameKey, 869), },
				{ name: "Matcha Cream\nBerry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mac-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-b"), },
				{ name: "Matcha Cream\nLove Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mac-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-l"), },
				{ name: "Matcha Cream\nStar Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mac-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-s"), },
				{ name: "Matcha Cream\nClover Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mac-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-c"), },
				{ name: "Matcha Cream\nFlower Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mac-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-f"), },
				{ name: "Matcha Cream\nRibbon Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mac-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-r"), },
				{ name: "Mint Cream\nStrawberry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mic"), imgS: ({ gameKey }) => shinySprite(gameKey, 869), },
				{ name: "Mint Cream\nBerry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mic-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-b"), },
				{ name: "Mint Cream\nLove Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mic-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-l"), },
				{ name: "Mint Cream\nStar Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mic-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-s"), },
				{ name: "Mint Cream\nClover Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mic-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-c"), },
				{ name: "Mint Cream\nFlower Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mic-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-f"), },
				{ name: "Mint Cream\nRibbon Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-mic-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-r"), },
				{ name: "Lemon Cream\nStrawberry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-lc"), imgS: ({ gameKey }) => shinySprite(gameKey, 869), },
				{ name: "Lemon Cream\nBerry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-lc-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-b"), },
				{ name: "Lemon Cream\nLove Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-lc-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-l"), },
				{ name: "Lemon Cream\nStar Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-lc-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-s"), },
				{ name: "Lemon Cream\nClover Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-lc-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-c"), },
				{ name: "Lemon Cream\nFlower Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-lc-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-f"), },
				{ name: "Lemon Cream\nRibbon Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-lc-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-r"), },
				{ name: "Salted Cream\nStrawberry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-sc"), imgS: ({ gameKey }) => shinySprite(gameKey, 869), },
				{ name: "Salted Cream\nBerry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-sc-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-b"), },
				{ name: "Salted Cream\nLove Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-sc-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-l"), },
				{ name: "Salted Cream\nStar Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-sc-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-s"), },
				{ name: "Salted Cream\nClover Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-sc-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-c"), },
				{ name: "Salted Cream\nFlower Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-sc-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-f"), },
				{ name: "Salted Cream\nRibbon Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-sc-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-r"), },
				{ name: "Ruby Swirl\nStrawberry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rs"), imgS: ({ gameKey }) => shinySprite(gameKey, 869), },
				{ name: "Ruby Swirl\nBerry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rs-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-b"), },
				{ name: "Ruby Swirl\nLove Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rs-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-l"), },
				{ name: "Ruby Swirl\nStar Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rs-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-s"), },
				{ name: "Ruby Swirl\nClover Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rs-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-c"), },
				{ name: "Ruby Swirl\nFlower Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rs-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-f"), },
				{ name: "Ruby Swirl\nRibbon Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-rs-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-r"), },
				{ name: "Caramel Swirl\nStrawberry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-cs"), imgS: ({ gameKey }) => shinySprite(gameKey, 869), },
				{ name: "Caramel Swirl\nBerry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-cs-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-b"), },
				{ name: "Caramel Swirl\nLove Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-cs-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-l"), },
				{ name: "Caramel Swirl\nStar Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-cs-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-s"), },
				{ name: "Caramel Swirl\nClover Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-cs-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-c"), },
				{ name: "Caramel Swirl\nFlower Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-cs-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-f"), },
				{ name: "Caramel Swirl\nRibbon Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-cs-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-r"), },
				{ name: "Rainbow Swirl\nStrawberry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-ras"), imgS: ({ gameKey }) => shinySprite(gameKey, 869), },
				{ name: "Rainbow Swirl\nBerry Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-ras-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-b"), },
				{ name: "Rainbow Swirl\nLove Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-ras-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-l"), },
				{ name: "Rainbow Swirl\nStar Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-ras-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-s"), },
				{ name: "Rainbow Swirl\nClover Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-ras-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-c"), },
				{ name: "Rainbow Swirl\nFlower Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-ras-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-f"), },
				{ name: "Rainbow Swirl\nRibbon Sweet", img: ({ gameKey }) => baseSprite(gameKey, "0869-ras-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0869-r"), },],
		},
		{ id: 44, natiId: 328, name: "Trapinch", img: ({ gameKey }) => baseSprite(gameKey, 328), imgS: ({ gameKey }) => shinySprite(gameKey, 328), },
		{ id: 45, natiId: 329, name: "Vibrava", img: ({ gameKey }) => baseSprite(gameKey, 329), imgS: ({ gameKey }) => shinySprite(gameKey, 329), },
		{ id: 46, natiId: 330, name: "Flygon", img: ({ gameKey }) => baseSprite(gameKey, 330), imgS: ({ gameKey }) => shinySprite(gameKey, 330), },
		{ id: 47, natiId: 731, name: "Pikipek", img: ({ gameKey }) => baseSprite(gameKey, 731), imgS: ({ gameKey }) => shinySprite(gameKey, 731), },
		{ id: 48, natiId: 732, name: "Trumbeak", img: ({ gameKey }) => baseSprite(gameKey, 732), imgS: ({ gameKey }) => shinySprite(gameKey, 732), },
		{ id: 49, natiId: 733, name: "Toucannon", img: ({ gameKey }) => baseSprite(gameKey, 733), imgS: ({ gameKey }) => shinySprite(gameKey, 733), },
		{ id: 50, natiId: 72, name: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72), imgS: ({ gameKey }) => shinySprite(gameKey, 72), },
		{ id: 51, natiId: 73, name: "Tentacruel", img: ({ gameKey }) => baseSprite(gameKey, 73), imgS: ({ gameKey }) => shinySprite(gameKey, 73), },
		{ id: 52, natiId: 116, name: "Horsea", img: ({ gameKey }) => baseSprite(gameKey, 116), imgS: ({ gameKey }) => shinySprite(gameKey, 116), },
		{ id: 53, natiId: 117, name: "Seadra", img: ({ gameKey }) => baseSprite(gameKey, 117), imgS: ({ gameKey }) => shinySprite(gameKey, 117), },
		{ id: 54, natiId: 230, name: "Kingdra", img: ({ gameKey }) => baseSprite(gameKey, 230), imgS: ({ gameKey }) => shinySprite(gameKey, 230), },
		{ id: 55, natiId: 779, name: "Bruxish", img: ({ gameKey }) => baseSprite(gameKey, 779), imgS: ({ gameKey }) => shinySprite(gameKey, 779), },
		{ id: 56, natiId: 546, name: "Cottonee", img: ({ gameKey }) => baseSprite(gameKey, 546), imgS: ({ gameKey }) => shinySprite(gameKey, 546), },
		{ id: 57, natiId: 547, name: "Whimsicott", img: ({ gameKey }) => baseSprite(gameKey, 547), imgS: ({ gameKey }) => shinySprite(gameKey, 547), },
		{ id: 58, natiId: 764, name: "Comfey", img: ({ gameKey }) => baseSprite(gameKey, 764), imgS: ({ gameKey }) => shinySprite(gameKey, 764), },
		{ id: 59, natiId: 287, name: "Slakoth", img: ({ gameKey }) => baseSprite(gameKey, 287), imgS: ({ gameKey }) => shinySprite(gameKey, 287), },
		{ id: 60, natiId: 288, name: "Vigoroth", img: ({ gameKey }) => baseSprite(gameKey, 288), imgS: ({ gameKey }) => shinySprite(gameKey, 288), },
		{ id: 61, natiId: 289, name: "Slaking", img: ({ gameKey }) => baseSprite(gameKey, 289), imgS: ({ gameKey }) => shinySprite(gameKey, 289), },
		{ id: 62, natiId: 43, name: "Oddish", img: ({ gameKey }) => baseSprite(gameKey, 43), imgS: ({ gameKey }) => shinySprite(gameKey, 43), },
		{
			id: 63, natiId: 44, name: "Gloom", img: ({ gameKey }) => baseSprite(gameKey, 44), imgS: ({ gameKey }) => shinySprite(gameKey, 44), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 44), imgS: ({ gameKey }) => shinySprite(gameKey, 44), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0044-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0044-f"), },
			],
		},
		{
			id: 64, natiId: 45, name: "Vileplume", img: ({ gameKey }) => baseSprite(gameKey, 45), imgS: ({ gameKey }) => shinySprite(gameKey, 45), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 45), imgS: ({ gameKey }) => shinySprite(gameKey, 45), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0045-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0045-f"), },
			],
		},
		{ id: 65, natiId: 182, name: "Bellossom", img: ({ gameKey }) => baseSprite(gameKey, 182), imgS: ({ gameKey }) => shinySprite(gameKey, 182), },
		{
			id: 66, natiId: 50, name: "Diglett", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 50), imgS: ({ gameKey }) => shinySprite(gameKey, 50), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0050-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0050-a"), tags: ["alolan"], }
			],
		},
		{
			id: 67, natiId: 51, name: "Dugtrio", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 51), imgS: ({ gameKey }) => shinySprite(gameKey, 51), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0051-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0051-a"), tags: ["alolan"], }
			],
		},
		{
			id: 68, natiId: 88, name: "Grimer", img: ({ gameKey }) => baseSprite(gameKey, 88), imgS: ({ gameKey }) => shinySprite(gameKey, 88), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 88), imgS: ({ gameKey }) => shinySprite(gameKey, 88), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0088-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0088-a"), tags: ["alolan"], }
			],
		},
		{
			id: 69, natiId: 89, name: "Muk", img: ({ gameKey }) => baseSprite(gameKey, 89), imgS: ({ gameKey }) => shinySprite(gameKey, 89), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 89), imgS: ({ gameKey }) => shinySprite(gameKey, 89), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0089-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0089-a"), tags: ["alolan"], }
			],
		},
		{ id: 70, natiId: 335, name: "Zangoose", img: ({ gameKey }) => baseSprite(gameKey, 335), imgS: ({ gameKey }) => shinySprite(gameKey, 335), },
		{ id: 71, natiId: 336, name: "Seviper", img: ({ gameKey }) => baseSprite(gameKey, 336), imgS: ({ gameKey }) => shinySprite(gameKey, 336), },
		{ id: 72, natiId: 739, name: "Crabrawler", img: ({ gameKey }) => baseSprite(gameKey, 739), imgS: ({ gameKey }) => shinySprite(gameKey, 739), },
		{ id: 73, natiId: 740, name: "Crabominable", img: ({ gameKey }) => baseSprite(gameKey, 740), imgS: ({ gameKey }) => shinySprite(gameKey, 740), },
		{
			id: 74, natiId: 741, name: "Oricorio", img: ({ gameKey }) => baseSprite(gameKey, 741), imgS: ({ gameKey }) => shinySprite(gameKey, 741), tags: ["other"], forms: [
				{ name: "Baile Style", img: ({ gameKey }) => baseSprite(gameKey, 741), imgS: ({ gameKey }) => shinySprite(gameKey, 741), },
				{ name: "Pa'u Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-p"), },
				{ name: "Pom-Pom Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-p"), },
				{ name: "Sensu Style", img: ({ gameKey }) => baseSprite(gameKey, "0741-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0741-s"), }
			],
		},
		{
			id: 75, natiId: 79, name: "Slowpoke", img: ({ gameKey }) => baseSprite(gameKey, 79), imgS: ({ gameKey }) => shinySprite(gameKey, 79), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 79), imgS: ({ gameKey }) => shinySprite(gameKey, 79), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0079-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0079-g"), tags: ["galarian"], }
			],
		},
		{
			id: 76, natiId: 80, name: "Slowbro", img: ({ gameKey }) => baseSprite(gameKey, 80), imgS: ({ gameKey }) => shinySprite(gameKey, 80), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 80), imgS: ({ gameKey }) => shinySprite(gameKey, 80), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0080-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0080-g"), tags: ["galarian"], },
			],
		},
		{
			id: 77, natiId: 199, name: "Slowking", img: ({ gameKey }) => baseSprite(gameKey, 199), imgS: ({ gameKey }) => shinySprite(gameKey, 199), forms: [
				{ name: "Johtonian", img: ({ gameKey }) => baseSprite(gameKey, 199), imgS: ({ gameKey }) => shinySprite(gameKey, 199), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0199-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0199-g"), tags: ["galarian"], }
			],
		},
		{ id: 78, natiId: 170, name: "Chinchou", img: ({ gameKey }) => baseSprite(gameKey, 170), imgS: ({ gameKey }) => shinySprite(gameKey, 170), },
		{ id: 79, natiId: 171, name: "Lanturn", img: ({ gameKey }) => baseSprite(gameKey, 171), imgS: ({ gameKey }) => shinySprite(gameKey, 171), },
		{ id: 80, natiId: 686, name: "Inkay", img: ({ gameKey }) => baseSprite(gameKey, 686), imgS: ({ gameKey }) => shinySprite(gameKey, 686), },
		{ id: 81, natiId: 687, name: "Malamar", img: ({ gameKey }) => baseSprite(gameKey, 687), imgS: ({ gameKey }) => shinySprite(gameKey, 687), },
		{ id: 82, natiId: 370, name: "Luvdisc", img: ({ gameKey }) => baseSprite(gameKey, 370), imgS: ({ gameKey }) => shinySprite(gameKey, 370), },
		{
			id: 83, natiId: 456, name: "Finneon", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0456-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0456-f"), }
			],
		},
		{
			id: 84, natiId: 457, name: "Lumineon", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0457-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0457-f"), }
			],
		},
		{ id: 85, natiId: 594, name: "Alomomola", img: ({ gameKey }) => baseSprite(gameKey, 594), imgS: ({ gameKey }) => shinySprite(gameKey, 594), },
		{ id: 86, natiId: 324, name: "Torkoal", img: ({ gameKey }) => baseSprite(gameKey, 324), imgS: ({ gameKey }) => shinySprite(gameKey, 324), },
		{ id: 87, natiId: 661, name: "Fletchling", img: ({ gameKey }) => baseSprite(gameKey, 661), imgS: ({ gameKey }) => shinySprite(gameKey, 661), },
		{ id: 88, natiId: 662, name: "Fletchinder", img: ({ gameKey }) => baseSprite(gameKey, 662), imgS: ({ gameKey }) => shinySprite(gameKey, 662), },
		{ id: 89, natiId: 663, name: "Talonflame", img: ({ gameKey }) => baseSprite(gameKey, 663), imgS: ({ gameKey }) => shinySprite(gameKey, 663), },
		{ id: 90, natiId: 751, name: "Dewpider", img: ({ gameKey }) => baseSprite(gameKey, 751), imgS: ({ gameKey }) => shinySprite(gameKey, 751), },
		{ id: 91, natiId: 752, name: "Araquanid", img: ({ gameKey }) => baseSprite(gameKey, 752), imgS: ({ gameKey }) => shinySprite(gameKey, 752), },
		{ id: 92, natiId: 236, name: "Tyrogue", img: ({ gameKey }) => baseSprite(gameKey, 236), imgS: ({ gameKey }) => shinySprite(gameKey, 236), },
		{ id: 93, natiId: 106, name: "Hitmonlee", img: ({ gameKey }) => baseSprite(gameKey, 106), imgS: ({ gameKey }) => shinySprite(gameKey, 106), },
		{ id: 94, natiId: 107, name: "Hitmonchan", img: ({ gameKey }) => baseSprite(gameKey, 107), imgS: ({ gameKey }) => shinySprite(gameKey, 107), },
		{ id: 95, natiId: 237, name: "Hitmontop", img: ({ gameKey }) => baseSprite(gameKey, 237), imgS: ({ gameKey }) => shinySprite(gameKey, 237), },
		{
			id: 96, natiId: 74, name: "Geodude", img: ({ gameKey }) => baseSprite(gameKey, 74), imgS: ({ gameKey }) => shinySprite(gameKey, 74), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 74), imgS: ({ gameKey }) => shinySprite(gameKey, 74), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0074-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0074-a"), tags: ["alolan"], }
			],
		},
		{
			id: 97, natiId: 75, name: "Graveler", img: ({ gameKey }) => baseSprite(gameKey, 75), imgS: ({ gameKey }) => shinySprite(gameKey, 75), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 75), imgS: ({ gameKey }) => shinySprite(gameKey, 75), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0075-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0075-a"), tags: ["alolan"], }
			],
		},
		{
			id: 98, natiId: 76, name: "Golem", img: ({ gameKey }) => baseSprite(gameKey, 76), imgS: ({ gameKey }) => shinySprite(gameKey, 76), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 76), imgS: ({ gameKey }) => shinySprite(gameKey, 76), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0076-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0076-a"), tags: ["alolan"], }
			],
		},
		{ id: 99, natiId: 529, name: "Drilbur", img: ({ gameKey }) => baseSprite(gameKey, 529), imgS: ({ gameKey }) => shinySprite(gameKey, 529), },
		{ id: 100, natiId: 530, name: "Excadrill", img: ({ gameKey }) => baseSprite(gameKey, 530), imgS: ({ gameKey }) => shinySprite(gameKey, 530), },
		{ id: 101, natiId: 574, name: "Gothita", img: ({ gameKey }) => baseSprite(gameKey, 574), imgS: ({ gameKey }) => shinySprite(gameKey, 574), },
		{ id: 102, natiId: 575, name: "Gothorita", img: ({ gameKey }) => baseSprite(gameKey, 575), imgS: ({ gameKey }) => shinySprite(gameKey, 575), },
		{ id: 103, natiId: 576, name: "Gothitelle", img: ({ gameKey }) => baseSprite(gameKey, 576), imgS: ({ gameKey }) => shinySprite(gameKey, 576), },
		{ id: 104, natiId: 677, name: "Espurr", img: ({ gameKey }) => baseSprite(gameKey, 677), imgS: ({ gameKey }) => shinySprite(gameKey, 677), },
		{
			id: 105, natiId: 678, name: "Meowstic", img: ({ gameKey }) => baseSprite(gameKey, 678), imgS: ({ gameKey }) => shinySprite(gameKey, 678), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 678), imgS: ({ gameKey }) => shinySprite(gameKey, 678), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0678-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0678-f"), },
			],
		},
		{
			id: 106, natiId: 774, name: "Minior", img: ({ gameKey }) => baseSprite(gameKey, 774), imgS: ({ gameKey }) => shinySprite(gameKey, 774), tags: ["other"], forms: [
				{ name: "Blue Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-b"), },
				{ name: "Green Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-g"), },
				{ name: "Indigo Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-i"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-i"), },
				{ name: "Orange Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-o"), },
				{ name: "Red Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-r"), },
				{ name: "Violet Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-v"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-v"), },
				{ name: "Yellow Core", img: ({ gameKey }) => baseSprite(gameKey, "0774-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0774-y"), },
			],
		},
		{ id: 107, natiId: 408, name: "Cranidos", img: ({ gameKey }) => baseSprite(gameKey, 408), imgS: ({ gameKey }) => shinySprite(gameKey, 408), tags: ["fossil"], },
		{ id: 108, natiId: 409, name: "Rampardos", img: ({ gameKey }) => baseSprite(gameKey, 409), imgS: ({ gameKey }) => shinySprite(gameKey, 409), tags: ["fossil"], },
		{ id: 109, natiId: 410, name: "Shieldon", img: ({ gameKey }) => baseSprite(gameKey, 410), imgS: ({ gameKey }) => shinySprite(gameKey, 410), tags: ["fossil"], },
		{ id: 110, natiId: 411, name: "Bastiodon", img: ({ gameKey }) => baseSprite(gameKey, 411), imgS: ({ gameKey }) => shinySprite(gameKey, 411), tags: ["fossil"], },
		{ id: 111, natiId: 572, name: "Minccino", img: ({ gameKey }) => baseSprite(gameKey, 572), imgS: ({ gameKey }) => shinySprite(gameKey, 572), },
		{ id: 112, natiId: 573, name: "Cinccino", img: ({ gameKey }) => baseSprite(gameKey, 573), imgS: ({ gameKey }) => shinySprite(gameKey, 573), },
		{ id: 113, natiId: 227, name: "Skarmory", img: ({ gameKey }) => baseSprite(gameKey, 227), imgS: ({ gameKey }) => shinySprite(gameKey, 227), },
		{ id: 114, natiId: 333, name: "Swablu", img: ({ gameKey }) => baseSprite(gameKey, 333), imgS: ({ gameKey }) => shinySprite(gameKey, 333), },
		{ id: 115, natiId: 334, name: "Altaria", img: ({ gameKey }) => baseSprite(gameKey, 334), imgS: ({ gameKey }) => shinySprite(gameKey, 334), },
		{ id: 116, natiId: 81, name: "Magnemite", img: ({ gameKey }) => baseSprite(gameKey, 81), imgS: ({ gameKey }) => shinySprite(gameKey, 81), },
		{ id: 117, natiId: 82, name: "Magneton", img: ({ gameKey }) => baseSprite(gameKey, 82), imgS: ({ gameKey }) => shinySprite(gameKey, 82), },
		{ id: 118, natiId: 462, name: "Magnezone", img: ({ gameKey }) => baseSprite(gameKey, 462), imgS: ({ gameKey }) => shinySprite(gameKey, 462), },
		{ id: 119, natiId: 311, name: "Plusle", img: ({ gameKey }) => baseSprite(gameKey, 311), imgS: ({ gameKey }) => shinySprite(gameKey, 311), },
		{ id: 120, natiId: 312, name: "Minun", img: ({ gameKey }) => baseSprite(gameKey, 312), imgS: ({ gameKey }) => shinySprite(gameKey, 312), },
		{ id: 121, natiId: 559, name: "Scraggy", img: ({ gameKey }) => baseSprite(gameKey, 559), imgS: ({ gameKey }) => shinySprite(gameKey, 559), },
		{ id: 122, natiId: 560, name: "Scrafty", img: ({ gameKey }) => baseSprite(gameKey, 560), imgS: ({ gameKey }) => shinySprite(gameKey, 560), },
		{ id: 123, natiId: 622, name: "Golett", img: ({ gameKey }) => baseSprite(gameKey, 622), imgS: ({ gameKey }) => shinySprite(gameKey, 622), },
		{ id: 124, natiId: 623, name: "Golurk", img: ({ gameKey }) => baseSprite(gameKey, 623), imgS: ({ gameKey }) => shinySprite(gameKey, 623), },
		{
			id: 125, natiId: 322, name: "Numel", img: ({ gameKey }) => baseSprite(gameKey, 322), imgS: ({ gameKey }) => shinySprite(gameKey, 322), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 322), imgS: ({ gameKey }) => shinySprite(gameKey, 322), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0322-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0322-f"), }
			],
		},
		{
			id: 126, natiId: 323, name: "Camerupt", img: ({ gameKey }) => baseSprite(gameKey, 323), imgS: ({ gameKey }) => shinySprite(gameKey, 323), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 323), imgS: ({ gameKey }) => shinySprite(gameKey, 323), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0323-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0323-f"), },],
		},
		{
			id: 127, natiId: 854, name: "Sinistea", img: ({ gameKey }) => baseSprite(gameKey, 854), imgS: ({ gameKey }) => shinySprite(gameKey, 854), tags: ["other"], forms: [
				{ name: "Phony", img: ({ gameKey }) => baseSprite(gameKey, 854), imgS: ({ gameKey }) => shinySprite(gameKey, 854), },
				{ name: "Authentic", img: ({ gameKey }) => baseSprite(gameKey, "0854-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0854-a"), },]
		},
		{
			id: 128, natiId: 855, name: "Polteageist", img: ({ gameKey }) => baseSprite(gameKey, 855), imgS: ({ gameKey }) => shinySprite(gameKey, 855), tags: ["other"], forms: [
				{ name: "Phony", img: ({ gameKey }) => baseSprite(gameKey, 855), imgS: ({ gameKey }) => shinySprite(gameKey, 855), },
				{ name: "Authentic", img: ({ gameKey }) => baseSprite(gameKey, "0855-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0855-a"), },]
		},
		{ id: 129, natiId: 137, name: "Porygon", img: ({ gameKey }) => baseSprite(gameKey, 137), imgS: ({ gameKey }) => shinySprite(gameKey, 137), },
		{ id: 130, natiId: 233, name: "Porygon2", img: ({ gameKey }) => baseSprite(gameKey, 233), imgS: ({ gameKey }) => shinySprite(gameKey, 233), },
		{ id: 131, natiId: 474, name: "Porygon-Z", img: ({ gameKey }) => baseSprite(gameKey, 474), imgS: ({ gameKey }) => shinySprite(gameKey, 474), },
		{ id: 132, natiId: 595, name: "Joltik", img: ({ gameKey }) => baseSprite(gameKey, 595), imgS: ({ gameKey }) => shinySprite(gameKey, 595), },
		{ id: 133, natiId: 596, name: "Galvantula", img: ({ gameKey }) => baseSprite(gameKey, 596), imgS: ({ gameKey }) => shinySprite(gameKey, 596), },
		{ id: 134, natiId: 602, name: "Tynamo", img: ({ gameKey }) => baseSprite(gameKey, 602), imgS: ({ gameKey }) => shinySprite(gameKey, 602), },
		{ id: 135, natiId: 603, name: "Eelektrik", img: ({ gameKey }) => baseSprite(gameKey, 603), imgS: ({ gameKey }) => shinySprite(gameKey, 603), },
		{ id: 136, natiId: 604, name: "Eelektross", img: ({ gameKey }) => baseSprite(gameKey, 604), imgS: ({ gameKey }) => shinySprite(gameKey, 604), },
		{ id: 137, natiId: 374, name: "Beldum", img: ({ gameKey }) => baseSprite(gameKey, 374), imgS: ({ gameKey }) => shinySprite(gameKey, 374), tags: ["pseudo"], },
		{ id: 138, natiId: 375, name: "Metang", img: ({ gameKey }) => baseSprite(gameKey, 375), imgS: ({ gameKey }) => shinySprite(gameKey, 375), tags: ["pseudo"], },
		{ id: 139, natiId: 376, name: "Metagross", img: ({ gameKey }) => baseSprite(gameKey, 376), imgS: ({ gameKey }) => shinySprite(gameKey, 376), tags: ["pseudo"], },
		{ id: 140, natiId: 610, name: "Axew", img: ({ gameKey }) => baseSprite(gameKey, 610), imgS: ({ gameKey }) => shinySprite(gameKey, 610), },
		{ id: 141, natiId: 611, name: "Fraxure", img: ({ gameKey }) => baseSprite(gameKey, 611), imgS: ({ gameKey }) => shinySprite(gameKey, 611), },
		{ id: 142, natiId: 612, name: "Haxorus", img: ({ gameKey }) => baseSprite(gameKey, 612), imgS: ({ gameKey }) => shinySprite(gameKey, 612), },
		{ id: 143, natiId: 86, name: "Seel", img: ({ gameKey }) => baseSprite(gameKey, 86), imgS: ({ gameKey }) => shinySprite(gameKey, 86), },
		{ id: 144, natiId: 87, name: "Dewgong", img: ({ gameKey }) => baseSprite(gameKey, 87), imgS: ({ gameKey }) => shinySprite(gameKey, 87), },
		{ id: 145, natiId: 131, name: "Lapras", img: ({ gameKey }) => baseSprite(gameKey, 131), imgS: ({ gameKey }) => shinySprite(gameKey, 131), },
		{
			id: 146, natiId: 211, name: "Qwilfish", img: ({ gameKey }) => baseSprite(gameKey, 211), imgS: ({ gameKey }) => shinySprite(gameKey, 211), forms: [
				{ name: "Johtonian", img: ({ gameKey }) => baseSprite(gameKey, 211), imgS: ({ gameKey }) => shinySprite(gameKey, 211), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0211-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0211-h"), tags: ["hisuian"], }
			],
		},
		{ id: 147, natiId: 904, name: "Overqwil", img: ({ gameKey }) => baseSprite(gameKey, 904), imgS: ({ gameKey }) => shinySprite(gameKey, 904), },
		{ id: 148, natiId: 577, name: "Solosis", img: ({ gameKey }) => baseSprite(gameKey, 577), imgS: ({ gameKey }) => shinySprite(gameKey, 577), },
		{ id: 149, natiId: 578, name: "Duosion", img: ({ gameKey }) => baseSprite(gameKey, 578), imgS: ({ gameKey }) => shinySprite(gameKey, 578), },
		{ id: 150, natiId: 579, name: "Reuniclus", img: ({ gameKey }) => baseSprite(gameKey, 579), imgS: ({ gameKey }) => shinySprite(gameKey, 579), },
		{ id: 151, natiId: 209, name: "Snubbull", img: ({ gameKey }) => baseSprite(gameKey, 209), imgS: ({ gameKey }) => shinySprite(gameKey, 209), },
		{ id: 152, natiId: 210, name: "Granbull", img: ({ gameKey }) => baseSprite(gameKey, 210), imgS: ({ gameKey }) => shinySprite(gameKey, 210), },
		{ id: 153, natiId: 613, name: "Cubchoo", img: ({ gameKey }) => baseSprite(gameKey, 613), imgS: ({ gameKey }) => shinySprite(gameKey, 613), },
		{ id: 154, natiId: 614, name: "Beartic", img: ({ gameKey }) => baseSprite(gameKey, 614), imgS: ({ gameKey }) => shinySprite(gameKey, 614), },
		{
			id: 155, natiId: 27, name: "Sandshrew", img: ({ gameKey }) => baseSprite(gameKey, 27), imgS: ({ gameKey }) => shinySprite(gameKey, 27), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 27), imgS: ({ gameKey }) => shinySprite(gameKey, 27), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0027-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0027-a"), tags: ["alolan"], }
			],
		},
		{
			id: 156, natiId: 28, name: "Sandslash", img: ({ gameKey }) => baseSprite(gameKey, 28), imgS: ({ gameKey }) => shinySprite(gameKey, 28), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 28), imgS: ({ gameKey }) => shinySprite(gameKey, 28), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0028-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0028-a"), tags: ["alolan"], }
			],
		},
		{
			id: 157, natiId: 37, name: "Vulpix", img: ({ gameKey }) => baseSprite(gameKey, 37), imgS: ({ gameKey }) => shinySprite(gameKey, 37), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 37), imgS: ({ gameKey }) => shinySprite(gameKey, 37), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0037-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0037-a"), tags: ["alolan"], }
			],
		},
		{
			id: 158, natiId: 38, name: "Ninetales", img: ({ gameKey }) => baseSprite(gameKey, 38), imgS: ({ gameKey }) => shinySprite(gameKey, 38), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 38), imgS: ({ gameKey }) => shinySprite(gameKey, 38), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0038-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0038-a"), tags: ["alolan"], }
			],
		},
		{
			id: 159, natiId: 459, name: "Snover", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0459-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0459-f"), }
			],
		},
		{
			id: 160, natiId: 460, name: "Abomasnow", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0460-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0460-f"), },],
		},
		{ id: 161, natiId: 884, name: "Duraludon", img: ({ gameKey }) => baseSprite(gameKey, 884), imgS: ({ gameKey }) => shinySprite(gameKey, 884), },
		{ id: 162, natiId: 1018, name: "Archaludon", img: ({ gameKey }) => baseSprite(gameKey, 1018), imgS: ({ gameKey }) => shinySprite(gameKey, 1018), },
		{ id: 163, natiId: 1019, name: "Hydrapple", img: ({ gameKey }) => baseSprite(gameKey, 1019), imgS: ({ gameKey }) => shinySprite(gameKey, 1019), },
		{ id: 164, natiId: 1, name: "Bulbasaur", img: ({ gameKey }) => baseSprite(gameKey, 1), imgS: ({ gameKey }) => shinySprite(gameKey, 1), tags: ["starter"], },
		{ id: 165, natiId: 2, name: "Ivysaur", img: ({ gameKey }) => baseSprite(gameKey, 2), imgS: ({ gameKey }) => shinySprite(gameKey, 2), tags: ["starter"], },
		{
			id: 166, natiId: 3, name: "Venusaur", img: ({ gameKey }) => baseSprite(gameKey, 3), imgS: ({ gameKey }) => shinySprite(gameKey, 3), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 3), imgS: ({ gameKey }) => shinySprite(gameKey, 3), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0003-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0003-f"), },],
		},
		{ id: 167, natiId: 4, name: "Charmander", img: ({ gameKey }) => baseSprite(gameKey, 4), imgS: ({ gameKey }) => shinySprite(gameKey, 4), tags: ["starter"], },
		{ id: 168, natiId: 5, name: "Charmeleon", img: ({ gameKey }) => baseSprite(gameKey, 5), imgS: ({ gameKey }) => shinySprite(gameKey, 5), tags: ["starter"], },
		{ id: 169, natiId: 6, name: "Charizard", img: ({ gameKey }) => baseSprite(gameKey, 6), imgS: ({ gameKey }) => shinySprite(gameKey, 6), tags: ["starter"], },
		{ id: 170, natiId: 7, name: "Squirtle", img: ({ gameKey }) => baseSprite(gameKey, 7), imgS: ({ gameKey }) => shinySprite(gameKey, 7), tags: ["starter"], },
		{ id: 171, natiId: 8, name: "Wartortle", img: ({ gameKey }) => baseSprite(gameKey, 8), imgS: ({ gameKey }) => shinySprite(gameKey, 8), tags: ["starter"], },
		{ id: 172, natiId: 9, name: "Blastoise", img: ({ gameKey }) => baseSprite(gameKey, 9), imgS: ({ gameKey }) => shinySprite(gameKey, 9), tags: ["starter"], },
		{ id: 173, natiId: 152, name: "Chikorita", img: ({ gameKey }) => baseSprite(gameKey, 152), imgS: ({ gameKey }) => shinySprite(gameKey, 152), tags: ["starter"], },
		{ id: 174, natiId: 153, name: "Bayleef", img: ({ gameKey }) => baseSprite(gameKey, 153), imgS: ({ gameKey }) => shinySprite(gameKey, 153), tags: ["starter"], },
		{
			id: 175, natiId: 154, name: "Meganium", img: ({ gameKey }) => baseSprite(gameKey, 154), imgS: ({ gameKey }) => shinySprite(gameKey, 154), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 154), imgS: ({ gameKey }) => shinySprite(gameKey, 154), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0154-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0154-f"), },
			],
		},
		{ id: 176, natiId: 155, name: "Cyndaquil", img: ({ gameKey }) => baseSprite(gameKey, 155), imgS: ({ gameKey }) => shinySprite(gameKey, 155), tags: ["starter"], },
		{ id: 177, natiId: 156, name: "Quilava", img: ({ gameKey }) => baseSprite(gameKey, 156), imgS: ({ gameKey }) => shinySprite(gameKey, 156), tags: ["starter"], },
		{
			id: 178, natiId: 157, name: "Typhlosion", img: ({ gameKey }) => baseSprite(gameKey, 157), imgS: ({ gameKey }) => shinySprite(gameKey, 157), tags: ["starter"], forms: [
				{ name: "Johtonian", img: ({ gameKey }) => baseSprite(gameKey, 157), imgS: ({ gameKey }) => shinySprite(gameKey, 157), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0157-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0157-h"), tags: ["hisuian"], },
			],
		},
		{ id: 179, natiId: 158, name: "Totodile", img: ({ gameKey }) => baseSprite(gameKey, 158), imgS: ({ gameKey }) => shinySprite(gameKey, 158), tags: ["starter"], },
		{ id: 180, natiId: 159, name: "Croconaw", img: ({ gameKey }) => baseSprite(gameKey, 159), imgS: ({ gameKey }) => shinySprite(gameKey, 159), tags: ["starter"], },
		{ id: 181, natiId: 160, name: "Feraligatr", img: ({ gameKey }) => baseSprite(gameKey, 160), imgS: ({ gameKey }) => shinySprite(gameKey, 160), tags: ["starter"], },
		{ id: 182, natiId: 252, name: "Treecko", img: ({ gameKey }) => baseSprite(gameKey, 252), imgS: ({ gameKey }) => shinySprite(gameKey, 252), tags: ["starter"], },
		{ id: 183, natiId: 253, name: "Grovyle", img: ({ gameKey }) => baseSprite(gameKey, 253), imgS: ({ gameKey }) => shinySprite(gameKey, 253), tags: ["starter"], },
		{ id: 184, natiId: 254, name: "Sceptile", img: ({ gameKey }) => baseSprite(gameKey, 254), imgS: ({ gameKey }) => shinySprite(gameKey, 254), tags: ["starter"], },
		{
			id: 185, natiId: 255, name: "Torchic", img: ({ gameKey }) => baseSprite(gameKey, 255), imgS: ({ gameKey }) => shinySprite(gameKey, 255), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 255), imgS: ({ gameKey }) => shinySprite(gameKey, 255), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0255-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0255-f"), },
			],
		},
		{
			id: 186, natiId: 256, name: "Combusken", img: ({ gameKey }) => baseSprite(gameKey, 256), imgS: ({ gameKey }) => shinySprite(gameKey, 256), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 256), imgS: ({ gameKey }) => shinySprite(gameKey, 256), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0256-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0256-f"), },
			],
		},
		{
			id: 187, natiId: 257, name: "Blaziken", img: ({ gameKey }) => baseSprite(gameKey, 257), imgS: ({ gameKey }) => shinySprite(gameKey, 257), tags: ["gender", "starter"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 257), imgS: ({ gameKey }) => shinySprite(gameKey, 257), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0257-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0257-f"), },],
		},
		{ id: 188, natiId: 258, name: "Mudkip", img: ({ gameKey }) => baseSprite(gameKey, 258), imgS: ({ gameKey }) => shinySprite(gameKey, 258), tags: ["starter"], },
		{ id: 189, natiId: 259, name: "Marshtomp", img: ({ gameKey }) => baseSprite(gameKey, 259), imgS: ({ gameKey }) => shinySprite(gameKey, 259), tags: ["starter"], },
		{ id: 190, natiId: 260, name: "Swampert", img: ({ gameKey }) => baseSprite(gameKey, 260), imgS: ({ gameKey }) => shinySprite(gameKey, 260), tags: ["starter"], },
		{ id: 191, natiId: 387, name: "Turtwig", img: ({ gameKey }) => baseSprite(gameKey, 387), imgS: ({ gameKey }) => shinySprite(gameKey, 387), tags: ["starter"], },
		{ id: 192, natiId: 388, name: "Grotle", img: ({ gameKey }) => baseSprite(gameKey, 388), imgS: ({ gameKey }) => shinySprite(gameKey, 388), tags: ["starter"], },
		{ id: 193, natiId: 389, name: "Torterra", img: ({ gameKey }) => baseSprite(gameKey, 389), imgS: ({ gameKey }) => shinySprite(gameKey, 389), tags: ["starter"], },
		{ id: 194, natiId: 390, name: "Chimchar", img: ({ gameKey }) => baseSprite(gameKey, 390), imgS: ({ gameKey }) => shinySprite(gameKey, 390), tags: ["starter"], },
		{ id: 195, natiId: 391, name: "Monferno", img: ({ gameKey }) => baseSprite(gameKey, 391), imgS: ({ gameKey }) => shinySprite(gameKey, 391), tags: ["starter"], },
		{ id: 196, natiId: 392, name: "Infernape", img: ({ gameKey }) => baseSprite(gameKey, 392), imgS: ({ gameKey }) => shinySprite(gameKey, 392), tags: ["starter"], },
		{ id: 197, natiId: 393, name: "Piplup", img: ({ gameKey }) => baseSprite(gameKey, 393), imgS: ({ gameKey }) => shinySprite(gameKey, 393), tags: ["starter"], },
		{ id: 198, natiId: 394, name: "Prinplup", img: ({ gameKey }) => baseSprite(gameKey, 394), imgS: ({ gameKey }) => shinySprite(gameKey, 394), tags: ["starter"], },
		{ id: 199, natiId: 395, name: "Empoleon", img: ({ gameKey }) => baseSprite(gameKey, 395), imgS: ({ gameKey }) => shinySprite(gameKey, 395), tags: ["starter"], },
		{ id: 200, natiId: 495, name: "Snivy", img: ({ gameKey }) => baseSprite(gameKey, 495), imgS: ({ gameKey }) => shinySprite(gameKey, 495), tags: ["starter"], },
		{ id: 201, natiId: 496, name: "Servine", img: ({ gameKey }) => baseSprite(gameKey, 496), imgS: ({ gameKey }) => shinySprite(gameKey, 496), tags: ["starter"], },
		{ id: 202, natiId: 497, name: "Serperior", img: ({ gameKey }) => baseSprite(gameKey, 497), imgS: ({ gameKey }) => shinySprite(gameKey, 497), tags: ["starter"], },
		{ id: 203, natiId: 498, name: "Tepig", img: ({ gameKey }) => baseSprite(gameKey, 498), imgS: ({ gameKey }) => shinySprite(gameKey, 498), tags: ["starter"], },
		{ id: 204, natiId: 499, name: "Pignite", img: ({ gameKey }) => baseSprite(gameKey, 499), imgS: ({ gameKey }) => shinySprite(gameKey, 499), tags: ["starter"], },
		{ id: 205, natiId: 500, name: "Emboar", img: ({ gameKey }) => baseSprite(gameKey, 500), imgS: ({ gameKey }) => shinySprite(gameKey, 500), tags: ["starter"], },
		{ id: 206, natiId: 501, name: "Oshawott", img: ({ gameKey }) => baseSprite(gameKey, 501), imgS: ({ gameKey }) => shinySprite(gameKey, 501), tags: ["starter"], },
		{ id: 207, natiId: 502, name: "Dewott", img: ({ gameKey }) => baseSprite(gameKey, 502), imgS: ({ gameKey }) => shinySprite(gameKey, 502), tags: ["starter"], },
		{
			id: 208, natiId: 503, name: "Samurott", img: ({ gameKey }) => baseSprite(gameKey, 503), imgS: ({ gameKey }) => shinySprite(gameKey, 503), tags: ["starter"], forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 503), imgS: ({ gameKey }) => shinySprite(gameKey, 503), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0503-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0503-h"), tags: ["hisuian"], },
			],
		},
		{ id: 209, natiId: 650, name: "Chespin", img: ({ gameKey }) => baseSprite(gameKey, 650), imgS: ({ gameKey }) => shinySprite(gameKey, 650), tags: ["starter"], },
		{ id: 210, natiId: 651, name: "Quilladin", img: ({ gameKey }) => baseSprite(gameKey, 651), imgS: ({ gameKey }) => shinySprite(gameKey, 651), tags: ["starter"], },
		{ id: 211, natiId: 652, name: "Chesnaught", img: ({ gameKey }) => baseSprite(gameKey, 652), imgS: ({ gameKey }) => shinySprite(gameKey, 652), tags: ["starter"], },
		{ id: 212, natiId: 653, name: "Fennekin", img: ({ gameKey }) => baseSprite(gameKey, 653), imgS: ({ gameKey }) => shinySprite(gameKey, 653), tags: ["starter"], },
		{ id: 213, natiId: 654, name: "Braixen", img: ({ gameKey }) => baseSprite(gameKey, 654), imgS: ({ gameKey }) => shinySprite(gameKey, 654), tags: ["starter"], },
		{ id: 214, natiId: 655, name: "Delphox", img: ({ gameKey }) => baseSprite(gameKey, 655), imgS: ({ gameKey }) => shinySprite(gameKey, 655), tags: ["starter"], },
		{ id: 215, natiId: 656, name: "Froakie", img: ({ gameKey }) => baseSprite(gameKey, 656), imgS: ({ gameKey }) => shinySprite(gameKey, 656), tags: ["starter"], },
		{ id: 216, natiId: 657, name: "Frogadier", img: ({ gameKey }) => baseSprite(gameKey, 657), imgS: ({ gameKey }) => shinySprite(gameKey, 657), tags: ["starter"], },
		{ id: 217, natiId: 658, name: "Greninja", img: ({ gameKey }) => baseSprite(gameKey, 658), imgS: ({ gameKey }) => shinySprite(gameKey, 658), tags: ["starter"], },
		{ id: 218, natiId: 722, name: "Rowlet", img: ({ gameKey }) => baseSprite(gameKey, 722), imgS: ({ gameKey }) => shinySprite(gameKey, 722), tags: ["starter"], },
		{ id: 219, natiId: 723, name: "Dartrix", img: ({ gameKey }) => baseSprite(gameKey, 723), imgS: ({ gameKey }) => shinySprite(gameKey, 723), tags: ["starter"], },
		{
			id: 220, natiId: 724, name: "Decidueye", img: ({ gameKey }) => baseSprite(gameKey, 724), imgS: ({ gameKey }) => shinySprite(gameKey, 724), tags: ["starter"], forms: [
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, 724), imgS: ({ gameKey }) => shinySprite(gameKey, 724), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0724-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0724-h"), tags: ["hisuian"], },
			],
		},
		{ id: 221, natiId: 725, name: "Litten", img: ({ gameKey }) => baseSprite(gameKey, 725), imgS: ({ gameKey }) => shinySprite(gameKey, 725), tags: ["starter"], },
		{ id: 222, natiId: 726, name: "Torracat", img: ({ gameKey }) => baseSprite(gameKey, 726), imgS: ({ gameKey }) => shinySprite(gameKey, 726), tags: ["starter"], },
		{ id: 223, natiId: 727, name: "Incineroar", img: ({ gameKey }) => baseSprite(gameKey, 727), imgS: ({ gameKey }) => shinySprite(gameKey, 727), tags: ["starter"], },
		{ id: 224, natiId: 728, name: "Popplio", img: ({ gameKey }) => baseSprite(gameKey, 728), imgS: ({ gameKey }) => shinySprite(gameKey, 728), tags: ["starter"], },
		{ id: 225, natiId: 729, name: "Brionne", img: ({ gameKey }) => baseSprite(gameKey, 729), imgS: ({ gameKey }) => shinySprite(gameKey, 729), tags: ["starter"], },
		{ id: 226, natiId: 730, name: "Primarina", img: ({ gameKey }) => baseSprite(gameKey, 730), imgS: ({ gameKey }) => shinySprite(gameKey, 730), tags: ["starter"], },
		{ id: 227, natiId: 810, name: "Grookey", img: ({ gameKey }) => baseSprite(gameKey, 810), imgS: ({ gameKey }) => shinySprite(gameKey, 810), tags: ["starter"], },
		{ id: 228, natiId: 811, name: "Thwackey", img: ({ gameKey }) => baseSprite(gameKey, 811), imgS: ({ gameKey }) => shinySprite(gameKey, 811), tags: ["starter"], },
		{ id: 229, natiId: 812, name: "Rillaboom", img: ({ gameKey }) => baseSprite(gameKey, 812), imgS: ({ gameKey }) => shinySprite(gameKey, 812), tags: ["starter"], },
		{ id: 230, natiId: 813, name: "Scorbunny", img: ({ gameKey }) => baseSprite(gameKey, 813), imgS: ({ gameKey }) => shinySprite(gameKey, 813), tags: ["starter"], },
		{ id: 231, natiId: 814, name: "Raboot", img: ({ gameKey }) => baseSprite(gameKey, 814), imgS: ({ gameKey }) => shinySprite(gameKey, 814), tags: ["starter"], },
		{ id: 232, natiId: 815, name: "Cinderace", img: ({ gameKey }) => baseSprite(gameKey, 815), imgS: ({ gameKey }) => shinySprite(gameKey, 815), tags: ["starter"], },
		{ id: 233, natiId: 816, name: "Sobble", img: ({ gameKey }) => baseSprite(gameKey, 816), imgS: ({ gameKey }) => shinySprite(gameKey, 816), tags: ["starter"], },
		{ id: 234, natiId: 817, name: "Drizzile", img: ({ gameKey }) => baseSprite(gameKey, 817), imgS: ({ gameKey }) => shinySprite(gameKey, 817), tags: ["starter"], },
		{ id: 235, natiId: 818, name: "Inteleon", img: ({ gameKey }) => baseSprite(gameKey, 818), imgS: ({ gameKey }) => shinySprite(gameKey, 818), tags: ["starter"], },
		{ id: 236, natiId: 1020, name: "Gouging Fire", img: ({ gameKey }) => baseSprite(gameKey, 1020), imgS: ({ gameKey }) => shinySprite(gameKey, 1020), maxStatus: "caught", tags: ["paradox"], },
		{ id: 237, natiId: 1021, name: "Raging Bolt", img: ({ gameKey }) => baseSprite(gameKey, 1021), imgS: ({ gameKey }) => shinySprite(gameKey, 1021), maxStatus: "caught", tags: ["paradox"], },
		{ id: 238, natiId: 1023, name: "Iron Crown", img: ({ gameKey }) => baseSprite(gameKey, 1023), imgS: ({ gameKey }) => shinySprite(gameKey, 1023), maxStatus: "caught", tags: ["paradox"], },
		{ id: 239, natiId: 1022, name: "Iron Boulder", img: ({ gameKey }) => baseSprite(gameKey, 1022), imgS: ({ gameKey }) => shinySprite(gameKey, 1022), maxStatus: "caught", tags: ["paradox"], },
		{ id: 240, natiId: 1024, name: "Terapagos", img: ({ gameKey }) => baseSprite(gameKey, 1024), imgS: ({ gameKey }) => shinySprite(gameKey, 1024), maxStatus: "caught", tags: ["paradox"], },
		{ id: 241, natiId: 1009, name: "Walking Wake", img: ({ gameKey }) => baseSprite(gameKey, 1009), imgS: ({ gameKey }) => shinySprite(gameKey, 1009), maxStatus: "caught", tags: ["paradox", "mythical"], },
		{ id: 242, natiId: 1010, name: "Iron Leaves", img: ({ gameKey }) => baseSprite(gameKey, 1010), imgS: ({ gameKey }) => shinySprite(gameKey, 1010), maxStatus: "caught", tags: ["paradox", "mythical"], },
		{ id: 243, natiId: 1025, name: "Pecharunt", img: ({ gameKey }) => baseSprite(gameKey, 1025), imgS: ({ gameKey }) => shinySprite(gameKey, 1025), maxStatus: "caught", tags: ["mythical"], }
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();