/** Build the game-aware sprite inventory displayed at the bottom of Mon Info. */
import {
	_backSprite,
	_backSpriteAnimated,
	_backSpriteShiny,
	_backSpriteShinyAnimated,
	_frontSprite,
	_frontSpriteAnimated,
	_frontSpriteShiny,
	_frontSpriteShinyAnimated,
	_iconSprite,
	_iconSpriteShiny,
	_menuSprite,
} from "../../data/helpers/sprite-models.js";
import { spriteGenerationForGameKey } from "./pokemonSprite.js";

function firstSource(...sources) {
	return (
		sources.find((source) => typeof source === "string" && source.trim()) ||
		null
	);
}

function spriteAsset(key, label, source) {
	return source ? { key, label, source } : null;
}

/**
 * Prefer explicitly authored sources, then reconstruct the established asset
 * paths. Missing optional files are hidden by the gallery after load failure.
 */
export function buildMonInfoSpriteGallery({
	gameKey,
	nationalDexId,
	formKey = null,
	resolvedInfo = {},
} = {}) {
	const generation = spriteGenerationForGameKey(gameKey);
	const generationNumber = Number(generation);
	const pokemonId = Number(nationalDexId);
	if (!gameKey || !Number.isFinite(pokemonId) || pokemonId <= 0) {
		return {
			generation,
			canShowModelViewer: false,
			groups: [],
		};
	}

	const sprites = resolvedInfo?.sprites || resolvedInfo?.spriteSet || {};
	const hasAnimatedSprites = generationNumber >= 5;
	const usesSpeciesIcons = /^(legendsarceus|legendsza)/.test(
		String(gameKey).toLowerCase(),
	);
	const hasMenuSprite = generationNumber >= 2 && !usesSpeciesIcons;
	const baseAssets = [
		spriteAsset(
			"front",
			"Front",
			firstSource(
				sprites.front,
				_frontSprite(generation, gameKey, pokemonId, formKey),
			),
		),
		spriteAsset(
			"back",
			"Back",
			firstSource(
				sprites.back,
				_backSprite(generation, gameKey, pokemonId, formKey),
			),
		),
		hasAnimatedSprites
			? spriteAsset(
					"front-animated",
					"Front (Animated)",
					firstSource(
						sprites.frontAnimated,
						_frontSpriteAnimated(
							generation,
							gameKey,
							pokemonId,
							formKey,
						),
					),
				)
			: null,
		hasAnimatedSprites
			? spriteAsset(
					"back-animated",
					"Back (Animated)",
					firstSource(
						sprites.backAnimated,
						_backSpriteAnimated(
							generation,
							gameKey,
							pokemonId,
							formKey,
						),
					),
				)
			: null,
		usesSpeciesIcons
			? spriteAsset(
					"icon",
					"Icon",
					firstSource(
						sprites.icon,
						_iconSprite(generation, gameKey, pokemonId, formKey),
					),
				)
			: null,
		hasMenuSprite
			? spriteAsset(
					"menu",
					"Menu Sprite",
					firstSource(
						sprites.menu,
						_menuSprite(generation, gameKey, pokemonId, formKey),
					),
				)
			: null,
	].filter(Boolean);
	const shinyAssets = [
		spriteAsset(
			"front-shiny",
			"Front",
			firstSource(
				sprites.frontShiny,
				_frontSpriteShiny(generation, gameKey, pokemonId, formKey),
			),
		),
		spriteAsset(
			"back-shiny",
			"Back",
			firstSource(
				sprites.backShiny,
				_backSpriteShiny(generation, gameKey, pokemonId, formKey),
			),
		),
		hasAnimatedSprites
			? spriteAsset(
					"front-shiny-animated",
					"Front (Animated)",
					firstSource(
						sprites.frontShinyAnimated,
						_frontSpriteShinyAnimated(
							generation,
							gameKey,
							pokemonId,
							formKey,
						),
					),
				)
			: null,
		hasAnimatedSprites
			? spriteAsset(
					"back-shiny-animated",
					"Back (Animated)",
					firstSource(
						sprites.backShinyAnimated,
						_backSpriteShinyAnimated(
							generation,
							gameKey,
							pokemonId,
							formKey,
						),
					),
				)
			: null,
		usesSpeciesIcons
			? spriteAsset(
					"icon-shiny",
					"Icon",
					firstSource(
						sprites.iconShiny,
						_iconSpriteShiny(
							generation,
							gameKey,
							pokemonId,
							formKey,
						),
					),
				)
			: null,
	].filter(Boolean);

	return {
		generation,
		canShowModelViewer: generationNumber >= 6,
		groups: [
			{ key: "base", label: "Base", assets: baseAssets },
			{
				key: "shiny",
				label: generationNumber === 1 ? "Color" : "Shiny",
				assets: shinyAssets,
			},
		].filter((group) => group.assets.length),
	};
}
