import React from 'react';
import { ModalShell } from './ModalShell.jsx';

export function DexModal() {
  return (
    <ModalShell id="modal" className="modal" hidden>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <header>
          <h2 id="modalTitle">Pokédex</h2>
          <div className="toolbar" style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}>
            <input id="dexSearch" className="flag-select" type="text" placeholder="Search dex… (/help for commands)" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" data-gramm="false" data-lpignore="true" data-1p-ignore="true" data-form-type="other" />
            <button id="dexSelectAll" className="button">Set All</button>
            <select id="dexClearAll" className="flag-select" />
          </div>
          <div className="modalChange"><button id="modalClose" className="button">✕</button></div>
        </header>
        <div className="body"><div id="dexGrid" className="grid" role="list" /></div>
      </div>
    </ModalShell>
  );
}
