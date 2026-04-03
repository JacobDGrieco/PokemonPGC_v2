import React, { useEffect } from 'react';
import { save, store } from '../store.js';
import { usePpgcSnapshot } from '../react-bridge/usePpgcSnapshot.js';
import { navigateHome, navigateToToolsInfo } from '../react-bridge/navigation.js';
import { wireGlobalTaskSearch } from '../ui/taskSearch.js';

export function AppHeader() {
  const snapshot = usePpgcSnapshot();
  const isCollapsed = !!(snapshot?.state || store.state)?.sidebarCollapsed;

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    wireGlobalTaskSearch();
  }, [isCollapsed]);

  return (
    <header className="app-header">
      <button
        id="sidebarToggle"
        className="sidebar-toggle"
        data-react-managed="true"
        type="button"
        aria-label="Toggle sidebar"
        aria-pressed={isCollapsed ? 'true' : 'false'}
        onClick={() => {
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
        <button id="ppgcMonInfoBtn" className="brand-link brand-button" type="button" onClick={navigateToToolsInfo}>
          Info/Tools
        </button>
      </div>

      <div className="task-search-wrap">
        <input
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
