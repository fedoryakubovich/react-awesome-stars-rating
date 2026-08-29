import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Standalone UMD bundle for <script> / CDN users. It uses the classic JSX
// runtime so the only global it needs is React: react/jsx-runtime has no
// global build and cannot be externalised here.
export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/lib/index.tsx'),
      name: 'ReactAwesomeStarsRating',
      formats: ['umd'],
      fileName: () => 'index.umd.cjs',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        exports: 'named',
        minify: true,
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
});
