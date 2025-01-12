import React from 'react';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent } from '../../../testing/test-utils';
import { Modal } from '../Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeDefined();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.queryByText('Modal content')).toBeNull();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText('Test Title')).toBeDefined();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applies different max-width classes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} maxWidth="sm">
        <div>Modal content</div>
      </Modal>
    );
    let panel = screen.getByRole('dialog').querySelector('div[class*="sm:max-w-"]');
    expect(panel?.className).toContain('sm:max-w-sm');

    rerender(
      <Modal isOpen={true} onClose={mockOnClose} maxWidth="lg">
        <div>Modal content</div>
      </Modal>
    );
    panel = screen.getByRole('dialog').querySelector('div[class*="sm:max-w-"]');
    expect(panel?.className).toContain('sm:max-w-lg');
  });

  it('uses default max-width when not specified', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    const panel = screen.getByRole('dialog').querySelector('div[class*="sm:max-w-"]');
    expect(panel?.className).toContain('sm:max-w-md');
  });

  it('has proper accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Modal content</div>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeDefined();
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton.getAttribute('type')).toBe('button');
    expect(closeButton.className).toContain('focus:ring-2');
    expect(closeButton.className).toContain('focus:ring-primary-500');
  });
});
