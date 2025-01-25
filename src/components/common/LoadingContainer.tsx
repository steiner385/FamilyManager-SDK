import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import type { BaseComponentProps } from './types';

export interface LoadingContainerProps extends BaseComponentProps {
  isLoading: boolean;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = ({ 
  children, 
  isLoading,
  className = '' 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
};
