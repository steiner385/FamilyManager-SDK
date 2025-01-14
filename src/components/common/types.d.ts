import type { ReactNode } from 'react';
export interface BaseComponentProps {
    className?: string;
    children?: ReactNode;
    id?: string;
    'data-testid'?: string;
}
export type { BadgeProps } from './Badge';
export type { ButtonProps } from './Button';
export type { CardProps } from './Card';
export type { ErrorBoundaryProps } from './ErrorBoundary';
export type { FormProps } from './Form';
export type { InputProps } from './Input';
export type { LoadingSpinnerProps } from './LoadingSpinner';
export type { SelectProps } from './Select';
export type { SwitchProps } from './Switch';
export type { ToastProps, ToastType } from './Toast';
export interface IconProps extends BaseComponentProps {
    size?: number | string;
    color?: string;
}
export interface FormFieldProps extends BaseComponentProps {
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
}
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export type ChangeHandler<T = string> = (value: T) => void;
export type ClickHandler = (event: React.MouseEvent) => void;
export type FocusHandler = (event: React.FocusEvent) => void;
export type BlurHandler = (event: React.FocusEvent) => void;
//# sourceMappingURL=types.d.ts.map