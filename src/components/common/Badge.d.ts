import React from 'react';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md' | 'lg';
    rounded?: boolean;
    dot?: boolean;
    'data-testid'?: string;
}
export declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=Badge.d.ts.map