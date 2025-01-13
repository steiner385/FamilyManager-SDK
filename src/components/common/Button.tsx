import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isFullWidth?: boolean;
  'data-testid'?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      className,
      disabled,
      children,
      'data-testid': dataTestId,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-100 focus:ring-gray-500',
      ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const classes = twMerge(
      baseStyles,
      variants[variant],
      sizes[size],
      isFullWidth && 'w-full',
      disabled && 'opacity-50 cursor-not-allowed',
      isLoading && 'opacity-50 cursor-wait',
      className
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        data-testid={dataTestId}
        {...props}
      >
        <span className="inline-flex items-center">
          {isLoading && (
            <span
              role="status"
              aria-label="Loading"
              className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
          )}
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
