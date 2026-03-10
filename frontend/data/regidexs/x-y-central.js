(() => {
	const gen = 6;
	const GAME_KEYS = ["x-central", "y-central"];
	const DEX_NAME = "Central Kalos Dex";

	const baseSprite = (gameKey, natiId) => window.dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => window.dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 650, name: "Chespin", img: ({ gameKey }) => baseSprite(gameKey, 650), imgS: ({ gameKey }) => shinySprite(gameKey, 650), tags: ["starter"] },
		{ id: 2, natiId: 651, name: "Quilladin", img: ({ gameKey }) => baseSprite(gameKey, 651), imgS: ({ gameKey }) => shinySprite(gameKey, 651), tags: ["starter"] },
		{ id: 3, natiId: 652, name: "Chesnaught", img: ({ gameKey }) => baseSprite(gameKey, 652), imgS: ({ gameKey }) => shinySprite(gameKey, 652), tags: ["starter"] },
		{ id: 4, natiId: 653, name: "Fennekin", img: ({ gameKey }) => baseSprite(gameKey, 653), imgS: ({ gameKey }) => shinySprite(gameKey, 653), tags: ["starter"] },
		{ id: 5, natiId: 654, name: "Braixen", img: ({ gameKey }) => baseSprite(gameKey, 654), imgS: ({ gameKey }) => shinySprite(gameKey, 654), tags: ["starter"] },
		{ id: 6, natiId: 655, name: "Delphox", img: ({ gameKey }) => baseSprite(gameKey, 655), imgS: ({ gameKey }) => shinySprite(gameKey, 655), tags: ["starter"] },
		{ id: 7, natiId: 656, name: "Froakie", img: ({ gameKey }) => baseSprite(gameKey, 656), imgS: ({ gameKey }) => shinySprite(gameKey, 656), tags: ["starter"] },
		{ id: 8, natiId: 657, name: "Frogadier", img: ({ gameKey }) => baseSprite(gameKey, 657), imgS: ({ gameKey }) => shinySprite(gameKey, 657), tags: ["starter"] },
		{ id: 9, natiId: 658, name: "Greninja", img: ({ gameKey }) => baseSprite(gameKey, 658), imgS: ({ gameKey }) => shinySprite(gameKey, 658), tags: ["starter"] },
		{ id: 10, natiId: 659, name: "Bunnelby", img: ({ gameKey }) => baseSprite(gameKey, 659), imgS: ({ gameKey }) => shinySprite(gameKey, 659) },
		{ id: 11, natiId: 660, name: "Diggersby", img: ({ gameKey }) => baseSprite(gameKey, 660), imgS: ({ gameKey }) => shinySprite(gameKey, 660) },
		{ id: 12, natiId: 263, name: "Zigzagoon", img: ({ gameKey }) => baseSprite(gameKey, 263), imgS: ({ gameKey }) => shinySprite(gameKey, 263) },
		{ id: 13, natiId: 264, name: "Linoone", img: ({ gameKey }) => baseSprite(gameKey, 264), imgS: ({ gameKey }) => shinySprite(gameKey, 264) },
		{ id: 14, natiId: 661, name: "Fletchling", img: ({ gameKey }) => baseSprite(gameKey, 661), imgS: ({ gameKey }) => shinySprite(gameKey, 661) },
		{ id: 15, natiId: 662, name: "Fletchinder", img: ({ gameKey }) => baseSprite(gameKey, 662), imgS: ({ gameKey }) => shinySprite(gameKey, 662) },
		{ id: 16, natiId: 663, name: "Talonflame", img: ({ gameKey }) => baseSprite(gameKey, 663), imgS: ({ gameKey }) => shinySprite(gameKey, 663) },
		{ id: 17, natiId: 16, name: "Pidgey", img: ({ gameKey }) => baseSprite(gameKey, 16), imgS: ({ gameKey }) => shinySprite(gameKey, 16) },
		{ id: 18, natiId: 17, name: "Pidgeotto", img: ({ gameKey }) => baseSprite(gameKey, 17), imgS: ({ gameKey }) => shinySprite(gameKey, 17) },
		{ id: 19, natiId: 18, name: "Pidgeot", img: ({ gameKey }) => baseSprite(gameKey, 18), imgS: ({ gameKey }) => shinySprite(gameKey, 18) },
		{ id: 20, natiId: 664, name: "Scatterbug", img: ({ gameKey }) => baseSprite(gameKey, 664), imgS: ({ gameKey }) => shinySprite(gameKey, 664) },
		{ id: 21, natiId: 665, name: "Spewpa", img: ({ gameKey }) => baseSprite(gameKey, 665), imgS: ({ gameKey }) => shinySprite(gameKey, 665) },
		{
			id: 22, natiId: 666, name: "Vivillon", img: ({ gameKey }) => baseSprite(gameKey, 666), imgS: ({ gameKey }) => shinySprite(gameKey, 666), tags: ["other"], forms: [
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
				{ name: "Poké Ball Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-pok"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-pok"), },]
		},
		{ id: 23, natiId: 10, name: "Caterpie", img: ({ gameKey }) => baseSprite(gameKey, 10), imgS: ({ gameKey }) => shinySprite(gameKey, 10) },
		{ id: 24, natiId: 11, name: "Metapod", img: ({ gameKey }) => baseSprite(gameKey, 11), imgS: ({ gameKey }) => shinySprite(gameKey, 11) },
		{
			id: 25, natiId: 12, name: "Butterfree", img: ({ gameKey }) => baseSprite(gameKey, 12), imgS: ({ gameKey }) => shinySprite(gameKey, 12), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 12), imgS: ({ gameKey }) => shinySprite(gameKey, 12), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0012-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0012-f"), },]
		},
		{ id: 26, natiId: 13, name: "Weedle", img: ({ gameKey }) => baseSprite(gameKey, 13), imgS: ({ gameKey }) => shinySprite(gameKey, 13) },
		{ id: 27, natiId: 14, name: "Kakuna", img: ({ gameKey }) => baseSprite(gameKey, 14), imgS: ({ gameKey }) => shinySprite(gameKey, 14) },
		{ id: 28, natiId: 15, name: "Beedrill", img: ({ gameKey }) => baseSprite(gameKey, 15), imgS: ({ gameKey }) => shinySprite(gameKey, 15) },
		{ id: 29, natiId: 511, name: "Pansage", img: ({ gameKey }) => baseSprite(gameKey, 511), imgS: ({ gameKey }) => shinySprite(gameKey, 511) },
		{ id: 30, natiId: 512, name: "Simisage", img: ({ gameKey }) => baseSprite(gameKey, 512), imgS: ({ gameKey }) => shinySprite(gameKey, 512) },
		{ id: 31, natiId: 513, name: "Pansear", img: ({ gameKey }) => baseSprite(gameKey, 513), imgS: ({ gameKey }) => shinySprite(gameKey, 513) },
		{ id: 32, natiId: 514, name: "Simisear", img: ({ gameKey }) => baseSprite(gameKey, 514), imgS: ({ gameKey }) => shinySprite(gameKey, 514) },
		{ id: 33, natiId: 515, name: "Panpour", img: ({ gameKey }) => baseSprite(gameKey, 515), imgS: ({ gameKey }) => shinySprite(gameKey, 515) },
		{ id: 34, natiId: 516, name: "Simipour", img: ({ gameKey }) => baseSprite(gameKey, 516), imgS: ({ gameKey }) => shinySprite(gameKey, 516) },
		{ id: 35, natiId: 172, name: "Pichu", img: ({ gameKey }) => baseSprite(gameKey, 172), imgS: ({ gameKey }) => shinySprite(gameKey, 172) },
		{
			id: 36, natiId: 25, name: "Pikachu", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0025-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-f"), },]
		},
		{
			id: 37, natiId: 26, name: "Raichu", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0026-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-f"), },]
		},
		{
			id: 38, natiId: 399, name: "Bidoof", img: ({ gameKey }) => baseSprite(gameKey, 399), imgS: ({ gameKey }) => shinySprite(gameKey, 399), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 399), imgS: ({ gameKey }) => shinySprite(gameKey, 399), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0399-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0399-f"), },
			]
		},
		{
			id: 39, natiId: 400, name: "Bibarel", img: ({ gameKey }) => baseSprite(gameKey, 400), imgS: ({ gameKey }) => shinySprite(gameKey, 400), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 400), imgS: ({ gameKey }) => shinySprite(gameKey, 400), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0400-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0400-f"), },
			]
		},
		{ id: 40, natiId: 206, name: "Dunsparce", img: ({ gameKey }) => baseSprite(gameKey, 206), imgS: ({ gameKey }) => shinySprite(gameKey, 206) },
		{ id: 41, natiId: 298, name: "Azurill", img: ({ gameKey }) => baseSprite(gameKey, 298), imgS: ({ gameKey }) => shinySprite(gameKey, 298) },
		{ id: 42, natiId: 183, name: "Marill", img: ({ gameKey }) => baseSprite(gameKey, 183), imgS: ({ gameKey }) => shinySprite(gameKey, 183) },
		{ id: 43, natiId: 184, name: "Azumarill", img: ({ gameKey }) => baseSprite(gameKey, 184), imgS: ({ gameKey }) => shinySprite(gameKey, 184) },
		{
			id: 44, natiId: 412, name: "Burmy", img: ({ gameKey }) => baseSprite(gameKey, 412), imgS: ({ gameKey }) => shinySprite(gameKey, 412), tags: ["other"], forms: [
				{ name: "Plant Cloak", img: ({ gameKey }) => baseSprite(gameKey, 412), imgS: ({ gameKey }) => shinySprite(gameKey, 412), },
				{ name: "Sandy Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0412-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0412-s"), },
				{ name: "Trash Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0412-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0412-t"), },
			]
		},
		{
			id: 45, natiId: 413, name: "Wormadam", img: ({ gameKey }) => baseSprite(gameKey, 413), imgS: ({ gameKey }) => shinySprite(gameKey, 413), tags: ["other"], forms: [
				{ name: "Plant Cloak", img: ({ gameKey }) => baseSprite(gameKey, 413), imgS: ({ gameKey }) => shinySprite(gameKey, 413), },
				{ name: "Sandy Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0413-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0413-s"), },
				{ name: "Trash Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0413-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0413-t"), },
			]
		},
		{ id: 46, natiId: 414, name: "Mothim", img: ({ gameKey }) => baseSprite(gameKey, 414), imgS: ({ gameKey }) => shinySprite(gameKey, 414) },
		{ id: 47, natiId: 283, name: "Surskit", img: ({ gameKey }) => baseSprite(gameKey, 283), imgS: ({ gameKey }) => shinySprite(gameKey, 283) },
		{ id: 48, natiId: 284, name: "Masquerain", img: ({ gameKey }) => baseSprite(gameKey, 284), imgS: ({ gameKey }) => shinySprite(gameKey, 284) },
		{
			id: 49, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), },]
		},
		{
			id: 50, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },]
		},
		{ id: 51, natiId: 341, name: "Corphish", img: ({ gameKey }) => baseSprite(gameKey, 341), imgS: ({ gameKey }) => shinySprite(gameKey, 341) },
		{ id: 52, natiId: 342, name: "Crawdaunt", img: ({ gameKey }) => baseSprite(gameKey, 342), imgS: ({ gameKey }) => shinySprite(gameKey, 342) },
		{
			id: 53, natiId: 118, name: "Goldeen", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 118), imgS: ({ gameKey }) => shinySprite(gameKey, 118), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0118-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0118-f"), },]
		},
		{
			id: 54, natiId: 119, name: "Seaking", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 119), imgS: ({ gameKey }) => shinySprite(gameKey, 119), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0119-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0119-f"), },]
		},
		{ id: 55, natiId: 318, name: "Carvanha", img: ({ gameKey }) => baseSprite(gameKey, 318), imgS: ({ gameKey }) => shinySprite(gameKey, 318) },
		{ id: 56, natiId: 319, name: "Sharpedo", img: ({ gameKey }) => baseSprite(gameKey, 319), imgS: ({ gameKey }) => shinySprite(gameKey, 319) },
		{ id: 57, natiId: 667, name: "Litleo", img: ({ gameKey }) => baseSprite(gameKey, 667), imgS: ({ gameKey }) => shinySprite(gameKey, 667) },
		{
			id: 58, natiId: 668, name: "Pyroar", img: ({ gameKey }) => baseSprite(gameKey, 668), imgS: ({ gameKey }) => shinySprite(gameKey, 668), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 668), imgS: ({ gameKey }) => shinySprite(gameKey, 668), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0668-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0668-f"), },
			]
		},
		{ id: 59, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54) },
		{ id: 60, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55) },
		{ id: 61, natiId: 83, name: "Farfetch'd", img: ({ gameKey }) => baseSprite(gameKey, 83), imgS: ({ gameKey }) => shinySprite(gameKey, 83) },
		{ id: 62, natiId: 447, name: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447), imgS: ({ gameKey }) => shinySprite(gameKey, 447) },
		{ id: 63, natiId: 448, name: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), imgS: ({ gameKey }) => shinySprite(gameKey, 448), tags: ["mega"] },
		{ id: 64, natiId: 280, name: "Ralts", img: ({ gameKey }) => baseSprite(gameKey, 280), imgS: ({ gameKey }) => shinySprite(gameKey, 280) },
		{ id: 65, natiId: 281, name: "Kirlia", img: ({ gameKey }) => baseSprite(gameKey, 281), imgS: ({ gameKey }) => shinySprite(gameKey, 281) },
		{ id: 66, natiId: 282, name: "Gardevoir", img: ({ gameKey }) => baseSprite(gameKey, 282), imgS: ({ gameKey }) => shinySprite(gameKey, 282), tags: ["mega"] },
		{ id: 67, natiId: 475, name: "Gallade", img: ({ gameKey }) => baseSprite(gameKey, 475), imgS: ({ gameKey }) => shinySprite(gameKey, 475) },
		{
			id: 68, natiId: 669, name: "Flabébé", img: ({ gameKey }) => baseSprite(gameKey, 669), imgS: ({ gameKey }) => shinySprite(gameKey, 669), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 669), imgS: ({ gameKey }) => shinySprite(gameKey, 669), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-w"), },]
		},
		{
			id: 69, natiId: 670, name: "Floette", img: ({ gameKey }) => baseSprite(gameKey, 670), imgS: ({ gameKey }) => shinySprite(gameKey, 670), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 670), imgS: ({ gameKey }) => shinySprite(gameKey, 670), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-w"), },]
		},
		{
			id: 70, natiId: 671, name: "Florges", img: ({ gameKey }) => baseSprite(gameKey, 671), imgS: ({ gameKey }) => shinySprite(gameKey, 671), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 671), imgS: ({ gameKey }) => shinySprite(gameKey, 671), },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-o"), },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-y"), },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-b"), },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-w"), },]
		},
		{ id: 71, natiId: 406, name: "Budew", img: ({ gameKey }) => baseSprite(gameKey, 406), imgS: ({ gameKey }) => shinySprite(gameKey, 406) },
		{
			id: 72, natiId: 315, name: "Roselia", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0315-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0315-f"), },
			]
		},
		{
			id: 73, natiId: 407, name: "Roserade", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0407-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0407-f"), },
			]
		},
		{
			id: 74, natiId: 165, name: "Ledyba", img: ({ gameKey }) => baseSprite(gameKey, 165), imgS: ({ gameKey }) => shinySprite(gameKey, 165), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 165), imgS: ({ gameKey }) => shinySprite(gameKey, 165), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0165-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0165-f"), },
			]
		},
		{
			id: 75, natiId: 166, name: "Ledian", img: ({ gameKey }) => baseSprite(gameKey, 166), imgS: ({ gameKey }) => shinySprite(gameKey, 166), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 166), imgS: ({ gameKey }) => shinySprite(gameKey, 166), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0166-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0166-f"), },
			]
		},
		{
			id: 76, natiId: 415, name: "Combee", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0415-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0415-f"), },
			]
		},
		{ id: 77, natiId: 416, name: "Vespiquen", img: ({ gameKey }) => baseSprite(gameKey, 416), imgS: ({ gameKey }) => shinySprite(gameKey, 416) },
		{ id: 78, natiId: 300, name: "Skitty", img: ({ gameKey }) => baseSprite(gameKey, 300), imgS: ({ gameKey }) => shinySprite(gameKey, 300) },
		{ id: 79, natiId: 301, name: "Delcatty", img: ({ gameKey }) => baseSprite(gameKey, 301), imgS: ({ gameKey }) => shinySprite(gameKey, 301) },
		{ id: 80, natiId: 1, name: "Bulbasaur", img: ({ gameKey }) => baseSprite(gameKey, 1), imgS: ({ gameKey }) => shinySprite(gameKey, 1) },
		{ id: 81, natiId: 2, name: "Ivysaur", img: ({ gameKey }) => baseSprite(gameKey, 2), imgS: ({ gameKey }) => shinySprite(gameKey, 2) },
		{
			id: 82, natiId: 3, name: "Venusaur", img: ({ gameKey }) => baseSprite(gameKey, 3), imgS: ({ gameKey }) => shinySprite(gameKey, 3), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 3), imgS: ({ gameKey }) => shinySprite(gameKey, 3), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0003-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0003-f"), },]
		},
		{ id: 83, natiId: 4, name: "Charmander", img: ({ gameKey }) => baseSprite(gameKey, 4), imgS: ({ gameKey }) => shinySprite(gameKey, 4) },
		{ id: 84, natiId: 5, name: "Charmeleon", img: ({ gameKey }) => baseSprite(gameKey, 5), imgS: ({ gameKey }) => shinySprite(gameKey, 5) },
		{ id: 85, natiId: 6, name: "Charizard", img: ({ gameKey }) => baseSprite(gameKey, 6), imgS: ({ gameKey }) => shinySprite(gameKey, 6), tags: ["mega"] },
		{ id: 86, natiId: 7, name: "Squirtle", img: ({ gameKey }) => baseSprite(gameKey, 7), imgS: ({ gameKey }) => shinySprite(gameKey, 7) },
		{ id: 87, natiId: 8, name: "Wartortle", img: ({ gameKey }) => baseSprite(gameKey, 8), imgS: ({ gameKey }) => shinySprite(gameKey, 8) },
		{ id: 88, natiId: 9, name: "Blastoise", img: ({ gameKey }) => baseSprite(gameKey, 9), imgS: ({ gameKey }) => shinySprite(gameKey, 9), tags: ["mega"] },
		{ id: 89, natiId: 672, name: "Skiddo", img: ({ gameKey }) => baseSprite(gameKey, 672), imgS: ({ gameKey }) => shinySprite(gameKey, 672) },
		{ id: 90, natiId: 673, name: "Gogoat", img: ({ gameKey }) => baseSprite(gameKey, 673), imgS: ({ gameKey }) => shinySprite(gameKey, 673) },
		{ id: 91, natiId: 674, name: "Pancham", img: ({ gameKey }) => baseSprite(gameKey, 674), imgS: ({ gameKey }) => shinySprite(gameKey, 674) },
		{ id: 92, natiId: 675, name: "Pangoro", img: ({ gameKey }) => baseSprite(gameKey, 675), imgS: ({ gameKey }) => shinySprite(gameKey, 675) },
		{
			id: 93, natiId: 676, name: "Furfrou", img: ({ gameKey }) => baseSprite(gameKey, 676), imgS: ({ gameKey }) => shinySprite(gameKey, 676), tags: ["other"], forms: [
				{ name: "Natural Trim", img: ({ gameKey }) => baseSprite(gameKey, 676), imgS: ({ gameKey }) => shinySprite(gameKey, 676), },
				{ name: "Heart Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-he"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-he"), },
				{ name: "Star Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-st"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-st"), },
				{ name: "Diamond Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-di"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-di"), },
				{ name: "Debutante Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-de"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-de"), },
				{ name: "Matron Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-ma"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-ma"), },
				{ name: "Dandy Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-da"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-da"), },
				{ name: "Le Reine Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-la"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-la"), },
				{ name: "Kabuki Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-ka"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-ka"), },
				{ name: "Pharaoh Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-ph"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-ph"), },]
		},
		{
			id: 94, natiId: 84, name: "Doduo", img: ({ gameKey }) => baseSprite(gameKey, 84), imgS: ({ gameKey }) => shinySprite(gameKey, 84), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 84), imgS: ({ gameKey }) => shinySprite(gameKey, 84), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0084-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0084-f"), },]
		},
		{
			id: 95, natiId: 85, name: "Dodrio", img: ({ gameKey }) => baseSprite(gameKey, 85), imgS: ({ gameKey }) => shinySprite(gameKey, 85), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 85), imgS: ({ gameKey }) => shinySprite(gameKey, 85), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0085-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0085-f"), },]
		},
		{ id: 96, natiId: 311, name: "Plusle", img: ({ gameKey }) => baseSprite(gameKey, 311), imgS: ({ gameKey }) => shinySprite(gameKey, 311) },
		{ id: 97, natiId: 312, name: "Minun", img: ({ gameKey }) => baseSprite(gameKey, 312), imgS: ({ gameKey }) => shinySprite(gameKey, 312) },
		{
			id: 98, natiId: 316, name: "Gulpin", img: ({ gameKey }) => baseSprite(gameKey, 316), imgS: ({ gameKey }) => shinySprite(gameKey, 316), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 316), imgS: ({ gameKey }) => shinySprite(gameKey, 316), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0316-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0316-f"), },
			]
		},
		{
			id: 99, natiId: 317, name: "Swalot", img: ({ gameKey }) => baseSprite(gameKey, 317), imgS: ({ gameKey }) => shinySprite(gameKey, 317), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 317), imgS: ({ gameKey }) => shinySprite(gameKey, 317), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0317-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0317-f"), },
			]
		},
		{ id: 100, natiId: 559, name: "Scraggy", img: ({ gameKey }) => baseSprite(gameKey, 559), imgS: ({ gameKey }) => shinySprite(gameKey, 559) },
		{ id: 101, natiId: 560, name: "Scrafty", img: ({ gameKey }) => baseSprite(gameKey, 560), imgS: ({ gameKey }) => shinySprite(gameKey, 560) },
		{ id: 102, natiId: 63, name: "Abra", img: ({ gameKey }) => baseSprite(gameKey, 63), imgS: ({ gameKey }) => shinySprite(gameKey, 63) },
		{
			id: 103, natiId: 64, name: "Kadabra", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0064-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0064-f"), },]
		},
		{
			id: 104, natiId: 65, name: "Alakazam", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0065-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0065-f"), },]
		},
		{ id: 105, natiId: 43, name: "Oddish", img: ({ gameKey }) => baseSprite(gameKey, 43), imgS: ({ gameKey }) => shinySprite(gameKey, 43) },
		{
			id: 106, natiId: 44, name: "Gloom", img: ({ gameKey }) => baseSprite(gameKey, 44), imgS: ({ gameKey }) => shinySprite(gameKey, 44), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 44), imgS: ({ gameKey }) => shinySprite(gameKey, 44), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0044-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0044-f"), },]
		},
		{
			id: 107, natiId: 45, name: "Vileplume", img: ({ gameKey }) => baseSprite(gameKey, 45), imgS: ({ gameKey }) => shinySprite(gameKey, 45), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 45), imgS: ({ gameKey }) => shinySprite(gameKey, 45), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0045-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0045-f"), },]
		},
		{ id: 108, natiId: 182, name: "Bellossom", img: ({ gameKey }) => baseSprite(gameKey, 182), imgS: ({ gameKey }) => shinySprite(gameKey, 182) },
		{ id: 109, natiId: 161, name: "Sentret", img: ({ gameKey }) => baseSprite(gameKey, 161), imgS: ({ gameKey }) => shinySprite(gameKey, 161) },
		{ id: 110, natiId: 162, name: "Furret", img: ({ gameKey }) => baseSprite(gameKey, 162), imgS: ({ gameKey }) => shinySprite(gameKey, 162) },
		{ id: 111, natiId: 290, name: "Nincada", img: ({ gameKey }) => baseSprite(gameKey, 290), imgS: ({ gameKey }) => shinySprite(gameKey, 290) },
		{ id: 112, natiId: 291, name: "Ninjask", img: ({ gameKey }) => baseSprite(gameKey, 291), imgS: ({ gameKey }) => shinySprite(gameKey, 291) },
		{ id: 113, natiId: 292, name: "Shedinja", img: ({ gameKey }) => baseSprite(gameKey, 292), imgS: ({ gameKey }) => shinySprite(gameKey, 292) },
		{ id: 114, natiId: 677, name: "Espurr", img: ({ gameKey }) => baseSprite(gameKey, 677), imgS: ({ gameKey }) => shinySprite(gameKey, 677) },
		{
			id: 115, natiId: 678, name: "Meowstic", img: ({ gameKey }) => baseSprite(gameKey, 678), imgS: ({ gameKey }) => shinySprite(gameKey, 678), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 678), imgS: ({ gameKey }) => shinySprite(gameKey, 678), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0678-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0678-f"), },
			]
		},
		{ id: 116, natiId: 352, name: "Kecleon", img: ({ gameKey }) => baseSprite(gameKey, 352), imgS: ({ gameKey }) => shinySprite(gameKey, 352) },
		{ id: 117, natiId: 679, name: "Honedge", img: ({ gameKey }) => baseSprite(gameKey, 679), imgS: ({ gameKey }) => shinySprite(gameKey, 679) },
		{ id: 118, natiId: 680, name: "Doublade", img: ({ gameKey }) => baseSprite(gameKey, 680), imgS: ({ gameKey }) => shinySprite(gameKey, 680) },
		{ id: 119, natiId: 681, name: "Aegislash", img: ({ gameKey }) => baseSprite(gameKey, 681), imgS: ({ gameKey }) => shinySprite(gameKey, 681) },
		{ id: 120, natiId: 543, name: "Venipede", img: ({ gameKey }) => baseSprite(gameKey, 543), imgS: ({ gameKey }) => shinySprite(gameKey, 543) },
		{ id: 121, natiId: 544, name: "Whirlipede", img: ({ gameKey }) => baseSprite(gameKey, 544), imgS: ({ gameKey }) => shinySprite(gameKey, 544) },
		{ id: 122, natiId: 545, name: "Scolipede", img: ({ gameKey }) => baseSprite(gameKey, 545), imgS: ({ gameKey }) => shinySprite(gameKey, 545) },
		{ id: 123, natiId: 531, name: "Audino", img: ({ gameKey }) => baseSprite(gameKey, 531), imgS: ({ gameKey }) => shinySprite(gameKey, 531) },
		{ id: 124, natiId: 235, name: "Smeargle", img: ({ gameKey }) => baseSprite(gameKey, 235), imgS: ({ gameKey }) => shinySprite(gameKey, 235) },
		{
			id: 125, natiId: 453, name: "Croagunk", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0453-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0453-f"), },
			]
		},
		{
			id: 126, natiId: 454, name: "Toxicroak", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0454-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0454-f"), },
			]
		},
		{ id: 127, natiId: 580, name: "Ducklett", img: ({ gameKey }) => baseSprite(gameKey, 580), imgS: ({ gameKey }) => shinySprite(gameKey, 580) },
		{ id: 128, natiId: 581, name: "Swanna", img: ({ gameKey }) => baseSprite(gameKey, 581), imgS: ({ gameKey }) => shinySprite(gameKey, 581) },
		{ id: 129, natiId: 682, name: "Spritzee", img: ({ gameKey }) => baseSprite(gameKey, 682), imgS: ({ gameKey }) => shinySprite(gameKey, 682) },
		{ id: 130, natiId: 683, name: "Aromatisse", img: ({ gameKey }) => baseSprite(gameKey, 683), imgS: ({ gameKey }) => shinySprite(gameKey, 683) },
		{ id: 131, natiId: 684, name: "Swirlix", img: ({ gameKey }) => baseSprite(gameKey, 684), imgS: ({ gameKey }) => shinySprite(gameKey, 684) },
		{ id: 132, natiId: 685, name: "Slurpuff", img: ({ gameKey }) => baseSprite(gameKey, 685), imgS: ({ gameKey }) => shinySprite(gameKey, 685) },
		{ id: 133, natiId: 313, name: "Volbeat", img: ({ gameKey }) => baseSprite(gameKey, 313), imgS: ({ gameKey }) => shinySprite(gameKey, 313) },
		{ id: 134, natiId: 314, name: "Illumise", img: ({ gameKey }) => baseSprite(gameKey, 314), imgS: ({ gameKey }) => shinySprite(gameKey, 314) },
		{ id: 135, natiId: 187, name: "Hoppip", img: ({ gameKey }) => baseSprite(gameKey, 187), imgS: ({ gameKey }) => shinySprite(gameKey, 187) },
		{ id: 136, natiId: 188, name: "Skiploom", img: ({ gameKey }) => baseSprite(gameKey, 188), imgS: ({ gameKey }) => shinySprite(gameKey, 188) },
		{ id: 137, natiId: 189, name: "Jumpluff", img: ({ gameKey }) => baseSprite(gameKey, 189), imgS: ({ gameKey }) => shinySprite(gameKey, 189) },
		{ id: 138, natiId: 446, name: "Munchlax", img: ({ gameKey }) => baseSprite(gameKey, 446), imgS: ({ gameKey }) => shinySprite(gameKey, 446) },
		{ id: 139, natiId: 143, name: "Snorlax", img: ({ gameKey }) => baseSprite(gameKey, 143), imgS: ({ gameKey }) => shinySprite(gameKey, 143) },
		{ id: 140, natiId: 293, name: "Whismur", img: ({ gameKey }) => baseSprite(gameKey, 293), imgS: ({ gameKey }) => shinySprite(gameKey, 293) },
		{ id: 141, natiId: 294, name: "Loudred", img: ({ gameKey }) => baseSprite(gameKey, 294), imgS: ({ gameKey }) => shinySprite(gameKey, 294) },
		{ id: 142, natiId: 295, name: "Exploud", img: ({ gameKey }) => baseSprite(gameKey, 295), imgS: ({ gameKey }) => shinySprite(gameKey, 295) },
		{
			id: 143, natiId: 307, name: "Meditite", img: ({ gameKey }) => baseSprite(gameKey, 307), imgS: ({ gameKey }) => shinySprite(gameKey, 307), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 307), imgS: ({ gameKey }) => shinySprite(gameKey, 307), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0307-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0307-f"), },
			]
		},
		{
			id: 144, natiId: 308, name: "Medicham", img: ({ gameKey }) => baseSprite(gameKey, 308), imgS: ({ gameKey }) => shinySprite(gameKey, 308), tags: ["gender", "mega"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 308), imgS: ({ gameKey }) => shinySprite(gameKey, 308), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0308-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0308-f"), },]
		},
		{
			id: 145, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), },]
		},
		{
			id: 146, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), },]
		},
		{ id: 147, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169) },
		{ id: 148, natiId: 610, name: "Axew", img: ({ gameKey }) => baseSprite(gameKey, 610), imgS: ({ gameKey }) => shinySprite(gameKey, 610) },
		{ id: 149, natiId: 611, name: "Fraxure", img: ({ gameKey }) => baseSprite(gameKey, 611), imgS: ({ gameKey }) => shinySprite(gameKey, 611) },
		{ id: 150, natiId: 612, name: "Haxorus", img: ({ gameKey }) => baseSprite(gameKey, 612), imgS: ({ gameKey }) => shinySprite(gameKey, 612) },
		{ id: 151, natiId: 719, name: "Diancie", img: ({ gameKey }) => baseSprite(gameKey, 719), imgS: ({ gameKey }) => shinySprite(gameKey, 719), maxStatus: "caught", tags: ["mythical"] },
		{
			id: 152, natiId: 720, name: "Hoopa", img: ({ gameKey }) => baseSprite(gameKey, 720), imgS: ({ gameKey }) => shinySprite(gameKey, 720), maxStatus: "caught", tags: ["other", "mythical"], forms: [
				{ name: "Confined", img: ({ gameKey }) => baseSprite(gameKey, 720), imgS: ({ gameKey }) => shinySprite(gameKey, 720), maxStatus: "caught", tags: ["mythical"] },
				{ name: "Unbound", img: ({ gameKey }) => baseSprite(gameKey, "0720-u"), imgS: ({ gameKey }) => shinySprite(gameKey, "0720-u"), maxStatus: "caught", tags: ["mythical"] },
			]
		},
		{ id: 153, natiId: 721, name: "Volcanion", img: ({ gameKey }) => baseSprite(gameKey, 721), imgS: ({ gameKey }) => shinySprite(gameKey, 721), maxStatus: "caught", tags: ["mythical"] },
	];

	window._registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();