import {
  buildFashionFor,
  defineFashionMany,
  _fashionItem,
} from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["x", "y"];

	// local wrapper (binds to helpers.js global)
	const fashionItem = (gameKey, gender, category, name) => _fashionItem(gameKey, gender, category, name);

	const CATEGORIES = [
		{ id: "hats", label: "Hats" },
		{ id: "tops", label: "Tops" },
		{ id: "trousers", label: "Trousers" },
		{ id: "dresses", label: "Dresses" },
		{ id: "socks", label: "Socks" },
		{ id: "shoes", label: "Shoes" },
		{ id: "bags", label: "Bags" },
		{ id: "accessories", label: "Accessories" }
	];

	// Fashion data authoring format:
	// - item.id stays a slug (e.g. "boater")
	// - item.forms[].id is numeric (e.g. 1), and helpers format it to "hats:boater:001"
	const ITEMS_BY_CATEGORY = {
		"hats": [
			{ id: 1, name: "Bamboo Sprig Hat", gender: "male" },
			{
				id: 2, name: "Boater", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Red" }
				],
			},
			{
				id: 3, name: "Camo Cap", gender: "male", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Olive" }
				],
			},
			{
				id: 4, name: "Cycling Cap", gender: "female", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "White" }
				],
			},
			{
				id: 5, name: "Exotic Cap", gender: "female", forms: [
					{ id: 1, name: "Brown" },
					{ id: 2, name: "Purple" }
				],
			},
			{
				id: 6, name: "Fedora", gender: "male", forms: [
					{ id: 1, name: "Checkered Black" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Red" }
				],
			},
			{
				id: 7, name: "Fedora", gender: "female", forms: [
					{ id: 1, name: "Brown" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Purple" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "White" },
					{ id: 6, name: "Yellow" }
				],
			},
			{
				id: 8, name: "Felt Hat", gender: "female", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Beige" },
					{ id: 3, name: "Black" },
					{ id: 4, name: "Brown" },
					{ id: 5, name: "Gray" },
					{ id: 6, name: "Navy Blue" },
					{ id: 7, name: "Pale Pink" },
					{ id: 8, name: "Red" },
					{ id: 9, name: "White" }
				],
			},
			{
				id: 9, name: "Knit Cap", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Purple" },
					{ id: 4, name: "White" }
				],
			},
			{
				id: 10, name: "Logo Cap", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Red" }
				],
			},
			{
				id: 11, name: "Logo Cap", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Pink" }
				],
			},
			{
				id: 12, name: "Outdoors Cap", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Olive" },
					{ id: 4, name: "Red" }
				],
			},
			{
				id: 13, name: "Sports Cap", gender: "female", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Yellow" }
				],
			}
		],
		"tops": [
			{
				id: 1, name: "Down Jacket", gender: "male", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Red" }
				],
			},
			{
				id: 2, name: "Exotic Top", gender: "female", forms: [
					{ id: 1, name: "Lime Green" },
					{ id: 2, name: "Orange" }
				],
			},
			{ id: 3, name: "Glitzy Scarf Top", gender: "female" },
			{
				id: 4, name: "Hoodie", gender: "male", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Olive" },
					{ id: 3, name: "Yellow" }
				],
			},
			{ id: 5, name: "King T-Shirt", gender: "male" },
			{
				id: 6, name: "Logo T-Shirt", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "White" },
					{ id: 5, name: "Yellow" }
				],
			},
			{
				id: 7, name: "Midriff Halter Top", gender: "female", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Orange" }
				],
			},
			{
				id: 8, name: "Plaid Shirt Combo", gender: "male", forms: [
					{ id: 1, name: "Gray" },
					{ id: 2, name: "Red" }
				],
			},
			{
				id: 9, name: "Poke Ball Baby Doll Tee", gender: "female", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Purple" },
					{ id: 4, name: "Yellow" }
				],
			},
			{
				id: 10, name: "Ribbon Smock Top", gender: "female", forms: [
					{ id: 1, name: "Brown" },
					{ id: 2, name: "Pale Pink" },
					{ id: 3, name: "Purple" },
					{ id: 4, name: "Yellow" }
				],
			},
			{
				id: 11, name: "Ruffled Camisole", gender: "female", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Pink" },
					{ id: 3, name: "Yellow" }
				],
			},
			{ id: 12, name: "Ruffled Tank Top", gender: "female" },
			{
				id: 13, name: "Scarf Top", gender: "female", forms: [
					{ id: 1, name: "Pale Pink" },
					{ id: 2, name: "Purple" },
					{ id: 3, name: "Yellow" }
				],
			},
			{
				id: 14, name: "Shirt and Tie", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Red" },
					{ id: 3, name: "Green" }
				],
			},
			{
				id: 15, name: "Short Parka", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Lime Green" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" }
				],
			},
			{
				id: 16, name: "Sleeveless Turtleneck", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" }
				],
			},
			{
				id: 17, name: "Splatter Paint T-Shirt", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Purple" },
					{ id: 3, name: "Red" }
				],
			},
			{
				id: 18, name: "Striped Shirt Combo", gender: "male", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Pink" },
					{ id: 3, name: "Purple" },
					{ id: 4, name: "Red" }
				],
			},
			{
				id: 19, name: "Striped Tank Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Pink" }
				],
			},
			{
				id: 20, name: "Tie-Neck Blouse", gender: "female", forms: [
					{ id: 1, name: "Gray" },
					{ id: 2, name: "Red" }
				],
			},
			{ id: 21, name: "Twin T-Shirt", gender: "male" },
			{
				id: 22, name: "V-Neck T-Shirt", gender: "male", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "White" }
				],
			},
			{
				id: 23, name: "Zipped Jacket", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Orange" },
					{ id: 6, name: "Red" }
				],
			},
			{
				id: 24, name: "Zipped Shirt Combo", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" }
				],
			}
		],
		"trousers": [
			{
				id: 1, name: "Accented Jeans", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Lime Green" },
					{ id: 3, name: "Red" },
					{ id: 4, name: "Yellow" }
				],
			},
			{
				id: 2, name: "Bold Striped Pants", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" }
				],
			},
			{
				id: 3, name: "Camo Pants", gender: "male", forms: [
					{ id: 1, name: "Gray" },
					{ id: 2, name: "Green" }
				],
			},
			{
				id: 4, name: "Checked Pants", gender: "male", forms: [
					{ id: 1, name: "Gray" },
					{ id: 2, name: "Red" }
				],
			},
			{
				id: 5, name: "Chinos", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" }
				],
			},
			{
				id: 6, name: "Cross-Laced Shorts", gender: "female", forms: [
					{ id: 1, name: "Brown" },
					{ id: 2, name: "Olive" }
				],
			},
			{ id: 7, name: "Cuffed Jeans", gender: "male" },
			{ id: 8, name: "Damaged Jeans", gender: "male" },
			{ id: 9, name: "Damaged Jean Shorts", gender: "female" },
			{ id: 10, name: "Damaged Skinny Jeans", gender: "female" },
			{
				id: 11, name: "Denim Miniskirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Olive" }
				],
			},
			{
				id: 12, name: "Jean Shorts", gender: "female", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Brown" },
					{ id: 4, name: "Gray" },
					{ id: 5, name: "Orange" },
					{ id: 6, name: "Pink" },
					{ id: 7, name: "White" }
				],
			},
			{
				id: 13, name: "Jean Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Red" }
				],
			},
			{
				id: 14, name: "Pleated Skirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Red" },
					{ id: 4, name: "White" }
				],
			},
			{
				id: 15, name: "Scalloped Skirt", gender: "female", forms: [
					{ id: 1, name: "Orange" },
					{ id: 2, name: "Red" }
				],
			},
			{
				id: 16, name: "Scalloped Tiered Skirt", gender: "female", forms: [
					{ id: 1, name: "Pink" },
					{ id: 2, name: "White" },
					{ id: 3, name: "Yellow" }
				],
			},
			{
				id: 17, name: "Short Cargo Pants", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Olive" },
					{ id: 3, name: "Purple" }
				],
			},
			{
				id: 18, name: "Skinny Jeans", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Brown" },
					{ id: 4, name: "Red" }
				],
			},
			{
				id: 19, name: "Skinny Jeans", gender: "female", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Beige" },
					{ id: 3, name: "Black" },
					{ id: 4, name: "Blue" },
					{ id: 5, name: "Olive" },
					{ id: 6, name: "Red" },
					{ id: 7, name: "White" }
				],
			},
			{
				id: 20, name: "Striped Pleated Skirt", gender: "female", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Pink" },
					{ id: 3, name: "Yellow" }
				],
			},
			{
				id: 21, name: "Tiered Satin Skirt", gender: "female", forms: [
					{ id: 1, name: "Purple" },
					{ id: 2, name: "White" }
				],
			},
			{
				id: 22, name: "Vinyl Pants", gender: "male"
			}
		],
		"dresses": [
			{ id: 1, name: "Double-Front Coat Dress", gender: "female" },
			{ id: 2, name: "Frilly Dress", gender: "female" },
			{
				id: 3, name: "High-Waisted Outfit", gender: "female", forms: [
					{ id: 1, name: "Black / Red" },
					{ id: 2, name: "White / Blue" }
				],
			},
			{ id: 4, name: "Little Black Dress", gender: "female" },
			{ id: 5, name: "Single-Front Coat Dress", gender: "female" },
			{ id: 6, name: "Sparkly Bolero Dress", gender: "female" },
			{ id: 7, name: "Sundae Dress", gender: "female" },
			{
				id: 8, name: "Trench Coat Dress", gender: "female", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" }
				],
			}
		],
		"socks": [
			{
				id: 1, name: "Ankle Socks", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Purple" },
					{ id: 4, name: "Red" }
				],
			},
			{ id: 2, name: "Camo OTK Socks", gender: "female" },
			{
				id: 3, name: "Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" }
				],
			},
			{ id: 4, name: "Leggings", gender: "female" },
			{
				id: 5, name: "OTK Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Pink" },
					{ id: 6, name: "Red" },
					{ id: 7, name: "White" }
				],
			},
			{ id: 6, name: "Punk OTK Socks", gender: "female" },
			{ id: 7, name: "Single-Stripe OTK Socks", gender: "female" },
			{
				id: 8, name: "Tights", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Navy Blue" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pale Pink" },
					{ id: 5, name: "Pink" },
					{ id: 6, name: "Purple" }
				],
			},
			{
				id: 9, name: "Wide-Stripe OTK Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Pale Pink" }
				],
			}
		],
		"shoes": [
			{
				id: 1, name: "Bow Shoes", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown" }
				],
			},
			{
				id: 2, name: "High Tops", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Pink" },
					{ id: 3, name: "Purple" },
					{ id: 4, name: "Yellow" }
				],
			},
			{
				id: 3, name: "Bow Shoes", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown" }
				],
			},
			{
				id: 4, name: "Loafers", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown" }
				],
			},
			{
				id: 5, name: "Mary Jane Shoes", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Pink" },
					{ id: 3, name: "Purple" },
					{ id: 4, name: "Yellow" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" }
				],
			},
			{
				id: 6, name: "Mary Jane Shoes", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "White" }
				],
			},
			{
				id: 7, name: "Bow Shoes", gender: "female", forms: [
					{ id: 1, name: "Brown" },
					{ id: 2, name: "Navy Blue" },
					{ id: 3, name: "White" }
				],
			},
			{
				id: 8, name: "Short Boots", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown" },
					{ id: 3, name: "Red" }
				],
			},
			{
				id: 9, name: "Sneakers", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown" },
					{ id: 3, name: "Red" },
					{ id: 4, name: "White" },
					{ id: 5, name: "Yellow" }
				],
			},
			{
				id: 10, name: "Zipped Boots", gender: "female"
			}
		],
		"bags": [
			{
				id: 1, name: "Enamel-Striped Purse", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Red" }
				],
			},
			{
				id: 2, name: "Ribbon Purse", gender: "female", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Pale Pink" }
				],
			},
			{
				id: 3, name: "Strappy Purse", gender: "female", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Brown" },
					{ id: 4, name: "Purple" },
					{ id: 5, name: "White" }
				],
			},
			{
				id: 4, name: "Tassel Purse", gender: "female", forms: [
					{ id: 1, name: "Green" },
					{ id: 2, name: "Purple" }
				],
			},
			{
				id: 5, name: "Tote Bag", gender: "female", forms: [
					{ id: 1, name: "Pink" },
					{ id: 2, name: "Red" },
					{ id: 3, name: "White" },
					{ id: 4, name: "Yellow" }
				],
			},
			{
				id: 6, name: "Two-Tone Bag", gender: "male", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Olive" },
					{ id: 4, name: "Orange" },
					{ id: 5, name: "Red" }
				],
			},
			{
				id: 7, name: "Vinyl Messenger Bag", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown" }
				],
			}
		],
		"accessories": [
			{
				id: 1, name: "Artificial Flower Pin", gender: "female", forms: [
					{ id: 1, name: "Aqua" },
					{ id: 2, name: "Pale Pink" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Yellow" }
				],
			},
			{
				id: 2, name: "Button Accessory", gender: "unisex", forms: [
					{ id: 1, name: "Gray" },
					{ id: 2, name: "Lime Green" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Purple" },
					{ id: 5, name: "Yellow" }
				],
			},
			{
				id: 3, name: "Feather Accessory", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Red" }
				],
			},
			{
				id: 4, name: "Hat Ribbon Accessory", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Pale Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "White" }
				],
			},
			{
				id: 5, name: "Metal Pin", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Gold" },
					{ id: 3, name: "Silver" }
				],
			},
			{
				id: 6, name: "Wide-Frame Sunglasses", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Red" },
					{ id: 3, name: "White" },
					{ id: 4, name: "Yellow" }
				],
			},
			{
				id: 7, name: "Wide-Frame Sunglasses", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Red" },
					{ id: 3, name: "White" },
					{ id: 4, name: "Yellow" }
				],
			}
		]
	};

	defineFashionMany(GAME_KEYS, () => buildFashionFor(CATEGORIES, ITEMS_BY_CATEGORY));
})();
