// src/api.js
const API_BASE = "/api"; // backend is serving /api/* from the same origin
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

export async function signup(email, password) {
	const res = await fetch(`${API_BASE}/auth/signup`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ email, password }),
	});
	return res.json();
}

export async function login(email, password) {
	const res = await fetch(`${API_BASE}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ email, password }),
	});
	return res.json();
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

	return res.json();
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

	return res.json(); // { save: { gameKey, data, updatedAt } }
}

export async function uploadSaveFileForImport(gameKey, file) {
	if (!loggedInUserId) {
		throw new Error("You must be logged in to import a save file.");
	}

	const formData = new FormData();
	formData.append("file", file);

	const res = await fetch(
		`${API_BASE}/save-import/${encodeURIComponent(gameKey)}`,
		{
			method: "POST",
			credentials: "include",
			body: formData,
			// NOTE: do NOT set Content-Type here; the browser
			// sets the proper multipart/form-data boundary for FormData.
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