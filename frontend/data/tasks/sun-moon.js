import {
	_formItem,
	_heldItem,
	_hm,
	_keyItem,
	_megaStone,
	_tm,
	_zCrystal,
	_task,
	_typing,
	_frontSprite,
	range,
	defineTasksMany,
	overrideTasks,
} from '../helpers/index.js';

(() => {
	const gen = 7;
	const GAME_KEYS = ["sun", "moon"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const formItem = (name) => _formItem(gen, name);
	const heldItem = (name) => _heldItem(gen, name);
	const keyItem = (name) => _keyItem(gen, name);
	const megaStone = (name) => _megaStone(gen, name);
	const zCrystal = (name) => _zCrystal(name);
	const typing = (type) => _typing(type);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "sideQuests", title: "Side Quests" },
		{ id: "activities", title: "Activities" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "megaStones", title: "Mega Stones" },
		{ id: "zcrystals", title: "Z-Crystals" },
		{ id: "fashion", title: "Fashion" },
		{ id: "thms", title: "TMs/Ride Pager" },
		{ id: "distributions", title: "Distributions" },
		{ id: "extraCredit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		catching: [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch/Trade Solgaleo", img: ({ gameKey }) => baseSprite(gameKey, 791) },
					{ id: 2, text: "Catch/Trade Lunala", img: ({ gameKey }) => baseSprite(gameKey, 792) },
					{ id: 3, text: "Catch Necrozma", img: ({ gameKey }) => baseSprite(gameKey, 800), tooltip: "Ten Carat Hill\nAfter completing the Ultra Beast missions" },
					{ id: 4, text: "Catch Tapu Koko", img: ({ gameKey }) => baseSprite(gameKey, 785) },
					{ id: 5, text: "Catch Tapu Lele", img: ({ gameKey }) => baseSprite(gameKey, 786) },
					{ id: 6, text: "Catch Tapu Bulu", img: ({ gameKey }) => baseSprite(gameKey, 787) },
					{ id: 7, text: "Catch Tapu Fini", img: ({ gameKey }) => baseSprite(gameKey, 788) },
					{ id: 8, text: "Obtain Cosmog", img: ({ gameKey }) => baseSprite(gameKey, 789), tooltip: "Lake of the Sunne / Lake of the Moone\nAfter using the altar wormhole" },
					{ id: 9, text: "Obtain Type: Null", img: ({ gameKey }) => baseSprite(gameKey, 772), tooltip: "Gift from Gladion in Aether Paradise after becoming Champion" },
					{ id: 10, text: "Assemble Zygarde 100%", img: ({ gameKey }) => baseSprite(gameKey, 718), tooltip: "Route 16 - Zygarde Assembly\nCollect Cells and Cores with the Zygarde Cube" },
				],
			},
			{
				id: 2, text: "Catch all the Ultra Beasts", children: [
					{ id: 1, text: "Catch UB-01 Nihilego", img: ({ gameKey }) => baseSprite(gameKey, 793) },
					{ id: 2, text: "Catch/Trade UB-02 Buzzwole", img: ({ gameKey }) => baseSprite(gameKey, 794) },
					{ id: 3, text: "Catch/Trade UB-02 Pheromosa", img: ({ gameKey }) => baseSprite(gameKey, 795) },
					{ id: 4, text: "Catch UB-03 Xurkitree", img: ({ gameKey }) => baseSprite(gameKey, 796) },
					{ id: 5, text: "Catch/Trade UB-04 Kartana", img: ({ gameKey }) => baseSprite(gameKey, 798) },
					{ id: 6, text: "Catch/Trade UB-04 Celesteela", img: ({ gameKey }) => baseSprite(gameKey, 797) },
					{ id: 7, text: "Catch UB-05 Guzzlord", img: ({ gameKey }) => baseSprite(gameKey, 799) },
				],
			},
			{
				id: 3, text: "Obtain all In-Game Gift Pokémon", children: [
					{ id: 1, text: "Eevee Egg", img: ({ gameKey }) => baseSprite(gameKey, 133), tooltip: "Paniola Ranch - Pokémon Nursery" },
					{ id: 2, text: "Porygon", img: ({ gameKey }) => baseSprite(gameKey, 137), tooltip: "Aether House\nAfter defeating the Elite Four" },
					{ id: 3, text: "Aerodactyl", img: ({ gameKey }) => baseSprite(gameKey, 142), tooltip: "Seafolk Village" },
					{ id: 4, text: "Type: Null", img: ({ gameKey }) => baseSprite(gameKey, 772), tooltip: "Aether Paradise\nAfter defeating the Elite Four" },
				],
			},
			{
				id: 4, text: "Complete all In-Game Pokémon Trades", children: [
					{ id: 1, text: "Spearow for Machop", img: ({ gameKey }) => task(gameKey, "spearow-for-machop"), tooltip: "Route 2 Pokémon Center" },
					{ id: 2, text: "Lillipup for Bounsweet", img: ({ gameKey }) => task(gameKey, "lillipup-for-bounsweet"), tooltip: "Route 5 Pokémon Center" },
					{ id: 3, text: "Zubat for Poliwhirl", img: ({ gameKey }) => task(gameKey, "zubat-for-poliwhirl"), tooltip: "Konikoni City Pokémon Center" },
					{ id: 4, text: "Pancham for Happiny", img: ({ gameKey }) => task(gameKey, "pancham-for-happiny"), tooltip: "Malie City - Sushi High Roller" },
					{ id: 5, text: "Haunter for Alolan Graveler", img: ({ gameKey }) => task(gameKey, "haunter-for-alolan-graveler"), tooltip: "Tapu Village Pokémon Center\nGraveler evolves immediately into Golem" },
					{ id: 6, text: "Granbull for Steenee", img: ({ gameKey }) => task(gameKey, "granbull-for-steenee"), tooltip: "Seafolk Village" },
					{ id: 7, text: "Bewear for Talonflame", img: ({ gameKey }) => task(gameKey, "bewear-for-talonflame"), tooltip: "Poni Gauntlet" },
				],
			},
		],
		story: [
			{
				id: 1, text: "Complete the Island Challenge", children: [
					{ id: 1, text: "Ilima's Trial", tooltip: "Verdant Cavern" },
					{ id: 2, text: "Hala's Grand Trial" },
					{ id: 3, text: "Lana's Trial", tooltip: "Brooklet Hill" },
					{ id: 4, text: "Kiawe's Trial", tooltip: "Wela Volcano Park" },
					{ id: 5, text: "Mallow's Trial", tooltip: "Lush Jungle" },
					{ id: 6, text: "Olivia's Grand Trial" },
					{ id: 7, text: "Sophocles's Trial", tooltip: "Hokulani Observatory" },
					{ id: 8, text: "Acerola's Trial", tooltip: "Thrifty Megamart Abandoned Site" },
					{ id: 9, text: "Nanu's Grand Trial" },
					{ id: 10, text: "Poni Trial", tooltip: "Vast Poni Canyon" },
					{ id: 11, text: "Hapu's Grand Trial" },
					{ id: 12, text: "Elite Four/Champion" },
				],
			},
			{
				id: 2, text: "Complete the Epilogue: Ultra Beast Investigation", children: [
					{ id: 1, text: "Meet Looker and Anabel", tooltip: "Motel on Route 8" },
					{ id: 2, text: "Catch UB-01", tooltip: "Mission 1" },
					{ id: 3, text: "Catch UB-02", tooltip: "Mission 2" },
					{ id: 4, text: "Catch UB-03", tooltip: "Mission 3" },
					{ id: 5, text: "Catch UB-04", tooltip: "Mission 4" },
					{ id: 6, text: "Catch UB-05", tooltip: "Mission 5" },
					{ id: 7, text: "Battle Anabel", tooltip: "Motel on Route 8" },
					{ id: 8, text: "Catch Necrozma", tooltip: "Ten Carat Hill" },
				],
			},
		],
		activities: [
			{ id: 1, text: "Visit the alternate world" },
			{
				id: 2, text: "Complete all NPC Pokedex request tasks", children: [
					{ id: 1, text: "Show Drifloon to the woman at the Hau'oli Pokémon Center", img: ({ gameKey }) => baseSprite(gameKey, 425), tooltip: "Reward: 10,000 Poke Dollars" },
					{ id: 2, text: "Show Cutiefly to the woman at the Route 2 Pokémon Center", img: ({ gameKey }) => baseSprite(gameKey, 742), tooltip: "Reward: 3,000 Poke Dollars" },
					{ id: 3, text: "Show Rockruff to the man in yellow on Route 3", img: ({ gameKey }) => baseSprite(gameKey, 744), tooltip: "Reward: 3,000 Poke Dollars" },
					{ id: 4, text: "Talk to the scientist at the Hau'oli City Tourist Bureau", tooltip: "Reward: Ultra Ball\nRequires at least 10 Pokedex entries" },
					{ id: 5, text: "Show Pyukumuku to the man at the Heahea City Apparel Shop", img: ({ gameKey }) => baseSprite(gameKey, 771), tooltip: "Reward: 10,000 Poke Dollars" },
					{ id: 6, text: "Show Passimian/Oranguru to the Aether employee at the Konikoni City Pokémon Center", img: ({ gameKey }) => baseSprite(gameKey, 766), tooltip: "Reward: 5,000 Poke Dollars" },
					{ id: 7, text: "Show Feebas to the man at the Route 5 Pokémon Center", img: ({ gameKey }) => baseSprite(gameKey, 349), tooltip: "Reward: 3,000 Poke Dollars" },
					{ id: 8, text: "Show Stufful to the Aether employee at the Route 8 Aether Trailer", img: ({ gameKey }) => baseSprite(gameKey, 759), tooltip: "Reward: 5,000 Poke Dollars" },
					{ id: 9, text: "Show Togedemaru to the collector at the Malie City Apparel Shop", img: ({ gameKey }) => baseSprite(gameKey, 777), tooltip: "Reward: 10,000 Poke Dollars" },
					{ id: 10, text: "Show an Alolan Persian to Professor Oak at the Malie City Library", img: ({ gameKey }) => baseSprite(gameKey, 53), tooltip: "Reward: Love Ball" },
					{ id: 11, text: "Show Mimikyu to the Aether employee at the Route 16 Pokémon Center", img: ({ gameKey }) => baseSprite(gameKey, 778), tooltip: "Reward: 20,000 Poke Dollars" },
					{ id: 12, text: "Show an Alolan Raichu to the woman in the Steelix boat at Seafolk Village", img: ({ gameKey }) => baseSprite(gameKey, 26), tooltip: "Reward: 10,000 Poke Dollars" },
				],
			},
			{
				id: 4, text: "Take photos at all Poké Finder locations", children: [
					{ id: 1, text: "Hau'oli Cemetery" },
					{ id: 2, text: "Hau'oli City - Beachfront" },
					{ id: 3, text: "Hau'oli City - Shopping District" },
					{ id: 4, text: "Kala'e Bay" },
					{ id: 5, text: "Melemele Meadow" },
					{ id: 6, text: "Brooklet Hill" },
					{ id: 7, text: "Lush Jungle" },
					{ id: 8, text: "Paniola Ranch" },
					{ id: 9, text: "Route 8" },
					{ id: 10, text: "Royal Avenue" },
					{ id: 11, text: "Wela Volcano Park" },
					{ id: 12, text: "Blush Mountain" },
					{ id: 13, text: "Mount Hokulani" },
					{ id: 14, text: "Mount Lanakila" },
					{ id: 15, text: "Route 13" },
					{ id: 16, text: "Thrifty Megamart Abandoned Site" },
					{ id: 17, text: "Ula'ula Meadow" },
					{ id: 18, text: "Poni Coast" },
					{ id: 19, text: "Poni Meadow" },
					{ id: 20, text: "Vast Poni Canyon" },
				],
			},
		],
		battle: [
			{ id: 1, text: "Defeat Morimoto", tooltip: "Heahea City - GAME FREAK\nRewards the Oval Charm on first win" },
			{ id: 2, text: "Reach Master Rank in Battle Royal", tiers: ["Normal", "Super", "Hyper", "Master"] },
			{
				id: 3, text: "Complete the Eevee Quest", children: [
					{ id: 1, text: "Defeat Vaporeon User Polly", img: ({ gameKey }) => baseSprite(gameKey, 134), tooltip: "Trainer School" },
					{ id: 2, text: "Defeat Jolteon User Jane", img: ({ gameKey }) => baseSprite(gameKey, 135), tooltip: "Malie City Community Center" },
					{ id: 3, text: "Defeat Flareon User Chad", img: ({ gameKey }) => baseSprite(gameKey, 136), tooltip: "Heahea City - Tidal Song Hotel" },
					{ id: 4, text: "Defeat Espeon User Ishaan", img: ({ gameKey }) => baseSprite(gameKey, 196), tooltip: "Blush Mountain" },
					{ id: 5, text: "Defeat Umbreon User Braiden", img: ({ gameKey }) => baseSprite(gameKey, 197), tooltip: "Hau'oli Cemetery" },
					{ id: 6, text: "Defeat Leafeon User Linnea", img: ({ gameKey }) => baseSprite(gameKey, 470), tooltip: "Hano Beach" },
					{ id: 7, text: "Defeat Glaceon User Rea", img: ({ gameKey }) => baseSprite(gameKey, 471), tooltip: "Iki Town" },
					{ id: 8, text: "Defeat Sylveon User Kira", img: ({ gameKey }) => baseSprite(gameKey, 700), tooltip: "Seafolk Village" },
					{ id: 9, text: "Defeat Eevee User Kagetora", img: ({ gameKey }) => baseSprite(gameKey, 133), tooltip: "Royal Avenue\nRewards Eevium Z" },
				],
			},
			{
				id: 5, text: "Defeat the Battle Tree legends", children: [
					{ id: 1, text: "Red", tooltip: "Battle Tree - Singles" },
					{ id: 2, text: "Blue", tooltip: "Battle Tree - Doubles" },
				],
			},
		],
		upgrades: [
			{ id: 1, text: "Obtain the Judge function", tooltip: "Battle Tree\nRequires entering the Hall of Fame and hatching 21 Eggs" },
			{ id: 2, text: "Upgrade the Poke Finder", tiers: ["Ver. 1", "Ver. 2", "Ver. 3", "Ver. 4", "Ver. 5"] },
			{ id: 3, text: "Upgrade Festival Plaza to Rank 100", tiers: [range(1, 100)] },
			{
				id: 4, text: "Upgrade all Poke Pelago islands", children: [
					{ id: 1, text: "Isle Abeens", tiers: ["Rank 1", "Rank 2", "Rank 3"] },
					{ id: 2, text: "Isle Aplenny", tiers: ["Rank 1", "Rank 2", "Rank 3"] },
					{ id: 3, text: "Isle Aphun", tiers: ["Rank 1", "Rank 2", "Rank 3"] },
					{ id: 4, text: "Isle Evelup", tiers: ["Rank 1", "Rank 2", "Rank 3"] },
					{ id: 5, text: "Isle Avue", tiers: ["Rank 1", "Rank 2", "Rank 3"] },
				],
			},
			{
				id: 5, text: "Earn every Trainer Passport stamp", children: [
					{ id: 1, text: "Official Pokémon Trainer" },
					{ id: 2, text: "Melemele Trial Completion" },
					{ id: 3, text: "Akala Trial Completion" },
					{ id: 4, text: "Ula'ula Trial Completion" },
					{ id: 5, text: "Poni Trial Completion" },
					{ id: 6, text: "Island Challenge Completion" },
					{ id: 7, text: "Melemele Pokedex Completion" },
					{ id: 8, text: "Akala Pokedex Completion" },
					{ id: 9, text: "Ula'ula Pokedex Completion" },
					{ id: 10, text: "Poni Pokedex Completion" },
					{ id: 11, text: "Alola Pokedex Completion" },
					{ id: 12, text: "50 Consecutive Single Battle Wins" },
					{ id: 13, text: "50 Consecutive Double Battle Wins" },
					{ id: 14, text: "Poke Finder Pro" },
					{ id: 15, text: "50 Consecutive Multi Battle Wins" },
				],
			},
			{
				id: 6, text: "Unlock all Battle Styles", children: [
					{ id: 1, text: "Normal Style", tooltip: "Initial" },
					{ id: 2, text: "Elegant Style", tooltip: "Available in Malie City Outer Cape" },
					{ id: 3, text: "Girlish Style", tooltip: "Defeat Lana in Konikoni City" },
					{ id: 4, text: "Reverent Style", tooltip: "Defeat Kiawe / Mallow" },
					{ id: 5, text: "Smug Style", tooltip: "Defeat Gladion before the Elite Four" },
					{ id: 6, text: "Left-Handed Style", tooltip: "Defeat Ilima in Hau'oli City" },
					{ id: 7, text: "Passionate Style", tooltip: "Get a Battle Tree streak of 50 or higher" },
					{ id: 8, text: "Idol Style", tooltip: "Reach Master Rank in Battle Royal" },
				],
			},
		],
		collectables: [
			{ id: 1, text: "Collect all 95 Zygarde Cells", tiers: [range(1, 95)] },
			{
				id: 2, text: "Collect all 5 Zygarde Cores", children: [
					{ id: 1, text: "Extreme Speed Core", img: ({ gameKey }) => baseSprite(gameKey, 718), tooltip: "Route 1" },
					{ id: 2, text: "Thousand Arrows Core", img: ({ gameKey }) => baseSprite(gameKey, 718), tooltip: "Iki Town" },
					{ id: 3, text: "Dragon Dance Core", img: ({ gameKey }) => baseSprite(gameKey, 718), tooltip: "Konikoni City" },
					{ id: 4, text: "Thousand Waves Core", img: ({ gameKey }) => baseSprite(gameKey, 718), tooltip: "Route 17" },
					{ id: 5, text: "Core Enforcer Core", img: ({ gameKey }) => baseSprite(gameKey, 718), tooltip: "Ancient Poni Path" },
				],
			},
			{
				id: 3, text: "Collect all Key Items", children: [
					{ id: 1, text: "Adventure Rules", img: () => keyItem("adventure-rules") },
					{ id: 2, text: "Exp. Share", img: () => heldItem("exp-share") },
					{ id: 3, text: "Fishing Rod", img: () => keyItem("fishing-rod") },
					{ id: 4, text: "Key Stone", img: () => keyItem("key-stone") },
					{ id: 5, text: "Lens Case / Make-up Bag", img: () => [keyItem("lens-case"), keyItem("make-up-bag")], tooltip: "Differs by gender" },
					{ id: 6, text: "Oval Charm", img: () => keyItem("oval-charm") },
					{ id: 7, text: "Professor's Mask", img: () => keyItem("professors-mask") },
					{ id: 8, text: "Ride Pager", img: () => keyItem("ride-pager") },
					{ id: 9, text: "Shiny Charm", img: () => keyItem("shiny-charm") },
					{ id: 10, text: "Sparkling Stone", img: () => keyItem("sparkling-stone") },
					{ id: 11, text: "Sun Flute / Moon Flute" },
					{ id: 12, text: "Z-Ring", img: () => keyItem("z-ring") },
				]
			},
			{
				id: 4, text: "Collect all Legendary Items", children: [
					{ id: 1, text: "Soul Dew", img: () => keyItem("soul-dew") },
					{ id: 2, text: "Adamant Orb", img: () => keyItem("adamant-orb") },
					{ id: 3, text: "Lustrous Orb", img: () => keyItem("lustrous-orb") },
					{ id: 4, text: "Griseous Orb", img: () => formItem("griseous-orb") },
					{ id: 5, text: "Red Orb", img: () => keyItem("red-orb") },
					{ id: 6, text: "Blue Orb", img: () => keyItem("blue-orb") },
					{ id: 7, text: "Gracidea", img: () => formItem("gracidea") },
					{ id: 8, text: "Reveal Glass", img: () => formItem("reveal-glass") },
					{ id: 9, text: "DNA Splicers", img: () => formItem("dna-splicers") },
					{ id: 10, text: "Burn Drive", img: () => formItem("burn-drive") },
					{ id: 11, text: "Shock Drive", img: () => formItem("shock-drive") },
					{ id: 12, text: "Douse Drive", img: () => formItem("douse-drive") },
					{ id: 13, text: "Chill Drive", img: () => formItem("chill-drive") },
					{ id: 14, text: "Zygarde Cube", img: () => keyItem("zygarde-cube") },
					{ id: 15, text: "Prison Bottle", img: () => keyItem("prison-bottle") },
				]
			},
			{
				id: 5, text: "Collect all 17 Arceus Plates", children: [
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
					{ id: 11, text: "Pixie Plate", img: () => formItem("pixie-plate") },
					{ id: 12, text: "Sky Plate", img: () => formItem("sky-plate") },
					{ id: 13, text: "Splash Plate", img: () => formItem("splash-plate") },
					{ id: 14, text: "Spooky Plate", img: () => formItem("spooky-plate") },
					{ id: 15, text: "Stone Plate", img: () => formItem("stone-plate") },
					{ id: 16, text: "Toxic Plate", img: () => formItem("toxic-plate") },
					{ id: 17, text: "Zap Plate", img: () => formItem("zap-plate") },
				]
			},
			{
				id: 6, text: "Collect all 17 Memories", children: [
					{ id: 1, text: "Bug Memory", img: () => heldItem("bug-memory") },
					{ id: 2, text: "Dark Memory", img: () => heldItem("dark-memory") },
					{ id: 3, text: "Dragon Memory", img: () => heldItem("dragon-memory") },
					{ id: 4, text: "Electric Memory", img: () => heldItem("electric-memory") },
					{ id: 5, text: "Fairy Memory", img: () => heldItem("fairy-memory") },
					{ id: 6, text: "Fighting Memory", img: () => heldItem("fighting-memory") },
					{ id: 7, text: "Fire Memory", img: () => heldItem("fire-memory") },
					{ id: 8, text: "Flying Memory", img: () => heldItem("flying-memory") },
					{ id: 9, text: "Ghost Memory", img: () => heldItem("ghost-memory") },
					{ id: 10, text: "Grass Memory", img: () => heldItem("grass-memory") },
					{ id: 11, text: "Ground Memory", img: () => heldItem("ground-memory") },
					{ id: 12, text: "Ice Memory", img: () => heldItem("ice-memory") },
					{ id: 13, text: "Poison Memory", img: () => heldItem("poison-memory") },
					{ id: 14, text: "Psychic Memory", img: () => heldItem("psychic-memory") },
					{ id: 15, text: "Rock Memory", img: () => heldItem("rock-memory") },
					{ id: 16, text: "Steel Memory", img: () => heldItem("steel-memory") },
					{ id: 17, text: "Water Memory", img: () => heldItem("water-memory") },
				],
			},
		],
		megaStones: [
			{ id: 1, text: "Venusaurite", img: ({ gameKey }) => [baseSprite(gameKey, "003-m"), megaStone("venusaurite")] },
			{ id: 2, text: "Charizardite X", img: ({ gameKey }) => [baseSprite(gameKey, "006-mx"), megaStone("charizardite-x")] },
			{ id: 3, text: "Charizardite Y", img: ({ gameKey }) => [baseSprite(gameKey, "006-my"), megaStone("charizardite-y")] },
			{ id: 4, text: "Blastoisinite", img: ({ gameKey }) => [baseSprite(gameKey, "009-m"), megaStone("blastoisinite")] },
			{ id: 5, text: "Alakazite", img: ({ gameKey }) => [baseSprite(gameKey, "065-m"), megaStone("alakazite")] },
			{ id: 6, text: "Slowbronite", img: ({ gameKey }) => [baseSprite(gameKey, "080-m"), megaStone("slowbronite")] },
			{ id: 7, text: "Gengarite", img: ({ gameKey }) => [baseSprite(gameKey, "094-m"), megaStone("gengarite")] },
			{ id: 8, text: "Kangaskhanite", img: ({ gameKey }) => [baseSprite(gameKey, "115-m"), megaStone("kangaskhanite")] },
			{ id: 9, text: "Pinsirite", img: ({ gameKey }) => [baseSprite(gameKey, "127-m"), megaStone("pinsirite")] },
			{ id: 10, text: "Gyaradosite", img: ({ gameKey }) => [baseSprite(gameKey, "130-m"), megaStone("gyaradosite")] },
			{ id: 11, text: "Aerodactylite", img: ({ gameKey }) => [baseSprite(gameKey, "142-m"), megaStone("aerodactylite")] },
			{ id: 12, text: "Scizorite", img: ({ gameKey }) => [baseSprite(gameKey, "212-m"), megaStone("scizorite")] },
			{ id: 13, text: "Sablenite", img: ({ gameKey }) => [baseSprite(gameKey, "302-m"), megaStone("sablenite")] },
			{ id: 14, text: "Sharpedonite", img: ({ gameKey }) => [baseSprite(gameKey, "319-m"), megaStone("sharpedonite")] },
			{ id: 15, text: "Absolite", img: ({ gameKey }) => [baseSprite(gameKey, "359-m"), megaStone("absolite")] },
			{ id: 16, text: "Glalitite", img: ({ gameKey }) => [baseSprite(gameKey, "362-m"), megaStone("glalitite")] },
			{ id: 17, text: "Salamenceite", img: ({ gameKey }) => [baseSprite(gameKey, "373-m"), megaStone("salamencite")] },
			{ id: 18, text: "Metagrossite", img: ({ gameKey }) => [baseSprite(gameKey, "376-m"), megaStone("metagrossite")] },
			{ id: 19, text: "Garchompite", img: ({ gameKey }) => [baseSprite(gameKey, "445-m"), megaStone("garchompite")] },
			{ id: 20, text: "Lucarionite", img: ({ gameKey }) => [baseSprite(gameKey, "448-m"), megaStone("lucarionite")] },
		],
		zcrystals: [
			{
				id: 1, text: "Collect all Typing Z-Crystals", children: [
					{ id: 1, text: "Buginium Z", img: () => [typing("bug"), zCrystal("buginiumz")] },
					{ id: 2, text: "Darkinium Z", img: () => [typing("dark"), zCrystal("darkiniumz")] },
					{ id: 3, text: "Dragonium Z", img: () => [typing("dragon"), zCrystal("dragoniumz")] },
					{ id: 4, text: "Electrium Z", img: () => [typing("electric"), zCrystal("electriumz")] },
					{ id: 5, text: "Fairium Z", img: () => [typing("fairy"), zCrystal("fairiumz")] },
					{ id: 6, text: "Fightinium Z", img: () => [typing("fighting"), zCrystal("fightiniumz")] },
					{ id: 7, text: "Firium Z", img: () => [typing("fire"), zCrystal("firiumz")] },
					{ id: 8, text: "Flyinium Z", img: () => [typing("flying"), zCrystal("flyiniumz")] },
					{ id: 9, text: "Ghostium Z", img: () => [typing("ghost"), zCrystal("ghostiumz")] },
					{ id: 10, text: "Grassium Z", img: () => [typing("grass"), zCrystal("grassiumz")] },
					{ id: 11, text: "Groundium Z", img: () => [typing("ground"), zCrystal("groundiumz")] },
					{ id: 12, text: "Icium Z", img: () => [typing("ice"), zCrystal("iciumz")] },
					{ id: 13, text: "Normalium Z", img: () => [typing("normal"), zCrystal("normaliumz")] },
					{ id: 14, text: "Poisonium Z", img: () => [typing("poison"), zCrystal("poisoniumz")] },
					{ id: 15, text: "Psychium Z", img: () => [typing("psychic"), zCrystal("psychiumz")] },
					{ id: 16, text: "Rockium Z", img: () => [typing("rock"), zCrystal("rockiumz")] },
					{ id: 17, text: "Steelium Z", img: () => [typing("steel"), zCrystal("steeliumz")] },
					{ id: 18, text: "Waterium Z", img: () => [typing("water"), zCrystal("wateriumz")] },
				]
			},
			{
				id: 2, text: "Collect all Specific Z-Crystals", children: [
					{ id: 1, text: "Aloraichium Z", img: ({ gameKey }) => [baseSprite(gameKey, 26), zCrystal("aloraichiumz")] },
					{ id: 2, text: "Decidium Z", img: ({ gameKey }) => [baseSprite(gameKey, 724), zCrystal("decidiumz")] },
					{ id: 3, text: "Eevium Z", img: ({ gameKey }) => [baseSprite(gameKey, 133), zCrystal("eeviumz")] },
					{ id: 4, text: "Incinium Z", img: ({ gameKey }) => [baseSprite(gameKey, 727), zCrystal("inciniumz")] },
					{ id: 5, text: "Pikanium Z", img: ({ gameKey }) => [baseSprite(gameKey, 25), zCrystal("pikaniumz")] },
					{ id: 6, text: "Primarium Z", img: ({ gameKey }) => [baseSprite(gameKey, 730), zCrystal("primariumz")] },
					{ id: 7, text: "Tapunium Z", img: ({ gameKey }) => [baseSprite(gameKey, 785), zCrystal("tapuniumz")] },
				]
			},
		],
		thms: [
			{
				id: 1, text: "Unlock every Ride Pager summon", children: [
					{ id: 1, text: "Tauros Charge", img: () => hm("tauros-charge"), tooltip: "Defeat Hala in Iki Town" },
					{ id: 2, text: "Stoutland Search", img: () => hm("stoutland-search"), tooltip: "Speak to Mallow in Paniola Ranch" },
					{ id: 3, text: "Lapras Paddle", img: () => hm("lapras-dive"), tooltip: "Speak to Lana in Brooklet Hill" },
					{ id: 4, text: "Charizard Glide", img: () => hm("charizard-glide"), tooltip: "Complete Kiawe's trial" },
					{ id: 5, text: "Mudsdale Gallop", img: () => hm("mudsdale-gallop"), tooltip: "Speak to Hapu on Route 12" },
					{ id: 6, text: "Sharpedo Jet", img: () => hm("sharpedo-jet"), tooltip: "Speak to Grimsley on Route 15" },
					{ id: 7, text: "Machamp Shove", img: () => hm("machamp-shove"), tooltip: "Speak to Hapu's grandmother on Ancient Poni Path" },
				],
			},
			{
				id: 2, text: "Collect all TMs", children: [
					{ id: 1, text: "TM01 (Work Up)", img: () => tm("normal") },
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
					{ id: 28, text: "TM28 (Leech Life)", img: () => tm("bug") },
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
					{ id: 39, text: "TM39 (Rock Tomb)", img: () => tm("rock") },
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
					{ id: 59, text: "TM59 (Brutal Swing)", img: () => tm("dark") },
					{ id: 60, text: "TM60 (Quash)", img: () => tm("dark") },
					{ id: 61, text: "TM61 (Will-O-Wisp)", img: () => tm("fire") },
					{ id: 62, text: "TM62 (Acrobatics)", img: () => tm("flying") },
					{ id: 63, text: "TM63 (Embargo)", img: () => tm("dark") },
					{ id: 64, text: "TM64 (Explosion)", img: () => tm("normal") },
					{ id: 65, text: "TM65 (Shadow Claw)", img: () => tm("ghost") },
					{ id: 66, text: "TM66 (Payback)", img: () => tm("dark") },
					{ id: 67, text: "TM67 (Smart Strike)", img: () => tm("steel") },
					{ id: 68, text: "TM68 (Giga Impact)", img: () => tm("normal") },
					{ id: 69, text: "TM69 (Rock Polish)", img: () => tm("rock") },
					{ id: 70, text: "TM70 (Aurora Veil)", img: () => tm("ice") },
					{ id: 71, text: "TM71 (Stone Edge)", img: () => tm("rock") },
					{ id: 72, text: "TM72 (Volt Switch)", img: () => tm("electric") },
					{ id: 73, text: "TM73 (Thunder Wave)", img: () => tm("electric") },
					{ id: 74, text: "TM74 (Gyro Ball)", img: () => tm("steel") },
					{ id: 75, text: "TM75 (Swords Dance)", img: () => tm("normal") },
					{ id: 76, text: "TM76 (Fly)", img: () => tm("flying") },
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
					{ id: 88, text: "TM88 (Sleep Talk)", img: () => tm("normal") },
					{ id: 89, text: "TM89 (U-turn)", img: () => tm("bug") },
					{ id: 90, text: "TM90 (Substitute)", img: () => tm("normal") },
					{ id: 91, text: "TM91 (Flash Cannon)", img: () => tm("steel") },
					{ id: 92, text: "TM92 (Trick Room)", img: () => tm("psychic") },
					{ id: 93, text: "TM93 (Wild Charge)", img: () => tm("electric") },
					{ id: 94, text: "TM94 (Surf)", img: () => tm("water") },
					{ id: 95, text: "TM95 (Snarl)", img: () => tm("dark") },
					{ id: 96, text: "TM96 (Nature Power)", img: () => tm("normal") },
					{ id: 97, text: "TM97 (Dark Pulse)", img: () => tm("dark") },
					{ id: 98, text: "TM98 (Waterfall)", img: () => tm("water") },
					{ id: 99, text: "TM99 (Dazzling Gleam)", img: () => tm("fairy") },
					{ id: 100, text: "TM100 (Confide)", img: () => tm("normal") },
				],
			},
		],
		extraCredit: [
			{
				id: 1, text: "Obtain all Event Mythical Pokémon", children: [
					{ id: 1, text: "Magerna", img: ({ gameKey }) => baseSprite(gameKey, 801) },
					{ id: 2, text: "Marshadow", img: ({ gameKey }) => baseSprite(gameKey, 802) },
				],
			},
			{
				id: 2, text: "Get Mega Stones from distribution codes", children: [
					{ id: 1, text: "Beedrillite", img: ({ gameKey }) => [baseSprite(gameKey, "015-m"), megaStone("beedrillite")] },
					{ id: 2, text: "Pidgeotite", img: ({ gameKey }) => [baseSprite(gameKey, "018-m"), megaStone("pidgeotite")] },
					{ id: 3, text: "Mewtwonite X", img: ({ gameKey }) => [baseSprite(gameKey, "150-mx"), megaStone("mewtwonite-x")] },
					{ id: 4, text: "Mewtwonite Y", img: ({ gameKey }) => [baseSprite(gameKey, "150-my"), megaStone("mewtwonite-y")] },
					{ id: 5, text: "Ampharosite", img: ({ gameKey }) => [baseSprite(gameKey, "181-m"), megaStone("ampharosite")] },
					{ id: 6, text: "Steelixite", img: ({ gameKey }) => [baseSprite(gameKey, "208-m"), megaStone("steelixite")] },
					{ id: 7, text: "Heracronite", img: ({ gameKey }) => [baseSprite(gameKey, "214-m"), megaStone("heracronite")] },
					{ id: 8, text: "Houndoominite", img: ({ gameKey }) => [baseSprite(gameKey, "229-m"), megaStone("houndoominite")] },
					{ id: 9, text: "Tyranitarite", img: ({ gameKey }) => [baseSprite(gameKey, "248-m"), megaStone("tyranitarite")] },
					{ id: 10, text: "Sceptilite", img: ({ gameKey }) => [baseSprite(gameKey, "254-m"), megaStone("sceptilite")] },
					{ id: 11, text: "Blazikenite", img: ({ gameKey }) => [baseSprite(gameKey, "257-m"), megaStone("blazikenite")] },
					{ id: 12, text: "Swampertite", img: ({ gameKey }) => [baseSprite(gameKey, "260-m"), megaStone("swampertite")] },
					{ id: 13, text: "Gardevoirite", img: ({ gameKey }) => [baseSprite(gameKey, "282-m"), megaStone("gardevoirite")] },
					{ id: 14, text: "Mawilite", img: ({ gameKey }) => [baseSprite(gameKey, "303-m"), megaStone("mawilite")] },
					{ id: 15, text: "Aggronite", img: ({ gameKey }) => [baseSprite(gameKey, "306-m"), megaStone("aggronite")] },
					{ id: 16, text: "Medichamite", img: ({ gameKey }) => [baseSprite(gameKey, "308-m"), megaStone("medichamite")] },
					{ id: 17, text: "Manectite", img: ({ gameKey }) => [baseSprite(gameKey, "310-m"), megaStone("manectite")] },
					{ id: 18, text: "Cameruptite", img: ({ gameKey }) => [baseSprite(gameKey, "323-m"), megaStone("cameruptite")] },
					{ id: 19, text: "Altarianite", img: ({ gameKey }) => [baseSprite(gameKey, "334-m"), megaStone("altarianite")] },
					{ id: 20, text: "Banettite", img: ({ gameKey }) => [baseSprite(gameKey, "354-m"), megaStone("banettite")] },
					{ id: 21, text: "Latiasite", img: ({ gameKey }) => [baseSprite(gameKey, "380-m"), megaStone("latiasite")] },
					{ id: 22, text: "Latiosite", img: ({ gameKey }) => [baseSprite(gameKey, "381-m"), megaStone("latiosite")] },
					{ id: 23, text: "Lopunnite", img: ({ gameKey }) => [baseSprite(gameKey, "428-m"), megaStone("lopunnite")] },
					{ id: 24, text: "Abomasite", img: ({ gameKey }) => [baseSprite(gameKey, "460-m"), megaStone("abomasite")] },
					{ id: 25, text: "Galladite", img: ({ gameKey }) => [baseSprite(gameKey, "475-m"), megaStone("galladite")] },
					{ id: 26, text: "Audinite", img: ({ gameKey }) => [baseSprite(gameKey, "531-m"), megaStone("audinite")] },
				],
			},
			{
				id: 3, text: "Get Z-Crystals from distribution codes", children: [
					{ id: 1, text: "Marshadium Z", img: ({ gameKey }) => [baseSprite(gameKey, 802), zCrystal("marshadiumz")] },
					{ id: 2, text: "Mewnium Z", img: ({ gameKey }) => [baseSprite(gameKey, 151), zCrystal("mewniumz")] },
					{ id: 3, text: "Pikashunium Z", img: ({ gameKey }) => [baseSprite(gameKey, "025-o"), zCrystal("pikashuniumz")] },
					{ id: 4, text: "Snorlium Z", img: ({ gameKey }) => [baseSprite(gameKey, 143), zCrystal("snorliumz")] },
				],
			},
		],
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
		catching: overrideTasks(TASKS_BY_SECTION.catching, {
			1: {
				1: { text: "Catch Solgaleo" },
				2: { text: "Trade Lunala" },
			},
			2: {
				2: { text: "Catch UB-02 Buzzwole", img: ({ gameKey }) => baseSprite(gameKey, 794) },
				3: { text: "Trade UB-02 Pheromosa", img: ({ gameKey }) => baseSprite(gameKey, 795) },
				5: { text: "Catch UB-04 Kartana", img: ({ gameKey }) => baseSprite(gameKey, 798) },
				6: { text: "Trade UB-04 Celesteela", img: ({ gameKey }) => baseSprite(gameKey, 797) },
			}
		}),
		story: overrideTasks(TASKS_BY_SECTION.story, {
			2: {
				3: { text: "Catch Buzzwole" },
				5: { text: "Catch Kartana" },
			}
		}),
		activities: overrideTasks(TASKS_BY_SECTION.activities, {
			2: {
				6: { text: "Show Passimian to the Aether employee at the Konikoni City Pokémon Center", img: ({ gameKey }) => baseSprite(gameKey, 766) },
			}
		}),
		upgrades: overrideTasks(TASKS_BY_SECTION.upgrades, {
			2: {
				4: { text: "Reverent Style", tooltip: "Defeat Kiawe in Paniola Town" },
			}
		}),
		collectables: overrideTasks(TASKS_BY_SECTION.collectables, {
			3: {
				11: { text: "Sun Flute", img: () => keyItem("sun-flute") },
			}
		}),
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
		catching: overrideTasks(TASKS_BY_SECTION.catching, {
			1: {
				1: { text: "Trade Solgaleo" },
				2: { text: "Catch Lunala" },
			},
			2: {
				2: { text: "Trade UB-02 Buzzwole", img: ({ gameKey }) => baseSprite(gameKey, 794) },
				3: { text: "Catch UB-02 Pheromosa", img: ({ gameKey }) => baseSprite(gameKey, 795) },
				5: { text: "Trade UB-04 Kartana", img: ({ gameKey }) => baseSprite(gameKey, 798) },
				6: { text: "Catch UB-04 Celesteela", img: ({ gameKey }) => baseSprite(gameKey, 797) },
			}
		}),
		story: overrideTasks(TASKS_BY_SECTION.story, {
			2: {
				3: { text: "Catch Pheromosa" },
				5: { text: "Catch Celesteela" },
			}
		}),
		activities: overrideTasks(TASKS_BY_SECTION.activities, {
			2: {
				6: { text: "Show Oranguru to the Aether employee at the Konikoni City Pokémon Center", img: ({ gameKey }) => baseSprite(gameKey, 765) },
			}
		}),
		upgrades: overrideTasks(TASKS_BY_SECTION.upgrades, {
			2: {
				4: { text: "Reverent Style", tooltip: "Defeat Mallow in Lush Jungle" },
			}
		}),
		collectables: overrideTasks(TASKS_BY_SECTION.collectables, {
			3: {
				11: { text: "Moon Flute", img: () => keyItem("moon-flute") },
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
