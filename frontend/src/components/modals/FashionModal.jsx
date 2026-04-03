import React from 'react';
import { ModalShell } from './ModalShell.jsx';

export function FashionModal() {
  return (
    <ModalShell id="fashionModal" className="modal" hidden>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="fashionModalTitle">
        <header>
          <h2 id="fashionModalTitle">Fashion</h2>
          <div className="toolbar" style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}>
            <label id="fashionGenderToggle" className="sprite-toggle hidden">
              <span className="lbl">Male</span>
              <input type="checkbox" id="fashionGenderCheckbox" />
              <span className="switch"><span className="knob" /></span>
              <span className="lbl">Female</span>
            </label>
            <input id="fashionSearch" className="flag-select" placeholder="Search fashion…" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" data-gramm="false" data-lpignore="true" data-1p-ignore="true" data-form-type="other" />
            <button className="button" id="fashionSelectAll">Select All</button>
            <button className="button" id="fashionClearAll">Clear All</button>
          </div>
          <div className="modalChange"><button className="button" id="fashionModalClose" aria-label="Close">✕</button></div>
        </header>
        <div className="body"><div id="fashionGrid" className="grid" role="list" /></div>
      </div>
    </ModalShell>
  );
}
