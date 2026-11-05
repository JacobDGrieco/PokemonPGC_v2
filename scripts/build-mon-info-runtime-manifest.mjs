/** Build the compact browser routing index from the complete catalog manifest. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const catalogDirectory = path.join(
	repositoryRoot,
	"data",
	"mon-info",
	"catalog",
);
const sourcePath = path.join(catalogDirectory, "manifest.json");
const outputPath = path.join(catalogDirectory, "runtime-manifest.json");
const sourceManifest = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const gameKeys = [
	...new Set(
		Object.values(sourceManifest.species || {}).flatMap((species) =>
			Object.values(species.forms || {}).flatMap(
				(form) => form.gameKeys || [],
			),
		),
	),
];
const gameKeyIndexes = new Map(
	gameKeys.map((gameKey, index) => [gameKey, index]),
);
const species = {};

for (const [nationalDexId, speciesMetadata] of Object.entries(
	sourceManifest.species || {},
)) {
	if (!speciesMetadata.forms?.[speciesMetadata.defaultFormKey]) {
		throw new Error(
			`Mon Info default form is missing for #${nationalDexId}: ${speciesMetadata.defaultFormKey}`,
		);
	}
	const forms = {};
	for (const [formKey, formMetadata] of Object.entries(
		speciesMetadata.forms || {},
	)) {
		forms[formKey] = [
			formMetadata.label,
			(formMetadata.gameKeys || []).map((gameKey) =>
				gameKeyIndexes.get(gameKey),
			),
		];
	}
	species[nationalDexId] = [
		speciesMetadata.name,
		speciesMetadata.defaultFormKey,
		forms,
	];
}

const runtimeManifest = {
	v: sourceManifest.schemaVersion,
	h: sourceManifest.contentHash,
	g: gameKeys,
	s: species,
};
fs.writeFileSync(outputPath, `${JSON.stringify(runtimeManifest)}\n`, "utf8");
console.log(
	`Wrote ${path.relative(repositoryRoot, outputPath)} (${fs.statSync(outputPath).size} bytes).`,
);
