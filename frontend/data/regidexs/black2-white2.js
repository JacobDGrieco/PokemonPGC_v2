(() => {
	const gen = 5;
	const GAME_KEYS = ["black2", "white2"];
	const DEX_NAME = "Unova Dex";

	const baseSprite = (gameKey, natiId) => window.dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => window.dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 0, natiId: 494, name: "Victini", img: ({ gameKey }) => baseSprite(gameKey, 494), imgS: ({ gameKey }) => shinySprite(gameKey, 494), maxStatus: "caught", tags: ["mythical"] },
		{ id: 1, natiId: 495, name: "Snivy", img: ({ gameKey }) => baseSprite(gameKey, 495), imgS: ({ gameKey }) => shinySprite(gameKey, 495) },
		{ id: 2, natiId: 496, name: "Servine", img: ({ gameKey }) => baseSprite(gameKey, 496), imgS: ({ gameKey }) => shinySprite(gameKey, 496) },
		{ id: 3, natiId: 497, name: "Serperior", img: ({ gameKey }) => baseSprite(gameKey, 497), imgS: ({ gameKey }) => shinySprite(gameKey, 497) },
		{ id: 4, natiId: 498, name: "Tepig", img: ({ gameKey }) => baseSprite(gameKey, 498), imgS: ({ gameKey }) => shinySprite(gameKey, 498) },
		{ id: 5, natiId: 499, name: "Pignite", img: ({ gameKey }) => baseSprite(gameKey, 499), imgS: ({ gameKey }) => shinySprite(gameKey, 499) },
		{ id: 6, natiId: 500, name: "Emboar", img: ({ gameKey }) => baseSprite(gameKey, 500), imgS: ({ gameKey }) => shinySprite(gameKey, 500) },
		{ id: 7, natiId: 501, name: "Oshawott", img: ({ gameKey }) => baseSprite(gameKey, 501), imgS: ({ gameKey }) => shinySprite(gameKey, 501) },
		{ id: 8, natiId: 502, name: "Dewott", img: ({ gameKey }) => baseSprite(gameKey, 502), imgS: ({ gameKey }) => shinySprite(gameKey, 502) },
		{ id: 9, natiId: 503, name: "Samurott", img: ({ gameKey }) => baseSprite(gameKey, 503), imgS: ({ gameKey }) => shinySprite(gameKey, 503) },
		{ id: 10, natiId: 504, name: "Patrat", img: ({ gameKey }) => baseSprite(gameKey, 504), imgS: ({ gameKey }) => shinySprite(gameKey, 504) },
		{ id: 11, natiId: 505, name: "Watchog", img: ({ gameKey }) => baseSprite(gameKey, 505), imgS: ({ gameKey }) => shinySprite(gameKey, 505) },
		{ id: 12, natiId: 509, name: "Purrloin", img: ({ gameKey }) => baseSprite(gameKey, 509), imgS: ({ gameKey }) => shinySprite(gameKey, 509) },
		{ id: 13, natiId: 510, name: "Liepard", img: ({ gameKey }) => baseSprite(gameKey, 510), imgS: ({ gameKey }) => shinySprite(gameKey, 510) },
		{ id: 14, natiId: 519, name: "Pidove", img: ({ gameKey }) => baseSprite(gameKey, 519), imgS: ({ gameKey }) => shinySprite(gameKey, 519) },
		{ id: 15, natiId: 520, name: "Tranquill", img: ({ gameKey }) => baseSprite(gameKey, 520), imgS: ({ gameKey }) => shinySprite(gameKey, 520) },
		{
			id: 16, natiId: 521, name: "Unfezant", img: ({ gameKey }) => baseSprite(gameKey, 521), imgS: ({ gameKey }) => shinySprite(gameKey, 521), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 521), imgS: ({ gameKey }) => shinySprite(gameKey, 521), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0521-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0521-f"), },
			]
		},
		{ id: 17, natiId: 540, name: "Sewaddle", img: ({ gameKey }) => baseSprite(gameKey, 540), imgS: ({ gameKey }) => shinySprite(gameKey, 540) },
		{ id: 18, natiId: 541, name: "Swadloon", img: ({ gameKey }) => baseSprite(gameKey, 541), imgS: ({ gameKey }) => shinySprite(gameKey, 541) },
		{ id: 19, natiId: 542, name: "Leavanny", img: ({ gameKey }) => baseSprite(gameKey, 542), imgS: ({ gameKey }) => shinySprite(gameKey, 542) },
		{ id: 20, natiId: 191, name: "Sunkern", img: ({ gameKey }) => baseSprite(gameKey, 191), imgS: ({ gameKey }) => shinySprite(gameKey, 191) },
		{ id: 21, natiId: 192, name: "Sunflora", img: ({ gameKey }) => baseSprite(gameKey, 192), imgS: ({ gameKey }) => shinySprite(gameKey, 192) },
		{ id: 22, natiId: 506, name: "Lillipup", img: ({ gameKey }) => baseSprite(gameKey, 506), imgS: ({ gameKey }) => shinySprite(gameKey, 506) },
		{ id: 23, natiId: 507, name: "Herdier", img: ({ gameKey }) => baseSprite(gameKey, 507), imgS: ({ gameKey }) => shinySprite(gameKey, 507) },
		{ id: 24, natiId: 508, name: "Stoutland", img: ({ gameKey }) => baseSprite(gameKey, 508), imgS: ({ gameKey }) => shinySprite(gameKey, 508) },
		{ id: 25, natiId: 179, name: "Mareep", img: ({ gameKey }) => baseSprite(gameKey, 179), imgS: ({ gameKey }) => shinySprite(gameKey, 179) },
		{ id: 26, natiId: 180, name: "Flaaffy", img: ({ gameKey }) => baseSprite(gameKey, 180), imgS: ({ gameKey }) => shinySprite(gameKey, 180) },
		{ id: 27, natiId: 181, name: "Ampharos", img: ({ gameKey }) => baseSprite(gameKey, 181), imgS: ({ gameKey }) => shinySprite(gameKey, 181) },
		{ id: 28, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54) },
		{ id: 29, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55) },
		{ id: 30, natiId: 298, name: "Azurill", img: ({ gameKey }) => baseSprite(gameKey, 298), imgS: ({ gameKey }) => shinySprite(gameKey, 298) },
		{ id: 31, natiId: 183, name: "Marill", img: ({ gameKey }) => baseSprite(gameKey, 183), imgS: ({ gameKey }) => shinySprite(gameKey, 183) },
		{ id: 32, natiId: 184, name: "Azumarill", img: ({ gameKey }) => baseSprite(gameKey, 184), imgS: ({ gameKey }) => shinySprite(gameKey, 184) },
		{ id: 33, natiId: 447, name: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447), imgS: ({ gameKey }) => shinySprite(gameKey, 447) },
		{ id: 34, natiId: 448, name: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), imgS: ({ gameKey }) => shinySprite(gameKey, 448) },
		{ id: 35, natiId: 206, name: "Dunsparce", img: ({ gameKey }) => baseSprite(gameKey, 206), imgS: ({ gameKey }) => shinySprite(gameKey, 206) },
		{ id: 36, natiId: 531, name: "Audino", img: ({ gameKey }) => baseSprite(gameKey, 531), imgS: ({ gameKey }) => shinySprite(gameKey, 531) },
		{ id: 37, natiId: 511, name: "Pansage", img: ({ gameKey }) => baseSprite(gameKey, 511), imgS: ({ gameKey }) => shinySprite(gameKey, 511) },
		{ id: 38, natiId: 512, name: "Simisage", img: ({ gameKey }) => baseSprite(gameKey, 512), imgS: ({ gameKey }) => shinySprite(gameKey, 512) },
		{ id: 39, natiId: 513, name: "Pansear", img: ({ gameKey }) => baseSprite(gameKey, 513), imgS: ({ gameKey }) => shinySprite(gameKey, 513) },
		{ id: 40, natiId: 514, name: "Simisear", img: ({ gameKey }) => baseSprite(gameKey, 514), imgS: ({ gameKey }) => shinySprite(gameKey, 514) },
		{ id: 41, natiId: 515, name: "Panpour", img: ({ gameKey }) => baseSprite(gameKey, 515), imgS: ({ gameKey }) => shinySprite(gameKey, 515) },
		{ id: 42, natiId: 516, name: "Simipour", img: ({ gameKey }) => baseSprite(gameKey, 516), imgS: ({ gameKey }) => shinySprite(gameKey, 516) },
		{ id: 43, natiId: 543, name: "Venipede", img: ({ gameKey }) => baseSprite(gameKey, 543), imgS: ({ gameKey }) => shinySprite(gameKey, 543) },
		{ id: 44, natiId: 544, name: "Whirlipede", img: ({ gameKey }) => baseSprite(gameKey, 544), imgS: ({ gameKey }) => shinySprite(gameKey, 544) },
		{ id: 45, natiId: 545, name: "Scolipede", img: ({ gameKey }) => baseSprite(gameKey, 545), imgS: ({ gameKey }) => shinySprite(gameKey, 545) },
		{ id: 46, natiId: 109, name: "Koffing", img: ({ gameKey }) => baseSprite(gameKey, 109), imgS: ({ gameKey }) => shinySprite(gameKey, 109) },
		{ id: 47, natiId: 110, name: "Weezing", img: ({ gameKey }) => baseSprite(gameKey, 110), imgS: ({ gameKey }) => shinySprite(gameKey, 110) },
		{ id: 48, natiId: 81, name: "Magnemite", img: ({ gameKey }) => baseSprite(gameKey, 81), imgS: ({ gameKey }) => shinySprite(gameKey, 81) },
		{ id: 49, natiId: 82, name: "Magneton", img: ({ gameKey }) => baseSprite(gameKey, 82), imgS: ({ gameKey }) => shinySprite(gameKey, 82) },
		{ id: 50, natiId: 462, name: "Magnezone", img: ({ gameKey }) => baseSprite(gameKey, 462), imgS: ({ gameKey }) => shinySprite(gameKey, 462) },
		{ id: 51, natiId: 58, name: "Growlithe", img: ({ gameKey }) => baseSprite(gameKey, 58), imgS: ({ gameKey }) => shinySprite(gameKey, 58) },
		{ id: 52, natiId: 59, name: "Arcanine", img: ({ gameKey }) => baseSprite(gameKey, 59), imgS: ({ gameKey }) => shinySprite(gameKey, 59) },
		{ id: 53, natiId: 240, name: "Magby", img: ({ gameKey }) => baseSprite(gameKey, 240), imgS: ({ gameKey }) => shinySprite(gameKey, 240) },
		{ id: 54, natiId: 126, name: "Magmar", img: ({ gameKey }) => baseSprite(gameKey, 126), imgS: ({ gameKey }) => shinySprite(gameKey, 126) },
		{ id: 55, natiId: 467, name: "Magmortar", img: ({ gameKey }) => baseSprite(gameKey, 467), imgS: ({ gameKey }) => shinySprite(gameKey, 467) },
		{ id: 56, natiId: 239, name: "Elekid", img: ({ gameKey }) => baseSprite(gameKey, 239), imgS: ({ gameKey }) => shinySprite(gameKey, 239) },
		{ id: 57, natiId: 125, name: "Electabuzz", img: ({ gameKey }) => baseSprite(gameKey, 125), imgS: ({ gameKey }) => shinySprite(gameKey, 125) },
		{ id: 58, natiId: 466, name: "Electivire", img: ({ gameKey }) => baseSprite(gameKey, 466), imgS: ({ gameKey }) => shinySprite(gameKey, 466) },
		{
			id: 59, natiId: 19, name: "Rattata", img: ({ gameKey }) => baseSprite(gameKey, 19), imgS: ({ gameKey }) => shinySprite(gameKey, 19), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 19), imgS: ({ gameKey }) => shinySprite(gameKey, 19), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0019-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0019-f"), },
			]
		},
		{
			id: 60, natiId: 20, name: "Raticate", img: ({ gameKey }) => baseSprite(gameKey, 20), imgS: ({ gameKey }) => shinySprite(gameKey, 20), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 20), imgS: ({ gameKey }) => shinySprite(gameKey, 20), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0020-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0020-f"), },
			]
		},
		{
			id: 61, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), },
			]
		},
		{
			id: 62, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), },
			]
		},
		{ id: 63, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169) },
		{ id: 64, natiId: 88, name: "Grimer", img: ({ gameKey }) => baseSprite(gameKey, 88), imgS: ({ gameKey }) => shinySprite(gameKey, 88) },
		{ id: 65, natiId: 89, name: "Muk", img: ({ gameKey }) => baseSprite(gameKey, 89), imgS: ({ gameKey }) => shinySprite(gameKey, 89) },
		{ id: 66, natiId: 527, name: "Woobat", img: ({ gameKey }) => baseSprite(gameKey, 527), imgS: ({ gameKey }) => shinySprite(gameKey, 527) },
		{ id: 67, natiId: 528, name: "Swoobat", img: ({ gameKey }) => baseSprite(gameKey, 528), imgS: ({ gameKey }) => shinySprite(gameKey, 528) },
		{ id: 68, natiId: 524, name: "Roggenrola", img: ({ gameKey }) => baseSprite(gameKey, 524), imgS: ({ gameKey }) => shinySprite(gameKey, 524) },
		{ id: 69, natiId: 525, name: "Boldore", img: ({ gameKey }) => baseSprite(gameKey, 525), imgS: ({ gameKey }) => shinySprite(gameKey, 525) },
		{ id: 70, natiId: 526, name: "Gigalith", img: ({ gameKey }) => baseSprite(gameKey, 526), imgS: ({ gameKey }) => shinySprite(gameKey, 526) },
		{ id: 71, natiId: 95, name: "Onix", img: ({ gameKey }) => baseSprite(gameKey, 95), imgS: ({ gameKey }) => shinySprite(gameKey, 95) },
		{
			id: 72, natiId: 208, name: "Steelix", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0208-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0208-f"), },
			]
		},
		{ id: 73, natiId: 532, name: "Timburr", img: ({ gameKey }) => baseSprite(gameKey, 532), imgS: ({ gameKey }) => shinySprite(gameKey, 532) },
		{ id: 74, natiId: 533, name: "Gurdurr", img: ({ gameKey }) => baseSprite(gameKey, 533), imgS: ({ gameKey }) => shinySprite(gameKey, 533) },
		{ id: 75, natiId: 534, name: "Conkeldurr", img: ({ gameKey }) => baseSprite(gameKey, 534), imgS: ({ gameKey }) => shinySprite(gameKey, 534) },
		{ id: 76, natiId: 529, name: "Drilbur", img: ({ gameKey }) => baseSprite(gameKey, 529), imgS: ({ gameKey }) => shinySprite(gameKey, 529) },
		{ id: 77, natiId: 530, name: "Excadrill", img: ({ gameKey }) => baseSprite(gameKey, 530), imgS: ({ gameKey }) => shinySprite(gameKey, 530) },
		{ id: 78, natiId: 300, name: "Skitty", img: ({ gameKey }) => baseSprite(gameKey, 300), imgS: ({ gameKey }) => shinySprite(gameKey, 300) },
		{ id: 79, natiId: 301, name: "Delcatty", img: ({ gameKey }) => baseSprite(gameKey, 301), imgS: ({ gameKey }) => shinySprite(gameKey, 301) },
		{ id: 80, natiId: 427, name: "Buneary", img: ({ gameKey }) => baseSprite(gameKey, 427), imgS: ({ gameKey }) => shinySprite(gameKey, 427) },
		{ id: 81, natiId: 428, name: "Lopunny", img: ({ gameKey }) => baseSprite(gameKey, 428), imgS: ({ gameKey }) => shinySprite(gameKey, 428) },
		{ id: 82, natiId: 546, name: "Cottonee", img: ({ gameKey }) => baseSprite(gameKey, 546), imgS: ({ gameKey }) => shinySprite(gameKey, 546) },
		{ id: 83, natiId: 547, name: "Whimsicott", img: ({ gameKey }) => baseSprite(gameKey, 547), imgS: ({ gameKey }) => shinySprite(gameKey, 547) },
		{ id: 84, natiId: 548, name: "Petilil", img: ({ gameKey }) => baseSprite(gameKey, 548), imgS: ({ gameKey }) => shinySprite(gameKey, 548) },
		{ id: 85, natiId: 549, name: "Lilligant", img: ({ gameKey }) => baseSprite(gameKey, 549), imgS: ({ gameKey }) => shinySprite(gameKey, 549) },
		{ id: 86, natiId: 517, name: "Munna", img: ({ gameKey }) => baseSprite(gameKey, 517), imgS: ({ gameKey }) => shinySprite(gameKey, 517) },
		{ id: 87, natiId: 518, name: "Musharna", img: ({ gameKey }) => baseSprite(gameKey, 518), imgS: ({ gameKey }) => shinySprite(gameKey, 518) },
		{ id: 88, natiId: 173, name: "Cleffa", img: ({ gameKey }) => baseSprite(gameKey, 173), imgS: ({ gameKey }) => shinySprite(gameKey, 173) },
		{ id: 89, natiId: 35, name: "Clefairy", img: ({ gameKey }) => baseSprite(gameKey, 35), imgS: ({ gameKey }) => shinySprite(gameKey, 35) },
		{ id: 90, natiId: 36, name: "Clefable", img: ({ gameKey }) => baseSprite(gameKey, 36), imgS: ({ gameKey }) => shinySprite(gameKey, 36) },
		{ id: 91, natiId: 133, name: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133) },
		{ id: 92, natiId: 134, name: "Vaporeon", img: ({ gameKey }) => baseSprite(gameKey, 134), imgS: ({ gameKey }) => shinySprite(gameKey, 134) },
		{ id: 93, natiId: 135, name: "Jolteon", img: ({ gameKey }) => baseSprite(gameKey, 135), imgS: ({ gameKey }) => shinySprite(gameKey, 135) },
		{ id: 94, natiId: 136, name: "Flareon", img: ({ gameKey }) => baseSprite(gameKey, 136), imgS: ({ gameKey }) => shinySprite(gameKey, 136) },
		{ id: 95, natiId: 196, name: "Espeon", img: ({ gameKey }) => baseSprite(gameKey, 196), imgS: ({ gameKey }) => shinySprite(gameKey, 196) },
		{ id: 96, natiId: 197, name: "Umbreon", img: ({ gameKey }) => baseSprite(gameKey, 197), imgS: ({ gameKey }) => shinySprite(gameKey, 197) },
		{ id: 97, natiId: 470, name: "Leafeon", img: ({ gameKey }) => baseSprite(gameKey, 470), imgS: ({ gameKey }) => shinySprite(gameKey, 470) },
		{ id: 98, natiId: 471, name: "Glaceon", img: ({ gameKey }) => baseSprite(gameKey, 471), imgS: ({ gameKey }) => shinySprite(gameKey, 471) },
		{ id: 99, natiId: 551, name: "Sandile", img: ({ gameKey }) => baseSprite(gameKey, 551), imgS: ({ gameKey }) => shinySprite(gameKey, 551) },
		{ id: 100, natiId: 552, name: "Krokorok", img: ({ gameKey }) => baseSprite(gameKey, 552), imgS: ({ gameKey }) => shinySprite(gameKey, 552) },
		{ id: 101, natiId: 553, name: "Krookodile", img: ({ gameKey }) => baseSprite(gameKey, 553), imgS: ({ gameKey }) => shinySprite(gameKey, 553) },
		{ id: 102, natiId: 554, name: "Darumaka", img: ({ gameKey }) => baseSprite(gameKey, 554), imgS: ({ gameKey }) => shinySprite(gameKey, 554) },
		{ id: 103, natiId: 555, name: "Darmanitan", img: ({ gameKey }) => baseSprite(gameKey, 555), imgS: ({ gameKey }) => shinySprite(gameKey, 555) },
		{
			id: 104, natiId: 550, name: "Basculin", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), forms: [
				{ name: "Blue-Striped", img: ({ gameKey }) => baseSprite(gameKey, 550), imgS: ({ gameKey }) => shinySprite(gameKey, 550), },
				{ name: "Red-Striped", img: ({ gameKey }) => baseSprite(gameKey, "0550-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0550-r"), },
			]
		},
		{ id: 105, natiId: 568, name: "Trubbish", img: ({ gameKey }) => baseSprite(gameKey, 568), imgS: ({ gameKey }) => shinySprite(gameKey, 568) },
		{ id: 106, natiId: 569, name: "Garbodor", img: ({ gameKey }) => baseSprite(gameKey, 569), imgS: ({ gameKey }) => shinySprite(gameKey, 569) },
		{ id: 107, natiId: 572, name: "Minccino", img: ({ gameKey }) => baseSprite(gameKey, 572), imgS: ({ gameKey }) => shinySprite(gameKey, 572) },
		{ id: 108, natiId: 573, name: "Cinccino", img: ({ gameKey }) => baseSprite(gameKey, 573), imgS: ({ gameKey }) => shinySprite(gameKey, 573) },
		{ id: 109, natiId: 627, name: "Rufflet", img: ({ gameKey }) => baseSprite(gameKey, 627), imgS: ({ gameKey }) => shinySprite(gameKey, 627) },
		{ id: 110, natiId: 628, name: "Braviary", img: ({ gameKey }) => baseSprite(gameKey, 628), imgS: ({ gameKey }) => shinySprite(gameKey, 628) },
		{ id: 111, natiId: 629, name: "Vullaby", img: ({ gameKey }) => baseSprite(gameKey, 629), imgS: ({ gameKey }) => shinySprite(gameKey, 629) },
		{ id: 112, natiId: 630, name: "Mandibuzz", img: ({ gameKey }) => baseSprite(gameKey, 630), imgS: ({ gameKey }) => shinySprite(gameKey, 630) },
		{ id: 113, natiId: 27, name: "Sandshrew", img: ({ gameKey }) => baseSprite(gameKey, 27), imgS: ({ gameKey }) => shinySprite(gameKey, 27) },
		{ id: 114, natiId: 28, name: "Sandslash", img: ({ gameKey }) => baseSprite(gameKey, 28), imgS: ({ gameKey }) => shinySprite(gameKey, 28) },
		{ id: 115, natiId: 557, name: "Dwebble", img: ({ gameKey }) => baseSprite(gameKey, 557), imgS: ({ gameKey }) => shinySprite(gameKey, 557) },
		{ id: 116, natiId: 558, name: "Crustle", img: ({ gameKey }) => baseSprite(gameKey, 558), imgS: ({ gameKey }) => shinySprite(gameKey, 558) },
		{ id: 117, natiId: 559, name: "Scraggy", img: ({ gameKey }) => baseSprite(gameKey, 559), imgS: ({ gameKey }) => shinySprite(gameKey, 559) },
		{ id: 118, natiId: 560, name: "Scrafty", img: ({ gameKey }) => baseSprite(gameKey, 560), imgS: ({ gameKey }) => shinySprite(gameKey, 560) },
		{ id: 119, natiId: 556, name: "Maractus", img: ({ gameKey }) => baseSprite(gameKey, 556), imgS: ({ gameKey }) => shinySprite(gameKey, 556) },
		{ id: 120, natiId: 561, name: "Sigilyph", img: ({ gameKey }) => baseSprite(gameKey, 561), imgS: ({ gameKey }) => shinySprite(gameKey, 561) },
		{ id: 121, natiId: 328, name: "Trapinch", img: ({ gameKey }) => baseSprite(gameKey, 328), imgS: ({ gameKey }) => shinySprite(gameKey, 328) },
		{ id: 122, natiId: 329, name: "Vibrava", img: ({ gameKey }) => baseSprite(gameKey, 329), imgS: ({ gameKey }) => shinySprite(gameKey, 329) },
		{ id: 123, natiId: 330, name: "Flygon", img: ({ gameKey }) => baseSprite(gameKey, 330), imgS: ({ gameKey }) => shinySprite(gameKey, 330) },
		{ id: 124, natiId: 562, name: "Yamask", img: ({ gameKey }) => baseSprite(gameKey, 562), imgS: ({ gameKey }) => shinySprite(gameKey, 562) },
		{ id: 125, natiId: 563, name: "Cofagrigus", img: ({ gameKey }) => baseSprite(gameKey, 563), imgS: ({ gameKey }) => shinySprite(gameKey, 563) },
		{ id: 126, natiId: 564, name: "Tirtouga", img: ({ gameKey }) => baseSprite(gameKey, 564), imgS: ({ gameKey }) => shinySprite(gameKey, 564) },
		{ id: 127, natiId: 565, name: "Carracosta", img: ({ gameKey }) => baseSprite(gameKey, 565), imgS: ({ gameKey }) => shinySprite(gameKey, 565) },
		{ id: 128, natiId: 566, name: "Archen", img: ({ gameKey }) => baseSprite(gameKey, 566), imgS: ({ gameKey }) => shinySprite(gameKey, 566) },
		{ id: 129, natiId: 567, name: "Archeops", img: ({ gameKey }) => baseSprite(gameKey, 567), imgS: ({ gameKey }) => shinySprite(gameKey, 567) },
		{ id: 130, natiId: 599, name: "Klink", img: ({ gameKey }) => baseSprite(gameKey, 599), imgS: ({ gameKey }) => shinySprite(gameKey, 599) },
		{ id: 131, natiId: 600, name: "Klang", img: ({ gameKey }) => baseSprite(gameKey, 600), imgS: ({ gameKey }) => shinySprite(gameKey, 600) },
		{ id: 132, natiId: 601, name: "Klinklang", img: ({ gameKey }) => baseSprite(gameKey, 601), imgS: ({ gameKey }) => shinySprite(gameKey, 601) },
		{ id: 133, natiId: 406, name: "Budew", img: ({ gameKey }) => baseSprite(gameKey, 406), imgS: ({ gameKey }) => shinySprite(gameKey, 406) },
		{
			id: 134, natiId: 315, name: "Roselia", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0315-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0315-f"), },
			]
		},
		{
			id: 135, natiId: 407, name: "Roserade", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0407-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0407-f"), },
			]
		},
		{ id: 136, natiId: 574, name: "Gothita", img: ({ gameKey }) => baseSprite(gameKey, 574), imgS: ({ gameKey }) => shinySprite(gameKey, 574) },
		{ id: 137, natiId: 575, name: "Gothorita", img: ({ gameKey }) => baseSprite(gameKey, 575), imgS: ({ gameKey }) => shinySprite(gameKey, 575) },
		{ id: 138, natiId: 576, name: "Gothitelle", img: ({ gameKey }) => baseSprite(gameKey, 576), imgS: ({ gameKey }) => shinySprite(gameKey, 576) },
		{ id: 139, natiId: 577, name: "Solosis", img: ({ gameKey }) => baseSprite(gameKey, 577), imgS: ({ gameKey }) => shinySprite(gameKey, 577) },
		{ id: 140, natiId: 578, name: "Duosion", img: ({ gameKey }) => baseSprite(gameKey, 578), imgS: ({ gameKey }) => shinySprite(gameKey, 578) },
		{ id: 141, natiId: 579, name: "Reuniclus", img: ({ gameKey }) => baseSprite(gameKey, 579), imgS: ({ gameKey }) => shinySprite(gameKey, 579) },
		{
			id: 142, natiId: 415, name: "Combee", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0415-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0415-f"), },
			]
		},
		{ id: 143, natiId: 416, name: "Vespiquen", img: ({ gameKey }) => baseSprite(gameKey, 416), imgS: ({ gameKey }) => shinySprite(gameKey, 416) },
		{ id: 144, natiId: 587, name: "Emolga", img: ({ gameKey }) => baseSprite(gameKey, 587), imgS: ({ gameKey }) => shinySprite(gameKey, 587) },
		{
			id: 145, natiId: 214, name: "Heracross", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0214-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0214-f"), },
			]
		},
		{ id: 146, natiId: 127, name: "Pinsir", img: ({ gameKey }) => baseSprite(gameKey, 127), imgS: ({ gameKey }) => shinySprite(gameKey, 127) },
		{ id: 147, natiId: 522, name: "Blitzle", img: ({ gameKey }) => baseSprite(gameKey, 522), imgS: ({ gameKey }) => shinySprite(gameKey, 522) },
		{ id: 148, natiId: 523, name: "Zebstrika", img: ({ gameKey }) => baseSprite(gameKey, 523), imgS: ({ gameKey }) => shinySprite(gameKey, 523) },
		{
			id: 149, natiId: 418, name: "Buizel", img: ({ gameKey }) => baseSprite(gameKey, 418), imgS: ({ gameKey }) => shinySprite(gameKey, 418), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 418), imgS: ({ gameKey }) => shinySprite(gameKey, 418), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0418-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0418-f"), },
			]
		},
		{
			id: 150, natiId: 419, name: "Floatzel", img: ({ gameKey }) => baseSprite(gameKey, 419), imgS: ({ gameKey }) => shinySprite(gameKey, 419), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 419), imgS: ({ gameKey }) => shinySprite(gameKey, 419), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0419-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0419-f"), },
			]
		},
		{ id: 151, natiId: 570, name: "Zorua", img: ({ gameKey }) => baseSprite(gameKey, 570), imgS: ({ gameKey }) => shinySprite(gameKey, 570) },
		{ id: 152, natiId: 571, name: "Zoroark", img: ({ gameKey }) => baseSprite(gameKey, 571), imgS: ({ gameKey }) => shinySprite(gameKey, 571) },
		{ id: 153, natiId: 580, name: "Ducklett", img: ({ gameKey }) => baseSprite(gameKey, 580), imgS: ({ gameKey }) => shinySprite(gameKey, 580) },
		{ id: 154, natiId: 581, name: "Swanna", img: ({ gameKey }) => baseSprite(gameKey, 581), imgS: ({ gameKey }) => shinySprite(gameKey, 581) },
		{ id: 155, natiId: 588, name: "Karrablast", img: ({ gameKey }) => baseSprite(gameKey, 588), imgS: ({ gameKey }) => shinySprite(gameKey, 588) },
		{ id: 156, natiId: 589, name: "Escavalier", img: ({ gameKey }) => baseSprite(gameKey, 589), imgS: ({ gameKey }) => shinySprite(gameKey, 589) },
		{ id: 157, natiId: 616, name: "Shelmet", img: ({ gameKey }) => baseSprite(gameKey, 616), imgS: ({ gameKey }) => shinySprite(gameKey, 616) },
		{ id: 158, natiId: 617, name: "Accelgor", img: ({ gameKey }) => baseSprite(gameKey, 617), imgS: ({ gameKey }) => shinySprite(gameKey, 617) },
		{
			id: 159, natiId: 585, name: "Deerling", img: ({ gameKey }) => baseSprite(gameKey, 585), imgS: ({ gameKey }) => shinySprite(gameKey, 585), forms: [
				{ name: "Autumn", img: ({ gameKey }) => baseSprite(gameKey, 585), imgS: ({ gameKey }) => shinySprite(gameKey, 585), },
				{ name: "Spring", img: ({ gameKey }) => baseSprite(gameKey, "0585-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0585-s"), },
				{ name: "Summer", img: ({ gameKey }) => baseSprite(gameKey, "0585-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0585-s"), },
				{ name: "Winter", img: ({ gameKey }) => baseSprite(gameKey, "0585-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0585-w"), },
			]
		},
		{
			id: 160, natiId: 586, name: "Sawsbuck", img: ({ gameKey }) => baseSprite(gameKey, 586), imgS: ({ gameKey }) => shinySprite(gameKey, 586), forms: [
				{ name: "Autumn", img: ({ gameKey }) => baseSprite(gameKey, 586), imgS: ({ gameKey }) => shinySprite(gameKey, 586), },
				{ name: "Spring", img: ({ gameKey }) => baseSprite(gameKey, "0586-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0586-s"), },
				{ name: "Summer", img: ({ gameKey }) => baseSprite(gameKey, "0586-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0586-s"), },
				{ name: "Winter", img: ({ gameKey }) => baseSprite(gameKey, "0586-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0586-w"), },
			]
		},
		{ id: 161, natiId: 590, name: "Foongus", img: ({ gameKey }) => baseSprite(gameKey, 590), imgS: ({ gameKey }) => shinySprite(gameKey, 590) },
		{ id: 162, natiId: 591, name: "Amoonguss", img: ({ gameKey }) => baseSprite(gameKey, 591), imgS: ({ gameKey }) => shinySprite(gameKey, 591) },
		{
			id: 163, natiId: 351, name: "Castform", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 351), imgS: ({ gameKey }) => shinySprite(gameKey, 351), },
				{ name: "Rainy", img: ({ gameKey }) => baseSprite(gameKey, "0351-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-r"), },
				{ name: "Snowy", img: ({ gameKey }) => baseSprite(gameKey, "0351-i"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-i"), },
				{ name: "Sunny", img: ({ gameKey }) => baseSprite(gameKey, "0351-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0351-s"), },
			]
		},
		{ id: 164, natiId: 299, name: "Nosepass", img: ({ gameKey }) => baseSprite(gameKey, 299), imgS: ({ gameKey }) => shinySprite(gameKey, 299) },
		{ id: 165, natiId: 476, name: "Probopass", img: ({ gameKey }) => baseSprite(gameKey, 476), imgS: ({ gameKey }) => shinySprite(gameKey, 476) },
		{ id: 166, natiId: 304, name: "Aron", img: ({ gameKey }) => baseSprite(gameKey, 304), imgS: ({ gameKey }) => shinySprite(gameKey, 304) },
		{ id: 167, natiId: 305, name: "Lairon", img: ({ gameKey }) => baseSprite(gameKey, 305), imgS: ({ gameKey }) => shinySprite(gameKey, 305) },
		{ id: 168, natiId: 306, name: "Aggron", img: ({ gameKey }) => baseSprite(gameKey, 306), imgS: ({ gameKey }) => shinySprite(gameKey, 306) },
		{ id: 169, natiId: 343, name: "Baltoy", img: ({ gameKey }) => baseSprite(gameKey, 343), imgS: ({ gameKey }) => shinySprite(gameKey, 343) },
		{ id: 170, natiId: 344, name: "Claydol", img: ({ gameKey }) => baseSprite(gameKey, 344), imgS: ({ gameKey }) => shinySprite(gameKey, 344) },
		{ id: 171, natiId: 636, name: "Larvesta", img: ({ gameKey }) => baseSprite(gameKey, 636), imgS: ({ gameKey }) => shinySprite(gameKey, 636) },
		{ id: 172, natiId: 637, name: "Volcarona", img: ({ gameKey }) => baseSprite(gameKey, 637), imgS: ({ gameKey }) => shinySprite(gameKey, 637) },
		{ id: 173, natiId: 595, name: "Joltik", img: ({ gameKey }) => baseSprite(gameKey, 595), imgS: ({ gameKey }) => shinySprite(gameKey, 595) },
		{ id: 174, natiId: 596, name: "Galvantula", img: ({ gameKey }) => baseSprite(gameKey, 596), imgS: ({ gameKey }) => shinySprite(gameKey, 596) },
		{ id: 175, natiId: 597, name: "Ferroseed", img: ({ gameKey }) => baseSprite(gameKey, 597), imgS: ({ gameKey }) => shinySprite(gameKey, 597) },
		{ id: 176, natiId: 598, name: "Ferrothorn", img: ({ gameKey }) => baseSprite(gameKey, 598), imgS: ({ gameKey }) => shinySprite(gameKey, 598) },
		{ id: 177, natiId: 602, name: "Tynamo", img: ({ gameKey }) => baseSprite(gameKey, 602), imgS: ({ gameKey }) => shinySprite(gameKey, 602) },
		{ id: 178, natiId: 603, name: "Eelektrik", img: ({ gameKey }) => baseSprite(gameKey, 603), imgS: ({ gameKey }) => shinySprite(gameKey, 603) },
		{ id: 179, natiId: 604, name: "Eelektross", img: ({ gameKey }) => baseSprite(gameKey, 604), imgS: ({ gameKey }) => shinySprite(gameKey, 604) },
		{
			id: 180, natiId: 592, name: "Frillish", img: ({ gameKey }) => baseSprite(gameKey, 592), imgS: ({ gameKey }) => shinySprite(gameKey, 592), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 592), imgS: ({ gameKey }) => shinySprite(gameKey, 592), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0592-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0592-f"), },
			]
		},
		{
			id: 181, natiId: 593, name: "Jellicent", img: ({ gameKey }) => baseSprite(gameKey, 593), imgS: ({ gameKey }) => shinySprite(gameKey, 593), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 593), imgS: ({ gameKey }) => shinySprite(gameKey, 593), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0593-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0593-f"), },
			]
		},
		{ id: 182, natiId: 594, name: "Alomomola", img: ({ gameKey }) => baseSprite(gameKey, 594), imgS: ({ gameKey }) => shinySprite(gameKey, 594) },
		{ id: 183, natiId: 610, name: "Axew", img: ({ gameKey }) => baseSprite(gameKey, 610), imgS: ({ gameKey }) => shinySprite(gameKey, 610) },
		{ id: 184, natiId: 611, name: "Fraxure", img: ({ gameKey }) => baseSprite(gameKey, 611), imgS: ({ gameKey }) => shinySprite(gameKey, 611) },
		{ id: 185, natiId: 612, name: "Haxorus", img: ({ gameKey }) => baseSprite(gameKey, 612), imgS: ({ gameKey }) => shinySprite(gameKey, 612) },
		{ id: 186, natiId: 335, name: "Zangoose", img: ({ gameKey }) => baseSprite(gameKey, 335), imgS: ({ gameKey }) => shinySprite(gameKey, 335) },
		{ id: 187, natiId: 336, name: "Seviper", img: ({ gameKey }) => baseSprite(gameKey, 336), imgS: ({ gameKey }) => shinySprite(gameKey, 336) },
		{ id: 188, natiId: 605, name: "Elgyem", img: ({ gameKey }) => baseSprite(gameKey, 605), imgS: ({ gameKey }) => shinySprite(gameKey, 605) },
		{ id: 189, natiId: 606, name: "Beheeyem", img: ({ gameKey }) => baseSprite(gameKey, 606), imgS: ({ gameKey }) => shinySprite(gameKey, 606) },
		{ id: 190, natiId: 607, name: "Litwick", img: ({ gameKey }) => baseSprite(gameKey, 607), imgS: ({ gameKey }) => shinySprite(gameKey, 607) },
		{ id: 191, natiId: 608, name: "Lampent", img: ({ gameKey }) => baseSprite(gameKey, 608), imgS: ({ gameKey }) => shinySprite(gameKey, 608) },
		{ id: 192, natiId: 609, name: "Chandelure", img: ({ gameKey }) => baseSprite(gameKey, 609), imgS: ({ gameKey }) => shinySprite(gameKey, 609) },
		{ id: 193, natiId: 631, name: "Heatmor", img: ({ gameKey }) => baseSprite(gameKey, 631), imgS: ({ gameKey }) => shinySprite(gameKey, 631) },
		{ id: 194, natiId: 632, name: "Durant", img: ({ gameKey }) => baseSprite(gameKey, 632), imgS: ({ gameKey }) => shinySprite(gameKey, 632) },
		{ id: 195, natiId: 613, name: "Cubchoo", img: ({ gameKey }) => baseSprite(gameKey, 613), imgS: ({ gameKey }) => shinySprite(gameKey, 613) },
		{ id: 196, natiId: 614, name: "Beartic", img: ({ gameKey }) => baseSprite(gameKey, 614), imgS: ({ gameKey }) => shinySprite(gameKey, 614) },
		{ id: 197, natiId: 615, name: "Cryogonal", img: ({ gameKey }) => baseSprite(gameKey, 615), imgS: ({ gameKey }) => shinySprite(gameKey, 615) },
		{ id: 198, natiId: 641, name: "Tornadus", img: ({ gameKey }) => baseSprite(gameKey, 641), imgS: ({ gameKey }) => shinySprite(gameKey, 641), maxStatus: "caught", tags: ["legendary"] },
		{ id: 199, natiId: 642, name: "Thundurus", img: ({ gameKey }) => baseSprite(gameKey, 642), imgS: ({ gameKey }) => shinySprite(gameKey, 642), maxStatus: "caught", tags: ["legendary"] },
		{ id: 200, natiId: 645, name: "Landorus", img: ({ gameKey }) => baseSprite(gameKey, 645), imgS: ({ gameKey }) => shinySprite(gameKey, 645), tags: ["legendary"] },
		{ id: 201, natiId: 451, name: "Skorupi", img: ({ gameKey }) => baseSprite(gameKey, 451), imgS: ({ gameKey }) => shinySprite(gameKey, 451) },
		{ id: 202, natiId: 452, name: "Drapion", img: ({ gameKey }) => baseSprite(gameKey, 452), imgS: ({ gameKey }) => shinySprite(gameKey, 452) },
		{ id: 203, natiId: 227, name: "Skarmory", img: ({ gameKey }) => baseSprite(gameKey, 227), imgS: ({ gameKey }) => shinySprite(gameKey, 227) },
		{
			id: 204, natiId: 322, name: "Numel", img: ({ gameKey }) => baseSprite(gameKey, 322), imgS: ({ gameKey }) => shinySprite(gameKey, 322), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 322), imgS: ({ gameKey }) => shinySprite(gameKey, 322), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0322-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0322-f"), },
			]
		},
		{
			id: 205, natiId: 323, name: "Camerupt", img: ({ gameKey }) => baseSprite(gameKey, 323), imgS: ({ gameKey }) => shinySprite(gameKey, 323), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 323), imgS: ({ gameKey }) => shinySprite(gameKey, 323), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0323-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0323-f"), },
			]
		},
		{ id: 206, natiId: 325, name: "Spoink", img: ({ gameKey }) => baseSprite(gameKey, 325), imgS: ({ gameKey }) => shinySprite(gameKey, 325) },
		{ id: 207, natiId: 326, name: "Grumpig", img: ({ gameKey }) => baseSprite(gameKey, 326), imgS: ({ gameKey }) => shinySprite(gameKey, 326) },
		{ id: 208, natiId: 425, name: "Drifloon", img: ({ gameKey }) => baseSprite(gameKey, 425), imgS: ({ gameKey }) => shinySprite(gameKey, 425) },
		{ id: 209, natiId: 426, name: "Drifblim", img: ({ gameKey }) => baseSprite(gameKey, 426), imgS: ({ gameKey }) => shinySprite(gameKey, 426) },
		{ id: 210, natiId: 353, name: "Shuppet", img: ({ gameKey }) => baseSprite(gameKey, 353), imgS: ({ gameKey }) => shinySprite(gameKey, 353) },
		{ id: 211, natiId: 354, name: "Banette", img: ({ gameKey }) => baseSprite(gameKey, 354), imgS: ({ gameKey }) => shinySprite(gameKey, 354) },
		{ id: 212, natiId: 278, name: "Wingull", img: ({ gameKey }) => baseSprite(gameKey, 278), imgS: ({ gameKey }) => shinySprite(gameKey, 278) },
		{ id: 213, natiId: 279, name: "Pelipper", img: ({ gameKey }) => baseSprite(gameKey, 279), imgS: ({ gameKey }) => shinySprite(gameKey, 279) },
		{ id: 214, natiId: 337, name: "Lunatone", img: ({ gameKey }) => baseSprite(gameKey, 337), imgS: ({ gameKey }) => shinySprite(gameKey, 337) },
		{ id: 215, natiId: 338, name: "Solrock", img: ({ gameKey }) => baseSprite(gameKey, 338), imgS: ({ gameKey }) => shinySprite(gameKey, 338) },
		{ id: 216, natiId: 359, name: "Absol", img: ({ gameKey }) => baseSprite(gameKey, 359), imgS: ({ gameKey }) => shinySprite(gameKey, 359) },
		{ id: 217, natiId: 114, name: "Tangela", img: ({ gameKey }) => baseSprite(gameKey, 114), imgS: ({ gameKey }) => shinySprite(gameKey, 114) },
		{
			id: 218, natiId: 465, name: "Tangrowth", img: ({ gameKey }) => baseSprite(gameKey, 465), imgS: ({ gameKey }) => shinySprite(gameKey, 465), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 465), imgS: ({ gameKey }) => shinySprite(gameKey, 465), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0465-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0465-f"), },
			]
		},
		{ id: 219, natiId: 619, name: "Mienfoo", img: ({ gameKey }) => baseSprite(gameKey, 619), imgS: ({ gameKey }) => shinySprite(gameKey, 619) },
		{ id: 220, natiId: 620, name: "Mienshao", img: ({ gameKey }) => baseSprite(gameKey, 620), imgS: ({ gameKey }) => shinySprite(gameKey, 620) },
		{
			id: 221, natiId: 207, name: "Gligar", img: ({ gameKey }) => baseSprite(gameKey, 207), imgS: ({ gameKey }) => shinySprite(gameKey, 207), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 207), imgS: ({ gameKey }) => shinySprite(gameKey, 207), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0207-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0207-f"), },
			]
		},
		{ id: 222, natiId: 472, name: "Gliscor", img: ({ gameKey }) => baseSprite(gameKey, 472), imgS: ({ gameKey }) => shinySprite(gameKey, 472) },
		{ id: 223, natiId: 624, name: "Pawniard", img: ({ gameKey }) => baseSprite(gameKey, 624), imgS: ({ gameKey }) => shinySprite(gameKey, 624) },
		{ id: 224, natiId: 625, name: "Bisharp", img: ({ gameKey }) => baseSprite(gameKey, 625), imgS: ({ gameKey }) => shinySprite(gameKey, 625) },
		{ id: 225, natiId: 638, name: "Cobalion", img: ({ gameKey }) => baseSprite(gameKey, 638), imgS: ({ gameKey }) => shinySprite(gameKey, 638), tags: ["legendary"] },
		{ id: 226, natiId: 639, name: "Terrakion", img: ({ gameKey }) => baseSprite(gameKey, 639), imgS: ({ gameKey }) => shinySprite(gameKey, 639), tags: ["legendary"] },
		{ id: 227, natiId: 640, name: "Virizion", img: ({ gameKey }) => baseSprite(gameKey, 640), imgS: ({ gameKey }) => shinySprite(gameKey, 640), tags: ["legendary"] },
		{ id: 228, natiId: 535, name: "Tympole", img: ({ gameKey }) => baseSprite(gameKey, 535), imgS: ({ gameKey }) => shinySprite(gameKey, 535) },
		{ id: 229, natiId: 536, name: "Palpitoad", img: ({ gameKey }) => baseSprite(gameKey, 536), imgS: ({ gameKey }) => shinySprite(gameKey, 536) },
		{ id: 230, natiId: 537, name: "Seismitoad", img: ({ gameKey }) => baseSprite(gameKey, 537), imgS: ({ gameKey }) => shinySprite(gameKey, 537) },
		{ id: 231, natiId: 618, name: "Stunfisk", img: ({ gameKey }) => baseSprite(gameKey, 618), imgS: ({ gameKey }) => shinySprite(gameKey, 618) },
		{ id: 232, natiId: 213, name: "Shuckle", img: ({ gameKey }) => baseSprite(gameKey, 213), imgS: ({ gameKey }) => shinySprite(gameKey, 213) },
		{ id: 233, natiId: 458, name: "Mantyke", img: ({ gameKey }) => baseSprite(gameKey, 458), imgS: ({ gameKey }) => shinySprite(gameKey, 458) },
		{ id: 234, natiId: 226, name: "Mantine", img: ({ gameKey }) => baseSprite(gameKey, 226), imgS: ({ gameKey }) => shinySprite(gameKey, 226) },
		{ id: 235, natiId: 223, name: "Remoraid", img: ({ gameKey }) => baseSprite(gameKey, 223), imgS: ({ gameKey }) => shinySprite(gameKey, 223) },
		{
			id: 236, natiId: 224, name: "Octillery", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0224-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0224-f"), },
			]
		},
		{ id: 237, natiId: 222, name: "Corsola", img: ({ gameKey }) => baseSprite(gameKey, 222), imgS: ({ gameKey }) => shinySprite(gameKey, 222) },
		{ id: 238, natiId: 120, name: "Staryu", img: ({ gameKey }) => baseSprite(gameKey, 120), imgS: ({ gameKey }) => shinySprite(gameKey, 120) },
		{ id: 239, natiId: 121, name: "Starmie", img: ({ gameKey }) => baseSprite(gameKey, 121), imgS: ({ gameKey }) => shinySprite(gameKey, 121) },
		{ id: 240, natiId: 320, name: "Wailmer", img: ({ gameKey }) => baseSprite(gameKey, 320), imgS: ({ gameKey }) => shinySprite(gameKey, 320) },
		{ id: 241, natiId: 321, name: "Wailord", img: ({ gameKey }) => baseSprite(gameKey, 321), imgS: ({ gameKey }) => shinySprite(gameKey, 321) },
		{ id: 242, natiId: 131, name: "Lapras", img: ({ gameKey }) => baseSprite(gameKey, 131), imgS: ({ gameKey }) => shinySprite(gameKey, 131) },
		{ id: 243, natiId: 363, name: "Spheal", img: ({ gameKey }) => baseSprite(gameKey, 363), imgS: ({ gameKey }) => shinySprite(gameKey, 363) },
		{ id: 244, natiId: 364, name: "Sealeo", img: ({ gameKey }) => baseSprite(gameKey, 364), imgS: ({ gameKey }) => shinySprite(gameKey, 364) },
		{ id: 245, natiId: 365, name: "Walrein", img: ({ gameKey }) => baseSprite(gameKey, 365), imgS: ({ gameKey }) => shinySprite(gameKey, 365) },
		{ id: 246, natiId: 333, name: "Swablu", img: ({ gameKey }) => baseSprite(gameKey, 333), imgS: ({ gameKey }) => shinySprite(gameKey, 333) },
		{ id: 247, natiId: 334, name: "Altaria", img: ({ gameKey }) => baseSprite(gameKey, 334), imgS: ({ gameKey }) => shinySprite(gameKey, 334) },
		{ id: 248, natiId: 37, name: "Vulpix", img: ({ gameKey }) => baseSprite(gameKey, 37), imgS: ({ gameKey }) => shinySprite(gameKey, 37) },
		{ id: 249, natiId: 38, name: "Ninetales", img: ({ gameKey }) => baseSprite(gameKey, 38), imgS: ({ gameKey }) => shinySprite(gameKey, 38) },
		{ id: 250, natiId: 436, name: "Bronzor", img: ({ gameKey }) => baseSprite(gameKey, 436), imgS: ({ gameKey }) => shinySprite(gameKey, 436) },
		{ id: 251, natiId: 437, name: "Bronzong", img: ({ gameKey }) => baseSprite(gameKey, 437), imgS: ({ gameKey }) => shinySprite(gameKey, 437) },
		{
			id: 252, natiId: 215, name: "Sneasel", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-f"), },
			]
		},
		{
			id: 253, natiId: 461, name: "Weavile", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0461-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0461-f"), },
			]
		},
		{ id: 254, natiId: 225, name: "Delibird", img: ({ gameKey }) => baseSprite(gameKey, 225), imgS: ({ gameKey }) => shinySprite(gameKey, 225) },
		{ id: 255, natiId: 582, name: "Vanillite", img: ({ gameKey }) => baseSprite(gameKey, 582), imgS: ({ gameKey }) => shinySprite(gameKey, 582) },
		{ id: 256, natiId: 583, name: "Vanillish", img: ({ gameKey }) => baseSprite(gameKey, 583), imgS: ({ gameKey }) => shinySprite(gameKey, 583) },
		{ id: 257, natiId: 584, name: "Vanilluxe", img: ({ gameKey }) => baseSprite(gameKey, 584), imgS: ({ gameKey }) => shinySprite(gameKey, 584) },
		{ id: 258, natiId: 220, name: "Swinub", img: ({ gameKey }) => baseSprite(gameKey, 220), imgS: ({ gameKey }) => shinySprite(gameKey, 220) },
		{
			id: 259, natiId: 221, name: "Piloswine", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0221-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0221-f"), },
			]
		},
		{
			id: 260, natiId: 473, name: "Mamoswine", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0473-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0473-f"), },
			]
		},
		{ id: 261, natiId: 132, name: "Ditto", img: ({ gameKey }) => baseSprite(gameKey, 132), imgS: ({ gameKey }) => shinySprite(gameKey, 132) },
		{ id: 262, natiId: 374, name: "Beldum", img: ({ gameKey }) => baseSprite(gameKey, 374), imgS: ({ gameKey }) => shinySprite(gameKey, 374) },
		{ id: 263, natiId: 375, name: "Metang", img: ({ gameKey }) => baseSprite(gameKey, 375), imgS: ({ gameKey }) => shinySprite(gameKey, 375) },
		{ id: 264, natiId: 376, name: "Metagross", img: ({ gameKey }) => baseSprite(gameKey, 376), imgS: ({ gameKey }) => shinySprite(gameKey, 376) },
		{ id: 265, natiId: 86, name: "Seel", img: ({ gameKey }) => baseSprite(gameKey, 86), imgS: ({ gameKey }) => shinySprite(gameKey, 86) },
		{ id: 266, natiId: 87, name: "Dewgong", img: ({ gameKey }) => baseSprite(gameKey, 87), imgS: ({ gameKey }) => shinySprite(gameKey, 87) },
		{ id: 267, natiId: 538, name: "Throh", img: ({ gameKey }) => baseSprite(gameKey, 538), imgS: ({ gameKey }) => shinySprite(gameKey, 538) },
		{ id: 268, natiId: 539, name: "Sawk", img: ({ gameKey }) => baseSprite(gameKey, 539), imgS: ({ gameKey }) => shinySprite(gameKey, 539) },
		{ id: 269, natiId: 626, name: "Bouffalant", img: ({ gameKey }) => baseSprite(gameKey, 626), imgS: ({ gameKey }) => shinySprite(gameKey, 626) },
		{ id: 270, natiId: 621, name: "Druddigon", img: ({ gameKey }) => baseSprite(gameKey, 621), imgS: ({ gameKey }) => shinySprite(gameKey, 621) },
		{ id: 271, natiId: 622, name: "Golett", img: ({ gameKey }) => baseSprite(gameKey, 622), imgS: ({ gameKey }) => shinySprite(gameKey, 622) },
		{ id: 272, natiId: 623, name: "Golurk", img: ({ gameKey }) => baseSprite(gameKey, 623), imgS: ({ gameKey }) => shinySprite(gameKey, 623) },
		{ id: 273, natiId: 633, name: "Deino", img: ({ gameKey }) => baseSprite(gameKey, 633), imgS: ({ gameKey }) => shinySprite(gameKey, 633) },
		{ id: 274, natiId: 634, name: "Zweilous", img: ({ gameKey }) => baseSprite(gameKey, 634), imgS: ({ gameKey }) => shinySprite(gameKey, 634) },
		{ id: 275, natiId: 635, name: "Hydreigon", img: ({ gameKey }) => baseSprite(gameKey, 635), imgS: ({ gameKey }) => shinySprite(gameKey, 635) },
		{ id: 276, natiId: 287, name: "Slakoth", img: ({ gameKey }) => baseSprite(gameKey, 287), imgS: ({ gameKey }) => shinySprite(gameKey, 287) },
		{ id: 277, natiId: 288, name: "Vigoroth", img: ({ gameKey }) => baseSprite(gameKey, 288), imgS: ({ gameKey }) => shinySprite(gameKey, 288) },
		{ id: 278, natiId: 289, name: "Slaking", img: ({ gameKey }) => baseSprite(gameKey, 289), imgS: ({ gameKey }) => shinySprite(gameKey, 289) },
		{ id: 279, natiId: 341, name: "Corphish", img: ({ gameKey }) => baseSprite(gameKey, 341), imgS: ({ gameKey }) => shinySprite(gameKey, 341) },
		{ id: 280, natiId: 342, name: "Crawdaunt", img: ({ gameKey }) => baseSprite(gameKey, 342), imgS: ({ gameKey }) => shinySprite(gameKey, 342) },
		{ id: 281, natiId: 174, name: "Igglybuff", img: ({ gameKey }) => baseSprite(gameKey, 174), imgS: ({ gameKey }) => shinySprite(gameKey, 174) },
		{ id: 282, natiId: 39, name: "Jigglypuff", img: ({ gameKey }) => baseSprite(gameKey, 39), imgS: ({ gameKey }) => shinySprite(gameKey, 39) },
		{ id: 283, natiId: 40, name: "Wigglytuff", img: ({ gameKey }) => baseSprite(gameKey, 40), imgS: ({ gameKey }) => shinySprite(gameKey, 40) },
		{ id: 284, natiId: 108, name: "Lickitung", img: ({ gameKey }) => baseSprite(gameKey, 108), imgS: ({ gameKey }) => shinySprite(gameKey, 108) },
		{ id: 285, natiId: 463, name: "Lickilicky", img: ({ gameKey }) => baseSprite(gameKey, 463), imgS: ({ gameKey }) => shinySprite(gameKey, 463) },
		{ id: 286, natiId: 193, name: "Yanma", img: ({ gameKey }) => baseSprite(gameKey, 193), imgS: ({ gameKey }) => shinySprite(gameKey, 193) },
		{ id: 287, natiId: 469, name: "Yanmega", img: ({ gameKey }) => baseSprite(gameKey, 469), imgS: ({ gameKey }) => shinySprite(gameKey, 469) },
		{ id: 288, natiId: 357, name: "Tropius", img: ({ gameKey }) => baseSprite(gameKey, 357), imgS: ({ gameKey }) => shinySprite(gameKey, 357) },
		{ id: 289, natiId: 455, name: "Carnivine", img: ({ gameKey }) => baseSprite(gameKey, 455), imgS: ({ gameKey }) => shinySprite(gameKey, 455) },
		{
			id: 290, natiId: 453, name: "Croagunk", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0453-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0453-f"), },
			]
		},
		{
			id: 291, natiId: 454, name: "Toxicroak", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0454-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0454-f"), },
			]
		},
		{ id: 292, natiId: 246, name: "Larvitar", img: ({ gameKey }) => baseSprite(gameKey, 246), imgS: ({ gameKey }) => shinySprite(gameKey, 246) },
		{ id: 293, natiId: 247, name: "Pupitar", img: ({ gameKey }) => baseSprite(gameKey, 247), imgS: ({ gameKey }) => shinySprite(gameKey, 247) },
		{ id: 294, natiId: 248, name: "Tyranitar", img: ({ gameKey }) => baseSprite(gameKey, 248), imgS: ({ gameKey }) => shinySprite(gameKey, 248) },
		{ id: 295, natiId: 643, name: "Reshiram", img: ({ gameKey }) => baseSprite(gameKey, 643), imgS: ({ gameKey }) => shinySprite(gameKey, 643), maxStatus: "caught", tags: ["legendary"] },
		{ id: 296, natiId: 644, name: "Zekrom", img: ({ gameKey }) => baseSprite(gameKey, 644), imgS: ({ gameKey }) => shinySprite(gameKey, 644), maxStatus: "caught", tags: ["legendary"] },
		{ id: 297, natiId: 646, name: "Kyurem", img: ({ gameKey }) => baseSprite(gameKey, 646), imgS: ({ gameKey }) => shinySprite(gameKey, 646), tags: ["legendary"] },
		{ id: 298, natiId: 647, name: "Keldeo", img: ({ gameKey }) => baseSprite(gameKey, 647), imgS: ({ gameKey }) => shinySprite(gameKey, 647), maxStatus: "caught", tags: ["mythical"] },
		{ id: 299, natiId: 648, name: "Meloetta", img: ({ gameKey }) => baseSprite(gameKey, 648), imgS: ({ gameKey }) => shinySprite(gameKey, 648), maxStatus: "caught", tags: ["mythical"] },
		{ id: 300, natiId: 649, name: "Genesect", img: ({ gameKey }) => baseSprite(gameKey, 649), imgS: ({ gameKey }) => shinySprite(gameKey, 649), maxStatus: "caught", tags: ["mythical"] }
	];

	window._registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();