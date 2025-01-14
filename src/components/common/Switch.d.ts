import React from 'react';
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'role' | 'size'> {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    description?: string;
    variant?: 'primary' | 'success' | 'danger';
    'data-testid'?: string;
}
export declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Switch.d.ts.map