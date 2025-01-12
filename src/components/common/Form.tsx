import React from 'react';
import type { BaseComponentProps } from './types';

export interface FormProps extends BaseComponentProps {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  method?: 'get' | 'post';
  action?: string;
  autoComplete?: 'on' | 'off';
  noValidate?: boolean;
}

export const Form: React.FC<FormProps> = ({
  children,
  className = '',
  onSubmit,
  method = 'post',
  action,
  autoComplete = 'off',
  noValidate = false,
  ...props
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <form
      className={`space-y-4 ${className}`}
      onSubmit={handleSubmit}
      method={method}
      action={action}
      autoComplete={autoComplete}
      noValidate={noValidate}
      {...props}
    >
      {children}
    </form>
  );
};
