import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true,
    enableCrashReports: false,
    disableWhatsNewNotifications: true,
  },
  features: {
    storyStoreV7: true,
  },
  viteFinal: async (config) => {
    return {
      ...config,
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          '@storybook/react-vite',
          '@storybook/testing-library',
          '@storybook/jest',
          '@storybook/addon-interactions',
        ],
      },
      build: {
        ...config.build,
        sourcemap: true,
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@': '/src',
        },
      },
      server: {
        ...config.server,
        fs: {
          strict: false,
        },
      },
    };
  },
};

export default config;
