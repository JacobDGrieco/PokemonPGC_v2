import { json, methodNotAllowed } from "../_lib/response.js";
import { clearSessionCookie } from "../_lib/auth.js";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return methodNotAllowed(res, ["POST"]);
	}

	clearSessionCookie(res);
	return json(res, 200, { ok: true });
}