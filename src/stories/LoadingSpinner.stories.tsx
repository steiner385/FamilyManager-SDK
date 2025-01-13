import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the spinner',
    },
    label: {
      control: 'text',
      description: 'Accessibility label for the spinner',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getByRole('status');
    
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveClass('animate-spin');
    await expect(spinner).toHaveClass('h-8');
    await expect(spinner).toHaveClass('w-8');
    await expect(spinner).toHaveAttribute('aria-busy', 'true');
    await expect(spinner).toHaveAttribute('aria-label', 'Loading');
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getByRole('status');
    
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveClass('h-4');
    await expect(spinner).toHaveClass('w-4');
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getByRole('status');
    
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveClass('h-12');
    await expect(spinner).toHaveClass('w-12');
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'Processing...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getByRole('status');
    
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveAttribute('aria-label', 'Processing...');
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'text-blue-500',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getByRole('status');
    
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveClass('text-blue-500');
  },
};
