import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = env.PPGC_API_PORT || env.API_PORT || env.PPGC_BACKEND_PORT || env.BACKEND_PORT || '3000';
  const apiProxyTarget = `http://127.0.0.1:${apiPort}`;
  const assetBaseUrl = env.VITE_ASSET_BASE_URL || env.ASSET_BASE_URL || '';
  const apiBaseUrl = env.VITE_API_BASE_URL || env.API_BASE_URL || '';

  return {
  plugins: [react()],
  publicDir: false,
  define: {
    'globalThis.__ASSET_BASE_URL__': JSON.stringify(assetBaseUrl),
    'globalThis.__API_BASE_URL__': JSON.stringify(apiBaseUrl),
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '^/api(?:/|$)': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  };
});
