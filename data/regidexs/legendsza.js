import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 9.5;
	const GAME_KEYS = ["legendsza"];
	const DEX_NAME = "Lumiose Dex";

	const baseSprite = (gameKey, natiId) => dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{ id: 1, natiId: 152, name: "Chikorita", img: ({ gameKey }) => baseSprite(gameKey, 152), imgS: ({ gameKey }) => shinySprite(gameKey, 152), tags: ["starter"], },
		{ id: 2, natiId: 153, name: "Bayleef", img: ({ gameKey }) => baseSprite(gameKey, 153), imgS: ({ gameKey }) => shinySprite(gameKey, 153), tags: ["starter"] },
		{
			id: 3, natiId: 154, name: "Meganium", img: ({ gameKey }) => baseSprite(gameKey, 154), imgS: ({ gameKey }) => shinySprite(gameKey, 154), tags: ["gender", "starter", "mega"], forms: [
				{ name: "Male (Longer Antennae)", img: ({ gameKey }) => baseSprite(gameKey, 154), imgS: ({ gameKey }) => shinySprite(gameKey, 154) },
				{ name: "Female (Smaller Antennae)", img: ({ gameKey }) => baseSprite(gameKey, "0154-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0154-f") },
			],
		},
		{ id: 4, natiId: 498, name: "Tepig", img: ({ gameKey }) => baseSprite(gameKey, 498), imgS: ({ gameKey }) => shinySprite(gameKey, 498), tags: ["starter"] },
		{ id: 5, natiId: 499, name: "Pignite", img: ({ gameKey }) => baseSprite(gameKey, 499), imgS: ({ gameKey }) => shinySprite(gameKey, 499), tags: ["starter"] },
		{ id: 6, natiId: 500, name: "Emboar", img: ({ gameKey }) => baseSprite(gameKey, 500), imgS: ({ gameKey }) => shinySprite(gameKey, 500), tags: ["starter", "mega"] },
		{ id: 7, natiId: 158, name: "Totodile", img: ({ gameKey }) => baseSprite(gameKey, 158), imgS: ({ gameKey }) => shinySprite(gameKey, 158), tags: ["starter"] },
		{ id: 8, natiId: 159, name: "Croconaw", img: ({ gameKey }) => baseSprite(gameKey, 159), imgS: ({ gameKey }) => shinySprite(gameKey, 159), tags: ["starter"] },
		{ id: 9, natiId: 160, name: "Feraligatr", img: ({ gameKey }) => baseSprite(gameKey, 160), imgS: ({ gameKey }) => shinySprite(gameKey, 160), tags: ["starter", "mega"] },
		{ id: 10, natiId: 661, name: "Fletchling", img: ({ gameKey }) => baseSprite(gameKey, 661), imgS: ({ gameKey }) => shinySprite(gameKey, 661) },
		{ id: 11, natiId: 662, name: "Fletchinder", img: ({ gameKey }) => baseSprite(gameKey, 662), imgS: ({ gameKey }) => shinySprite(gameKey, 662) },
		{ id: 12, natiId: 663, name: "Talonflame", img: ({ gameKey }) => baseSprite(gameKey, 663), imgS: ({ gameKey }) => shinySprite(gameKey, 663) },
		{ id: 13, natiId: 659, name: "Bunnelby", img: ({ gameKey }) => baseSprite(gameKey, 659), imgS: ({ gameKey }) => shinySprite(gameKey, 659) },
		{ id: 14, natiId: 660, name: "Diggersby", img: ({ gameKey }) => baseSprite(gameKey, 660), imgS: ({ gameKey }) => shinySprite(gameKey, 660) },
		{ id: 15, natiId: 664, name: "Scatterbug", img: ({ gameKey }) => baseSprite(gameKey, 664), imgS: ({ gameKey }) => shinySprite(gameKey, 664) },
		{ id: 16, natiId: 665, name: "Spewpa", img: ({ gameKey }) => baseSprite(gameKey, 665), imgS: ({ gameKey }) => shinySprite(gameKey, 665) },
		{
			id: 17, natiId: 666, name: "Vivillon", img: ({ gameKey }) => baseSprite(gameKey, 666), imgS: ({ gameKey }) => shinySprite(gameKey, 666), tags: ["other"], forms: [
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
				{ name: "Poke Ball Pattern", img: ({ gameKey }) => baseSprite(gameKey, "0666-pok"), imgS: ({ gameKey }) => shinySprite(gameKey, "0666-pok"), maxStatus: "caught", },
			],
		},
		{ id: 18, natiId: 13, name: "Weedle", img: ({ gameKey }) => baseSprite(gameKey, 13), imgS: ({ gameKey }) => shinySprite(gameKey, 13) },
		{ id: 19, natiId: 14, name: "Kakuna", img: ({ gameKey }) => baseSprite(gameKey, 14), imgS: ({ gameKey }) => shinySprite(gameKey, 14) },
		{ id: 20, natiId: 15, name: "Beedrill", img: ({ gameKey }) => baseSprite(gameKey, 15), imgS: ({ gameKey }) => shinySprite(gameKey, 15), tags: ["mega"] },
		{ id: 21, natiId: 16, name: "Pidgey", img: ({ gameKey }) => baseSprite(gameKey, 16), imgS: ({ gameKey }) => shinySprite(gameKey, 16) },
		{ id: 22, natiId: 17, name: "Pidgeotto", img: ({ gameKey }) => baseSprite(gameKey, 17), imgS: ({ gameKey }) => shinySprite(gameKey, 17) },
		{ id: 23, natiId: 18, name: "Pidgeot", img: ({ gameKey }) => baseSprite(gameKey, 18), imgS: ({ gameKey }) => shinySprite(gameKey, 18), tags: ["mega"] },
		{ id: 24, natiId: 179, name: "Mareep", img: ({ gameKey }) => baseSprite(gameKey, 179), imgS: ({ gameKey }) => shinySprite(gameKey, 179) },
		{ id: 25, natiId: 180, name: "Flaaffy", img: ({ gameKey }) => baseSprite(gameKey, 180), imgS: ({ gameKey }) => shinySprite(gameKey, 180) },
		{ id: 26, natiId: 181, name: "Ampharos", img: ({ gameKey }) => baseSprite(gameKey, 181), imgS: ({ gameKey }) => shinySprite(gameKey, 181), tags: ["mega"] },
		{ id: 27, natiId: 504, name: "Patrat", img: ({ gameKey }) => baseSprite(gameKey, 504), imgS: ({ gameKey }) => shinySprite(gameKey, 504) },
		{ id: 28, natiId: 505, name: "Watchog", img: ({ gameKey }) => baseSprite(gameKey, 505), imgS: ({ gameKey }) => shinySprite(gameKey, 505) },
		{ id: 29, natiId: 406, name: "Budew", img: ({ gameKey }) => baseSprite(gameKey, 406), imgS: ({ gameKey }) => shinySprite(gameKey, 406) },
		{
			id: 30, natiId: 315, name: "Roselia", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315), tags: ["gender"], forms: [
				{ name: "Male (Smaller Body Leaf)", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315) },
				{ name: "Female (Larger Body Leaf)", img: ({ gameKey }) => baseSprite(gameKey, "0315-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0315-f") },
			],
		},
		{
			id: 31, natiId: 407, name: "Roserade", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407), tags: ["gender"], forms: [
				{ name: "Male (Smaller Cape)", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407) },
				{ name: "Female (Longer Cape)", img: ({ gameKey }) => baseSprite(gameKey, "0407-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0407-f") },
			],
		},
		{
			id: 32, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male (Yellow Wiskers)", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129) },
				{ name: "Female (White Wiskers)", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f") },
			],
		},
		{
			id: 33, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender", "mega"], forms: [
				{ name: "Male (Blue Wiskers)", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130) },
				{ name: "Female (White Wiskers)", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f") },
			],
		},
		{ id: 34, natiId: 688, name: "Binacle", img: ({ gameKey }) => baseSprite(gameKey, 688), imgS: ({ gameKey }) => shinySprite(gameKey, 688) },
		{ id: 35, natiId: 689, name: "Barbaracle", img: ({ gameKey }) => baseSprite(gameKey, 689), imgS: ({ gameKey }) => shinySprite(gameKey, 689), tags: ["mega"] },
		{ id: 36, natiId: 120, name: "Staryu", img: ({ gameKey }) => baseSprite(gameKey, 120), imgS: ({ gameKey }) => shinySprite(gameKey, 120) },
		{ id: 37, natiId: 121, name: "Starmie", img: ({ gameKey }) => baseSprite(gameKey, 121), imgS: ({ gameKey }) => shinySprite(gameKey, 121), tags: ["mega"] },
		{
			id: 38, natiId: 669, name: "Flabébé", img: ({ gameKey }) => baseSprite(gameKey, 669), imgS: ({ gameKey }) => shinySprite(gameKey, 669), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 669), imgS: ({ gameKey }) => shinySprite(gameKey, 669) },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-o") },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-y") },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-b") },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0669-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0669-w") },
			],
		},
		{
			id: 39, natiId: 670, name: "Floette", img: ({ gameKey }) => baseSprite(gameKey, 670), imgS: ({ gameKey }) => shinySprite(gameKey, 670), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 670), imgS: ({ gameKey }) => shinySprite(gameKey, 670) },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-o") },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-y") },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-b") },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-w") },
				{ name: "Eternal Flower", img: ({ gameKey }) => baseSprite(gameKey, "0670-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0670-e"), maxStatus: "caught", tags: ["mega"] },
			],
		},
		{
			id: 40, natiId: 671, name: "Florges", img: ({ gameKey }) => baseSprite(gameKey, 671), imgS: ({ gameKey }) => shinySprite(gameKey, 671), tags: ["other"], forms: [
				{ name: "Red Flower", img: ({ gameKey }) => baseSprite(gameKey, 671), imgS: ({ gameKey }) => shinySprite(gameKey, 671) },
				{ name: "Orange Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-o") },
				{ name: "Yellow Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-y") },
				{ name: "Blue Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-b") },
				{ name: "White Flower", img: ({ gameKey }) => baseSprite(gameKey, "0671-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0671-w") },
			],
		},
		{ id: 41, natiId: 672, name: "Skiddo", img: ({ gameKey }) => baseSprite(gameKey, 672), imgS: ({ gameKey }) => shinySprite(gameKey, 672) },
		{ id: 42, natiId: 673, name: "Gogoat", img: ({ gameKey }) => baseSprite(gameKey, 673), imgS: ({ gameKey }) => shinySprite(gameKey, 673) },
		{ id: 43, natiId: 677, name: "Espurr", img: ({ gameKey }) => baseSprite(gameKey, 677), imgS: ({ gameKey }) => shinySprite(gameKey, 677) },
		{
			id: 44, natiId: 678, name: "Meowstic", img: ({ gameKey }) => baseSprite(gameKey, 678), imgS: ({ gameKey }) => shinySprite(gameKey, 678), tags: ["gender"], forms: [
				{ name: "Male (Blue-White Pallete)", img: ({ gameKey }) => baseSprite(gameKey, 678), imgS: ({ gameKey }) => shinySprite(gameKey, 678) },
				{ name: "Female (White-Blue Pallete)", img: ({ gameKey }) => baseSprite(gameKey, "0678-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0678-f") },
			],
		},
		{ id: 45, natiId: 667, name: "Litleo", img: ({ gameKey }) => baseSprite(gameKey, 667), imgS: ({ gameKey }) => shinySprite(gameKey, 667) },
		{
			id: 46, natiId: 668, name: "Pyroar", img: ({ gameKey }) => baseSprite(gameKey, 668), imgS: ({ gameKey }) => shinySprite(gameKey, 668), tags: ["gender", "mega"], forms: [
				{ name: "Male (Kanji Mane)", img: ({ gameKey }) => baseSprite(gameKey, 668), imgS: ({ gameKey }) => shinySprite(gameKey, 668) },
				{ name: "Female (Ponytail)", img: ({ gameKey }) => baseSprite(gameKey, "0668-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0668-f") },
			],
		},
		{ id: 47, natiId: 674, name: "Pancham", img: ({ gameKey }) => baseSprite(gameKey, 674), imgS: ({ gameKey }) => shinySprite(gameKey, 674) },
		{ id: 48, natiId: 675, name: "Pangoro", img: ({ gameKey }) => baseSprite(gameKey, 675), imgS: ({ gameKey }) => shinySprite(gameKey, 675) },
		{ id: 49, natiId: 568, name: "Trubbish", img: ({ gameKey }) => baseSprite(gameKey, 568), imgS: ({ gameKey }) => shinySprite(gameKey, 568) },
		{ id: 50, natiId: 569, name: "Garbodor", img: ({ gameKey }) => baseSprite(gameKey, 569), imgS: ({ gameKey }) => shinySprite(gameKey, 569) },
		{ id: 51, natiId: 702, name: "Dedenne", img: ({ gameKey }) => baseSprite(gameKey, 702), imgS: ({ gameKey }) => shinySprite(gameKey, 702) },
		{ id: 52, natiId: 172, name: "Pichu", img: ({ gameKey }) => baseSprite(gameKey, 172), imgS: ({ gameKey }) => shinySprite(gameKey, 172) },
		{
			id: 53, natiId: 25, name: "Pikachu", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), tags: ["gender"], forms: [
				{ name: "Male (Sharp Tail)", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25) },
				{ name: "Female (Heart Tail)", img: ({ gameKey }) => baseSprite(gameKey, "0025-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-f") },
			],
		},
		{
			id: 54, natiId: 26, name: "Raichu", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), tags: ["gender"], forms: [
				{ name: "Kantonian Male (Sharp Tail)", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26) },
				{ name: "Kantonian Female (Blunt Tail)", img: ({ gameKey }) => baseSprite(gameKey, "0026-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-f") },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0026-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-a"), maxStatus: "caught", tags: ["alolan"] },
			],
		},
		{ id: 55, natiId: 173, name: "Cleffa", img: ({ gameKey }) => baseSprite(gameKey, 173), imgS: ({ gameKey }) => shinySprite(gameKey, 173) },
		{ id: 56, natiId: 35, name: "Clefairy", img: ({ gameKey }) => baseSprite(gameKey, 35), imgS: ({ gameKey }) => shinySprite(gameKey, 35) },
		{ id: 57, natiId: 36, name: "Clefable", img: ({ gameKey }) => baseSprite(gameKey, 36), imgS: ({ gameKey }) => shinySprite(gameKey, 36), tags: ["mega"] },
		{ id: 58, natiId: 167, name: "Spinarak", img: ({ gameKey }) => baseSprite(gameKey, 167), imgS: ({ gameKey }) => shinySprite(gameKey, 167) },
		{ id: 59, natiId: 168, name: "Ariados", img: ({ gameKey }) => baseSprite(gameKey, 168), imgS: ({ gameKey }) => shinySprite(gameKey, 168) },
		{ id: 60, natiId: 23, name: "Ekans", img: ({ gameKey }) => baseSprite(gameKey, 23), imgS: ({ gameKey }) => shinySprite(gameKey, 23) },
		{ id: 61, natiId: 24, name: "Arbok", img: ({ gameKey }) => baseSprite(gameKey, 24), imgS: ({ gameKey }) => shinySprite(gameKey, 24) },
		{ id: 62, natiId: 63, name: "Abra", img: ({ gameKey }) => baseSprite(gameKey, 63), imgS: ({ gameKey }) => shinySprite(gameKey, 63) },
		{
			id: 63, natiId: 64, name: "Kadabra", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), tags: ["gender"], forms: [
				{ name: "Male (Longer Wiskers)", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64) },
				{ name: "Female (Shorter Wiskers)", img: ({ gameKey }) => baseSprite(gameKey, "0064-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0064-f") },
			],
		},
		{
			id: 64, natiId: 65, name: "Alakazam", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), tags: ["gender", "mega"], forms: [
				{ name: "Male (Longer Wiskers)", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65) },
				{ name: "Female (Shorter Wiskers)", img: ({ gameKey }) => baseSprite(gameKey, "0065-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0065-f") },
			],
		},
		{ id: 65, natiId: 92, name: "Gastly", img: ({ gameKey }) => baseSprite(gameKey, 92), imgS: ({ gameKey }) => shinySprite(gameKey, 92) },
		{ id: 66, natiId: 93, name: "Haunter", img: ({ gameKey }) => baseSprite(gameKey, 93), imgS: ({ gameKey }) => shinySprite(gameKey, 93) },
		{ id: 67, natiId: 94, name: "Gengar", img: ({ gameKey }) => baseSprite(gameKey, 94), imgS: ({ gameKey }) => shinySprite(gameKey, 94), tags: ["mega"] },
		{ id: 68, natiId: 543, name: "Venipede", img: ({ gameKey }) => baseSprite(gameKey, 543), imgS: ({ gameKey }) => shinySprite(gameKey, 543) },
		{ id: 69, natiId: 544, name: "Whirlipede", img: ({ gameKey }) => baseSprite(gameKey, 544), imgS: ({ gameKey }) => shinySprite(gameKey, 544) },
		{ id: 70, natiId: 545, name: "Scolipede", img: ({ gameKey }) => baseSprite(gameKey, 545), imgS: ({ gameKey }) => shinySprite(gameKey, 545), tags: ["mega"] },
		{ id: 71, natiId: 679, name: "Honedge", img: ({ gameKey }) => baseSprite(gameKey, 679), imgS: ({ gameKey }) => shinySprite(gameKey, 679) },
		{ id: 72, natiId: 680, name: "Doublade", img: ({ gameKey }) => baseSprite(gameKey, 680), imgS: ({ gameKey }) => shinySprite(gameKey, 680) },
		{ id: 73, natiId: 681, name: "Aegislash", img: ({ gameKey }) => baseSprite(gameKey, 681), imgS: ({ gameKey }) => shinySprite(gameKey, 681) },
		{ id: 74, natiId: 69, name: "Bellsprout", img: ({ gameKey }) => baseSprite(gameKey, 69), imgS: ({ gameKey }) => shinySprite(gameKey, 69) },
		{ id: 75, natiId: 70, name: "Weepinbell", img: ({ gameKey }) => baseSprite(gameKey, 70), imgS: ({ gameKey }) => shinySprite(gameKey, 70) },
		{ id: 76, natiId: 71, name: "Victreebel", img: ({ gameKey }) => baseSprite(gameKey, 71), imgS: ({ gameKey }) => shinySprite(gameKey, 71), tags: ["mega"] },
		{ id: 77, natiId: 511, name: "Pansage", img: ({ gameKey }) => baseSprite(gameKey, 511), imgS: ({ gameKey }) => shinySprite(gameKey, 511) },
		{ id: 78, natiId: 512, name: "Simisage", img: ({ gameKey }) => baseSprite(gameKey, 512), imgS: ({ gameKey }) => shinySprite(gameKey, 512) },
		{ id: 79, natiId: 513, name: "Pansear", img: ({ gameKey }) => baseSprite(gameKey, 513), imgS: ({ gameKey }) => shinySprite(gameKey, 513) },
		{ id: 80, natiId: 514, name: "Simisear", img: ({ gameKey }) => baseSprite(gameKey, 514), imgS: ({ gameKey }) => shinySprite(gameKey, 514) },
		{ id: 81, natiId: 515, name: "Panpour", img: ({ gameKey }) => baseSprite(gameKey, 515), imgS: ({ gameKey }) => shinySprite(gameKey, 515) },
		{ id: 82, natiId: 516, name: "Simipour", img: ({ gameKey }) => baseSprite(gameKey, 516), imgS: ({ gameKey }) => shinySprite(gameKey, 516) },
		{
			id: 83, natiId: 307, name: "Meditite", img: ({ gameKey }) => baseSprite(gameKey, 307), imgS: ({ gameKey }) => shinySprite(gameKey, 307), tags: ["gender"], forms: [
				{ name: "Male (Higher Ears)", img: ({ gameKey }) => baseSprite(gameKey, 307), imgS: ({ gameKey }) => shinySprite(gameKey, 307) },
				{ name: "Female (Lower Ears)", img: ({ gameKey }) => baseSprite(gameKey, "0307-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0307-f") },
			],
		},
		{
			id: 84, natiId: 308, name: "Medicham", img: ({ gameKey }) => baseSprite(gameKey, 308), imgS: ({ gameKey }) => shinySprite(gameKey, 308), tags: ["gender", "mega"], forms: [
				{ name: "Male (Larger Head Blub)", img: ({ gameKey }) => baseSprite(gameKey, 308), imgS: ({ gameKey }) => shinySprite(gameKey, 308) },
				{ name: "Female (Smaller Head Blub)", img: ({ gameKey }) => baseSprite(gameKey, "0308-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0308-f") },
			],
		},
		{ id: 85, natiId: 309, name: "Electrike", img: ({ gameKey }) => baseSprite(gameKey, 309), imgS: ({ gameKey }) => shinySprite(gameKey, 309) },
		{ id: 86, natiId: 310, name: "Manectric", img: ({ gameKey }) => baseSprite(gameKey, 310), imgS: ({ gameKey }) => shinySprite(gameKey, 310), tags: ["mega"] },
		{ id: 87, natiId: 280, name: "Ralts", img: ({ gameKey }) => baseSprite(gameKey, 280), imgS: ({ gameKey }) => shinySprite(gameKey, 280) },
		{ id: 88, natiId: 281, name: "Kirlia", img: ({ gameKey }) => baseSprite(gameKey, 281), imgS: ({ gameKey }) => shinySprite(gameKey, 281) },
		{ id: 89, natiId: 282, name: "Gardevoir", img: ({ gameKey }) => baseSprite(gameKey, 282), imgS: ({ gameKey }) => shinySprite(gameKey, 282), tags: ["mega"] },
		{ id: 90, natiId: 475, name: "Gallade", img: ({ gameKey }) => baseSprite(gameKey, 475), imgS: ({ gameKey }) => shinySprite(gameKey, 475), tags: ["mega"] },
		{ id: 91, natiId: 228, name: "Houndour", img: ({ gameKey }) => baseSprite(gameKey, 228), imgS: ({ gameKey }) => shinySprite(gameKey, 228) },
		{
			id: 92, natiId: 229, name: "Houndoom", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229), tags: ["gender", "mega"], forms: [
				{ name: "Male (Larger Horns)", img: ({ gameKey }) => baseSprite(gameKey, 229), imgS: ({ gameKey }) => shinySprite(gameKey, 229) },
				{ name: "Female (Smaller Horns)", img: ({ gameKey }) => baseSprite(gameKey, "0229-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0229-f") },
			],
		},
		{ id: 93, natiId: 333, name: "Swablu", img: ({ gameKey }) => baseSprite(gameKey, 333), imgS: ({ gameKey }) => shinySprite(gameKey, 333) },
		{ id: 94, natiId: 334, name: "Altaria", img: ({ gameKey }) => baseSprite(gameKey, 334), imgS: ({ gameKey }) => shinySprite(gameKey, 334), tags: ["mega"] },
		{ id: 95, natiId: 531, name: "Audino", img: ({ gameKey }) => baseSprite(gameKey, 531), imgS: ({ gameKey }) => shinySprite(gameKey, 531), tags: ["mega"] },
		{ id: 96, natiId: 682, name: "Spritzee", img: ({ gameKey }) => baseSprite(gameKey, 682), imgS: ({ gameKey }) => shinySprite(gameKey, 682) },
		{ id: 97, natiId: 683, name: "Aromatisse", img: ({ gameKey }) => baseSprite(gameKey, 683), imgS: ({ gameKey }) => shinySprite(gameKey, 683) },
		{ id: 98, natiId: 684, name: "Swirlix", img: ({ gameKey }) => baseSprite(gameKey, 684), imgS: ({ gameKey }) => shinySprite(gameKey, 684) },
		{ id: 99, natiId: 685, name: "Slurpuff", img: ({ gameKey }) => baseSprite(gameKey, 685), imgS: ({ gameKey }) => shinySprite(gameKey, 685) },
		{
			id: 100, natiId: 133, name: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133), tags: ["gender"], forms: [
				{ name: "Male (Zigzag Tail Pattern)", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133) },
				{ name: "Female (Heart Tail Pattern)", img: ({ gameKey }) => baseSprite(gameKey, "0133-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0133-f") },
			],
		},
		{ id: 101, natiId: 134, name: "Vaporeon", img: ({ gameKey }) => baseSprite(gameKey, 134), imgS: ({ gameKey }) => shinySprite(gameKey, 134) },
		{ id: 102, natiId: 135, name: "Jolteon", img: ({ gameKey }) => baseSprite(gameKey, 135), imgS: ({ gameKey }) => shinySprite(gameKey, 135) },
		{ id: 103, natiId: 136, name: "Flareon", img: ({ gameKey }) => baseSprite(gameKey, 136), imgS: ({ gameKey }) => shinySprite(gameKey, 136) },
		{ id: 104, natiId: 196, name: "Espeon", img: ({ gameKey }) => baseSprite(gameKey, 196), imgS: ({ gameKey }) => shinySprite(gameKey, 196) },
		{ id: 105, natiId: 197, name: "Umbreon", img: ({ gameKey }) => baseSprite(gameKey, 197), imgS: ({ gameKey }) => shinySprite(gameKey, 197) },
		{ id: 106, natiId: 470, name: "Leafeon", img: ({ gameKey }) => baseSprite(gameKey, 470), imgS: ({ gameKey }) => shinySprite(gameKey, 470) },
		{ id: 107, natiId: 471, name: "Glaceon", img: ({ gameKey }) => baseSprite(gameKey, 471), imgS: ({ gameKey }) => shinySprite(gameKey, 471) },
		{ id: 108, natiId: 700, name: "Sylveon", img: ({ gameKey }) => baseSprite(gameKey, 700), imgS: ({ gameKey }) => shinySprite(gameKey, 700) },
		{ id: 109, natiId: 427, name: "Buneary", img: ({ gameKey }) => baseSprite(gameKey, 427), imgS: ({ gameKey }) => shinySprite(gameKey, 427) },
		{ id: 110, natiId: 428, name: "Lopunny", img: ({ gameKey }) => baseSprite(gameKey, 428), imgS: ({ gameKey }) => shinySprite(gameKey, 428), tags: ["mega"] },
		{ id: 111, natiId: 353, name: "Shuppet", img: ({ gameKey }) => baseSprite(gameKey, 353), imgS: ({ gameKey }) => shinySprite(gameKey, 353) },
		{ id: 112, natiId: 354, name: "Banette", img: ({ gameKey }) => baseSprite(gameKey, 354), imgS: ({ gameKey }) => shinySprite(gameKey, 354), tags: ["mega"] },
		{ id: 113, natiId: 582, name: "Vanillite", img: ({ gameKey }) => baseSprite(gameKey, 582), imgS: ({ gameKey }) => shinySprite(gameKey, 582) },
		{ id: 114, natiId: 583, name: "Vanillish", img: ({ gameKey }) => baseSprite(gameKey, 583), imgS: ({ gameKey }) => shinySprite(gameKey, 583) },
		{ id: 115, natiId: 584, name: "Vanilluxe", img: ({ gameKey }) => baseSprite(gameKey, 584), imgS: ({ gameKey }) => shinySprite(gameKey, 584) },
		{
			id: 116, natiId: 322, name: "Numel", img: ({ gameKey }) => baseSprite(gameKey, 322), imgS: ({ gameKey }) => shinySprite(gameKey, 322), tags: ["gender"], forms: [
				{ name: "Male (Smaller Hump)", img: ({ gameKey }) => baseSprite(gameKey, 322), imgS: ({ gameKey }) => shinySprite(gameKey, 322) },
				{ name: "Female (Larger Hump)", img: ({ gameKey }) => baseSprite(gameKey, "0322-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0322-f") },
			],
		},
		{
			id: 117, natiId: 323, name: "Camerupt", img: ({ gameKey }) => baseSprite(gameKey, 323), imgS: ({ gameKey }) => shinySprite(gameKey, 323), tags: ["gender", "mega"], forms: [
				{ name: "Male (Smaller Humps)", img: ({ gameKey }) => baseSprite(gameKey, 323), imgS: ({ gameKey }) => shinySprite(gameKey, 323) },
				{ name: "Female (Larger Humps)", img: ({ gameKey }) => baseSprite(gameKey, "0323-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0323-f") },
			],
		},
		{
			id: 118, natiId: 449, name: "Hippopotas", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449), tags: ["gender"], forms: [
				{ name: "Male (Yellow-Brown Pallete)", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449) },
				{ name: "Female (Brown-Yellow Pallete)", img: ({ gameKey }) => baseSprite(gameKey, "0449-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0449-f") },
			],
		},
		{
			id: 119, natiId: 450, name: "Hippowdon", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450), tags: ["gender"], forms: [
				{ name: "Male (Light Brown Body)", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450) },
				{ name: "Female (Dark Gray Body)", img: ({ gameKey }) => baseSprite(gameKey, "0450-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0450-f") },
			],
		},
		{ id: 120, natiId: 529, name: "Drilbur", img: ({ gameKey }) => baseSprite(gameKey, 529), imgS: ({ gameKey }) => shinySprite(gameKey, 529) },
		{ id: 121, natiId: 530, name: "Excadrill", img: ({ gameKey }) => baseSprite(gameKey, 530), imgS: ({ gameKey }) => shinySprite(gameKey, 530), tags: ["mega"] },
		{ id: 122, natiId: 551, name: "Sandile", img: ({ gameKey }) => baseSprite(gameKey, 551), imgS: ({ gameKey }) => shinySprite(gameKey, 551) },
		{ id: 123, natiId: 552, name: "Krokorok", img: ({ gameKey }) => baseSprite(gameKey, 552), imgS: ({ gameKey }) => shinySprite(gameKey, 552) },
		{ id: 124, natiId: 553, name: "Krookodile", img: ({ gameKey }) => baseSprite(gameKey, 553), imgS: ({ gameKey }) => shinySprite(gameKey, 553) },
		{ id: 125, natiId: 66, name: "Machop", img: ({ gameKey }) => baseSprite(gameKey, 66), imgS: ({ gameKey }) => shinySprite(gameKey, 66) },
		{ id: 126, natiId: 67, name: "Machoke", img: ({ gameKey }) => baseSprite(gameKey, 67), imgS: ({ gameKey }) => shinySprite(gameKey, 67) },
		{ id: 127, natiId: 68, name: "Machamp", img: ({ gameKey }) => baseSprite(gameKey, 68), imgS: ({ gameKey }) => shinySprite(gameKey, 68) },
		{
			id: 128, natiId: 443, name: "Gible", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), tags: ["gender", "pseudo"], forms: [
				{ name: "Male (Notched Fin)", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443) },
				{ name: "Female (Normal Fin)", img: ({ gameKey }) => baseSprite(gameKey, "0443-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0443-f") },
			],
		},
		{
			id: 129, natiId: 444, name: "Gabite", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), tags: ["gender", "pseudo"], forms: [
				{ name: "Male (Notched Fin)", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444) },
				{ name: "Female (Normal Fin)", img: ({ gameKey }) => baseSprite(gameKey, "0444-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0444-f") },
			],
		},
		{
			id: 130, natiId: 445, name: "Garchomp", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), tags: ["gender", "pseudo", "mega"], forms: [
				{ name: "Male (Notched Fin)", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445) },
				{ name: "Female (Normal Fin)", img: ({ gameKey }) => baseSprite(gameKey, "0445-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0445-f") },
			],
		},
		{ id: 131, natiId: 703, name: "Carbink", img: ({ gameKey }) => baseSprite(gameKey, 703), imgS: ({ gameKey }) => shinySprite(gameKey, 703) },
		{ id: 132, natiId: 302, name: "Sableye", img: ({ gameKey }) => baseSprite(gameKey, 302), imgS: ({ gameKey }) => shinySprite(gameKey, 302), tags: ["mega"] },
		{ id: 133, natiId: 303, name: "Mawile", img: ({ gameKey }) => baseSprite(gameKey, 303), imgS: ({ gameKey }) => shinySprite(gameKey, 303), tags: ["mega"] },
		{ id: 134, natiId: 359, name: "Absol", img: ({ gameKey }) => baseSprite(gameKey, 359), imgS: ({ gameKey }) => shinySprite(gameKey, 359), tags: ["mega"] },
		{ id: 135, natiId: 447, name: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447), imgS: ({ gameKey }) => shinySprite(gameKey, 447) },
		{ id: 136, natiId: 448, name: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), imgS: ({ gameKey }) => shinySprite(gameKey, 448), tags: ["mega"] },
		{
			id: 137, natiId: 79, name: "Slowpoke", img: ({ gameKey }) => baseSprite(gameKey, 79), imgS: ({ gameKey }) => shinySprite(gameKey, 79), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 79), imgS: ({ gameKey }) => shinySprite(gameKey, 79) },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0079-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0079-g"), maxStatus: "caught", tags: ["galarian"] },
			],
		},
		{
			id: 138, natiId: 80, name: "Slowbro", img: ({ gameKey }) => baseSprite(gameKey, 80), imgS: ({ gameKey }) => shinySprite(gameKey, 80), tags: ["mega"], forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 80), imgS: ({ gameKey }) => shinySprite(gameKey, 80) },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0080-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0080-g"), maxStatus: "caught", tags: ["galarian"] },
			],
		},
		{
			id: 139, natiId: 199, name: "Slowking", img: ({ gameKey }) => baseSprite(gameKey, 199), imgS: ({ gameKey }) => shinySprite(gameKey, 199), forms: [
				{ name: "Johtonian", img: ({ gameKey }) => baseSprite(gameKey, 199), imgS: ({ gameKey }) => shinySprite(gameKey, 199) },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0199-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0199-g"), maxStatus: "caught", tags: ["galarian"] },
			],
		},
		{ id: 140, natiId: 318, name: "Carvanha", img: ({ gameKey }) => baseSprite(gameKey, 318), imgS: ({ gameKey }) => shinySprite(gameKey, 318) },
		{ id: 141, natiId: 319, name: "Sharpedo", img: ({ gameKey }) => baseSprite(gameKey, 319), imgS: ({ gameKey }) => shinySprite(gameKey, 319), tags: ["mega"] },
		{ id: 142, natiId: 602, name: "Tynamo", img: ({ gameKey }) => baseSprite(gameKey, 602), imgS: ({ gameKey }) => shinySprite(gameKey, 602) },
		{ id: 143, natiId: 603, name: "Eelektrik", img: ({ gameKey }) => baseSprite(gameKey, 603), imgS: ({ gameKey }) => shinySprite(gameKey, 603) },
		{ id: 144, natiId: 604, name: "Eelektross", img: ({ gameKey }) => baseSprite(gameKey, 604), imgS: ({ gameKey }) => shinySprite(gameKey, 604), tags: ["mega"] },
		{ id: 145, natiId: 147, name: "Dratini", img: ({ gameKey }) => baseSprite(gameKey, 147), imgS: ({ gameKey }) => shinySprite(gameKey, 147), tags: ["pseudo"] },
		{ id: 146, natiId: 148, name: "Dragonair", img: ({ gameKey }) => baseSprite(gameKey, 148), imgS: ({ gameKey }) => shinySprite(gameKey, 148), tags: ["pseudo"] },
		{ id: 147, natiId: 149, name: "Dragonite", img: ({ gameKey }) => baseSprite(gameKey, 149), imgS: ({ gameKey }) => shinySprite(gameKey, 149), tags: ["mega", "pseudo"] },
		{ id: 148, natiId: 1, name: "Bulbasaur", img: ({ gameKey }) => baseSprite(gameKey, 1), imgS: ({ gameKey }) => shinySprite(gameKey, 1), tags: ["starter"] },
		{ id: 149, natiId: 2, name: "Ivysaur", img: ({ gameKey }) => baseSprite(gameKey, 2), imgS: ({ gameKey }) => shinySprite(gameKey, 2), tags: ["starter"] },
		{
			id: 150, natiId: 3, name: "Venusaur", img: ({ gameKey }) => baseSprite(gameKey, 3), imgS: ({ gameKey }) => shinySprite(gameKey, 3), tags: ["gender", "starter", "mega"], forms: [
				{ name: "Male (No Seed)", img: ({ gameKey }) => baseSprite(gameKey, 3), imgS: ({ gameKey }) => shinySprite(gameKey, 3) },
				{ name: "Female (Seed)", img: ({ gameKey }) => baseSprite(gameKey, "0003-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0003-f") },
			],
		},
		{ id: 151, natiId: 4, name: "Charmander", img: ({ gameKey }) => baseSprite(gameKey, 4), imgS: ({ gameKey }) => shinySprite(gameKey, 4), tags: ["starter"] },
		{ id: 152, natiId: 5, name: "Charmeleon", img: ({ gameKey }) => baseSprite(gameKey, 5), imgS: ({ gameKey }) => shinySprite(gameKey, 5), tags: ["starter"] },
		{ id: 153, natiId: 6, name: "Charizard", img: ({ gameKey }) => baseSprite(gameKey, 6), imgS: ({ gameKey }) => shinySprite(gameKey, 6), tags: ["mega", "starter"] },
		{ id: 154, natiId: 7, name: "Squirtle", img: ({ gameKey }) => baseSprite(gameKey, 7), imgS: ({ gameKey }) => shinySprite(gameKey, 7), tags: ["starter"] },
		{ id: 155, natiId: 8, name: "Wartortle", img: ({ gameKey }) => baseSprite(gameKey, 8), imgS: ({ gameKey }) => shinySprite(gameKey, 8), tags: ["starter"] },
		{ id: 156, natiId: 9, name: "Blastoise", img: ({ gameKey }) => baseSprite(gameKey, 9), imgS: ({ gameKey }) => shinySprite(gameKey, 9), tags: ["mega", "starter"] },
		{
			id: 157, natiId: 618, name: "Stunfisk", img: ({ gameKey }) => baseSprite(gameKey, 618), imgS: ({ gameKey }) => shinySprite(gameKey, 618), forms: [
				{ name: "Unovian", img: ({ gameKey }) => baseSprite(gameKey, 618), imgS: ({ gameKey }) => shinySprite(gameKey, 618) },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0618-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0618-g"), maxStatus: "caught", tags: ["galarian"], },
			],
		},
		{
			id: 158, natiId: 676, name: "Furfrou", img: ({ gameKey }) => baseSprite(gameKey, 676), imgS: ({ gameKey }) => shinySprite(gameKey, 676), tags: ["other"], forms: [
				{ name: "Natural Trim", img: ({ gameKey }) => baseSprite(gameKey, 676), imgS: ({ gameKey }) => shinySprite(gameKey, 676) },
				{ name: "Heart Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-he"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-he") },
				{ name: "Star Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-st"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-st") },
				{ name: "Diamond Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-di"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-di") },
				{ name: "Debutante Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-de"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-de") },
				{ name: "Matron Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-ma"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-ma") },
				{ name: "Dandy Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-da"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-da") },
				{ name: "Le Reine Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-la"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-la") },
				{ name: "Kabuki Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-ka"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-ka") },
				{ name: "Pharaoh Trim", img: ({ gameKey }) => baseSprite(gameKey, "0676-ph"), imgS: ({ gameKey }) => shinySprite(gameKey, "0676-ph") },
			],
		},
		{ id: 159, natiId: 686, name: "Inkay", img: ({ gameKey }) => baseSprite(gameKey, 686), imgS: ({ gameKey }) => shinySprite(gameKey, 686) },
		{ id: 160, natiId: 687, name: "Malamar", img: ({ gameKey }) => baseSprite(gameKey, 687), imgS: ({ gameKey }) => shinySprite(gameKey, 687), tags: ["mega"] },
		{ id: 161, natiId: 690, name: "Skrelp", img: ({ gameKey }) => baseSprite(gameKey, 690), imgS: ({ gameKey }) => shinySprite(gameKey, 690) },
		{ id: 162, natiId: 691, name: "Dragalge", img: ({ gameKey }) => baseSprite(gameKey, 691), imgS: ({ gameKey }) => shinySprite(gameKey, 691), tags: ["mega"] },
		{ id: 163, natiId: 692, name: "Clauncher", img: ({ gameKey }) => baseSprite(gameKey, 692), imgS: ({ gameKey }) => shinySprite(gameKey, 692) },
		{ id: 164, natiId: 693, name: "Clawitzer", img: ({ gameKey }) => baseSprite(gameKey, 693), imgS: ({ gameKey }) => shinySprite(gameKey, 693) },
		{ id: 165, natiId: 704, name: "Goomy", img: ({ gameKey }) => baseSprite(gameKey, 704), imgS: ({ gameKey }) => shinySprite(gameKey, 704), tags: ["pseudo"] },
		{
			id: 166, natiId: 705, name: "Sliggoo", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), forms: [
				{ name: "Kalosian", img: ({ gameKey }) => baseSprite(gameKey, 705), imgS: ({ gameKey }) => shinySprite(gameKey, 705), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0705-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0705-h"), tags: ["hisuian"] },
			],
		},
		{
			id: 167, natiId: 706, name: "Goodra", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), forms: [
				{ name: "Kalosian", img: ({ gameKey }) => baseSprite(gameKey, 706), imgS: ({ gameKey }) => shinySprite(gameKey, 706), },
				{ name: "Hisuian", img: ({ gameKey }) => baseSprite(gameKey, "0706-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0706-h"), tags: ["hisuian"] },
			],
		},
		{ id: 168, natiId: 225, name: "Delibird", img: ({ gameKey }) => baseSprite(gameKey, 225), imgS: ({ gameKey }) => shinySprite(gameKey, 225) },
		{ id: 169, natiId: 361, name: "Snorunt", img: ({ gameKey }) => baseSprite(gameKey, 361), imgS: ({ gameKey }) => shinySprite(gameKey, 361) },
		{ id: 170, natiId: 362, name: "Glalie", img: ({ gameKey }) => baseSprite(gameKey, 362), imgS: ({ gameKey }) => shinySprite(gameKey, 362), tags: ["mega"] },
		{ id: 171, natiId: 478, name: "Froslass", img: ({ gameKey }) => baseSprite(gameKey, 478), imgS: ({ gameKey }) => shinySprite(gameKey, 478), tags: ["mega"] },
		{
			id: 172, natiId: 459, name: "Snover", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), tags: ["gender"], forms: [
				{ name: "Male (Brown Midsection)", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459) },
				{ name: "Female (White Midsection)", img: ({ gameKey }) => baseSprite(gameKey, "0459-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0459-f") },
			],
		},
		{
			id: 173, natiId: 460, name: "Abomasnow", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), tags: ["gender", "mega"], forms: [
				{ name: "Male (Smaller Chest Fur)", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460) },
				{ name: "Female (Longer Chest Fur)", img: ({ gameKey }) => baseSprite(gameKey, "0460-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0460-f") },
			],
		},
		{ id: 174, natiId: 712, name: "Bergmite", img: ({ gameKey }) => baseSprite(gameKey, 712), imgS: ({ gameKey }) => shinySprite(gameKey, 712) },
		{ id: 175, natiId: 713, name: "Avalugg", img: ({ gameKey }) => baseSprite(gameKey, 713), imgS: ({ gameKey }) => shinySprite(gameKey, 713) },
		{
			id: 176, natiId: 123, name: "Scyther", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), tags: ["gender"], forms: [
				{ name: "Male (Smaller Abdomen)", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123) },
				{ name: "Female (Larger Abdomen)", img: ({ gameKey }) => baseSprite(gameKey, "0123-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0123-f") },
			],
		},
		{
			id: 177, natiId: 212, name: "Scizor", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), tags: ["gender", "mega"], forms: [
				{ name: "Male (Smaller Abdomen)", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212) },
				{ name: "Female (Larger Abdomen)", img: ({ gameKey }) => baseSprite(gameKey, "0212-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0212-f") },
			],
		},
		{ id: 178, natiId: 127, name: "Pinsir", img: ({ gameKey }) => baseSprite(gameKey, 127), imgS: ({ gameKey }) => shinySprite(gameKey, 127), tags: ["gender", "mega"] },
		{
			id: 179, natiId: 214, name: "Heracross", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), tags: ["gender", "mega"], forms: [
				{ name: "Male (Sharp Horn)", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214) },
				{ name: "Female (Heart Horn)", img: ({ gameKey }) => baseSprite(gameKey, "0214-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0214-f") },
			],
		},
		{ id: 180, natiId: 587, name: "Emolga", img: ({ gameKey }) => baseSprite(gameKey, 587), imgS: ({ gameKey }) => shinySprite(gameKey, 587) },
		{ id: 181, natiId: 701, name: "Hawlucha", img: ({ gameKey }) => baseSprite(gameKey, 701), imgS: ({ gameKey }) => shinySprite(gameKey, 701), tags: ["mega"] },
		{ id: 182, natiId: 708, name: "Phantump", img: ({ gameKey }) => baseSprite(gameKey, 708), imgS: ({ gameKey }) => shinySprite(gameKey, 708) },
		{ id: 183, natiId: 709, name: "Trevenant", img: ({ gameKey }) => baseSprite(gameKey, 709), imgS: ({ gameKey }) => shinySprite(gameKey, 709) },
		{ id: 184, natiId: 559, name: "Scraggy", img: ({ gameKey }) => baseSprite(gameKey, 559), imgS: ({ gameKey }) => shinySprite(gameKey, 559) },
		{ id: 185, natiId: 560, name: "Scrafty", img: ({ gameKey }) => baseSprite(gameKey, 560), imgS: ({ gameKey }) => shinySprite(gameKey, 560), tags: ["mega"] },
		{ id: 186, natiId: 714, name: "Noibat", img: ({ gameKey }) => baseSprite(gameKey, 714), imgS: ({ gameKey }) => shinySprite(gameKey, 714) },
		{ id: 187, natiId: 715, name: "Noivern", img: ({ gameKey }) => baseSprite(gameKey, 715), imgS: ({ gameKey }) => shinySprite(gameKey, 715) },
		{ id: 188, natiId: 707, name: "Klefki", img: ({ gameKey }) => baseSprite(gameKey, 707), imgS: ({ gameKey }) => shinySprite(gameKey, 707) },
		{ id: 189, natiId: 607, name: "Litwick", img: ({ gameKey }) => baseSprite(gameKey, 607), imgS: ({ gameKey }) => shinySprite(gameKey, 607) },
		{ id: 190, natiId: 608, name: "Lampent", img: ({ gameKey }) => baseSprite(gameKey, 608), imgS: ({ gameKey }) => shinySprite(gameKey, 608) },
		{ id: 191, natiId: 609, name: "Chandelure", img: ({ gameKey }) => baseSprite(gameKey, 609), imgS: ({ gameKey }) => shinySprite(gameKey, 609), tags: ["mega"] },
		{ id: 192, natiId: 142, name: "Aerodactyl", img: ({ gameKey }) => baseSprite(gameKey, 142), imgS: ({ gameKey }) => shinySprite(gameKey, 142), tags: ["mega", "fossil"] },
		{ id: 193, natiId: 696, name: "Tyrunt", img: ({ gameKey }) => baseSprite(gameKey, 696), imgS: ({ gameKey }) => shinySprite(gameKey, 696), tags: ["fossil"] },
		{ id: 194, natiId: 697, name: "Tyrantrum", img: ({ gameKey }) => baseSprite(gameKey, 697), imgS: ({ gameKey }) => shinySprite(gameKey, 697), tags: ["fossil"] },
		{ id: 195, natiId: 698, name: "Amaura", img: ({ gameKey }) => baseSprite(gameKey, 698), imgS: ({ gameKey }) => shinySprite(gameKey, 698), tags: ["fossil"] },
		{ id: 196, natiId: 699, name: "Aurorus", img: ({ gameKey }) => baseSprite(gameKey, 699), imgS: ({ gameKey }) => shinySprite(gameKey, 699), tags: ["fossil"] },
		{ id: 197, natiId: 95, name: "Onix", img: ({ gameKey }) => baseSprite(gameKey, 95), imgS: ({ gameKey }) => shinySprite(gameKey, 95) },
		{
			id: 198, natiId: 208, name: "Steelix", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208), tags: ["gender", "mega"], forms: [
				{ name: "Male (Two Outer Teeth)", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208) },
				{ name: "Female (One Outer Tooth)", img: ({ gameKey }) => baseSprite(gameKey, "0208-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0208-f") },
			],
		},
		{ id: 199, natiId: 304, name: "Aron", img: ({ gameKey }) => baseSprite(gameKey, 304), imgS: ({ gameKey }) => shinySprite(gameKey, 304) },
		{ id: 200, natiId: 305, name: "Lairon", img: ({ gameKey }) => baseSprite(gameKey, 305), imgS: ({ gameKey }) => shinySprite(gameKey, 305) },
		{ id: 201, natiId: 306, name: "Aggron", img: ({ gameKey }) => baseSprite(gameKey, 306), imgS: ({ gameKey }) => shinySprite(gameKey, 306), tags: ["mega"] },
		{ id: 202, natiId: 694, name: "Helioptile", img: ({ gameKey }) => baseSprite(gameKey, 694), imgS: ({ gameKey }) => shinySprite(gameKey, 694) },
		{ id: 203, natiId: 695, name: "Heliolisk", img: ({ gameKey }) => baseSprite(gameKey, 695), imgS: ({ gameKey }) => shinySprite(gameKey, 695) },
		{
			id: 204, natiId: 710, name: "Pumpkaboo", img: ({ gameKey }) => baseSprite(gameKey, 710), imgS: ({ gameKey }) => shinySprite(gameKey, 710), tags: ["other"], forms: [
				{ name: "Small", img: ({ gameKey }) => baseSprite(gameKey, "0710-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0710-s") },
				{ name: "Medium", img: ({ gameKey }) => baseSprite(gameKey, 710), imgS: ({ gameKey }) => shinySprite(gameKey, 710) },
				{ name: "Large", img: ({ gameKey }) => baseSprite(gameKey, "0710-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0710-l") },
				{ name: "Jumbo", img: ({ gameKey }) => baseSprite(gameKey, "0710-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0710-h") },
			],
		},
		{
			id: 205, natiId: 711, name: "Gourgeist", img: ({ gameKey }) => baseSprite(gameKey, 711), imgS: ({ gameKey }) => shinySprite(gameKey, 711), tags: ["other"], forms: [
				{ name: "Small", img: ({ gameKey }) => baseSprite(gameKey, "0711-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0711-s") },
				{ name: "Medium", img: ({ gameKey }) => baseSprite(gameKey, 711), imgS: ({ gameKey }) => shinySprite(gameKey, 711) },
				{ name: "Large", img: ({ gameKey }) => baseSprite(gameKey, "0711-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0711-l") },
				{ name: "Jumbo", img: ({ gameKey }) => baseSprite(gameKey, "0711-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0711-h") },
			],
		},
		{ id: 206, natiId: 246, name: "Larvitar", img: ({ gameKey }) => baseSprite(gameKey, 246), imgS: ({ gameKey }) => shinySprite(gameKey, 246), tags: ["pseudo"] },
		{ id: 207, natiId: 247, name: "Pupitar", img: ({ gameKey }) => baseSprite(gameKey, 247), imgS: ({ gameKey }) => shinySprite(gameKey, 247), tags: ["pseudo"] },
		{ id: 208, natiId: 248, name: "Tyranitar", img: ({ gameKey }) => baseSprite(gameKey, 248), imgS: ({ gameKey }) => shinySprite(gameKey, 248), tags: ["mega", "pseudo"] },
		{ id: 209, natiId: 656, name: "Froakie", img: ({ gameKey }) => baseSprite(gameKey, 656), imgS: ({ gameKey }) => shinySprite(gameKey, 656), tags: ["starter"] },
		{ id: 210, natiId: 657, name: "Frogadier", img: ({ gameKey }) => baseSprite(gameKey, 657), imgS: ({ gameKey }) => shinySprite(gameKey, 657), tags: ["starter"] },
		{ id: 211, natiId: 658, name: "Greninja", img: ({ gameKey }) => baseSprite(gameKey, 658), imgS: ({ gameKey }) => shinySprite(gameKey, 658), tags: ["mega", "starter"] },
		{ id: 212, natiId: 870, name: "Falinks", img: ({ gameKey }) => baseSprite(gameKey, 870), imgS: ({ gameKey }) => shinySprite(gameKey, 870), tags: ["mega"] },
		{ id: 213, natiId: 650, name: "Chespin", img: ({ gameKey }) => baseSprite(gameKey, 650), imgS: ({ gameKey }) => shinySprite(gameKey, 650), tags: ["starter"] },
		{ id: 214, natiId: 651, name: "Quilladin", img: ({ gameKey }) => baseSprite(gameKey, 651), imgS: ({ gameKey }) => shinySprite(gameKey, 651), tags: ["starter"] },
		{ id: 215, natiId: 652, name: "Chesnaught", img: ({ gameKey }) => baseSprite(gameKey, 652), imgS: ({ gameKey }) => shinySprite(gameKey, 652), tags: ["mega", "starter"] },
		{ id: 216, natiId: 227, name: "Skarmory", img: ({ gameKey }) => baseSprite(gameKey, 227), imgS: ({ gameKey }) => shinySprite(gameKey, 227), tags: ["mega"] },
		{ id: 217, natiId: 653, name: "Fennekin", img: ({ gameKey }) => baseSprite(gameKey, 653), imgS: ({ gameKey }) => shinySprite(gameKey, 653), tags: ["starter"] },
		{ id: 218, natiId: 654, name: "Braixen", img: ({ gameKey }) => baseSprite(gameKey, 654), imgS: ({ gameKey }) => shinySprite(gameKey, 654), tags: ["starter"] },
		{ id: 219, natiId: 655, name: "Delphox", img: ({ gameKey }) => baseSprite(gameKey, 655), imgS: ({ gameKey }) => shinySprite(gameKey, 655), tags: ["mega", "starter"] },
		{ id: 220, natiId: 371, name: "Bagon", img: ({ gameKey }) => baseSprite(gameKey, 371), imgS: ({ gameKey }) => shinySprite(gameKey, 371), tags: ["pseudo"] },
		{ id: 221, natiId: 372, name: "Shelgon", img: ({ gameKey }) => baseSprite(gameKey, 372), imgS: ({ gameKey }) => shinySprite(gameKey, 372), tags: ["pseudo"] },
		{ id: 222, natiId: 373, name: "Salamence", img: ({ gameKey }) => baseSprite(gameKey, 373), imgS: ({ gameKey }) => shinySprite(gameKey, 373), tags: ["mega", "pseudo"] },
		{ id: 223, natiId: 115, name: "Kangaskhan", img: ({ gameKey }) => baseSprite(gameKey, 115), imgS: ({ gameKey }) => shinySprite(gameKey, 115), tags: ["mega"] },
		{ id: 224, natiId: 780, name: "Drampa", img: ({ gameKey }) => baseSprite(gameKey, 780), imgS: ({ gameKey }) => shinySprite(gameKey, 780), tags: ["mega"] },
		{ id: 225, natiId: 374, name: "Beldum", img: ({ gameKey }) => baseSprite(gameKey, 374), imgS: ({ gameKey }) => shinySprite(gameKey, 374), tags: ["pseudo"] },
		{ id: 226, natiId: 375, name: "Metang", img: ({ gameKey }) => baseSprite(gameKey, 375), imgS: ({ gameKey }) => shinySprite(gameKey, 375), tags: ["pseudo"] },
		{ id: 227, natiId: 376, name: "Metagross", img: ({ gameKey }) => baseSprite(gameKey, 376), imgS: ({ gameKey }) => shinySprite(gameKey, 376), tags: ["mega", "pseudo"] },
		{ id: 228, natiId: 716, name: "Xerneas", img: ({ gameKey }) => baseSprite(gameKey, 716), imgS: ({ gameKey }) => shinySprite(gameKey, 716), maxStatus: "caught", tags: ["legendary"], },
		{ id: 229, natiId: 717, name: "Yveltal", img: ({ gameKey }) => baseSprite(gameKey, 717), imgS: ({ gameKey }) => shinySprite(gameKey, 717), maxStatus: "caught", tags: ["legendary"], },
		{ id: 230, natiId: 718, name: "Zygarde", img: ({ gameKey }) => baseSprite(gameKey, 718), imgS: ({ gameKey }) => shinySprite(gameKey, 718), maxStatus: "caught", tags: ["mega", "legendary"], },
		{ id: 231, natiId: 719, name: "Diancie", img: ({ gameKey }) => baseSprite(gameKey, 719), imgS: ({ gameKey }) => shinySprite(gameKey, 719), maxStatus: "caught", tags: ["mega", "mythical"], },
		{ id: 232, natiId: 150, name: "Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150), imgS: ({ gameKey }) => shinySprite(gameKey, 150), maxStatus: "caught", tags: ["mega", "mythical"], },
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();