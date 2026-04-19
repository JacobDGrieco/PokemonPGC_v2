function isPlainObject(value) {
	return !!value && typeof value === "object" && !Array.isArray(value);
}

export function normalizeEmail(email) {
	return String(email || "").trim().toLowerCase();
}

export function validateCredentials(body) {
	const email = normalizeEmail(body?.email);
	const password = String(body?.password || "");

	if (!email || !password) {
		return { ok: false, error: "Email and password required." };
	}

	const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	if (!emailOk) {
		return { ok: false, error: "Please enter a valid email address." };
	}

	if (password.length < 8 || password.length > 128) {
		return { ok: false, error: "Password must be between 8 and 128 characters." };
	}

	return { ok: true, email, password };
}

export function validateIcon(icon) {
	if (icon == null || icon === "") return { ok: true, icon: undefined };
	const normalized = String(icon).trim();

	if (/^[a-z0-9_-]{1,32}$/i.test(normalized)) {
		return { ok: true, icon: normalized };
	}

	const isImageDataUrl = /^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[a-z0-9+/=]+$/i.test(normalized);
	if (isImageDataUrl && normalized.length <= 250_000) {
		return { ok: true, icon: normalized };
	}

	return { ok: false, error: "Invalid icon value." };
}

export function validateGameKey(gameKey) {
	const normalized = String(gameKey || "").trim();
	if (!/^[a-z0-9-]{1,64}$/i.test(normalized)) {
		return { ok: false, error: "Invalid gameKey." };
	}
	return { ok: true, gameKey: normalized };
}

export function validateSnapshotPayload(data) {
	if (!isPlainObject(data)) {
		return { ok: false, error: "Progress data must be an object." };
	}

	const encoded = JSON.stringify(data);
	if (!encoded || encoded.length > 1_000_000) {
		return { ok: false, error: "Progress data is too large." };
	}

	return { ok: true, data };
}
