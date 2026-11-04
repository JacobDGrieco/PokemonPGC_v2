import React, { lazy, Suspense, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { assetPath } from "../../utils/assetPath.js";
import { save, store } from "../../store.js";
import { ensureSections } from "../../react-bridge/taskApi.js";
import { usePpgcSnapshot } from "../../react-bridge/usePpgcSnapshot.js";
import { navigateToState } from "../../react-bridge/navigation.js";
import { RingMount } from "../common/RingMount.jsx";
import {
	applyGameStartSync,
	buildGameOverview,
	buildGenOverview,
} from "../../react-bridge/progressSummary.js";
import { SectionPage } from "./SectionPage.jsx";
import { ImperativeContentMount } from "./ImperativeContentMount.jsx";
import { MonInfoIndexPage } from "./MonInfoIndexPage.jsx";
import { MonInfoPage } from "./MonInfoPage.jsx";
import { getVisibleSections } from "../../utils/sectionVisibility.js";
import { buildAccountRoute } from "../../utils/accountRoute.js";

const ReferenceIndexPage = lazy(() =>
	import("./ReferenceIndexPage.jsx").then((module) => ({
		default: module.ReferenceIndexPage,
	})),
);

function handleEnterGame(genKey, gameKey) {
	return async () => {
		try {
			await window.PPGC?.ensureGenDataLoadedForGame?.(gameKey);
			store.state.recentGameKeys = [
				gameKey,
				...(store.state.recentGameKeys || []).filter(
					(key) => key !== gameKey,
				),
			].slice(0, 8);
			save();
			const sections = getVisibleSections(gameKey, ensureSections);
			navigateToState({
				level: "section",
				genKey,
				gameKey,
				sectionId: sections?.[0]?.id || null,
			});
		} catch {
			navigateToState({
				level: "game",
				genKey,
				gameKey: null,
				sectionId: null,
			});
		}
	};
}

function GenOverviewPage({ state }) {
	const overview = useMemo(() => buildGenOverview(store), [state]);
	const emptyMessage = {
		started: "No games marked as started yet.",
		favorites: "No favorite games yet.",
		recent: "Open a game and it will appear here.",
	}[overview.scope];

	return (
		<section className="card react-content-card">
			<div
				className={`card-hd section-hd game-summary-hd ${overview.overallExtra > 0.01 ? "has-extra" : ""}`}
				style={{
					"--accent": "#d4af37",
					"--progress": overview.overallBase.toFixed(2),
					"--extra-progress": overview.overallExtra.toFixed(2),
				}}
			>
				<h3>Game Summary — All Games</h3>
				<div className="pct" id="gameSummaryPct">
					{overview.overallPct.toFixed(2)}%
				</div>
				<div className="row game-summary-filter-row">
					<label className="small" htmlFor="gameSummaryScope">
						Show
					</label>
					<select
						id="gameSummaryScope"
						className="game-summary-filter"
						value={overview.scope}
						onChange={(event) => {
							store.state.gameSummaryScope = event.target.value;
							save();
							window.PPGC?.renderAll?.();
						}}
					>
						<option value="all">All games</option>
						<option value="started">Started</option>
						<option value="favorites">Favorites</option>
						<option value="recent">Recent</option>
					</select>
				</div>
			</div>
			<div className="card-bd">
				<div className="rings" id="gameRings">
					{!overview.visibleGameStats.length ? (
						<div className="game-summary-empty small">
							{emptyMessage || "No games match this view."}
						</div>
					) : (
						overview.visibleGameStats.map((entry) => {
							const isStarted = !!entry.isStarted;
							const game = entry.game;
							return (
								<div
									key={game.key}
									className="react-ring-stack"
								>
									<RingMount
										pct={isStarted ? entry.pct : 0}
										label={game.label}
										img={assetPath(
											`game-icons/${game.key}.png`,
										)}
										accent={game.color || "#7fd2ff"}
										className={
											isStarted ? "is-started" : ""
										}
										onClick={handleEnterGame(
											entry.genKey,
											game.key,
										)}
									/>
									<div className="game-summary-card-actions">
										<button
											type="button"
											className="button game-favorite-toggle"
											aria-label={`${entry.isFavorite ? "Remove" : "Add"} ${game.label} ${entry.isFavorite ? "from" : "to"} favorites`}
											aria-pressed={entry.isFavorite}
											title={
												entry.isFavorite
													? "Remove favorite"
													: "Add favorite"
											}
											onClick={() => {
												if (entry.isFavorite)
													delete store.favoriteGames[
														game.key
													];
												else
													store.favoriteGames[
														game.key
													] = true;
												save();
												window.PPGC?.renderAll?.();
											}}
										>
											<span aria-hidden="true">
												{"\u2605"}
											</span>
										</button>
										<button
											type="button"
											className="button game-start-toggle react-game-start-toggle"
											aria-pressed={isStarted}
											onClick={(event) => {
												event.stopPropagation();
												const next = !isStarted;
												if (
													typeof store.setGameStarted ===
													"function"
												)
													store.setGameStarted(
														game.key,
														next,
													);
												else {
													store.state.startedGames ||=
														{};
													if (next)
														store.state.startedGames[
															game.key
														] = true;
													else
														delete store.state
															.startedGames[
															game.key
														];
													save();
												}
												applyGameStartSync(
													game.key,
													next,
													store,
												);
												window.PPGC?.renderAll?.();
											}}
										>
											{isStarted ? "Started" : "Start"}
										</button>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</section>
	);
}

function GameOverviewPage({ state }) {
	const rows = useMemo(() => buildGameOverview(state.genKey, store), [state]);
	const genLabel =
		(window.DATA?.tabs || []).find((tab) => tab.key === state.genKey)
			?.label || state.genKey;

	return (
		<section className="card react-content-card">
			<div className="card-hd">
				<h3>Section Summary — {genLabel}</h3>
			</div>
			<div className="card-bd games-rows" id="genSummary">
				{rows.map((row, rowIndex) => (
					<div key={`row-${rowIndex}`} className="games-row">
						{row.map(({ game, sections }) => (
							<div
								key={game.key}
								className="game-summary"
								style={{ "--accent": game.color || "#7fd2ff" }}
							>
								<div className="title">{game.label}</div>
								<div className="rings">
									{sections.length ? (
										sections.map((section) => (
											<RingMount
												key={section.id}
												pct={section.pct}
												label={section.title}
												img={assetPath(
													`game-icons/${game.key}.png`,
												)}
											/>
										))
									) : (
										<div
											className="small"
											style={{ opacity: 0.8 }}
										>
											No sections defined.
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				))}
			</div>
		</section>
	);
}

function LoadingState() {
	return <div className="react-loading-state">Loading game data…</div>;
}

function ToolsPage({ toolsKey, referenceSlug }) {
	if (toolsKey === "moves" || toolsKey === "abilities") {
		return (
			<Suspense fallback={<LoadingState />}>
				{/* Each catalog owns independent async state; remount to avoid rendering the previous manifest. */}
				<ReferenceIndexPage
					key={toolsKey}
					kind={toolsKey}
					initialSlug={referenceSlug}
				/>
			</Suspense>
		);
	}
	return <MonInfoIndexPage />;
}

export function ReactContentRouter() {
	const snapshot = usePpgcSnapshot();
	const state = snapshot?.state || store.state;
	const level = state?.level || "gen";
	const renderKey = `${snapshot?.timestamp || 0}:${level}:${state?.genKey || ""}:${state?.gameKey || ""}:${state?.sectionId || ""}:${state?.monInfoId || ""}:${state?.toolsKey || ""}`;

	if (snapshot?.loading) return <LoadingState />;
	if (level === "gen") return <GenOverviewPage state={state} />;
	if (level === "game") return <GameOverviewPage state={state} />;
	if (level === "section")
		return <SectionPage state={state} refreshKey={renderKey} />;
	if (level === "tools")
		return (
			<ToolsPage
				toolsKey={state?.toolsKey}
				referenceSlug={state?.referenceSlug}
			/>
		);
	if (level === "moninfo") return <MonInfoPage state={state} />;
	if (level === "account")
		return (
			<Navigate
				to={buildAccountRoute(state.accountTab || "general")}
				replace
			/>
		);
	return <div className="react-loading-state">Unknown page.</div>;
}
