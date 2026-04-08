import React, { useEffect, useRef, useState } from 'react';
import { save, store } from '../store.js';
import { usePpgcSnapshot } from '../react-bridge/usePpgcSnapshot.js';
import { navigateHome } from '../react-bridge/navigation.js';
import { wireGlobalTaskSearch } from '../ui/taskSearch.js';

export function AppHeader({ isMobile, mobileNavOpen, setMobileNavOpen }) {
  const snapshot = usePpgcSnapshot();
  const isCollapsed = !!(snapshot?.state || store.state)?.sidebarCollapsed;
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    document.body.classList.toggle('mobile-ui', isMobile);
    document.body.classList.toggle('mobile-nav-open', isMobile && mobileNavOpen);
    wireGlobalTaskSearch();
  }, [isCollapsed, isMobile, mobileNavOpen]);

  useEffect(() => {
    if (!isMobile) {
      setMobileSearchOpen(false);
      return;
    }
    if (mobileSearchOpen) {
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isMobile, mobileSearchOpen]);

  return (
    <header className="app-header">
      <button
        id="sidebarToggle"
        className="sidebar-toggle"
        data-react-managed="true"
        type="button"
        aria-label="Toggle sidebar"
        aria-pressed={isMobile ? (mobileNavOpen ? 'true' : 'false') : (isCollapsed ? 'true' : 'false')}
        onClick={() => {
          if (isMobile) {
            setMobileNavOpen((value) => !value);
            return;
          }

          const next = !document.body.classList.contains('sidebar-collapsed');
          document.body.classList.toggle('sidebar-collapsed', next);
          store.state.sidebarCollapsed = next;
          save();
          window.PPGC?.renderAll?.();
        }}
      >
        ☰
      </button>

      <div className="header-brand">
        <button id="ppgcHomeBtn" className="brand-link brand-button" type="button" onClick={navigateHome}>
          PokémonPGC
        </button>
        <button
          type="button"
          className={`mobile-search-toggle ${mobileSearchOpen ? 'is-open' : ''}`}
          aria-label="Search tasks"
          aria-expanded={mobileSearchOpen ? 'true' : 'false'}
          onClick={() => setMobileSearchOpen((value) => !value)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l5 5" />
          </svg>
        </button>
      </div>

      <div className={`task-search-wrap ${isMobile ? 'task-search-mobile' : ''} ${mobileSearchOpen ? 'is-mobile-open' : ''}`}>
        <input
          ref={inputRef}
          id="taskSearchInput"
          className="task-search-input"
          type="search"
          placeholder="Search tasks…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-gramm="false"
          data-lpignore="true"
          data-1p-ignore="true"
          data-form-type="other"
        />
        <div id="taskSearchResults" className="task-search-results" />
      </div>

      <div className="breadcrumbs" id="crumbs" style={{ display: 'none' }} />
    </header>
  );
}
