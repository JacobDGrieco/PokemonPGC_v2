import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useSubscription } from "../hooks/useSubscription.js";
import {
	FEATURE_LABELS,
	FEATURE_NAVIGATION,
	TIERS,
	TIER_ORDER,
} from "../config/tiers.js";
import { assetPath } from "../utils/assetPath.js";
import { navigateToState } from "../react-bridge/navigation.js";
import { save } from "../store.js";
import "../../styles/homepage.css";

const FEATURE_TILES = [
	{
		key: "checklists",
		description:
			"Story beats, side objectives, dex cleanup, and postgame tasks in one run sheet.",
		accent: "var(--home-accent-red)",
	},
	{
		key: "pokemon-info",
		description:
			"Stats, forms, abilities, and fast reference data without breaking your hunt flow.",
		accent: "var(--home-accent-blue)",
	},
	{
		key: "guides",
		description:
			"Late-game cleanup routes, hidden encounter notes, and region-specific direction.",
		accent: "var(--home-accent-gold)",
	},
	{
		key: "tools",
		description:
			"Utility surfaces for planning tricky goals, edge cases, and hard-to-spot gaps.",
		accent: "var(--home-accent-cyan)",
	},
	{
		key: "global-stats",
		description:
			"Community comparison once trainer-wide data and leaderboard surfaces go live.",
		accent: "var(--home-accent-violet)",
	},
	{
		key: "model-viewer",
		description:
			"Dedicated 3D inspection when you want to study a model instead of a sprite.",
		accent: "var(--home-accent-green)",
	},
].map((tile) => ({
	...tile,
	...FEATURE_NAVIGATION.find((feature) => feature.key === tile.key),
}));

const HERO_FLOW = [
	{
		key: "catch",
		label: "Catch",
		imageBase: "image1",
		imageWidths: [320, 800],
		width: 2160,
		height: 2160,
		alt: "Catching a Pokémon in-game",
		accent: "var(--home-accent-red)",
	},
	{
		key: "dex",
		label: "Dex",
		imageBase: "image2",
		imageWidths: [320, 800],
		width: 823,
		height: 823,
		alt: "Pokémon appearing in the Pokédex",
		accent: "var(--home-accent-gold)",
	},
	{
		key: "checklist",
		label: "Check",
		imageBase: "image3",
		imageWidths: [320, 578],
		width: 578,
		height: 578,
		alt: "Checking off a Pokémon in the checklist",
		accent: "var(--home-accent-cyan)",
	},
];

const HOME_FOCUS_AREAS = [
	{
		label: "Story to postgame",
		description:
			"Keep your main run and the cleanup after it on the same board.",
	},
	{
		label: "Dex and forms",
		description:
			"Spot what is still missing before it turns into guesswork.",
	},
	{
		label: "Game-by-game runs",
		description:
			"Each title keeps its own pace, scope, and checklist logic.",
	},
	{
		label: "Tools when needed",
		description:
			"Guides, info, and utilities stay nearby without hijacking the homepage.",
	},
];

const TIER_STYLES = {
	free: { ball: "Poke Ball", accent: "var(--home-accent-red)" },
	great: { ball: "Great Ball", accent: "var(--home-accent-blue)" },
	ultra: { ball: "Ultra Ball", accent: "var(--home-accent-gold)" },
	master: { ball: "Master Ball", accent: "var(--home-accent-violet)" },
};

const STORY_STEPS = [
	"Choose a game and lock in your current run.",
	"See what is story-critical, optional, hidden, or still untouched.",
	"Branch into deeper intel only when you need it.",
];

const HERO_ORBIT_CONFIG = {
	yawRadians: (48 * Math.PI) / 180,
	pitchRadians: (12 * Math.PI) / 180,
	rollRadians: (-10 * Math.PI) / 180,
	samples: 120,
	speed: 0.000045,
};

const DEFAULT_ORBIT_VIEWPORT = { width: 720, height: 700 };
const HERO_IMAGE_SIZES = "(max-width: 820px) 180px, 360px";

function clamp(value, minimum, maximum) {
	return Math.min(Math.max(value, minimum), maximum);
}

function smoothstep(minimum, maximum, value) {
	const progress = clamp((value - minimum) / (maximum - minimum), 0, 1);
	return progress * progress * (3 - 2 * progress);
}

/**
 * Projects a point from a vertical 3D orbit into the hero stage. The same
 * projection drives both the SVG track and every image, preventing drift.
 */
function projectOrbitPoint(angle, viewport = DEFAULT_ORBIT_VIEWPORT) {
	const width = Math.max(viewport.width, 1);
	const height = Math.max(viewport.height, 1);
	const radius = Math.min(height * 0.34, width * 0.49);
	const orbitX = Math.cos(angle) * radius;
	const orbitY = Math.sin(angle) * radius;
	const { yawRadians, pitchRadians, rollRadians } = HERO_ORBIT_CONFIG;

	const yawX = orbitX * Math.cos(yawRadians);
	const yawZ = orbitX * Math.sin(yawRadians);
	const pitchY =
		orbitY * Math.cos(pitchRadians) - yawZ * Math.sin(pitchRadians);
	const pitchZ =
		orbitY * Math.sin(pitchRadians) + yawZ * Math.cos(pitchRadians);
	const rolledX =
		yawX * Math.cos(rollRadians) - pitchY * Math.sin(rollRadians);
	const rolledY =
		yawX * Math.sin(rollRadians) + pitchY * Math.cos(rollRadians);
	const perspectiveDistance = radius * 4.5;
	const perspective = clamp(
		perspectiveDistance / (perspectiveDistance - pitchZ),
		0.72,
		1.3,
	);
	const depth = clamp((pitchZ / (radius * 1.08) + 1) / 2, 0, 1);

	return {
		x: width * 0.5 + rolledX * perspective,
		y: height * 0.51 + rolledY * perspective,
		depth,
		perspective,
		orbitX: orbitX / radius,
		orbitY: orbitY / radius,
	};
}

/**
 * Samples the projected circle and fades its foreground segments by depth.
 * This avoids a hard z-index swap while the orbit passes through an image.
 */
function buildOrbitGeometry(viewport) {
	const points = Array.from(
		{ length: HERO_ORBIT_CONFIG.samples + 1 },
		(_, index) => {
			const angle = (index / HERO_ORBIT_CONFIG.samples) * Math.PI * 2;
			return projectOrbitPoint(angle, viewport);
		},
	);
	const path = points
		.map(
			(point, index) =>
				`${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
		)
		.join(" ");

	return {
		path: `${path} Z`,
		frontSegments: points.slice(0, -1).map((point, index) => {
			const nextPoint = points[index + 1];
			const depth = (point.depth + nextPoint.depth) / 2;

			return {
				d: `M${point.x.toFixed(2)} ${point.y.toFixed(2)} L${nextPoint.x.toFixed(2)} ${nextPoint.y.toFixed(2)}`,
				opacity: smoothstep(0.38, 0.62, depth),
			};
		}),
	};
}

function useOrbitViewport(targetRef) {
	const [viewport, setViewport] = useState(DEFAULT_ORBIT_VIEWPORT);

	useEffect(() => {
		const target = targetRef.current;
		if (!target) return undefined;

		const updateViewport = () => {
			const bounds = target.getBoundingClientRect();
			setViewport((currentViewport) => {
				if (
					Math.abs(currentViewport.width - bounds.width) < 0.5 &&
					Math.abs(currentViewport.height - bounds.height) < 0.5
				) {
					return currentViewport;
				}

				return { width: bounds.width, height: bounds.height };
			});
		};

		updateViewport();
		const resizeObserver =
			typeof ResizeObserver === "function"
				? new ResizeObserver(updateViewport)
				: null;
		resizeObserver?.observe(target);
		window.addEventListener("resize", updateViewport);

		return () => {
			resizeObserver?.disconnect();
			window.removeEventListener("resize", updateViewport);
		};
	}, [targetRef]);

	return viewport;
}

function useVisibleElapsedTime(targetRef) {
	const elapsedTime = useMotionValue(0);

	useEffect(() => {
		let animationFrameId = null;
		let previousTimestamp = null;
		let isIntersecting = true;
		const reducedMotionQuery = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);

		const stopAnimation = () => {
			if (animationFrameId != null)
				window.cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
			previousTimestamp = null;
		};
		const tick = (timestamp) => {
			if (previousTimestamp != null) {
				elapsedTime.set(
					elapsedTime.get() + timestamp - previousTimestamp,
				);
			}
			previousTimestamp = timestamp;
			animationFrameId = window.requestAnimationFrame(tick);
		};
		const syncAnimation = () => {
			const shouldAnimate =
				isIntersecting &&
				document.visibilityState !== "hidden" &&
				!reducedMotionQuery.matches;
			if (shouldAnimate && animationFrameId == null) {
				animationFrameId = window.requestAnimationFrame(tick);
			} else if (!shouldAnimate) {
				stopAnimation();
			}
		};

		const observer =
			typeof IntersectionObserver === "function" && targetRef.current
				? new IntersectionObserver(([entry]) => {
					isIntersecting = entry.isIntersecting;
					syncAnimation();
				})
				: null;
		if (observer && targetRef.current) observer.observe(targetRef.current);
		document.addEventListener("visibilitychange", syncAnimation);
		reducedMotionQuery.addEventListener("change", syncAnimation);
		syncAnimation();

		return () => {
			stopAnimation();
			observer?.disconnect();
			document.removeEventListener("visibilitychange", syncAnimation);
			reducedMotionQuery.removeEventListener("change", syncAnimation);
		};
	}, [elapsedTime, targetRef]);

	return elapsedTime;
}

function FlowPicture({ entry, index, isDecorative = false }) {
	const [smallImageWidth, largeImageWidth] = entry.imageWidths;

	return (
		<picture aria-hidden={isDecorative || undefined}>
			<source
				type="image/avif"
				srcSet={`/${entry.imageBase}-${smallImageWidth}.avif ${smallImageWidth}w, /${entry.imageBase}-${largeImageWidth}.avif ${largeImageWidth}w`}
				sizes={HERO_IMAGE_SIZES}
			/>
			<source
				type="image/webp"
				srcSet={`/${entry.imageBase}-${smallImageWidth}.webp ${smallImageWidth}w, /${entry.imageBase}-${largeImageWidth}.webp ${largeImageWidth}w`}
				sizes={HERO_IMAGE_SIZES}
			/>
			<img
				src={`/${entry.imageBase}-${largeImageWidth}.webp`}
				alt={isDecorative ? "" : entry.alt}
				width={entry.width}
				height={entry.height}
				loading={index === 1 ? "eager" : "lazy"}
				fetchPriority={index === 1 ? "high" : "auto"}
				decoding="async"
			/>
		</picture>
	);
}

function OrbitRing({ viewport, isForeground = false }) {
	const geometry = useMemo(
		() =>
			buildOrbitGeometry({
				width: viewport.width,
				height: viewport.height,
			}),
		[viewport.height, viewport.width],
	);
	const layerClass = isForeground
		? "home-orbit-ring-front"
		: "home-orbit-ring-back";

	return (
		<svg
			viewBox={`0 0 ${viewport.width} ${viewport.height}`}
			className={`home-orbit-ring ${layerClass}`}
			aria-hidden="true"
			focusable="false"
		>
			{isForeground ? (
				geometry.frontSegments.map((segment, index) => (
					<path
						key={index}
						className="home-orbit-ring-pulse"
						d={segment.d}
						style={{ opacity: segment.opacity }}
					/>
				))
			) : (
				<path className="home-orbit-ring-base" d={geometry.path} />
			)}
		</svg>
	);
}

function OrbitingFlowCard({ entry, index, elapsedTime, viewport }) {
	const progress = useTransform(elapsedTime, (value) => {
		const orbit =
			index / HERO_FLOW.length - value * HERO_ORBIT_CONFIG.speed;
		return ((orbit % 1) + 1) % 1;
	});

	const angle = useTransform(
		progress,
		(value) => value * Math.PI * 2 - Math.PI / 2,
	);
	const projectedPoint = useTransform(angle, (currentAngle) =>
		projectOrbitPoint(currentAngle, viewport),
	);
	const x = useTransform(
		projectedPoint,
		(point) => point.x - viewport.width * 0.5,
	);
	const y = useTransform(
		projectedPoint,
		(point) => point.y - viewport.height * 0.5,
	);
	const scale = useTransform(projectedPoint, (point) =>
		clamp(point.perspective * 0.92, 0.72, 1.18),
	);
	const rotateX = useTransform(
		projectedPoint,
		(point) => point.orbitY * -3.5,
	);
	const rotateY = useTransform(projectedPoint, (point) => point.orbitX * -7);
	const opacity = useTransform(
		projectedPoint,
		(point) => 0.46 + point.depth * 0.54,
	);
	const filter = useTransform(projectedPoint, (point) => {
		const blur = (1 - point.depth) * 3.2;
		const brightness = 0.74 + point.depth * 0.34;
		return `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(2)})`;
	});
	const zIndex = useTransform(projectedPoint, (point) =>
		Math.round(20 + point.depth * 30),
	);
	const foregroundZIndex = useTransform(projectedPoint, (point) =>
		Math.round(70 + point.depth * 30),
	);
	const cardStyle = {
		"--flow-accent": entry.accent,
		x,
		y,
		scale,
		rotateX,
		rotateY,
		filter,
		opacity,
	};

	return (
		<>
			<motion.div className="home-flow-card-track" style={{ zIndex }}>
				<motion.article
					className={`home-flow-card home-flow-card-${entry.key}`}
					style={cardStyle}
				>
					<div className="home-flow-card-top">
						<span>{String(index)}</span>
						<strong>{entry.label}</strong>
					</div>
					<div className="home-flow-image">
						<div className="home-flow-image-frame">
							<FlowPicture entry={entry} index={index} />
						</div>
					</div>
				</motion.article>
			</motion.div>

			<motion.div
				className="home-flow-card-track home-flow-card-overlay-track"
				style={{ zIndex: foregroundZIndex }}
				aria-hidden="true"
			>
				<motion.div
					className={`home-flow-card home-flow-card-overlay home-flow-card-${entry.key}`}
					style={cardStyle}
				>
					<div className="home-flow-card-top">
						<span>{String(index)}</span>
						<strong>{entry.label}</strong>
					</div>
					<div className="home-flow-image">
						<div className="home-flow-image-frame home-flow-image-foreground">
							<FlowPicture
								entry={entry}
								index={index}
								isDecorative
							/>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</>
	);
}

export function HomePage() {
	const navigate = useNavigate();
	const { tierKey } = useSubscription();
	const userRank = TIER_ORDER.indexOf(tierKey);
	const orbitStageRef = useRef(null);
	const orbitElapsedTime = useVisibleElapsedTime(orbitStageRef);
	const orbitViewport = useOrbitViewport(orbitStageRef);

	return (
		<div className="home-page">
			<section className="home-command" aria-labelledby="home-title">
				<div className="home-command-bg" aria-hidden="true">
					<div className="home-command-gradient" />
					<div className="home-command-grid" />
				</div>

				<div className="home-command-copy">
					<h1 id="home-title" className="home-command-title">
						From the dex to the check.
					</h1>
					<p className="home-command-body">
						Catch the Pokemon, watch it register, then track it
						cleanly in one place.
					</p>
					<div className="home-command-actions">
						<button
							type="button"
							className="home-cta-btn primary"
							onClick={() => {
								navigateToState({
									level: "gen",
									genKey: null,
									gameKey: null,
									sectionId: null,
								});
								save();
								navigate("/checklists");
							}}
						>
							Open Checklists
						</button>
						<Link to="/pricing" className="home-cta-btn ghost">
							View Tiers
						</Link>
					</div>
				</div>

				<div className="home-command-stage" aria-hidden="true">
					<div className="home-orbit-flow" ref={orbitStageRef}>
						<OrbitRing viewport={orbitViewport} />

						{HERO_FLOW.map((entry, index) => (
							<OrbitingFlowCard
								key={entry.key}
								entry={entry}
								index={index + 1}
								elapsedTime={orbitElapsedTime}
								viewport={orbitViewport}
							/>
						))}

						<OrbitRing viewport={orbitViewport} isForeground />
					</div>
				</div>
			</section>

			<div className="home-feature-layout">
				<section
					className="home-scout-strip"
					aria-labelledby="home-scout-title"
				>
					<div className="home-scout-copy">
						<h2 id="home-scout-title">
							A completion run gets messy. Your notes do not have
							to.
						</h2>
						<p>
							Story detours, missing forms, postgame cleanup, and
							that one objective you meant to revisit all stay in
							view.
						</p>
					</div>
					<div className="home-scout-metrics">
						{HOME_FOCUS_AREAS.map((area, index) => (
							<motion.article
								key={area.label}
								className="home-scout-metric"
								initial={{
									opacity: 0,
									x: index % 2 ? 18 : -18,
								}}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, margin: "-40px" }}
								transition={{
									duration: 0.4,
									delay: index * 0.07,
									ease: [0.22, 1, 0.36, 1],
								}}
							>
								<span className="home-scout-index">
									{String(index + 1).padStart(2, "0")}
								</span>
								<div>
									<strong>{area.label}</strong>
									<p>{area.description}</p>
								</div>
							</motion.article>
						))}
					</div>
				</section>

				<section
					className="home-atlas-copy home-atlas-panel"
					aria-labelledby="home-atlas-title"
				>
					<div className="home-atlas-intro">
						<h2 id="home-atlas-title">
							Leave a clean trail back to every unfinished goal.
						</h2>
					</div>
					<ol className="home-atlas-steps">
						{STORY_STEPS.map((step, index) => (
							<li key={step} className="home-atlas-step">
								<span>
									{String(index + 1).padStart(2, "0")}
								</span>
								<strong>{step}</strong>
							</li>
						))}
					</ol>
				</section>

				<section
					className="home-route-board"
					aria-labelledby="home-route-board-title"
				>
					<div className="home-route-intro">
						<h2 id="home-route-board-title">
							Pick a destination. Keep the run moving.
						</h2>
						<p>
							Checklists are the main route. Everything else stays
							close enough to reach when a run needs deeper intel.
						</p>
					</div>

					<div className="home-route-list">
						{FEATURE_TILES.map((tile, index) => {
							const tileRank = TIER_ORDER.indexOf(tile.minTier);
							const isLocked = userRank < tileRank;

							return (
								<motion.button
									key={tile.key}
									type="button"
									className={`home-route-stop${isLocked ? " is-locked" : ""}${index === 0 ? " is-primary" : ""}`}
									style={{ "--feature-accent": tile.accent }}
									onClick={() =>
										navigate(
											isLocked ? "/pricing" : tile.path,
										)
									}
									initial={{ opacity: 0, y: 22 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: "-50px" }}
									transition={{
										duration: 0.38,
										delay: index * 0.05,
										ease: [0.22, 1, 0.36, 1],
									}}
								>
									<span className="home-route-index">
										{String(index + 1).padStart(2, "0")}
									</span>
									<div className="home-route-main">
										<div className="home-route-topline">
											<strong>{tile.label}</strong>
										</div>
										<p>{tile.description}</p>
									</div>
									<div className="home-route-status">
										<span>
											{isLocked ? "Upgrade" : "Open"}
											<i
												className={`pi ${isLocked ? "pi-lock" : "pi-arrow-up-right"}`}
												aria-hidden="true"
											/>
										</span>
									</div>
								</motion.button>
							);
						})}
					</div>
				</section>

				<section
					className="home-atlas-panel home-atlas-rank-panel"
					aria-labelledby="home-rank-title"
				>
					<div className="home-rank-intro">
						<h2 id="home-rank-title">
							Choose how deep you want the field kit to go.
						</h2>
						<Link to="/pricing">Compare every rank</Link>
					</div>
					<div className="home-tier-grid">
						{TIER_ORDER.map((rankKey, index) => {
							const tier = TIERS[rankKey];
							const features = tier.marketingBenefits;
							const isActive = rankKey === tierKey;
							const isUnavailable =
								rankKey !== "free" && !tier.isPurchasable;

							return (
								<article
									key={rankKey}
									className={`home-tier-card${isActive ? " is-active" : ""}${isUnavailable ? " is-unavailable" : ""}`}
									aria-label={`${tier.label}${isActive ? ", current rank" : ""}${isUnavailable ? ", coming later" : ""}`}
									style={{
										"--tier-accent":
											TIER_STYLES[rankKey]?.accent ||
											"var(--home-accent-gold)",
									}}
								>
									<div
										className="home-tier-ball"
										aria-hidden="true"
									>
										<span>
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>
									<div className="home-tier-card-top">
										<strong>{tier.label}</strong>
										<i>
											{isUnavailable
												? `Coming later · ${tier.price}`
												: tier.price}
										</i>
									</div>
									<ul className="home-tier-feature-list">
										{features.map((feature) => (
											<li key={feature}>{feature}</li>
										))}
									</ul>
								</article>
							);
						})}
					</div>
				</section>
			</div>
		</div>
	);
}
