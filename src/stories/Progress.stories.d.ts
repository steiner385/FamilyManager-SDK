import React from 'react';
import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: React.ForwardRefExoticComponent<import("../components/common/Progress").ProgressProps & React.RefAttributes<HTMLDivElement>>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        value: {
            control: {
                type: string;
                min: number;
                max: number;
            };
            description: string;
        };
        max: {
            control: string;
            description: string;
        };
        variant: {
            control: string;
            options: string[];
            description: string;
        };
        size: {
            control: string;
            options: string[];
            description: string;
        };
        showValue: {
            control: string;
            description: string;
        };
        valuePosition: {
            control: string;
            options: string[];
            description: string;
        };
        label: {
            control: string;
            description: string;
        };
        animated: {
            control: string;
            description: string;
        };
        striped: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Success: Story;
export declare const Warning: Story;
export declare const Danger: Story;
export declare const Small: Story;
export declare const Large: Story;
export declare const WithLabel: Story;
export declare const WithValueOutside: Story;
export declare const WithValueInside: Story;
export declare const Striped: Story;
export declare const Animated: Story;
export declare const CompleteProgress: Story;
//# sourceMappingURL=Progress.stories.d.ts.map