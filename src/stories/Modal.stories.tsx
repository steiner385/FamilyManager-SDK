import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '../components/common/Modal';
import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is visible',
    },
    onClose: {
      description: 'Function called when the modal is closed',
    },
    title: {
      control: 'text',
      description: 'Optional title text for the modal',
    },
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Maximum width of the modal',
    },
    children: {
      control: 'text',
      description: 'Content to display inside the modal',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: 'Modal content goes here',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');
    
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveClass('relative');
    await expect(dialog).toHaveClass('z-50');
  },
};

export const WithTitle: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Modal Title',
    children: 'Modal content with a title',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole('heading', { level: 3 });
    
    await expect(title).toBeVisible();
    await expect(title).toHaveTextContent('Modal Title');
    await expect(title).toHaveClass('text-lg');
    await expect(title).toHaveClass('font-medium');
  },
};

export const SmallSize: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    maxWidth: 'sm',
    children: 'Small modal content',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByRole('dialog').querySelector('[role="dialog"] > div');
    
    await expect(panel).toHaveClass('sm:max-w-sm');
  },
};

export const LargeSize: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    maxWidth: 'lg',
    children: 'Large modal content',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByRole('dialog').querySelector('[role="dialog"] > div');
    
    await expect(panel).toHaveClass('sm:max-w-lg');
  },
};

export const WithCloseButton: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: 'Modal with close button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const closeButton = canvas.getByRole('button');
    
    await expect(closeButton).toBeVisible();
    await expect(closeButton).toHaveAttribute('type', 'button');
    const srOnly = closeButton.querySelector('.sr-only');
    await expect(srOnly).toHaveTextContent('Close');
  },
};

export const WithLongContent: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: (
      <div>
        <p>This is a long content paragraph.</p>
        <p>It demonstrates the modal's scrolling behavior.</p>
        <p>The modal should handle long content gracefully.</p>
        <p>You can add as much content as needed.</p>
        <p>The modal will scroll if the content exceeds the viewport.</p>
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i}>Additional paragraph {i + 1}</p>
        ))}
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');
    const content = dialog.querySelector('[role="dialog"] > div');
    
    await expect(content).toHaveClass('overflow-y-auto');
  },
};
