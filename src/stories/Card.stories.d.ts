import React from 'react';
import type { StoryObj } from '@storybook/react';
import { Card } from '../components/common/Card';
declare const meta: {
    title: string;
    component: React.ForwardRefExoticComponent<import("../components/common/Card").CardProps & React.RefAttributes<HTMLDivElement>>;
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
        padding: {
            control: string;
            options: string[];
            description: string;
        };
        header: {
            control: string;
            description: string;
        };
        footer: {
            control: string;
            description: string;
        };
        hoverable: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof Card>;
export declare const Default: Story;
export declare const Outlined: Story;
export declare const Elevated: Story;
export declare const SmallPadding: Story;
export declare const LargePadding: Story;
export declare const WithHeader: Story;
export declare const WithFooter: Story;
export declare const Hoverable: Story;
export declare const ComplexContent: Story;
//# sourceMappingURL=Card.stories.d.ts.map