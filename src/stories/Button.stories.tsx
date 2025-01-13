import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/common/Button';
import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    isFullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
    'data-testid': 'primary-button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('primary-button');
    
    // Test initial state
    await expect(button).toBeVisible();
    await expect(button).toHaveTextContent('Primary Button');
    await expect(button).toHaveClass('bg-blue-600');
    
    // Test interaction
    await userEvent.click(button);
    await expect(button).toHaveFocus();
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
    'data-testid': 'secondary-button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('secondary-button');
    
    await expect(button).toBeVisible();
    await expect(button).toHaveTextContent('Secondary Button');
    await expect(button).toHaveClass('bg-gray-600');
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Loading Button',
    'data-testid': 'loading-button',
    isLoading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('loading-button');
    
    await expect(button).toBeVisible();
    await expect(button).toHaveTextContent('Loading Button');
    await expect(button).toHaveClass('opacity-50');
    await expect(button).toHaveClass('cursor-wait');
    await expect(button).toBeDisabled();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
    'data-testid': 'disabled-button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('disabled-button');
    
    await expect(button).toBeVisible();
    await expect(button).toHaveTextContent('Disabled Button');
    await expect(button).toHaveClass('opacity-50');
    await expect(button).toHaveClass('cursor-not-allowed');
    await expect(button).toBeDisabled();
  },
};

export const FullWidth: Story = {
  args: {
    isFullWidth: true,
    children: 'Full Width Button',
    'data-testid': 'full-width-button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('full-width-button');
    
    await expect(button).toBeVisible();
    await expect(button).toHaveTextContent('Full Width Button');
    await expect(button).toHaveClass('w-full');
  },
};
