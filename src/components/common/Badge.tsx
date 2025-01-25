import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
  'data-testid'?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      rounded = false,
      dot = false,
      className = '',
      'data-testid': dataTestId,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center font-medium';
    
    const variants = {
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-indigo-100 text-indigo-800',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    };

    const roundedStyles = rounded ? 'rounded-full' : 'rounded';

    const dotStyles = dot
      ? 'inline-flex items-center gap-1.5 pl-1.5'
      : sizes[size];

    const combinedClassName = `
      ${baseStyles}
      ${variants[variant]}
      ${dotStyles}
      ${roundedStyles}
      ${className}
    `.trim();

    return (
      <span 
        ref={ref} 
        className={combinedClassName} 
        data-testid={dataTestId}
        role="status"
        aria-label={typeof children === 'string' ? children : undefined}
        {...props}
      >
        {dot && (
          <span
            className={`h-2 w-2 rounded-full ${
              variant === 'primary'
                ? 'bg-blue-500'
                : variant === 'secondary'
                ? 'bg-gray-500'
                : variant === 'success'
                ? 'bg-green-500'
                : variant === 'warning'
                ? 'bg-yellow-500'
                : variant === 'error'
                ? 'bg-red-500'
                : 'bg-indigo-500'
            }`}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
