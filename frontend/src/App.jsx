import React, { useEffect, useState } from 'react';
import { store } from './store.js';
import { AppHeader } from './components/AppHeader.jsx';
import { AppSidebar } from './components/AppSidebar.jsx';
import { AppModals } from './components/AppModals.jsx';
import { ReactContentRouter } from './components/content/ReactContentRouter.jsx';

export default function App() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 900px)').matches);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const sync = () => {
      const nextIsMobile = media.matches;
      setIsMobile(nextIsMobile);
      if (!nextIsMobile) setMobileNavOpen(false);
    };

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const closeMobileNav = () => setMobileNavOpen(false);
  const isDesktopCollapsed = !!store.state?.sidebarCollapsed;

  return (
    <>
      <div className="app-shell" data-task-density={store.state?.taskDensity === 'comfortable' ? 'comfortable' : 'compact'}>
        <AppHeader
          isMobile={isMobile}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
        />
        <div className="app">
          <AppSidebar
            isMobile={isMobile}
            mobileNavOpen={mobileNavOpen}
            closeMobileNav={closeMobileNav}
          />
          <button
            type="button"
            className="app-scrim"
            aria-label="Close navigation"
            aria-hidden={isMobile && mobileNavOpen ? 'false' : 'true'}
            tabIndex={isMobile && mobileNavOpen ? 0 : -1}
            onClick={closeMobileNav}
          />
          <main
            id="content"
            className="content"
            aria-live="polite"
            onClick={() => {
              if (isMobile && mobileNavOpen) closeMobileNav();
            }}
            data-sidebar-collapsed={!isMobile && isDesktopCollapsed ? 'true' : 'false'}
          >
            <ReactContentRouter />
          </main>
        </div>
      </div>
      <AppModals />
    </>
  );
}
