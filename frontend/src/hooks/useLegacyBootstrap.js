import { useEffect } from 'react';

export function useLegacyBootstrap() {
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (window.__PPGC_LEGACY_BOOTSTRAPPED__ || cancelled) return;
      window.__PPGC_LEGACY_BOOTSTRAPPED__ = true;

      try {
        await import('../index.js');
      } catch (error) {
        console.error('[ppgc] legacy bootstrap failed:', error);
      }
    }

    const id = window.setTimeout(boot, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);
}
