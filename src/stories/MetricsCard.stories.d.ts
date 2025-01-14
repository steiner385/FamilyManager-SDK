import React from 'react';
import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: React.FC<import("../components/metrics/MetricsCard").MetricsCardProps>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        title: {
            control: string;
            description: string;
        };
        value: {
            control: string;
            description: string;
        };
        trend: {
            control: string;
            options: string[];
            description: string;
        };
        change: {
            control: string;
            description: string;
        };
        timeframe: {
            control: string;
            description: string;
        };
        loading: {
            control: string;
            description: string;
        };
        error: {
            control: string;
            description: string;
        };
        tooltip: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Loading: Story;
export declare const Error: Story;
export declare const WithTooltip: Story;
export declare const NegativeTrend: Story;
export declare const CustomFormatters: Story;
export declare const Clickable: Story;
export declare const CustomStyles: Story;
//# sourceMappingURL=MetricsCard.stories.d.ts.map