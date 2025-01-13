import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from '../components/common/Toast';
import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';
import { 
  InformationCircleIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Visual style variant of the toast',
    },
    title: {
      control: 'text',
      description: 'Title text of the toast',
    },
    description: {
      control: 'text',
      description: 'Description text of the toast',
    },
    position: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Position of the toast on the screen',
    },
    autoClose: {
      control: 'boolean',
      description: 'Whether to automatically close the toast',
    },
    duration: {
      control: 'number',
      description: 'Duration in milliseconds before auto-closing',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    description: 'This is an informational message',
    icon: <InformationCircleIcon className="h-5 w-5" />,
    'data-testid': 'info-toast',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByTestId('info-toast');
    const title = canvas.getByTestId('info-toast-title');
    const description = canvas.getByTestId('info-toast-description');
    const icon = canvas.getByTestId('info-toast-icon');
    
    await expect(toast).toBeVisible();
    await expect(toast).toHaveClass('bg-blue-50');
    await expect(title).toHaveClass('text-blue-800');
    await expect(description).toHaveClass('text-blue-700');
    await expect(icon).toBeVisible();
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    description: 'Operation completed successfully',
    icon: <CheckCircleIcon className="h-5 w-5" />,
    'data-testid': 'success-toast',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByTestId('success-toast');
    
    await expect(toast).toBeVisible();
    await expect(toast).toHaveClass('bg-green-50');
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    description: 'Please review this important notice',
    icon: <ExclamationTriangleIcon className="h-5 w-5" />,
    'data-testid': 'warning-toast',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByTestId('warning-toast');
    
    await expect(toast).toBeVisible();
    await expect(toast).toHaveClass('bg-yellow-50');
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    description: 'An error occurred while processing your request',
    icon: <XCircleIcon className="h-5 w-5" />,
    'data-testid': 'error-toast',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByTestId('error-toast');
    
    await expect(toast).toBeVisible();
    await expect(toast).toHaveClass('bg-red-50');
  },
};

export const WithAction: Story = {
  args: {
    variant: 'info',
    title: 'New Update Available',
    description: 'A new version of the application is available',
    action: (
      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
        Update Now
      </button>
    ),
    'data-testid': 'action-toast',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const action = canvas.getByTestId('action-toast-action');
    
    await expect(action).toBeVisible();
  },
};

export const WithCloseButton: Story = {
  args: {
    title: 'Closeable Toast',
    description: 'Click the X button to close this toast',
    onClose: () => console.log('Toast closed'),
    'data-testid': 'close-toast',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const closeButton = canvas.getByTestId('close-toast-close');
    
    await expect(closeButton).toBeVisible();
    await userEvent.click(closeButton);
    await expect(canvas.queryByTestId('close-toast')).not.toBeInTheDocument();
  },
};

export const TopLeft: Story = {
  args: {
    position: 'top-left',
    title: 'Top Left Toast',
    description: 'This toast appears in the top-left corner',
    'data-testid': 'position-toast',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByTestId('position-toast');
    
    await expect(toast).toBeVisible();
    await expect(toast).toHaveClass('top-4');
    await expect(toast).toHaveClass('left-4');
  },
};

export const AutoClosing: Story = {
  args: {
    title: 'Auto-closing Toast',
    description: 'This toast will close automatically after 3 seconds',
    autoClose: true,
    duration: 3000,
    'data-testid': 'auto-close-toast',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByTestId('auto-close-toast');
    
    await expect(toast).toBeVisible();
    // Wait for auto-close
    await new Promise(resolve => setTimeout(resolve, 3500));
    await expect(canvas.queryByTestId('auto-close-toast')).not.toBeInTheDocument();
  },
};

export const ComplexToast: Story = {
  args: {
    variant: 'success',
    title: 'File Uploaded Successfully',
    description: 'Your file has been uploaded and is now ready for sharing',
    icon: <CheckCircleIcon className="h-5 w-5" />,
    action: (
      <div className="flex space-x-2">
        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
          View File
        </button>
        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300">
          Copy Link
        </button>
      </div>
    ),
    onClose: () => console.log('Toast closed'),
    position: 'top-right',
    'data-testid': 'complex-toast',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByTestId('complex-toast');
    const icon = canvas.getByTestId('complex-toast-icon');
    const title = canvas.getByTestId('complex-toast-title');
    const description = canvas.getByTestId('complex-toast-description');
    const action = canvas.getByTestId('complex-toast-action');
    const closeButton = canvas.getByTestId('complex-toast-close');
    
    await expect(toast).toBeVisible();
    await expect(icon).toBeVisible();
    await expect(title).toBeVisible();
    await expect(description).toBeVisible();
    await expect(action).toBeVisible();
    await expect(closeButton).toBeVisible();
  },
};
