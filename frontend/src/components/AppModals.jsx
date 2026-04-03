import React from 'react';
import { DexModal } from './modals/DexModal.jsx';
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
      <DexModal />
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
