import React from 'react';
import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: React.FC<import("../components/charts/LineChart").LineChartProps>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        data: {
            control: string;
            description: string;
        };
        size: {
            control: string;
            description: string;
        };
        styles: {
            control: string;
            description: string;
        };
        formatters: {
            control: string;
            description: string;
        };
        ariaLabel: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const CustomSize: Story;
export declare const CustomStyles: Story;
export declare const CustomFormatters: Story;
export declare const WithTooltip: Story;
export declare const EmptyData: Story;
export declare const SingleDataPoint: Story;
export declare const LargeDataSet: Story;
export declare const AccessibleChart: Story;
//# sourceMappingURL=LineChart.stories.d.ts.map