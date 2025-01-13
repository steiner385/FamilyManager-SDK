import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/common/Badge';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    a11y: {
      config: {
        rules: [
          {
            // Badges are often used for status/decorative purposes, so we can disable this rule
            id: 'color-contrast',
            enabled: false
          }
        ]
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'The visual style variant of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the badge',
    },
    rounded: {
      control: 'boolean',
      description: 'Whether to use fully rounded corners',
    },
    dot: {
      control: 'boolean',
      description: 'Whether to show a colored dot before the content',
    },
    children: {
      control: 'text',
      description: 'The content to display inside the badge',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Badge',
    variant: 'primary',
    'data-testid': 'primary-badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId('primary-badge');
    
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass('bg-blue-100');
    await expect(badge).toHaveClass('text-blue-800');
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Badge',
    variant: 'secondary',
    'data-testid': 'secondary-badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId('secondary-badge');
    
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass('bg-gray-100');
    await expect(badge).toHaveClass('text-gray-800');
  },
};

export const Success: Story = {
  args: {
    children: 'Success Badge',
    variant: 'success',
    'data-testid': 'success-badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId('success-badge');
    
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass('bg-green-100');
    await expect(badge).toHaveClass('text-green-800');
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning Badge',
    variant: 'warning',
    'data-testid': 'warning-badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId('warning-badge');
    
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass('bg-yellow-100');
    await expect(badge).toHaveClass('text-yellow-800');
  },
};

export const Error: Story = {
  args: {
    children: 'Error Badge',
    variant: 'error',
    'data-testid': 'error-badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId('error-badge');
    
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass('bg-red-100');
    await expect(badge).toHaveClass('text-red-800');
  },
};

export const Info: Story = {
  args: {
    children: 'Info Badge',
    variant: 'info',
    'data-testid': 'info-badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId('info-badge');
    
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass('bg-indigo-100');
    await expect(badge).toHaveClass('text-indigo-800');
  },
};

export const Small: Story = {
  args: {
    children: 'Small Badge',
    size: 'sm',
    'data-testid': 'small-badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId('small-badge');
    
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass('px-2');
    await expect(badge).toHaveClass('py-0.5');
    await expect(badge).toHaveClass('text-xs');
  },
};

export const Large: Story = {
  args: {
    children: 'Large Badge',
    size: 'lg',
    'data-testid': 'large-badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId('large-badge');
    
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass('px-3');
    await expect(badge).toHaveClass('py-1');
    await expect(badge).toHaveClass('text-base');
  },
};

export const Rounded: Story = {
  args: {
    children: 'Rounded Badge',
    rounded: true,
    'data-testid': 'rounded-badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId('rounded-badge');
    
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass('rounded-full');
  },
};

export const WithDot: Story = {
  args: {
    children: 'Badge with Dot',
    dot: true,
    'data-testid': 'dot-badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId('dot-badge');
    const dot = badge.querySelector('span:first-child');
    
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass('pl-1.5');
    await expect(dot).toBeVisible();
    await expect(dot).toHaveClass('rounded-full');
    await expect(dot).toHaveClass('h-2');
    await expect(dot).toHaveClass('w-2');
  },
};

export const WithCustomClass: Story = {
  args: {
    children: 'Custom Badge',
    className: 'shadow-md',
    'data-testid': 'custom-badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId('custom-badge');
    
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass('shadow-md');
  },
};
