import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for the demo/docs site (SPA), separate from library build.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
