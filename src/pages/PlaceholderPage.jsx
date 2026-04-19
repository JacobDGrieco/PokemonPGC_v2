import React from 'react';
import { Link } from 'react-router-dom';
import { FEATURE_LABELS } from '../config/tiers.js';
import { useSubscription } from '../hooks/useSubscription.js';
import { AppShell } from '../components/shells/AppShell.jsx';

export function PlaceholderPage({ feature }) {
  const { hasFeature } = useSubscription();
  const label = FEATURE_LABELS[feature] ?? feature;
  const isUnlocked = hasFeature(feature);

  return (
    <AppShell>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '80px 24px',
          textAlign: 'center',
          minHeight: '60vh',
        }}
      >
        <div style={{ fontSize: 48 }}>{isUnlocked ? '🚧' : '🔒'}</div>
        <h1 style={{ margin: 0, fontSize: 28 }}>{label}</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, maxWidth: 380 }}>
          {isUnlocked
            ? 'This feature is coming soon. Thanks for supporting development!'
            : 'This feature requires a higher subscription tier.'}
        </p>
        {isUnlocked ? (
          <Link to="/checklists" style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            ← Back to Checklists
          </Link>
        ) : (
          <Link
            to="/pricing"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid var(--line-soft)',
              color: 'var(--text-main)',
              padding: '10px 22px',
              borderRadius: 999,
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            View Plans
          </Link>
        )}
      </div>
    </AppShell>
  );
}
