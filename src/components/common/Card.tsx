import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  'data-testid'?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      header,
      footer,
      hoverable = false,
      className = '',
      'data-testid': dataTestId,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-lg overflow-hidden';
    
    const variants = {
      default: 'bg-white',
      outlined: 'bg-white border border-gray-200',
      elevated: 'bg-white shadow-md',
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    const hoverStyles = hoverable
      ? 'transition-shadow duration-200 hover:shadow-lg'
      : '';

    const combinedClassName = `
      ${baseStyles}
      ${variants[variant]}
      ${hoverStyles}
      ${className}
    `.trim();

    return (
      <div ref={ref} className={combinedClassName} data-testid={dataTestId} {...props}>
        {header && (
          <div 
            className={`border-b border-gray-200 ${paddings[padding]}`}
            data-testid={dataTestId ? `${dataTestId}-header` : undefined}
          >
            {header}
          </div>
        )}
        <div 
          className={paddings[padding]}
          data-testid={dataTestId ? `${dataTestId}-content` : undefined}
        >
          {children}
        </div>
        {footer && (
          <div
            className={`border-t border-gray-200 bg-gray-50 ${paddings[padding]}`}
            data-testid={dataTestId ? `${dataTestId}-footer` : undefined}
          >
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
