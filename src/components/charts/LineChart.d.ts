import React from 'react';
export interface DataPoint {
    timestamp: number;
    value: number;
}
export interface LineChartProps {
    data: DataPoint[];
    size?: {
        width: number;
        height: number;
    };
    styles?: {
        line?: {
            stroke?: string;
            strokeWidth?: number;
        };
        point?: {
            fill?: string;
            radius?: number;
        };
        axis?: {
            stroke?: string;
            strokeWidth?: number;
        };
    };
    formatters?: {
        timestamp?: (value: number) => string;
        value?: (value: number) => string;
    };
    ariaLabel?: string;
    'data-testid'?: string;
}
export declare const LineChart: React.FC<LineChartProps>;
//# sourceMappingURL=LineChart.d.ts.map