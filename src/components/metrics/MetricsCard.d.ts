import React from 'react';
export interface MetricsCardProps {
    title: string;
    value: number;
    trend: 'up' | 'down' | 'neutral';
    change: number;
    timeframe: string;
    formatters?: {
        value?: (val: number) => string;
        change?: (val: number) => string;
    };
    styles?: {
        card?: string;
        title?: string;
        value?: string;
        change?: string;
        timeframe?: string;
    };
    loading?: boolean;
    error?: string;
    tooltip?: string;
    ariaLabel?: string;
    onClick?: (data: Omit<MetricsCardProps, 'onClick'>) => void;
    'data-testid'?: string;
}
export declare const MetricsCard: React.FC<MetricsCardProps>;
//# sourceMappingURL=MetricsCard.d.ts.map