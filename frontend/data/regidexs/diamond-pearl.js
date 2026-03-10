(() => {
	const gen = 4;
	const GAME_KEYS = ["diamond", "pearl"];
	const DEX_NAME = "Sinnoh Dex";

	const baseSprite = (gameKey, natiId) => window.dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => window.dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 387, name: "Turtwig", img: ({ gameKey }) => baseSprite(gameKey, 387), imgS: ({ gameKey }) => shinySprite(gameKey, 387), tags: ["starter"] },
		{ id: 2, natiId: 388, name: "Grotle", img: ({ gameKey }) => baseSprite(gameKey, 388), imgS: ({ gameKey }) => shinySprite(gameKey, 388), tags: ["starter"] },
		{ id: 3, natiId: 389, name: "Torterra", img: ({ gameKey }) => baseSprite(gameKey, 389), imgS: ({ gameKey }) => shinySprite(gameKey, 389), tags: ["starter"] },
		{ id: 4, natiId: 390, name: "Chimchar", img: ({ gameKey }) => baseSprite(gameKey, 390), imgS: ({ gameKey }) => shinySprite(gameKey, 390), tags: ["starter"] },
		{ id: 5, natiId: 391, name: "Monferno", img: ({ gameKey }) => baseSprite(gameKey, 391), imgS: ({ gameKey }) => shinySprite(gameKey, 391), tags: ["starter"] },
		{ id: 6, natiId: 392, name: "Infernape", img: ({ gameKey }) => baseSprite(gameKey, 392), imgS: ({ gameKey }) => shinySprite(gameKey, 392), tags: ["starter"] },
		{ id: 7, natiId: 393, name: "Piplup", img: ({ gameKey }) => baseSprite(gameKey, 393), imgS: ({ gameKey }) => shinySprite(gameKey, 393), tags: ["starter"] },
		{ id: 8, natiId: 394, name: "Prinplup", img: ({ gameKey }) => baseSprite(gameKey, 394), imgS: ({ gameKey }) => shinySprite(gameKey, 394), tags: ["starter"] },
		{ id: 9, natiId: 395, name: "Empoleon", img: ({ gameKey }) => baseSprite(gameKey, 395), imgS: ({ gameKey }) => shinySprite(gameKey, 395), tags: ["starter"] },
		{
			id: 10, natiId: 396, name: "Starly", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0396-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0396-f"), },
			]
		},
		{
			id: 11, natiId: 397, name: "Staravia", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0397-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0397-f"), },
			]
		},
		{
			id: 12, natiId: 398, name: "Staraptor", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0398-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0398-f"), },
			]
		},
		{
			id: 13, natiId: 399, name: "Bidoof", img: ({ gameKey }) => baseSprite(gameKey, 399), imgS: ({ gameKey }) => shinySprite(gameKey, 399), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 399), imgS: ({ gameKey }) => shinySprite(gameKey, 399), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0399-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0399-f"), },
			]
		},
		{
			id: 14, natiId: 400, name: "Bibarel", img: ({ gameKey }) => baseSprite(gameKey, 400), imgS: ({ gameKey }) => shinySprite(gameKey, 400), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 400), imgS: ({ gameKey }) => shinySprite(gameKey, 400), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0400-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0400-f"), },
			]
		},
		{
			id: 15, natiId: 401, name: "Kricketot", img: ({ gameKey }) => baseSprite(gameKey, 401), imgS: ({ gameKey }) => shinySprite(gameKey, 401), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 401), imgS: ({ gameKey }) => shinySprite(gameKey, 401), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0401-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0401-f"), },
			]
		},
		{
			id: 16, natiId: 402, name: "Kricketune", img: ({ gameKey }) => baseSprite(gameKey, 402), imgS: ({ gameKey }) => shinySprite(gameKey, 402), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 402), imgS: ({ gameKey }) => shinySprite(gameKey, 402), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0402-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0402-f"), },
			]
		},
		{
			id: 17, natiId: 403, name: "Shinx", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0403-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0403-f"), },
			]
		},
		{
			id: 18, natiId: 404, name: "Luxio", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0404-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0404-f"), },
			]
		},
		{
			id: 19, natiId: 405, name: "Luxray", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0405-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0405-f"), },
			]
		},
		{ id: 20, natiId: 63, name: "Abra", img: ({ gameKey }) => baseSprite(gameKey, 63), imgS: ({ gameKey }) => shinySprite(gameKey, 63) },
		{
			id: 21, natiId: 64, name: "Kadabra", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0064-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0064-f"), },
			]
		},
		{
			id: 22, natiId: 65, name: "Alakazam", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0065-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0065-f"), },
			]
		},
		{
			id: 23, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), },
			]
		},
		{
			id: 24, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },
			]
		},
		{ id: 25, natiId: 406, name: "Budew", img: ({ gameKey }) => baseSprite(gameKey, 406), imgS: ({ gameKey }) => shinySprite(gameKey, 406) },
		{
			id: 26, natiId: 315, name: "Roselia", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0315-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0315-f"), },
			]
		},
		{
			id: 27, natiId: 407, name: "Roserade", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0407-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0407-f"), },
			]
		},
		{
			id: 28, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), },
			]
		},
		{
			id: 29, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), },
			]
		},
		{ id: 30, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169) },
		{ id: 31, natiId: 74, name: "Geodude", img: ({ gameKey }) => baseSprite(gameKey, 74), imgS: ({ gameKey }) => shinySprite(gameKey, 74) },
		{ id: 32, natiId: 75, name: "Graveler", img: ({ gameKey }) => baseSprite(gameKey, 75), imgS: ({ gameKey }) => shinySprite(gameKey, 75) },
		{ id: 33, natiId: 76, name: "Golem", img: ({ gameKey }) => baseSprite(gameKey, 76), imgS: ({ gameKey }) => shinySprite(gameKey, 76) },
		{ id: 34, natiId: 95, name: "Onix", img: ({ gameKey }) => baseSprite(gameKey, 95), imgS: ({ gameKey }) => shinySprite(gameKey, 95) },
		{
			id: 35, natiId: 208, name: "Steelix", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0208-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0208-f"), },
			]
		},
		{ id: 36, natiId: 408, name: "Cranidos", img: ({ gameKey }) => baseSprite(gameKey, 408), imgS: ({ gameKey }) => shinySprite(gameKey, 408), tags: ["fossil"] },
		{ id: 37, natiId: 409, name: "Rampardos", img: ({ gameKey }) => baseSprite(gameKey, 409), imgS: ({ gameKey }) => shinySprite(gameKey, 409), tags: ["fossil"] },
		{ id: 38, natiId: 410, name: "Shieldon", img: ({ gameKey }) => baseSprite(gameKey, 410), imgS: ({ gameKey }) => shinySprite(gameKey, 410), tags: ["fossil"] },
		{ id: 39, natiId: 411, name: "Bastiodon", img: ({ gameKey }) => baseSprite(gameKey, 411), imgS: ({ gameKey }) => shinySprite(gameKey, 411), tags: ["fossil"] },
		{ id: 40, natiId: 66, name: "Machop", img: ({ gameKey }) => baseSprite(gameKey, 66), imgS: ({ gameKey }) => shinySprite(gameKey, 66) },
		{ id: 41, natiId: 67, name: "Machoke", img: ({ gameKey }) => baseSprite(gameKey, 67), imgS: ({ gameKey }) => shinySprite(gameKey, 67) },
		{ id: 42, natiId: 68, name: "Machamp", img: ({ gameKey }) => baseSprite(gameKey, 68), imgS: ({ gameKey }) => shinySprite(gameKey, 68) },
		{ id: 43, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54) },
		{ id: 44, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55) },
		{
			id: 45, natiId: 412, name: "Burmy", img: ({ gameKey }) => baseSprite(gameKey, 412), imgS: ({ gameKey }) => shinySprite(gameKey, 412), tags: ["other"], forms: [
				{ name: "Plant Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0412-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0412-p"), },
				{ name: "Sandy Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0412-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0412-s"), },
				{ name: "Trash Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0412-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0412-t"), },
			]
		},
		{
			id: 46, natiId: 413, name: "Wormadam", img: ({ gameKey }) => baseSprite(gameKey, 413), imgS: ({ gameKey }) => shinySprite(gameKey, 413), tags: ["other"], forms: [
				{ name: "Plant Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0413-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0413-p"), },
				{ name: "Sandy Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0413-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0413-s"), },
				{ name: "Trash Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0413-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0413-t"), },
			]
		},
		{ id: 47, natiId: 414, name: "Mothim", img: ({ gameKey }) => baseSprite(gameKey, 414), imgS: ({ gameKey }) => shinySprite(gameKey, 414) },
		{ id: 48, natiId: 265, name: "Wurmple", img: ({ gameKey }) => baseSprite(gameKey, 265), imgS: ({ gameKey }) => shinySprite(gameKey, 265) },
		{ id: 49, natiId: 266, name: "Silcoon", img: ({ gameKey }) => baseSprite(gameKey, 266), imgS: ({ gameKey }) => shinySprite(gameKey, 266) },
		{
			id: 50, natiId: 267, name: "Beautifly", img: ({ gameKey }) => baseSprite(gameKey, 267), imgS: ({ gameKey }) => shinySprite(gameKey, 267), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 267), imgS: ({ gameKey }) => shinySprite(gameKey, 267), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0267-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0267-f"), },
			]
		},
		{ id: 51, natiId: 268, name: "Cascoon", img: ({ gameKey }) => baseSprite(gameKey, 268), imgS: ({ gameKey }) => shinySprite(gameKey, 268) },
		{
			id: 52, natiId: 269, name: "Dustox", img: ({ gameKey }) => baseSprite(gameKey, 269), imgS: ({ gameKey }) => shinySprite(gameKey, 269), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 269), imgS: ({ gameKey }) => shinySprite(gameKey, 269), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0269-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0269-f"), },
			]
		},
		{
			id: 53, natiId: 415, name: "Combee", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0415-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0415-f"), },
			]
		},
		{ id: 54, natiId: 416, name: "Vespiquen", img: ({ gameKey }) => baseSprite(gameKey, 416), imgS: ({ gameKey }) => shinySprite(gameKey, 416) },
		{
			id: 55, natiId: 417, name: "Pachirisu", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0417-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0417-f"), },
			]
		},
		{
			id: 56, natiId: 418, name: "Buizel", img: ({ gameKey }) => baseSprite(gameKey, 418), imgS: ({ gameKey }) => shinySprite(gameKey, 418), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 418), imgS: ({ gameKey }) => shinySprite(gameKey, 418), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0418-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0418-f"), },
			]
		},
		{
			id: 57, natiId: 419, name: "Floatzel", img: ({ gameKey }) => baseSprite(gameKey, 419), imgS: ({ gameKey }) => shinySprite(gameKey, 419), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 419), imgS: ({ gameKey }) => shinySprite(gameKey, 419), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0419-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0419-f"), },
			]
		},
		{ id: 58, natiId: 420, name: "Cherubi", img: ({ gameKey }) => baseSprite(gameKey, 420), imgS: ({ gameKey }) => shinySprite(gameKey, 420) },
		{
			id: 59, natiId: 421, name: "Cherrim", img: ({ gameKey }) => baseSprite(gameKey, 421), imgS: ({ gameKey }) => shinySprite(gameKey, 421), tags: ["other"], forms: [
				{ name: "Overcast", img: ({ gameKey }) => baseSprite(gameKey, "0421-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0421-o"), },
				{ name: "Sunshine", img: ({ gameKey }) => baseSprite(gameKey, "0421-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0421-s"), },
			]
		},
		{
			id: 60, natiId: 422, name: "Shellos", img: ({ gameKey }) => baseSprite(gameKey, 422), imgS: ({ gameKey }) => shinySprite(gameKey, 422), tags: ["other"], forms: [
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0422-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0422-e"), },
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, "0422-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0422-w"), },
			]
		},
		{
			id: 61, natiId: 423, name: "Gastrodon", img: ({ gameKey }) => baseSprite(gameKey, 423), imgS: ({ gameKey }) => shinySprite(gameKey, 423), tags: ["other"], forms: [
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0423-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0423-e"), },
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, "0423-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0423-w"), },
			]
		},
		{
			id: 62, natiId: 214, name: "Heracross", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0214-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0214-f"), },
			]
		},
		{
			id: 63, natiId: 190, name: "Aipom", img: ({ gameKey }) => baseSprite(gameKey, 190), imgS: ({ gameKey }) => shinySprite(gameKey, 190), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 190), imgS: ({ gameKey }) => shinySprite(gameKey, 190), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0190-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0190-f"), },
			]
		},
		{
			id: 64, natiId: 424, name: "Ambipom", img: ({ gameKey }) => baseSprite(gameKey, 424), imgS: ({ gameKey }) => shinySprite(gameKey, 424), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 424), imgS: ({ gameKey }) => shinySprite(gameKey, 424), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0424-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0424-f"), },
			]
		},
		{ id: 65, natiId: 425, name: "Drifloon", img: ({ gameKey }) => baseSprite(gameKey, 425), imgS: ({ gameKey }) => shinySprite(gameKey, 425) },
		{ id: 66, natiId: 426, name: "Drifblim", img: ({ gameKey }) => baseSprite(gameKey, 426), imgS: ({ gameKey }) => shinySprite(gameKey, 426) },
		{ id: 67, natiId: 427, name: "Buneary", img: ({ gameKey }) => baseSprite(gameKey, 427), imgS: ({ gameKey }) => shinySprite(gameKey, 427) },
		{ id: 68, natiId: 428, name: "Lopunny", img: ({ gameKey }) => baseSprite(gameKey, 428), imgS: ({ gameKey }) => shinySprite(gameKey, 428) },
		{ id: 69, natiId: 92, name: "Gastly", img: ({ gameKey }) => baseSprite(gameKey, 92), imgS: ({ gameKey }) => shinySprite(gameKey, 92) },
		{ id: 70, natiId: 93, name: "Haunter", img: ({ gameKey }) => baseSprite(gameKey, 93), imgS: ({ gameKey }) => shinySprite(gameKey, 93) },
		{ id: 71, natiId: 94, name: "Gengar", img: ({ gameKey }) => baseSprite(gameKey, 94), imgS: ({ gameKey }) => shinySprite(gameKey, 94) },
		{ id: 72, natiId: 200, name: "Misdreavus", img: ({ gameKey }) => baseSprite(gameKey, 200), imgS: ({ gameKey }) => shinySprite(gameKey, 200) },
		{ id: 73, natiId: 429, name: "Mismagius", img: ({ gameKey }) => baseSprite(gameKey, 429), imgS: ({ gameKey }) => shinySprite(gameKey, 429) },
		{
			id: 74, natiId: 198, name: "Murkrow", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0198-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0198-f"), },
			]
		},
		{ id: 75, natiId: 430, name: "Honchkrow", img: ({ gameKey }) => baseSprite(gameKey, 430), imgS: ({ gameKey }) => shinySprite(gameKey, 430) },
		{ id: 76, natiId: 431, name: "Glameow", img: ({ gameKey }) => baseSprite(gameKey, 431), imgS: ({ gameKey }) => shinySprite(gameKey, 431) },
		{ id: 77, natiId: 432, name: "Purugly", img: ({ gameKey }) => baseSprite(gameKey, 432), imgS: ({ gameKey }) => shinySprite(gameKey, 432) },
		{
			id: 78, natiId: 118, name: "Goldeen", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0118-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0118-f"), },
			]
		},
		{
			id: 79, natiId: 119, name: "Seaking", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0119-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0119-f"), },
			]
		},
		{ id: 80, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339) },
		{ id: 81, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340) },
		{ id: 82, natiId: 433, name: "Chingling", img: ({ gameKey }) => baseSprite(gameKey, 433), imgS: ({ gameKey }) => shinySprite(gameKey, 433) },
		{ id: 83, natiId: 358, name: "Chimecho", img: ({ gameKey }) => baseSprite(gameKey, 358), imgS: ({ gameKey }) => shinySprite(gameKey, 358) },
		{ id: 84, natiId: 434, name: "Stunky", img: ({ gameKey }) => baseSprite(gameKey, 434), imgS: ({ gameKey }) => shinySprite(gameKey, 434) },
		{ id: 85, natiId: 435, name: "Skuntank", img: ({ gameKey }) => baseSprite(gameKey, 435), imgS: ({ gameKey }) => shinySprite(gameKey, 435) },
		{
			id: 86, natiId: 307, name: "Meditite", img: ({ gameKey }) => baseSprite(gameKey, 307), imgS: ({ gameKey }) => shinySprite(gameKey, 307), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 307), imgS: ({ gameKey }) => shinySprite(gameKey, 307), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0307-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0307-f"), },
			]
		},
		{
			id: 87, natiId: 308, name: "Medicham", img: ({ gameKey }) => baseSprite(gameKey, 308), imgS: ({ gameKey }) => shinySprite(gameKey, 308), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 308), imgS: ({ gameKey }) => shinySprite(gameKey, 308), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0308-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0308-f"), },
			]
		},
		{ id: 88, natiId: 436, name: "Bronzor", img: ({ gameKey }) => baseSprite(gameKey, 436), imgS: ({ gameKey }) => shinySprite(gameKey, 436) },
		{ id: 89, natiId: 437, name: "Bronzong", img: ({ gameKey }) => baseSprite(gameKey, 437), imgS: ({ gameKey }) => shinySprite(gameKey, 437) },
		{ id: 90, natiId: 77, name: "Ponyta", img: ({ gameKey }) => baseSprite(gameKey, 77), imgS: ({ gameKey }) => shinySprite(gameKey, 77) },
		{ id: 91, natiId: 78, name: "Rapidash", img: ({ gameKey }) => baseSprite(gameKey, 78), imgS: ({ gameKey }) => shinySprite(gameKey, 78) },
		{ id: 92, natiId: 438, name: "Bonsly", img: ({ gameKey }) => baseSprite(gameKey, 438), imgS: ({ gameKey }) => shinySprite(gameKey, 438) },
		{
			id: 93, natiId: 185, name: "Sudowoodo", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0185-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0185-f"), },
			]
		},
		{ id: 94, natiId: 439, name: "Mime Jr.", img: ({ gameKey }) => baseSprite(gameKey, 439), imgS: ({ gameKey }) => shinySprite(gameKey, 439) },
		{ id: 95, natiId: 122, name: "Mr. Mime", img: ({ gameKey }) => baseSprite(gameKey, 122), imgS: ({ gameKey }) => shinySprite(gameKey, 122) },
		{ id: 96, natiId: 440, name: "Happiny", img: ({ gameKey }) => baseSprite(gameKey, 440), imgS: ({ gameKey }) => shinySprite(gameKey, 440) },
		{ id: 97, natiId: 113, name: "Chansey", img: ({ gameKey }) => baseSprite(gameKey, 113), imgS: ({ gameKey }) => shinySprite(gameKey, 113) },
		{ id: 98, natiId: 242, name: "Blissey", img: ({ gameKey }) => baseSprite(gameKey, 242), imgS: ({ gameKey }) => shinySprite(gameKey, 242) },
		{ id: 99, natiId: 173, name: "Cleffa", img: ({ gameKey }) => baseSprite(gameKey, 173), imgS: ({ gameKey }) => shinySprite(gameKey, 173) },
		{ id: 100, natiId: 35, name: "Clefairy", img: ({ gameKey }) => baseSprite(gameKey, 35), imgS: ({ gameKey }) => shinySprite(gameKey, 35) },
		{ id: 101, natiId: 36, name: "Clefable", img: ({ gameKey }) => baseSprite(gameKey, 36), imgS: ({ gameKey }) => shinySprite(gameKey, 36) },
		{ id: 102, natiId: 441, name: "Chatot", img: ({ gameKey }) => baseSprite(gameKey, 441), imgS: ({ gameKey }) => shinySprite(gameKey, 441) },
		{ id: 103, natiId: 172, name: "Pichu", img: ({ gameKey }) => baseSprite(gameKey, 172), imgS: ({ gameKey }) => shinySprite(gameKey, 172) },
		{
			id: 104, natiId: 25, name: "Pikachu", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0025-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-f"), },
			]
		},
		{
			id: 105, natiId: 26, name: "Raichu", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0026-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-f"), },
			]
		},
		{ id: 106, natiId: 163, name: "Hoothoot", img: ({ gameKey }) => baseSprite(gameKey, 163), imgS: ({ gameKey }) => shinySprite(gameKey, 163) },
		{ id: 107, natiId: 164, name: "Noctowl", img: ({ gameKey }) => baseSprite(gameKey, 164), imgS: ({ gameKey }) => shinySprite(gameKey, 164) },
		{ id: 108, natiId: 442, name: "Spiritomb", img: ({ gameKey }) => baseSprite(gameKey, 442), imgS: ({ gameKey }) => shinySprite(gameKey, 442) },
		{
			id: 109, natiId: 443, name: "Gible", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0443-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0443-f"), },
			]
		},
		{
			id: 110, natiId: 444, name: "Gabite", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0444-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0444-f"), },
			]
		},
		{
			id: 111, natiId: 445, name: "Garchomp", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0445-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0445-f"), },
			]
		},
		{ id: 112, natiId: 446, name: "Munchlax", img: ({ gameKey }) => baseSprite(gameKey, 446), imgS: ({ gameKey }) => shinySprite(gameKey, 446) },
		{ id: 113, natiId: 143, name: "Snorlax", img: ({ gameKey }) => baseSprite(gameKey, 143), imgS: ({ gameKey }) => shinySprite(gameKey, 143) },
		{
			id: 114, natiId: 201, name: "Unown", img: ({ gameKey }) => baseSprite(gameKey, 201), imgS: ({ gameKey }) => shinySprite(gameKey, 201), tags: ["other"], forms: [
				{ name: "A", img: ({ gameKey }) => baseSprite(gameKey, "0201-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-a"), },
				{ name: "B", img: ({ gameKey }) => baseSprite(gameKey, "0201-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-b"), },
				{ name: "C", img: ({ gameKey }) => baseSprite(gameKey, "0201-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-c"), },
				{ name: "D", img: ({ gameKey }) => baseSprite(gameKey, "0201-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-d"), },
				{ name: "E", img: ({ gameKey }) => baseSprite(gameKey, "0201-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-e"), },
				{ name: "F", img: ({ gameKey }) => baseSprite(gameKey, "0201-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-f"), },
				{ name: "G", img: ({ gameKey }) => baseSprite(gameKey, "0201-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-g"), },
				{ name: "H", img: ({ gameKey }) => baseSprite(gameKey, "0201-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-h"), },
				{ name: "I", img: ({ gameKey }) => baseSprite(gameKey, "0201-i"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-i"), },
				{ name: "J", img: ({ gameKey }) => baseSprite(gameKey, "0201-j"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-j"), },
				{ name: "K", img: ({ gameKey }) => baseSprite(gameKey, "0201-k"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-k"), },
				{ name: "L", img: ({ gameKey }) => baseSprite(gameKey, "0201-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-l"), },
				{ name: "M", img: ({ gameKey }) => baseSprite(gameKey, "0201-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-m"), },
				{ name: "N", img: ({ gameKey }) => baseSprite(gameKey, "0201-n"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-n"), },
				{ name: "O", img: ({ gameKey }) => baseSprite(gameKey, "0201-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-o"), },
				{ name: "P", img: ({ gameKey }) => baseSprite(gameKey, "0201-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-p"), },
				{ name: "Q", img: ({ gameKey }) => baseSprite(gameKey, "0201-q"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-q"), },
				{ name: "R", img: ({ gameKey }) => baseSprite(gameKey, "0201-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-r"), },
				{ name: "S", img: ({ gameKey }) => baseSprite(gameKey, "0201-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-s"), },
				{ name: "T", img: ({ gameKey }) => baseSprite(gameKey, "0201-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-t"), },
				{ name: "U", img: ({ gameKey }) => baseSprite(gameKey, "0201-u"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-u"), },
				{ name: "V", img: ({ gameKey }) => baseSprite(gameKey, "0201-v"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-v"), },
				{ name: "W", img: ({ gameKey }) => baseSprite(gameKey, "0201-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-w"), },
				{ name: "X", img: ({ gameKey }) => baseSprite(gameKey, "0201-x"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-x"), },
				{ name: "Y", img: ({ gameKey }) => baseSprite(gameKey, "0201-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-y"), },
				{ name: "Z", img: ({ gameKey }) => baseSprite(gameKey, "0201-z"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-z"), },
				{ name: "!", img: ({ gameKey }) => baseSprite(gameKey, "0201-em"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-em"), },
				{ name: "?", img: ({ gameKey }) => baseSprite(gameKey, "0201-qm"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-qm"), },]
		},
		{ id: 115, natiId: 447, name: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447), imgS: ({ gameKey }) => shinySprite(gameKey, 447) },
		{ id: 116, natiId: 448, name: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), imgS: ({ gameKey }) => shinySprite(gameKey, 448) },
		{
			id: 117, natiId: 194, name: "Wooper", img: ({ gameKey }) => baseSprite(gameKey, 194), imgS: ({ gameKey }) => shinySprite(gameKey, 194), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 194), imgS: ({ gameKey }) => shinySprite(gameKey, 194), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0194-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0194-f"), },
			]
		},
		{
			id: 118, natiId: 195, name: "Quagsire", img: ({ gameKey }) => baseSprite(gameKey, 195), imgS: ({ gameKey }) => shinySprite(gameKey, 195), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 195), imgS: ({ gameKey }) => shinySprite(gameKey, 195), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0195-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0195-f"), },
			]
		},
		{ id: 119, natiId: 278, name: "Wingull", img: ({ gameKey }) => baseSprite(gameKey, 278), imgS: ({ gameKey }) => shinySprite(gameKey, 278) },
		{ id: 120, natiId: 279, name: "Pelipper", img: ({ gameKey }) => baseSprite(gameKey, 279), imgS: ({ gameKey }) => shinySprite(gameKey, 279) },
		{
			id: 121, natiId: 203, name: "Girafarig", img: ({ gameKey }) => baseSprite(gameKey, 203), imgS: ({ gameKey }) => shinySprite(gameKey, 203), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 203), imgS: ({ gameKey }) => shinySprite(gameKey, 203), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0203-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0203-f"), },
			]
		},
		{
			id: 122, natiId: 449, name: "Hippopotas", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0449-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0449-f"), },
			]
		},
		{
			id: 123, natiId: 450, name: "Hippowdon", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0450-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0450-f"), },
			]
		},
		{ id: 124, natiId: 298, name: "Azurill", img: ({ gameKey }) => baseSprite(gameKey, 298), imgS: ({ gameKey }) => shinySprite(gameKey, 298) },
		{ id: 125, natiId: 183, name: "Marill", img: ({ gameKey }) => baseSprite(gameKey, 183), imgS: ({ gameKey }) => shinySprite(gameKey, 183) },
		{ id: 126, natiId: 184, name: "Azumarill", img: ({ gameKey }) => baseSprite(gameKey, 184), imgS: ({ gameKey }) => shinySprite(gameKey, 184) },
		{ id: 127, natiId: 451, name: "Skorupi", img: ({ gameKey }) => baseSprite(gameKey, 451), imgS: ({ gameKey }) => shinySprite(gameKey, 451) },
		{ id: 128, natiId: 452, name: "Drapion", img: ({ gameKey }) => baseSprite(gameKey, 452), imgS: ({ gameKey }) => shinySprite(gameKey, 452) },
		{
			id: 129, natiId: 453, name: "Croagunk", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0453-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0453-f"), },
			]
		},
		{
			id: 130, natiId: 454, name: "Toxicroak", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0454-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0454-f"), },
			]
		},
		{ id: 131, natiId: 455, name: "Carnivine", img: ({ gameKey }) => baseSprite(gameKey, 455), imgS: ({ gameKey }) => shinySprite(gameKey, 455) },
		{ id: 132, natiId: 223, name: "Remoraid", img: ({ gameKey }) => baseSprite(gameKey, 223), imgS: ({ gameKey }) => shinySprite(gameKey, 223) },
		{
			id: 133, natiId: 224, name: "Octillery", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0224-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0224-f"), },
			]
		},
		{
			id: 134, natiId: 456, name: "Finneon", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0456-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0456-f"), },
			]
		},
		{
			id: 135, natiId: 457, name: "Lumineon", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0457-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0457-f"), },
			]
		},
		{ id: 136, natiId: 72, name: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72), imgS: ({ gameKey }) => shinySprite(gameKey, 72) },
		{ id: 137, natiId: 73, name: "Tentacruel", img: ({ gameKey }) => baseSprite(gameKey, 73), imgS: ({ gameKey }) => shinySprite(gameKey, 73) },
		{ id: 138, natiId: 349, name: "Feebas", img: ({ gameKey }) => baseSprite(gameKey, 349), imgS: ({ gameKey }) => shinySprite(gameKey, 349) },
		{
			id: 139, natiId: 350, name: "Milotic", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 350), imgS: ({ gameKey }) => shinySprite(gameKey, 350), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0350-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0350-f"), },
			]
		},
		{ id: 140, natiId: 458, name: "Mantyke", img: ({ gameKey }) => baseSprite(gameKey, 458), imgS: ({ gameKey }) => shinySprite(gameKey, 458) },
		{ id: 141, natiId: 226, name: "Mantine", img: ({ gameKey }) => baseSprite(gameKey, 226), imgS: ({ gameKey }) => shinySprite(gameKey, 226) },
		{
			id: 142, natiId: 459, name: "Snover", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0459-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0459-f"), },
			]
		},
		{
			id: 143, natiId: 460, name: "Abomasnow", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0460-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0460-f"), },
			]
		},
		{
			id: 144, natiId: 215, name: "Sneasel", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-f"), },
			]
		},
		{
			id: 145, natiId: 461, name: "Weavile", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0461-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0461-f"), },
			]
		},
		{ id: 146, natiId: 480, name: "Uxie", img: ({ gameKey }) => baseSprite(gameKey, 480), imgS: ({ gameKey }) => shinySprite(gameKey, 480), tags: ["legendary"] },
		{ id: 147, natiId: 481, name: "Mesprit", img: ({ gameKey }) => baseSprite(gameKey, 481), imgS: ({ gameKey }) => shinySprite(gameKey, 481), tags: ["legendary"] },
		{ id: 148, natiId: 482, name: "Azelf", img: ({ gameKey }) => baseSprite(gameKey, 482), imgS: ({ gameKey }) => shinySprite(gameKey, 482), tags: ["legendary"] },
		{ id: 149, natiId: 483, name: "Dialga", img: ({ gameKey }) => baseSprite(gameKey, 483), imgS: ({ gameKey }) => shinySprite(gameKey, 483), tags: ["legendary"] },
		{ id: 150, natiId: 484, name: "Palkia", img: ({ gameKey }) => baseSprite(gameKey, 484), imgS: ({ gameKey }) => shinySprite(gameKey, 484), tags: ["legendary"] },
		{ id: 151, natiId: 490, name: "Manaphy", img: ({ gameKey }) => baseSprite(gameKey, 490), imgS: ({ gameKey }) => shinySprite(gameKey, 490), tags: ["mythical"] }
	];

	window._registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();