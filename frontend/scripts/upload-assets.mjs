import fs from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

// Put your exact folder here:
const ROOT = `D:\\Projects\\Coding\\pokemon_pgc\\PokemonPGC\\frontend\\imgs`;

async function walk(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) return walk(full);
			return [full];
		})
	);
	return files.flat();
}

function toPosix(p) {
	return p.split(path.sep).join("/");
}

async function main() {
	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		throw new Error("Missing BLOB_READ_WRITE_TOKEN");
	}

	const rootStat = await fs.stat(ROOT).catch(() => null);
	if (!rootStat || !rootStat.isDirectory()) {
		throw new Error(`ROOT folder does not exist or is not a directory: ${ROOT}`);
	}

	const files = await walk(ROOT);
	console.log(`Found ${files.length} files under ${ROOT}`);

	for (const file of files) {
		const rel = toPosix(path.relative(ROOT, file));
		const pathname = `imgs/${rel}`;
		const body = await fs.readFile(file);

		process.stdout.write(`Uploading ${pathname} ... `);

		await put(pathname, body, {
			access: "public",
			addRandomSuffix: false,
			allowOverwrite: true,
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});

		console.log("done");
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});