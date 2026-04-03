import React, { useMemo } from 'react';
import { save, store } from '../../store.js';
import { ensureSections } from '../../react-bridge/taskApi.js';
import { usePpgcSnapshot } from '../../react-bridge/usePpgcSnapshot.js';
import { navigateToState } from '../../react-bridge/navigation.js';
import { RingMount } from '../common/RingMount.jsx';
import { applyGameStartSync, buildGameOverview, buildGenOverview } from '../../react-bridge/progressSummary.js';
import { AccountPage } from './AccountPage.jsx';
import { SectionPage } from './SectionPage.jsx';
import { ImperativeContentMount } from './ImperativeContentMount.jsx';
import { MonInfoIndexPage } from './MonInfoIndexPage.jsx';
import { MonInfoPage } from './MonInfoPage.jsx';

function handleEnterGame(genKey, gameKey) {
  return async () => {
    try {
      await window.PPGC?.ensureGenDataLoadedForGame?.(gameKey);
      const sections = ensureSections(gameKey);
      navigateToState({ level: 'section', genKey, gameKey, sectionId: sections?.[0]?.id || null });
    } catch {
      navigateToState({ level: 'game', genKey, gameKey: null, sectionId: null });
    }
  };
}

function GenOverviewPage({ state }) {
  const overview = useMemo(() => buildGenOverview(store), [state]);

  return (
    <section className="card react-content-card">
      <div className={`card-hd section-hd game-summary-hd ${overview.overallExtra > 0.01 ? 'has-extra' : ''}`}
        style={{ '--accent': '#d4af37', '--progress': overview.overallBase.toFixed(2), '--extra-progress': overview.overallExtra.toFixed(2) }}
      >
        <h3>Game Summary — All Games</h3>
        <div className="pct" id="gameSummaryPct">{overview.overallPct.toFixed(2)}%</div>
        <div className="row">
          <label className="small" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="checkbox"
              checked={overview.scope === 'started'}
              onChange={(event) => {
                store.state.gameSummaryScope = event.target.checked ? 'started' : 'all';
                save();
                window.PPGC?.renderAll?.();
              }}
            />
            Show started games only
          </label>
        </div>
      </div>
      <div className="card-bd">
        <div className="rings" id="gameRings">
          {!overview.visibleGameStats.length ? (
            <div className="small" style={{ opacity: 0.8 }}>No games marked as started yet.</div>
          ) : overview.visibleGameStats.map((entry) => {
            const isStarted = !!entry.isStarted;
            const game = entry.game;
            return (
              <div key={game.key} className="react-ring-stack">
                <RingMount
                  pct={isStarted ? entry.pct : 0}
                  label={game.label}
                  img={_assetPath(`game-icons/${game.key}.png`)}
                  accent={game.color || '#7fd2ff'}
                  className={isStarted ? 'is-started' : ''}
                  onClick={handleEnterGame(entry.genKey, game.key)}
                />
                <button
                  type="button"
                  className="button game-start-toggle react-game-start-toggle"
                  aria-pressed={isStarted ? 'true' : 'false'}
                  onClick={(event) => {
                    event.stopPropagation();
                    const next = !isStarted;
                    if (typeof store.setGameStarted === 'function') store.setGameStarted(game.key, next);
                    else {
                      store.state.startedGames ||= {};
                      if (next) store.state.startedGames[game.key] = true;
                      else delete store.state.startedGames[game.key];
                      save();
                    }
                    applyGameStartSync(game.key, next, store);
                    window.PPGC?.renderAll?.();
                  }}
                >
                  {isStarted ? 'Started' : 'Not started'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GameOverviewPage({ state }) {
  const rows = useMemo(() => buildGameOverview(state.genKey, store), [state]);
  const genLabel = (window.DATA?.tabs || []).find((tab) => tab.key === state.genKey)?.label || state.genKey;

  return (
    <section className="card react-content-card">
      <div className="card-hd">
        <h3>Section Summary — {genLabel}</h3>
      </div>
      <div className="card-bd games-rows" id="genSummary">
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="games-row">
            {row.map(({ game, sections }) => (
              <div key={game.key} className="game-summary" style={{ '--accent': game.color || '#7fd2ff' }}>
                <div className="title">{game.label}</div>
                <div className="rings">
                  {sections.length ? sections.map((section) => (
                    <RingMount
                      key={section.id}
                      pct={section.pct}
                      label={section.title}
                      img={_assetPath(`game-icons/${game.key}.png`)}
                    />
                  )) : <div className="small" style={{ opacity: 0.8 }}>No sections defined.</div>}
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

function ToolsPage() {
  return <MonInfoIndexPage />;
}

export function ReactContentRouter() {
  const snapshot = usePpgcSnapshot();
  const state = snapshot?.state || store.state;
  const level = state?.level || 'gen';
  const renderKey = `${snapshot?.timestamp || 0}:${level}:${state?.genKey || ''}:${state?.gameKey || ''}:${state?.sectionId || ''}:${state?.monInfoId || ''}:${state?.toolsKey || ''}`;

  if (snapshot?.loading) return <LoadingState />;
  if (level === 'gen') return <GenOverviewPage state={state} />;
  if (level === 'game') return <GameOverviewPage state={state} />;
  if (level === 'section') return <SectionPage state={state} refreshKey={renderKey} />;
  if (level === 'tools') return <ToolsPage />;
  if (level === 'moninfo') return <MonInfoPage state={state} refreshKey={renderKey} />;
  if (level === 'account') return <AccountPage />;
  return <div className="react-loading-state">Unknown page.</div>;
}
