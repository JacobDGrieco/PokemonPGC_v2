import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription.js';
import { TIER_ORDER } from '../config/tiers.js';
import { _assetPath } from '../utils/assetPath.js';

const FEATURE_TILES = [
  {
    key: 'checklists',
    label: 'Checklists',
    description: 'Track your completion across every Pokémon game. Mark off Pokédex entries, in-game tasks, collectibles, and more.',
    path: '/checklists',
    minTier: 'free',
    icon: '✓',
  },
  {
    key: 'pokemon-info',
    label: 'Pokémon Info',
    description: 'Detailed stats, typings, moves, and forms for every Pokémon across all generations.',
    path: '/pokemon-info',
    minTier: 'great',
    icon: '🔴',
  },
  {
    key: 'guides',
    label: 'Guides',
    description: 'Step-by-step guides for completing each game, catching rare Pokémon, and unlocking every secret.',
    path: '/guides',
    minTier: 'ultra',
    icon: '📖',
  },
  {
    key: 'tools',
    label: 'Tools',
    description: 'Utilities and calculators to help plan your Pokémon journey.',
    path: '/tools',
    minTier: 'ultra',
    icon: '🔧',
  },
  {
    key: 'model-viewer',
    label: 'Model Viewer',
    description: 'View high-quality 3D Pokémon models directly in your browser.',
    path: '/model-viewer',
    minTier: 'master',
    icon: '🎮',
  },
  {
    key: 'global-stats',
    label: 'Global Stats',
    description: 'See how your completion rate compares to the community worldwide.',
    path: '/global-stats',
    minTier: 'ultra',
    icon: '📊',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { tierKey } = useSubscription();
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!window.PPGC?.currentUser);

  useEffect(() => {
    if (isLoggedIn) navigate('/checklists', { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const refresh = () => setIsLoggedIn(!!window.PPGC?.currentUser);
    window.addEventListener('ppgc:auth:changed', refresh);
    return () => window.removeEventListener('ppgc:auth:changed', refresh);
  }, []);

  if (isLoggedIn) return null;

  return (
    <div className="home-page">
      <section className="home-hero">
        <h1 className="home-hero-title">
          <img src={_assetPath('cloud-ball.png')} alt="" className="home-hero-icon" />
          PokémonPGC
        </h1>
        <p className="home-hero-tagline">Your complete Pokémon completion tracker</p>
      </section>

      <section className="home-tiles">
        {FEATURE_TILES.map((tile) => {
          const tileRank = TIER_ORDER.indexOf(tile.minTier);
          const userRank = TIER_ORDER.indexOf(tierKey);
          const isLocked = userRank < tileRank;

          return (
            <button
              key={tile.key}
              type="button"
              className={`home-tile${isLocked ? ' home-tile--locked' : ''}`}
              onClick={() => navigate(isLocked ? '/pricing' : tile.path)}
            >
              <div className="home-tile-icon">{tile.icon}</div>
              <div className="home-tile-content">
                <h2 className="home-tile-title">{tile.label}</h2>
                <p className="home-tile-desc">{tile.description}</p>
              </div>
              {isLocked && (
                <div className="home-tile-lock">
                  <span className="home-tile-tier-badge">
                    {tile.minTier.charAt(0).toUpperCase() + tile.minTier.slice(1)}
                  </span>
                  🔒
                </div>
              )}
            </button>
          );
        })}
      </section>

      <footer className="home-footer">
        <Link to="/pricing" className="home-footer-link">View Plans & Pricing</Link>
        <p className="home-footer-wip">
          PokémonPGC is actively being developed. More features coming soon.
        </p>
      </footer>
    </div>
  );
}
