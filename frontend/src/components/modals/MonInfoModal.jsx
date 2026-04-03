import React from 'react';
import { ModalShell } from './ModalShell.jsx';

export function MonInfoModal() {
  return (
    <ModalShell id="monInfoModal" className="modal" hidden>
      <div className="modal-dialog">
        <header className="modal-hd">
          <h2 id="monInfoTitle">Pokémon Info</h2>
          <button id="monInfoClose" className="modal-close" aria-label="Close">✕</button>
        </header>
        <div className="modal-bd"><div id="monInfoBody" className="mon-info-body" /></div>
      </div>
    </ModalShell>
  );
}
