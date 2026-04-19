import React, { useMemo } from 'react';
import { _assetPath } from '../../utils/assetPath.js';
import { navigateToState } from '../../react-bridge/navigation.js';
import { getHomeDexMons, pad4, pickPreferredGameForMon } from '../../react-bridge/monInfo.js';

export function MonInfoIndexPage() {
  const mons = useMemo(() => getHomeDexMons(), []);

  return (
    <div className="page react-moninfo-page">
      <h2 className="page-title">Mon Info</h2>
      <div className="moninfo-grid">
        {mons.map((mon) => {
          const p4 = pad4(mon.natiId);
          return (
            <button
              key={mon.natiId}
              type="button"
              className="moninfo-card"
              onClick={() => navigateToState({
                level: 'moninfo',
                genKey: null,
                gameKey: null,
                sectionId: null,
                monInfoId: mon.natiId,
                monInfoGameKey: pickPreferredGameForMon(mon.natiId, null),
                monInfoForm: null,
                toolsKey: 'info',
              })}
            >
              <div className="moninfo-card-id">#{p4}</div>
              <img className="moninfo-card-img" src={_assetPath(`sprites/pokemon_home/base-front/${p4}.png`)} alt={`#${mon.natiId}`} />
              <div className="moninfo-card-name">{mon.name || `#${p4}`}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
