import React from 'react';
import { render, screen, fireEvent } from '../../../testing/simple-test-utils';
import { Modal } from '../Modal';

// Mock Headless UI's Transition component
jest.mock('@headlessui/react', () => ({
  Transition: {
    Root: ({ show, children }: { show: boolean; children: React.ReactNode }) => show ? children : null,
    Child: ({ children }: { children: React.ReactNode }) => children,
  },
  Dialog: {
    Panel: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
    ),
    Title: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <h1 className={className}>{children}</h1>
    ),
  },
}));

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toHaveTextContent('Modal content');
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Modal {...defaultProps} title="Test Title" />);
    const title = screen.getByTestId('modal-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Test Title');
  });

  it('calls onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByTestId('modal-close-button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applies different max-width classes correctly', () => {
    const { rerender } = render(<Modal {...defaultProps} maxWidth="sm" />);
    expect(screen.getByTestId('modal-panel')).toHaveClass('sm:max-w-sm');

    rerender(<Modal {...defaultProps} maxWidth="md" />);
    expect(screen.getByTestId('modal-panel')).toHaveClass('sm:max-w-md');

    rerender(<Modal {...defaultProps} maxWidth="lg" />);
    expect(screen.getByTestId('modal-panel')).toHaveClass('sm:max-w-lg');

    rerender(<Modal {...defaultProps} maxWidth="xl" />);
    expect(screen.getByTestId('modal-panel')).toHaveClass('sm:max-w-xl');

    rerender(<Modal {...defaultProps} maxWidth="2xl" />);
    expect(screen.getByTestId('modal-panel')).toHaveClass('sm:max-w-2xl');
  });

  it('has proper accessibility attributes', () => {
    render(<Modal {...defaultProps} title="Test Title" />);
    const modal = screen.getByTestId('modal');
    
    expect(modal).toHaveAttribute('role', 'dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');

    const closeButton = screen.getByTestId('modal-close-button');
    expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    expect(closeButton.querySelector('.sr-only')).toHaveTextContent('Close modal');
  });

  it('uses correct aria attributes when no title is provided', () => {
    render(<Modal {...defaultProps} />);
    const modal = screen.getByTestId('modal');
    
    expect(modal).toHaveAttribute('aria-label', 'Modal dialog');
    expect(modal).not.toHaveAttribute('aria-labelledby');
  });

  it('renders close button with correct styling', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByTestId('modal-close-button');
    
    expect(closeButton).toHaveClass(
      'rounded-md',
      'bg-white',
      'text-gray-400',
      'hover:text-gray-500',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary-500',
      'focus:ring-offset-2'
    );
  });

  it('renders with correct panel styling', () => {
    render(<Modal {...defaultProps} />);
    const panel = screen.getByTestId('modal-panel');
    
    expect(panel).toHaveClass(
      'relative',
      'transform',
      'overflow-hidden',
      'rounded-lg',
      'bg-white',
      'shadow-xl',
      'transition-all'
    );
  });
});
