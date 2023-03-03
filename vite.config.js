import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: ['src/index.ts'],
      formats: ['cjs'],
      fileName(format, entryName) {
        const ext = format === 'es' ? 'js' : 'cjs';
        return [entryName, ext].join('.');
      },
    },
    outDir: 'dist',
    rollupOptions: {
      external: id => {
        return !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
    emptyOutDir: true,
  },
  plugins: [react()],
});
