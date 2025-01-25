import React from 'react';
import { render, screen } from '../../../testing/simple-test-utils';
import { LoadingSkeleton } from '../LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders with default props', () => {
    render(<LoadingSkeleton />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('w-full', 'h-4', 'rounded');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(<LoadingSkeleton variant="text" />);
    expect(screen.getByRole('status')).not.toHaveClass('rounded-full');

    rerender(<LoadingSkeleton variant="circle" />);
    expect(screen.getByRole('status')).toHaveClass('rounded-full');

    rerender(<LoadingSkeleton variant="rectangle" />);
    expect(screen.getByRole('status')).toHaveClass('rounded');
  });

  it('applies custom width and height', () => {
    render(<LoadingSkeleton width="w-32" height="h-8" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('w-32', 'h-8');
  });

  it('renders multiple skeletons with correct spacing', () => {
    render(<LoadingSkeleton count={3} />);
    const skeletons = screen.getAllByRole('status');
    
    expect(skeletons).toHaveLength(3);
    expect(skeletons[0]).toHaveClass('mb-4');
    expect(skeletons[1]).toHaveClass('mb-4');
    expect(skeletons[2]).not.toHaveClass('mb-4');
  });

  it('applies custom className', () => {
    render(<LoadingSkeleton className="bg-blue-200" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('bg-blue-200');
  });

  it('maintains base classes with custom className', () => {
    render(<LoadingSkeleton className="bg-blue-200" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('animate-pulse', 'bg-gray-200', 'bg-blue-200');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSkeleton />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveAttribute('role', 'status');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
    
    const screenReaderText = screen.getByText('Loading...');
    expect(screenReaderText).toHaveClass('sr-only');
  });
});
