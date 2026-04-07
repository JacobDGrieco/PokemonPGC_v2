(() => {
	const gen = 3;
	const GAME_KEYS = ["ruby", "sapphire"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const heldItem = (name) => _heldItem(gen, name);
	const keyItem = (name) => _keyItem(gen, name);
	const decoration = (name) => _decoration(gen, name);
	const ribbon = (name) => _ribbon(gen, name);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "activities", title: "Activities" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "thms", title: "TMs/HMs" },
		{ id: "distributions", title: "Distributions" },
		{ id: "extra-credit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch/Trade for Kyogre", img: ({ gameKey }) => baseSprite(gameKey, 382), },
					{ id: 2, text: "Catch/Trade for Groudon", img: ({ gameKey }) => baseSprite(gameKey, 383), },
					{ id: 3, text: "Catch Rayquaza", img: ({ gameKey }) => baseSprite(gameKey, 384), },
					{ id: 4, text: "Catch Regirock", img: ({ gameKey }) => baseSprite(gameKey, 377), },
					{ id: 5, text: "Catch Regice", img: ({ gameKey }) => baseSprite(gameKey, 378), },
					{ id: 6, text: "Catch Registeel", img: ({ gameKey }) => baseSprite(gameKey, 379), },
					{ id: 7, text: "Catch/Trade for Latias", img: ({ gameKey }) => baseSprite(gameKey, 380), },
					{ id: 8, text: "Catch/Trade for Latios", img: ({ gameKey }) => baseSprite(gameKey, 381), },
				],
			},
			{
				id: 2, text: "Obtain all In-Game Gift Pokémon", children: [
					{
						id: 1, text: "Lileep / Anorith", img: ({ gameKey }) => task(gameKey, "lileep-anorith"), eithers: {
							1: { text: "" }, 2: { text: "" },
						},
					},
					{ id: 2, text: "Beldum", img: ({ gameKey }) => baseSprite(gameKey, 374) },
					{ id: 3, text: "Castform", img: ({ gameKey }) => baseSprite(gameKey, 351) },
					{ id: 4, text: "Wynaut", img: ({ gameKey }) => baseSprite(gameKey, 360) },
				],
			},
			{
				id: 3, text: "Complete all In-Game Trades", children: [
					{ id: 1, text: "Slakoth for Makuhita", img: ({ gameKey }) => task(gameKey, "slakoth-for-makuhita") },
					{ id: 2, text: "Pikachu for Skitty", img: ({ gameKey }) => task(gameKey, "pikachu-for-skitty") },
					{ id: 3, text: "Bellossum for Corsola", img: ({ gameKey }) => task(gameKey, "bellossum-for-corsola") },
				],
			},
		],
		"story": [
			{ id: 1, text: "Collect all 8 Gym Badges and Defeat the Elite 4", img: () => _badges(["stone", "knuckle", "dynamo", "heat", "balance", "feather", "mind", "rain"]), noCenter: true, },
		],
		"activities": [
			{
				id: 1, text: "Master all the Contests", noCenter: true, children: [
					{ id: 1, text: "Beauty Contests", img: () => ribbon("beauty-master"), tiers: ["Normal", "Super", "Hyper", "Master"], },
					{ id: 2, text: "Tough Contests", img: () => ribbon("tough-master"), tiers: ["Normal", "Super", "Hyper", "Master"], },
					{ id: 3, text: "Cute Contests", img: () => ribbon("cute-master"), tiers: ["Normal", "Super", "Hyper", "Master"], },
					{ id: 4, text: "Cool Contests", img: () => ribbon("cool-master"), tiers: ["Normal", "Super", "Hyper", "Master"], },
					{ id: 5, text: "Smart Contests", img: () => ribbon("smart-master"), tiers: ["Normal", "Super", "Hyper", "Master"], },
				],
			},
			{ id: 2, text: "Complete all chambers of the Trick House", type: "tiered", tiers: [range(1, 8)], },
		],
		"battle": [
			{ id: 1, text: "Master the Battle Tower", noCenter: true, type: "tiered", tiers: ["Singles", "Doubles", "Multi"], },
			{ id: 2, text: "Defeat the Winstrate Household", noCenter: true },
		],
		"upgrades": [
			{ id: 1, text: "Obtain the National PokeDex", noCenter: true },
			{
				id: 2, text: "Obtain the Gold 4-Star Trainer Card", noCenter: true, children: [
					{ id: 1, text: "Defeat the Elite 4/Champion" },
					{ id: 2, text: "Win all Master Rank Contests" },
					{ id: 3, text: "Defeat the 50 trainer challenge in the Battle Tower" },
					{ id: 4, text: "Complete the Hoenn Regional PokeDex" },
				],
			},
		],
		"collectables": [
			{
				id: 1, text: "Obtain all extra Key Items", children: [
					{ id: 1, text: "Exp. Share", img: () => heldItem("exp-share") },
					{ id: 2, text: "Go-Goggles", img: () => keyItem("go-goggles") },
					{ id: 3, text: "Good Rod", img: () => keyItem("good-rod") },
					{ id: 4, text: "Item Finder", img: () => keyItem("item-finder") },
					{ id: 5, text: "Old Rod", img: () => keyItem("old-rod") },
					{ id: 6, text: "PokeBlock Case", img: () => keyItem("pokeblock-case") },
					{ id: 7, text: "Soot Sack", img: () => keyItem("soot-sack") },
					{ id: 8, text: "Super Rod", img: () => keyItem("super-rod") },
					{ id: 9, text: "Wailmer Pail", img: () => keyItem("wailmer-pail") },
				],
			},
			{
				id: 2, text: "Obtain all items from collecting soot", children: [
					{ id: 1, text: "Pretty Chair", img: () => decoration("pretty-chair"), tooltip: "Route 113 (Glass Workshop)\n6000 steps" },
					{ id: 2, text: "Pretty Desk", img: () => decoration("pretty-desk"), tooltip: "Route 113 (Glass Workshop)\n8000 steps" },
				],
			},
			{ id: 3, text: "Find all hidden items with the Item Finder", img: () => keyItem("item-finder"), noCenter: true, type: "tiered", tiers: [range(1, 97)], },
			{
				id: 4, text: "Obtain all Secret Base decorations", children: [
					{ id: 1, text: "Small Desk", img: () => decoration("small-desk"), tooltip: "Fortree City (desk and chair shop)\n$3000" },
					{ id: 2, text: "Pokémon Desk", img: () => decoration("pokemon-desk"), tooltip: "Fortree City (desk and chair shop)\n$3000" },
					{ id: 3, text: "Heavy Desk", img: () => decoration("heavy-desk"), tooltip: "Fortree City (desk and chair shop)\n$6000" },
					{ id: 4, text: "Ragged Desk", img: () => decoration("ragged-desk"), tooltip: "Fortree City (desk and chair shop)\n$6000" },
					{ id: 5, text: "Comfort Desk", img: () => decoration("comfort-desk"), tooltip: "Fortree City (desk and chair shop)\n$6000" },
					{ id: 6, text: "Pretty Desk", img: () => decoration("pretty-desk"), tooltip: "Route 113 (Glass Workshop)\n8000 steps" },
					{ id: 7, text: "Brick Desk", img: () => decoration("brick-desk"), tooltip: "Fortree City (desk and chair shop)\n$9000" },
					{ id: 8, text: "Camp Desk", img: () => decoration("camp-desk"), tooltip: "Fortree City (desk and chair shop)\n$9000" },
					{ id: 9, text: "Hard Desk", img: () => decoration("hard-desk"), tooltip: "Fortree City (desk and chair shop)\n$9000" },
					{ id: 10, text: "Small Chair", img: () => decoration("small-chair"), tooltip: "Fortree City (desk and chair shop)\n$2000" },
					{ id: 11, text: "Pokémon Chair", img: () => decoration("pokemon-chair"), tooltip: "Fortree City (desk and chair shop)\n$2000" },
					{ id: 12, text: "Heavy Chair", img: () => decoration("heavy-chair"), tooltip: "Fortree City (desk and chair shop)\n$2000" },
					{ id: 13, text: "Pretty Chair", img: () => decoration("pretty-chair"), tooltip: "Route 113 (Glass Workshop)\n6000 steps" },
					{ id: 14, text: "Comfort Chair", img: () => decoration("comfort-chair"), tooltip: "Fortree City (desk and chair shop)\n$2000" },
					{ id: 15, text: "Ragged Chair", img: () => decoration("ragged-chair"), tooltip: "Fortree City (desk and chair shop)\n$2000" },
					{ id: 16, text: "Brick Chair", img: () => decoration("brick-chair"), tooltip: "Fortree City (desk and chair shop)\n$2000" },
					{ id: 17, text: "Camp Chair", img: () => decoration("camp-chair"), tooltip: "Fortree City (desk and chair shop)\n$2000" },
					{ id: 18, text: "Hard Chair", img: () => decoration("hard-chair"), tooltip: "Fortree City (desk and chair shop)\n$2000" },
					{ id: 19, text: "Red Plant", img: () => decoration("red-plant"), tooltip: "Route 104 (Pretty Petal flower shop)\n$3000" },
					{ id: 20, text: "Tropical Plant", img: () => decoration("tropical-plant"), tooltip: "Route 104 (Pretty Petal flower shop)\n$3000" },
					{ id: 21, text: "Pretty Flowers", img: () => decoration("pretty-flowers"), tooltip: "Route 104 (Pretty Petal flower shop)\n$3000" },
					{ id: 22, text: "Colorful Plant", img: () => decoration("colorful-plant"), tooltip: "Route 104 (Pretty Petal flower shop)\n$5000" },
					{ id: 23, text: "Big Plant", img: () => decoration("big-plant"), tooltip: "Route 104 (Pretty Petal flower shop)\n$5000" },
					{ id: 24, text: "Gorgeous Plant", img: () => decoration("gorgeous-plant"), tooltip: "Route 104 (Pretty Petal flower shop)\n$5000" },
					{ id: 25, text: "Red Brick", img: () => decoration("red-brick"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 26, text: "Yellow Brick", img: () => decoration("yellow-brick"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 27, text: "Blue Brick", img: () => decoration("blue-brick"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 28, text: "Red Balloon", img: () => decoration("red-balloon"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 29, text: "Blue Balloon", img: () => decoration("blue-balloon"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 30, text: "Yellow Balloon", img: () => decoration("yellow-balloon"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 31, text: "Red Tent / Blue Tent", img: () => [decoration("red-tent"), decoration("blue-tent")], tooltip: "Trick House (after completing all challenges)" },
					{ id: 32, text: "Solid Board", img: () => decoration("solid-board"), tooltip: "Lilycove Department Store (clear-out sale)\n$3000" },
					{ id: 33, text: "Slide", img: () => decoration("slide"), tooltip: "Lilycove Department Store (clear-out sale)\n$8000" },
					{ id: 34, text: "Fence Length", img: () => decoration("fence-length"), tooltip: "Lilycove Department Store (clear-out sale)\n$500" },
					{ id: 35, text: "Fence Width", img: () => decoration("fence-width"), tooltip: "Lilycove Department Store (clear-out sale)\n$500" },
					{ id: 36, text: "Tire", img: () => decoration("tire"), tooltip: "Lilycove Department Store (clear-out sale)\n$800" },
					{ id: 37, text: "Stand", img: () => decoration("stand"), tooltip: "Lilycove Department Store (clear-out sale)\n$7000" },
					{ id: 38, text: "Mud Ball", img: () => decoration("mud-ball"), tooltip: "Lilycove Department Store (clear-out sale)\n$200" },
					{ id: 39, text: "Breakable Door", img: () => decoration("breakable-door"), tooltip: "Lilycove Department Store (clear-out sale)\n$3000" },
					{ id: 40, text: "Sand Ornament", img: () => decoration("sand-ornament"), tooltip: "Lilycove Department Store (clear-out sale)\n$3000" },
					{ id: 41, text: "Silver Shield", img: () => decoration("silver-shield"), tooltip: "Battle Tower" },
					{ id: 42, text: "Gold Shield", img: () => decoration("gold-shield"), tooltip: "Battle Tower" },
					{ id: 43, text: "Glass Ornament", img: () => decoration("glass-ornament"), tooltip: "Lilycove Museum" },
					{ id: 44, text: "TV", img: () => decoration("tv"), tooltip: "Lilycove Department Store (clear-out sale)\n$3000" },
					{ id: 45, text: "Round TV", img: () => decoration("round-tv"), tooltip: "Lilycove Department Store (clear-out sale)\n$4000" },
					{ id: 46, text: "Cute TV", img: () => decoration("cute-tv"), tooltip: "Lilycove Department Store (clear-out sale)\n$4000" },
					{ id: 47, text: "Glitter Mat", img: () => decoration("glitter-mat"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 48, text: "Jump Mat", img: () => decoration("jump-mat"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 49, text: "Spin Mat", img: () => decoration("spin-mat"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 50, text: "C Low Note Mat", img: () => decoration("c-low-note-mat"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 51, text: "D Note Mat", img: () => decoration("d-note-mat"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 52, text: "E Note Mat", img: () => decoration("e-note-mat"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 53, text: "F Note Mat", img: () => decoration("f-note-mat"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 54, text: "G Note Mat", img: () => decoration("g-note-mat"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 55, text: "A Note Mat", img: () => decoration("a-note-mat"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 56, text: "B Note Mat", img: () => decoration("b-note-mat"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 57, text: "C High Note Mat", img: () => decoration("c-high-note-mat"), tooltip: "Slateport City (Secret Power Club shop)\n$500" },
					{ id: 58, text: "Surf Mat", img: () => decoration("surf-mat"), tooltip: "Lilycove Department Store\n$4000" },
					{ id: 59, text: "Thunder Mat", img: () => decoration("thunder-mat"), tooltip: "Lilycove Department Store\n$4000" },
					{ id: 60, text: "Fire Blast Mat", img: () => decoration("fire-blast-mat"), tooltip: "Lilycove Department Store\n$4000" },
					{ id: 61, text: "Powder Snow Mat", img: () => decoration("powder-snow-mat"), tooltip: "Lilycove Department Store\n$4000" },
					{ id: 62, text: "Attract Mat", img: () => decoration("attract-mat"), tooltip: "Lilycove Department Store\n$4000" },
					{ id: 63, text: "Fissure Mat", img: () => decoration("fissure-mat"), tooltip: "Lilycove Department Store\n$4000" },
					{ id: 64, text: "Spikes Mat", img: () => decoration("spikes-mat"), tooltip: "Lilycove Department Store\n$4000" },
					{ id: 65, text: "Ball Poster", img: () => decoration("ball-poster"), tooltip: "Lilycove Department Store\n$1000" },
					{ id: 66, text: "Green Poster", img: () => decoration("green-poster"), tooltip: "Lilycove Department Store\n$1000" },
					{ id: 67, text: "Red Poster", img: () => decoration("red-poster"), tooltip: "Lilycove Department Store\n$1000" },
					{ id: 68, text: "Blue Poster", img: () => decoration("blue-poster"), tooltip: "Lilycove Department Store\n$1000" },
					{ id: 69, text: "Cute Poster", img: () => decoration("cute-poster"), tooltip: "Lilycove Department Store\n$1000" },
					{ id: 70, text: "Pika Poster", img: () => decoration("pika-poster"), tooltip: "Lilycove Department Store\n$1500" },
					{ id: 71, text: "Long Poster", img: () => decoration("long-poster"), tooltip: "Lilycove Department Store\n$1500" },
					{ id: 72, text: "Sea Poster", img: () => decoration("sea-poster"), tooltip: "Lilycove Department Store\n$1500" },
					{ id: 73, text: "Sky Poster", img: () => decoration("sky-poster"), tooltip: "Lilycove Department Store\n$1500" },
					{ id: 74, text: "Pichu Doll", img: () => decoration("pichu-doll"), tooltip: "Lilycove Department Store\n$3000" },
					{ id: 75, text: "Pikachu Doll", img: () => decoration("pikachu-doll"), tooltip: "Lilycove Department Store\n$3000" },
					{ id: 76, text: "Marill Doll", img: () => decoration("marill-doll"), tooltip: "Slateport City (doll shop) / Lilycove Department Store\n$3000" },
					{ id: 77, text: "Jigglypuff Doll", img: () => decoration("jigglypuff-doll"), tooltip: "Lilycove Department Store\n$3000" },
					{ id: 78, text: "Treecko Doll", img: () => decoration("treecko-doll"), tooltip: "Mauville Game Corner\n1000C" },
					{ id: 79, text: "Torchic Doll", img: () => decoration("torchic-doll"), tooltip: "Mauville Game Corner\n1000C" },
					{ id: 80, text: "Mudkip Doll", img: () => decoration("mudkip-doll"), tooltip: "Mauville Game Corner\n1000C" },
					{ id: 81, text: "Duskull Doll", img: () => decoration("duskull-doll"), tooltip: "Lilycove Department Store\n$3000" },
					{ id: 82, text: "Wynaut Doll", img: () => decoration("wynaut-doll"), tooltip: "Lilycove Department Store\n$3000" },
					{ id: 83, text: "Baltoy Doll", img: () => decoration("baltoy-doll"), tooltip: "Lilycove Department Store\n$3000" },
					{ id: 84, text: "Kecleon Doll", img: () => decoration("kecleon-doll"), tooltip: "Lilycove Department Store\n$3000" },
					{ id: 85, text: "Azurill Doll", img: () => decoration("azurill-doll"), tooltip: "Slateport City (doll shop) / Lilycove Department Store\n$3000" },
					{ id: 86, text: "Skitty Doll", img: () => decoration("skitty-doll"), tooltip: "Slateport City (doll shop) / Lilycove Department Store\n$3000" },
					{ id: 87, text: "Swablu Doll", img: () => decoration("swablu-doll"), tooltip: "Lilycove Department Store\n$3000" },
					{ id: 88, text: "Gulpin Doll", img: () => decoration("gulpin-doll"), tooltip: "Lilycove Department Store\n$3000" },
					{ id: 89, text: "Lotad Doll / Seedot Doll", img: () => [decoration("lotad-doll"), decoration("seedot-doll")], tooltip: "Route 114" },
					{ id: 90, text: "Pika Cushion", img: () => decoration("pika-cushion"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 91, text: "Round Cushion", img: () => decoration("round-cushion"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 92, text: "Zigzag Cushion", img: () => decoration("zigzag-cushion"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 93, text: "Spin Cushion", img: () => decoration("spin-cushion"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 94, text: "Diamond Cushion", img: () => decoration("diamond-cushion"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 95, text: "Ball Cushion", img: () => decoration("ball-cushion"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 96, text: "Grass Cushion", img: () => decoration("grass-cushion"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 97, text: "Fire Cushion", img: () => decoration("fire-cushion"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 98, text: "Water Cushion", img: () => decoration("water-cushion"), tooltip: "Lilycove Department Store\n$2000" },
					{ id: 99, text: "Rhydon Doll", img: () => decoration("rhydon-doll"), tooltip: "Lilycove Department Store (clear-out sale)\n$10000" },
					{ id: 100, text: "Wailmer Doll", img: () => decoration("wailmer-doll"), tooltip: "Sootopolis City / Lilycove Department Store (clear-out sale)\n$10000" },
				],
			},
		],
		"thms": [
			{
				id: 1, text: "Collect all HMs", children: [
					{ id: 1, text: "HM01: Cut", img: () => hm("normal") },
					{ id: 2, text: "HM02: Fly", img: () => hm("flying") },
					{ id: 3, text: "HM03: Surf", img: () => hm("water") },
					{ id: 4, text: "HM04: Strength", img: () => hm("normal") },
					{ id: 5, text: "HM05: Flash", img: () => hm("normal") },
					{ id: 6, text: "HM06: Rock Smash", img: () => hm("fighting") },
					{ id: 7, text: "HM07: Waterfall", img: () => hm("water") },
					{ id: 8, text: "HM08: Dive", img: () => hm("water") },
				],
			},
			{
				id: 2, text: "Collect all HMs", children: [
					{ id: 1, text: "TM 01 - Focus Punch", img: () => tm("fighting") },
					{ id: 2, text: "TM 02 - Dragon Claw", img: () => tm("dragon") },
					{ id: 3, text: "TM 03 - Water Pulse", img: () => tm("water") },
					{ id: 4, text: "TM 04 - Calm Mind", img: () => tm("psychic") },
					{ id: 5, text: "TM 05 - Roar", img: () => tm("normal") },
					{ id: 6, text: "TM 06 - Toxic", img: () => tm("poison") },
					{ id: 7, text: "TM 07 - Hail", img: () => tm("ice") },
					{ id: 8, text: "TM 08 - Bulk Up", img: () => tm("fighting") },
					{ id: 9, text: "TM 09 - Bullet Seed", img: () => tm("grass") },
					{ id: 10, text: "TM 10 - Hidden Power", img: () => tm("normal") },
					{ id: 11, text: "TM 11 - Sunny Day", img: () => tm("fire") },
					{ id: 12, text: "TM 12 - Taunt", img: () => tm("dark") },
					{ id: 13, text: "TM 13 - Ice Beam", img: () => tm("ice") },
					{ id: 14, text: "TM 14 - Blizzard", img: () => tm("ice") },
					{ id: 15, text: "TM 15 - Hyper Beam", img: () => tm("normal") },
					{ id: 16, text: "TM 16 - Light Screen", img: () => tm("psychic") },
					{ id: 17, text: "TM 17 - Protect", img: () => tm("normal") },
					{ id: 18, text: "TM 18 - Rain Dance", img: () => tm("water") },
					{ id: 19, text: "TM 19 - Giga Drain", img: () => tm("grass") },
					{ id: 20, text: "TM 20 - Safeguard", img: () => tm("normal") },
					{ id: 21, text: "TM 21 - Frustration", img: () => tm("normal") },
					{ id: 22, text: "TM 22 - Solar Beam", img: () => tm("grass") },
					{ id: 23, text: "TM 23 - Iron Tail", img: () => tm("steel") },
					{ id: 24, text: "TM 24 - Thunderbolt", img: () => tm("electric") },
					{ id: 25, text: "TM 25 - Thunder", img: () => tm("electric") },
					{ id: 26, text: "TM 26 - Earthquake", img: () => tm("ground") },
					{ id: 27, text: "TM 27 - Return", img: () => tm("normal") },
					{ id: 28, text: "TM 28 - Dig", img: () => tm("ground") },
					{ id: 29, text: "TM 29 - Psychic", img: () => tm("psychic") },
					{ id: 30, text: "TM 30 - Shadow Ball", img: () => tm("ghost") },
					{ id: 31, text: "TM 31 - Brick Break", img: () => tm("fighting") },
					{ id: 32, text: "TM 32 - Double Team", img: () => tm("normal") },
					{ id: 33, text: "TM 33 - Reflect", img: () => tm("psychic") },
					{ id: 34, text: "TM 34 - Shock Wave", img: () => tm("electric") },
					{ id: 35, text: "TM 35 - Flamethrower", img: () => tm("fire") },
					{ id: 36, text: "TM 36 - Sludge Bomb", img: () => tm("poison") },
					{ id: 37, text: "TM 37 - Sandstorm", img: () => tm("rock") },
					{ id: 38, text: "TM 38 - Fire Blast", img: () => tm("fire") },
					{ id: 39, text: "TM 39 - Rock Tomb", img: () => tm("rock") },
					{ id: 40, text: "TM 40 - Aerial Ace", img: () => tm("flying") },
					{ id: 41, text: "TM 41 - Torment", img: () => tm("dark") },
					{ id: 42, text: "TM 42 - Facade", img: () => tm("normal") },
					{ id: 43, text: "TM 43 - Secret Power", img: () => tm("normal") },
					{ id: 44, text: "TM 44 - Rest", img: () => tm("psychic") },
					{ id: 45, text: "TM 45 - Attract", img: () => tm("normal") },
					{ id: 46, text: "TM 46 - Thief", img: () => tm("dark") },
					{ id: 47, text: "TM 47 - Steel Wing", img: () => tm("steel") },
					{ id: 48, text: "TM 48 - Skill Swap", img: () => tm("psychic") },
					{ id: 49, text: "TM 49 - Snatch", img: () => tm("dark") },
					{ id: 50, text: "TM 50 - Overheat", img: () => tm("fire") },
				],
			},
		],
		"extra-credit": [
			{ id: 1, text: "Obtain Jirachi", img: ({ gameKey }) => baseSprite(gameKey, 385), },
			{ id: 2, text: "Obtain Deoxys", img: ({ gameKey }) => baseSprite(gameKey, 386), },
			{
				id: 3, text: "Obtain all Secret Base e-Reader decorations", children: [
					{ id: 1, text: "Regirock Doll", img: () => decoration("regirock-doll"), tooltip: "Mystery Event (e-Reader)" },
					{ id: 2, text: "Regice Doll", img: () => decoration("regice-doll"), tooltip: "Mystery Event (e-Reader)" },
					{ id: 3, text: "Registeel Doll", img: () => decoration("registeel-doll"), tooltip: "Mystery Event (e-Reader)" },
				]
			}
		]
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
		catching: overrideTaskChildTexts(TASKS_BY_SECTION.catching, 1, {
			1: "Trade for Kyogre",
			2: "Catch Groudon",
			7: "Catch Latias",
			8: "Trade for Latios",
		}),
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
		catching: overrideTaskChildTexts(TASKS_BY_SECTION.catching, 1, {
			1: "Catch Kyogre",
			2: "Trade for Groudon",
			7: "Trade for Latias",
			8: "Catch Latios",
		}),
	};

	defineTasksMany(GAME_KEYS[0], SECTIONS, TASKS_BY_SECTION_GAME1);
	defineTasksMany(GAME_KEYS[1], SECTIONS, TASKS_BY_SECTION_GAME2);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();