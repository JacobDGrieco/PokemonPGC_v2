import {
	_formItem,
	_hm,
	_keyItem,
	range,
	_tm,
	_location,
	_npc,
	_task,
	_badges,
	_frontSprite,
	defineTasksMany,
	overrideTasks,
	overrideTaskChildTexts,
} from '../helpers/index.js';

(() => {
	const gen = 5;
	const GAME_KEYS = ["black", "white"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const formItem = (name) => _formItem(gen, name);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "activites", title: "Activities" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "accessories", title: "Musical Accessories" },
		{ id: "thms", title: "TMs/HMs" },
		{ id: "extraCredit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		catching: [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch/Trade Reshiram", img: ({ gameKey }) => baseSprite(gameKey, 643) },
					{ id: 2, text: "Catch/Trade Zekrom", img: ({ gameKey }) => baseSprite(gameKey, 644) },
					{ id: 3, text: "Catch Kyurem", img: ({ gameKey }) => baseSprite(gameKey, 646) },
					{ id: 4, text: "Catch/Trade Tornadus", img: ({ gameKey }) => baseSprite(gameKey, 641) },
					{ id: 5, text: "Catch/Trade Thundurus", img: ({ gameKey }) => baseSprite(gameKey, 642) },
					{ id: 6, text: "Catch Landorus", img: ({ gameKey }) => baseSprite(gameKey, 645) },
					{ id: 7, text: "Catch Cobalion", img: ({ gameKey }) => baseSprite(gameKey, 638) },
					{ id: 8, text: "Catch Terrakion", img: ({ gameKey }) => baseSprite(gameKey, 639) },
					{ id: 9, text: "Catch Virizion", img: ({ gameKey }) => baseSprite(gameKey, 640) },
				],
			},
			{
				id: 2, text: "Obtain all In-Game Gift Pokémon", children: [
					{
						id: 1, text: "Pansage/Pansear/Panpour", img: ({ gameKey }) => task(gameKey, "elemental-monkeys"), tooltip: "Dreamyard", eithers: {
							1: { text: "" }, 2: { text: "" }, 3: { text: "" }
						}
					},
					{ id: 2, text: "Zorua", img: ({ gameKey }) => baseSprite(gameKey, 570), tooltip: "Castellia City" },
					{
						id: 3, text: "Tirtouga/Archen", img: ({ gameKey }) => task(gameKey, "fossils"), tooltip: "Relic Castle", eithers: {
							1: { text: "" }, 2: { text: "" }
						},
					},
					{ id: 4, text: "Larvesta", img: ({ gameKey }) => baseSprite(gameKey, 636), tooltip: "Route 18" },
					{ id: 5, text: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), tooltip: "Marvelous Bridge" },
				],
			},
			{
				id: 3, text: "Complete all In-Game Pokémon Trades", children: [
					{ id: 1, text: "Cottonee for Petilil", img: ({ gameKey }) => task(gameKey, "cottonee-for-petilil") },
					{ id: 2, text: "Minccino for Basculin", img: ({ gameKey }) => task(gameKey, "minccino-for-basculin") },
					{ id: 3, text: "Boldore for Emolga", img: ({ gameKey }) => task(gameKey, "boldore-for-emolga") },
					{ id: 4, text: "Ditto for Rotom", img: ({ gameKey }) => task(gameKey, "ditto-for-rotom") },
				],
			},
			{
				id: 4, text: "Obtain all Static Encounter Pokémon", children: [
					{ id: 1, text: "Zen Mode Darmanitan", img: ({ gameKey }) => baseSprite(gameKey, 555), tooltip: "Desert Resort\nTracks all five RageCandyBar statues", type: "tiered", tiers: [range(1, 5)] },
					{ id: 2, text: "Fake-item Foongus", img: ({ gameKey }) => baseSprite(gameKey, 590), tooltip: "Routes 6 and 10\nTracks all five fake-item Foongus", type: "tiered", tiers: [range(1, 5)] },
					{ id: 3, text: "Fake-item Amoonguss", img: ({ gameKey }) => baseSprite(gameKey, 591), tooltip: "Route 10\nTracks both fake-item Amoonguss", type: "tiered", tiers: [range(1, 2)] },
					{ id: 4, text: "Musharna", img: ({ gameKey }) => baseSprite(gameKey, 518), tooltip: "Dreamyard\nEvery Friday after defeating Ghetsis" },
					{ id: 5, text: "Volcarona", img: ({ gameKey }) => baseSprite(gameKey, 637), tooltip: "Relic Castle\nAfter defeating Ghetsis" },
				],
			},
		],
		story: [
			{
				id: 1, text: "Beat the main story", children: [
					{ id: 1, text: "Trio Badge", img: () => _badges("trio"), tooltip: "Defeat Cilan/Chili/Cress at the Striaton City Gym" },
					{ id: 2, text: "Basic Badge", img: () => _badges("basic"), tooltip: "Defeat Lenora at the Nacrene City Gym" },
					{ id: 3, text: "Insect Badge", img: () => _badges("insect"), tooltip: "Defeat Burgh at the Castelia City Gym" },
					{ id: 4, text: "Bolt Badge", img: () => _badges("bolt"), tooltip: "Defeat Elesa at the Nimbasa City Gym" },
					{ id: 5, text: "Quake Badge", img: () => _badges("quake"), tooltip: "Defeat Clay at the Driftveil City Gym" },
					{ id: 6, text: "Jet Badge", img: () => _badges("jet"), tooltip: "Defeat Skyla at the Mistralton City Gym" },
					{ id: 7, text: "Freeze Badge", img: () => _badges("freeze"), tooltip: "Defeat Brycen at the Icirrus City Gym" },
					{ id: 8, text: "Legend Badge", img: () => _badges("legend"), tooltip: "Defeat Drayden/Iris at the Opelucid City Gym" },
					{ id: 9, text: "Defeat the Elite 4 / Champion" },
				],
			},
		],
		activites: [
			{ id: 1, text: "Fill Black City/White Forest with 10 Trainers" },
			{
				id: 2, text: "Find all Team Plasma Sages", children: [
					{ id: 1, text: "Sage Rood", img: ({ gameKey }) => npc(gameKey, "rood") },
					{ id: 2, text: "Sage Gorm", img: ({ gameKey }) => npc(gameKey, "gorm") },
					{ id: 3, text: "Sage Ryoku", img: ({ gameKey }) => npc(gameKey, "ryoku") },
					{ id: 4, text: "Sage Zinzolin", img: ({ gameKey }) => npc(gameKey, "zinzolin") },
					{ id: 5, text: "Sage Bronius", img: ({ gameKey }) => npc(gameKey, "bronius") },
					{ id: 6, text: "Sage Giallo", img: ({ gameKey }) => npc(gameKey, "giallo") },
				],
			},
			{
				id: 3, text: "Complete 4 Types of Entralink Missions", children: [
					{ id: 1, text: "Support Mission" },
					{ id: 2, text: "Item Mission" },
					{ id: 3, text: "Rescue Mission" },
					{ id: 4, text: "Battle Mission" },
				],
			},
		],
		battle: [
			{ id: 1, text: "Get to Master Rank at the Battle Institute", tiers: ["Novice", "Normal", "Super", "Hyper", "Elite", "Master"] },
			{
				id: 2, text: "Defeat Key NPCs", children: [
					{ id: 1, text: "Game Director Morimoto", tooltip: "Castelia City - GAME FREAK\nAvailable once per day after defeating Ghetsis and Team Plasma at the Pokemon League" },
					{ id: 2, text: "Cheren", tooltip: "Victory Road after defeating the Elite 4" },
					{ id: 3, text: "Bianca", tooltip: "Prof. Juniper's Lab (Saturday Nights)" },
					{ id: 4, text: "Cynthia", tooltip: "Undella Town (Spring & Summer)" },
				]
			},
			{
				id: 3, text: "Defeat the Riches Family in Undella Town", children: [
					{ id: 1, text: "Defeat Draco" },
					{ id: 2, text: "Defeat Susan & Family" },
					{ id: 3, text: "Defeat Clairdonna & Family" },
					{ id: 4, text: "Defeat Zillion & Family" },
					{ id: 5, text: "Defeat Trish & Family" },
					{ id: 6, text: "Defeat Miles & Family" },
				],
			},
			{
				id: 4, text: "Complete all Battle Subway Lines", children: [
					{ id: 1, text: "Single" },
					{ id: 2, text: "Single Super" },
					{ id: 3, text: "Double" },
					{ id: 4, text: "Double Super" },
					{ id: 5, text: "Multi" },
					{ id: 6, text: "Multi Super" },
				],
			},
		],
		upgrades: [
			{ id: 1, text: "Obtain the National Dex" },
			{
				id: 2, text: "Obtain the Black/White Rank Trainer Card", children: [
					{ id: 1, text: "Defeat the Elite Four" },
					{ id: 2, text: "Complete the National PokeDex (645)" },
					{ id: 3, text: "Collect all Pokémon Musical Items" },
					{ id: 4, text: "Obtain all Entralink Powers" },
					{ id: 5, text: "Get a 49-win streak in the Battle Subway Lines", tooltip: "Must get the streak in both the Super Singles and Super Doubles lines" },
				],
			},
		],
		collectables: [
			{ id: 1, text: "Obtain the Diploma", tooltip: "Game Freak - Castelia City\nReward for completing the Unova Pokedex" },
			{
				id: 2, text: "Collect all Key Items", children: [
					{ id: 1, text: "Bicycle", img: () => keyItem("bicycle") },
					{ id: 2, text: "Dowsing MCHN", img: () => keyItem("item-finder") },
					{ id: 4, text: "Pal Pad", img: () => keyItem("pal-pad") },
					{ id: 5, text: "Prop Case", img: () => keyItem("prop-case") },
					{ id: 6, text: "Super Rod", img: () => keyItem("super-rod") },
					{ id: 7, text: "Town Map", img: () => keyItem("town-map") },
					{ id: 8, text: "Vs. Recorder", img: () => keyItem("vs-recorder") },
					{ id: 9, text: "Xtransceiver", img: () => keyItem("xtransceiver") },
				],
			},
			{
				id: 3, text: "Collect all Legendary items", children: [
					{ id: 1, text: "Burn Drive", img: () => formItem("burn-drive") },
					{ id: 2, text: "Douse Drive", img: () => formItem("douse-drive") },
					{ id: 3, text: "Shock Drive", img: () => formItem("shock-drive") },
					{ id: 4, text: "Chill Drive", img: () => formItem("chill-drive") },
					{ id: 5, text: "Gracidea", img: () => formItem("graceidea") },
				],
			},
			{
				id: 4, text: "Collect all 16 Arceus Plates", children: [
					{ id: 1, text: "Draco Plate", img: () => formItem("draco-plate") },
					{ id: 2, text: "Dread Plate", img: () => formItem("dread-plate") },
					{ id: 3, text: "Earth Plate", img: () => formItem("earth-plate") },
					{ id: 4, text: "Fist Plate", img: () => formItem("fist-plate") },
					{ id: 5, text: "Flame Plate", img: () => formItem("flame-plate") },
					{ id: 6, text: "Icicle Plate", img: () => formItem("icicle-plate") },
					{ id: 7, text: "Insect Plate", img: () => formItem("insect-plate") },
					{ id: 8, text: "Iron Plate", img: () => formItem("iron-plate") },
					{ id: 9, text: "Meadow Plate", img: () => formItem("meadow-plate") },
					{ id: 10, text: "Mind Plate", img: () => formItem("mind-plate") },
					{ id: 11, text: "Sky Plate", img: () => formItem("sky-plate") },
					{ id: 12, text: "Splash Plate", img: () => formItem("splash-plate") },
					{ id: 13, text: "Spooky Plate", img: () => formItem("spooky-plate") },
					{ id: 14, text: "Stone Plate", img: () => formItem("stone-plate") },
					{ id: 15, text: "Toxic Plate", img: () => formItem("toxic-plate") },
					{ id: 16, text: "Zap Plate", img: () => formItem("zap-plate") },
				],
			},
		],
		accessories: [
			{
				id: 1, text: "Collect all Head attatchements", children: [
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
				id: 2, text: "Collect all Face attatchements", children: [
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
				id: 3, text: "Collect all Ear attatchements", children: [
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
				id: 4, text: "Collect all Arm attatchements", children: [
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
				id: 5, text: "Collect all Body attatchements", children: [
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
				id: 6, text: "Collect all Waist attatchements", children: [
					{ id: 1, text: "Fake Belly Button" },
					{ id: 2, text: "Umber Belt" },
					{ id: 3, text: "Frilly Apron" },
					{ id: 4, text: "Hula Skirt" },
					{ id: 5, text: "Winner's Belt" },
				]
			},
		],
		thms: [
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
		extraCredit: [
			{
				id: 1, text: "Obtain all Event Mythical Pokémon", children: [
					{ id: 1, text: "Victini", img: ({ gameKey }) => baseSprite(gameKey, 494) },
					{ id: 2, text: "Keldeo", img: ({ gameKey }) => baseSprite(gameKey, 647) },
					{ id: 3, text: "Meloetta", img: ({ gameKey }) => baseSprite(gameKey, 648) },
					{ id: 4, text: "Genesect", img: ({ gameKey }) => baseSprite(gameKey, 649) },
				],
			},
		],
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
		catching: overrideTaskChildTexts(TASKS_BY_SECTION.catching, {
			1: {
				1: "Trade Reshiram",
				2: "Catch Zekrom",
				4: "Catch Tornadus",
				5: "Trade Thundurus",
			}
		}),
		upgrades: overrideTasks(TASKS_BY_SECTION.upgrades, {
			2: {
				parent: { text: "Obtain the Black Rank Trainer Card" },
			}
		}),
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
		catching: overrideTaskChildTexts(TASKS_BY_SECTION.catching, {
			1: {
				1: "Catch Reshiram",
				2: "Trade Zekrom",
				4: "Trade Tornadus",
				5: "Catch Thundurus",
			}
		}),
		upgrades: overrideTasks(TASKS_BY_SECTION.upgrades, {
			2: {
				parent: { text: "Obtain the White Rank Trainer Card" },
			}
		}),
	};

	defineTasksMany(GAME_KEYS[0], SECTIONS, TASKS_BY_SECTION_GAME1);
	defineTasksMany(GAME_KEYS[1], SECTIONS, TASKS_BY_SECTION_GAME2);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();
