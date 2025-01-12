import React from 'react';

export interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  count = 1,
  height = 'h-4',
  width = 'w-full'
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200 rounded ${height} ${width} ${className} ${
            index !== count - 1 ? 'mb-4' : ''
          }`}
          role="status"
          aria-label="Loading..."
        >
          <span className="sr-only">Loading...</span>
        </div>
      ))}
    </>
  );
};
