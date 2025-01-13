import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../components/common/Switch';
import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'danger'],
      description: 'Visual style variant of the switch',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the switch',
    },
    label: {
      control: 'text',
      description: 'Label text for the switch',
    },
    description: {
      control: 'text',
      description: 'Description text below the label',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default switch',
    'data-testid': 'default-switch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchInput = canvas.getByTestId('default-switch');
    const track = canvas.getByTestId('default-switch-track');
    const thumb = canvas.getByTestId('default-switch-thumb');
    
    await expect(switchInput).toBeVisible();
    await expect(track).toHaveClass('bg-gray-200');
    await expect(thumb).toHaveClass('bg-white');
    
    await userEvent.click(switchInput);
    await expect(track).toHaveClass('peer-checked:bg-blue-600');
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    label: 'Success switch',
    'data-testid': 'success-switch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchInput = canvas.getByTestId('success-switch');
    const track = canvas.getByTestId('success-switch-track');
    
    await expect(track).toHaveClass('bg-gray-200');
    
    await userEvent.click(switchInput);
    await expect(track).toHaveClass('peer-checked:bg-green-600');
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    label: 'Danger switch',
    'data-testid': 'danger-switch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchInput = canvas.getByTestId('danger-switch');
    const track = canvas.getByTestId('danger-switch-track');
    
    await expect(track).toHaveClass('bg-gray-200');
    
    await userEvent.click(switchInput);
    await expect(track).toHaveClass('peer-checked:bg-red-600');
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small switch',
    'data-testid': 'small-switch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const track = canvas.getByTestId('small-switch-track');
    const thumb = canvas.getByTestId('small-switch-thumb');
    
    await expect(track).toHaveClass('w-8');
    await expect(track).toHaveClass('h-4');
    await expect(thumb).toHaveClass('w-3');
    await expect(thumb).toHaveClass('h-3');
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large switch',
    'data-testid': 'large-switch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const track = canvas.getByTestId('large-switch-track');
    const thumb = canvas.getByTestId('large-switch-thumb');
    
    await expect(track).toHaveClass('w-14');
    await expect(track).toHaveClass('h-7');
    await expect(thumb).toHaveClass('w-6');
    await expect(thumb).toHaveClass('h-6');
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Enable notifications',
    'data-testid': 'label-switch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByTestId('label-switch-label');
    
    await expect(label).toBeVisible();
    await expect(label).toHaveTextContent('Enable notifications');
    await expect(label).toHaveClass('font-medium');
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Dark mode',
    description: 'Enable dark theme for better viewing at night',
    'data-testid': 'description-switch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByTestId('description-switch-label');
    const description = canvas.getByTestId('description-switch-description');
    
    await expect(label).toBeVisible();
    await expect(description).toBeVisible();
    await expect(description).toHaveTextContent('Enable dark theme for better viewing at night');
    await expect(description).toHaveClass('text-gray-500');
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled switch',
    'data-testid': 'disabled-switch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchInput = canvas.getByTestId('disabled-switch');
    const track = canvas.getByTestId('disabled-switch-track');
    const thumb = canvas.getByTestId('disabled-switch-thumb');
    const label = canvas.getByTestId('disabled-switch-label');
    
    await expect(switchInput).toBeDisabled();
    await expect(track).toHaveClass('opacity-50');
    await expect(track).toHaveClass('cursor-not-allowed');
    await expect(thumb).toHaveClass('cursor-not-allowed');
    await expect(label).toHaveClass('opacity-50');
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
    label: 'Checked switch',
    'data-testid': 'checked-switch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchInput = canvas.getByTestId('checked-switch');
    const track = canvas.getByTestId('checked-switch-track');
    
    await expect(switchInput).toBeChecked();
    await expect(track).toHaveClass('peer-checked:bg-blue-600');
  },
};

export const Interactive: Story = {
  args: {
    label: 'Interactive switch',
    description: 'Click to toggle the switch state',
    'data-testid': 'interactive-switch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchInput = canvas.getByTestId('interactive-switch');
    const track = canvas.getByTestId('interactive-switch-track');
    
    await expect(switchInput).not.toBeChecked();
    await expect(track).toHaveClass('bg-gray-200');
    
    await userEvent.click(switchInput);
    await expect(switchInput).toBeChecked();
    await expect(track).toHaveClass('peer-checked:bg-blue-600');
    
    await userEvent.click(switchInput);
    await expect(switchInput).not.toBeChecked();
    await expect(track).toHaveClass('bg-gray-200');
  },
};
