import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { expect } from '@storybook/jest';
import { within, waitFor } from '@storybook/testing-library';

// Test component that triggers an error after mounting
const ErrorTrigger = ({ message = 'Test error triggered' }) => {
  useEffect(() => {
    throw new Error(message);
  }, [message]);
  return null;
};

const meta = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Content to be rendered inside the error boundary',
    },
    fallback: {
      control: 'text',
      description: 'Custom fallback UI to show when an error occurs',
    },
    testErrorTrigger: {
      control: 'boolean',
      description: 'Trigger a test error for demonstration',
    },
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div>Normal content without errors</div>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = canvas.getByText('Normal content without errors');
    await expect(content).toBeVisible();
  }
};

export const WithError: Story = {
  args: {
    children: <ErrorTrigger />
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the default error UI when an error occurs.',
      },
    },
    chromatic: { disableSnapshot: true }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      const errorHeading = canvas.getByText('Something went wrong');
      const errorMessage = canvas.getByText('Test error triggered');
      expect(errorHeading).toBeInTheDocument();
      expect(errorMessage).toBeInTheDocument();
    });
  }
};

export const WithCustomFallback: Story = {
  args: {
    children: <ErrorTrigger />,
    fallback: (
      <div className="text-center p-4 bg-yellow-100 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800">Custom Error View</h2>
        <p className="text-yellow-700">Something went wrong with the application</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a custom error UI when an error occurs.',
      },
    },
    chromatic: { disableSnapshot: true }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      const customErrorHeading = canvas.getByText('Custom Error View');
      const customErrorMessage = canvas.getByText('Something went wrong with the application');
      expect(customErrorHeading).toBeInTheDocument();
      expect(customErrorMessage).toBeInTheDocument();
    });
  }
};

export const WithComponentError: Story = {
  args: {
    children: <ErrorTrigger message="Component error" />
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the error boundary handles component errors.',
      },
    },
    chromatic: { disableSnapshot: true }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      const errorHeading = canvas.getByText('Something went wrong');
      const errorMessage = canvas.getByText('Component error');
      expect(errorHeading).toBeInTheDocument();
      expect(errorMessage).toBeInTheDocument();
    });
  }
};

export const WithNestedContent: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div>This content should render normally</div>
        <ErrorBoundary testErrorTrigger={true}>
          <div>This content will not be shown due to error</div>
        </ErrorBoundary>
        <div>This content should also render normally</div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how errors are contained within nested error boundaries.',
      },
    },
    chromatic: { disableSnapshot: true },
    test: {
      skip: true,
      excludeFromTest: true,
      excludeFromStorybook: true,
      excludeFromSmoke: true,
      excludeFromPlayback: true,
      excludeFromInteractions: true
    }
  }
};
