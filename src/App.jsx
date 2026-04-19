import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/shells/AppShell.jsx';
import { MarketingShell } from './components/shells/MarketingShell.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { PricingPage } from './pages/PricingPage.jsx';
import { SubscriptionSuccessPage } from './pages/SubscriptionSuccessPage.jsx';
import { PlaceholderPage } from './pages/PlaceholderPage.jsx';
import { AccountRoutePage } from './pages/AccountRoutePage.jsx';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <Routes>
        {/* Marketing shell — no sidebar */}
        <Route
          path="/"
          element={
            <MarketingShell>
              <HomePage />
            </MarketingShell>
          }
        />
        <Route
          path="/pricing"
          element={
            <MarketingShell>
              <PricingPage />
            </MarketingShell>
          }
        />
        <Route
          path="/subscription/success"
          element={
            <MarketingShell>
              <SubscriptionSuccessPage />
            </MarketingShell>
          }
        />

        {/* App shell — full sidebar + header */}
        <Route path="/checklists" element={<AppShell />} />
        <Route
          path="/account"
          element={(
            <AppShell routeLevelOverride="account">
              <AccountRoutePage />
            </AppShell>
          )}
        />
        <Route
          path="/account/:tab"
          element={(
            <AppShell routeLevelOverride="account">
              <AccountRoutePage />
            </AppShell>
          )}
        />

        {/* Placeholder pages — AppShell with stub content */}
        <Route path="/pokemon-info" element={<PlaceholderPage feature="pokemon-info" />} />
        <Route path="/guides" element={<PlaceholderPage feature="guides" />} />
        <Route path="/tools" element={<PlaceholderPage feature="tools" />} />
        <Route path="/global-stats" element={<PlaceholderPage feature="global-stats" />} />
        <Route path="/model-viewer" element={<PlaceholderPage feature="model-viewer" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics debug={false} />
    </>
  );
}
