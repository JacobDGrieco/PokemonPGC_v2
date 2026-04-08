// src/api.js
const API_BASE = (globalThis.__API_BASE_URL__ || "").trim() || "/api";
let loggedInUserId = null;

/**
 * Called by the UI layer whenever the current user changes.
 * We only care about "some stable identifier" (id or email).
 */
export function setApiCurrentUser(user) {
	if (user && (user.id || user.email)) {
		loggedInUserId = user.id || user.email;
	} else {
		loggedInUserId = null;
	}
}

async function safeJson(res) {
	const text = await res.text();
	if (!text) return { error: `Server error (${res.status})` };
	try { return JSON.parse(text); }
	catch { return { error: text.slice(0, 200) || `Server error (${res.status})` }; }
}

async function requireOkJson(res, fallbackMessage) {
	const payload = await safeJson(res);
	if (!res.ok || payload?.error) {
		throw new Error(payload?.error || fallbackMessage || `Request failed (${res.status})`);
	}
	return payload;
}

export async function signup(email, password) {
	const res = await fetch(`${API_BASE}/auth/signup`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ email, password }),
	});
	return safeJson(res);
}

export async function login(email, password) {
	const res = await fetch(`${API_BASE}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ email, password }),
	});
	return safeJson(res);
}

export async function getCurrentUser() {
	const res = await fetch(`${API_BASE}/auth/me`, {
		credentials: "include",
	});
	return res.json();
}

export async function logout() {
	const res = await fetch(`${API_BASE}/auth/logout`, {
		method: "POST",
		credentials: "include",
	});
	return res.json();
}

export async function updateMe(patch) {
	const res = await fetch(`${API_BASE}/auth/me`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(patch),
	});
	return res.json();
}

export async function saveGameSave(gameKey, data) {
	// No logged-in user => don't hit the backend at all
	if (!loggedInUserId) {
		return { skipped: true, reason: "not-logged-in" };
	}

	const res = await fetch(
		`${API_BASE}/progress/${encodeURIComponent(gameKey)}`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ data }),
		}
	);

	return requireOkJson(res, `Failed to save progress for ${gameKey}.`);
}

export async function fetchGameSave(gameKey) {
	// If nobody is logged in, behave like "no cloud save"
	if (!loggedInUserId) {
		return null;
	}

	const res = await fetch(
		`${API_BASE}/progress/${encodeURIComponent(gameKey)}`,
		{
			credentials: "include",
		}
	);

	if (res.status === 404) {
		return null;
	}

	return requireOkJson(res, `Failed to load progress for ${gameKey}.`);
}

export async function fetchAllGameSaves() {
	if (!loggedInUserId) {
		return null;
	}

	const res = await fetch(`${API_BASE}/progress`, {
		credentials: "include",
	});

	return requireOkJson(res, "Failed to load cloud saves.");
}

export async function uploadSaveFileForImport(gameKey, file) {
	if (!loggedInUserId) {
		throw new Error("You must be logged in to import a save file.");
	}

	const bytes = new Uint8Array(await file.arrayBuffer());
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	const contentBase64 = btoa(binary);

	const res = await fetch(
		`${API_BASE}/save-import/${encodeURIComponent(gameKey)}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				filename: file?.name || null,
				contentBase64,
			}),
		}
	);

	// Handle non-2xx responses nicely
	let payload;
	try {
		payload = await res.json();
	} catch {
		throw new Error(`Upload failed (${res.status})`);
	}

	if (!res.ok || payload.error) {
		throw new Error(payload.error || `Upload failed (${res.status})`);
	}

	return payload; // e.g. { gameKey, size, hexPreview, tasks: {...} }
}
