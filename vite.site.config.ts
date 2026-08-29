import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for the demo/docs site (SPA), separate from library build.
// SITE_BASE is set by the Pages workflow, which serves the site from a
// repository subpath; locally the site stays at the root.
export default defineConfig({
  plugins: [react()],
  base: process.env.SITE_BASE ?? '/',
  build: {
    outDir: 'dist-site',
  },
});
