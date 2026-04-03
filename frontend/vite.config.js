import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendPort = process.env.PPGC_BACKEND_PORT || process.env.BACKEND_PORT || '3000';
const apiProxyTarget = `http://127.0.0.1:${backendPort}`;

export default defineConfig({
  plugins: [react()],
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
});
