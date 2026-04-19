import React from 'react';
import { ModalShell } from './ModalShell.jsx';

export function AmieDecorModal() {
  return (
    <ModalShell id="amieDecorModal" className="modal" hidden>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="amieDecorModalTitle">
        <header>
          <h2 id="amieDecorModalTitle">Poke-Amie Decorations</h2>
          <div className="toolbar" style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}>
            <input id="amieDecorSearch" className="flag-select" placeholder="Search decorations..." autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" data-gramm="false" data-lpignore="true" data-1p-ignore="true" data-form-type="other" />
            <button className="button" id="amieDecorSelectAll">Select All</button>
            <button className="button" id="amieDecorClearAll">Clear All</button>
          </div>
          <div className="modalChange"><button className="button" id="amieDecorModalClose" aria-label="Close">x</button></div>
        </header>
        <div className="body"><div id="amieDecorGrid" className="grid" role="list" /></div>
      </div>
    </ModalShell>
  );
}
