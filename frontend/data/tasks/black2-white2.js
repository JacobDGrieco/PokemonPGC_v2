import {
	_hm,
	_keyItem,
	_tm,
	_location,
	_npc,
	_task,
	_frontSprite,
	_frontSpriteShiny,
	defineTasksMany,
	overrideTasks,
} from '../helpers/index.js';

(() => {
	const gen = 5;
	const GAME_KEYS = ["black2", "white2"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const shinySprite = (gameKey, natiId) => _frontSpriteShiny(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "funfest", title: "Funfest Missions" },
		{ id: "activites", title: "Activities" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "accessories", title: "Musical Accessories" },
		{ id: "medals", title: "Medals" },
		{ id: "thms", title: "TMs/HMs" },
		{ id: "distributions", title: "Distributions" },
		{ id: "extra-credit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch/Trade Reshiram", img: ({ gameKey }) => baseSprite(gameKey, 643) },
					{ id: 2, text: "Catch/Trade Zekrom", img: ({ gameKey }) => baseSprite(gameKey, 644) },
					{ id: 3, text: "Catch Kyurem", img: ({ gameKey }) => baseSprite(gameKey, 646) },
					{ id: 4, text: "Catch Cobalion", img: ({ gameKey }) => baseSprite(gameKey, 638) },
					{ id: 5, text: "Catch Terrakion", img: ({ gameKey }) => baseSprite(gameKey, 639) },
					{ id: 6, text: "Catch Virizion", img: ({ gameKey }) => baseSprite(gameKey, 640) },
					{ id: 7, text: "Catch Uxie", img: ({ gameKey }) => baseSprite(gameKey, 480) },
					{ id: 8, text: "Catch Mesprit", img: ({ gameKey }) => baseSprite(gameKey, 481) },
					{ id: 9, text: "Catch Azelf", img: ({ gameKey }) => baseSprite(gameKey, 482) },
					{ id: 10, text: "Catch Heatran", img: ({ gameKey }) => baseSprite(gameKey, 485) },
					{ id: 11, text: "Catch Regigigas", img: ({ gameKey }) => baseSprite(gameKey, 486) },
					{ id: 12, text: "Catch Cresselia", img: ({ gameKey }) => baseSprite(gameKey, 488) },
					{ id: 13, text: "Catch Regirock", img: ({ gameKey }) => baseSprite(gameKey, 377) },
					{ id: 14, text: "Catch/Trade Regice", img: ({ gameKey }) => baseSprite(gameKey, 378) },
					{ id: 15, text: "Catch/Trade Registeel", img: ({ gameKey }) => baseSprite(gameKey, 379) },
					{ id: 16, text: "Catch/Trade Latias", img: ({ gameKey }) => baseSprite(gameKey, 380) },
					{ id: 17, text: "Catch/Trade Latios", img: ({ gameKey }) => baseSprite(gameKey, 381) },
				],
			},
			{
				id: 2, text: "Obtain all Static Encounter Pokemon", children: [
					{ id: 1, text: "Minccino", img: ({ gameKey }) => baseSprite(gameKey, 572), tooltip: "Route 5 - Hidden Grotto" },
					{ id: 2, text: "Volcarona", img: ({ gameKey }) => baseSprite(gameKey, 637), tooltip: "Relic Castle\nLvl 35 before defeating the Elite 4\nLvl 65 after defeating the Elite 4" },
					{ id: 3, text: "Foongus", img: ({ gameKey }) => baseSprite(gameKey, 590), tooltip: "Route 6" },
					{ id: 4, text: "Crustle", img: ({ gameKey }) => shinySprite(gameKey, 558), tooltip: "Seaside Cave" },
					{ id: 5, text: "Shiny Haxorus", img: ({ gameKey }) => baseSprite(gameKey, 612), tooltip: "Nature Preserve\nSee all Pokemon, get the License, and talk to the attendant in Mistralton City" },
				],
			},
			{
				id: 3, text: "Obtain all In-Game Gift Pokemon", children: [
					{ id: 1, text: "N's Zorua", img: ({ gameKey }) => baseSprite(gameKey, 570), tooltip: "Driftveil City - Talk with the Sage after defeating New Team Plasma" },
					{ id: 2, text: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 511), tooltip: "Castelia City - Talk to Amanita after defeating the Elite 4" },
					{ id: 3, text: "Deerling", img: ({ gameKey }) => baseSprite(gameKey, 585), tooltip: "Route 6 - Weather Institute" },
					{ id: 4, text: "Shiny Gible/Shiny Dratini", img: ({ gameKey }) => shinySprite(gameKey, 443), tooltip: "Black City/White Forest - Defeat Benga" },
					{ id: 5, text: "Happiny Egg", img: ({ gameKey }) => baseSprite(gameKey, 440), tooltip: "Nacrene City - Gate" },
					{ id: 6, text: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), tooltip: "Marvelous Bridge" },
					{
						id: 7, text: "Tirtouga/Archen", img: ({ gameKey }) => task(gameKey, "fossil"), tooltip: "Nacrene Museum - After defeating the Elite 4", eithers: {
							1: { text: null }, 2: { text: null }
						}
					},
				],
			},
			{
				id: 4, text: "Complete all In-Game Pokemon Trades", children: [
					{ id: 1, text: "Cottonee for Petilil", img: ({ gameKey }) => task(gameKey, "cottonee-for-petilil") },
					{ id: 2, text: "Emolga for Gigalith", img: ({ gameKey }) => task(gameKey, "emolga-for-gigalith") },
					{ id: 3, text: "Mantine for Tangrowth", img: ({ gameKey }) => task(gameKey, "mantine-for-tangrowth") },
					{ id: 4, text: "Ditto for Rotom", img: ({ gameKey }) => task(gameKey, "ditto-for-rotom") },
					{ id: 5, text: "Excadrill for Ambipom", img: ({ gameKey }) => task(gameKey, "excadrill-for-ambipom") },
					{ id: 6, text: "Hippowdon for Alakazam", img: ({ gameKey }) => task(gameKey, "hippowdon-for-alakazam") },
				],
			},
		],
		"story": [
			{ id: 1, text: "Collect all 8 Gym Badges and Defeat the Elite 4", img: () => _badges(["coal", "forest", "cobble", "fen", "relic", "mine", "icicle", "beacon"]), noCenter: true, },
		],
		"funfest": [
			{
				id: 1, text: "Complete all Funfest Missions", children: [
					{ id: 1, text: "The First Berry Search!", tooltip: "Search for 5 Berries" },
					{ id: 2, text: "Collect Berries!", tiers: [3, 6, 12, 25], tooltip: "Collect numerous berries" },
					{ id: 3, text: "Find Lost Items!", tiers: [10, 15, 20, 40], tooltip: "Collect numerous items" },
					{ id: 4, text: "Find Lost Boys!", tiers: [4, 8, 16, 50], tooltip: "Find the small children" },
					{ id: 5, text: "Enjoy Shopping!", tiers: [3, 8, 16, 25], tooltip: "Find the various trainers who are selling things and buy from them" },
					{ id: 6, text: "Find Audino!", tiers: [1, 5, 10, 50], tooltip: "Look for an Audino in shaking grass and capture it" },
					{ id: 7, text: "Search for ?? Pokemon!", tiers: [3, 5, 10, 50], tooltip: "Look for numerous Pokemon" },
					{ id: 8, text: "Train with Marital Artists!", tiers: [2, 4, 8, 100], tooltip: "Battle against various BlackBelts" },
					{ id: 9, text: "Sparring with ?? Trainers!", tiers: [10, 30, 50, 100], tooltip: "Battle against various trainers" },
					{ id: 10, text: "Get Rich Quick!", tiers: [3, 6, 12, 25], tooltip: "Hunt for numerous treasures inshiny spots of forests and caves" },
					{ id: 11, text: "Treasure Hunting!", tiers: [6, 12, 24, 50], tooltip: "Hunt for numerous items & treasures in shiny spots of forests and caves" },
					{ id: 12, text: "Exciting/Exhilarating Trading!!", tiers: [2, 4, 8, 50], tooltip: "Exchange items with numerous people" },
					{ id: 13, text: "Find Emolga!", tiers: [1, 5, 10, 30], tooltip: "Find Emolga in rustling grass on Route 5" },
					{ id: 14, text: "Wings Falling on the Drawbridge!", tiers: [5, 10, 40, 100], tooltip: "Pick up and collect wings at Driftveil Drawbridge!" },
					{ id: 15, text: "Find Treasures!", tiers: [5, 10, 20, 100], tooltip: "Find treasures, which can be found in caves in different areas" },
					{ id: 16, text: "Mushrooms' Hide-and-Seek!", tiers: [3, 10, 30, 50], tooltip: "Find Foongus & Amoonguss" },
					{ id: 17, text: "Find Mysterious/Shining Ores!", tiers: [10, 20, 30, 30], tooltip: "Find hidden items within the cave" },
					{ id: 18, text: "The ?? Lost Treasures", tiers: [2, 4, 10, 30], tooltip: "Find the trainer's specific lost items" },
					{ id: 19, text: "Big Harvest of Berries!", tiers: [6, 12, 24, 100], tooltip: "Find a specific amount of berries" },
					{ id: 20, text: "Ring the Bell...", tiers: [1, 2, 8, 10], tooltip: "Ring the bell of Celestial Tower" },
					{ id: 21, text: "The Bell that Rings ?? Times", tiers: [3, 5, 7, 10], tooltip: "Ring the Bell of Celestial Tower" },
					{ id: 22, text: "Path to an Ace!", tiers: [3, 6, 12, 50], tooltip: "Battle numerous trainers, who increase in level with each battle" },
					{ id: 23, text: "Shocking Shopping!", tiers: [4, 8, 32, 100], tooltip: "Find many men in black and purchase items from them" },
					{ id: 24, text: "Memory Training!", tiers: [6, 10, 12, 50], tooltip: "Follow instructions and speak to the correct people" },
					{ id: 25, text: "Push the Limit of Your Memory!", tiers: [5, 10, 40, 10], tooltip: "Follow instructions and speak to the correct people" },
					{ id: 26, text: "Find Rustling Grass!", tiers: [5, 10, 20, 100], tooltip: "Capture Pokemon from Shaking Grass" },
					{ id: 27, text: "Find Shards!", tiers: [3, 16, 32, 100], tooltip: "Find numerous shards" },
					{ id: 28, text: "Forgotten/Not-Found Lost Items", tiers: [5, 10, 50, 100], tooltip: "Find the forgotten items" },
					{ id: 29, text: "What is the Best/Real Price?", tiers: [6, 12, 40, 50], tooltip: "Talk to the man in black and purchase a rare item" },
					{ id: 30, text: "Give Me the Item!", tiers: [10, 15, 20, 40], tooltip: "Exchange items with various people" },
					{ id: 31, text: "Do a Great Trade-Up!", tiers: [3, 6, 80, 100], tooltip: "Exchange items with various people" },
					{ id: 32, text: "Search Hidden Grottoes!", tiers: [1, 3, 5, 10], tooltip: "Capture Pokemon in Hidden Grottos" },
					{ id: 33, text: "Noisy/Quiet Hidden Grottoes!", tiers: [3, 5, 10, 30], tooltip: "Capture Pokemon in Hiddeon Grottos" },
					{ id: 34, text: "Fishing Competition!", tiers: [5, 10, 20, 30], tooltip: "Capture Pokemon with your Rod" },
					{ id: 35, text: "Mulch Collector!", tiers: [6, 12, 24, 9], tooltip: "Collect various amounts of Mulch" },
					{ id: 36, text: "Where Are Fluttering Hearts!", tiers: [10, 20, 40, 100], tooltip: "Collect Heart Scales" },
					{ id: 37, text: "Rock-Paper-Scissors Competition!", tiers: [5, 10, 50, 100], tooltip: "Play Rock-Paper-Scissors" },
					{ id: 38, text: "Take a Walk with Eggs!", tiers: [3, 12, 50, 100], tooltip: "Hatch Eggs" },
					{ id: 39, text: "Find Steelix!", tiers: [1, 5, 15, 30], tooltip: "Hunt for Steelix" },
				],
			},
		],
		"activities": [
			{ id: 1, text: "Complete the Dropped Item quest for Yancy/Curtis", tooltip: "Yancy or Curtis depends on your chosen gender" },
			{ id: 2, text: "Reach EX Rank in PokeStar Studios", tiers: ["Rank 1", "Rank 2", "Rank 3", "Rank 4", "Rank 5", "EX Rank"], tooltip: "Tiers by revenue: 0, 300 Billion, 1000 Billion, 2500 Billion, 4500 Billion, Complete all Movies" },
			{ id: 3, text: "Reach Level 100 in Join Avenue", tiers: [range(1, 100)] },
		],
		"battle": [
			{ id: 1, text: "Defeat Benga", tooltip: "Black City/White Forest" },
			{ id: 2, text: "Get to Master Rank at the Battle Institute", tiers: ["Novice", "Normal", "Super", "Hyper", "Elite", "Master"] },
			{
				id: 3, text: "Battle NPCs after defeating the Elite 4", children: [
					{ id: 1, text: "Alder", tooltip: "Floccesy Town" },
					{ id: 2, text: "Cynthia", tooltip: "Undella Town" },
					{
						id: 3, text: "Nate/Rosa", children: [
							{ id: 1, text: "Undella Town" },
							{ id: 2, text: "Driftveil Town" }
						],
					},
				],
			},
			{
				id: 4, text: "Complete all Battle Subway Lines", children: [
					{ id: 1, text: "Green Line", tooltip: "Singles" },
					{ id: 2, text: "Dark Green Line", tooltip: "Super Singles" },
					{ id: 3, text: "Red Line", tooltip: "Doubles" },
					{ id: 4, text: "Pink Line", tooltip: "Super Doubles" },
					{ id: 5, text: "Orange Line", tooltip: "Multi" },
					{ id: 6, text: "Yellow Line", tooltip: "Super Multi" },
				],
			},
			{
				id: 5, text: "Complete all World Tournaments", children: [
					{ id: 1, text: "Driftveil" },
					{ id: 2, text: "Rental" },
					{ id: 3, text: "Mix" },
					{ id: 4, text: "Download" },
					{ id: 5, text: "Unova Leaders" },
					{ id: 6, text: "Kanto Leaders" },
					{ id: 7, text: "Johto Leaders" },
					{ id: 8, text: "Hoenn Leaders" },
					{ id: 9, text: "Sinnoh Leaders" },
					{ id: 10, text: "World Leaders" },
					{ id: 11, text: "Champions" },
					{ id: 12, text: "Rental Masters" },
					{ id: 13, text: "Mix Master" },
					{ id: 14, text: "Type Expert" },
				],
			},
		],
		"upgrades": [
			{ id: 1, text: "Obtain the National Dex" },
			{
				id: 2, text: "Obtain the Black/White Rank Trainer Card", children: [
					{ id: 1, text: "Defeat the Elite Four" },
					{ id: 2, text: "Complete the National Dex" },
					{ id: 3, text: "Achieve EX Rank in PokeStar Studios" },
					{ id: 4, text: "Defeat the Champions at the Pokemon World Tournament" },
					{ id: 5, text: "Gain an Entree Level of 30" },
				],
			},
			{
				id: 3, text: "Unlock all Mode Changes", children: [
					{ id: 1, text: "Easy Mode" },
					{ id: 1, text: "Normal Mode" },
					{ id: 2, text: "Challenge Mode" },
					{ id: 3, text: "Tower Key" },
					{ id: 4, text: "Forest Key" },
					{ id: 5, text: "Rock Peak Key" },
					{ id: 5, text: "Iron Key" },
					{ id: 6, text: "Iceberg Key" },
				]
			},
		],
		"collectables": [
			{
				id: 1, text: "Collect all Key Items", children: [

				]
			},
			{
				id: 2, text: "Collect all Legendary Items", children: [
					{ id: 1, text: "DNA Splicers" },
					{ id: 2, text: "Reveal Glass" },
					{ id: 3, text: "Burn/Douse Drive" },
					{ id: 4, text: "Shock/Chill Drive" },
					{ id: 5, text: "Adamant Orb" },
					{ id: 6, text: "Lustrious Orb" },
					{ id: 7, text: "Griseous Orb" },
					{ id: 8, text: "Soul Dew" },
				]
			},
			{
				id: 3, text: "Collect all 16 Arceus Plates", children: [
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
					{ id: 11, text: "Sky Plate" },
					{ id: 12, text: "Splash Plate" },
					{ id: 13, text: "Spooky Plate" },
					{ id: 14, text: "Stone Plate" },
					{ id: 15, text: "Toxic Plate" },
					{ id: 16, text: "Zap Plate" },
				]
			},
		],
		"accessories": [
			{
				id: 1, text: "Collect all Head attatchements", tooltip: "Can be obtained by connecting to a Pokemon Black/White save\nWill copy items over", children: [
					{ id: 1, text: "Scarlet Hat" },
					{ id: 2, text: "Wig" },
					{ id: 3, text: "Witchy Hat" },
					{ id: 4, text: "Big Barrette" },
					{ id: 5, text: "Pirate Hat" },
					{ id: 6, text: "Cowboy Hat" },
					{
						id: 7, text: "Headband", multi: [
							{ id: 1, text: "Cute" },
							{ id: 2, text: "Elegant" }
						]
					},
					{ id: 8, text: "Laurel Wreath" },
					{ id: 9, text: "Crown" },
					{ id: 10, text: "Chef's Hat" },
					{ id: 11, text: "Lace Cap" },
					{ id: 12, text: "Gentleman's Hat" },
					{ id: 13, text: "Fedora" },
					{ id: 14, text: "Horn Helmet" },
					{ id: 15, text: "Tiara" },
					{ id: 16, text: "Bib" },
					{ id: 17, text: "Professor's Hat" },
					{ id: 18, text: "Helmet" },
					{ id: 19, text: "Beret" },
					{ id: 20, text: "Straw Hat" },
					{ id: 21, text: "Jester's Cap" },
					{ id: 22, text: "Decorative Ribbon" },
				]
			},
			{
				id: 2, text: "Collect all Face attatchements", tooltip: "Can be obtained by connecting to a Pokemon Black/White save\nWill copy items over", children: [
					{ id: 1, text: "Red Nose" },
					{ id: 2, text: "Germ Mask" },
					{ id: 3, text: "Googly Specs" },
					{ id: 4, text: "Gorgeous Specs" },
					{ id: 5, text: "Square Glasses" },
					{ id: 6, text: "White Domino Mask" },
					{ id: 7, text: "Smiley-Face Mask" },
					{ id: 8, text: "Fluffy Beard" },
					{ id: 9, text: "Monocle" },
				]
			},
			{
				id: 3, text: "Collect all Ear attatchements", tooltip: "Can be obtained by connecting to a Pokemon Black/White save\nWill copy items over", children: [
					{ id: 1, text: "Blue Flower" },
					{ id: 2, text: "Red Flower" },
					{ id: 3, text: "Striped Barrette" },
					{ id: 4, text: "Small Barrette" },
					{ id: 5, text: "Gorgeous Flower" },
					{ id: 6, text: "Pink Barrette" },
					{ id: 7, text: "Blue Barrette" },
					{ id: 8, text: "Red Barrette" },
					{ id: 9, text: "Green Barrette" },
					{ id: 10, text: "Snow Crystal" },
				]
			},
			{
				id: 4, text: "Collect all Arm attatchements", tooltip: "Can be obtained by connecting to a Pokemon Black/White save\nWill copy items over", children: [
					{ id: 1, text: "Red Parasol" },
					{ id: 2, text: "Whisk" },
					{ id: 3, text: "Lonely Flower" },
					{ id: 4, text: "Paint Brush" },
					{ id: 5, text: "Electric Guitar" },
					{ id: 6, text: "Big Bag" },
					{ id: 7, text: "Wind Up Key" },
					{ id: 8, text: "Toy Fishing Rod" },
					{ id: 9, text: "Toy Cutlass" },
					{ id: 10, text: "Toy Sword" },
					{ id: 11, text: "Rigid Shield" },
					{ id: 12, text: "Mallet" },
					{ id: 13, text: "Colorful Parasol" },
					{ id: 14, text: "Candy" },
					{ id: 15, text: "White Pompom" },
					{ id: 16, text: "Shuriken" },
					{ id: 17, text: "Cane" },
					{ id: 18, text: "Standing Mike" },
					{ id: 19, text: "Wrench" },
					{ id: 20, text: "Tambourine" },
					{ id: 21, text: "Pocket Watch" },
					{ id: 22, text: "Lantern" },
					{ id: 23, text: "Purse" },
					{ id: 24, text: "Rose" },
					{ id: 25, text: "Microphone" },
					{ id: 26, text: "Ladel" },
					{ id: 27, text: "Thick Book" },
					{ id: 28, text: "Bouquet" },
					{ id: 29, text: "Frying Pan" },
					{ id: 30, text: "Pennant" },
					{ id: 31, text: "Gift Box" },
					{ id: 32, text: "Football" },
					{ id: 33, text: "Trident" },
					{ id: 34, text: "Fake Bone" },
					{ id: 35, text: "Magic Wand" },
					{ id: 36, text: "Maraca" },
					{ id: 37, text: "Round Mushroom" },
					{ id: 38, text: "Racket" },
					{ id: 39, text: "Trumpet" },
					{ id: 40, text: "Toy Cake" },
				]
			},
			{
				id: 5, text: "Collect all Body attatchements", tooltip: "Can be obtained by connecting to a Pokemon Black/White save\nWill copy items over", children: [
					{ id: 1, text: "Crimson Scarf" },
					{ id: 2, text: "Scarlet Cape" },
					{ id: 3, text: "Black Wings" },
					{ id: 4, text: "Black Tie" },
					{ id: 5, text: "Black Cape" },
					{ id: 6, text: "White Wings" },
					{ id: 7, text: "White Cape" },
					{ id: 8, text: "Bowtie" },
					{ id: 9, text: "DressyTie" },
					{ id: 10, text: "Striped Tie" },
					{ id: 11, text: "Necklace" },
					{ id: 12, text: "Frilly Apron" },
					{ id: 13, text: "Round Button" },
					{ id: 14, text: "Tie" },
				]
			},
			{
				id: 6, text: "Collect all Body attatchements", tooltip: "Can be obtained by connecting to a Pokemon Black/White save\nWill copy items over", children: [
					{ id: 1, text: "Fake Belly Button" },
					{ id: 2, text: "Umber Belt" },
					{ id: 3, text: "Frilly Apron" },
					{ id: 4, text: "Hula Skirt" },
					{ id: 5, text: "Winner's Belt" },
				]
			},
		],
		"thms": [
			{
				id: 1, text: "Collect all HMs", children: [
					{ id: 1, text: "HM01 (Cut)", img: () => hm("normal") },
					{ id: 2, text: "HM02 (Fly)", img: () => hm("flying") },
					{ id: 3, text: "HM03 (Surf)", img: () => hm("water") },
					{ id: 4, text: "HM04 (Strength)", img: () => hm("normal") },
					{ id: 5, text: "HM05 (Waterfall)", img: () => hm("water") },
					{ id: 6, text: "HM06 (Dive)", img: () => hm("water") },
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
				],
			},
		],
		"extra-credit": [
			{
				id: 1, text: "Obtain all Event Mythicals", children: [
					{ id: 1, text: "Victini", img: ({ gameKey }) => baseSprite(gameKey, 494) },
					{ id: 2, text: "Keldeo", img: ({ gameKey }) => baseSprite(gameKey, 647) },
					{ id: 3, text: "Meloetta", img: ({ gameKey }) => baseSprite(gameKey, 648) },
					{ id: 4, text: "Genesect", img: ({ gameKey }) => baseSprite(gameKey, 649) },
				],
			},
			{
				id: 2, text: "Trigger Memory Link Flashbacks", tooltip: "Have to progress through Pokemon Black/White", children: [
					{ id: 1, text: "A Triple Team", tooltip: "Receive the Trio Badge in Black/White" },
					{ id: 2, text: "Different Bones & Dreams", tooltip: "Receive the Quake Badge in Black/White" },
					{ id: 3, text: "Hearts' Desire", tooltip: "Receive the Freeze Badge in Black/White" },
					{ id: 4, text: "A New Light", tooltip: "Receive the Legend Badge in Black/White" },
					{ id: 5, text: "Taking It To The Next Level", tooltip: "Receive the Jet Badge in Black/White" },
					{ id: 6, text: "White and Black", tooltip: "Defeat N and Ghetsis in Black/White" },
					{ id: 7, text: "Farewell Beloved Sister", tooltip: "Compete in the Pokemon Musical and enter the EntraLink once" },
					{ id: 8, text: "Meeting Friends", tooltip: "Defeat N and Ghetsis in Black/White" },
				],
			},
			{
				id: 3, text: "Obtain all of N's Pokemon", tooltip: "Must see the flashback to N releasing his Pokemon in Chargestone Cave\nYou have to get N's Zorua before you can start finding the rest of N's Pokemon\nAll other Pokemon are catchable in the wild", children: [
					{ id: 1, text: "Purrloin", img: ({ gameKey }) => baseSprite(gameKey, 509), tooltip: "Route 2" },
					{ id: 2, text: "Woobat", img: ({ gameKey }) => baseSprite(gameKey, 527), tooltip: "Wellspring Cave" },
					{ id: 3, text: "Pidove", img: ({ gameKey }) => baseSprite(gameKey, 519), tooltip: "Pinwheel Forest" },
					{ id: 4, text: "Timburr", img: ({ gameKey }) => baseSprite(gameKey, 532), tooltip: "Pinwheel Forest" },
					{ id: 5, text: "Tympole", img: ({ gameKey }) => baseSprite(gameKey, 535), tooltip: "Pinwheel Forest" },
					{ id: 6, text: "Boldore", img: ({ gameKey }) => baseSprite(gameKey, 525), tooltip: "Chargestone Cave" },
					{ id: 7, text: "Joltik", img: ({ gameKey }) => baseSprite(gameKey, 595), tooltip: "Chargestone Cave" },
					{ id: 8, text: "Ferroseed", img: ({ gameKey }) => baseSprite(gameKey, 597), tooltip: "Chargestone Cave" },
					{ id: 9, text: "Klink", img: ({ gameKey }) => baseSprite(gameKey, 599), tooltip: "Chargestone Cave" },
					{ id: 10, text: "Sandile", img: ({ gameKey }) => baseSprite(gameKey, 551), tooltip: "Desert Resort" },
					{ id: 11, text: "Darumaka", img: ({ gameKey }) => baseSprite(gameKey, 554), tooltip: "Desert Resort" },
					{ id: 12, text: "Darmanitan", img: ({ gameKey }) => baseSprite(gameKey, 555), tooltip: "Desert Resort" },
					{ id: 13, text: "Scraggy", img: ({ gameKey }) => baseSprite(gameKey, 559), tooltip: "Desert Resort" },
					{ id: 14, text: "Sigilyph", img: ({ gameKey }) => baseSprite(gameKey, 561), tooltip: "Desert Resort" },
				],
			},
			{
				id: 4, text: "Complete Special Event Funfest Missions", children: [
					{ id: 1, text: "The Berry-Hunting Adventure!", tooltip: "Hunt for berries around Unova\nShow Meloetta to a person in Castelia City" },
					{ id: 2, text: "Women at Pokemon Centers", tooltip: "Speak to Pokemon Center women in towns and on roads\nJapan Pokemon Centers (Jun 30, 2012 - Sep 6, 2012)" },
					{ id: 3, text: "Rare Pieces!", tooltip: "Look for shining places in caves and on roads\nJapan World Hobby Fair (Jun 30, 2012 - Sep 30, 2012)" },
					{ id: 4, text: "Pokemon-Quiz Championship!", tooltip: "Speak to Scientists in towns and on roads\nJapan World Hobby Fair (Jun 30, 2012 - Sep 30, 2012)" },
					{ id: 5, text: "Find Rare Berries!", tooltip: "Look for shining places in forests and caves\nJapan Dengeki Anniversary (Oct 20, 2012 - Oct 21, 2012)" },
					{ id: 6, text: "Gifts from Pokemon Center Woman", tooltip: "Speak to Pokemon Center woman in towns and on roads" },
					{ id: 7, text: "Find Pokemon", tooltip: "Visit Hidden Grottoes in different areas, and find Pokemon!\nJapan Pokemon Centre (Jul 13, 2013 - Jul 26, 2013)" },
					{ id: 8, text: "Shopping Impossible", tooltip: "Buy very rare items\nJapan Pokemon Centre (Jul 27, 2013 - Aug 16, 2013)" },
					{ id: 9, text: "Endless Battles", tooltip: "Defeat ?? or more Veterans within the time limit!\nJapan World Hobby Fair (Jul 29, 2013 - Sep 16, 2013)" },
					{ id: 10, text: "Find Pokemon", tooltip: "Visit Hidden Grottoes in different areas, and find Pokemon!\nJapan Pokemon Centre (Aug 17, 2013 - Sep 6, 2013)" },
					{ id: 11, text: "Berry Festival!", tooltip: "Look for shining places in forests and caves, and collect Berries!\nJapan Pokemon Centre (Sep 7, 2013 - Sep 27, 2013)" },
					{ id: 12, text: "Pokedex Quiz", tooltip: "Speak to Scientists in towns and on roads" },
				]
			},
			{
				id: 5, text: "Battle NPCs after a Memory Link", tooltip: "Have to progress through Pokemon Black/White", children: [
					{ id: 1, text: "Bianca", tooltip: "Defeat N and Ghetsis in Black/White" },
					{ id: 2, text: "Cheren", tooltip: "Defeat N and Ghetsis in Black/White" },
				],
			},
		],
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
		catching: overrideTasks(TASKS_BY_SECTION.catching, 1, {
			1: { text: "Trade Reshiram" },
			2: { text: "Catch Zekrom" },
			4: { text: "Catch Tornadus" },
			5: { text: "Trade Thundurus" },
			14: { text: "Trade Regice" },
			15: { text: "Catch Registeel" },
			16: { text: "Catch Latios" },
			17: { text: "Trade Latias" },
		}),
		catching: overrideTasks(TASKS_BY_SECTION.catching, 3, {
			4: { text: "Shiny Gible", img: ({ gameKey }) => shinySprite(gameKey, 443), tooltip: "Black City - Defeat Benga" },
		}),
		funfest: overrideTasks(TASKS_BY_SECTION.funfest, 1, {
			12: { text: "Exciting Trading!!" },
			17: { text: "Find Mysterious Ores!" },
			28: { text: "Forgotten Lost Items!" },
			29: { text: "What is the Best Price?" },
			33: { text: "Noisy Hidden Grottoes!" },
		}),
		battle: overrideTasks(TASKS_BY_SECTION.battle, 1, {
			1: { tooltip: "Black City" },
		}),
		collectables: overrideTasks(TASKS_BY_SECTION.collectables, 2, {
			3: { text: "Burn Drive" },
			4: { text: "Shock Drive" },
		}),
		upgrades: overrideTasks(TASKS_BY_SECTION.upgrades, 2, {
			parent: { text: "Obtain the Black Rank Trainer Card" },
		}),
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
		catching: overrideTasks(TASKS_BY_SECTION.catching, 1, {
			1: { text: "Catch Reshiram" },
			2: { text: "Trade Zekrom" },
			4: { text: "Catch Tornadus" },
			5: { text: "Trade Thundurus" },
			14: { text: "Catch Regice" },
			15: { text: "Trade Registeel" },
			16: { text: "Trade Latios" },
			17: { text: "Catch Latias" },
		}),
		catching: overrideTasks(TASKS_BY_SECTION.catching, 3, {
			4: { text: "Shiny Dratini", img: ({ gameKey }) => shinySprite(gameKey, 147), tooltip: "White Forest - Defeat Benga" },
		}),
		catching: overrideTasks(TASKS_BY_SECTION.catching, 4, {
			1: { text: "Petilil for Cottonee", img: ({ gameKey }) => task(gameKey, "petilil-for-cottonee"), tooltip: "Route 4" },
		}),
		funfest: overrideTasks(TASKS_BY_SECTION.funfest, 1, {
			12: { text: "Exhilarating Trading!!" },
			17: { text: "Find Shining Ores!" },
			28: { text: "Not-Found Lost Items!" },
			29: { text: "What is the Real Price?" },
			33: { text: "Quiet Hidden Grottoes!" },
		}),
		battle: overrideTasks(TASKS_BY_SECTION.battle, 1, {
			1: { tooltip: "White Forest" },
		}),
		collectables: overrideTasks(TASKS_BY_SECTION.collectables, 2, {
			3: { text: "Douse Drive" },
			4: { text: "Chill Drive" },
		}),
		upgrades: overrideTasks(TASKS_BY_SECTION.upgrades, 2, {
			parent: { text: "Obtain the White Rank Trainer Card" },
		}),
	};

	defineTasksMany(GAME_KEYS[0], SECTIONS, TASKS_BY_SECTION_GAME1);
	defineTasksMany(GAME_KEYS[1], SECTIONS, TASKS_BY_SECTION_GAME2);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();
