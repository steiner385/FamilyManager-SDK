import React from 'react';
import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: React.ForwardRefExoticComponent<import("../components/common/Button").ButtonProps & React.RefAttributes<HTMLButtonElement>>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        variant: {
            control: string;
            options: string[];
        };
        size: {
            control: string;
            options: string[];
        };
        isLoading: {
            control: string;
        };
        isFullWidth: {
            control: string;
        };
        disabled: {
            control: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Primary: Story;
export declare const Secondary: Story;
export declare const Outline: Story;
export declare const Ghost: Story;
export declare const Danger: Story;
export declare const Small: Story;
export declare const Medium: Story;
export declare const Large: Story;
export declare const Disabled: Story;
export declare const Loading: Story;
export declare const FullWidth: Story;
//# sourceMappingURL=Button.stories.d.ts.map