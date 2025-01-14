import React from 'react';
import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: React.ForwardRefExoticComponent<import("../components/common/Switch").SwitchProps & React.RefAttributes<HTMLInputElement>>;
    parameters: {
        layout: string;
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
        label: {
            control: string;
            description: string;
        };
        description: {
            control: string;
            description: string;
        };
        disabled: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Success: Story;
export declare const Danger: Story;
export declare const Small: Story;
export declare const Large: Story;
export declare const WithLabel: Story;
export declare const WithDescription: Story;
export declare const Disabled: Story;
export declare const Checked: Story;
export declare const Interactive: Story;
//# sourceMappingURL=Switch.stories.d.ts.map