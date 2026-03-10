
const ITEM = ["apricorns", "balls", "berries", "decorations", "form-items", "fossils", "held-items", "key-items", "mails", "medicines", "mega-stones", "partner-gifts", "stat-items", "hms", "tms", "trs", "treasures", "usable-items", "zcrystals"];
window._imageByGen = function (type, genKey, name) {
	const prefix = ITEM.includes(type) ? "items" : "";
	if (type === "hms" || type === "tms" || type === "trs") type = `thms/${type}`;

	let gen = "";
	switch (genKey) {
		case 1:
		case 2:
		case 3:
			if (type !== "thms/tms" && type !== "thms/hms") { gen = "gen1-3"; break; }
		case 4:
			if (type === "key-items" || type === "mails") { gen = "gen4"; break; }
		case 5:
			if (type === "key-items" || type === "mails") { gen = "gen5"; break; }
			if (type === "thms/tms" || type === "thms/hms") { gen = "gen1-5"; break; }
		case 6:
			if (type === "key-items") { gen = "gen6"; break; }
		case 7:
			if (type === "key-items") { gen = "gen7"; break; }
		case 8:
			if (type === "key-items") { gen = "gen8"; break; }
			if (type === "thms/tms" || type === "thms/hms") { gen = "gen6-8"; break; }
			else gen = "gen4-8/"; break;
		case 7.5:
		case "7_2":
			if (type === "berries" || type === "key-items") { gen = "gen7_2"; break; }
			else gen = "gen4-8"; break;
		case 8.5:
		case "8_2": gen = "gen8_2"; break;
		case 9: gen = "gen9"; break;
		case 9.5:
		case "9_2": gen = "gen9_2"; break;
		case "home": gen = "home"; break;
		case 0:
		default: gen = "";
	}

	return _assetPath(`${prefix}/${type}/${gen}/${name}.png`);
};
window._imageByGame = function (type, gameKey, name, bwORc) {
	if (type && type[type.length - 1] !== 's') type = type + 's';

	let game = "";
	switch (gameKey) {
		// Gen 1:
		case "red":
		case "blue":
			game = "gen1/red-blue/" + (!bwORc ? "bw" : "colored"); break;
		case "yellow":
			game = "gen1/yellow/" + (!bwORc ? "bw" : "colored"); break;

		// Gen 2
		case "gold":
			game = "gen2/gold"; break;
		case "silver":
			game = "gen2/silver"; break;
		case "crystal":
			game = "gen2/crystal"; break;

		// Gen 3
		case "ruby":
		case "sapphire":
		case "emerald":
			game = "gen3/ruby-sapphire-emerald"; break;
		case "firered":
		case "leafgreen":
			game = "gen3/firered-leafgreen"; break;

		// Gen 4
		case "diamond":
		case "pearl":
		case "platinum":
			game = "gen4/diamond-pearl-platinum"; break;
		case "heartgold":
		case "soulsilver":
			game = "gen4/heartgold-soulsilver"; break;

		// Gen 5
		case "black":
		case "white":
		case "black2":
		case "white2":
			game = "gen5"; break;

		// Gen 6
		case "x":
		case "y":
			game = "gen6/xy"; break;
		case "omegaruby":
		case "alphasapphire":
			game = "gen6/omegaruby-alphasapphire"; break;

		// Gen 7
		case "sun":
		case "moon":
		case "ultrasun":
		case "ultramoon":
			game = "gen7/sun-moon-ultra"; break;

		// Gen 7 Part 2
		case "letsgopikachu":
		case "letsgoeevee":
			game = "gen7_2"; break;

		// Gen 8
		case "sword":
		case "swordioa":
		case "swordct":
		case "shield":
		case "shieldioa":
		case "shieldct":
			game = "gen8/sword-shield"; break;

		// Gen 8 Part 2
		case "brilliantdiamond":
		case "shiningpearl":
			game = "gen8_2/brilliantdiamond-shiningpearl"; break;
		case "legendsarceus":
			game = "gen8_2/legendsarceus"; break;

		// Gen 9
		case "scarlet":
		case "scarlettm":
		case "scarletid":
		case "violet":
		case "violettm":
		case "violetid":
			game = "gen9/scarlet-violet"; break;

		// Gen 9 Part 2
		case "legendsza":
		case "legendszamd":
			game = "gen9_2"; break;

		// HOME
		case "home":
			game = "home"; break;
		default:
			game = "";
	}

	return _assetPath(`${type}/${game}/${name}.png`);
};
window._ribbonByGen = function (genKey, name) {
	let gen = "";
	switch (genKey) {
		case 1:
		case 2:
		case 3: gen = "gen3"; break;
		case 4:
		case 5: gen = "gen4-5"; break;
		case 6:
		case 7:
		case 7.5:
		case "7_2": gen = "gen6-7"; break;
		case 8:
		case 8.5:
		case "8_2":
		case 9:
		case 9.5:
		case "9_2":
		case "home": gen = "gen8-9"; break;
		case 0:
		default: gen = "";
	}

	return _assetPath(`ribbons/${gen}/${name}.png`);
};

// For BDSP and LA, add bdsp/ or legendsarceus/ to the name
window._ball = (gen, name) => _imageByGen("balls", gen, name);
window._berry = (gen, name) => _imageByGen("berries", gen, name);
window._decoration = (gen, name) => _imageByGen("decorations", gen, name);
window._formItem = (gen, name) => _imageByGen("form-items", gen, name);
window._fossil = (gen, name) => _imageByGen("fossils", gen, name);
window._heldItem = (gen, name) => _imageByGen("held-items", gen, name);
window._hm = (gen, name) => _imageByGen("hms", gen, name);
window._keyItem = (gen, name) => _imageByGen("key-items", gen, name);
window._mail = (name) => _imageByGen("mails", 0, name);
window._medicine = (name) => _imageByGen("medicines", 0, name);
window._megaStone = (gen, name) => _imageByGen("mega-stones", gen, name);
window._partnerItem = (name) => _imageByGen("partner-items", 0, name);
window._ribbon = (gen, name) => _ribbonByGen(gen, name);
window._statItems = (gen, name) => _imageByGen("stat-items", gen, name);
window._tm = (gen, name) => _imageByGen("tms", gen, name);
window._tr = (gen, name) => _imageByGen("trs", 0, name);
window._treasure = (gen, name) => _imageByGen("treasures", gen, name);
window._zCrystal = (name) => _imageByGen("zcrystals", 0, name);

window._location = (game, name) => _imageByGame("locations", game, name);
window._npc = (game, name) => _imageByGame("npcs", game, name);
window._sticker = (name) => _imageByGame("stickers", "", name);
window._task = (game, name, ...args) => _imageByGame("tasks", game, name, ...args);

window._badges = function (imgs) {
	if (!Array.isArray(imgs)) imgs = [imgs]; // allow single string too
	return imgs.map((name) => _assetPath(`badges/${name}.png`));
};
window._medal = function (type, name) {
	return _assetPath(`medals/${type}/${name}.png`);
};
window._typing = function (type) {
	return _assetPath(`typings/${type}.png`);
};
window._trainerCard = function (gameKey, type, name) {
	let game = "";
	switch (gameKey) {
		case "sword":
		case "shield": game = "swsh"; break;
		case "swordioa":
		case "shieldioat": game = "ioa"; break;
		case "swordct":
		case "shieldct": game = "ct"; break;
	}

	return _assetPath(`trainer-cards/${game}/${type}/${name}.png`);
};
window._fashionItem = function (gameKey, genderKey, categoryId, name) {
	let game = "";
	switch (gameKey) {
		// Gen 6
		case "x":
		case "y":
			game = "gen6/xy"; break;

		// Gen 7
		case "sun":
		case "moon":
		case "ultrasun":
		case "ultramoon":
			game = "gen7/sun-moon-ultra"; break;

		// Gen 7 Part 2
		case "letsgopikachu":
		case "letsgoeevee":
			game = "gen7_2"; break;

		// Gen 8
		case "sword":
		case "swordioa":
		case "swordct":
		case "shield":
		case "shieldioa":
		case "shieldct":
			game = "gen8/sword-shield"; break;

		// Gen 8 Part 2
		case "brilliantdiamond":
		case "shiningpearl":
			game = "gen8_2/brilliantdiamond-shiningpearl"; break;
		case "legendsarceus":
			game = "gen8_2/legendsarceus"; break;

		// Gen 9
		case "scarlet":
		case "scarlettm":
		case "scarletid":
		case "violet":
		case "violettm":
		case "violetid":
			game = "gen9/scarlet-violet"; break;

		// Gen 9 Part 2
		case "legendsza":
		case "legendszamd":
			game = "gen9_2"; break;
	}

	const gender = (genderKey || "unisex").toLowerCase();
	return _assetPath(`fashion/${game}/${gender}/${categoryId}/${name}.png`);
};
window._curryItem = function (folder, name) {
	// folder examples: "ingredients", "large", "player"
	return _assetPath(`curry/${folder}/${name}.png`);
};
window._sandwichItem = function (tier, name) {
	// tier examples: "normal", "great", "ultra", "master"
	return _assetPath(`sandwiches/${tier}/${name}.png`);
};
