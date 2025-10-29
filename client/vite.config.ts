import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === 'development' ? mkcert() : undefined].filter(Boolean),
  server: {
    https: mode === 'development', // Only HTTPS in development
  },
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
