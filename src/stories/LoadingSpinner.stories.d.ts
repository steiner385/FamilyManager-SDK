import React from 'react';
import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: React.FC<import("../components/common/LoadingSpinner").LoadingSpinnerProps>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        size: {
            control: string;
            options: string[];
            description: string;
        };
        label: {
            control: string;
            description: string;
        };
        className: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Small: Story;
export declare const Large: Story;
export declare const CustomLabel: Story;
export declare const WithCustomClass: Story;
//# sourceMappingURL=LoadingSpinner.stories.d.ts.map