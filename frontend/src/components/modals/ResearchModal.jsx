import React from 'react';
import { ModalShell } from './ModalShell.jsx';

export function ResearchModal() {
  return (
    <ModalShell id="researchModal" className="modal" hidden>
      <div className="modal-dialog">
        <header className="modal-hd">
          <h2 id="researchTitle">Research Tasks</h2>
          <button id="researchModalClose" className="modal-close">✕</button>
        </header>
        <div className="modal-bd"><div id="researchGrid" className="research-grid" /></div>
      </div>
    </ModalShell>
  );
}
