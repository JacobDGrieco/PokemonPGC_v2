// Last entry was PokePark Mew 5/10/2006 for JPN distros

window.DATA = window.DATA || {};
window.DATA.distributions = window.DATA.distributions || {};

const gen = "9_2";
const GAME_KEYS = ["legendsza"];

const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
const shinySprite = (gameKey, natiId) => _frontSpriteShiny(gen, gameKey, natiId);
const task = (gameKey, name) => _task(gameKey, name);
const berry = (name) => _berry(gen, name);
const ball = (name) => _ball(gen, name);
const ribbon = (name) => _ribbon(gen, name);
const item = (id) => _item(gen, id);

defineDistributionsMany(GAME_KEYS, (gameKey) => [
	{
		eventTitle: "Digital Pre-Order Bonus",
		region: ["Region Free"],
		img: () => ball("pokeball"),
		"start-date": "2025-10-16",
		tid: "",
		details: "100x Pokeballs",
		extra: ["You would get the code in your email", "Must have Pre-Ordered Pokémon Legends: Z-A through Nintendo.com or the Nintendo Switch/Switch2 eShop"],
	},
	{
		eventTitle: "Pre-Order Bonus - Item Set",
		region: ["JPN", "SGP"],
		img: ({ gameKey }) => task(gameKey, "item-box"),
		"start-date": "2025-10-16",
		tid: "",
		details: "20x Super Potions, 5x Revives, 3x Full Heals, 1x Rare Candy",
		extra: ["You would get a card with a code", "Must have Pre-Ordered Pokémon Legends: Z-A through 7-11 (Japan) or Toys 'R' Us (Singapore)"],
	},
	{
		eventTitle: "Pre-Order Bonus - Trench Coat",
		region: ["JPN", "USA", "AUS", "UK"],
		img: ({ gameKey }) => task(gameKey, "trenchcoat"),
		"start-date": "2025-10-16",
		tid: "",
		details: "Trench Coat & Pants Set - Beige",
		extra: ["You would get a card with a code", "Must have Pre-Ordered Pokémon Legends: Z-A through Amazon (Japan), GameStop (USA), EB Games (Australia), or Game/ShopTo (UK)"],
	},
	{
		eventTitle: "DLC Pre-Order Bonus - Apricorn Balls",
		region: ["Region Free"],
		"start-date": "2025-10-16",
		"end-date": "2026-02-28",
		tid: "",
		details: "1x Lure Ball, 1x Fast Ball, 1x Level Ball, 1x Heavy Ball",
		extra: ["You would get the code in your email", "Must have purchased the Mega Dimensions DLC"],
	},
	{
		eventTitle: "Early Purchase Ralts",
		region: ["Region Free"],
		name: "Ralts",
		img: ({ gameKey }) => baseSprite(gameKey, 280),
		gender: "female",
		"start-date": "2025-10-16",
		"end-date": "2026-02-28",
		ball: { name: "Poké Ball", img: () => ball("pokeball") },
		level: 6,
		tid: "",
		heldItem: [{ name: "Gardevoirite", img: () => megaStone("gardevoirite") },],
		moves: [
			{ name: "Disarming Voice", type: "Fairy" },
			{ name: "Confusion", type: "Psychic" },
			{ name: "Growl", type: "Normal" },
			{ name: "Swift", type: "Normal" },
		],
		extra: "Go to Link Play → Mystery Gift → Get via Internet",
	},
	{
		eventTitle: "Pokémon Center Kagawa Opening",
		region: ["JPN"],
		name: "ヤドン",
		gender: "both",
		"start-date": "2025-10-16",
		"end-date": "2026-02-28",
		ball: { name: "Poké Ball", img: () => ball("pokeball") },
		ribbons: [{ name: "Classic Ribbon", img: () => ribbon("classic") }],
		img: ({ gameKey }) => baseSprite(gameKey, 79),
		level: 5,
		ot: ["PokéCenter", "ポケセン"],
		tid: "251024",
		moves: [
			{ name: "Calm Mind", type: "Psychic" },
			{ name: "Surf", type: "Water" },
			{ name: "Growl", type: "Normal" },
			{ name: "Safeguard", type: "Normal" }
		],
		details: "Get a code from a Pokémon Center Store in Japan",
		extra: ["Need to \"imitate a Slowpoke\""]
	},
	{
		eventTitle: "Pokémon Center Birthday Distribution",
		region: ["JPN"],
		name: "タブンネ",
		gender: "both",
		"start-date": "2025-11-01",
		"end-date": "2026-10-31",
		ball: { name: "Poké Ball", img: () => ball("pokeball") },
		ribbons: [{ name: "Classic Ribbon", img: () => ribbon("birthday") }],
		img: ({ gameKey }) => baseSprite(gameKey, 531),
		level: 5,
		ot: ["PokéCenter", "ポケセン"],
		tid: "251101",
		moves: [
			{ name: "Growl", type: "Normal" },
			{ name: "Disarming Voice", type: "Fairy" },
			{ name: "Wish", type: "Normal" },
			{ name: "Safeguard", type: "Normal" }
		],
		details: "Get a code from a Pokémon Center Store in Japan, Singapore, or Taiwan",
		extra: ["Go during your birth month and show them your Nintendo Switch/Switch 2"]
	},
	{
		eventTitle: "Alpha Charizard",
		region: ["Region Free"],
		name: "Charizard",
		gender: "both",
		"start-date": "2025-12-09",
		"end-date": "2026-01-19",
		ball: { name: "Cherish Ball", img: () => ball("cherishball") },
		ribbons: [{ name: "Classic Ribbon", img: () => ribbon("classic") }],
		img: ({ gameKey }) => baseSprite(gameKey, 6),
		alpha: true,
		level: 36,
		ot: [""],
		tid: "",
		ability: ["Solar Power"],
		moves: [
			{ name: "Solar Beam", type: "Grass" },
			{ name: "Flamethrower", type: "Fire" },
			{ name: "Dragon Claw", type: "Dragon" },
			{ name: "Air Slash", type: "Flying" }
		],
		extra: ["Go to Link Play → Mystery Gift → Get via Code / Password", "Use code B1G0006"]
	},
	// {
	//   eventTitle: "Early Purchase Ralts",
	// 	 region: "Region Free",
	//   name: "Ralts",
	//   gender: "female",
	//   "start-date": "2025-10-16",
	//   "end-date": "2026-02-28",
	//   ball: { name: "Poké Ball", img: () => "imgs/balls/gen9/legendsza/pokeball.png" },
	//   ribbons: [{ name: "Classic Ribbon", img: () => "imgs/ribbons/classic.png" }],
	//   img: () => "imgs/sprites/gen9/legendsza/base-icons/280.png",
	// 	 shiny: true,
	//   level: 6,
	//   ot: "",
	//   tid: "",
	//   ability: "",
	//   nature: "",
	//   heldItem: [{ name: "Gardevoirite", img: () => megaStone("gardevorite") }],
	//   moves: [
	//     { name: "Disarming Voice", type: "Fairy" },
	//     { name: "Confusion", type: "Psychic" },
	//     { name: "Growl", type: "Normal" },
	//     { name: "Swift", type: "Normal" }
	//   ],
	//   details: "Connect to the internet and Internet Events",
	//   extra: []
	// },
]);