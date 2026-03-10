export function json(res, status, payload) {
	return res.status(status).json(payload);
}

export function methodNotAllowed(res, allowed = []) {
	if (allowed.length) {
		res.setHeader("Allow", allowed.join(", "));
	}
	return json(res, 405, { error: "Method not allowed." });
}