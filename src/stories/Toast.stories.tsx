import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast, ToastProps } from '../components/common/Toast';
import { Button } from '../components/common/Button';

// Example icons for different variants
const icons = {
  info: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  success: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

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
    },
    position: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    },
    autoClose: {
      control: 'boolean',
    },
    duration: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Notification',
    description: 'This is a default toast message',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Information',
    description: 'This is a toast message with an icon',
    icon: icons.info,
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    description: 'Operation completed successfully',
    icon: icons.success,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    description: 'Please review your input',
    icon: icons.warning,
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    description: 'An error occurred while processing your request',
    icon: icons.error,
  },
};

export const WithAction: Story = {
  args: {
    variant: 'info',
    title: 'New Update Available',
    description: 'A new version of the application is available.',
    icon: icons.info,
    action: (
      <div className="flex space-x-2">
        <Button size="sm" variant="outline">Later</Button>
        <Button size="sm" variant="primary">Update Now</Button>
      </div>
    ),
  },
};

export const AutoClosing: Story = {
  args: {
    variant: 'success',
    title: 'Auto Close',
    description: 'This toast will close automatically after 3 seconds',
    icon: icons.success,
    autoClose: true,
    duration: 3000,
  },
};

export const Positions: Story = {
  render: () => (
    <div className="relative min-h-[500px] min-w-[500px]">
      <Toast
        position="top-left"
        variant="info"
        title="Top Left"
        description="Position: top-left"
        icon={icons.info}
      />
      <Toast
        position="top-right"
        variant="success"
        title="Top Right"
        description="Position: top-right"
        icon={icons.success}
      />
      <Toast
        position="bottom-left"
        variant="warning"
        title="Bottom Left"
        description="Position: bottom-left"
        icon={icons.warning}
      />
      <Toast
        position="bottom-right"
        variant="error"
        title="Bottom Right"
        description="Position: bottom-right"
        icon={icons.error}
      />
    </div>
  ),
};

// Example of a toast with a loading state
export const LoadingState: Story = {
  args: {
    variant: 'info',
    title: 'Uploading Files',
    description: 'Please wait while we upload your files...',
    icon: (
      <svg
        className="h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    ),
    autoClose: false,
  },
};

// Example of interactive toasts
export const Interactive: Story = {
  render: () => {
    const [toasts, setToasts] = React.useState<Array<{ id: number; variant: ToastProps['variant']; message: string }>>([]);
    const [counter, setCounter] = React.useState(0);

    const addToast = (variant: ToastProps['variant'], message: string) => {
      const id = counter;
      setCounter((prev) => prev + 1);
      setToasts((prev) => [...prev, { id, variant, message }]);
    };

    const removeToast = (id: number) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => addToast('info', 'Information message')}
          >
            Add Info
          </Button>
          <Button
            variant="primary"
            onClick={() => addToast('success', 'Success message')}
          >
            Add Success
          </Button>
          <Button
            variant="primary"
            onClick={() => addToast('warning', 'Warning message')}
          >
            Add Warning
          </Button>
          <Button
            variant="primary"
            onClick={() => addToast('error', 'Error message')}
          >
            Add Error
          </Button>
        </div>
        {toasts.map(({ id, variant, message }) => (
          <Toast
            key={id}
            variant={variant}
            title={`${variant?.charAt(0).toUpperCase()}${variant?.slice(1)}`}
            description={message}
            icon={icons[variant ?? 'info']}
            onClose={() => removeToast(id)}
            autoClose
            duration={5000}
          />
        ))}
      </div>
    );
  },
};
