import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useTime, useTransform } from 'motion/react';
import { useSubscription } from '../hooks/useSubscription.js';
import { FEATURE_LABELS, TIERS, TIER_ORDER } from '../config/tiers.js';
import { _assetPath } from '../utils/assetPath.js';
import { PokeBallParticles } from '../components/common/PokeBallParticles.jsx';
import { navigateToState } from '../react-bridge/navigation.js';
import { save } from '../store.js';

const FEATURE_TILES = [
	{
		key: 'checklists',
		label: 'Checklists',
		description: 'Story beats, side objectives, dex cleanup, and postgame tasks in one run sheet.',
		path: '/checklists',
		minTier: 'free',
		accent: 'var(--home-accent-red)',
		stat: 'Core route',
	},
	{
		key: 'pokemon-info',
		label: 'Pokemon Info',
		description: 'Stats, forms, abilities, and fast reference data without breaking your hunt flow.',
		path: '/pokemon-info',
		minTier: 'great',
		accent: 'var(--home-accent-blue)',
		stat: 'Field intel',
	},
	{
		key: 'guides',
		label: 'Guides',
		description: 'Late-game cleanup routes, hidden encounter notes, and region-specific direction.',
		path: '/guides',
		minTier: 'ultra',
		accent: 'var(--home-accent-gold)',
		stat: 'Route notes',
	},
	{
		key: 'tools',
		label: 'Tools',
		description: 'Utility surfaces for planning tricky goals, edge cases, and hard-to-spot gaps.',
		path: '/tools',
		minTier: 'ultra',
		accent: 'var(--home-accent-cyan)',
		stat: 'Support gear',
	},
	{
		key: 'global-stats',
		label: 'Global Stats',
		description: 'Community comparison once trainer-wide data and leaderboard surfaces go live.',
		path: '/global-stats',
		minTier: 'ultra',
		accent: 'var(--home-accent-violet)',
		stat: 'League board',
	},
	{
		key: 'model-viewer',
		label: 'Model Viewer',
		description: 'Dedicated 3D inspection when you want to study a model instead of a sprite.',
		path: '/model-viewer',
		minTier: 'master',
		accent: 'var(--home-accent-green)',
		stat: 'Full display',
	},
];

const HERO_FLOW = [
	{
		key: 'catch',
		label: 'Catch In-Game',
		image: 'image1.png',
		alt: 'Catching a Pokémon in-game',
		accent: 'var(--home-accent-red)',
	},
	{
		key: 'dex',
		label: 'Log in the Dex',
		image: 'image2.png',
		alt: 'Pokémon appearing in the Pokédex',
		accent: 'var(--home-accent-gold)',
	},
	{
		key: 'checklist',
		label: 'Check it off here',
		image: 'image3.png',
		alt: 'Checking off a Pokémon in the checklist',
		accent: 'var(--home-accent-cyan)',
	},
];

const HOME_FOCUS_AREAS = [
	{
		label: 'Story to postgame',
		description: 'Keep your main run and the cleanup after it on the same board.',
	},
	{
		label: 'Dex and forms',
		description: 'Spot what is still missing before it turns into guesswork.',
	},
	{
		label: 'Game-by-game runs',
		description: 'Each title keeps its own pace, scope, and checklist logic.',
	},
	{
		label: 'Tools when needed',
		description: 'Guides, info, and utilities stay nearby without hijacking the homepage.',
	},
];

const TIER_STYLES = {
	free: { ball: 'Poke Ball', accent: 'var(--home-accent-red)' },
	great: { ball: 'Great Ball', accent: 'var(--home-accent-blue)' },
	ultra: { ball: 'Ultra Ball', accent: 'var(--home-accent-gold)' },
	master: { ball: 'Master Ball', accent: 'var(--home-accent-violet)' },
};

const STORY_STEPS = [
	'Choose a game and lock in your current run.',
	'See what is story-critical, optional, hidden, or still untouched.',
	'Branch into deeper intel only when you need it.',
];

const HERO_ORBIT_CONFIG = {
	baseRadiusX: 244,
	baseRadiusY: 146,
	speed: 0.00007,
};

function tierFeaturesFor(key) {
	const tierIndex = TIER_ORDER.indexOf(key);
	const tier = TIERS[key];
	const previousTier = tierIndex > 0 ? TIERS[TIER_ORDER[tierIndex - 1]] : null;
	const baseFeatures = previousTier ? previousTier.features : [];
	return tier.features
		.filter((feature) => !baseFeatures.includes(feature))
		.map((feature) => FEATURE_LABELS[feature] || feature);
}

function OrbitingFlowCard({ entry, index }) {
	const time = useTime();
	const progress = useTransform(time, (value) => {
		const orbit = index / HERO_FLOW.length - value * HERO_ORBIT_CONFIG.speed;
		return ((orbit % 1) + 1) % 1;
	});

	const angle = useTransform(progress, (value) => value * Math.PI * 2 - Math.PI / 2);
	const radiusX = useTransform(progress, (value) => HERO_ORBIT_CONFIG.baseRadiusX + Math.sin(value * Math.PI * 2) * 14);
	const radiusY = useTransform(progress, (value) => HERO_ORBIT_CONFIG.baseRadiusY + Math.cos(value * Math.PI * 2) * 10);
	const x = useTransform([angle, radiusX], ([currentAngle, currentRadiusX]) => Math.cos(currentAngle) * currentRadiusX);
	const y = useTransform([angle, radiusY], ([currentAngle, currentRadiusY]) => Math.sin(currentAngle) * currentRadiusY);
	const depth = useTransform(progress, (value) => (Math.cos(value * Math.PI * 2 - Math.PI / 2) + 1) / 2);

	const scale = useTransform(depth, [0, 1], [0.68, 1.08]);
	const blur = useTransform(depth, [0, 1], [3.8, 0]);
	const opacity = useTransform(depth, [0, 1], [0.42, 1]);
	const brightness = useTransform(depth, [0, 1], [0.72, 1.1]);
	const zIndex = useTransform(depth, (value) => Math.round(20 + value * 30));
	const filter = useTransform(
		[blur, brightness],
		([currentBlur, currentBrightness]) => `blur(${currentBlur.toFixed(2)}px) brightness(${currentBrightness.toFixed(2)})`
	);

	return (
		<div className="home-flow-card-track">
			<motion.article
				className={`home-flow-card home-flow-card-${entry.key}`}
				style={{
					'--flow-accent': entry.accent,
					x,
					y,
					scale,
					filter,
					opacity,
					zIndex,
				}}
			>
				<div className="home-flow-card-top">
					<span>{String(index)}</span>
					<strong>{entry.label}</strong>
				</div>
				<div className="home-flow-image">
					<div className="home-flow-image-frame">
						<img src={`/${entry.image}`} alt={entry.alt} />
					</div>
				</div>
			</motion.article>
		</div>
	);
}

export function HomePage() {
	const navigate = useNavigate();
	const { tierKey } = useSubscription();
	const userRank = TIER_ORDER.indexOf(tierKey);

	return (
		<div className="home-page">
			<section className="home-command" aria-labelledby="home-title">
				<div className="home-command-bg" aria-hidden="true">
					<div className="home-command-gradient" />
					<div className="home-command-grid" />
					<div className="home-command-rays" />
					<PokeBallParticles count={28} />
				</div>

				<div className="home-command-copy">
					<p className="home-command-kicker">Pokemon Post-Game Checklist</p>
					<h1 id="home-title" className="home-command-title">
						From the catch screen to the checklist.
					</h1>
					<p className="home-command-body">
						Catch the Pokemon, watch it register, then track it cleanly in one place.
					</p>
					<div className="home-command-actions">
						<button
							type="button"
							className="home-cta-btn primary"
							onClick={() => {
								navigateToState({
									level: 'gen',
									genKey: null,
									gameKey: null,
									sectionId: null
								});
								save();
								navigate('/checklists');
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
					<div className="home-orbit-flow">
						<div className="home-orbit-flow-bg home-orbit-flow-bg-a" />
						<div className="home-orbit-flow-bg home-orbit-flow-bg-b" />
						<svg viewBox="0 0 900 640" className="home-orbit-lines" role="presentation">
							<ellipse cx="450" cy="322" rx="250" ry="148" />
							<ellipse cx="450" cy="322" rx="188" ry="110" />
						</svg>
						<div className="home-orbit-spark home-orbit-spark-a" />
						<div className="home-orbit-spark home-orbit-spark-b" />
						<div className="home-orbit-spark home-orbit-spark-c" />

						{HERO_FLOW.map((entry, index) => (
							<OrbitingFlowCard key={entry.key} entry={entry} index={index + 1} />
						))}
					</div>
				</div>
			</section>

			<div className="home-feature-layout">
				<div className="home-left-stack">
					<section className="home-scout-strip" aria-labelledby="home-scout-title">
						<div className="home-scout-copy">
							<h2 id="home-scout-title">Everything that matters during a real completion run.</h2>
							<p>
								Keep the obvious stuff visible, surface the annoying stuff earlier, and spend less time
								jumping between tabs trying to remember what is left.
							</p>
						</div>
						<div className="home-scout-metrics">
							{HOME_FOCUS_AREAS.map((area, index) => (
								<motion.div
									key={area.label}
									className="home-scout-metric"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: '-40px' }}
									transition={{ duration: 0.42, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
								>
									<strong>{area.label}</strong>
									<span>{area.description}</span>
								</motion.div>
							))}
						</div>
					</section>
					<section className="home-atlas-panel home-atlas-rank-panel">
						<div className="home-rank-track">
							<span className="home-rank-label">Choose your rank</span>
						</div>
						<div className="home-tier-grid">
							{TIER_ORDER.map((rankKey) => {
								const tier = TIERS[rankKey];
								const features = tierFeaturesFor(rankKey);
								const isActive = rankKey === tierKey;

								return (
									<div
										key={rankKey}
										className={`home-tier-card${isActive ? ' is-active' : ''}`}
										style={{ '--tier-accent': TIER_STYLES[rankKey]?.accent || 'var(--home-accent-gold)' }}
									>
										<div className="home-tier-card-top">
											<div>
												<span>{tier.price === '$0' ? 'Start here' : 'Unlock more'}</span>
												<strong>{tier.label}</strong>
											</div>
											<i>{tier.price}</i>
										</div>
										<ul className="home-tier-feature-list">
											{features.map((feature) => (
												<li key={feature}>{feature}</li>
											))}
										</ul>
									</div>
								);
							})}
						</div>
					</section>
					<section className="home-atlas-copy home-atlas-panel">
						<span className="home-section-tag">Tracking flow</span>
						<h2 id="home-atlas-title">Made for the parts of a run you come back to later.</h2>
						<p>
							Keep your place, come back cleanly, and keep chipping away without losing what still matters.
						</p>
						<div className="home-atlas-steps">
							{STORY_STEPS.map((step, index) => (
								<div key={step} className="home-atlas-step">
									<span>{String(index + 1).padStart(2, '0')}</span>
									<strong>{step}</strong>
								</div>
							))}
						</div>
					</section>
				</div>
				<section className="home-route-board" aria-labelledby="home-route-board-title">
					<div className="home-route-intro">
						<span className="home-section-tag">Destinations</span>
						<h2 id="home-route-board-title">Pick the page you need next.</h2>
						<p>
							Checklists stay at the center. Everything else reads like support pages around the main run,
							with locked areas still visible so the home page still feels connected.
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
									className={`home-route-stop${isLocked ? ' is-locked' : ''}${index === 0 ? ' is-primary' : ''}`}
									style={{ '--feature-accent': tile.accent }}
									onClick={() => navigate(isLocked ? '/pricing' : tile.path)}
									initial={{ opacity: 0, y: 28 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: '-60px' }}
									transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
								>
									<span className="home-route-index">{String(index + 1).padStart(2, '0')}</span>
									<div className="home-route-main">
										<div className="home-route-topline">
											<strong>{tile.label}</strong>
										</div>
										<p>{tile.description}</p>
									</div>
									<div className="home-route-status">
										<span>
											{isLocked ? 'Upgrade' : 'Open'}
											<i className={`pi ${isLocked ? 'pi-lock' : 'pi-lock-open'}`}></i>
										</span>
									</div>
								</motion.button>
							);
						})}
					</div>
				</section>
			</div>
		</div>
	);
}
