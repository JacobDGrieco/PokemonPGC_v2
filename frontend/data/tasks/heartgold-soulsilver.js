import {
	_hm,
	_keyItem,
	_tm,
	_location,
	_npc,
	_task,
	_badges,
	_frontSprite,
	_frontSpriteShiny,
	range,
	defineTasksMany,
	overrideTaskChildTexts,
} from '../helpers/index.js';

(() => {
	const gen = 4;
	const GAME_KEYS = ["heartgold", "soulsilver"];

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
		{ id: "side-quests", title: "Side Quests" },
		{ id: "activities", title: "Activities" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "thms", title: "TMs/HMs" },
		{ id: "distributions", title: "Distributions" },
		{ id: "extra-credit", title: "Extra Credit" },
	];

	const TASKS_BY_SECTION = {
		"catching": [
			{
				id: 1, text: "Catch all the Legendaries", children: [
					{ id: 1, text: "Catch Raikou", img: ({ gameKey }) => baseSprite(gameKey, 243), },
					{ id: 2, text: "Catch Entei", img: ({ gameKey }) => baseSprite(gameKey, 244), },
					{ id: 3, text: "Catch Suicune", img: ({ gameKey }) => baseSprite(gameKey, 245), },
					{ id: 4, text: "Catch Lugia", img: ({ gameKey }) => baseSprite(gameKey, 249), },
					{ id: 5, text: "Catch Ho-Oh", img: ({ gameKey }) => baseSprite(gameKey, 250), },
					{ id: 6, text: "Catch Articuno", img: ({ gameKey }) => baseSprite(gameKey, 144), },
					{ id: 7, text: "Catch Zapdos", img: ({ gameKey }) => baseSprite(gameKey, 145), },
					{ id: 8, text: "Catch Moltres", img: ({ gameKey }) => baseSprite(gameKey, 146), },
					{ id: 9, text: "Catch Mewtwo", img: ({ gameKey }) => baseSprite(gameKey, 150), },
					{ id: 10, text: "Catch/Trade Kyogre", img: ({ gameKey }) => baseSprite(gameKey, 382), },
					{ id: 11, text: "Catch/Trade Groudon", img: ({ gameKey }) => baseSprite(gameKey, 383), },
					{ id: 12, text: "Catch Rayquaza", img: ({ gameKey }) => baseSprite(gameKey, 384), },
					{ id: 13, text: "Create/Trade Dialga", img: ({ gameKey }) => baseSprite(gameKey, 483), },
					{ id: 14, text: "Create/Trade Palkia", img: ({ gameKey }) => baseSprite(gameKey, 484), },
					{ id: 15, text: "Create/Trade Giratina", img: ({ gameKey }) => baseSprite(gameKey, 487), },
				],
			},
			{ id: 2, text: "Catch/Defeat the Sudowoodo on Route 36", img: ({ gameKey }) => baseSprite(gameKey, 185) },
			{ id: 3, text: 'Catch/Defeat the "Red" Gyarados in the Lake of Rage', img: ({ gameKey }) => shinySprite(gameKey, 130) },
			{ id: 4, text: "Catch/Defeat the Snorlax in Vermillion City", img: ({ gameKey }) => baseSprite(gameKey, 143) },
			{
				id: 5, text: "Obtain all In-Game Gift Pokémon", children: [
					{ id: 1, text: "Togepi", img: ({ gameKey }) => baseSprite(gameKey, 175) },
					{ id: 2, text: "Spearow", img: ({ gameKey }) => baseSprite(gameKey, 21) },
					{ id: 3, text: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133) },
					{ id: 4, text: "Shuckle", img: ({ gameKey }) => baseSprite(gameKey, 213) },
					{ id: 5, text: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72) },
					{ id: 6, text: "Tyrogue", img: ({ gameKey }) => baseSprite(gameKey, 236) },
					{ id: 7, text: "Dratini", img: ({ gameKey }) => baseSprite(gameKey, 147) },
					{
						id: 8, text: "Bulbasaur/Charmander/Squirtle", img: ({ gameKey }) => task(gameKey, "kanto_starters"), eithers: {
							1: { text: "" }, 2: { text: "" }, 3: { text: "" },
						},
					},
					{
						id: 9, text: "Treecko/Torchic/Mudkip", img: ({ gameKey }) => task(gameKey, "hoenn_starters"), eithers: {
							1: { text: "" }, 2: { text: "" }, 3: { text: "" },
						},
					},
				],
			},
			{
				id: 6, text: "Complete all In-Game Trades", children: [
					{ id: 1, text: "Bellsprout for Onix", img: ({ gameKey }) => task(gameKey, "bellsprout-for-onix") },
					{ id: 2, text: "Drowzee for Machop", img: ({ gameKey }) => task(gameKey, "drowzee-for-machop") },
					{ id: 3, text: "Krabby for Voltorb", img: ({ gameKey }) => task(gameKey, "krabby-for-voltorb") },
					{ id: 4, text: "Dragonair for Dodrio", img: ({ gameKey }) => task(gameKey, "dragonair-for-dodrio") },
					{ id: 5, text: "Haunter for Xatu", img: ({ gameKey }) => task(gameKey, "haunter-for-xatu") },
					{ id: 6, text: "Dugtrio for Magneton", img: ({ gameKey }) => task(gameKey, "dugtrio-for-magneton") },
					{ id: 7, text: "Pikachu for Pikachu", img: ({ gameKey }) => task(gameKey, "pikachu-for-pikachu") },
					{ id: 8, text: "Forretress for Beldum", img: ({ gameKey }) => task(gameKey, "forretress-for-beldum") },
					{ id: 9, text: "Bonsly for Rhyhorn", img: ({ gameKey }) => task(gameKey, "bonsly-for-rhyhorn") },
					{ id: 10, text: "Anything for Steelix", img: ({ gameKey }) => task(gameKey, "anything-for-steelix") },
				]
			},
		],
		"story": [
			{ id: 1, text: "Collect all 8 Gym Badges and Defeat the Elite 4", img: () => _badges(["zephyr", "hive", "plain", "fog", "storm", "mineral", "glacier", "rising"]), noCenter: true },
			{
				id: 2, text: "Complete the Epilogue", children: [
					{ id: 1, text: "Arceus & Sinjoh Ruins", },
					{ id: 2, text: "Celebi & Giovanni's Backstory", },
					{ id: 3, text: "Spikey Eared Pichu & Illex Forest", },
				],
			},
			{
				id: 3, text: "Explore the Kanto Region", children: [
					{ id: 1, text: "Restore power to the Kanto Power Plant", img: ({ gameKey }) => location(gameKey, "kanto-power-plant") },
					{ id: 2, text: "Find Blue", img: ({ gameKey }) => npc(gameKey, "blue"), tooltip: "Can be found on Cinnabar Island" },
					{ id: 3, text: "Defeat Blaine", img: ({ gameKey }) => npc(gameKey, "blaine"), tooltip: "Can be found at the Seafoam Islands", },
					{ id: 4, text: "Defeat Red", img: ({ gameKey }) => npc(gameKey, "red"), tooltip: "Can be found atop Mt. Silver" },
				],
			},
			{
				id: 4, text: "Collect all 8 Kanto Gym Badges", children: [
					{ id: 1, text: "Thunder Badge", img: () => _badges("thunder"), tooltip: "Defeat Lt. Surge at the Vermillion City Gym" },
					{ id: 2, text: "Marsh Badge", img: () => _badges("marsh"), tooltip: "Defeat Sabrina at the Saffron City Gym" },
					{ id: 3, text: "Rainbow Badge", img: () => _badges("rainbow"), tooltip: "Defeat Erika at the Celdaon City Gym" },
					{ id: 4, text: "Soul Badge", img: () => _badges("soul"), tooltip: "Defeat Janine at the Fuchsia City Gym" },
					{ id: 5, text: "Cascade Badge", img: () => _badges("cascade"), tooltip: "Defeat Misty at the Cerulean City Gym" },
					{ id: 6, text: "Boulder Badge", img: () => _badges("boulder"), tooltip: "Defeat Brock at the Pewter City Gym" },
					{ id: 7, text: "Volcano Badge", img: () => _badges("volcano"), tooltip: "Defeat Blane at the Seafoam Islands", },
					{ id: 8, text: "Earth Badge", img: () => _badges("earth"), tooltip: "Defeat Blue at the Viridian City Gym" },
				],
			},
		],
		"side-quests": [
			{ id: 1, text: "Show Elm the hatched Egg", img: ({ gameKey }) => npc(gameKey, "elm"), tooltip: "You get an Everstone in return" },
			{ id: 2, text: "Deliver the mail for Randy to his friend", img: ({ gameKey }) => npc(gameKey, "randy"), tooltip: "Randy (Route 36), Friend (Route 31)" },
			{ id: 3, text: "Cure the Miltank", img: ({ gameKey }) => baseSprite(gameKey, 242), tooltip: "Route 39 - Miltank Farm" },
			{ id: 4, text: "Talk to DJ Mary in the Radio Tower", img: ({ gameKey }) => npc(gameKey, "dj-mary"), tooltip: "Talk after defeating Team Rocket in the Radio Tower" },
			{ id: 5, text: "Return the lost doll", img: () => [keyItem("lost-item-c"), keyItem("lost-item-mj")], tooltip: "The woman is in Saffron City" },
			{
				id: 6, text: "Meet all the Week Siblings", children: [
					{ id: 1, text: "Monica", img: ({ gameKey }) => npc(gameKey, "monica") },
					{ id: 2, text: "Tuscany", img: ({ gameKey }) => npc(gameKey, "tuscany") },
					{ id: 3, text: "Wesley", img: ({ gameKey }) => npc(gameKey, "wesley") },
					{ id: 4, text: "Arthur", img: ({ gameKey }) => npc(gameKey, "arthur") },
					{ id: 5, text: "Frieda", img: ({ gameKey }) => npc(gameKey, "frieda") },
					{ id: 6, text: "Santos", img: ({ gameKey }) => npc(gameKey, "santos") },
					{ id: 7, text: "Sunny", img: ({ gameKey }) => npc(gameKey, "sunny") },
				],
			},
		],
		"activities": [
			{
				id: 1, text: "Get into the Pokeathalon Hall of Fame", children: [
					{ id: 1, text: "Hurdle Dash", tooltip: "Need a highscore of 80+" },
					{ id: 2, text: "Lamp Jump", tooltip: "Need a highscore of 500+" },
					{ id: 3, text: "Ring Toss", tooltip: "Need a highscore of 100+" },
					{ id: 4, text: "Snow Throw", tooltip: "Need a highscore of 55+" },
					{ id: 5, text: "Relay Run", tooltip: "Need a highscore of 16+" },
					{ id: 6, text: "Block Smash", tooltip: "Need a highscore of 130+" },
					{ id: 7, text: "Circle Push", tooltip: "Need a highscore of 60+" },
					{ id: 8, text: "Pennant Capture", tooltip: "Need a highscore of 50+" },
					{ id: 9, text: "Disc Catch", tooltip: "Need a highscore of 70+" },
					{ id: 10, text: "Goal Roal", tooltip: "Need a highscore of 9+" },
				],
			},
			{
				id: 2, text: "Take 16 Commemerative Photos with Gym Leaders", children: [
					{ id: 1, text: "Falker", img: ({ gameKey }) => npc(gameKey, "falkner"), tooltip: "Wed | Celadon City Dept. Store" },
					{ id: 2, text: "Bugsy", img: ({ gameKey }) => npc(gameKey, "bugsy"), tooltip: "Mon, Fri | National Park" },
					{ id: 3, text: "Whitney", img: ({ gameKey }) => npc(gameKey, "whitney"), tooltip: "Everyday 6pm-9pm | Goldenrod City Dept. Store | Need Phone Number" },
					{ id: 4, text: "Morty", img: ({ gameKey }) => npc(gameKey, "morty"), tooltip: "Fri | Outside Bell Tower | Need Phone Number" },
					{ id: 5, text: "Chuck", img: ({ gameKey }) => npc(gameKey, "chuck"), tooltip: "Sun | Route 47 | Disappears after obtaining Jade Orb" },
					{ id: 6, text: "Jasmine", img: ({ gameKey }) => npc(gameKey, "jasmine"), tooltip: "Everyday 12pm-1pm | Olivine City Restaurant | Need Phone Number" },
					{ id: 7, text: "Pryce", img: ({ gameKey }) => npc(gameKey, "pryce"), tooltip: "Everyday | In Mahogany Gym" },
					{ id: 8, text: "Clair", img: ({ gameKey }) => npc(gameKey, "clair"), tooltip: "Everyday 5pm-7pm | In Dragon's Den" },
					{ id: 9, text: "Lt. Surge", img: ({ gameKey }) => npc(gameKey, "lt-surge"), tooltip: "Sat | Route 39 | Need Phone Number" },
					{ id: 10, text: "Sabrina", img: ({ gameKey }) => npc(gameKey, "sabrina"), tooltip: "Mon, Fri | Olivine City Harbor | Need Phone Number" },
					{ id: 11, text: "Erika", img: ({ gameKey }) => npc(gameKey, "erika"), tooltip: "Mon | Celadon City Fountain | Need Phone Number" },
					{ id: 12, text: "Misty", img: ({ gameKey }) => npc(gameKey, "misty"), tooltip: "Everyday 2pm-4pm | Route 25 | Need Phone Number & Water Pokémon out of ball" },
					{ id: 13, text: "Janine", img: ({ gameKey }) => npc(gameKey, "janine"), tooltip: "Everyday 6pm-8pm | Reception Gate | Need Phone Number" },
					{ id: 14, text: "Brock", img: ({ gameKey }) => npc(gameKey, "brock"), tooltip: "Tue, Wed, Fri, Sun 5pm-9pm | Diglett's Cave - Route 2 Entrance | Need Phone Number" },
					{ id: 15, text: "Blaine", img: ({ gameKey }) => npc(gameKey, "blaine"), tooltip: "Tue | Cinnabar Island | Need Phone Number" },
					{ id: 16, text: "Blue", img: ({ gameKey }) => npc(gameKey, "blue"), tooltip: "Fri | Cinnabar Island | Need Phone Number & Defeated Red" },
				],
			},
			{
				id: 3, text: "Take 46 Commemerative Photos at certain locations", children: [
					{ id: 1, text: "New Bark Town", tooltip: "Tue | Outside of your house" },
					{ id: 2, text: "Cherrygrove City", tooltip: "Mon, Wed, Fri | Outside of your house" },
					{ id: 3, text: "Ruins of Alph", tooltip: "Fri, Sat, Sun | Outside the ruins" },
					{ id: 4, text: "Ruins of Alph", tooltip: "Mon, Tue, Thu | Inside the ruins" },
					{ id: 5, text: "Route 32", tooltip: "Tue, Thu, Sat | By the Pokémon Centre" },
					{ id: 6, text: "Slowpoke Well", tooltip: "Mon, Wed, Fri | Down the Stairs" },
					{ id: 7, text: "Ilex Forest", tooltip: "Tue, Sat, Sun | By Northern Exit" },
					{ id: 8, text: "Route 34", tooltip: "Wed, Thu | Outside Day Care Centre" },
					{ id: 9, text: "Goldenrod Underground", tooltip: "Everyday | Dressed as Rocket" },
					{ id: 10, text: "Route 35", tooltip: "Mon, Tue, Fri | By South Gate" },
					{ id: 11, text: "National Park (1)", tooltip: "Sat, Sun | In the Gate" },
					{ id: 12, text: "National Park (2)", tooltip: "Mon, Sat, Sun | In the South of the Park" },
					{ id: 13, text: "Pokéathlon Dome", tooltip: "Thu, Fri, Sat | Outside the Dome" },
					{ id: 14, text: "Ecruteak City", tooltip: "Fri | Outside the Bell Tower Gate" },
					{ id: 15, text: "Route 39", tooltip: "Thu, Sun | Outside MooMoo Farm" },
					{ id: 16, text: "Olivine City", tooltip: "Mon, Tue | By Pokémon Centre" },
					{ id: 17, text: "Shining Lighthouse", tooltip: "Wed, Sat | On 4th Floor" },
					{ id: 18, text: "Cianwood City", tooltip: "Everyday | Camera on the Beach" },
					{ id: 19, text: "Route 48", tooltip: "Fri, Sun | On Path" },
					{ id: 20, text: "Safari Zone Gate", tooltip: "Tue, Thu | Outside Safari Zone Entrance" },
					{ id: 21, text: "Ice Path", tooltip: "Sat | Near Route 44 Entrance" },
					{ id: 22, text: "Blackthorn City", tooltip: "Tue, Sun | Outside a House" },
					{ id: 23, text: "Dragon's Den", tooltip: "Mon, Thu | In Shrine in Dragon's Den" },
					{ id: 24, text: "Route 45", tooltip: "Wed, Sat | By the Waterfall" },
					{ id: 25, text: "Frontier Front", tooltip: "Tue, Sat | Outside Battle Frontier Entrance" },
					{ id: 26, text: "Pallet Town", tooltip: "Wed, Thu, Fri | Outside Red's House" },
					{ id: 27, text: "Route 1", tooltip: "Mon, Tue, Sat | In the middle of Route" },
					{ id: 28, text: "Viridian City", tooltip: "Wed, Fri | Outside Trainer House" },
					{ id: 29, text: "Pewter City", tooltip: "Tue, Sat | Outside the Museum" },
					{ id: 30, text: "Pewter Museum", tooltip: "Mon, Sun | In the middle" },
					{ id: 31, text: "Cerulean City", tooltip: "Thu, Sun | By Route 24" },
					{ id: 32, text: "Vermillion City", tooltip: "Thu, Sun | In the construction area" },
					{ id: 33, text: "Saffron City (1)", tooltip: "Fri, Sat | Outside Silph Co" },
					{ id: 34, text: "Saffron City (2)", tooltip: "Mon, Tue, Wed, Fri, Sat | Outside Magnet Train Station" },
					{ id: 35, text: "Celadon City", tooltip: "Tue, Fri | Near Fountain" },
					{ id: 36, text: "Celadon City Department Store", tooltip: "Fri | On 2nd Floor" },
					{ id: 37, text: "Fuchsia City", tooltip: "Tue, Sat | By South Gate" },
					{ id: 38, text: "Route 14", tooltip: "Thu, Sun | By the Windmills" },
					{ id: 39, text: "Route 12", tooltip: "Mon, Wed, Sun | By Lavender Town" },
					{ id: 40, text: "Seafoam Islands", tooltip: "Tue, Sat | B1F" },
					{ id: 41, text: "Route 21", tooltip: "Mon | On small island by Pallet Town" },
					{ id: 42, text: "Route 22", tooltip: "Thu, Sun | By Exit" },
					{ id: 43, text: "Route 26", tooltip: "Tue, Fri | On bridge by Route 27" },
					{ id: 44, text: "Mt. Silver (1)", tooltip: "Wed, Fri | Outside Pokémon Centre" },
					{ id: 45, text: "Mt. Silver (1)", tooltip: "Thu | Up Waterfall" },
					{ id: 46, text: "Pallet Town", tooltip: "Everyday | Complete National Dex" },
				],
			},
		],
		"battle": [
			{ id: 1, text: "Rematch all 16 Gym Leaders" },
			{ id: 2, text: "Rematch the Elite 4", tooltip: "Collect all 8 Kanto Gym badges for the true final battle" },
			{ id: 3, text: "Defeat Red" },
			{
				id: 4, text: "Defeat all Battle Frontier Tycoons for the Silver Medals", children: [
					{ id: 1, text: "Battle Tower's Palmer", },
					{ id: 2, text: "Battle Factory's Thorton", },
					{ id: 3, text: "Battle Arcade's Dahila", },
					{ id: 4, text: "Battle Castle's Darach & Caitlin", },
					{ id: 5, text: "Battle Hall's Argenta", },
				],
			},
			{
				id: 5, text: "Defeat all Battle Frontier Tycoons for the Colored Medals", children: [
					{ id: 1, text: "Battle Tower's Palmer", },
					{ id: 2, text: "Battle Factory's Thorton", },
					{ id: 3, text: "Battle Arcade's Dahila", },
					{ id: 4, text: "Battle Castle's Darach & Caitlin", },
					{ id: 5, text: "Battle Hall's Argenta", },
				],
			},
		],
		"upgrades": [
			{ id: 1, text: "Obtain the National PokeDex" },
			{
				id: 2, text: "Obtain the Black 5-Star Trainer Card", children: [
					{ id: 1, text: "Defeat the Elite 4/Champion" },
					{ id: 2, text: "Complete the National PokeDex (484)" },
					{ id: 3, text: "Get a 100 Win Streak in the Battle Tower" },
					{ id: 4, text: "Get into the Pokeathalon Hall of Fame" },
					{ id: 5, text: "Get 5 Shiny Leaves on a single Pokemon", tiers: range(1, 5), tooltip: "Speak to Ethan/Lyra in New Bark Town" },
				],
			},
		],
		"thms": [
			{
				id: 1, text: "Collect all HMs", children: [
					{ id: 1, text: "HM01 (Cut)", img: () => hm("normal") },
					{ id: 2, text: "HM02 (Fly)", img: () => hm("flying") },
					{ id: 3, text: "HM03 (Surf)", img: () => hm("water") },
					{ id: 4, text: "HM04 (Strength)", img: () => hm("normal") },
					{ id: 5, text: "HM05 (Whirlpool)", img: () => hm("water") },
					{ id: 6, text: "HM06 (Rock Smash)", img: () => hm("fighting") },
					{ id: 7, text: "HM07 (Waterfall)", img: () => hm("water") },
					{ id: 8, text: "HM08 (Rock Climb)", img: () => hm("normal") },
				],
			},
			{
				id: 2, text: "Collect all HMs", children: [
					{ id: 1, text: "TM01 (Focus Punch)", img: () => tm("fighting") },
					{ id: 2, text: "TM02 (Dragon Claw)", img: () => tm("dragon") },
					{ id: 3, text: "TM03 (Water Pulse)", img: () => tm("water") },
					{ id: 4, text: "TM04 (Calm Mind)", img: () => tm("psychic") },
					{ id: 5, text: "TM05 (Roar)", img: () => tm("normal") },
					{ id: 6, text: "TM06 (Toxic)", img: () => tm("poison") },
					{ id: 7, text: "TM07 (Hail)", img: () => tm("ice") },
					{ id: 8, text: "TM08 (Bulk Up)", img: () => tm("fighting") },
					{ id: 9, text: "TM09 (Bullet Seed)", img: () => tm("grass") },
					{ id: 10, text: "TM10 (Hidden Power)", img: () => tm("normal") },
					{ id: 11, text: "TM11 (Sunny Day)", img: () => tm("fire") },
					{ id: 12, text: "TM12 (Taunt)", img: () => tm("dark") },
					{ id: 13, text: "TM13 (Ice Beam)", img: () => tm("ice") },
					{ id: 14, text: "TM14 (Blizzard)", img: () => tm("ice") },
					{ id: 15, text: "TM15 (Hyper Beam)", img: () => tm("normal") },
					{ id: 16, text: "TM16 (Light Screen)", img: () => tm("psychic") },
					{ id: 17, text: "TM17 (Protect)", img: () => tm("normal") },
					{ id: 18, text: "TM18 (Rain Dance)", img: () => tm("water") },
					{ id: 19, text: "TM19 (Giga Drain)", img: () => tm("grass") },
					{ id: 20, text: "TM20 (Safeguard)", img: () => tm("normal") },
					{ id: 21, text: "TM21 (Frustration)", img: () => tm("normal") },
					{ id: 22, text: "TM22 (Solar Beam)", img: () => tm("grass") },
					{ id: 23, text: "TM23 (Iron Tail)", img: () => tm("steel") },
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
					{ id: 34, text: "TM34 (Shock Wave)", img: () => tm("electric") },
					{ id: 35, text: "TM35 (Flamethrower)", img: () => tm("fire") },
					{ id: 36, text: "TM36 (Sludge Bomb)", img: () => tm("poison") },
					{ id: 37, text: "TM37 (Sandstorm)", img: () => tm("rock") },
					{ id: 38, text: "TM38 (Fire Blast)", img: () => tm("fire") },
					{ id: 39, text: "TM39 (Rock Tomb)", img: () => tm("rock") },
					{ id: 40, text: "TM40 (Aerial Ace)", img: () => tm("flying") },
					{ id: 41, text: "TM41 (Torment)", img: () => tm("dark") },
					{ id: 42, text: "TM42 (Facade)", img: () => tm("normal") },
					{ id: 43, text: "TM43 (Secret Power)", img: () => tm("normal") },
					{ id: 44, text: "TM44 (Rest)", img: () => tm("psychic") },
					{ id: 45, text: "TM45 (Attract)", img: () => tm("normal") },
					{ id: 46, text: "TM46 (Thief)", img: () => tm("dark") },
					{ id: 47, text: "TM47 (Steel Wing)", img: () => tm("steel") },
					{ id: 48, text: "TM48 (Skill Swap)", img: () => tm("psychic") },
					{ id: 49, text: "TM49 (Snatch)", img: () => tm("dark") },
					{ id: 50, text: "TM50 (Overheat)", img: () => tm("fire") },
					{ id: 51, text: "TM51 (Roost)", img: () => tm("flying") },
					{ id: 52, text: "TM52 (Focus Blast)", img: () => tm("fighting") },
					{ id: 53, text: "TM53 (Energy Ball)", img: () => tm("grass") },
					{ id: 54, text: "TM54 (False Swipe)", img: () => tm("normal") },
					{ id: 55, text: "TM55 (Brine)", img: () => tm("water") },
					{ id: 56, text: "TM56 (Fling)", img: () => tm("dark") },
					{ id: 57, text: "TM57 (Charge Beam)", img: () => tm("electric") },
					{ id: 58, text: "TM58 (Endure)", img: () => tm("normal") },
					{ id: 59, text: "TM59 (Dragon Pulse)", img: () => tm("dragon") },
					{ id: 60, text: "TM60 (Drain Punch)", img: () => tm("fighting") },
					{ id: 61, text: "TM61 (Will-O-Wisp)", img: () => tm("fire") },
					{ id: 62, text: "TM62 (Silver Wind)", img: () => tm("bug") },
					{ id: 63, text: "TM63 (Embargo)", img: () => tm("dark") },
					{ id: 64, text: "TM64 (Explosion)", img: () => tm("normal") },
					{ id: 65, text: "TM65 (Shadow Claw)", img: () => tm("ghost") },
					{ id: 66, text: "TM66 (Payback)", img: () => tm("dark") },
					{ id: 67, text: "TM67 (Recycle)", img: () => tm("normal") },
					{ id: 68, text: "TM68 (Giga Impact)", img: () => tm("normal") },
					{ id: 69, text: "TM69 (Rock Polish)", img: () => tm("rock") },
					{ id: 70, text: "TM70 (Flash)", img: () => tm("normal") },
					{ id: 71, text: "TM71 (Stone Edge)", img: () => tm("rock") },
					{ id: 72, text: "TM72 (Avalanche)", img: () => tm("ice") },
					{ id: 73, text: "TM73 (Thunder Wave)", img: () => tm("electric") },
					{ id: 74, text: "TM74 (Gyro Ball)", img: () => tm("steel") },
					{ id: 75, text: "TM75 (Swords Dance)", img: () => tm("normal") },
					{ id: 76, text: "TM76 (Stealth Rock)", img: () => tm("rock") },
					{ id: 77, text: "TM77 (Psych Up)", img: () => tm("normal") },
					{ id: 78, text: "TM78 (Captivate)", img: () => tm("normal") },
					{ id: 79, text: "TM79 (Dark Pulse)", img: () => tm("dark") },
					{ id: 80, text: "TM80 (Rock Slide)", img: () => tm("rock") },
					{ id: 81, text: "TM81 (X-Scissor)", img: () => tm("bug") },
					{ id: 82, text: "TM82 (Sleep Talk)", img: () => tm("normal") },
					{ id: 83, text: "TM83 (Natural Gift)", img: () => tm("normal") },
					{ id: 84, text: "TM84 (Poison Jab)", img: () => tm("poison") },
					{ id: 85, text: "TM85 (Dream Eater)", img: () => tm("psychic") },
					{ id: 86, text: "TM86 (Grass Knot)", img: () => tm("grass") },
					{ id: 87, text: "TM87 (Swagger)", img: () => tm("normal") },
					{ id: 88, text: "TM88 (Pluck)", img: () => tm("flying") },
					{ id: 89, text: "TM89 (U-turn)", img: () => tm("bug") },
					{ id: 90, text: "TM90 (Substitute)", img: () => tm("normal") },
					{ id: 91, text: "TM91 (Flash Cannon)", img: () => tm("steel") },
					{ id: 92, text: "TM92 (Trick Room)", img: () => tm("psychic") },
				],
			},
		],
		"extra-credit": [
			{
				id: 1, text: "Obtain all Mythical Pokemon", children: [
					{ id: 1, text: "Mew", img: ({ gameKey }) => baseSprite(gameKey, 151), },
					{ id: 2, text: "Celebi", img: ({ gameKey }) => baseSprite(gameKey, 251), },
				],
			},
		],
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
		catching: overrideTaskChildTexts(TASKS_BY_SECTION.catching, 1, {
			10: "Catch Kyogre",
			11: "Trade Groudon",
		}),
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
		catching: overrideTaskChildTexts(TASKS_BY_SECTION.catching, 1, {
			10: "Trade Kyogre",
			11: "Catch Groudon",
		}),
	};

	defineTasksMany(GAME_KEYS[0], SECTIONS, TASKS_BY_SECTION_GAME1);
	defineTasksMany(GAME_KEYS[1], SECTIONS, TASKS_BY_SECTION_GAME2);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();
