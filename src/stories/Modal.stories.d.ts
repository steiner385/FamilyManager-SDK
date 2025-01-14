import React from 'react';
import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: React.FC<import("../components/common/Modal").ModalProps>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        isOpen: {
            control: string;
            description: string;
        };
        onClose: {
            description: string;
        };
        title: {
            control: string;
            description: string;
        };
        maxWidth: {
            control: string;
            options: string[];
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
export declare const Default: Story;
export declare const WithTitle: Story;
export declare const SmallSize: Story;
export declare const LargeSize: Story;
export declare const WithCloseButton: Story;
export declare const WithLongContent: Story;
//# sourceMappingURL=Modal.stories.d.ts.map