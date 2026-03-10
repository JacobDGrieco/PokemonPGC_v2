import fs from "fs";
import path from "path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const distDir = path.join(publicDir, "dist");

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