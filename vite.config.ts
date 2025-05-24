import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  server: { host: '0.0.0.0', open: true, port: 3000 },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/lib/index.tsx'),
      formats: ['es', 'umd'],
      name: 'react-awesome-stars-rating',
    },
  },
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.lib.json'),
      outDir: 'dist',
      beforeWriteFile: (filePath, content) => {
        const target = 'src/lib/types.d.ts';

        if (!filePath.includes(target)) return false;

        return { filePath: filePath.replace(target, 'index.d.ts'), content };
      },
    }),
  ],
});
