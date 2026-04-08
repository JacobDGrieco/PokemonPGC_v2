import "dotenv/config";
import fs from "fs";
import path from "path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const assetBaseUrl = String(process.env.ASSET_BASE_URL || "").trim();
const apiBaseUrl = String(process.env.API_BASE_URL || "").trim();

fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

const copyRecursive = (src, dest) => {
	const stat = fs.statSync(src);

	if (stat.isDirectory()) {
		fs.mkdirSync(dest, { recursive: true });
		for (const entry of fs.readdirSync(src)) {
			copyRecursive(path.join(src, entry), path.join(dest, entry));
		}
		return;
	}

	fs.copyFileSync(src, dest);
};

const filesToCopy = [
	"styles",
	"src",
	"data",
	"api.js",
	"favicon.ico",
];

for (const item of filesToCopy) {
	const src = path.join(root, item);
	if (fs.existsSync(src)) {
		copyRecursive(src, path.join(publicDir, item));
	}
}

const envJs = `
window.__ASSET_BASE_URL__ = ${JSON.stringify(assetBaseUrl)};
window.__API_BASE_URL__ = ${JSON.stringify(apiBaseUrl)};
`.trim() + "\n";
fs.writeFileSync(path.join(publicDir, "asset-env.js"), envJs, "utf8");
