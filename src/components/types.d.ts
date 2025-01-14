import type { BaseProps } from '../types/base';
export interface ButtonProps extends BaseProps {
    /** Button variant style */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Loading state */
    isLoading?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Click handler */
    onClick?: () => void;
    /** Button type */
    type?: 'button' | 'submit' | 'reset';
}
export interface CardProps extends BaseProps {
    /** Card title */
    title?: string;
    /** Optional footer content */
    footer?: React.ReactNode;
}
export interface InputProps extends BaseProps {
    /** Input type */
    type?: 'text' | 'email' | 'password' | 'number';
    /** Input label */
    label?: string;
    /** Error message */
    error?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Input value */
    value?: string | number;
    /** Change handler */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Required field */
    required?: boolean;
    /** Disabled state */
    disabled?: boolean;
}
//# sourceMappingURL=types.d.ts.map