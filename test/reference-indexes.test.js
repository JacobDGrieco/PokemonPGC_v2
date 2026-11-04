import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

import {
	compareReferenceGameRelease,
	formatReferenceGameLabel,
	generationForVersionGroup,
	machineSpriteGenerationForGameKey,
	referenceGameTitles,
	spriteGameKeyForProfileKey,
	versionGroupForProfileKey,
} from "../data/reference-indexes/game-mapping.js";
import {
	moveGroupDisplayLabel,
	moveMetadataParts,
	moveTypeIconSource,
	referenceEntryHref,
	resolveMachinePresentation,
} from "../src/utils/moveReference.js";
import {
	buildMonInfoStatSeries,
	MON_INFO_STAT_LABEL_RADIUS_OFFSET,
	MON_INFO_STAT_VIEW_BOX,
} from "../src/utils/monInfoStats.js";
import { parseMonInfoGenderRatio } from "../src/utils/monInfoProfile.js";
import { normalizeMonInfoLocations } from "../src/utils/monInfoLocations.js";
import {
	renderMovesHtml,
	renderProfileHtml,
	renderStatsRadar,
} from "../src/modals/dex-mon-info-render.js";
import {
	advancePokemonSpriteFallback,
	homePokemonSprite,
	pokemonSpriteCandidates,
	spriteGenerationForGameKey,
} from "../src/utils/pokemonSprite.js";
import { formKeyToSuffix } from "../data/helpers/dex-register.js";

const repositoryRoot = process.cwd();
const referenceRoot = path.join(repositoryRoot, "public", "reference-indexes");

test("generated Move and Ability catalogs are complete and content-addressed", () => {
	const expectedCounts = { moves: 937, abilities: 374 };
	for (const [kind, expectedCount] of Object.entries(expectedCounts)) {
		const kindRoot = path.join(referenceRoot, kind);
		const manifest = readJson(path.join(kindRoot, "manifest.json"));
		const entries = Object.values(manifest.entries);
		const hash = crypto.createHash("sha256");

		assert.equal(manifest.schemaVersion, 1);
		assert.equal(manifest.entryCount, expectedCount);
		assert.equal(entries.length, expectedCount);
		for (const entry of [...entries].sort((left, right) =>
			left.path.localeCompare(right.path),
		)) {
			const detailPath = path.join(kindRoot, entry.path);
			assert.equal(fs.existsSync(detailPath), true, entry.path);
			const content = fs.readFileSync(detailPath, "utf8");
			const detail = JSON.parse(content);
			assert.equal(detail.slug, entry.slug);
			hash.update(entry.path).update("\0").update(content);
		}
		assert.equal(hash.digest("hex"), manifest.contentHash);
	}
});

test("reference samples retain localization, machines, and per-game relationships", () => {
	const solarBeam = readDetail("moves", "solar-beam");
	const triAttack = readDetail("moves", "tri-attack");
	const overgrow = readDetail("abilities", "overgrow");
	const protean = readDetail("abilities", "protean");
	const solarBeamBulbasaur = solarBeam.learners.find(
		(learner) => learner.nationalDexId === 1,
	);
	const overgrowBulbasaur = overgrow.pokemon.find(
		(pokemon) => pokemon.nationalDexId === 1,
	);

	assert.equal(solarBeam.names.ja, "ソーラービーム");
	assert.deepEqual(
		solarBeam.machines.find(
			(machine) => machine.versionGroup === "sword-shield",
		),
		{
			versionGroup: "sword-shield",
			kind: "TM",
			number: 11,
			item: "tm11",
		},
	);
	assert.equal(
		solarBeamBulbasaur.games
			.find((game) => game.profileKey === "red-blue")
			.methods.some((method) => method.method === "Machine"),
		true,
	);
	assert.equal(
		triAttack.machines.find(
			(machine) => machine.versionGroup === "sword-shield",
		).kind,
		"TR",
	);
	assert.equal(overgrow.names.ja, "しんりょく");
	assert.equal(
		overgrow.effectEntries.some((entry) => entry.language === "en"),
		true,
	);
	assert.equal(
		overgrowBulbasaur.games.some(
			(game) => generationForVersionGroup(game.versionGroup) < 3,
		),
		false,
	);
	assert.equal(
		protean.pokemon.some((pokemon) =>
			pokemon.games.some(
				(game) => generationForVersionGroup(game.versionGroup) < 6,
			),
		),
		false,
	);
});

test("machine presentation uses exact TM or TR identity and sprite family", () => {
	const manifest = readJson(
		path.join(referenceRoot, "moves", "manifest.json"),
	);
	const triAttack = resolveMachinePresentation({
		manifest,
		moveName: "Tri Attack",
		learnMethod: "Machine",
		gameKey: "sword",
	});
	const solarBeam = resolveMachinePresentation({
		manifest,
		moveName: "Solar Beam",
		learnMethod: "Machine",
		gameKey: "red",
	});

	assert.deepEqual(triAttack, {
		kind: "TR",
		number: 19,
		type: "normal",
		src: "/items/thms/trs/normal.png",
		label: "TR19 Normal-type machine",
	});
	assert.equal(solarBeam.kind, "TM");
	assert.equal(solarBeam.number, 22);
	assert.equal(solarBeam.src, "/items/thms/tms/gen1-5/grass.png");
	assert.equal(machineSpriteGenerationForGameKey("brilliantdiamond"), "8_2");
	assert.equal(versionGroupForProfileKey("legends-za"), "legends-z-a");
});

test("Pokemon sprites follow the selected game while all-game views use HOME", () => {
	assert.equal(formKeyToSuffix(3, "male"), null);
	assert.equal(formKeyToSuffix(3, "female"), "f");
	assert.equal(formKeyToSuffix(3, "mega"), "m");
	assert.equal(formKeyToSuffix(3, "gigantamax"), "gi");
	assert.equal(
		spriteGameKeyForProfileKey("heartgold-soulsilver"),
		"heartgold",
	);
	assert.equal(spriteGameKeyForProfileKey("the-indigo-disk"), "scarletid");
	assert.equal(spriteGenerationForGameKey("platinum-national"), 4);
	assert.equal(spriteGenerationForGameKey("legendszamd"), 9);
	assert.deepEqual(
		pokemonSpriteCandidates({
			nationalDexId: 1,
			profileKey: "red-blue",
		}),
		[
			"/sprites/gen1/red-blue/bw-front/0001.png",
			"/sprites/pokemon_home/base-front/0001.png",
		],
	);
	assert.deepEqual(
		pokemonSpriteCandidates({
			nationalDexId: 479,
			formKey: "wash",
			profileKey: "platinum",
		}),
		[
			"/sprites/gen4/platinum/base-front/0479-w.png",
			"/sprites/gen4/platinum/base-front/0479.png",
			"/sprites/pokemon_home/base-front/0479.png",
		],
	);
	assert.deepEqual(
		pokemonSpriteCandidates({
			nationalDexId: 25,
			formKey: "base",
			profileKey: "sword-shield",
		}),
		[
			"/sprites/gen8/sword-shield/base-front-thumb/0025.png",
			"/sprites/pokemon_home/base-front/0025.png",
		],
	);
	assert.deepEqual(
		pokemonSpriteCandidates({
			nationalDexId: 3,
			formKey: "male",
			gameKey: "legendsza",
		}),
		[
			"/sprites/gen9/legendsza/base-front-thumb/0003.png",
			"/sprites/pokemon_home/base-front/0003.png",
		],
	);
	assert.deepEqual(
		pokemonSpriteCandidates({
			nationalDexId: 3,
			formKey: "mega",
			gameKey: "legendsza",
		}),
		[
			"/sprites/gen9/legendsza/base-front-thumb/0003-m.png",
			"/sprites/gen9/legendsza/base-front-thumb/0003.png",
			"/sprites/pokemon_home/base-front/0003.png",
		],
	);
	assert.deepEqual(
		pokemonSpriteCandidates({ nationalDexId: 25, allGames: true }),
		[homePokemonSprite(25)],
	);
	const image = {
		dataset: { spriteCandidateIndex: "1" },
		src: "http://localhost/sprites/game.png",
		onerror: () => {},
	};
	advancePokemonSpriteFallback({ currentTarget: image }, [
		"/sprites/game.png",
		"/sprites/home.png",
	]);
	assert.equal(image.src, "/sprites/home.png");
	assert.equal(image.dataset.spriteCandidateIndex, "1");
});

test("dual-game locations combine matching encounters", () => {
	const locations = normalizeMonInfoLocations([
		{
			area: "Desert Resort Entrance",
			notes: "Walk, Lv. 19",
			games: "Black 2",
			rate: "5%",
		},
		{
			area: "Desert Resort Entrance",
			notes: "Walk, Lv. 19",
			games: "White 2",
			rate: "5%",
		},
		{
			area: "Desert Resort Entrance",
			notes: "Walk, Lv. 20",
			games: "Black 2",
			rate: "4%",
		},
		{
			area: "Desert Resort Entrance",
			notes: "Walk, Lv. 20",
			games: "Black 2",
			rate: "1%",
		},
		{
			area: "Desert Resort Entrance",
			notes: "Walk, Lv. 20",
			games: "White 2",
			rate: "4%",
		},
		{
			area: "Relic Passage",
			notes: "Walk, Lv. 10",
			games: "Black 2",
		},
		{
			area: "Relic Passage",
			notes: "Walk, Lv. 11",
			games: "Black 2",
		},
		{
			area: "Relic Passage",
			notes: "Walk, Lv. 10",
			games: "White 2",
		},
	]);

	assert.deepEqual(locations, [
		{
			key: "loc-0",
			area: "Desert Resort Entrance",
			notes: "Walk, Lv. 19-20",
			extra: "Black 2/White 2",
		},
		{
			key: "loc-5",
			area: "Relic Passage",
			notes: "Walk, Lv. 10-11",
			extra: "Black 2",
		},
		{
			key: "loc-7",
			area: "Relic Passage",
			notes: "Walk, Lv. 10",
			extra: "White 2",
		},
	]);
});

test("reference games sort from the earliest releases through Legends: Z-A", () => {
	const shuffledGames = [
		"legends-z-a",
		"black-white",
		"red-blue",
		"scarlet-violet",
		"gold-silver",
	];
	assert.deepEqual(shuffledGames.sort(compareReferenceGameRelease), [
		"red-blue",
		"gold-silver",
		"black-white",
		"scarlet-violet",
		"legends-z-a",
	]);
	assert.deepEqual(referenceGameTitles("firered-leafgreen"), [
		"FireRed",
		"LeafGreen",
	]);
	assert.deepEqual(referenceGameTitles("heartgold-soulsilver"), [
		"HeartGold",
		"SoulSilver",
	]);
	assert.equal(
		formatReferenceGameLabel("lets-go-pikachu-lets-go-eevee"),
		"Let's Go Pikachu / Let's Go Eevee",
	);
});

test("reference UI remains lazy and exposes both indexes in the existing sidebar", () => {
	const loaderSource = fs.readFileSync(
		path.join(repositoryRoot, "data", "reference-indexes", "_loader.js"),
		"utf8",
	);
	const sidebarSource = fs.readFileSync(
		path.join(repositoryRoot, "src", "components", "AppSidebar.jsx"),
		"utf8",
	);
	const routerSource = fs.readFileSync(
		path.join(
			repositoryRoot,
			"src",
			"components",
			"content",
			"ReactContentRouter.jsx",
		),
		"utf8",
	);
	const referencePageSource = fs.readFileSync(
		path.join(
			repositoryRoot,
			"src",
			"components",
			"content",
			"ReferenceIndexPage.jsx",
		),
		"utf8",
	);
	const referenceStyles = fs.readFileSync(
		path.join(
			repositoryRoot,
			"src",
			"components",
			"content",
			"ReferenceIndexPage.css",
		),
		"utf8",
	);

	assert.match(loaderSource, /fetch\(/);
	assert.doesNotMatch(loaderSource, /import\.meta\.glob/);
	assert.match(sidebarSource, /label: "Move Index"/);
	assert.match(sidebarSource, /label: "Ability Index"/);
	assert.match(
		routerSource,
		/const ReferenceIndexPage = lazy\(\(\) =>\s+import\("\.\/ReferenceIndexPage\.jsx"\)/,
	);
	assert.match(routerSource, /initialSlug=\{referenceSlug\}/);
	assert.match(referencePageSource, /referenceSlug: slug \|\| null/);
	assert.match(referencePageSource, /import "\.\/ReferenceIndexPage\.css"/);
	assert.match(referencePageSource, /typings\/\$\{assetType\}\.png/);
	assert.match(
		referencePageSource,
		/move-types\/\$\{normalizedCategory\}-home\.png/,
	);
	assert.doesNotMatch(
		referencePageSource,
		/className={`type-pill type-\$\{String\(entry\.type\)/,
	);
	assert.match(referencePageSource, /className="reference-move-card"/);
	assert.match(referencePageSource, /className="reference-ability-card"/);
	assert.match(
		referencePageSource,
		/className="reference-move-card-meta" aria-hidden="true"/,
	);
	assert.doesNotMatch(
		referencePageSource,
		/entry\.learnerCount\.toLocaleString\(\)/,
	);
	assert.doesNotMatch(referencePageSource, /className="reference-index-row"/);
	assert.match(referencePageSource, /日本語（漢字）/);
	assert.match(referencePageSource, /日本語（ひらがな・カタカナ）/);
	assert.match(referencePageSource, /className="reference-effect-heading"/);
	assert.match(
		referencePageSource,
		/<option value="all">All games<\/option>/,
	);
	assert.match(referencePageSource, /className="reference-pokemon-card"/);
	assert.match(referencePageSource, /game\.profileKey === gameFilter/);
	assert.match(referencePageSource, /className="reference-game-label"/);
	assert.match(referencePageSource, /\(male\|female\)\$/);
	assert.match(referencePageSource, /pokemonRelationshipSignature/);
	assert.match(referencePageSource, /genderForm\.gender === "female"/);
	assert.match(referencePageSource, /prefix \|\| "base"/);
	assert.match(referencePageSource, /\? "Base"/);
	assert.match(
		referenceStyles,
		/\.reference-index-list\.is-move-grid,\s*\.reference-index-list\.is-ability-grid\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fill, minmax\(180px, 1fr\)\)/s,
	);
	assert.match(
		referenceStyles,
		/\.reference-move-card,\s*\.reference-ability-card\s*\{[^}]*background:\s*linear-gradient\(180deg, var\(--surface-2\), var\(--surface-1\)\);[^}]*box-shadow:/s,
	);
	assert.match(referenceStyles, /@media \(max-width: 760px\)/);
	assert.match(referenceStyles, /@media \(max-width: 430px\)/);
	assert.match(referenceStyles, /min-height: 44px/);
});

test("Gen I radar charts reserve room for the full Atk and Spe labels", () => {
	const statSource = fs.readFileSync(
		path.join(repositoryRoot, "src/utils/monInfoStats.js"),
		"utf8",
	);
	assert.match(statSource, /\["HP", "Atk", "Def", "Spd", "Spe"\]/);
	assert.equal(MON_INFO_STAT_LABEL_RADIUS_OFFSET, 16);
	assert.equal(MON_INFO_STAT_VIEW_BOX, "-42 -40 184 182");

	for (const relativePath of [
		"src/components/content/MonInfoBody.jsx",
		"src/modals/dex-mon-info-render.js",
	]) {
		const source = fs.readFileSync(
			path.join(repositoryRoot, relativePath),
			"utf8",
		);
		assert.match(source, /buildMonInfoStatSeries/);
		assert.match(source, /MON_INFO_STAT_VIEW_BOX/);
	}
});

test("Mon Info combines base stats and non-zero EV yields below each label", () => {
	const statSeries = buildMonInfoStatSeries(
		{ hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 },
		{ spa: 2, spd: 1 },
	);
	assert.equal(
		statSeries.find((stat) => stat.key === "hp").displayValue,
		"80",
	);
	assert.equal(
		statSeries.find((stat) => stat.key === "spa").displayValue,
		"100 (2)",
	);

	const radarHtml = renderStatsRadar(
		{ hp: 80, atk: 82, def: 83, spe: 80, spc: 100 },
		{ spc: 2 },
	);
	assert.match(radarHtml, /Base Stats and EV Yield/);
	assert.match(radarHtml, /viewBox="-42 -40 184 182"/);
	assert.match(radarHtml, />HP<\/text><text[^>]+>80<\/text>/);
	assert.match(radarHtml, />Spe<\/text><text[^>]+>100 \(2\)<\/text>/);
	assert.doesNotMatch(radarHtml, /\(0\)/);
});

test("Mon Info move rows use type icons and content-derived machine headings", () => {
	assert.equal(moveTypeIconSource("Poison"), "/typings/posion.png");
	assert.deepEqual(
		moveMetadataParts({ level: 12, order: 2, power: 55, type: "Grass" }),
		["Lv. 12", "Pow 55"],
	);
	assert.equal(
		moveGroupDisplayLabel("Machine", [
			{ machine: { kind: "TR" } },
			{ machine: { kind: "TM" } },
		]),
		"TM / TR",
	);

	const movesHtml = renderMovesHtml({
		moves: {
			Machine: [
				{
					name: "Energy Ball",
					type: "Grass",
					machine: {
						kind: "TR",
						src: "/tms/gen8/grass.png",
						label: "TR65",
					},
				},
				{
					name: "Solar Beam",
					type: "Grass",
					machine: {
						kind: "TM",
						src: "/tms/gen8/grass.png",
						label: "TM11",
					},
				},
			],
			"Level Up": [
				{
					name: "Vine Whip",
					type: "Grass",
					level: 12,
					order: 2,
				},
			],
		},
	});
	assert.match(movesHtml, /<h4>TM \/ TR<\/h4>/);
	assert.doesNotMatch(movesHtml, /\/tms\/gen8\/grass\.png/);
	assert.match(
		movesHtml,
		/href="#\/tools\/moves\/energyball"[^>]*>[^<]*<img/,
	);
	const machineTypeIndex = movesHtml.indexOf("/typings/grass.png");
	const machineLabelIndex = movesHtml.indexOf("Energy Ball");
	assert.ok(machineTypeIndex < machineLabelIndex);
	assert.match(
		movesHtml,
		/Vine Whip<\/span><\/a><small[^>]*>Lv\. 12<\/small>/,
	);
	assert.doesNotMatch(movesHtml, /Order 2/);
	assert.doesNotMatch(movesHtml, /<small[^>]*>[^<]*Grass/);

	const reactSource = fs.readFileSync(
		path.join(repositoryRoot, "src/components/content/MonInfoBody.jsx"),
		"utf8",
	);
	assert.doesNotMatch(reactSource, /react-move-machine-icon/);
	assert.match(reactSource, /moveGroupDisplayLabel/);
});

test("Mon Info moves and abilities link to their reference detail routes", () => {
	assert.equal(
		referenceEntryHref("moves", "Solar Beam"),
		"#/tools/moves/solarbeam",
	);
	assert.equal(
		referenceEntryHref("abilities", "Chlorophyll (Hidden)"),
		"#/tools/abilities/chlorophyll",
	);

	const profileHtml = renderProfileHtml({
		resolvedInfo: { abilities: ["Overgrow", "Chlorophyll (Hidden)"] },
		abilities: ["Overgrow", "Chlorophyll (Hidden)"],
	});
	assert.match(profileHtml, /href="#\/tools\/abilities\/overgrow"/);
	assert.match(profileHtml, /href="#\/tools\/abilities\/chlorophyll"/);

	const historySource = fs.readFileSync(
		path.join(repositoryRoot, "src/history.js"),
		"utf8",
	);
	assert.match(historySource, /tool === "moves" \|\| tool === "abilities"/);
	assert.match(historySource, /next\.referenceSlug = n/);
});

test("Mon Info prioritizes profile fields and renders colored gender icons", () => {
	assert.deepEqual(parseMonInfoGenderRatio("87.5% male / 12.5% female"), {
		male: "87.5",
		female: "12.5",
	});
	assert.deepEqual(parseMonInfoGenderRatio("Genderless"), {
		text: "Genderless",
	});

	const profileHtml = renderProfileHtml({
		resolvedInfo: {
			genderRatio: "87.5% male / 12.5% female",
			captureRate: 45,
			baseFriendship: 50,
			baseExperience: 263,
			height: "2 m",
			weight: "100 kg",
			habitat: "Grassland",
			shape: "Quadruped",
			color: "Green",
			genus: "Seed Pokémon",
		},
		abilities: ["Overgrow"],
		eggGroups: ["Monster", "Grass"],
		expGroup: "Medium Slow",
		baseEggSteps: 5120,
	});
	assert.match(
		profileHtml,
		/mon-info-profile-column is-primary[\s\S]*Abilities[\s\S]*Egg Groups[\s\S]*Base Egg Steps[\s\S]*Catch Rate[\s\S]*Base Friendship[\s\S]*Exp Growth/,
	);
	assert.match(
		profileHtml,
		/mon-info-profile-column is-secondary[\s\S]*Height[\s\S]*Weight[\s\S]*Gender Ratio[\s\S]*Base Experience/,
	);
	assert.match(profileHtml, /color:oklch\(72% 0\.16 250\)/);
	assert.match(profileHtml, /color:oklch\(76% 0\.16 350\)/);
	assert.match(profileHtml, />♂<\/span> 87\.5%/);
	assert.match(profileHtml, />♀<\/span> 12\.5%/);

	const profileStyles = fs.readFileSync(
		path.join(repositoryRoot, "styles/modal-mon-info.css"),
		"utf8",
	);
	assert.match(
		profileStyles,
		/\.mon-info-profile-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s,
	);
});

function readDetail(kind, slug) {
	return readJson(path.join(referenceRoot, kind, "catalog", `${slug}.json`));
}

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
