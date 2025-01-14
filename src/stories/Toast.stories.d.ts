import React from 'react';
import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: React.ForwardRefExoticComponent<import("../components/common/Toast").ToastProps & React.RefAttributes<HTMLDivElement>>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        message: {
            control: string;
            description: string;
        };
        type: {
            control: string;
            options: string[];
            description: string;
        };
        duration: {
            control: string;
            description: string;
        };
        onClose: {
            action: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Info: Story;
export declare const Success: Story;
export declare const Warning: Story;
export declare const Error: Story;
export declare const CustomDuration: Story;
//# sourceMappingURL=Toast.stories.d.ts.map