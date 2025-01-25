import React from 'react';

export interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: 'text' | 'circle' | 'rectangle';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  variant = 'rectangle',
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  const variantClasses = {
    text: '',
    circle: 'rounded-full',
    rectangle: 'rounded',
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`${baseClasses} ${variantClasses[variant]} ${width} ${height} ${className} ${index < count - 1 ? 'mb-4' : ''}`}
      role="status"
      aria-label="Loading..."
    >
      <span className="sr-only">Loading...</span>
    </div>
  ));

  return <>{skeletons}</>;
};
