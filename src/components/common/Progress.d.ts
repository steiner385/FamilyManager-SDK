import React from 'react';
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
    valuePosition?: 'inside' | 'outside';
    label?: string;
    animated?: boolean;
    striped?: boolean;
    'data-testid'?: string;
}
export declare const Progress: React.ForwardRefExoticComponent<ProgressProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Progress.d.ts.map