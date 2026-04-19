import React from 'react';
import { ModalShell } from './ModalShell.jsx';

export function DexModalCompact() {
  return (
    <ModalShell id="modal" className="modal" hidden>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <header className="dex-modal-header">
          <div className="dex-header-title-group">
            <h2 id="modalTitle">Pokedex</h2>
            <div id="dexScopeMount" className="dex-scope-mount" />
          </div>
          <div className="dex-header-search-row">
            <input
              id="dexSearch"
              className="flag-select dex-search-input"
              type="text"
              placeholder="Search dex... or type /help"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-gramm="false"
              data-lpignore="true"
              data-1p-ignore="true"
              data-form-type="other"
            />
          </div>
          <div className="dex-header-actions">
            <div className="dex-bulk-split" id="dexBulkSplit">
              <button id="dexSelectAll" className="button dex-bulk-primary" type="button">Set All</button>
              <button
                id="dexBulkActionToggle"
                className="button dex-bulk-toggle"
                type="button"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-controls="dexBulkActionMenu"
                aria-label="Choose Set All status"
              >
                v
              </button>
              <div id="dexBulkActionMenu" className="dex-bulk-menu" role="menu" hidden />
              <select id="dexClearAll" className="flag-select dex-bulk-hidden-select" tabIndex={-1} aria-hidden="true" />
            </div>
            <button id="modalClose" className="button dex-close-button" type="button" aria-label="Close Dex modal">X</button>
          </div>
        </header>
        <div className="body"><div id="dexGrid" className="grid" role="list" /></div>
      </div>
    </ModalShell>
  );
}
