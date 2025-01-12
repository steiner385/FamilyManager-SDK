import React from 'react';
import type { BaseComponentProps } from './types';

export interface BadgeProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  rounded?: boolean;
  outlined?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  rounded = true,
  outlined = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium';
  
  const variantClasses = {
    primary: outlined 
      ? 'text-primary-700 bg-primary-50 border border-primary-200'
      : 'text-white bg-primary-600',
    secondary: outlined
      ? 'text-gray-700 bg-gray-50 border border-gray-200'
      : 'text-white bg-gray-600',
    success: outlined
      ? 'text-green-700 bg-green-50 border border-green-200'
      : 'text-white bg-green-600',
    warning: outlined
      ? 'text-yellow-700 bg-yellow-50 border border-yellow-200'
      : 'text-white bg-yellow-600',
    error: outlined
      ? 'text-red-700 bg-red-50 border border-red-200'
      : 'text-white bg-red-600',
    info: outlined
      ? 'text-blue-700 bg-blue-50 border border-blue-200'
      : 'text-white bg-blue-600'
  };

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    rounded ? 'rounded-full' : 'rounded',
    className
  ].join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
