import React from 'react';
import { ModalShell } from './ModalShell.jsx';

export function MedalsModal() {
  return (
    <ModalShell id="medalsModal" className="modal" hidden>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="medalsModalTitle">
        <header>
          <h2 id="medalsModalTitle">Medals</h2>
          <div className="toolbar" style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}>
            <input id="medalsSearch" className="flag-select" placeholder="Search medal…" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" data-gramm="false" data-lpignore="true" data-1p-ignore="true" data-form-type="other" />
            <button className="button" id="medalsSelectAll">Select All</button>
            <button className="button" id="medalsClearAll">Clear All</button>
          </div>
          <div className="modalChange"><button className="button" id="medalsModalClose" aria-label="Close">✕</button></div>
        </header>
        <div className="body"><div id="medalsGrid" className="grid" role="list" /></div>
      </div>
    </ModalShell>
  );
}
