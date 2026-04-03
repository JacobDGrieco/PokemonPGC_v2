(() => {
	const gen = 6;
	const GAME_KEYS = ["x-coastal", "y-coastal"];
	const DEX_NAME = "Coastal Kalos Dex";

	const baseSprite = (gameKey, natiId) => window.dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => window.dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 425, name: "Drifloon", img: ({ gameKey }) => baseSprite(gameKey, 425), imgS: ({ gameKey }) => shinySprite(gameKey, 425) },
		{ id: 2, natiId: 426, name: "Drifblim", img: ({ gameKey }) => baseSprite(gameKey, 426), imgS: ({ gameKey }) => shinySprite(gameKey, 426) },
		{ id: 3, natiId: 619, name: "Mienfoo", img: ({ gameKey }) => baseSprite(gameKey, 619), imgS: ({ gameKey }) => shinySprite(gameKey, 619) },
		{ id: 4, natiId: 620, name: "Mienshao", img: ({ gameKey }) => baseSprite(gameKey, 620), imgS: ({ gameKey }) => shinySprite(gameKey, 620) },
		{ id: 5, natiId: 335, name: "Zangoose", img: ({ gameKey }) => baseSprite(gameKey, 335), imgS: ({ gameKey }) => shinySprite(gameKey, 335) },
		{ id: 6, natiId: 336, name: "Seviper", img: ({ gameKey }) => baseSprite(gameKey, 336), imgS: ({ gameKey }) => shinySprite(gameKey, 336) },
		{ id: 7, natiId: 325, name: "Spoink", img: ({ gameKey }) => baseSprite(gameKey, 325), imgS: ({ gameKey }) => shinySprite(gameKey, 325) },
		{ id: 8, natiId: 326, name: "Grumpig", img: ({ gameKey }) => baseSprite(gameKey, 326), imgS: ({ gameKey }) => shinySprite(gameKey, 326) },
		{ id: 9, natiId: 359, name: "Absol", img: ({ gameKey }) => baseSprite(gameKey, 359), imgS: ({ gameKey }) => shinySprite(gameKey, 359), tags: ["mega"] },
		{ id: 10, natiId: 686, name: "Inkay", img: ({ gameKey }) => baseSprite(gameKey, 686), imgS: ({ gameKey }) => shinySprite(gameKey, 686) },
		{ id: 11, natiId: 687, name: "Malamar", img: ({ gameKey }) => baseSprite(gameKey, 687), imgS: ({ gameKey }) => shinySprite(gameKey, 687) },
		{ id: 12, natiId: 337, name: "Lunatone", img: ({ gameKey }) => baseSprite(gameKey, 337), imgS: ({ gameKey }) => shinySprite(gameKey, 337) },
		{ id: 13, natiId: 338, name: "Solrock", img: ({ gameKey }) => baseSprite(gameKey, 338), imgS: ({ gameKey }) => shinySprite(gameKey, 338) },
		{ id: 14, natiId: 371, name: "Bagon", img: ({ gameKey }) => baseSprite(gameKey, 371), imgS: ({ gameKey }) => shinySprite(gameKey, 371), tags: ["pseudo"] },
		{ id: 15, natiId: 372, name: "Shelgon", img: ({ gameKey }) => baseSprite(gameKey, 372), imgS: ({ gameKey }) => shinySprite(gameKey, 372), tags: ["pseudo"] },
		{ id: 16, natiId: 373, name: "Salamence", img: ({ gameKey }) => baseSprite(gameKey, 373), imgS: ({ gameKey }) => shinySprite(gameKey, 373), tags: ["pseudo"] },
		{ id: 17, natiId: 278, name: "Wingull", img: ({ gameKey }) => baseSprite(gameKey, 278), imgS: ({ gameKey }) => shinySprite(gameKey, 278) },
		{ id: 18, natiId: 279, name: "Pelipper", img: ({ gameKey }) => baseSprite(gameKey, 279), imgS: ({ gameKey }) => shinySprite(gameKey, 279) },
		{ id: 19, natiId: 276, name: "Taillow", img: ({ gameKey }) => baseSprite(gameKey, 276), imgS: ({ gameKey }) => shinySprite(gameKey, 276) },
		{ id: 20, natiId: 277, name: "Swellow", img: ({ gameKey }) => baseSprite(gameKey, 277), imgS: ({ gameKey }) => shinySprite(gameKey, 277) },
		{ id: 21, natiId: 688, name: "Binacle", img: ({ gameKey }) => baseSprite(gameKey, 688), imgS: ({ gameKey }) => shinySprite(gameKey, 688) },
		{ id: 22, natiId: 689, name: "Barbaracle", img: ({ gameKey }) => baseSprite(gameKey, 689), imgS: ({ gameKey }) => shinySprite(gameKey, 689) },
		{ id: 23, natiId: 557, name: "Dwebble", img: ({ gameKey }) => baseSprite(gameKey, 557), imgS: ({ gameKey }) => shinySprite(gameKey, 557) },
		{ id: 24, natiId: 558, name: "Crustle", img: ({ gameKey }) => baseSprite(gameKey, 558), imgS: ({ gameKey }) => shinySprite(gameKey, 558) },
		{ id: 25, natiId: 72, name: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72), imgS: ({ gameKey }) => shinySprite(gameKey, 72) },
		{ id: 26, natiId: 73, name: "Tentacruel", img: ({ gameKey }) => baseSprite(gameKey, 73), imgS: ({ gameKey }) => shinySprite(gameKey, 73) },
		{ id: 27, natiId: 320, name: "Wailmer", img: ({ gameKey }) => baseSprite(gameKey, 320), imgS: ({ gameKey }) => shinySprite(gameKey, 320) },
		{ id: 28, natiId: 321, name: "Wailord", img: ({ gameKey }) => baseSprite(gameKey, 321), imgS: ({ gameKey }) => shinySprite(gameKey, 321) },
		{ id: 29, natiId: 370, name: "Luvdisc", img: ({ gameKey }) => baseSprite(gameKey, 370), imgS: ({ gameKey }) => shinySprite(gameKey, 370) },
		{ id: 30, natiId: 690, name: "Skrelp", img: ({ gameKey }) => baseSprite(gameKey, 690), imgS: ({ gameKey }) => shinySprite(gameKey, 690) },
		{ id: 31, natiId: 691, name: "Dragalge", img: ({ gameKey }) => baseSprite(gameKey, 691), imgS: ({ gameKey }) => shinySprite(gameKey, 691) },
		{ id: 32, natiId: 692, name: "Clauncher", img: ({ gameKey }) => baseSprite(gameKey, 692), imgS: ({ gameKey }) => shinySprite(gameKey, 692) },
		{ id: 33, natiId: 693, name: "Clawitzer", img: ({ gameKey }) => baseSprite(gameKey, 693), imgS: ({ gameKey }) => shinySprite(gameKey, 693) },
		{ id: 34, natiId: 120, name: "Staryu", img: ({ gameKey }) => baseSprite(gameKey, 120), imgS: ({ gameKey }) => shinySprite(gameKey, 120) },
		{ id: 35, natiId: 121, name: "Starmie", img: ({ gameKey }) => baseSprite(gameKey, 121), imgS: ({ gameKey }) => shinySprite(gameKey, 121) },
		{ id: 36, natiId: 90, name: "Shellder", img: ({ gameKey }) => baseSprite(gameKey, 90), imgS: ({ gameKey }) => shinySprite(gameKey, 90) },
		{ id: 37, natiId: 91, name: "Cloyster", img: ({ gameKey }) => baseSprite(gameKey, 91), imgS: ({ gameKey }) => shinySprite(gameKey, 91) },
		{ id: 38, natiId: 211, name: "Qwilfish", img: ({ gameKey }) => baseSprite(gameKey, 211), imgS: ({ gameKey }) => shinySprite(gameKey, 211) },
		{ id: 39, natiId: 116, name: "Horsea", img: ({ gameKey }) => baseSprite(gameKey, 116), imgS: ({ gameKey }) => shinySprite(gameKey, 116) },
		{ id: 40, natiId: 117, name: "Seadra", img: ({ gameKey }) => baseSprite(gameKey, 117), imgS: ({ gameKey }) => shinySprite(gameKey, 117) },
		{ id: 41, natiId: 230, name: "Kingdra", img: ({ gameKey }) => baseSprite(gameKey, 230), imgS: ({ gameKey }) => shinySprite(gameKey, 230) },
		{
			id: 42, natiId: 369, name: "Relicanth", img: ({ gameKey }) => baseSprite(gameKey, 369), imgS: ({ gameKey }) => shinySprite(gameKey, 369), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 369), imgS: ({ gameKey }) => shinySprite(gameKey, 369), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0369-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0369-f"), },
			]
		},
		{ id: 43, natiId: 551, name: "Sandile", img: ({ gameKey }) => baseSprite(gameKey, 551), imgS: ({ gameKey }) => shinySprite(gameKey, 551) },
		{ id: 44, natiId: 552, name: "Krokorok", img: ({ gameKey }) => baseSprite(gameKey, 552), imgS: ({ gameKey }) => shinySprite(gameKey, 552) },
		{ id: 45, natiId: 553, name: "Krookodile", img: ({ gameKey }) => baseSprite(gameKey, 553), imgS: ({ gameKey }) => shinySprite(gameKey, 553) },
		{ id: 46, natiId: 694, name: "Helioptile", img: ({ gameKey }) => baseSprite(gameKey, 694), imgS: ({ gameKey }) => shinySprite(gameKey, 694) },
		{ id: 47, natiId: 695, name: "Heliolisk", img: ({ gameKey }) => baseSprite(gameKey, 695), imgS: ({ gameKey }) => shinySprite(gameKey, 695) },
		{
			id: 48, natiId: 449, name: "Hippopotas", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0449-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0449-f"), },
			]
		},
		{
			id: 49, natiId: 450, name: "Hippowdon", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0450-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0450-f"), },
			]
		},
		{
			id: 50, natiId: 111, name: "Rhyhorn", img: ({ gameKey }) => baseSprite(gameKey, 111), imgS: ({ gameKey }) => shinySprite(gameKey, 111), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 111), imgS: ({ gameKey }) => shinySprite(gameKey, 111), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0111-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0111-f"), },]
		},
		{
			id: 51, natiId: 112, name: "Rhydon", img: ({ gameKey }) => baseSprite(gameKey, 112), imgS: ({ gameKey }) => shinySprite(gameKey, 112), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 112), imgS: ({ gameKey }) => shinySprite(gameKey, 112), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0112-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0112-f"), },]
		},
		{
			id: 52, natiId: 464, name: "Rhyperior", img: ({ gameKey }) => baseSprite(gameKey, 464), imgS: ({ gameKey }) => shinySprite(gameKey, 464), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 464), imgS: ({ gameKey }) => shinySprite(gameKey, 464), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0464-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0464-f"), },
			]
		},
		{ id: 53, natiId: 95, name: "Onix", img: ({ gameKey }) => baseSprite(gameKey, 95), imgS: ({ gameKey }) => shinySprite(gameKey, 95) },
		{
			id: 54, natiId: 208, name: "Steelix", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0208-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0208-f"), },
			]
		},
		{ id: 55, natiId: 527, name: "Woobat", img: ({ gameKey }) => baseSprite(gameKey, 527), imgS: ({ gameKey }) => shinySprite(gameKey, 527) },
		{ id: 56, natiId: 528, name: "Swoobat", img: ({ gameKey }) => baseSprite(gameKey, 528), imgS: ({ gameKey }) => shinySprite(gameKey, 528) },
		{ id: 57, natiId: 66, name: "Machop", img: ({ gameKey }) => baseSprite(gameKey, 66), imgS: ({ gameKey }) => shinySprite(gameKey, 66) },
		{ id: 58, natiId: 67, name: "Machoke", img: ({ gameKey }) => baseSprite(gameKey, 67), imgS: ({ gameKey }) => shinySprite(gameKey, 67) },
		{ id: 59, natiId: 68, name: "Machamp", img: ({ gameKey }) => baseSprite(gameKey, 68), imgS: ({ gameKey }) => shinySprite(gameKey, 68) },
		{ id: 60, natiId: 104, name: "Cubone", img: ({ gameKey }) => baseSprite(gameKey, 104), imgS: ({ gameKey }) => shinySprite(gameKey, 104) },
		{ id: 61, natiId: 105, name: "Marowak", img: ({ gameKey }) => baseSprite(gameKey, 105), imgS: ({ gameKey }) => shinySprite(gameKey, 105) },
		{ id: 62, natiId: 115, name: "Kangaskhan", img: ({ gameKey }) => baseSprite(gameKey, 115), imgS: ({ gameKey }) => shinySprite(gameKey, 115), tags: ["mega"] },
		{ id: 63, natiId: 303, name: "Mawile", img: ({ gameKey }) => baseSprite(gameKey, 303), imgS: ({ gameKey }) => shinySprite(gameKey, 303), tags: ["mega"] },
		{ id: 64, natiId: 696, name: "Tyrunt", img: ({ gameKey }) => baseSprite(gameKey, 696), imgS: ({ gameKey }) => shinySprite(gameKey, 696), tags: ["fossil"] },
		{ id: 65, natiId: 697, name: "Tyrantrum", img: ({ gameKey }) => baseSprite(gameKey, 697), imgS: ({ gameKey }) => shinySprite(gameKey, 697), tags: ["fossil"] },
		{ id: 66, natiId: 698, name: "Amaura", img: ({ gameKey }) => baseSprite(gameKey, 698), imgS: ({ gameKey }) => shinySprite(gameKey, 698), tags: ["fossil"] },
		{ id: 67, natiId: 699, name: "Aurorus", img: ({ gameKey }) => baseSprite(gameKey, 699), imgS: ({ gameKey }) => shinySprite(gameKey, 699), tags: ["fossil"] },
		{ id: 68, natiId: 142, name: "Aerodactyl", img: ({ gameKey }) => baseSprite(gameKey, 142), imgS: ({ gameKey }) => shinySprite(gameKey, 142), tags: ["fossil", "mega"] },
		{ id: 69, natiId: 597, name: "Ferroseed", img: ({ gameKey }) => baseSprite(gameKey, 597), imgS: ({ gameKey }) => shinySprite(gameKey, 597) },
		{ id: 70, natiId: 598, name: "Ferrothorn", img: ({ gameKey }) => baseSprite(gameKey, 598), imgS: ({ gameKey }) => shinySprite(gameKey, 598) },
		{ id: 71, natiId: 209, name: "Snubbull", img: ({ gameKey }) => baseSprite(gameKey, 209), imgS: ({ gameKey }) => shinySprite(gameKey, 209) },
		{ id: 72, natiId: 210, name: "Granbull", img: ({ gameKey }) => baseSprite(gameKey, 210), imgS: ({ gameKey }) => shinySprite(gameKey, 210) },
		{ id: 73, natiId: 309, name: "Electrike", img: ({ gameKey }) => baseSprite(gameKey, 309), imgS: ({ gameKey }) => shinySprite(gameKey, 309) },
		{ id: 74, natiId: 310, name: "Manectric", img: ({ gameKey }) => baseSprite(gameKey, 310), imgS: ({ gameKey }) => shinySprite(gameKey, 310), tags: ["mega"] },
		{ id: 75, natiId: 228, name: "Houndour", img: ({ gameKey }) => baseSprite(gameKey, 228), imgS: ({ gameKey }) => shinySprite(gameKey, 228) },
		{
			id: 76, natiId: 229, name: "Houndoom", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0229-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0229-f"), },]
		},
		{ id: 77, natiId: 133, name: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133) },
		{ id: 78, natiId: 134, name: "Vaporeon", img: ({ gameKey }) => baseSprite(gameKey, 134), imgS: ({ gameKey }) => shinySprite(gameKey, 134) },
		{ id: 79, natiId: 135, name: "Jolteon", img: ({ gameKey }) => baseSprite(gameKey, 135), imgS: ({ gameKey }) => shinySprite(gameKey, 135) },
		{ id: 80, natiId: 136, name: "Flareon", img: ({ gameKey }) => baseSprite(gameKey, 136), imgS: ({ gameKey }) => shinySprite(gameKey, 136) },
		{ id: 81, natiId: 196, name: "Espeon", img: ({ gameKey }) => baseSprite(gameKey, 196), imgS: ({ gameKey }) => shinySprite(gameKey, 196) },
		{ id: 82, natiId: 197, name: "Umbreon", img: ({ gameKey }) => baseSprite(gameKey, 197), imgS: ({ gameKey }) => shinySprite(gameKey, 197) },
		{ id: 83, natiId: 470, name: "Leafeon", img: ({ gameKey }) => baseSprite(gameKey, 470), imgS: ({ gameKey }) => shinySprite(gameKey, 470) },
		{ id: 84, natiId: 471, name: "Glaceon", img: ({ gameKey }) => baseSprite(gameKey, 471), imgS: ({ gameKey }) => shinySprite(gameKey, 471) },
		{ id: 85, natiId: 700, name: "Sylveon", img: ({ gameKey }) => baseSprite(gameKey, 700), imgS: ({ gameKey }) => shinySprite(gameKey, 700) },
		{ id: 86, natiId: 587, name: "Emolga", img: ({ gameKey }) => baseSprite(gameKey, 587), imgS: ({ gameKey }) => shinySprite(gameKey, 587) },
		{ id: 87, natiId: 193, name: "Yanma", img: ({ gameKey }) => baseSprite(gameKey, 193), imgS: ({ gameKey }) => shinySprite(gameKey, 193) },
		{ id: 88, natiId: 469, name: "Yanmega", img: ({ gameKey }) => baseSprite(gameKey, 469), imgS: ({ gameKey }) => shinySprite(gameKey, 469) },
		{ id: 89, natiId: 701, name: "Hawlucha", img: ({ gameKey }) => baseSprite(gameKey, 701), imgS: ({ gameKey }) => shinySprite(gameKey, 701) },
		{ id: 90, natiId: 561, name: "Sigilyph", img: ({ gameKey }) => baseSprite(gameKey, 561), imgS: ({ gameKey }) => shinySprite(gameKey, 561) },
		{ id: 91, natiId: 622, name: "Golett", img: ({ gameKey }) => baseSprite(gameKey, 622), imgS: ({ gameKey }) => shinySprite(gameKey, 622) },
		{ id: 92, natiId: 623, name: "Golurk", img: ({ gameKey }) => baseSprite(gameKey, 623), imgS: ({ gameKey }) => shinySprite(gameKey, 623) },
		{ id: 93, natiId: 299, name: "Nosepass", img: ({ gameKey }) => baseSprite(gameKey, 299), imgS: ({ gameKey }) => shinySprite(gameKey, 299) },
		{ id: 94, natiId: 476, name: "Probopass", img: ({ gameKey }) => baseSprite(gameKey, 476), imgS: ({ gameKey }) => shinySprite(gameKey, 476) },
		{ id: 95, natiId: 296, name: "Makuhita", img: ({ gameKey }) => baseSprite(gameKey, 296), imgS: ({ gameKey }) => shinySprite(gameKey, 296) },
		{ id: 96, natiId: 297, name: "Hariyama", img: ({ gameKey }) => baseSprite(gameKey, 297), imgS: ({ gameKey }) => shinySprite(gameKey, 297) },
		{ id: 97, natiId: 538, name: "Throh", img: ({ gameKey }) => baseSprite(gameKey, 538), imgS: ({ gameKey }) => shinySprite(gameKey, 538) },
		{ id: 98, natiId: 539, name: "Sawk", img: ({ gameKey }) => baseSprite(gameKey, 539), imgS: ({ gameKey }) => shinySprite(gameKey, 539) },
		{
			id: 99, natiId: 396, name: "Starly", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0396-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0396-f"), },
			]
		},
		{
			id: 100, natiId: 397, name: "Staravia", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0397-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0397-f"), },
			]
		},
		{
			id: 101, natiId: 398, name: "Staraptor", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0398-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0398-f"), },
			]
		},
		{ id: 102, natiId: 434, name: "Stunky", img: ({ gameKey }) => baseSprite(gameKey, 434), imgS: ({ gameKey }) => shinySprite(gameKey, 434) },
		{ id: 103, natiId: 435, name: "Skuntank", img: ({ gameKey }) => baseSprite(gameKey, 435), imgS: ({ gameKey }) => shinySprite(gameKey, 435) },
		{ id: 104, natiId: 29, name: "Nidoran ♀", img: ({ gameKey }) => baseSprite(gameKey, 29), imgS: ({ gameKey }) => shinySprite(gameKey, 29) },
		{ id: 105, natiId: 30, name: "Nidorina", img: ({ gameKey }) => baseSprite(gameKey, 30), imgS: ({ gameKey }) => shinySprite(gameKey, 30) },
		{ id: 106, natiId: 31, name: "Nidoqueen", img: ({ gameKey }) => baseSprite(gameKey, 31), imgS: ({ gameKey }) => shinySprite(gameKey, 31) },
		{ id: 107, natiId: 32, name: "Nidoran ♂", img: ({ gameKey }) => baseSprite(gameKey, 32), imgS: ({ gameKey }) => shinySprite(gameKey, 32) },
		{ id: 108, natiId: 33, name: "Nidorino", img: ({ gameKey }) => baseSprite(gameKey, 33), imgS: ({ gameKey }) => shinySprite(gameKey, 33) },
		{ id: 109, natiId: 34, name: "Nidoking", img: ({ gameKey }) => baseSprite(gameKey, 34), imgS: ({ gameKey }) => shinySprite(gameKey, 34) },
		{ id: 110, natiId: 702, name: "Dedenne", img: ({ gameKey }) => baseSprite(gameKey, 702), imgS: ({ gameKey }) => shinySprite(gameKey, 702) },
		{ id: 111, natiId: 433, name: "Chingling", img: ({ gameKey }) => baseSprite(gameKey, 433), imgS: ({ gameKey }) => shinySprite(gameKey, 433) },
		{ id: 112, natiId: 358, name: "Chimecho", img: ({ gameKey }) => baseSprite(gameKey, 358), imgS: ({ gameKey }) => shinySprite(gameKey, 358) },
		{ id: 113, natiId: 439, name: "Mime Jr.", img: ({ gameKey }) => baseSprite(gameKey, 439), imgS: ({ gameKey }) => shinySprite(gameKey, 439) },
		{ id: 114, natiId: 122, name: "Mr. Mime", img: ({ gameKey }) => baseSprite(gameKey, 122), imgS: ({ gameKey }) => shinySprite(gameKey, 122) },
		{ id: 115, natiId: 577, name: "Solosis", img: ({ gameKey }) => baseSprite(gameKey, 577), imgS: ({ gameKey }) => shinySprite(gameKey, 577) },
		{ id: 116, natiId: 578, name: "Duosion", img: ({ gameKey }) => baseSprite(gameKey, 578), imgS: ({ gameKey }) => shinySprite(gameKey, 578) },
		{ id: 117, natiId: 579, name: "Reuniclus", img: ({ gameKey }) => baseSprite(gameKey, 579), imgS: ({ gameKey }) => shinySprite(gameKey, 579) },
		{ id: 118, natiId: 360, name: "Wynaut", img: ({ gameKey }) => baseSprite(gameKey, 360), imgS: ({ gameKey }) => shinySprite(gameKey, 360) },
		{
			id: 119, natiId: 202, name: "Wobbuffet", img: ({ gameKey }) => baseSprite(gameKey, 202), imgS: ({ gameKey }) => shinySprite(gameKey, 202), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 202), imgS: ({ gameKey }) => shinySprite(gameKey, 202), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0202-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0202-f"), },
			]
		},
		{ id: 120, natiId: 524, name: "Roggenrola", img: ({ gameKey }) => baseSprite(gameKey, 524), imgS: ({ gameKey }) => shinySprite(gameKey, 524) },
		{ id: 121, natiId: 525, name: "Boldore", img: ({ gameKey }) => baseSprite(gameKey, 525), imgS: ({ gameKey }) => shinySprite(gameKey, 525) },
		{ id: 122, natiId: 526, name: "Gigalith", img: ({ gameKey }) => baseSprite(gameKey, 526), imgS: ({ gameKey }) => shinySprite(gameKey, 526) },
		{ id: 123, natiId: 302, name: "Sableye", img: ({ gameKey }) => baseSprite(gameKey, 302), imgS: ({ gameKey }) => shinySprite(gameKey, 302) },
		{ id: 124, natiId: 703, name: "Carbink", img: ({ gameKey }) => baseSprite(gameKey, 703), imgS: ({ gameKey }) => shinySprite(gameKey, 703) },
		{ id: 125, natiId: 128, name: "Tauros", img: ({ gameKey }) => baseSprite(gameKey, 128), imgS: ({ gameKey }) => shinySprite(gameKey, 128) },
		{ id: 126, natiId: 241, name: "Miltank", img: ({ gameKey }) => baseSprite(gameKey, 241), imgS: ({ gameKey }) => shinySprite(gameKey, 241) },
		{ id: 127, natiId: 179, name: "Mareep", img: ({ gameKey }) => baseSprite(gameKey, 179), imgS: ({ gameKey }) => shinySprite(gameKey, 179) },
		{ id: 128, natiId: 180, name: "Flaaffy", img: ({ gameKey }) => baseSprite(gameKey, 180), imgS: ({ gameKey }) => shinySprite(gameKey, 180) },
		{ id: 129, natiId: 181, name: "Ampharos", img: ({ gameKey }) => baseSprite(gameKey, 181), imgS: ({ gameKey }) => shinySprite(gameKey, 181), tags: ["mega"] },
		{ id: 130, natiId: 127, name: "Pinsir", img: ({ gameKey }) => baseSprite(gameKey, 127), imgS: ({ gameKey }) => shinySprite(gameKey, 127), tags: ["mega"] },
		{
			id: 131, natiId: 214, name: "Heracross", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0214-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0214-f"), },]
		},
		{
			id: 132, natiId: 417, name: "Pachirisu", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0417-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0417-f"), },
			]
		},
		{ id: 133, natiId: 79, name: "Slowpoke", img: ({ gameKey }) => baseSprite(gameKey, 79), imgS: ({ gameKey }) => shinySprite(gameKey, 79) },
		{ id: 134, natiId: 80, name: "Slowbro", img: ({ gameKey }) => baseSprite(gameKey, 80), imgS: ({ gameKey }) => shinySprite(gameKey, 80) },
		{ id: 135, natiId: 199, name: "Slowking", img: ({ gameKey }) => baseSprite(gameKey, 199), imgS: ({ gameKey }) => shinySprite(gameKey, 199) },
		{ id: 136, natiId: 102, name: "Exeggcute", img: ({ gameKey }) => baseSprite(gameKey, 102), imgS: ({ gameKey }) => shinySprite(gameKey, 102) },
		{ id: 137, natiId: 103, name: "Exeggutor", img: ({ gameKey }) => baseSprite(gameKey, 103), imgS: ({ gameKey }) => shinySprite(gameKey, 103) },
		{ id: 138, natiId: 441, name: "Chatot", img: ({ gameKey }) => baseSprite(gameKey, 441), imgS: ({ gameKey }) => shinySprite(gameKey, 441) },
		{ id: 139, natiId: 458, name: "Mantyke", img: ({ gameKey }) => baseSprite(gameKey, 458), imgS: ({ gameKey }) => shinySprite(gameKey, 458) },
		{ id: 140, natiId: 226, name: "Mantine", img: ({ gameKey }) => baseSprite(gameKey, 226), imgS: ({ gameKey }) => shinySprite(gameKey, 226) },
		{ id: 141, natiId: 366, name: "Clamperl", img: ({ gameKey }) => baseSprite(gameKey, 366), imgS: ({ gameKey }) => shinySprite(gameKey, 366) },
		{ id: 142, natiId: 367, name: "Huntail", img: ({ gameKey }) => baseSprite(gameKey, 367), imgS: ({ gameKey }) => shinySprite(gameKey, 367) },
		{ id: 143, natiId: 368, name: "Gorebyss", img: ({ gameKey }) => baseSprite(gameKey, 368), imgS: ({ gameKey }) => shinySprite(gameKey, 368) },
		{ id: 144, natiId: 223, name: "Remoraid", img: ({ gameKey }) => baseSprite(gameKey, 223), imgS: ({ gameKey }) => shinySprite(gameKey, 223) },
		{
			id: 145, natiId: 224, name: "Octillery", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0224-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0224-f"), },
			]
		},
		{ id: 146, natiId: 222, name: "Corsola", img: ({ gameKey }) => baseSprite(gameKey, 222), imgS: ({ gameKey }) => shinySprite(gameKey, 222) },
		{ id: 147, natiId: 170, name: "Chinchou", img: ({ gameKey }) => baseSprite(gameKey, 170), imgS: ({ gameKey }) => shinySprite(gameKey, 170) },
		{ id: 148, natiId: 171, name: "Lanturn", img: ({ gameKey }) => baseSprite(gameKey, 171), imgS: ({ gameKey }) => shinySprite(gameKey, 171) },
		{ id: 149, natiId: 594, name: "Alomomola", img: ({ gameKey }) => baseSprite(gameKey, 594), imgS: ({ gameKey }) => shinySprite(gameKey, 594) },
		{ id: 150, natiId: 131, name: "Lapras", img: ({ gameKey }) => baseSprite(gameKey, 131), imgS: ({ gameKey }) => shinySprite(gameKey, 131) },
		{ id: 151, natiId: 144, name: "Articuno", img: ({ gameKey }) => baseSprite(gameKey, 144), imgS: ({ gameKey }) => shinySprite(gameKey, 144), tags: ["legendary"] },
		{ id: 152, natiId: 145, name: "Zapdos", img: ({ gameKey }) => baseSprite(gameKey, 145), imgS: ({ gameKey }) => shinySprite(gameKey, 145), tags: ["legendary"] },
		{ id: 153, natiId: 146, name: "Moltres", img: ({ gameKey }) => baseSprite(gameKey, 146), imgS: ({ gameKey }) => shinySprite(gameKey, 146), tags: ["legendary"] },
	];

	window._registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();