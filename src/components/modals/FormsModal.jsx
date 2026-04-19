import React from 'react';
import { ModalShell } from './ModalShell.jsx';

export function FormsModal() {
  return (
    <ModalShell id="formsModal" className="modal" hidden>
      <div className="modal-dialog">
        <div className="modal-hd">
          <h3 id="formsModalTitle">Select Forms</h3>
          <button className="modal-close" id="formsModalClose" aria-label="Close">✕</button>
        </div>
        <div className="modal-bd"><div id="formsWheel" className="forms-wheel" /></div>
      </div>
    </ModalShell>
  );
}
