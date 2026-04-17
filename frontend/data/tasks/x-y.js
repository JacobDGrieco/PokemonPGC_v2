import {
	_hm,
	_keyItem,
	_megaStone,
	_tm,
	_location,
	_npc,
	_task,
	_badges,
	_frontSprite,
	defineTasksMany,
} from '../helpers/index.js';

(() => {
	const gen = 6;
	const GAME_KEYS = ["x", "y"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const megaStone = (name) => _megaStone(gen, name);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "activites", title: "Activities" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "decorations", title: "Poke-amie Decorations" },
		{ id: "mega-stones", title: "Mega Stones" },
		{ id: "fashion", title: "Fashion" },
		{ id: "thms", title: "TMs/HMs" },
		{ id: "distributions", title: "Distributions" },
		{ id: "extra-credit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch/Trade Xerneas", img: ({ gameKey }) => baseSprite(gameKey, 716) },
					{ id: 2, text: "Catch/Trade Yveltal", img: ({ gameKey }) => baseSprite(gameKey, 717) },
					{ id: 3, text: "Catch Zygarde", img: ({ gameKey }) => baseSprite(718) },
					{ id: 4, text: "Catch/Trade Articuno", img: ({ gameKey }) => baseSprite(gameKey, 144) },
					{ id: 5, text: "Catch/Trade Zapdos", img: ({ gameKey }) => baseSprite(gameKey, 145) },
					{ id: 6, text: "Catch/Trade Moltres", img: ({ gameKey }) => baseSprite(gameKey, 146) },
					{ id: 7, text: "Catch Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150) },
				],
			},
			{
				id: 2, text: "Obtain all Static Encounters Pokemon", children: [
					{ id: 1, text: "Snorlax", img: ({ gameKey }) => baseSprite(143), tooltip: "Route 7" },
				],
			},
			{
				id: 3, text: "Obtain all In-Game Gift Pokemon", children: [
					{
						id: 1, text: "Kantonian Starter", img: ({ gameKey }) => task(gameKey, "kanto-starter"), tooltip: "Prof. Sycamore's Lab", eithers: {
							1: { text: null }, 2: { text: null }, 3: { text: null }
						},
					},
					{ id: 2, text: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), tooltip: "Tower of Mastery\nFinish the Mega Evolution tutorial" },
					{ id: 3, text: "Lapras", img: ({ gameKey }) => baseSprite(gameKey, 131), tooltip: "Route 12" },
				],
			},
			{
				id: 4, text: "Complete all In-Game Pokemon Trades", children: [
					{ id: 1, text: "Bunnelby for Farfetch'd", img: ({ gameKey }) => task(gameKey, "bunnelby-for-farfetchd"), tooltip: "Santalune City" },
					{ id: 2, text: "Jigglypuff for Bisharp", img: ({ gameKey }) => task(gameKey, "jiggleypuff-for-bisharp"), tooltip: "Snowbelle City" },
					{ id: 3, text: "Any for Kalos Starter", img: ({ gameKey }) => task(gameKey, "any-for-kalos"), tooltip: "Vaniville City\nYou will get the one that your starter is effective against" },
					{ id: 4, text: "Any for Ralts", img: ({ gameKey }) => task(gameKey, "any-for-ralts"), tooltip: "Lumiose City\nAfter defeating the Elite 4" },
					{ id: 5, text: "Luvdisc for Steelix", img: ({ gameKey }) => task(gameKey, "luvdisc-for-steelix"), tooltip: "Cyllage City" },
					{ id: 6, text: "Gyarados for Magikarp", img: ({ gameKey }) => task(gameKey, "gyarados-for-magikarp"), tooltip: "A random hotel" },
					{ id: 7, text: "Any for Eevee", img: ({ gameKey }) => task(gameKey, "any-for-eevee"), tooltip: "A random hotel" },
				],
			},
		],
		"story": [
			{
				id: 1, text: "Beat the main story", children: [
					{ id: 1, text: "Bug Badge", img: () => _badges("bug-6"), tooltip: "Defeat Viola at the Santalune City Gym" },
					{ id: 2, text: "Cliff Badge", img: () => _badges("cliff"), tooltip: "Defeat Grant at the Cyllage City Gym" },
					{ id: 3, text: "Rumble Badge", img: () => _badges("rumble"), tooltip: "Defeat Korrina at the Shalour City Gym" },
					{ id: 4, text: "Plant Badge", img: () => _badges("plant"), tooltip: "Defeat Ramos at the Coumarine City Gym" },
					{ id: 5, text: "Voltage Badge", img: () => _badges("voltage"), tooltip: "Defeat Clemont at the Lumiose City Gym" },
					{ id: 6, text: "Fairy Badge", img: () => _badges("fairy-6"), tooltip: "Defeat Valerie at the Laverre City Gym" },
					{ id: 7, text: "Psychic Badge", img: () => _badges("psychic-6"), tooltip: "Defeat Olympia at the Anistar City Gym" },
					{ id: 8, text: "Iceberg Badge", img: () => _badges("iceberg"), tooltip: "Defeat Wulfric at the Snowbelle City Gym" },
					{ id: 9, text: "Defeat the Elite 4 / Champion" },
				],
			},
			{
				id: 2, text: "Epilogue", children: [
					{ id: 1, text: "This Guy is a Real...Looker" },
					{ id: 2, text: "In the Back Alleys" },
					{ id: 3, text: "Detective, Tourist, Gang" },
					{ id: 4, text: "An Unforgiveable Crime" },
					{ id: 5, text: "A Fiery Woman & A Truth Revealed" },
					{ id: 6, text: "Here's Lookin' at you Kid" },
				]
			},
		],
		"activities": [
			{ id: 1, text: "Talk to Cassius in Camphir town" },
			{ id: 2, text: "Show the girl in Ambrette a PKMN with a speed of 193 or greater" },
			{
				id: 3, text: "Take a Photograph at all Locations", children: [
					{ id: 1, text: "Aquacorde Town", img: ({ gameKey }) => location(gameKey, "aquacorde-town") },
					{ id: 2, text: "Lumiose City", img: ({ gameKey }) => location(gameKey, "lumiose-city") },
					{ id: 3, text: "Parfum Palace", img: ({ gameKey }) => location(gameKey, "parfum-palace") },
					{ id: 4, text: "Route 7", img: ({ gameKey }) => location(gameKey, "route-7") },
					{ id: 5, text: "Geosenge Town", img: ({ gameKey }) => location(gameKey, "geosenge-town") },
					{ id: 6, text: "Shalour City", img: ({ gameKey }) => location(gameKey, "shalour-city") },
					{ id: 7, text: "Azure Bay", img: ({ gameKey }) => location(gameKey, "azure-bay") },
					{ id: 8, text: "Frost Cavern", img: ({ gameKey }) => location(gameKey, "frost-cavern") },
					{ id: 9, text: "Anistar City", img: ({ gameKey }) => location(gameKey, "anistar-city") },
					{ id: 10, text: "Couriway Town", img: ({ gameKey }) => location(gameKey, "couriway-town") },
					{ id: 11, text: "Snowbelle City", img: ({ gameKey }) => location(gameKey, "snowbelle-city") },
					{ id: 12, text: "Pokemon League", img: ({ gameKey }) => location(gameKey, "pokemon-league") },
				]
			},
			{
				id: 4, text: "Learn all Roller Skate Tricks", children: [
					{ id: 1, text: "Backflip" },
					{ id: 2, text: "Running Start" },
					{ id: 3, text: "Parallel Swizzle" },
					{ id: 4, text: "360" },
					{ id: 5, text: "Cosmic Flip" },
				]
			},
		],
		"battle": [
			{ id: 1, text: "Battle Calem/Serena", tooltip: "Kiloude City" },
			{ id: 2, text: "Get to Master Rank at the Battle Institute", tiers: ["Novice", "Normal", "Super", "Hyper", "Elite", "Master"] },
			{ id: 3, text: "Get to Grand Duke/Duchess Rank at the Battle Chateau", tiers: ["Baron/Baronness", "Viscount/Viscountess", "Marquis/Marchioness", "Duke/Duchess", "Grand Duke/Duchess"] },
			{
				id: 4, text: "Get perfect scores at all resturaunts", children: [
					{ id: 1, text: "Le Nah" },
					{
						id: 2, text: "Le Yah", multi: [
							{ id: 1, text: "Double" },
							{ id: 2, text: "Rotation" },
						]
					},
					{
						id: 3, text: "Le Wow", multi: [
							{ id: 1, text: "Double" },
							{ id: 2, text: "Triple" },
							{ id: 3, text: "Rotation" },
						]
					},
					{
						id: 4, text: "Sushi High Roller", multi: [
							{ id: 1, text: "Double" },
							{ id: 2, text: "Triple" },
							{ id: 3, text: "Rotation" },
						]
					},
				],
			},
		],
		"upgrades": [
			{ id: 1, text: "Obtain the National Dex" },
			{ id: 2, text: "Upgrade the Mega Ring", tooltip: "Upgrading will make the ring react to nearby buried Mega Stones" },
			{
				id: 3, text: "Obtain the Gold Rank Trainer Card", children: [
					{ id: 1, text: "Defeat the Elite Four" },
					{ id: 2, text: "Complete the Kalos Regional PokeDexs (454)" },
					{ id: 3, text: "Defeat a leader in the Battle Maison" },
				],
			},
			{
				id: 4, text: "Unlock all Poke-amie difficulties", tooltip: "You need to get 3+ stars to unlock the next difficulty", children: [
					{ id: 1, text: "Berry Picker", tiers: ["Easy", "Normal", "Hard", "Unlimited"] },
					{ id: 2, text: "Head It", tiers: ["Easy", "Normal", "Hard", "Unlimited"] },
					{ id: 3, text: "Tile Pizzle", tiers: ["Easy", "Normal", "Hard", "Unlimited"] },
				],
			},
		],
		"collectables": [
			{
				id: 1, text: "Collect all Key Items", children: [

				]
			},
			{
				id: 2, text: "Collect all Legendary Items", children: [
					{ id: 1, text: "Adamant Orb" },
					{ id: 2, text: "Lustrious Orb" },
					{ id: 3, text: "Griseous Orb" },
					{ id: 4, text: "Gracedia" },
					{ id: 5, text: "DNA Splicers" },
					{ id: 6, text: "Burn Drive" },
					{ id: 7, text: "Shock Drive" },
					{ id: 8, text: "Douse Drive" },
					{ id: 9, text: "Chill Drive" },
				]
			},
			{
				id: 3, text: "Collect all 17 Arceus Plates", children: [
					{ id: 1, text: "Draco Plate" },
					{ id: 2, text: "Dread Plate" },
					{ id: 3, text: "Earth Plate" },
					{ id: 4, text: "Fist Plate" },
					{ id: 5, text: "Flame Plate" },
					{ id: 6, text: "Icicle Plate" },
					{ id: 7, text: "Insect Plate" },
					{ id: 8, text: "Iron Plate" },
					{ id: 9, text: "Meadow Plate" },
					{ id: 10, text: "Mind Plate" },
					{ id: 11, text: "Pixie Plate" },
					{ id: 12, text: "Sky Plate" },
					{ id: 13, text: "Splash Plate" },
					{ id: 14, text: "Spooky Plate" },
					{ id: 15, text: "Stone Plate" },
					{ id: 16, text: "Toxic Plate" },
					{ id: 17, text: "Zap Plate" },
				]
			},
			{
				id: 4, text: "Collect all 17 O-Powers", children: [
					{ id: 1, text: "Attack Power" },
					{ id: 2, text: "Defense Power" },
					{ id: 3, text: "Sp. Attack Power" },
					{ id: 4, text: "Sp. Defense Power" },
					{ id: 5, text: "Accuracy Power" },
					{ id: 6, text: "Speed Power" },
					{ id: 7, text: "HP Restoring Power" },
					{ id: 8, text: "Capture Power" },
					{ id: 9, text: "Exp. Point Power" },
					{ id: 10, text: "Prize Money Power" },
					{ id: 11, text: "Befriending Power" },
					{ id: 12, text: "Encounter Power" },
					{ id: 13, text: "Stealth Power" },
					{ id: 14, text: "PP Restoring Power" },
					{ id: 15, text: "Bargain Power" },
					{ id: 16, text: "Critical Power" },
					{ id: 17, text: "Hatching Power" },
				]
			},
		],
		"mega-stones": [
			{ id: 1, text: "Venusaurite", img: ({ gameKey }) => [baseSprite(gameKey, "003-m"), megaStone("venusaurite")], },
			{ id: 2, text: "Charizardite X", img: ({ gameKey }) => [baseSprite(gameKey, "006-mx"), megaStone("charizardite-x")], },
			{ id: 3, text: "Charizardite Y", img: ({ gameKey }) => [baseSprite(gameKey, "006-my"), megaStone("charizardite-y")], },
			{ id: 4, text: "Blastoisinite", img: ({ gameKey }) => [baseSprite(gameKey, "009-m"), megaStone("blastoisinite")], },
			{ id: 5, text: "Alakazite", img: ({ gameKey }) => [baseSprite(gameKey, "065-m"), megaStone("alakazite")], },
			{ id: 6, text: "Gengarite", img: ({ gameKey }) => [baseSprite(gameKey, "094-m"), megaStone("gengarite")], },
			{ id: 7, text: "Kangaskhanite", img: ({ gameKey }) => [baseSprite(gameKey, "115-m"), megaStone("kangaskhanite")], },
			{ id: 8, text: "Pinsirite", img: ({ gameKey }) => [baseSprite(gameKey, "127-m"), megaStone("pinsirite")], },
			{ id: 9, text: "Gyaradosite", img: ({ gameKey }) => [baseSprite(gameKey, "130-m"), megaStone("gyaradosite")], },
			{ id: 10, text: "Aerodactylite", img: ({ gameKey }) => [baseSprite(gameKey, "142-m"), megaStone("aerodactylite")], },
			{ id: 11, text: "Mewtwonite X", img: ({ gameKey }) => [baseSprite(gameKey, "150-mx"), megaStone("mewtwonite-x")], },
			{ id: 12, text: "Mewtwonite Y", img: ({ gameKey }) => [baseSprite(gameKey, "150-my"), megaStone("mewtwonite-y")], },
			{ id: 13, text: "Ampharosite", img: ({ gameKey }) => [baseSprite(gameKey, "181-m"), megaStone("ampharosite")], },
			{ id: 14, text: "Scizorite", img: ({ gameKey }) => [baseSprite(gameKey, "212-m"), megaStone("scizorite")], },
			{ id: 15, text: "Heracronite", img: ({ gameKey }) => [baseSprite(gameKey, "214-m"), megaStone("heracronite")], },
			{ id: 16, text: "Houndoominite", img: ({ gameKey }) => [baseSprite(gameKey, "229-m"), megaStone("houndoominite")], },
			{ id: 17, text: "Tyranitarite", img: ({ gameKey }) => [baseSprite(gameKey, "248-m"), megaStone("tyranitarite")], },
			{ id: 18, text: "Gardevoirite", img: ({ gameKey }) => [baseSprite(gameKey, "282-m"), megaStone("gardevoirite")], },
			{ id: 19, text: "Mawilite", img: ({ gameKey }) => [baseSprite(gameKey, "303-m"), megaStone("mawilite")], },
			{ id: 20, text: "Aggronite", img: ({ gameKey }) => [baseSprite(gameKey, "306-m"), megaStone("aggronite")], },
			{ id: 21, text: "Medichamite", img: ({ gameKey }) => [baseSprite(gameKey, "308-m"), megaStone("medichamite")], },
			{ id: 22, text: "Manectite", img: ({ gameKey }) => [baseSprite(gameKey, "310-m"), megaStone("manectite")], },
			{ id: 23, text: "Banettite", img: ({ gameKey }) => [baseSprite(gameKey, "354-m"), megaStone("banettite")], },
			{ id: 24, text: "Absolite", img: ({ gameKey }) => [baseSprite(gameKey, "359-m"), megaStone("absolite")], },
			{ id: 25, text: "Garchompite", img: ({ gameKey }) => [baseSprite(gameKey, "445-m"), megaStone("garchompite")], },
			{ id: 26, text: "Abomasite", img: ({ gameKey }) => [baseSprite(gameKey, "460-m"), megaStone("abomasite")], },
		],
		"thms": [
			{
				id: 1, text: "Collect all HMs", children: [
					{ id: 1, text: "HM01 (Cut)", img: () => hm("normal") },
					{ id: 2, text: "HM02 (Fly)", img: () => hm("flying") },
					{ id: 3, text: "HM03 (Surf)", img: () => hm("water") },
					{ id: 4, text: "HM04 (Strength)", img: () => hm("normal") },
					{ id: 5, text: "HM05 (Waterfall)", img: () => hm("water") },
				],
			},
			{
				id: 2, text: "Collect all HMs", children: [
					{ id: 1, text: "TM01 (Hone Claws)", img: () => tm("dark") },
					{ id: 2, text: "TM02 (Dragon Claw)", img: () => tm("dragon") },
					{ id: 3, text: "TM03 (Psyshock)", img: () => tm("psychic") },
					{ id: 4, text: "TM04 (Calm Mind)", img: () => tm("psychic") },
					{ id: 5, text: "TM05 (Roar)", img: () => tm("normal") },
					{ id: 6, text: "TM06 (Toxic)", img: () => tm("poison") },
					{ id: 7, text: "TM07 (Hail)", img: () => tm("ice") },
					{ id: 8, text: "TM08 (Bulk Up)", img: () => tm("fighting") },
					{ id: 9, text: "TM09 (Venoshock)", img: () => tm("poison") },
					{ id: 10, text: "TM10 (Hidden Power)", img: () => tm("normal") },
					{ id: 11, text: "TM11 (Sunny Day)", img: () => tm("fire") },
					{ id: 12, text: "TM12 (Taunt)", img: () => tm("dark") },
					{ id: 13, text: "TM13 (Ice Beam)", img: () => tm("ice") },
					{ id: 14, text: "TM14 (Blizzard)", img: () => tm("ice") },
					{ id: 15, text: "TM15 (Hyper Beam)", img: () => tm("normal") },
					{ id: 16, text: "TM16 (Light Screen)", img: () => tm("psychic") },
					{ id: 17, text: "TM17 (Protect)", img: () => tm("normal") },
					{ id: 18, text: "TM18 (Rain Dance)", img: () => tm("water") },
					{ id: 19, text: "TM19 (Telekinesis)", img: () => tm("psychic") },
					{ id: 20, text: "TM20 (Safeguard)", img: () => tm("normal") },
					{ id: 21, text: "TM21 (Frustration)", img: () => tm("normal") },
					{ id: 22, text: "TM22 (Solar Beam)", img: () => tm("grass") },
					{ id: 23, text: "TM23 (Smack Down)", img: () => tm("rock") },
					{ id: 24, text: "TM24 (Thunderbolt)", img: () => tm("electric") },
					{ id: 25, text: "TM25 (Thunder)", img: () => tm("electric") },
					{ id: 26, text: "TM26 (Earthquake)", img: () => tm("ground") },
					{ id: 27, text: "TM27 (Return)", img: () => tm("normal") },
					{ id: 28, text: "TM28 (Dig)", img: () => tm("ground") },
					{ id: 29, text: "TM29 (Psychic)", img: () => tm("psychic") },
					{ id: 30, text: "TM30 (Shadow Ball)", img: () => tm("ghost") },
					{ id: 31, text: "TM31 (Brick Break)", img: () => tm("fighting") },
					{ id: 32, text: "TM32 (Double Team)", img: () => tm("normal") },
					{ id: 33, text: "TM33 (Reflect)", img: () => tm("psychic") },
					{ id: 34, text: "TM34 (Sludge Wave)", img: () => tm("poison") },
					{ id: 35, text: "TM35 (Flamethrower)", img: () => tm("fire") },
					{ id: 36, text: "TM36 (Sludge Bomb)", img: () => tm("poison") },
					{ id: 37, text: "TM37 (Sandstorm)", img: () => tm("rock") },
					{ id: 38, text: "TM38 (Fire Blast)", img: () => tm("fire") },
					{ id: 39, text: "TM39 (Rock Blast)", img: () => tm("rock") },
					{ id: 40, text: "TM40 (Aerial Ace)", img: () => tm("flying") },
					{ id: 41, text: "TM41 (Torment)", img: () => tm("dark") },
					{ id: 42, text: "TM42 (Facade)", img: () => tm("normal") },
					{ id: 43, text: "TM43 (Flame Charge)", img: () => tm("fire") },
					{ id: 44, text: "TM44 (Rest)", img: () => tm("psychic") },
					{ id: 45, text: "TM45 (Attract)", img: () => tm("normal") },
					{ id: 46, text: "TM46 (Thief)", img: () => tm("dark") },
					{ id: 47, text: "TM47 (Low Sweep)", img: () => tm("fighting") },
					{ id: 48, text: "TM48 (Round)", img: () => tm("normal") },
					{ id: 49, text: "TM49 (Echoed Voice)", img: () => tm("normal") },
					{ id: 50, text: "TM50 (Overheat)", img: () => tm("fire") },
					{ id: 51, text: "TM51 (Ally Switch)", img: () => tm("psychic") },
					{ id: 52, text: "TM52 (Focus Blast)", img: () => tm("fighting") },
					{ id: 53, text: "TM53 (Energy Ball)", img: () => tm("grass") },
					{ id: 54, text: "TM54 (False Swipe)", img: () => tm("normal") },
					{ id: 55, text: "TM55 (Scald)", img: () => tm("water") },
					{ id: 56, text: "TM56 (Fling)", img: () => tm("dark") },
					{ id: 57, text: "TM57 (Charge Beam)", img: () => tm("electric") },
					{ id: 58, text: "TM58 (Sky Drop)", img: () => tm("flying") },
					{ id: 59, text: "TM59 (Incinerate)", img: () => tm("fire") },
					{ id: 60, text: "TM60 (Quash)", img: () => tm("dark") },
					{ id: 61, text: "TM61 (Will-O-Wisp)", img: () => tm("fire") },
					{ id: 62, text: "TM62 (Acrobatics)", img: () => tm("flying") },
					{ id: 63, text: "TM63 (Embargo)", img: () => tm("dark") },
					{ id: 64, text: "TM64 (Explosion)", img: () => tm("normal") },
					{ id: 65, text: "TM65 (Shadow Claw)", img: () => tm("ghost") },
					{ id: 66, text: "TM66 (Payback)", img: () => tm("dark") },
					{ id: 67, text: "TM67 (Retaliate)", img: () => tm("normal") },
					{ id: 68, text: "TM68 (Giga Impact)", img: () => tm("normal") },
					{ id: 69, text: "TM69 (Rock Polish)", img: () => tm("rock") },
					{ id: 70, text: "TM70 (Flash)", img: () => tm("normal") },
					{ id: 71, text: "TM71 (Stone Edge)", img: () => tm("rock") },
					{ id: 72, text: "TM72 (Volt Switch)", img: () => tm("electric") },
					{ id: 73, text: "TM73 (Thunder Wave)", img: () => tm("electric") },
					{ id: 74, text: "TM74 (Gyro Ball)", img: () => tm("steel") },
					{ id: 75, text: "TM75 (Swords Dance)", img: () => tm("normal") },
					{ id: 76, text: "TM76 (Struggle Bug)", img: () => tm("bug") },
					{ id: 77, text: "TM77 (Psych Up)", img: () => tm("normal") },
					{ id: 78, text: "TM78 (Bulldoze)", img: () => tm("ground") },
					{ id: 79, text: "TM79 (Frost Breath)", img: () => tm("ice") },
					{ id: 80, text: "TM80 (Rock Slide)", img: () => tm("rock") },
					{ id: 81, text: "TM81 (X-Scissor)", img: () => tm("bug") },
					{ id: 82, text: "TM82 (Dragon Tail)", img: () => tm("dragon") },
					{ id: 83, text: "TM83 (Work Up)", img: () => tm("normal") },
					{ id: 84, text: "TM84 (Poison Jab)", img: () => tm("poison") },
					{ id: 85, text: "TM85 (Dream Eater)", img: () => tm("psychic") },
					{ id: 86, text: "TM86 (Grass Knot)", img: () => tm("grass") },
					{ id: 87, text: "TM87 (Swagger)", img: () => tm("normal") },
					{ id: 88, text: "TM88 (Pluck)", img: () => tm("flying") },
					{ id: 89, text: "TM89 (U-turn)", img: () => tm("bug") },
					{ id: 90, text: "TM90 (Substitute)", img: () => tm("normal") },
					{ id: 91, text: "TM91 (Flash Cannon)", img: () => tm("steel") },
					{ id: 92, text: "TM92 (Trick Room)", img: () => tm("psychic") },
					{ id: 93, text: "TM93 (Wild Charge)", img: () => tm("electric") },
					{ id: 94, text: "TM94 (Rock Smash)", img: () => tm("fighting") },
					{ id: 95, text: "TM95 (Snarl)", img: () => tm("dark") },
					{ id: 96, text: "TM96 (Natural Power)", img: () => tm("normal") },
					{ id: 97, text: "TM97 (Dark Pulse)", img: () => tm("dark") },
					{ id: 98, text: "TM98 (Power-Up Punch)", img: () => tm("fighting") },
					{ id: 99, text: "TM99 (Dazzling Gleam)", img: () => tm("fairy") },
					{ id: 100, text: "TM 100 - Confide", img: () => tm("normal") }
				],
			},
		],
		"extra-credit": [
			{
				id: 1, text: "Obtain all Event Mythicals", children: [
					{ id: 1, text: "Diancie", img: ({ gameKey }) => baseSprite(gameKey, 719) },
					{ id: 2, text: "Hoopa", img: ({ gameKey }) => baseSprite(gameKey, 720) },
					{ id: 3, text: "Volcanion", img: ({ gameKey }) => baseSprite(gameKey, 721) },
				],
			},
		],
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
		catching: overrideTasks(TASKS_BY_SECTION.catching, 1, {
			1: { text: "Catch Xerneas" },
			2: { text: "Trade Yveltal" },
		}),
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
		catching: overrideTasks(TASKS_BY_SECTION.catching, 1, {
			1: { text: "Trade Xerneas" },
			2: { text: "Catch Yveltal" },
		}),
	};

	defineTasksMany(GAME_KEYS[0], SECTIONS, TASKS_BY_SECTION_GAME1);
	defineTasksMany(GAME_KEYS[1], SECTIONS, TASKS_BY_SECTION_GAME2);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();
