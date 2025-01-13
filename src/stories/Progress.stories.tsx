import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../components/common/Progress';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Current value of the progress bar',
    },
    max: {
      control: 'number',
      description: 'Maximum value (default: 100)',
    },
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'info'],
      description: 'Visual style variant of the progress bar',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the progress bar',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the percentage value',
    },
    valuePosition: {
      control: 'radio',
      options: ['inside', 'outside'],
      description: 'Position of the percentage value',
    },
    label: {
      control: 'text',
      description: 'Label text above the progress bar',
    },
    animated: {
      control: 'boolean',
      description: 'Whether to show animation effect',
    },
    striped: {
      control: 'boolean',
      description: 'Whether to show striped pattern',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
    'data-testid': 'default-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const track = canvas.getByTestId('default-progress-track');
    const bar = canvas.getByTestId('default-progress-bar');
    
    await expect(track).toBeVisible();
    await expect(bar).toBeVisible();
    await expect(bar).toHaveClass('bg-blue-600');
    await expect(bar).toHaveStyle({ width: '60%' });
  },
};

export const Success: Story = {
  args: {
    value: 80,
    variant: 'success',
    'data-testid': 'success-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByTestId('success-progress-bar');
    
    await expect(bar).toBeVisible();
    await expect(bar).toHaveClass('bg-green-600');
    await expect(bar).toHaveStyle({ width: '80%' });
  },
};

export const Warning: Story = {
  args: {
    value: 70,
    variant: 'warning',
    'data-testid': 'warning-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByTestId('warning-progress-bar');
    
    await expect(bar).toBeVisible();
    await expect(bar).toHaveClass('bg-yellow-500');
    await expect(bar).toHaveStyle({ width: '70%' });
  },
};

export const Danger: Story = {
  args: {
    value: 30,
    variant: 'danger',
    'data-testid': 'danger-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByTestId('danger-progress-bar');
    
    await expect(bar).toBeVisible();
    await expect(bar).toHaveClass('bg-red-600');
    await expect(bar).toHaveStyle({ width: '30%' });
  },
};

export const Small: Story = {
  args: {
    value: 50,
    size: 'sm',
    'data-testid': 'small-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const track = canvas.getByTestId('small-progress-track');
    
    await expect(track).toBeVisible();
    await expect(track).toHaveClass('h-1');
  },
};

export const Large: Story = {
  args: {
    value: 50,
    size: 'lg',
    'data-testid': 'large-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const track = canvas.getByTestId('large-progress-track');
    
    await expect(track).toBeVisible();
    await expect(track).toHaveClass('h-3');
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    label: 'Upload Progress',
    'data-testid': 'label-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByTestId('label-progress-label');
    
    await expect(label).toBeVisible();
    await expect(label).toHaveTextContent('Upload Progress');
    await expect(label).toHaveClass('font-medium');
  },
};

export const WithValueOutside: Story = {
  args: {
    value: 65,
    showValue: true,
    valuePosition: 'outside',
    'data-testid': 'value-outside-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const value = canvas.getByTestId('value-outside-progress-value-outside');
    
    await expect(value).toBeVisible();
    await expect(value).toHaveTextContent('65%');
  },
};

export const WithValueInside: Story = {
  args: {
    value: 65,
    showValue: true,
    valuePosition: 'inside',
    size: 'lg',
    'data-testid': 'value-inside-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const value = canvas.getByTestId('value-inside-progress-value-inside');
    
    await expect(value).toBeVisible();
    await expect(value).toHaveTextContent('65%');
    await expect(value).toHaveClass('text-white');
  },
};

export const Striped: Story = {
  args: {
    value: 70,
    striped: true,
    'data-testid': 'striped-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByTestId('striped-progress-bar');
    
    await expect(bar).toBeVisible();
    await expect(bar).toHaveClass('bg-gradient-to-r');
    await expect(bar).toHaveClass('bg-[length:30px_30px]');
  },
};

export const Animated: Story = {
  args: {
    value: 70,
    animated: true,
    'data-testid': 'animated-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByTestId('animated-progress-bar');
    
    await expect(bar).toBeVisible();
    await expect(bar).toHaveClass('after:animate-progress-shine');
  },
};

export const CompleteProgress: Story = {
  args: {
    value: 100,
    variant: 'success',
    label: 'Download Complete',
    showValue: true,
    valuePosition: 'outside',
    'data-testid': 'complete-progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByTestId('complete-progress-bar');
    const label = canvas.getByTestId('complete-progress-label');
    const value = canvas.getByTestId('complete-progress-value-outside');
    
    await expect(bar).toBeVisible();
    await expect(bar).toHaveClass('bg-green-600');
    await expect(bar).toHaveStyle({ width: '100%' });
    await expect(label).toHaveTextContent('Download Complete');
    await expect(value).toHaveTextContent('100%');
  },
};
