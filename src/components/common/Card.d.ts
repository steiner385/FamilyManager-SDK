import React from 'react';
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outlined' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    header?: React.ReactNode;
    footer?: React.ReactNode;
    hoverable?: boolean;
    'data-testid'?: string;
}
export declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Card.d.ts.map