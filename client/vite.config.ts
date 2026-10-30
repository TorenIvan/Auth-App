import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === 'development' ? mkcert() : undefined].filter(Boolean),
  server: {
    // HTTPS in development comes from the mkcert plugin
    // Same-origin API in development, exactly like production (SameSite=Strict cookies, Sec-Fetch-Site)
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
