import React, { useEffect, useMemo, useRef, useState } from "react";
import { pad4 } from "../../react-bridge/monInfo.js";
import { resolveMonInfoData } from "../../react-bridge/monInfoData.js";
import {
	advancePokemonSpriteFallback,
	pokemonSpriteCandidates,
} from "../../utils/pokemonSprite.js";
import {
	buildMonInfoStatSeries,
	MON_INFO_STAT_LABEL_RADIUS_OFFSET,
	MON_INFO_STAT_VIEW_BOX,
} from "../../utils/monInfoStats.js";
import { parseMonInfoGenderRatio } from "../../utils/monInfoProfile.js";
import {
	moveGroupDisplayLabel,
	moveMetadataParts,
	moveTypeIconSource,
	referenceEntryHref,
} from "../../utils/moveReference.js";
import {
	buildEeveeEvolutionWheel,
	buildEvolutionForest,
	evolutionRequirementPresentation,
	evolutionTargetId,
	resolveEvolutionTargetForm,
} from "../../utils/monInfoEvolution.js";

// Keep the evolution tree off the homepage bundle; Vite deduplicates this
// stylesheet with the legacy modal's matching lazy import.
if (typeof document !== "undefined") {
	void import("../../../styles/mon-info-evolution.css");
}

function TypePill({ type }) {
	return (
		<span className={`type-pill type-${String(type).toLowerCase()}`}>
			{type}
		</span>
	);
}

function GenderRatioValue({ value }) {
	const ratio = parseMonInfoGenderRatio(value);
	if (!ratio) return null;
	if (ratio.text) return <div className="value">{ratio.text}</div>;
	return (
		<div
			className="value"
			aria-label={`${ratio.male}% male, ${ratio.female}% female`}
		>
			<span style={{ color: "oklch(72% 0.16 250)" }}>
				<span aria-hidden="true">♂</span> {ratio.male}%
			</span>{" "}
			<span aria-hidden="true">/</span>{" "}
			<span style={{ color: "oklch(76% 0.16 350)" }}>
				<span aria-hidden="true">♀</span> {ratio.female}%
			</span>
		</div>
	);
}

function ProfileItem({ label, value }) {
	return (
		<div className="mon-info-profile-item">
			<div className="label">{label}</div>
			{label === "Gender Ratio" ? (
				<GenderRatioValue value={value} />
			) : Array.isArray(value) ? (
				<div className="value value--stacked">
					{value.map((item) =>
						label === "Abilities" ? (
							<a
								key={`${label}-${item}`}
								className="value-line mon-info-reference-link"
								href={referenceEntryHref("abilities", item)}
							>
								{item}
							</a>
						) : (
							<span
								key={`${label}-${item}`}
								className="value-line"
							>
								{item}
							</span>
						),
					)}
				</div>
			) : (
				<div className="value">{value}</div>
			)}
		</div>
	);
}

function visibleProfileRows(rows) {
	return rows.filter(
		([, value]) =>
			value != null &&
			value !== "" &&
			(!Array.isArray(value) || value.length),
	);
}

function ProfileCard({ profile }) {
	const primaryRows = visibleProfileRows([
		["Abilities", profile.abilities],
		["Egg Groups", profile.eggGroups],
		["Base Egg Steps", profile.baseEggSteps],
		["Catch Rate", profile.captureRate],
		[
			"Base Friendship",
			profile.baseFriendship != null
				? `${profile.baseFriendship} / 255`
				: null,
		],
		["Exp Growth", profile.expGroup],
	]);
	const secondaryRows = visibleProfileRows([
		["Height", profile.height],
		["Weight", profile.weight],
		["Gender Ratio", profile.genderRatio],
		["Base Experience", profile.baseExperience],
		["Habitat", profile.habitat],
		["Shape", profile.shape],
		["Color", profile.color],
		["Species", profile.genus],
	]);

	if (!primaryRows.length && !secondaryRows.length) return null;

	return (
		<div className="mon-info-block mon-info-profile">
			<h3>Profile</h3>
			<div className="mon-info-profile-grid">
				<div className="mon-info-profile-column is-primary">
					{primaryRows.map(([label, value]) => (
						<ProfileItem key={label} label={label} value={value} />
					))}
				</div>
				<div className="mon-info-profile-column is-secondary">
					{secondaryRows.map(([label, value]) => (
						<ProfileItem key={label} label={label} value={value} />
					))}
				</div>
			</div>
		</div>
	);
}

function StatsRadar({ stats, evYield }) {
	const statSeries = buildMonInfoStatSeries(stats, evYield);
	const values = statSeries.map((stat) => stat.value);
	if (!values.some((v) => Number.isFinite(v) && v > 0)) return null;
	const maxVal = Math.max(...values, 1);
	const total = values.reduce((sum, v) => sum + v, 0);
	const center = 50;
	const radius = 65;
	const labelRadius = radius + MON_INFO_STAT_LABEL_RADIUS_OFFSET;
	const points = statSeries.map((stat, idx) => {
		const v = stat.value;
		const ratio = v / maxVal;
		const r = radius * ratio;
		const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / statSeries.length;
		return {
			...stat,
			x: center + r * Math.cos(angle),
			y: center + r * Math.sin(angle),
			angle,
			r,
		};
	});
	const gridLevels = [0.33, 0.66, 1];
	return (
		<div className="mon-info-block mon-info-stats">
			<h3>Base Stats and EV Yield</h3>
			<div className="mon-info-stats-graph">
				<svg
					viewBox={MON_INFO_STAT_VIEW_BOX}
					className="mon-info-stats-radar"
					aria-hidden="true"
				>
					{gridLevels.map((lvl) => {
						const pts = statSeries
							.map((_, i) => {
								const r = radius * lvl;
								const angle =
									-Math.PI / 2 +
									(i * 2 * Math.PI) / statSeries.length;
								return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
							})
							.join(" ");
						return (
							<polygon
								key={lvl}
								points={pts}
								className="stat-grid-ring"
							/>
						);
					})}
					<polygon
						points={points
							.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
							.join(" ")}
						className="stat-radar-fill"
					/>
					{points.map((p) => (
						<circle
							key={`dot-${p.label}`}
							cx={p.x.toFixed(1)}
							cy={p.y.toFixed(1)}
							r="1.6"
							className="stat-vertex-dot"
						/>
					))}
					{points.map((p) => {
						const lx = center + labelRadius * Math.cos(p.angle);
						const ly = center + labelRadius * Math.sin(p.angle);
						return (
							<React.Fragment key={`stat-${p.key}`}>
								<text
									x={lx.toFixed(1)}
									y={ly.toFixed(1)}
									className="stat-label"
									textAnchor="middle"
									dominantBaseline="central"
								>
									{p.label}
								</text>
								<text
									x={lx.toFixed(1)}
									y={(ly + 9).toFixed(1)}
									className="stat-value"
									textAnchor="middle"
									dominantBaseline="central"
								>
									{p.displayValue}
								</text>
							</React.Fragment>
						);
					})}
					<text
						x={center}
						y={center}
						className="stat-total"
						textAnchor="middle"
						dominantBaseline="central"
					>
						{total}
					</text>
				</svg>
			</div>
		</div>
	);
}

function TypeDefenseCard({ rows }) {
	if (!rows?.length) return null;
	const groups = [rows.slice(0, 6), rows.slice(6, 12), rows.slice(12, 18)];
	const clsFor = (mult) => {
		if (mult === 4) return "type-fx-400";
		if (mult === 2) return "type-fx-200";
		if (mult === 1.5) return "type-fx-150";
		if (mult === 0.5) return "type-fx-50";
		if (mult === 0.25) return "type-fx-25";
		if (mult === 0) return "type-fx-0";
		return "type-fx-100";
	};
	const labelFor = (mult) => {
		if (mult === 4) return "4";
		if (mult === 2) return "2";
		if (mult === 1.5) return "1½";
		if (mult === 0.5) return "½";
		if (mult === 0.25) return "¼";
		if (mult === 0) return "0";
		return "";
	};
	const abbr = {
		Normal: "Nor",
		Fire: "Fir",
		Water: "Wat",
		Electric: "Ele",
		Grass: "Gra",
		Ice: "Ice",
		Fighting: "Fig",
		Poison: "Poi",
		Ground: "Gro",
		Flying: "Fly",
		Psychic: "Psy",
		Bug: "Bug",
		Rock: "Roc",
		Ghost: "Gho",
		Dragon: "Dra",
		Dark: "Dar",
		Steel: "Ste",
		Fairy: "Fai",
	};
	return (
		<div className="mon-info-block mon-info-typechart">
			<h3>Type Defenses</h3>
			<div className="typechart-matrix">
				{groups.map((group, idx) => (
					<table key={idx} className="type-table-pokedex">
						<thead>
							<tr>
								{group.map((row) => (
									<th key={row.type}>
										<span
											className={`type-abbr type-${row.type.toLowerCase()}`}
										>
											{abbr[row.type] ||
												row.type.slice(0, 3)}
										</span>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							<tr>
								{group.map((row) => (
									<td
										key={row.type}
										className={`type-fx-cell ${clsFor(row.mult)}`}
									>
										{labelFor(row.mult)}
									</td>
								))}
							</tr>
						</tbody>
					</table>
				))}
			</div>
		</div>
	);
}

function connectorDirection(branchIndex, branchCount) {
	const midpoint = (branchCount - 1) / 2;
	if (branchIndex < midpoint) return "up";
	if (branchIndex > midpoint) return "down";
	return "straight";
}

function EvolutionRequirement({ step, gameKey, direction, style = undefined }) {
	const presentation = evolutionRequirementPresentation(step, gameKey);
	if (!presentation.label && !presentation.item) return null;
	return (
		<span
			className={`evolution-requirement is-${direction}${presentation.item ? " has-item" : ""}`}
			style={style}
		>
			{presentation.item ? (
				<img
					key={presentation.item.src}
					className="evolution-item-icon"
					src={presentation.item.src}
					alt=""
					title={presentation.item.name}
					loading="lazy"
					hidden={false}
					onLoad={(event) => {
						event.currentTarget.hidden = false;
					}}
				/>
			) : null}
			<span className="evolution-requirement-copy">
				<strong>{presentation.label}</strong>
				{presentation.detail ? (
					<small>{presentation.detail}</small>
				) : null}
			</span>
		</span>
	);
}

function EvolutionConnector({ step, gameKey, direction }) {
	const path =
		direction === "up"
			? "M4 64 L104 8"
			: direction === "down"
				? "M4 8 L104 64"
				: "M4 36 L104 36";
	const arrowhead =
		direction === "up"
			? "84,8 104,8 95,26"
			: direction === "down"
				? "84,64 104,64 95,46"
				: "86,24 104,36 86,48";
	return (
		<div className={`evolution-connector is-${direction}`}>
			<EvolutionRequirement
				step={step}
				gameKey={gameKey}
				direction={direction}
			/>
			<svg
				className="evolution-arrow"
				viewBox="0 0 108 72"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path d={path} />
				<polyline points={arrowhead} />
			</svg>
		</div>
	);
}

function EvolutionNodeButton({
	node,
	gameKey,
	currentNatiId,
	currentFormKey,
	onNavigate,
}) {
	const targetId = evolutionTargetId(node.step);
	const targetFormKey = resolveEvolutionTargetForm({
		step: node.step,
		gameKey,
		currentFormKey,
	});
	const spriteCandidates = pokemonSpriteCandidates({
		nationalDexId: targetId,
		formKey: targetFormKey,
		gameKey,
	});
	const isCurrent =
		targetId === Number(currentNatiId) &&
		(!targetFormKey || targetFormKey === currentFormKey);
	return (
		<button
			type="button"
			className={`evolution-node${isCurrent ? " is-current" : ""}`}
			aria-current={isCurrent ? "page" : undefined}
			disabled={!targetId}
			onClick={() => onNavigate?.(targetId, targetFormKey)}
		>
			{spriteCandidates[0] ? (
				<img
					className="evolution-pokemon-icon"
					src={spriteCandidates[0]}
					alt=""
					loading="lazy"
					data-sprite-candidate-index="0"
					onError={(event) =>
						advancePokemonSpriteFallback(event, spriteCandidates)
					}
				/>
			) : null}
			<span className="evolution-name">
				{node.step?.name || `#${targetId || "?"}`}
			</span>
		</button>
	);
}

function EvolutionTreeNode({
	node,
	gameKey,
	currentNatiId,
	currentFormKey,
	onNavigate,
}) {
	const branchCount = node.children.length;

	return (
		<div className="evolution-tree-node-wrap">
			<EvolutionNodeButton
				node={node}
				gameKey={gameKey}
				currentNatiId={currentNatiId}
				currentFormKey={currentFormKey}
				onNavigate={onNavigate}
			/>
			{branchCount ? (
				<div
					className={`evolution-branches${branchCount > 1 ? " is-split" : ""}`}
				>
					{node.children.map((child, branchIndex) => {
						const direction = connectorDirection(
							branchIndex,
							branchCount,
						);
						return (
							<div key={child.key} className="evolution-branch">
								<EvolutionConnector
									step={child.step}
									gameKey={gameKey}
									direction={direction}
								/>
								<EvolutionTreeNode
									node={child}
									gameKey={gameKey}
									currentNatiId={currentNatiId}
									currentFormKey={currentFormKey}
									onNavigate={onNavigate}
								/>
							</div>
						);
					})}
				</div>
			) : null}
		</div>
	);
}

function EeveeEvolutionWheel({
	layout,
	gameKey,
	currentNatiId,
	currentFormKey,
	onNavigate,
}) {
	return (
		<div
			className="evolution-wheel"
			style={{ width: layout.size, height: layout.size }}
		>
			<svg
				className="evolution-wheel-arrows"
				viewBox={`0 0 ${layout.size} ${layout.size}`}
				aria-hidden="true"
			>
				{layout.branches.map((branch) => (
					<g key={branch.node.key}>
						<line
							x1={branch.startX}
							y1={branch.startY}
							x2={branch.endX}
							y2={branch.endY}
						/>
						<polyline points={branch.arrowPoints} />
					</g>
				))}
			</svg>
			<div
				className="evolution-wheel-node is-center"
				style={{ left: layout.center, top: layout.center }}
			>
				<EvolutionNodeButton
					node={layout.root}
					gameKey={gameKey}
					currentNatiId={currentNatiId}
					currentFormKey={currentFormKey}
					onNavigate={onNavigate}
				/>
			</div>
			{layout.branches.map((branch) => (
				<React.Fragment key={branch.node.key}>
					<EvolutionRequirement
						step={branch.node.step}
						gameKey={gameKey}
						direction="radial"
						style={{ left: branch.labelX, top: branch.labelY }}
					/>
					<div
						className="evolution-wheel-node"
						style={{ left: branch.nodeX, top: branch.nodeY }}
					>
						<EvolutionNodeButton
							node={branch.node}
							gameKey={gameKey}
							currentNatiId={currentNatiId}
							currentFormKey={currentFormKey}
							onNavigate={onNavigate}
						/>
					</div>
				</React.Fragment>
			))}
		</div>
	);
}

function EvolutionCard({
	evolution,
	gameKey,
	currentNatiId,
	currentFormKey,
	onNavigate,
}) {
	const forest = useMemo(
		() => buildEvolutionForest(evolution, { gameKey }),
		[evolution, gameKey],
	);
	const wheelLayout = useMemo(
		() => buildEeveeEvolutionWheel(forest),
		[forest],
	);
	const scrollRef = useRef(null);
	useEffect(() => {
		const scrollElement = scrollRef.current;
		if (!wheelLayout || !scrollElement) return undefined;
		const frame = requestAnimationFrame(() => {
			scrollElement.scrollLeft = Math.max(
				0,
				(scrollElement.scrollWidth - scrollElement.clientWidth) / 2,
			);
		});
		return () => cancelAnimationFrame(frame);
	}, [gameKey, wheelLayout]);
	if (!forest.length) return null;
	return (
		<div className="mon-info-block mon-info-evolution">
			<h3>Evolution</h3>
			<div
				ref={scrollRef}
				className={`evolution-tree-scroll${wheelLayout ? " has-wheel" : ""}`}
			>
				{wheelLayout ? (
					<EeveeEvolutionWheel
						layout={wheelLayout}
						gameKey={gameKey}
						currentNatiId={currentNatiId}
						currentFormKey={currentFormKey}
						onNavigate={onNavigate}
					/>
				) : (
					<div className="evolution-forest">
						{forest.map((root) => (
							<EvolutionTreeNode
								key={root.key}
								node={root}
								gameKey={gameKey}
								currentNatiId={currentNatiId}
								currentFormKey={currentFormKey}
								onNavigate={onNavigate}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function LocationsCard({ locations }) {
	if (!locations?.length) return null;
	return (
		<div className="mon-info-block mon-info-locations">
			<h3>Locations</h3>
			<ul className="react-moninfo-list">
				{locations.map((loc) => (
					<li key={loc.key}>
						{loc.area ? <strong>{loc.area}</strong> : null}
						{loc.area && loc.notes ? " — " : ""}
						{loc.notes}
						{loc.extra ? (
							<span className="small"> ({loc.extra})</span>
						) : null}
					</li>
				))}
			</ul>
		</div>
	);
}

function MovesCard({ moves }) {
	if (!moves?.length) return null;
	return (
		<div className="mon-info-block mon-info-moves-react">
			<h3>Moves</h3>
			<div className="react-moves-groups">
				{moves.map((group) => (
					<div key={group.learnMethod} className="react-moves-group">
						<h4>
							{moveGroupDisplayLabel(
								group.learnMethod,
								group.entries,
							)}
						</h4>
						<div className="react-moves-chips">
							{group.entries.map((entry, index) => {
								const label =
									typeof entry === "string"
										? entry
										: entry?.name ||
											entry?.move ||
											`Move ${index + 1}`;
								const meta =
									moveMetadataParts(entry).join(" • ");
								const typeIconSrc = moveTypeIconSource(
									entry?.type,
								);
								return (
									<a
										key={`${group.learnMethod}-${label}-${index}`}
										className="react-move-chip"
										href={referenceEntryHref(
											"moves",
											label,
										)}
									>
										<span className="react-move-label">
											{typeIconSrc ? (
												<img
													className="react-move-type-icon"
													src={typeIconSrc}
													alt={`${entry.type} type`}
													title={`${entry.type} type`}
													loading="lazy"
													height={20}
												/>
											) : null}
											<span>{label}</span>
										</span>
										{meta ? <small>{meta}</small> : null}
									</a>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function MonInfoBody({
	gameKey,
	mon,
	formKey,
	onFormChange,
	onEvolutionNavigate,
}) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		resolveMonInfoData({ gameKey, mon, formKey })
			.then((next) => {
				if (!cancelled) {
					setData(next);
					setLoading(false);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setData(null);
					setLoading(false);
				}
			});
		return () => {
			cancelled = true;
		};
	}, [gameKey, mon?.id, mon?.natiId, formKey]);

	const flavor = data?.resolvedInfo?.flavor || "";
	const displayName =
		data?.resolvedInfo?.displayName ||
		mon?.name ||
		`#${pad4(data?.natId || mon?.id || 0)}`;
	const infoNotice = data && !data.hasLocalInfo;

	if (loading) return <div className="moninfo-body">Loading…</div>;
	if (!data)
		return (
			<div className="moninfo-body">
				<div className="mon-info-empty">Unable to load Mon Info.</div>
			</div>
		);

	return (
		<div className="moninfo-body react-moninfo-body">
			<div className="mon-info-header">
				{data.spriteSrc ? (
					<div className="mon-info-sprite">
						<img
							src={data.spriteSrc}
							alt={displayName}
							loading="lazy"
							data-sprite-candidate-index="0"
							onError={(event) =>
								advancePokemonSpriteFallback(
									event,
									data.spriteCandidates || [data.spriteSrc],
								)
							}
						/>
					</div>
				) : null}
				<div className="mon-info-main">
					<div className="mon-info-topline">
						<div className="mon-info-basic">
							<div className="mon-info-name">
								#{pad4(data.natId || mon?.id || 0)} —{" "}
								{displayName}
							</div>
							<div className="mon-info-types">
								{(data.types || []).map((type) => (
									<TypePill key={type} type={type} />
								))}
							</div>
							{data.formOptions?.length ? (
								<div className="mon-info-form">
									<select
										className="mon-info-form-select"
										value={
											data.effectiveFormKey ||
											data.formOptions[0].key
										}
										onChange={(event) =>
											onFormChange?.(event.target.value)
										}
									>
										{data.formOptions.map((option) => (
											<option
												key={option.key}
												value={option.key}
											>
												{option.label}
											</option>
										))}
									</select>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>

			{flavor ? (
				<div className="mon-info-block mon-info-flavor">{flavor}</div>
			) : null}

			<div className="mon-info-layout">
				<aside className="mon-info-col mon-info-col--summary">
					<TypeDefenseCard rows={data.typeDefenses} />
					<StatsRadar stats={data.baseStats} evYield={data.evYield} />
				</aside>

				<section className="mon-info-col mon-info-col--details">
					<ProfileCard profile={data.profile} />
					<EvolutionCard
						evolution={data.resolvedInfo?.evolution}
						gameKey={gameKey}
						currentNatiId={data.natId}
						currentFormKey={data.effectiveFormKey}
						onNavigate={onEvolutionNavigate}
					/>
					<LocationsCard locations={data.locations} />
					<MovesCard moves={data.moves} />
				</section>
			</div>

			{infoNotice ? (
				<div className="mon-info-empty">
					No local <code>monInfo</code> entry is configured yet for
					this Pokémon in <strong>{gameKey}</strong>. Showing PokéAPI
					fallback data when available.
				</div>
			) : null}
		</div>
	);
}
