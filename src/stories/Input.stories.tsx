import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/common/Input';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';
import { MagnifyingGlassIcon, LockClosedIcon } from '@heroicons/react/24/solid';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      description: 'Visual style variant of the input',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input',
    },
    error: {
      control: 'boolean',
      description: 'Whether to show error state',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the input should take full width',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text',
    'data-testid': 'default-input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('default-input');
    
    await expect(input).toBeVisible();
    await expect(input).toHaveClass('border');
    await expect(input).toHaveClass('border-gray-300');
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled input',
    'data-testid': 'filled-input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('filled-input');
    
    await expect(input).toBeVisible();
    await expect(input).toHaveClass('bg-gray-100');
    await expect(input).not.toHaveClass('border');
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    placeholder: 'Outlined input',
    'data-testid': 'outlined-input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('outlined-input');
    
    await expect(input).toBeVisible();
    await expect(input).toHaveClass('border-2');
    await expect(input).toHaveClass('bg-transparent');
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
    'data-testid': 'small-input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('small-input');
    
    await expect(input).toBeVisible();
    await expect(input).toHaveClass('px-2');
    await expect(input).toHaveClass('py-1');
    await expect(input).toHaveClass('text-sm');
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
    'data-testid': 'large-input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('large-input');
    
    await expect(input).toBeVisible();
    await expect(input).toHaveClass('px-4');
    await expect(input).toHaveClass('py-3');
    await expect(input).toHaveClass('text-lg');
  },
};

export const WithError: Story = {
  args: {
    error: true,
    helperText: 'This field is required',
    placeholder: 'Error input',
    'data-testid': 'error-input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('error-input');
    const helperText = canvas.getByTestId('error-input-helper-text');
    
    await expect(input).toBeVisible();
    await expect(input).toHaveClass('border-red-600');
    await expect(helperText).toBeVisible();
    await expect(helperText).toHaveClass('text-red-600');
    await expect(helperText).toHaveTextContent('This field is required');
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: 'Enter your username',
    placeholder: 'Username',
    'data-testid': 'helper-input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const helperText = canvas.getByTestId('helper-input-helper-text');
    
    await expect(helperText).toBeVisible();
    await expect(helperText).toHaveClass('text-gray-500');
    await expect(helperText).toHaveTextContent('Enter your username');
  },
};

export const WithStartIcon: Story = {
  args: {
    startIcon: <MagnifyingGlassIcon />,
    placeholder: 'Search...',
    'data-testid': 'start-icon-input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const wrapper = canvas.getByTestId('start-icon-input-wrapper');
    const icon = canvas.getByTestId('start-icon-input-start-icon');
    const input = canvas.getByTestId('start-icon-input');
    
    await expect(wrapper).toBeVisible();
    await expect(icon).toBeVisible();
    await expect(input).toHaveClass('pl-8');
  },
};

export const WithEndIcon: Story = {
  args: {
    endIcon: <LockClosedIcon />,
    placeholder: 'Password',
    type: 'password',
    'data-testid': 'end-icon-input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const wrapper = canvas.getByTestId('end-icon-input-wrapper');
    const icon = canvas.getByTestId('end-icon-input-end-icon');
    const input = canvas.getByTestId('end-icon-input');
    
    await expect(wrapper).toBeVisible();
    await expect(icon).toBeVisible();
    await expect(input).toHaveClass('pr-8');
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    'data-testid': 'disabled-input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('disabled-input');
    
    await expect(input).toBeVisible();
    await expect(input).toBeDisabled();
    await expect(input).toHaveClass('opacity-50');
    await expect(input).toHaveClass('cursor-not-allowed');
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    placeholder: 'Full width input',
    'data-testid': 'full-width-input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const wrapper = canvas.getByTestId('full-width-input-wrapper');
    const input = canvas.getByTestId('full-width-input');
    
    await expect(wrapper).toBeVisible();
    await expect(input).toHaveClass('w-full');
  },
};
