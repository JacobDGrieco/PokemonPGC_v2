import React from 'react';
import { ModalShell } from './ModalShell.jsx';

export function CollectionModal() {
  return (
    <ModalShell id="collectionModal" className="modal" hidden>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="collectionModalTitle">
        <header>
          <h2 id="collectionModalTitle">Collection</h2>
          <div className="toolbar" style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}>
            <label id="collectionGenderToggle" className="sprite-toggle hidden">
              <span className="lbl">Male</span>
              <input type="checkbox" id="collectionGenderCheckbox" />
              <span className="switch"><span className="knob" /></span>
              <span className="lbl">Female</span>
            </label>
            <input
              id="collectionSearch"
              className="flag-select"
              placeholder="Search..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-gramm="false"
              data-lpignore="true"
              data-1p-ignore="true"
              data-form-type="other"
            />
            <button className="button" id="collectionSelectAll" type="button">Select All</button>
            <button className="button" id="collectionClearAll" type="button">Clear All</button>
          </div>
          <div className="modalChange">
            <button className="button" id="collectionModalClose" type="button" aria-label="Close">X</button>
          </div>
        </header>
        <div className="body"><div id="collectionGrid" className="grid" role="list" /></div>
      </div>
    </ModalShell>
  );
}
