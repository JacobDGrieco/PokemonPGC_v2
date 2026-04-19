import fs from "fs";
import path from "path";

const root = process.cwd();
const distDir = path.join(root, "dist");

if (!fs.existsSync(distDir)) {
	throw new Error(`dist directory not found at ${distDir}`);
}

const assetBaseUrl = String(
	process.env.VITE_ASSET_BASE_URL || process.env.ASSET_BASE_URL || ""
).trim();
const apiBaseUrl = String(
	process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || ""
).trim();

const envJs =
	`window.__ASSET_BASE_URL__ = ${JSON.stringify(assetBaseUrl)};\n` +
	`window.__API_BASE_URL__ = ${JSON.stringify(apiBaseUrl)};\n`;

fs.writeFileSync(path.join(distDir, "asset-env.js"), envJs, "utf8");
