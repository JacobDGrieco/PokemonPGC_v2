import React from 'react';
import { AppHeader } from './components/AppHeader.jsx';
import { AppSidebar } from './components/AppSidebar.jsx';
import { AppModals } from './components/AppModals.jsx';
import { ReactContentRouter } from './components/content/ReactContentRouter.jsx';

export default function App() {
  return (
    <>
      <div className="app-shell">
        <AppHeader />
        <div className="app">
          <AppSidebar />
          <main id="content" className="content" aria-live="polite">
            <ReactContentRouter />
          </main>
        </div>
      </div>
      <AppModals />
    </>
  );
}
