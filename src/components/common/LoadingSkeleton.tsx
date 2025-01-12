import React from 'react';
import type { BaseComponentProps } from './types';

export interface LoadingSkeletonProps extends BaseComponentProps {
  count?: number;
  height?: string;
  width?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  count = 1,
  height = '1rem',
  width = '100%'
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      data-testid="skeleton-loader"
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{
        height,
        width,
        marginBottom: index < count - 1 ? '0.5rem' : 0
      }}
      role="progressbar"
      aria-label="Loading content"
    />
  ));

  return <div className="space-y-2">{skeletons}</div>;
};

export interface LoadingSkeletonTextProps extends BaseComponentProps {
  lines?: number;
}

export const LoadingSkeletonText: React.FC<LoadingSkeletonTextProps> = ({
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <LoadingSkeleton
          key={index}
          height="1rem"
          width={index === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
};

export interface LoadingSkeletonCardProps extends BaseComponentProps {}

export const LoadingSkeletonCard: React.FC<LoadingSkeletonCardProps> = ({
  className = ''
}) => {
  return (
    <div className={`p-4 border rounded-lg shadow-sm ${className}`}>
      <LoadingSkeleton height="1.5rem" width="40%" className="mb-4" />
      <LoadingSkeletonText lines={2} />
      <div className="flex justify-between items-center mt-4">
        <LoadingSkeleton height="2rem" width="30%" />
        <LoadingSkeleton height="2rem" width="20%" />
      </div>
    </div>
  );
};

export interface LoadingSkeletonTableProps extends BaseComponentProps {
  rows?: number;
  columns?: number;
}

export const LoadingSkeletonTable: React.FC<LoadingSkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }, (_, index) => (
          <LoadingSkeleton
            key={`header-${index}`}
            height="2rem"
            width={`${100 / columns}%`}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <LoadingSkeleton
              key={`cell-${rowIndex}-${colIndex}`}
              height="1.5rem"
              width={`${100 / columns}%`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
