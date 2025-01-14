import React from 'react';
import type { StoryObj } from '@storybook/react';
import { Input } from '../components/common/Input';
declare const meta: {
    title: string;
    component: React.ForwardRefExoticComponent<import("../components/common/Input").InputProps & React.RefAttributes<HTMLInputElement>>;
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
        error: {
            control: string;
            description: string;
        };
        helperText: {
            control: string;
            description: string;
        };
        disabled: {
            control: string;
            description: string;
        };
        fullWidth: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof Input>;
export declare const Default: Story;
export declare const Filled: Story;
export declare const Outlined: Story;
export declare const Small: Story;
export declare const Large: Story;
export declare const WithError: Story;
export declare const WithHelperText: Story;
export declare const WithStartIcon: Story;
export declare const WithEndIcon: Story;
export declare const Disabled: Story;
export declare const FullWidth: Story;
//# sourceMappingURL=Input.stories.d.ts.map