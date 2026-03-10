import { json, methodNotAllowed } from "./_lib/response.js";

export default async function handler(req, res) {
	if (req.method !== "GET") {
		return methodNotAllowed(res, ["GET"]);
	}

	return json(res, 200, {
		ok: true,
		service: "ppgc-vercel-api",
		timestamp: new Date().toISOString(),
	});
}