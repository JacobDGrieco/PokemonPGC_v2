import {
	_hm,
	_keyItem,
	_tm,
	_npc,
	_task,
	_badges,
	_frontSprite,
	defineTasksMany,
} from '../helpers/index.js';

(() => {
	const gen = 4;
	const GAME_KEYS = ["platinum"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const hm = (type) => _hm(gen, type);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
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
					{ id: 1, text: "Catch Dialga", img: ({ gameKey }) => baseSprite(gameKey, 483), },
					{ id: 2, text: "Catch Palkia", img: ({ gameKey }) => baseSprite(gameKey, 484), },
					{ id: 3, text: "Catch Giratina", img: ({ gameKey }) => baseSprite(gameKey, 487), },
					{ id: 4, text: "Catch Articuno", img: ({ gameKey }) => baseSprite(gameKey, 144), },
					{ id: 5, text: "Catch Zapdos", img: ({ gameKey }) => baseSprite(gameKey, 145), },
					{ id: 6, text: "Catch Moltres", img: ({ gameKey }) => baseSprite(gameKey, 146), },
					{ id: 7, text: "Catch Uxie", img: ({ gameKey }) => baseSprite(gameKey, 480), },
					{ id: 8, text: "Catch Mesprit", img: ({ gameKey }) => baseSprite(gameKey, 481), },
					{ id: 9, text: "Catch Azelf", img: ({ gameKey }) => baseSprite(gameKey, 482), },
					{ id: 10, text: "Catch Heatran", img: ({ gameKey }) => baseSprite(gameKey, 485), },
					{ id: 11, text: "Catch Regigigas", img: ({ gameKey }) => baseSprite(gameKey, 486), },
					{ id: 12, text: "Catch Cresselia", img: ({ gameKey }) => baseSprite(gameKey, 488), },
				],
			},
			{
				id: 2, text: "Catch/Defeat all Static Encounters", children: [
					{ id: 1, text: "Rotom", img: ({ gameKey }) => baseSprite(gameKey, 479), },
					{ id: 2, text: "Spiritomb", img: ({ gameKey }) => baseSprite(gameKey, 442), },
				],
			},
			{
				id: 3, text: "Obtain all In-Game Gift Pokémon", children: [
					{ id: 1, text: "Togepi Egg", img: ({ gameKey }) => baseSprite(gameKey, 175) },
					{ id: 2, text: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133) },
					{ id: 3, text: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447) },
				],
			},
			{
				id: 4, text: "Complete all In-Game Trades", children: [
					{ id: 1, text: "Machop for Abra", img: ({ gameKey }) => task(gameKey, "machop-for-abra") },
					{ id: 2, text: "Buizel for Chatot", img: ({ gameKey }) => task(gameKey, "muizel-for-chatot") },
					{ id: 3, text: "Medicham for Haunter", img: ({ gameKey }) => task(gameKey, "medicham-for-haunter"), tooltip: "This Haunter will have an Everstone" },
					{ id: 4, text: "Finneon for Magikarp", img: ({ gameKey }) => task(gameKey, "finneon-for-magikarp") },
				],
			}
		],
		"story": [
			{ id: 1, text: "Collect all 8 Gym Badges and Defeat the Elite 4", img: () => _badges(["coal", "forest", "cobble", "fen", "relic", "mine", "icicle", "beacon"]), noCenter: true, },
			{
				id: 2, text: "Epilogue", children: [
					{ id: 1, text: "Venture to the bottom of Mt. Stark" },
					{ id: 2, text: "Go on patrol" },
					{ id: 3, text: "Team Galactic Remnants" },
					{ id: 4, text: "Showdown with Mars and Jupiter" },
					{ id: 5, text: "Chase Charon!" },
					{ id: 6, text: "Team up with Buck" },
					{ id: 7, text: "Looker to the rescue!" },
					{ id: 8, text: "Use Rock Climb" },
				],
			},
		],
		"battle": [
			{ id: 1, text: "Re-battle the Elite 4 after obtaining the National Dex", noCenter: true },
			{
				id: 2, text: "Battle Barry at all 3 levels", tooltip: "Find Barry in the Survival Area\nMust defeat the Elite 4 10 times to get Barry to appear", children: [
					{ id: 1, text: "Phase 1", tooltip: "Levels are 59-65" },
					{ id: 2, text: "Phase 2", tooltip: "Levels are 69-75" },
					{ id: 3, text: "Phase 3", tooltip: "Levels are 79-85" },
				],
			},
			{
				id: 3, text: "Obtain all the Silver Medals in the Battle Frontier", children: [
					{ id: 1, text: "Factory Head Thorton" },
					{ id: 2, text: "Tycoon Tower Palmer" },
					{ id: 3, text: "Castle Valet Darach" },
					{ id: 4, text: "Aracde Star Dahila" },
					{ id: 5, text: "Hall Matron Argenta" },
				],
			},
			{
				id: 4, text: "Obtain all the Colored Medals in the Battle Frontier", children: [
					{ id: 1, text: "Factory Head Thorton" },
					{ id: 2, text: "Tycoon Tower Palmer" },
					{ id: 3, text: "Castle Valet Darach" },
					{ id: 4, text: "Aracde Star Dahila" },
					{ id: 5, text: "Hall Matron Argenta" },
				],
			},
		],
		"upgrades": [
			{ id: 1, text: "Obtain the National PokeDex" },
			{ id: 2, text: "Obtain the Mystery Gift option", },
			{
				id: 3, text: "Obtain the Black 5-Star Trainer Card", noCenter: true, children: [
					{ id: 1, text: "Defeat the Elite 4/Champion" },
					{ id: 2, text: "Complete the National PokeDex (482)" },
					{ id: 3, text: "Get a 100 Win Streak in the Battle Tower" },
					{ id: 4, text: "Complete a Master Rank Super Contest" },
					{ id: 5, text: "Play an Underground Capture the Flag Match" },
				],
			},
			{
				id: 4, text: "Obtain all the Poketch Apps", noCenter: true, children: [
					{ id: 1, text: "Digital Clock" },
					{ id: 2, text: "Memo Pad" },
					{ id: 3, text: "Your Party" },
					{ id: 4, text: "Item Finder" },
					{ id: 5, text: "Breeding Centre" },
					{ id: 6, text: "Counter" },
					{ id: 7, text: "Marking Map" },
					{ id: 8, text: "Coin Toss" },
					{ id: 9, text: "Calendar" },
					{ id: 10, text: "Roulette" },
					{ id: 11, text: "Kitchen Timer" },
					{ id: 12, text: "Matchup Checker" },
					{ id: 13, text: "Alarm Clock" },
					{ id: 14, text: "Calculator" },
					{ id: 15, text: "Step Counter" },
					{ id: 16, text: "Happiness Checker" },
					{ id: 17, text: "Berry Checker" },
					{ id: 18, text: "Pokemon History" },
					{ id: 19, text: "Analog Clock" },
					{ id: 20, text: "Wireless Searcher" },
					{ id: 21, text: "Type Chart" },
					{ id: 22, text: "Drawing Board" },
					{ id: 23, text: "PokeRadar Checker" },
					{ id: 24, text: "Color Changer" },
					{ id: 25, text: "Stopwatch" },
				],
			},
		],
		"collectables": [
			{
				id: 1, text: "Obtain all extra Key Items", children: [
					{ id: 1, text: "Bicycle", img: () => keyItem("bicycle") },
					{ id: 2, text: "Coin Case", img: () => keyItem("coin-case") },
					{ id: 3, text: "Explorer Kit", img: () => keyItem("explorer-kit") },
					{ id: 4, text: "Fashion Case", img: () => keyItem("fashion-case") },
					{ id: 5, text: "Good Rod", img: () => keyItem("good-rod") },
					{ id: 6, text: "Old Rod", img: () => keyItem("old-rod") },
					{ id: 7, text: "Poffin Case", img: () => keyItem("poffin-case") },
					{ id: 8, text: "Point Card", img: () => keyItem("point-card") },
					{ id: 9, text: "Poke Radar", img: () => keyItem("poke-radar") },
					{ id: 10, text: "Seal Case", img: () => keyItem("seal-case") },
					{ id: 11, text: "Sprayduck", img: () => keyItem("sprayduck") },
					{ id: 12, text: "Super Rod", img: () => keyItem("super-rod") },
					{ id: 13, text: "VS Seeker", img: () => keyItem("vs-seeker") },
				],
			},
			{
				id: 2, text: "Obtain all Mr. Goods Secret Base items", img: npc("mr-goods"), children: [
					{ id: 1, text: "Beauty Cup", img: () => keyItem("beauty-cup") },
					{ id: 2, text: "Cool Cup", img: () => keyItem("cool-cup") },
					{ id: 3, text: "Clever Cup", img: () => keyItem("clever-cup") },
					{ id: 4, text: "Tough Cup", img: () => keyItem("tough-cup") },
					{ id: 5, text: "Cute Cup", img: () => keyItem("cute-cup") },
					{ id: 6, text: "Blue Crystal", img: () => keyItem("blue-crystal") },
					{ id: 7, text: "Pink Crystal", img: () => keyItem("pink-crystal") },
					{ id: 8, text: "Red Crystal", img: () => keyItem("red-crystal") },
					{ id: 9, text: "Yellow Crystal", img: () => keyItem("yellow-crystal") },
					{ id: 10, text: "Gym Statue", img: () => keyItem("gym-statue") },
					{ id: 11, text: "Globe", img: () => keyItem("globe") },
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
					{ id: 5, text: "HM05 (defog)", img: () => hm("normal") },
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
			{ id: 1, text: "Obtain Phione", img: ({ gameKey }) => baseSprite(gameKey, 489), },
			{ id: 2, text: "Obtain Manaphy", img: ({ gameKey }) => baseSprite(gameKey, 490), },
			{ id: 3, text: "Obtain Darkrai", img: ({ gameKey }) => baseSprite(gameKey, 491), },
			{ id: 4, text: "Obtain Shaymin", img: ({ gameKey }) => baseSprite(gameKey, 492), },
			{ id: 5, text: "Obtain Arceus", img: ({ gameKey }) => baseSprite(gameKey, 493), },
		]
	};

	defineTasksMany(GAME_KEYS, SECTIONS, TASKS_BY_SECTION);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();