import React from 'react';
import { ModalShell } from './ModalShell.jsx';

export function ModelViewerModal() {
  return (
    <ModalShell id="modelViewerModal" className="modal">
      <div className="modal-dialog" style={{ overflowY: 'hidden' }}>
        <header className="modal-hd">
          <h2 id="modelViewerTitle">Model Viewer</h2>
          <button id="modelViewerClose" className="modal-close" aria-label="Close">✕</button>
        </header>
        <div className="modal-bd"><div id="modelViewerBody" /></div>
      </div>
    </ModalShell>
  );
}
