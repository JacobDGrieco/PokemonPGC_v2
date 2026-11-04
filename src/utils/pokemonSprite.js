/** Resolve game-aware Pokemon sprites with stable in-app fallback behavior. */
import { _frontSprite } from "../../data/helpers/sprite-models.js";
import {
	generationForVersionGroup,
	spriteGameKeyForProfileKey,
	versionGroupForGameKey,
} from "../../data/reference-indexes/game-mapping.js";
import { assetPath } from "./assetPath.js";

function normalizedFormKey(formKey) {
	const normalized = String(formKey || "")
		.trim()
		.toLowerCase();
	return normalized && normalized !== "base" ? normalized : null;
}

/** Return the established Pokemon HOME sprite used for cross-game views. */
export function homePokemonSprite(nationalDexId) {
	const id = Number(nationalDexId);
	if (!Number.isFinite(id) || id <= 0) return null;
	return assetPath(
		`sprites/pokemon_home/base-front/${String(id).padStart(4, "0")}.png`,
	);
}

/**
 * Resolve an app game key to the numbered generation expected by the shared
 * sprite builder. HOME remains a separate sprite family rather than Gen 9.
 */
export function spriteGenerationForGameKey(gameKey) {
	const normalizedGameKey = String(gameKey || "").toLowerCase();
	if (!normalizedGameKey || normalizedGameKey === "home") return "home";
	return generationForVersionGroup(versionGroupForGameKey(normalizedGameKey));
}

/**
 * Build ordered sprite candidates. A game-specific form falls back to that
 * game's base form before HOME, so a missing form asset never changes the
 * selected game's ordinary species artwork unnecessarily.
 */
export function pokemonSpriteCandidates({
	nationalDexId,
	formKey = null,
	gameKey = null,
	profileKey = null,
	allGames = false,
} = {}) {
	const homeSprite = homePokemonSprite(nationalDexId);
	if (allGames) return homeSprite ? [homeSprite] : [];

	const resolvedGameKey = profileKey
		? spriteGameKeyForProfileKey(profileKey)
		: String(gameKey || "").toLowerCase() || null;
	if (!resolvedGameKey || resolvedGameKey === "home") {
		return homeSprite ? [homeSprite] : [];
	}

	const generation = spriteGenerationForGameKey(resolvedGameKey);
	const form = normalizedFormKey(formKey);
	const candidates = [];
	// Red/Blue and Japanese Green are distinct reference filters. Building the
	// international path directly prevents the global Gen I region preference
	// from silently turning a Red/Blue result into Green artwork.
	if (profileKey === "red-blue") {
		candidates.push(
			assetPath(
				`sprites/gen1/red-blue/bw-front/${String(Number(nationalDexId)).padStart(4, "0")}.png`,
			),
		);
		if (homeSprite) candidates.push(homeSprite);
		return [...new Set(candidates.filter(Boolean))];
	}
	if (form) {
		candidates.push(
			_frontSprite(generation, resolvedGameKey, nationalDexId, form),
		);
	}
	candidates.push(
		_frontSprite(generation, resolvedGameKey, nationalDexId, null),
	);
	if (homeSprite) candidates.push(homeSprite);
	return [...new Set(candidates.filter(Boolean))];
}

/** Move an image to its next candidate without creating an error loop. */
export function advancePokemonSpriteFallback(event, candidates) {
	const image = event.currentTarget;
	const documentBaseUrl =
		globalThis.document?.baseURI ||
		globalThis.location?.href ||
		"http://localhost/";
	const matchedIndex = candidates.findIndex((candidate) => {
		try {
			return new URL(candidate, documentBaseUrl).href === image.src;
		} catch {
			return candidate === image.getAttribute?.("src");
		}
	});
	const currentIndex =
		matchedIndex >= 0
			? matchedIndex
			: Number(image.dataset.spriteCandidateIndex || 0);
	const nextIndex = currentIndex + 1;
	if (nextIndex < candidates.length) {
		image.dataset.spriteCandidateIndex = String(nextIndex);
		image.src = candidates[nextIndex];
		return;
	}
	image.onerror = null;
	image.src = globalThis.__PPGC_NO_IMG__ || "/no-image.svg";
}
