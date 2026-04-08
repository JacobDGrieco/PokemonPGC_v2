import React from 'react';
import { DexModalCompact } from './modals/DexModalCompact.jsx';
import { MonInfoModal } from './modals/MonInfoModal.jsx';
import { ModelViewerModal } from './modals/ModelViewerModal.jsx';
import { ResearchModal } from './modals/ResearchModal.jsx';
import { FashionModal } from './modals/FashionModal.jsx';
import { FormsModal } from './modals/FormsModal.jsx';
import { MedalsModal } from './modals/MedalsModal.jsx';
import { AuthModal } from './modals/AuthModal.jsx';

export function AppModals() {
  return (
    <>
      <DexModalCompact />
      <MonInfoModal />
      <ModelViewerModal />
      <ResearchModal />
      <FashionModal />
      <FormsModal />
      <MedalsModal />
      <AuthModal />
    </>
  );
}
