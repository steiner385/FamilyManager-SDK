import React from 'react';
import { render, screen } from '../../../testing/test-utils';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8 w-8'); // medium size by default
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    expect(screen.getByRole('status')).toHaveClass('h-4 w-4');

    rerender(<LoadingSpinner size="medium" />);
    expect(screen.getByRole('status')).toHaveClass('h-8 w-8');

    rerender(<LoadingSpinner size="large" />);
    expect(screen.getByRole('status')).toHaveClass('h-12 w-12');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="text-blue-500" />);
    expect(screen.getByRole('status')).toHaveClass('text-blue-500');
  });

  it('maintains animation and base classes with custom className', () => {
    render(<LoadingSpinner className="text-blue-500" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('animate-spin', 'inline-block', 'text-blue-500');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });
});
