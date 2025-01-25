import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/styles/globals.css';

const withMainWrapper = (Story: React.ComponentType, context: any) => {
  return (
    <main>
      <h1 className="sr-only">{context.title}</h1>
      <Story />
    </main>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Enable interaction testing
    interactions: {
      disable: false,
    },
    // Configure test runner
    testRunner: {
      waitForStoryRender: true,
      timeout: 10000,
    },
  },
  decorators: [withMainWrapper],
};

export default preview;
