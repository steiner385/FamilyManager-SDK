import React from 'react';
import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: React.FC<import("../components/common/LoadingSkeleton").LoadingSkeletonProps>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        width: {
            control: string;
            description: string;
        };
        height: {
            control: string;
            description: string;
        };
        variant: {
            control: string;
            options: string[];
            description: string;
        };
        count: {
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
export declare const Circle: Story;
export declare const Text: Story;
export declare const MultipleLines: Story;
export declare const WithCustomClass: Story;
//# sourceMappingURL=LoadingSkeleton.stories.d.ts.map