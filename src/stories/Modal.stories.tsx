import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '../components/common/Modal';

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
};

export const WithTitle: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Modal Title',
    children: 'Modal content with a title',
  },
};

export const SmallSize: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    maxWidth: 'sm',
    children: 'Small modal content',
  },
};

export const LargeSize: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    maxWidth: 'lg',
    children: 'Large modal content',
  },
};

export const WithCloseButton: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: 'Modal with close button',
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
};
