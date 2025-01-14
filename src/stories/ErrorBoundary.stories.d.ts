import type { StoryObj } from '@storybook/react';
import ErrorBoundary from '../components/common/ErrorBoundary';
declare const meta: {
    title: string;
    component: typeof ErrorBoundary;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        children: {
            control: string;
            description: string;
        };
        fallback: {
            control: string;
            description: string;
        };
        testErrorTrigger: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithError: Story;
export declare const WithCustomFallback: Story;
export declare const WithComponentError: Story;
export declare const WithNestedContent: Story;
//# sourceMappingURL=ErrorBoundary.stories.d.ts.map