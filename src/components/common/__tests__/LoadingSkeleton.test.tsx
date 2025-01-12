import React from 'react';
import { render, screen } from '../../../testing/test-utils';
import { LoadingSkeleton } from '../LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders with default props', () => {
    render(<LoadingSkeleton />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('h-4', 'w-full');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
  });

  it('renders multiple skeleton items based on count prop', () => {
    render(<LoadingSkeleton count={3} />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(3);
    
    // Check spacing between items
    skeletons.forEach((skeleton, index) => {
      if (index < 2) { // All except last should have margin bottom
        expect(skeleton).toHaveClass('mb-4');
      } else {
        expect(skeleton).not.toHaveClass('mb-4');
      }
    });
  });

  it('applies custom dimensions', () => {
    render(<LoadingSkeleton height="h-8" width="w-1/2" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('h-8', 'w-1/2');
  });

  it('applies custom className', () => {
    render(<LoadingSkeleton className="bg-blue-200" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('bg-blue-200');
  });

  it('maintains animation and base classes with custom className', () => {
    render(<LoadingSkeleton className="custom-class" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('animate-pulse', 'bg-gray-200', 'rounded', 'custom-class');
  });

  it('includes screen reader text', () => {
    render(<LoadingSkeleton />);
    expect(screen.getByText('Loading...')).toHaveClass('sr-only');
  });
});
