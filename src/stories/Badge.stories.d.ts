import React from 'react';
import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: React.ForwardRefExoticComponent<import("../components/common/Badge").BadgeProps & React.RefAttributes<HTMLSpanElement>>;
    parameters: {
        layout: string;
        a11y: {
            config: {
                rules: {
                    id: string;
                    enabled: boolean;
                }[];
            };
        };
    };
    tags: string[];
    argTypes: {
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
        rounded: {
            control: string;
            description: string;
        };
        dot: {
            control: string;
            description: string;
        };
        children: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Primary: Story;
export declare const Secondary: Story;
export declare const Success: Story;
export declare const Warning: Story;
export declare const Error: Story;
export declare const Info: Story;
export declare const Small: Story;
export declare const Large: Story;
export declare const Rounded: Story;
export declare const WithDot: Story;
export declare const WithCustomClass: Story;
//# sourceMappingURL=Badge.stories.d.ts.map