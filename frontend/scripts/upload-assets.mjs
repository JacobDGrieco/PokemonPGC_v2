import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ROOT = `D:\\Projects\\Coding\\PokemonPGC_v2\\frontend\\imgs`;

const client = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	},
});

const bucket = process.env.R2_BUCKET_NAME;

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

function contentTypeFor(file) {
	const ext = path.extname(file).toLowerCase();
	switch (ext) {
		case ".png": return "image/png";
		case ".jpg":
		case ".jpeg": return "image/jpeg";
		case ".webp": return "image/webp";
		case ".gif": return "image/gif";
		case ".svg": return "image/svg+xml";
		case ".glb": return "model/gltf-binary";
		case ".gltf": return "model/gltf+json";
		case ".webm": return "video/webm";
		case ".mp4": return "video/mp4";
		case ".json": return "application/json";
		default: return "application/octet-stream";
	}
}

async function main() {
	if (!process.env.R2_ACCOUNT_ID) throw new Error("Missing R2_ACCOUNT_ID");
	if (!process.env.R2_ACCESS_KEY_ID) throw new Error("Missing R2_ACCESS_KEY_ID");
	if (!process.env.R2_SECRET_ACCESS_KEY) throw new Error("Missing R2_SECRET_ACCESS_KEY");
	if (!process.env.R2_BUCKET_NAME) throw new Error("Missing R2_BUCKET_NAME");

	const files = await walk(ROOT);
	console.log(`Found ${files.length} files`);

	for (const file of files) {
		const rel = toPosix(path.relative(ROOT, file));
		const key = `imgs/${rel}`;
		const body = await fs.readFile(file);

		process.stdout.write(`Uploading ${key} ... `);

		await client.send(new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: body,
			ContentType: contentTypeFor(file),
		}));

		console.log("done");
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});