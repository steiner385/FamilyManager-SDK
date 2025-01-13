import React from 'react';

type InputHTMLProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export interface InputProps extends InputHTMLProps {
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  'data-testid'?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      error = false,
      helperText,
      startIcon,
      endIcon,
      fullWidth = false,
      disabled = false,
      className = '',
      'data-testid': dataTestId,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'transition-colors focus:outline-none';
    
    const variants = {
      default: `
        border border-gray-300 bg-white
        focus:border-blue-500 focus:ring-1 focus:ring-blue-500
      `,
      filled: `
        border-0 bg-gray-100
        focus:bg-gray-50 focus:ring-2 focus:ring-blue-500
      `,
      outlined: `
        border-2 border-gray-300 bg-transparent
        focus:border-blue-500
      `,
    };

    const sizes = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    const states = {
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
      disabled: 'opacity-50 cursor-not-allowed bg-gray-50',
    };

    const widthClass = fullWidth ? 'w-full' : 'w-auto';

    const combinedClassName = `
      ${baseStyles}
      ${variants[variant]}
      ${sizes[size]}
      ${error ? states.error : ''}
      ${disabled ? states.disabled : ''}
      ${widthClass}
      rounded-md
      ${className}
    `.trim();

    const wrapperClass = `
      relative inline-flex items-center
      ${fullWidth ? 'w-full' : 'w-auto'}
    `.trim();

    const iconClass = `
      absolute flex items-center justify-center
      text-gray-400 pointer-events-none
      ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}
    `.trim();

    const startIconClass = `${iconClass} left-2`;
    const endIconClass = `${iconClass} right-2`;

    const inputElement = (
      <input
        ref={ref}
        disabled={disabled}
        className={`
          ${combinedClassName}
          ${startIcon ? 'pl-8' : ''}
          ${endIcon ? 'pr-8' : ''}
        `.trim()}
        data-testid={dataTestId}
        {...props}
      />
    );

    return (
      <div className="flex flex-col" data-testid={dataTestId ? `${dataTestId}-wrapper` : undefined}>
        <div className={wrapperClass}>
          {startIcon && (
            <span 
              className={startIconClass}
              data-testid={dataTestId ? `${dataTestId}-start-icon` : undefined}
            >
              {startIcon}
            </span>
          )}
          {inputElement}
          {endIcon && (
            <span 
              className={endIconClass}
              data-testid={dataTestId ? `${dataTestId}-end-icon` : undefined}
            >
              {endIcon}
            </span>
          )}
        </div>
        {helperText && (
          <span
            className={`mt-1 text-sm ${
              error ? 'text-red-500' : 'text-gray-500'
            }`}
            data-testid={dataTestId ? `${dataTestId}-helper-text` : undefined}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
