/** Game-aware sprite gallery for the dedicated Mon Info page. */
import React, { useEffect, useMemo, useState } from "react";
import { buildMonInfoSpriteGallery } from "../../utils/monInfoSprites.js";

// Keep gallery-only controls out of the homepage CSS budget.
if (typeof document !== "undefined") {
	void import("../../../styles/mon-info-sprites.css");
}

function SpriteAssetTile({ asset, pokemonName }) {
	const [hasFailed, setHasFailed] = useState(false);
	const isVideo = /\.webm(?:$|[?#])/i.test(asset.source);
	const accessibleLabel = `${pokemonName} ${asset.label.toLowerCase()} sprite`;

	if (hasFailed) return null;
	return (
		<figure className="asset-tile">
			{isVideo ? (
				<video
					src={asset.source}
					aria-label={accessibleLabel}
					autoPlay
					loop
					muted
					playsInline
					preload="metadata"
					onError={() => setHasFailed(true)}
				/>
			) : (
				<img
					src={asset.source}
					alt={accessibleLabel}
					loading="lazy"
					decoding="async"
					onError={() => setHasFailed(true)}
				/>
			)}
			<figcaption className="asset-label">{asset.label}</figcaption>
		</figure>
	);
}

export function MonInfoSprites({
	gameKey,
	nationalDexId,
	pokemonName = "Pokémon",
	formKey,
	resolvedInfo,
}) {
	const gallery = useMemo(
		() =>
			buildMonInfoSpriteGallery({
				gameKey,
				nationalDexId,
				formKey,
				resolvedInfo,
			}),
		[formKey, gameKey, nationalDexId, resolvedInfo],
	);
	const [activeGroupKey, setActiveGroupKey] = useState(
		gallery.groups[0]?.key || "base",
	);

	useEffect(() => {
		setActiveGroupKey(gallery.groups[0]?.key || "base");
	}, [gallery]);

	if (!gallery.groups.length) return null;
	const activeGroup =
		gallery.groups.find((group) => group.key === activeGroupKey) ||
		gallery.groups[0];

	return (
		<section
			className="mon-info-block mon-info-assets"
			aria-labelledby="mon-info-sprites-title"
		>
			<header className="mon-info-assets-heading">
				<h3 id="mon-info-sprites-title">Sprites</h3>
				{gallery.canShowModelViewer ? (
					<button
						className="mon-info-model-viewer-btn"
						type="button"
						disabled
						aria-label="Model Viewer, currently unavailable"
					>
						<span>Model Viewer</span>
						<small>Unavailable</small>
					</button>
				) : null}
			</header>

			<div
				className="asset-tabs"
				role="tablist"
				aria-label="Sprite variants"
			>
				{gallery.groups.map((group) => (
					<button
						key={group.key}
						id={`mon-info-sprites-tab-${group.key}`}
						className={`asset-tab${
							activeGroup.key === group.key ? " is-active" : ""
						}`}
						type="button"
						role="tab"
						aria-selected={activeGroup.key === group.key}
						onClick={() => setActiveGroupKey(group.key)}
					>
						{group.label}
					</button>
				))}
			</div>

			<div
				className="asset-panel is-active"
				role="tabpanel"
				aria-labelledby={`mon-info-sprites-tab-${activeGroup.key}`}
			>
				<div className="asset-grid">
					{activeGroup.assets.map((asset) => (
						<SpriteAssetTile
							key={asset.key}
							asset={asset}
							pokemonName={pokemonName}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
