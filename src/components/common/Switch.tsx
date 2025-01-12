import React from 'react';
import type { BaseComponentProps } from './types';

export interface SwitchProps extends BaseComponentProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  name?: string;
  'aria-label'?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  disabled = false,
  onChange,
  size = 'medium',
  className = '',
  label,
  name,
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = 'relative inline-flex flex-shrink-0 cursor-pointer rounded-full transition-colors ease-in-out duration-200';
  const sizeClasses = {
    small: 'h-4 w-7',
    medium: 'h-6 w-11',
    large: 'h-8 w-14'
  };

  const handleClasses = {
    small: 'h-3 w-3',
    medium: 'h-5 w-5',
    large: 'h-7 w-7'
  };

  const translateClasses = {
    small: 'translate-x-3',
    medium: 'translate-x-5',
    large: 'translate-x-6'
  };

  const classes = [
    baseClasses,
    sizeClasses[size],
    checked ? 'bg-primary-600' : 'bg-gray-200',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClass = [
    'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
    handleClasses[size],
    checked ? translateClasses[size] : 'translate-x-0'
  ].join(' ');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        name={name}
        aria-label={ariaLabel || label}
        {...props}
      />
      <div className={classes}>
        <span
          className={handleClass}
          aria-hidden="true"
        />
      </div>
      {label && (
        <span className="ml-2 text-sm text-gray-900">
          {label}
        </span>
      )}
    </label>
  );
};
