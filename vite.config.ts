import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['@storybook/testing-library', '@storybook/jest'],
    },
  },
  server: {
    fs: {
      strict: true,
    },
  },
});
