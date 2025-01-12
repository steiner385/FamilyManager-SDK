import React from 'react';
import type { BaseComponentProps } from './types';

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  rounded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  footer,
  padding = 'medium',
  shadow = 'medium',
  border = true,
  rounded = true,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6'
  };

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow',
    large: 'shadow-lg'
  };

  const classes = [
    'bg-white',
    rounded ? 'rounded-lg' : '',
    border ? 'border border-gray-200' : '',
    shadowClasses[shadow],
    className
  ].filter(Boolean).join(' ');

  const bodyClasses = paddingClasses[padding];

  return (
    <div className={classes} {...props}>
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 ${paddingClasses[padding]}`}>
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={bodyClasses}>
        {children}
      </div>
      {footer && (
        <div className={`border-t border-gray-200 ${paddingClasses[padding]}`}>
          {footer}
        </div>
      )}
    </div>
  );
};
