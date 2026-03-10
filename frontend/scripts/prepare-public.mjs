import fs from "fs";
import path from "path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const distDir = path.join(publicDir, "dist");
const assetBaseUrl = String(process.env.ASSET_BASE_URL || "").trim();

fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(distDir, { recursive: true });

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
	"index.html",
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

const assetEnvJs = `window.__ASSET_BASE_URL__ = ${JSON.stringify(assetBaseUrl)};\n`;
fs.writeFileSync(path.join(publicDir, "asset-env.js"), assetEnvJs, "utf8");

const publicIndexPath = path.join(publicDir, "index.html");
if (fs.existsSync(publicIndexPath)) {
	let html = fs.readFileSync(publicIndexPath, "utf8");
	html = html.replace(
		/<script type="module"\s+src="\.\/dist\/bundle\.js"><\/script>/,
		'<script src="./asset-env.js"></script>\n\t\t<script type="module" src="./dist/bundle.js"></script>'
	);
	fs.writeFileSync(publicIndexPath, html, "utf8");
}