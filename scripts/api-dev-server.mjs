import http from "http";
import { URL } from "url";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import healthHandler from "../api/health.js";
import authHandler from "../api/auth/[action].js";
import progressHandler from "../api/progress/[[...slug]].js";
import saveImportHandler from "../api/save-import/[gameKey].js";
import subscriptionsHandler from "../api/subscriptions/[provider]/[action].js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(frontendRoot, ".env") });

const PORT = Number(process.env.PPGC_API_PORT || process.env.API_PORT || 3000);

function enhanceResponse(res) {
	res.status = (code) => {
		res.statusCode = code;
		return res;
	};
	res.json = (payload) => {
		if (!res.headersSent) {
			res.setHeader("Content-Type", "application/json; charset=utf-8");
		}
		res.end(JSON.stringify(payload));
		return res;
	};
	return res;
}

function routeFor(pathname) {
	if (pathname === "/api/health") return { handler: healthHandler, query: {} };
	let match = pathname.match(/^\/api\/auth\/([^/]+)$/);
	if (match) {
		return { handler: authHandler, query: { action: decodeURIComponent(match[1]) } };
	}

	if (pathname === "/api/progress") return { handler: progressHandler, query: {} };

	match = pathname.match(/^\/api\/progress\/([^/]+)$/);
	if (match) {
		return { handler: progressHandler, query: { slug: [decodeURIComponent(match[1])] } };
	}

	match = pathname.match(/^\/api\/save-import\/([^/]+)$/);
	if (match) {
		return { handler: saveImportHandler, query: { gameKey: decodeURIComponent(match[1]) } };
	}

	match = pathname.match(/^\/api\/subscriptions\/([^/]+)\/([^/]+)$/);
	if (match) {
		return {
			handler: subscriptionsHandler,
			query: {
				provider: decodeURIComponent(match[1]),
				action: decodeURIComponent(match[2]),
			},
		};
	}

	return null;
}

const server = http.createServer(async (req, res) => {
	const url = new URL(req.url, `http://${req.headers.host || `127.0.0.1:${PORT}`}`);
	const route = routeFor(url.pathname);

	if (!route) {
		res.statusCode = 404;
		res.setHeader("Content-Type", "application/json; charset=utf-8");
		res.end(JSON.stringify({ error: "Not found." }));
		return;
	}

	req.query = route.query;
	enhanceResponse(res);

	try {
		await route.handler(req, res);
	} catch (error) {
		console.error("[api-dev-server] unhandled error:", error);
		if (!res.writableEnded) {
			res.status(500).json({ error: "Internal error." });
		}
	}
});

server.listen(PORT, "127.0.0.1", () => {
	console.log(`PPGC local API listening on http://127.0.0.1:${PORT}`);
});
