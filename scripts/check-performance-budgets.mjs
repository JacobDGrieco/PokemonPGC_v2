/**
 * Guard the audited critical-path budgets using Vite's production manifest.
 * Dynamic legacy/bootstrap and optional feature chunks are excluded from the
 * route total until the browser requests them.
 */
import { gzipSync } from "node:zlib";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const DIST_DIRECTORY = resolve("dist");
const manifest = JSON.parse(
	readFileSync(resolve(DIST_DIRECTORY, ".vite", "manifest.json"), "utf8"),
);

function collectStaticFiles(manifestKey, files = new Set()) {
	const chunk = manifest[manifestKey];
	if (!chunk || files.has(chunk.file)) return files;
	files.add(chunk.file);
	for (const cssFile of chunk.css || []) files.add(cssFile);
	for (const importedKey of chunk.imports || [])
		collectStaticFiles(importedKey, files);
	return files;
}

function gzipBytes(file) {
	return gzipSync(readFileSync(resolve(DIST_DIRECTORY, file))).byteLength;
}

function assertBudget(label, actualBytes, budgetBytes) {
	const actualKb = (actualBytes / 1024).toFixed(2);
	const budgetKb = (budgetBytes / 1024).toFixed(0);
	console.log(`${label}: ${actualKb} KiB gzip (budget ${budgetKb} KiB)`);
	if (actualBytes > budgetBytes) {
		throw new Error(`${label} exceeded its ${budgetKb} KiB gzip budget`);
	}
}

const entryKey = Object.keys(manifest).find((key) => manifest[key].isEntry);
const homeKey = Object.keys(manifest).find((key) =>
	key.endsWith("src/pages/HomePage.jsx"),
);
if (!entryKey || !homeKey)
	throw new Error("Vite manifest is missing entry or homepage chunks");

const homeFiles = new Set([
	...collectStaticFiles(entryKey),
	...collectStaticFiles(homeKey),
]);
let initialJavaScriptGzipBytes = 0;
let initialCssGzipBytes = 0;
for (const file of homeFiles) {
	if (file.endsWith(".js")) initialJavaScriptGzipBytes += gzipBytes(file);
	if (file.endsWith(".css")) initialCssGzipBytes += gzipBytes(file);
}

assertBudget(
	"Homepage critical JavaScript",
	initialJavaScriptGzipBytes,
	180 * 1024,
);
assertBudget("Homepage critical CSS", initialCssGzipBytes, 35 * 1024);

const criticalImageFiles = [
	"public/image1-800.avif",
	"public/image2-800.avif",
	"public/image3-720.avif",
	"public/cloud-ball-96.webp",
];
const criticalImageBytes = criticalImageFiles.reduce(
	(total, file) => total + statSync(resolve(file)).size,
	0,
);
console.log(
	`Homepage modern image ceiling: ${(criticalImageBytes / 1024).toFixed(2)} KiB (budget 500 KiB)`,
);
if (criticalImageBytes > 500 * 1024) {
	throw new Error("Homepage modern images exceeded the 500 KiB budget");
}
