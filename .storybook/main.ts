import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/stories/Progress.stories.@(ts|tsx)'],
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
  viteFinal: async (viteConfig) => {
    return {
      ...viteConfig,
      optimizeDeps: {
        ...viteConfig.optimizeDeps,
        include: [
          '@storybook/react-vite',
          '@storybook/testing-library',
          '@storybook/jest',
        ],
      },
      build: {
        ...viteConfig.build,
        sourcemap: true,
      },
      resolve: {
        ...viteConfig.resolve,
        alias: {
          ...viteConfig.resolve?.alias,
          '@': '/src',
        },
      },
    };
  },
};

export default config;
