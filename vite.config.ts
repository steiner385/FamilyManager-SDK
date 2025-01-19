import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['winston']
  },
  server: {
    port: 6010,
    strictPort: true
  },
  build: {
    lib: {
      entry: {
        'index': resolve(__dirname, 'src/index.ts'),
        'core/events/EventBus': resolve(__dirname, 'src/core/events/EventBus.ts'),
        'core/events/types': resolve(__dirname, 'src/core/events/types.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`
    },
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@headlessui/react',
        '@heroicons/react',
        '@tanstack/react-query',
        'hono',
        'jsonwebtoken',
        'react-router-dom',
        'tailwind-merge',
        'uuid',
        'winston',
        'zod'
      ],
      output: {
        // Global variables for UMD build
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          '@headlessui/react': 'Headless',
          '@heroicons/react': 'HeroIcons',
          '@tanstack/react-query': 'ReactQuery',
          'hono': 'Hono',
          'jsonwebtoken': 'jwt',
          'react-router-dom': 'ReactRouterDOM',
          'tailwind-merge': 'tailwindMerge',
          'uuid': 'uuid',
          'winston': 'winston',
          'zod': 'zod'
        }
      }
    },
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    // Use esbuild for minification
    minify: 'esbuild',
    target: 'es2020'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@core': resolve(__dirname, './src/core'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@contexts': resolve(__dirname, './src/contexts')
    }
  }
});
