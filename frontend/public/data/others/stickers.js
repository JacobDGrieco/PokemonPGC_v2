// --- Ball Capsules (Stickers) ---------------------------------------------
(() => {
	const GAME_KEYS = ["brilliantdiamond", "shiningpearl"];

	// authoring wrapper (keeps the list clean)
	const sticker = (name) => _sticker(name);

	const set = (id, label, letters, prefix) => ({
		id, label, img: sticker(`${prefix}-a`),
		forms: letters.map((ch) => ({ name: ch, img: sticker(`${prefix}-${ch.toLowerCase()}`), })),
	});

	function buildStickersFor(/*gameKey*/) {
		return [
			set("heart", "Heart Stickers", ["A", "B", "C", "D", "E", "F"], "heart-sticker"),
			set("star", "Star Stickers", ["A", "B", "C", "D", "E", "F"], "star-sticker"),
			set("ribbon", "Ribbon Stickers", ["A", "B", "C", "D"], "ribbon-sticker"),
			set("smoke", "Smoke Stickers", ["A", "B", "C", "D"], "smoke-sticker"),
			set("electricity", "Electricity Stickers", ["A", "B", "C", "D"], "electricity-sticker"),
			set("bubble", "Bubble Stickers", ["A", "B", "C", "D"], "bubble-sticker"),

			// NOTE: your old file had img: heart-sticker-a for Fire; this fixes it to fire-sticker-a
			set("fire", "Fire Stickers", ["A", "B", "C", "D"], "fire-sticker"),

			set("party", "Party Stickers", ["A", "B", "C", "D"], "party-sticker"),
			set("flora", "Flora Stickers", ["A", "B", "C", "D", "E", "F"], "flora-sticker"),
			set("song", "Song Stickers", ["A", "B", "C", "D", "E", "F", "G"], "song-sticker"),
			set("sinister", "Sinister Stickers", ["A", "B", "C"], "sinister-sticker"),

			// keeping your label spelling as-is ("Etherial") even though prefix is "ethereal-"
			set("ethereal", "Etherial Stickers", ["A", "B", "C"], "ethereal-sticker"),

			set("cool", "Cool Stickers", ["A", "B", "C"], "cool-sticker"),
			set("burning", "Burning Stickers", ["A", "B", "C"], "burning-sticker"),
			set("sky", "Sky Stickers", ["A", "B", "C"], "sky-sticker"),
			set("stone", "Stone Stickers", ["A", "B", "C"], "stone-sticker"),
			set("leaf", "Leaf Stickers", ["A", "B", "C"], "leaf-sticker"),
			set("spark", "Spark Stickers", ["A", "B", "C"], "spark-sticker"),

			set("coolness", "Coolness Stickers", ["A", "B", "C", "D"], "coolness-sticker"),
			set("beauty", "Beauty Stickers", ["A", "B", "C", "D"], "beauty-sticker"),
			set("cleverness", "Cleverness Stickers", ["A", "B", "C", "D"], "cleverness-sticker"),
			set("toughness", "Toughness Stickers", ["A", "B", "C", "D"], "toughness-sticker"),
			set("cuteness", "Cuteness Stickers", ["A", "B", "C", "D"], "cuteness-sticker"),
		];
	}

	defineStickersMany(GAME_KEYS, (gameKey) => buildStickersFor(gameKey));
})();
