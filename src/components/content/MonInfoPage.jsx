import React, { useEffect, useMemo, useState } from 'react';
import { _assetPath } from '../../utils/assetPath.js';
import { navigateToState } from '../../react-bridge/navigation.js';
import { buildMonInfoGameOptions, findGameKeysForMonInfoNati, getHomeDexMons, getMonInfoDisplayName, monInfoLabelForGameKey, pad4, pickPreferredGameForMon } from '../../react-bridge/monInfo.js';
import { MonInfoBody } from './MonInfoBody.jsx';

function buildMonForRenderer(natiId, displayName) {
  return {
    id: natiId,
    natiId,
    name: displayName,
    img: _assetPath(`sprites/pokemon_home/base-front/${pad4(natiId)}.png`),
    types: [],
    baseStats: null,
  };
}

export function MonInfoPage({ state, refreshKey }) {
  const natiId = Number(state?.monInfoId || 0);
  const [displayName, setDisplayName] = useState(natiId ? `#${pad4(natiId)}` : '');

  const mons = useMemo(() => getHomeDexMons(), []);
  const currentIndex = useMemo(() => mons.findIndex((mon) => mon.natiId === natiId), [mons, natiId]);
  const prevMon = currentIndex > 0 ? mons[currentIndex - 1] : null;
  const nextMon = currentIndex >= 0 && currentIndex < mons.length - 1 ? mons[currentIndex + 1] : null;
  const gameOptions = useMemo(() => buildMonInfoGameOptions(findGameKeysForMonInfoNati(natiId)), [natiId, refreshKey]);
  const optionKeys = gameOptions.map((option) => option.key);
  const selectedGameKey = optionKeys.includes(state?.monInfoGameKey) ? state.monInfoGameKey : optionKeys[0] || null;

  useEffect(() => {
    let isCancelled = false;
    if (!natiId) return undefined;

    getMonInfoDisplayName(natiId).then((name) => {
      if (!isCancelled && name) setDisplayName(name);
    });

    return () => {
      isCancelled = true;
    };
  }, [natiId, refreshKey]);


  const goToMon = (targetId) => {
    if (!targetId) return;
    navigateToState({
      level: 'moninfo',
      toolsKey: 'info',
      genKey: null,
      gameKey: null,
      sectionId: null,
      monInfoId: targetId,
      monInfoGameKey: pickPreferredGameForMon(targetId, selectedGameKey),
      monInfoForm: null,
    });
  };

  if (!natiId) {
    return <div className="page react-moninfo-page"><h2 className="page-title">Mon Info</h2><p>No Pokémon selected.</p></div>;
  }

  return (
    <div className="page react-moninfo-page">
      <div className="moninfo-header">
        <div className="moninfo-header-left">
          <img className="moninfo-hero-img" src={_assetPath(`sprites/pokemon_home/base-front/${pad4(natiId)}.png`)} alt={`#${natiId}`} onError={(e) => { if (e.target.src !== (window.__PPGC_NO_IMG__ || '/no-image.svg')) e.target.src = window.__PPGC_NO_IMG__ || '/no-image.svg'; }} />
          <div>
            <h2 className="page-title">#{pad4(natiId)} — {displayName}</h2>
            <div className="moninfo-subtitle small">{selectedGameKey ? monInfoLabelForGameKey(selectedGameKey) : ''}</div>
          </div>
        </div>

        <div className="moninfo-header-mid">
          <button
            id="moninfoPrevBtn"
            className="moninfo-nav-btn"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            type="button"
            aria-label="Previous Pokémon"
            disabled={!prevMon}
            onClick={() => goToMon(prevMon?.natiId)}
          >
            {prevMon ? (
              <span className="moninfo-nav-inner">
                <span className="moninfo-nav-arrow">◀</span>
                <img className="moninfo-nav-sprite" src={_assetPath(`sprites/pokemon_home/menu_sprites/${pad4(prevMon.natiId)}.png`)} alt="" />
                <span className="moninfo-nav-text">#{pad4(prevMon.natiId)} {prevMon.name}</span>
              </span>
            ) : '◀ Prev'}
          </button>
          <button
            id="moninfoNextBtn"
            className="moninfo-nav-btn"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            type="button"
            aria-label="Next Pokémon"
            disabled={!nextMon}
            onClick={() => goToMon(nextMon?.natiId)}
          >
            {nextMon ? (
              <span className="moninfo-nav-inner">
                <img className="moninfo-nav-sprite" src={_assetPath(`sprites/pokemon_home/menu_sprites/${pad4(nextMon.natiId)}.png`)} alt="" />
                <span className="moninfo-nav-text">#{pad4(nextMon.natiId)} {nextMon.name}</span>
                <span className="moninfo-nav-arrow">▶</span>
              </span>
            ) : 'Next ▶'}
          </button>
        </div>

        <div className="moninfo-header-right">
          <label className="moninfo-field">
            <div className="moninfo-field-label">Game</div>
            <select
              id="moninfoGameSelect"
              value={selectedGameKey || ''}
              onChange={(event) => navigateToState({
                level: 'moninfo',
                toolsKey: 'info',
                genKey: null,
                gameKey: null,
                sectionId: null,
                monInfoId: natiId,
                monInfoGameKey: event.target.value || null,
                monInfoForm: null,
              })}
            >
              {gameOptions.map((option) => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {!gameOptions.length ? (
        <div className="moninfo-debug">No Mon Info game data found for #{natiId}.</div>
      ) : (
        <MonInfoBody
          gameKey={selectedGameKey}
          mon={buildMonForRenderer(natiId, displayName)}
          formKey={state?.monInfoForm || null}
          onFormChange={(nextFormKey) => navigateToState({
            level: 'moninfo',
            toolsKey: 'info',
            genKey: null,
            gameKey: null,
            sectionId: null,
            monInfoId: natiId,
            monInfoGameKey: selectedGameKey,
            monInfoForm: nextFormKey,
          })}
        />
      )}
    </div>
  );
}
