import React, { useEffect } from 'react';
import { MarketingHeader } from '../nav/MarketingHeader.jsx';
import { AppModals } from '../AppModals.jsx';

export function MarketingShell({ children }) {
  useEffect(() => {
    const prev = document.body.style.overflowY;
    document.body.style.overflowY = 'auto';
    return () => { document.body.style.overflowY = prev; };
  }, []);

  return (
    <div className="marketing-shell">
      <MarketingHeader />
      <main className="marketing-content">
        {children}
      </main>
      <AppModals />
    </div>
  );
}
