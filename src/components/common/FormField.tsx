import React from 'react';
import type { BaseComponentProps } from './types';

export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  children, 
  className = '',
  label,
  error,
  required 
}) => {
  const id = label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-error-500 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
