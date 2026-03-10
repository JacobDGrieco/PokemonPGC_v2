// Top level data setup
PPGC.register({
	// Top-level gen tabs (all are checklists)
	tabs: [
		{ key: "gen1", label: "Gen 1" },
		{ key: "gen2", label: "Gen 2" },
		{ key: "gen3", label: "Gen 3" },
		{ key: "gen4", label: "Gen 4" },
		{ key: "gen5", label: "Gen 5" },
		{ key: "gen6", label: "Gen 6" },
		{ key: "gen7", label: "Gen 7" },
		{ key: "gen7_2", label: "Gen 7 - Part 2" },
		{ key: "gen8", label: "Gen 8" },
		{ key: "gen8_2", label: "Gen 8 - Part 2" },
		{ key: "gen9", label: "Gen 9" },
		{ key: "gen9_2", label: "Gen 9 - Part 2" },
		{ key: "home", label: "HOME" },
	],

	games: {
		gen1: [
			{
				key: "red",
				label: "Red",
				color: "#cc0000",
				flags: ["caught", "seen", "unknown"],
				completionFlags: ["caught"],
			},
			{
				key: "blue",
				label: "Blue",
				color: "#3c78d8",
				flags: ["caught", "seen", "unknown"],
				completionFlags: ["caught"],
			},
			{
				key: "yellow",
				label: "Yellow",
				color: "#f1c232",
				flags: ["caught", "seen", "unknown"],
				completionFlags: ["caught"],
			},
		],
		gen2: [
			{
				key: "gold",
				label: "Gold",
				color: "#ff9900",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "silver",
				label: "Silver",
				color: "#cccccc",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "crystal",
				label: "Crystal",
				color: "#cfe2f3",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
		],
		gen3: [
			{
				key: "ruby",
				label: "Ruby",
				color: "#ff0000",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "sapphire",
				label: "Sapphire",
				color: "#1155cc",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "firered",
				label: "FireRed",
				color: "#cc0000",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "leafgreen",
				label: "LeafGreen",
				color: "#38761d",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "emerald",
				label: "Emerald",
				color: "#93c47d",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
		],
		gen4: [
			{
				key: "diamond",
				label: "Diamond",
				color: "#00ffff",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "pearl",
				label: "Pearl",
				color: "#a2c4c9",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "platinum",
				label: "Platinum",
				color: "#999999",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "heartgold",
				label: "HeartGold",
				color: "#ff9900",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "soulsilver",
				label: "SoulSilver",
				color: "#cccccc",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
		],
		gen5: [
			{
				key: "black",
				label: "Black",
				color: "#434343",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "white",
				label: "White",
				color: "#efefef",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "black2",
				label: "Black 2",
				color: "#434343",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "white2",
				label: "White 2",
				color: "#efefef",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
		],
		gen6: [
			{
				key: "x",
				label: "X",
				color: "#3d85c6",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "y",
				label: "Y",
				color: "#cc3232",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "omegaruby",
				label: "Omega Ruby",
				color: "#ff0000",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "alphasapphire",
				label: "Alpha Sapphire",
				color: "#1155cc",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
		],
		gen7: [
			{
				key: "sun",
				label: "Sun",
				color: "#f5ad58",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "moon",
				label: "Moon",
				color: "#674ea7",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "ultrasun",
				label: "Ultra Sun",
				color: "#f5ad58",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "ultramoon",
				label: "Ultra Moon",
				color: "#674ea7",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
		],
		gen7_2: [
			{
				key: "letsgopikachu",
				label: "Let's Go, Pikachu!",
				color: "#ffff00",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "letsgoeevee",
				label: "Let's Go, Eevee!",
				color: "#b45f06",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
		],
		gen8: [
			{
				key: "sword",
				label: "Sword",
				color: "#0b5394",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "swordioa",
				label: "Sword (IoA)",
				color: "#c5980f",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "swordct",
				label: "Sword (CT)",
				color: "#0c343d",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "shield",
				label: "Shield",
				color: "#ee4444",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "shieldioa",
				label: "Shield (IoA)",
				color: "#c5980f",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "shieldct",
				label: "Shield (CT)",
				color: "#0c343d",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
		],
		gen8_2: [
			{
				key: "brilliantdiamond",
				label: "Brilliant Diamond",
				color: "#00ffff",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "shiningpearl",
				label: "Shining Pearl",
				color: "#a2c4c9",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "legendsarceus",
				label: "Legends: Arceus",
				color: "#999999",
				flags: ["shiny alpha", "alpha", "shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny alpha", "alpha", "shiny", "caught"],
			},
		],
		gen9: [
			{
				key: "scarlet",
				label: "Scarlet",
				color: "#ff2400",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "scarlettm",
				label: "Scarlet (TM)",
				color: "#008080",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "scarletid",
				label: "Scarlet (ID)",
				color: "#4b0082",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "violet",
				label: "Violet",
				color: "#8f00ff",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "violettm",
				label: "Violet (TM)",
				color: "#008080",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
			{
				key: "violetid",
				label: "Violet (ID)",
				color: "#4b0082",
				flags: ["shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny", "caught"],
			},
		],
		gen9_2: [
			{
				key: "legendsza",
				label: "Legends: Z-A",
				color: "#64f29b",
				flags: ["shiny alpha", "alpha", "shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny alpha", "alpha", "shiny", "caught"],
			},
			{
				key: "legendszamd",
				label: "Legends: Z-A (MD)",
				color: "#64f29b",
				flags: ["shiny alpha", "alpha", "shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny alpha", "alpha", "shiny", "caught"],
			},
		],
		home: [
			{
				key: "home",
				label: "HOME",
				color: "#64f29b",
				flags: ["shiny alpha", "alpha", "shiny", "caught", "seen", "unknown"],
				completionFlags: ["shiny alpha", "alpha", "shiny", "caught"],
			},
		],
	},

	layoutVariants: {
		desktop: {
			gameRows: {
				gen1: [["red", "blue", "yellow"]],
				gen2: [["gold", "silver", "crystal"]],
				gen3: [
					["ruby", "sapphire"],
					["firered", "leafgreen"],
					["emerald"]
				],
				gen4: [
					["diamond", "pearl", "platinum"],
					["heartgold", "soulsilver"],
				],
				gen5: [
					["black", "white"],
					["black2", "white2"],
				],
				gen6: [
					["x", "y"],
					["omegaruby", "alphasapphire"],
				],
				gen7: [
					["sun", "moon"],
					["ultrasun", "ultramoon"],
				],
				gen7_2: [["letsgopikachu", "letsgoeevee"]],
				gen8: [
					["sword", "swordioa", "swordct"],
					["shield", "shieldioa", "shieldct"],
				],
				gen8_2: [["brilliantdiamond", "shiningpearl", "legendsarceus"]],
				gen9: [
					["scarlet", "scarlettm", "scarletid"],
					["violet", "violettm", "violetid"],
				],
				gen9_2: [["legendsza", "legendszamd"]],
				home: [["home"]],
			},
		},
		compact: {
		}
	},

	marks: {
		shiny: "imgs/icons/pokemon_home/shiny.png",
		alpha: "imgs/icons/pokemon_home/alpha.png",
		gigantamax: "imgs/icons/pokemon_home/gigantamax.png",
	},
	marksByGame: {
		gold: {
			shiny: "imgs/icons/gen2/shiny.png",
		},
		silver: {
			shiny: "imgs/icons/gen2/shiny.png",
		},
		crystal: {
			shiny: "imgs/icons/gen2/shiny.png",
		},
		ruby: {
			shiny: "imgs/icons/gen3/shiny.png",
		},
		sapphire: {
			shiny: "imgs/icons/gen3/shiny.png",
		},
		firered: {
			shiny: "imgs/icons/gen3/shiny.png",
		},
		leafgreen: {
			shiny: "imgs/icons/gen3/shiny.png",
		},
		emerald: {
			shiny: "imgs/icons/gen3/shiny.png",
		},
		diamond: {
			shiny: "imgs/icons/gen4/shiny.png",
		},
		pearl: {
			shiny: "imgs/icons/gen4/shiny.png",
		},
		platinum: {
			shiny: "imgs/icons/gen4/shiny.png",
		},
		heartgold: {
			shiny: "imgs/icons/gen4/shiny.png",
		},
		soulsilver: {
			shiny: "imgs/icons/gen4/shiny.png",
		},
		black: {
			shiny: "imgs/icons/gen5/shiny.png",
		},
		white: {
			shiny: "imgs/icons/gen5/shiny.png",
		},
		black2: {
			shiny: "imgs/icons/gen5/shiny.png",
		},
		white2: {
			shiny: "imgs/icons/gen5/shiny.png",
		},
		x: {
			shiny: "imgs/icons/gen6/shiny.png",
		},
		y: {
			shiny: "imgs/icons/gen6/shiny.png",
		},
		omegaruby: {
			shiny: "imgs/icons/gen6/shiny.png",
		},
		alphasapphire: {
			shiny: "imgs/icons/gen6/shiny.png",
		},
		sun: {
			shiny: "imgs/icons/gen7/shiny2.png",
		},
		moon: {
			shiny: "imgs/icons/gen7/shiny2.png",
		},
		ultrasun: {
			shiny: "imgs/icons/gen7/shiny2.png",
		},
		ultramoon: {
			shiny: "imgs/icons/gen7/shiny2.png",
		},
		letsgopikachu: {
			shiny: "imgs/icons/gen7/shiny-lgpe.png",
		},
		letsgoeevee: {
			shiny: "imgs/icons/gen7/shiny-lgpe.png",
		},
		sword: {
			shiny: "imgs/icons/gen8/shiny.png",
		},
		shield: {
			shiny: "imgs/icons/gen8/shiny.png",
		},
		brilliantdiamond: {
			shiny: "imgs/icons/gen8/shiny.png",
		},
		shiningpearl: {
			shiny: "imgs/icons/gen8/shiny.png",
		},
		legendsarceus: {
			shiny: "imgs/icons/gen8/shiny.png",
		},
		scarlet: {
			shiny: "imgs/icons/gen9/shiny.png",
		},
		violet: {
			shiny: "imgs/icons/gen9/shiny.png",
		},
		legendsza: {
			shiny: "imgs/icons/gen9/shiny.png",
		},
		home: {
			shiny: "imgs/icons/pokemon_home/shiny.png",
			alpha: "imgs/icons/pokemon_home/alpha.png",
		},
	},
	spacer: {
		id: "spacer",
		text: "",
		hidden: true,
	},
});
