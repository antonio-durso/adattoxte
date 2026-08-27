import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  // Il prerender statico usa `vite preview`: il proxy /api punta al backend LIVE,
  // così le pagine catturate contengono dati reali (non lo stato d'errore).
  preview: {
    port: 4173,
    host: true,
    proxy: {
      '/api': process.env.API_PROXY || 'https://adattoxte-backend.onrender.com',
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Split librerie: il "motore" react viene cacheato separatamente
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
