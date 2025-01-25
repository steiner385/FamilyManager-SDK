import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Toast from '../components/common/Toast';
import type { ToastType } from '../components/common/Toast';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Message to display in the toast',
    },
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Type of toast notification',
    },
    duration: {
      control: 'number',
      description: 'Duration in milliseconds before auto-closing',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when toast is closed',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    message: 'This is an informational message',
    type: 'info' as ToastType,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByRole('alert');
    await expect(toast).toBeInTheDocument();
  },
};

export const Success: Story = {
  args: {
    message: 'Operation completed successfully',
    type: 'success' as ToastType,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByRole('alert');
    await expect(toast).toBeInTheDocument();
  },
};

export const Warning: Story = {
  args: {
    message: 'Please review this important notice',
    type: 'warning' as ToastType,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByRole('alert');
    await expect(toast).toBeInTheDocument();
  },
};

export const Error: Story = {
  args: {
    message: 'An error occurred while processing your request',
    type: 'error' as ToastType,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByRole('alert');
    await expect(toast).toBeInTheDocument();
  },
};

export const CustomDuration: Story = {
  args: {
    message: 'This toast will close in 5 seconds',
    type: 'info' as ToastType,
    duration: 5000,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByRole('alert');
    await expect(toast).toBeInTheDocument();
  },
};
