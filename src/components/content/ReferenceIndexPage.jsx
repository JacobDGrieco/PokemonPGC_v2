/** Searchable Move and Ability indexes backed by lazy generated JSON shards. */
import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
	loadReferenceDetail,
	loadReferenceManifest,
} from "../../../data/reference-indexes/_loader.js";
import {
	compareReferenceGameRelease,
	formatReferenceGameLabel,
	generationForVersionGroup,
	referenceGameTitles,
} from "../../../data/reference-indexes/game-mapping.js";
import { assetPath } from "../../utils/assetPath.js";
import {
	advancePokemonSpriteFallback,
	pokemonSpriteCandidates,
} from "../../utils/pokemonSprite.js";
import { normalizeReferenceLookupKey } from "../../utils/moveReference.js";
import { navigateToState } from "../../react-bridge/navigation.js";
import "./ReferenceIndexPage.css";

const INITIAL_RESULT_COUNT = 120;
const RESULT_INCREMENT = 120;
const INITIAL_POKEMON_COUNT = 80;
const NATIVE_LANGUAGE_NAMES = Object.freeze({
	de: "Deutsch",
	en: "English",
	es: "Español",
	"es-419": "Español (Latinoamérica)",
	fr: "Français",
	it: "Italiano",
	ja: "日本語（漢字）",
	"ja-hrkt": "日本語（ひらがな・カタカナ）",
	ko: "한국어",
	"zh-hans": "简体中文",
	"zh-hant": "繁體中文",
});

export function ReferenceIndexPage({ kind, initialSlug = null }) {
	const isMoveIndex = kind === "moves";
	const singularLabel = isMoveIndex ? "Move" : "Ability";
	const [manifest, setManifest] = useState(null);
	const [loadError, setLoadError] = useState("");
	const [query, setQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [visibleCount, setVisibleCount] = useState(INITIAL_RESULT_COUNT);
	const [selectedSlug, setSelectedSlug] = useState(initialSlug);
	const [detail, setDetail] = useState(null);
	const [isDetailLoading, setIsDetailLoading] = useState(false);
	const deferredQuery = useDeferredValue(query.trim().toLowerCase());

	useEffect(() => {
		let isCancelled = false;
		setLoadError("");
		loadReferenceManifest(kind)
			.then((loadedManifest) => {
				if (!isCancelled) setManifest(loadedManifest);
			})
			.catch((error) => {
				if (!isCancelled)
					setLoadError(error.message || `Unable to load ${kind}.`);
			});
		return () => {
			isCancelled = true;
		};
	}, [kind]);

	useEffect(() => {
		setSelectedSlug(initialSlug || null);
	}, [initialSlug]);

	const resolvedSelectedSlug = useMemo(() => {
		if (!manifest || !selectedSlug) return null;
		if (manifest.entries?.[selectedSlug]) return selectedSlug;
		return (
			manifest.aliases?.[normalizeReferenceLookupKey(selectedSlug)] ||
			null
		);
	}, [manifest, selectedSlug]);

	useEffect(() => {
		if (!manifest || !resolvedSelectedSlug) {
			setDetail(null);
			setIsDetailLoading(false);
			return undefined;
		}
		const summary = manifest.entries?.[resolvedSelectedSlug];
		if (!summary?.path) return undefined;
		let isCancelled = false;
		setIsDetailLoading(true);
		loadReferenceDetail(kind, summary.path)
			.then((loadedDetail) => {
				if (!isCancelled) setDetail(loadedDetail);
			})
			.catch((error) => {
				if (!isCancelled)
					setLoadError(
						error.message || `Unable to load ${singularLabel}.`,
					);
			})
			.finally(() => {
				if (!isCancelled) setIsDetailLoading(false);
			});
		return () => {
			isCancelled = true;
		};
	}, [kind, manifest, resolvedSelectedSlug, singularLabel]);

	const allEntries = useMemo(
		() => Object.values(manifest?.entries || {}),
		[manifest],
	);
	const types = useMemo(
		() =>
			isMoveIndex
				? [
						...new Set(
							allEntries
								.map((entry) => entry.type)
								.filter(Boolean),
						),
					].sort()
				: [],
		[allEntries, isMoveIndex],
	);
	const filteredEntries = useMemo(() => {
		return allEntries.filter((entry) => {
			if (typeFilter !== "all" && entry.type !== typeFilter) return false;
			if (!deferredQuery) return true;
			const searchable = [
				entry.name,
				entry.slug,
				...Object.values(entry.names || {}),
			]
				.join(" ")
				.toLowerCase();
			return searchable.includes(deferredQuery);
		});
	}, [allEntries, deferredQuery, typeFilter]);
	const visibleEntries = filteredEntries.slice(0, visibleCount);

	const resetFilters = (nextQuery = query, nextType = typeFilter) => {
		setQuery(nextQuery);
		setTypeFilter(nextType);
		setVisibleCount(INITIAL_RESULT_COUNT);
	};
	const selectReference = (slug) => {
		setSelectedSlug(slug || null);
		navigateToState({
			level: "tools",
			toolsKey: kind,
			referenceSlug: slug || null,
			genKey: null,
			gameKey: null,
			sectionId: null,
			monInfoId: null,
			monInfoGameKey: null,
			monInfoForm: null,
		});
	};

	if (loadError && !manifest) {
		return <div className="react-loading-state">{loadError}</div>;
	}
	if (!manifest) {
		return (
			<div className="react-loading-state">
				Loading {singularLabel} Index…
			</div>
		);
	}
	if (selectedSlug && !resolvedSelectedSlug) {
		return (
			<section className="page reference-detail-page">
				<button
					type="button"
					className="reference-detail-back"
					onClick={() => selectReference(null)}
				>
					â† Back to {singularLabel} Index
				</button>
				<div className="react-loading-state">
					{singularLabel} reference entry not found.
				</div>
			</section>
		);
	}
	if (selectedSlug) {
		return (
			<ReferenceDetailView
				kind={kind}
				detail={detail}
				isLoading={isDetailLoading}
				onBack={() => selectReference(null)}
			/>
		);
	}

	return (
		<section className="page reference-index-page">
			<header className="reference-index-header">
				<div>
					<p className="reference-index-kicker">Reference Library</p>
					<h2 className="page-title">{singularLabel} Index</h2>
					<p className="reference-index-summary">
						{manifest.entryCount.toLocaleString()} {kind}, localized
						names, game descriptions, and Pokemon availability.
					</p>
				</div>
				<div className="reference-index-controls">
					<label>
						<span>Search</span>
						<input
							type="search"
							value={query}
							onChange={(event) =>
								resetFilters(event.target.value, typeFilter)
							}
							placeholder={`Search ${kind} or translated names`}
							autoComplete="off"
						/>
					</label>
					{isMoveIndex ? (
						<label>
							<span>Type</span>
							<select
								value={typeFilter}
								onChange={(event) =>
									resetFilters(query, event.target.value)
								}
							>
								<option value="all">All types</option>
								{types.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
						</label>
					) : null}
				</div>
			</header>

			<p className="reference-index-count" role="status">
				Showing {visibleEntries.length.toLocaleString()} of{" "}
				{filteredEntries.length.toLocaleString()}
			</p>
			<div
				className={`reference-index-list ${isMoveIndex ? "is-move-grid" : "is-ability-grid"}`}
			>
				{visibleEntries.map((entry) => (
					<ReferenceIndexRow
						key={entry.slug}
						entry={entry}
						kind={kind}
						onSelect={() => selectReference(entry.slug)}
					/>
				))}
			</div>
			{visibleEntries.length < filteredEntries.length ? (
				<button
					type="button"
					className="button reference-load-more"
					onClick={() =>
						setVisibleCount((current) => current + RESULT_INCREMENT)
					}
				>
					Show{" "}
					{Math.min(
						RESULT_INCREMENT,
						filteredEntries.length - visibleEntries.length,
					)}{" "}
					more
				</button>
			) : null}
		</section>
	);
}

function ReferenceIndexRow({ entry, kind, onSelect }) {
	const isMove = kind === "moves";
	if (isMove) {
		const visiblePower = entry.power ?? "—";
		return (
			<button
				type="button"
				className="reference-move-card"
				onClick={onSelect}
				aria-label={`${entry.name}: ${entry.type}, ${entry.damageClass}, ${entry.power ?? "no listed"} base power`}
			>
				<strong className="reference-move-card-name">
					{entry.name}
				</strong>
				<span className="reference-move-card-meta" aria-hidden="true">
					<ElementTypeIcon type={entry.type} />
					<MoveCategoryIcon category={entry.damageClass} />
					<strong className="reference-move-card-power">
						{visiblePower}
					</strong>
				</span>
			</button>
		);
	}
	return (
		<button
			type="button"
			className="reference-ability-card"
			onClick={onSelect}
			aria-label={entry.name}
		>
			<strong className="reference-ability-card-name">
				{entry.name}
			</strong>
		</button>
	);
}

function ReferenceDetailView({ kind, detail, isLoading, onBack }) {
	const [language, setLanguage] = useState("en");
	const [pokemonQuery, setPokemonQuery] = useState("");
	const [gameFilter, setGameFilter] = useState("all");
	const [visiblePokemon, setVisiblePokemon] = useState(INITIAL_POKEMON_COUNT);
	const isMove = kind === "moves";
	const languages = useMemo(() => {
		if (!detail) return ["en"];
		return [
			...new Set([
				...Object.keys(detail.names || {}),
				...(detail.effectEntries || []).map((entry) => entry.language),
				...(detail.descriptions || []).map((entry) => entry.language),
			]),
		]
			.filter(Boolean)
			.sort();
	}, [detail]);
	const pokemonRelationships = useMemo(
		() =>
			normalizePokemonRelationships(
				detail?.learners || detail?.pokemon || [],
			),
		[detail],
	);
	const gameOptions = useMemo(
		() => collectRelationshipGames(pokemonRelationships),
		[pokemonRelationships],
	);

	useEffect(() => {
		setLanguage(languages.includes("en") ? "en" : languages[0] || "en");
		setPokemonQuery("");
		setGameFilter("all");
		setVisiblePokemon(INITIAL_POKEMON_COUNT);
	}, [detail?.slug, languages]);

	if (isLoading || !detail) {
		return (
			<div className="page reference-detail-page">
				<button type="button" className="button" onClick={onBack}>
					← Back to index
				</button>
				<div className="react-loading-state">
					Loading reference entry…
				</div>
			</div>
		);
	}

	const selectedEffects = selectLocalizedEntries(
		detail.effectEntries,
		language,
	);
	const selectedDescriptions = selectLocalizedEntries(
		detail.descriptions,
		language,
	).sort((left, right) =>
		compareReferenceGameRelease(left.versionGroup, right.versionGroup),
	);
	const normalizedPokemonQuery = pokemonQuery.trim().toLowerCase();
	const filteredPokemon = pokemonRelationships.filter((pokemon) => {
		const matchesQuery =
			!normalizedPokemonQuery ||
			`${pokemon.speciesName} ${pokemon.formName}`
				.toLowerCase()
				.includes(normalizedPokemonQuery);
		const matchesGame =
			gameFilter === "all" ||
			pokemon.games?.some((game) => game.profileKey === gameFilter);
		return matchesQuery && matchesGame;
	});
	const visiblePokemonRows = filteredPokemon.slice(0, visiblePokemon);

	return (
		<section className="page reference-detail-page">
			<button
				type="button"
				className="reference-detail-back"
				onClick={onBack}
			>
				← Back to {isMove ? "Move" : "Ability"} Index
			</button>
			<header className="reference-detail-header">
				<div>
					<p className="reference-index-kicker">
						Generation {detail.generation || "?"}{" "}
						{isMove ? "Move" : "Ability"}
					</p>
					<h2 className="page-title">{detail.name}</h2>
				</div>
				{isMove ? <MoveMetrics detail={detail} /> : null}
			</header>

			<section className="reference-detail-section">
				<div className="reference-effect-heading">
					<div>
						<h3>Effect</h3>
						<p className="reference-localized-name">
							{detail.names?.[language] || detail.name}
						</p>
					</div>
					<label className="reference-language-control">
						<span>Language</span>
						<select
							value={language}
							onChange={(event) =>
								setLanguage(event.target.value)
							}
						>
							{languages.map((languageCode) => (
								<option key={languageCode} value={languageCode}>
									{formatLanguageName(languageCode)}
								</option>
							))}
						</select>
					</label>
				</div>
				{selectedEffects.length ? (
					selectedEffects.map((entry, index) => (
						<div
							key={`${entry.language}-${index}`}
							className="reference-effect-copy"
						>
							{entry.shortEffect ? (
								<strong>
									{cleanEffectText(
										entry.shortEffect,
										detail.effectChance,
									)}
								</strong>
							) : null}
							{entry.effect ? (
								<p>
									{cleanEffectText(
										entry.effect,
										detail.effectChance,
									)}
								</p>
							) : null}
						</div>
					))
				) : (
					<p>No effect text is available in this language.</p>
				)}
			</section>

			<section className="reference-detail-section">
				<h3>Game descriptions</h3>
				<div className="reference-description-list">
					{selectedDescriptions.length ? (
						selectedDescriptions.map((entry, index) => (
							<div
								key={`${entry.versionGroup}-${index}`}
								className="reference-description-row"
							>
								<strong>
									<ReferenceGameLabel
										gameKey={entry.versionGroup}
									/>
								</strong>
								<span>{entry.text}</span>
							</div>
						))
					) : (
						<p>
							No game description is available in this language.
						</p>
					)}
				</div>
			</section>

			{isMove && detail.machines?.length ? (
				<MachineHistory machines={detail.machines} type={detail.type} />
			) : null}

			<section className="reference-detail-section reference-pokemon-section">
				<div className="reference-pokemon-heading">
					<div>
						<h3>Pokemon availability</h3>
						<p>
							{filteredPokemon.length.toLocaleString()} local
							forms with game-specific data
						</p>
					</div>
					<div className="reference-pokemon-filters">
						<label>
							<span>Filter Pokemon</span>
							<input
								type="search"
								value={pokemonQuery}
								onChange={(event) => {
									setPokemonQuery(event.target.value);
									setVisiblePokemon(INITIAL_POKEMON_COUNT);
								}}
								placeholder="Name or form"
							/>
						</label>
						<label>
							<span>Game</span>
							<select
								value={gameFilter}
								onChange={(event) => {
									setGameFilter(event.target.value);
									setVisiblePokemon(INITIAL_POKEMON_COUNT);
								}}
							>
								<option value="all">All games</option>
								{gameOptions.map((game) => (
									<option
										key={game.profileKey}
										value={game.profileKey}
									>
										{formatReferenceGameLabel(
											game.profileKey,
											game.gameLabel,
										)}
									</option>
								))}
							</select>
						</label>
					</div>
				</div>
				<div className="reference-pokemon-list">
					{visiblePokemonRows.map((pokemon) => (
						<PokemonRelationshipCard
							key={`${pokemon.nationalDexId}:${pokemon.formKey}`}
							pokemon={pokemon}
							isMove={isMove}
							machines={detail.machines}
							gameFilter={gameFilter}
						/>
					))}
					{visiblePokemonRows.length === 0 ? (
						<p className="reference-pokemon-empty">
							No Pokemon match the selected filters.
						</p>
					) : null}
				</div>
				{visiblePokemonRows.length < filteredPokemon.length ? (
					<button
						type="button"
						className="button reference-load-more"
						onClick={() =>
							setVisiblePokemon(
								(current) => current + INITIAL_POKEMON_COUNT,
							)
						}
					>
						Show{" "}
						{Math.min(
							INITIAL_POKEMON_COUNT,
							filteredPokemon.length - visiblePokemonRows.length,
						)}{" "}
						more
					</button>
				) : null}
			</section>
		</section>
	);
}

function MoveMetrics({ detail }) {
	return (
		<div className="reference-move-metrics">
			<span className="reference-move-metric-icon">
				<ElementTypeIcon type={detail.type} isDetail />
			</span>
			<span className="reference-move-metric-icon">
				<MoveCategoryIcon category={detail.damageClass} isDetail />
			</span>
			<span>
				<small>Power</small>
				<strong>{detail.power ?? "—"}</strong>
			</span>
			<span>
				<small>Accuracy</small>
				<strong>
					{detail.accuracy != null ? `${detail.accuracy}%` : "—"}
				</strong>
			</span>
			<span>
				<small>PP</small>
				<strong>{detail.pp ?? "—"}</strong>
			</span>
		</div>
	);
}

function ElementTypeIcon({ type, isDetail = false }) {
	const normalizedType = String(type || "unknown").toLowerCase();
	// The asset collection retains this historical filename typo.
	const assetType = normalizedType === "poison" ? "posion" : normalizedType;
	return (
		<img
			className={`reference-move-type-icon${isDetail ? " is-detail" : ""}`}
			src={assetPath(`typings/${assetType}.png`)}
			alt={`${type} type`}
			title={`${type} type`}
			loading="lazy"
		/>
	);
}

function MoveCategoryIcon({ category, isDetail = false }) {
	const normalizedCategory = String(category || "status").toLowerCase();
	return (
		<img
			className={`reference-move-category-icon${isDetail ? " is-detail" : ""}`}
			src={assetPath(`move-types/${normalizedCategory}-home.png`)}
			alt={`${category} move`}
			title={`${category} move`}
			loading="lazy"
		/>
	);
}

function ReferenceGameLabel({ gameKey, fallbackLabel = "" }) {
	const titles = referenceGameTitles(gameKey, fallbackLabel);
	return (
		<span
			className="reference-game-label"
			aria-label={formatReferenceGameLabel(gameKey, fallbackLabel)}
		>
			{titles.map((title, index) => (
				<span key={`${title}:${index}`}>{title}</span>
			))}
		</span>
	);
}

function MachineHistory({ machines, type }) {
	return (
		<section className="reference-detail-section">
			<h3>Machine history</h3>
			<div className="reference-machine-list">
				{machines.map((machine) => (
					<div
						key={`${machine.versionGroup}:${machine.kind}:${machine.number}`}
						className="reference-machine-row"
					>
						<img
							src={assetPath(
								machineAssetPath(
									machine.kind,
									machine.versionGroup,
									type,
								),
							)}
							alt=""
							loading="lazy"
						/>
						<strong>
							{machine.kind}
							{String(machine.number).padStart(2, "0")}
						</strong>
						<span>
							{formatReferenceGameLabel(machine.versionGroup)}
						</span>
					</div>
				))}
			</div>
		</section>
	);
}

function PokemonRelationshipCard({
	pokemon,
	isMove,
	machines = [],
	gameFilter,
}) {
	const sortedGames = [...(pokemon.games || [])].sort((left, right) =>
		compareReferenceGameRelease(left.profileKey, right.profileKey),
	);
	const selectedGame =
		gameFilter === "all"
			? null
			: sortedGames.find((game) => game.profileKey === gameFilter);
	const acquisitionText = selectedGame
		? isMove
			? formatMoveMethods(
					selectedGame.methods,
					selectedGame.versionGroup,
					machines,
				)
			: selectedGame.isHidden
				? "Hidden Ability"
				: "Standard Ability"
		: `${sortedGames.length.toLocaleString()} available ${sortedGames.length === 1 ? "game" : "games"}`;
	const spriteCandidates = pokemonSpriteCandidates({
		nationalDexId: pokemon.nationalDexId,
		formKey: pokemon.formKey,
		profileKey: selectedGame?.profileKey,
		allGames: !selectedGame,
	});

	return (
		<article className="reference-pokemon-card">
			<div className="reference-pokemon-card-identity">
				<img
					src={spriteCandidates[0]}
					alt=""
					width="56"
					height="56"
					loading="lazy"
					data-sprite-candidate-index="0"
					onError={(event) =>
						advancePokemonSpriteFallback(event, spriteCandidates)
					}
				/>
				<div>
					<strong>{pokemon.speciesName}</strong>
					<span>
						#{String(pokemon.nationalDexId).padStart(4, "0")} ·{" "}
						{pokemon.formName}
					</span>
				</div>
			</div>
			<div className="reference-pokemon-card-game">
				<span>
					{acquisitionText || "Acquisition method unavailable"}
				</span>
			</div>
		</article>
	);
}

/** Collapse identical gender variants without hiding genuine relationship differences. */
function normalizePokemonRelationships(pokemonRelationships) {
	const pokemonByIdentity = new Map(
		pokemonRelationships.map((pokemon) => [
			`${pokemon.nationalDexId}:${pokemon.formKey}`,
			pokemon,
		]),
	);
	return pokemonRelationships.flatMap((pokemon) => {
		const genderForm = parseGenderFormKey(pokemon.formKey);
		if (!genderForm) return [pokemon];
		const counterpart = pokemonByIdentity.get(
			`${pokemon.nationalDexId}:${genderForm.counterpartFormKey}`,
		);
		if (
			!counterpart ||
			pokemonRelationshipSignature(pokemon) !==
				pokemonRelationshipSignature(counterpart)
		) {
			return [pokemon];
		}
		if (genderForm.gender === "female") return [];
		const normalizedFormKey = genderForm.baseFormKey;
		return [
			{
				...pokemon,
				formKey: normalizedFormKey,
				formName:
					normalizedFormKey === "base"
						? "Base"
						: normalizedFormKey
								.split("-")
								.map(
									(part) =>
										part.charAt(0).toUpperCase() +
										part.slice(1),
								)
								.join(" "),
			},
		];
	});
}

function parseGenderFormKey(formKey) {
	const normalizedKey = String(formKey || "").toLowerCase();
	const match = normalizedKey.match(/^(?:(.+)-)?(male|female)$/);
	if (!match) return null;
	const prefix = match[1] || "";
	const gender = match[2];
	const counterpartGender = gender === "male" ? "female" : "male";
	return {
		gender,
		baseFormKey: prefix || "base",
		counterpartFormKey: prefix
			? `${prefix}-${counterpartGender}`
			: counterpartGender,
	};
}

function pokemonRelationshipSignature(pokemon) {
	return JSON.stringify(
		[...(pokemon.games || [])]
			.sort((left, right) =>
				String(left.profileKey).localeCompare(String(right.profileKey)),
			)
			.map((game) => ({
				profileKey: game.profileKey,
				versionGroup: game.versionGroup,
				isHidden: Boolean(game.isHidden),
				methods: [...(game.methods || [])].sort((left, right) =>
					JSON.stringify(left).localeCompare(JSON.stringify(right)),
				),
			})),
	);
}

/** Build one chronologically ordered game option from every relationship. */
function collectRelationshipGames(pokemonRelationships) {
	const gamesByProfile = new Map();
	for (const pokemon of pokemonRelationships) {
		for (const game of pokemon.games || []) {
			if (!game.profileKey || gamesByProfile.has(game.profileKey))
				continue;
			gamesByProfile.set(game.profileKey, {
				profileKey: game.profileKey,
				gameLabel: formatReferenceGameLabel(
					game.profileKey,
					game.gameLabel,
				),
			});
		}
	}
	return [...gamesByProfile.values()].sort((left, right) =>
		compareReferenceGameRelease(left.profileKey, right.profileKey),
	);
}

function selectLocalizedEntries(entries = [], language) {
	const selected = entries.filter((entry) => entry.language === language);
	if (selected.length || language === "en") return selected;
	return entries.filter((entry) => entry.language === "en");
}

function formatLanguageName(languageCode) {
	if (NATIVE_LANGUAGE_NAMES[languageCode]) {
		return NATIVE_LANGUAGE_NAMES[languageCode];
	}
	try {
		return (
			new Intl.DisplayNames([languageCode], { type: "language" }).of(
				languageCode,
			) || languageCode
		);
	} catch {
		return languageCode;
	}
}

function formatMoveMethods(methods = [], versionGroup, machines = []) {
	return methods
		.map((method) => {
			if (method.level != null)
				return `${method.method}, Lv. ${method.level}`;
			if (/machine|tm|tr|hm/i.test(String(method.method || ""))) {
				const machine = machines.find(
					(candidate) => candidate.versionGroup === versionGroup,
				);
				if (machine) {
					return `${machine.kind}${String(machine.number).padStart(2, "0")} (${method.method})`;
				}
			}
			return method.method;
		})
		.join(" · ");
}

function cleanEffectText(value, effectChance = null) {
	return String(value || "")
		.replace(/\[([^\]]+)]\{[^}]+}/g, "$1")
		.replace(/\$effect_chance/g, effectChance ?? "the listed")
		.trim();
}

function machineAssetPath(kind, versionGroup, type) {
	const normalizedType = String(type || "normal").toLowerCase();
	if (kind === "TR") return `items/thms/trs/${normalizedType}.png`;
	const generation = generationFromVersionGroup(versionGroup);
	// The remakes and Legends: Z-A use the later sprite families even though
	// they share a numbered generation with the preceding paired games.
	const folder =
		versionGroup === "brilliant-diamond-shining-pearl"
			? "gen8_2"
			: versionGroup === "legends-z-a"
				? "gen9_2"
				: generation <= 5
					? "gen1-5"
					: generation <= 8
						? "gen6-8"
						: "gen9";
	const machineFolder = kind === "HM" ? "hms" : "tms";
	return `items/thms/${machineFolder}/${folder}/${normalizedType}.png`;
}

function generationFromVersionGroup(versionGroup) {
	return generationForVersionGroup(versionGroup);
}
