import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export function LoadingSpinner({ size = 'medium' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`animate-spin rounded-full border-b-2 border-gray-900 ${sizeClasses[size]}`}></div>
    </div>
  );
}
