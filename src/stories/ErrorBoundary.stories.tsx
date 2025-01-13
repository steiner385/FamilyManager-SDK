import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

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
  },
};

export const WithError: Story = {
  args: {
    testErrorTrigger: true,
    children: <div>This content won't be shown due to the error</div>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check for error UI elements
    const errorCode = canvas.getByText('500');
    const errorTitle = canvas.getByText('Something went wrong');
    const reloadButton = canvas.getByText('Reload page');
    const homeButton = canvas.getByText('Go back home');
    
    await expect(errorCode).toBeVisible();
    await expect(errorTitle).toBeVisible();
    await expect(reloadButton).toBeVisible();
    await expect(homeButton).toBeVisible();
    
    // Verify error message
    const errorMessage = canvas.getByText('Test error triggered');
    await expect(errorMessage).toBeVisible();
  },
};

export const WithCustomFallback: Story = {
  args: {
    testErrorTrigger: true,
    children: <div>This content won't be shown due to the error</div>,
    fallback: (
      <div className="text-center p-4 bg-yellow-100 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800">Custom Error View</h2>
        <p className="text-yellow-600">Something went wrong with the application</p>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const customTitle = canvas.getByText('Custom Error View');
    const customMessage = canvas.getByText('Something went wrong with the application');
    
    await expect(customTitle).toBeVisible();
    await expect(customMessage).toBeVisible();
    await expect(customTitle).toHaveClass('text-xl');
    await expect(customTitle).toHaveClass('font-bold');
  },
};

const BuggyComponent = () => {
  throw new Error('Component error');
  return <div>This won't render</div>;
};

export const WithComponentError: Story = {
  args: {
    children: <BuggyComponent />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check for error UI elements
    const errorCode = canvas.getByText('500');
    const errorTitle = canvas.getByText('Something went wrong');
    const errorMessage = canvas.getByText('Component error');
    
    await expect(errorCode).toBeVisible();
    await expect(errorTitle).toBeVisible();
    await expect(errorMessage).toBeVisible();
  },
};

export const WithNestedContent: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div>This content should render normally</div>
        <ErrorBoundary>
          <BuggyComponent />
        </ErrorBoundary>
        <div>This content should also render normally</div>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that non-error content renders
    const normalContent1 = canvas.getByText('This content should render normally');
    const normalContent2 = canvas.getByText('This content should also render normally');
    
    await expect(normalContent1).toBeVisible();
    await expect(normalContent2).toBeVisible();
    
    // Check that error boundary caught the error
    const errorTitle = canvas.getByText('Something went wrong');
    await expect(errorTitle).toBeVisible();
  },
};
