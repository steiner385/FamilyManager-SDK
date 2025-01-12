import React from 'react';
import type { BaseComponentProps, SelectOption } from './types';

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
  name?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder,
  error,
  label,
  required = false,
  className = '',
  name,
  ...props
}) => {
  const selectClasses = [
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
    disabled ? 'bg-gray-100 cursor-not-allowed' : '',
    error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="mt-1">
        <select
          id={name}
          name={name}
          className={selectClasses}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
