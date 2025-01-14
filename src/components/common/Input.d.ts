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
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export {};
//# sourceMappingURL=Input.d.ts.map