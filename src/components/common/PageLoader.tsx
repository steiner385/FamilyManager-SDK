import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import type { BaseComponentProps } from './types';

export const PageLoader: React.FC<BaseComponentProps> = ({ className = '' }) => {
  return (
    <div className={`flex justify-center items-center min-h-screen ${className}`}>
      <LoadingSpinner size="large" />
    </div>
  );
};
