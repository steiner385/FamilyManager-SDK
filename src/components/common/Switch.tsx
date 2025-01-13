import React from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'role' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  variant?: 'primary' | 'success' | 'danger';
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      size = 'md',
      label,
      description,
      variant = 'primary',
      disabled = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const uniqueId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    const sizes = {
      sm: {
        switch: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: 'translate-x-4',
        text: 'text-sm',
      },
      md: {
        switch: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
        text: 'text-base',
      },
      lg: {
        switch: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
        text: 'text-lg',
      },
    };

    const variants = {
      primary: {
        active: 'bg-blue-600',
        inactive: 'bg-gray-200',
      },
      success: {
        active: 'bg-green-600',
        inactive: 'bg-gray-200',
      },
      danger: {
        active: 'bg-red-600',
        inactive: 'bg-gray-200',
      },
    };

    return (
      <div className={`flex items-start ${className}`}>
        <div className="flex items-center h-full">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id={uniqueId}
              className="sr-only peer"
              disabled={disabled}
              ref={ref}
              {...props}
            />
            <div
              className={`
                ${sizes[size].switch}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${variants[variant].inactive}
                peer-checked:${variants[variant].active}
                rounded-full
                peer-focus:outline-none
                peer-focus:ring-4
                peer-focus:ring-blue-300
                dark:peer-focus:ring-blue-800
                transition-colors
              `}
            >
              <div
                className={`
                  ${sizes[size].thumb}
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  bg-white
                  rounded-full
                  transition-transform
                  peer-checked:${sizes[size].translate}
                  absolute
                  left-0.5
                  top-1/2
                  -translate-y-1/2
                `}
              />
            </div>
          </label>
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={uniqueId}
                className={`
                  font-medium
                  ${sizes[size].text}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                className={`
                  text-gray-500
                  ${size === 'sm' ? 'text-xs' : 'text-sm'}
                  ${disabled ? 'opacity-50' : ''}
                `}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
