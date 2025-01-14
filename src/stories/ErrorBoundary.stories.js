import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { expect } from '@storybook/jest';
import { within, waitFor } from '@storybook/testing-library';
// Test component that triggers an error after mounting
const ErrorTrigger = ({ message = 'Test error triggered' }) => {
    useEffect(() => {
        throw new Error(message);
    }, [message]);
    return null;
};
const meta = {
    title: 'Components/ErrorBoundary',
    component: ErrorBoundary,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: {
            control: 'text',
            description: 'Content to be rendered inside the error boundary',
        },
        fallback: {
            control: 'text',
            description: 'Custom fallback UI to show when an error occurs',
        },
        testErrorTrigger: {
            control: 'boolean',
            description: 'Trigger a test error for demonstration',
        },
    },
};
export default meta;
export const Default = {
    args: {
        children: _jsx("div", { children: "Normal content without errors" }),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const content = canvas.getByText('Normal content without errors');
        await expect(content).toBeVisible();
    }
};
export const WithError = {
    args: {
        children: _jsx(ErrorTrigger, {})
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the default error UI when an error occurs.',
            },
        },
        chromatic: { disableSnapshot: true }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            const errorHeading = canvas.getByText('Something went wrong');
            const errorMessage = canvas.getByText('Test error triggered');
            expect(errorHeading).toBeInTheDocument();
            expect(errorMessage).toBeInTheDocument();
        });
    }
};
export const WithCustomFallback = {
    args: {
        children: _jsx(ErrorTrigger, {}),
        fallback: (_jsxs("div", { className: "text-center p-4 bg-yellow-100 rounded-lg", children: [_jsx("h2", { className: "text-xl font-bold text-yellow-800", children: "Custom Error View" }), _jsx("p", { className: "text-yellow-700", children: "Something went wrong with the application" })] })),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows a custom error UI when an error occurs.',
            },
        },
        chromatic: { disableSnapshot: true }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            const customErrorHeading = canvas.getByText('Custom Error View');
            const customErrorMessage = canvas.getByText('Something went wrong with the application');
            expect(customErrorHeading).toBeInTheDocument();
            expect(customErrorMessage).toBeInTheDocument();
        });
    }
};
export const WithComponentError = {
    args: {
        children: _jsx(ErrorTrigger, { message: "Component error" })
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows how the error boundary handles component errors.',
            },
        },
        chromatic: { disableSnapshot: true }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            const errorHeading = canvas.getByText('Something went wrong');
            const errorMessage = canvas.getByText('Component error');
            expect(errorHeading).toBeInTheDocument();
            expect(errorMessage).toBeInTheDocument();
        });
    }
};
export const WithNestedContent = {
    args: {
        children: (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { children: "This content should render normally" }), _jsx(ErrorBoundary, { testErrorTrigger: true, children: _jsx("div", { children: "This content will not be shown due to error" }) }), _jsx("div", { children: "This content should also render normally" })] })),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows how errors are contained within nested error boundaries.',
            },
        },
        chromatic: { disableSnapshot: true },
        test: {
            skip: true,
            excludeFromTest: true,
            excludeFromStorybook: true,
            excludeFromSmoke: true,
            excludeFromPlayback: true,
            excludeFromInteractions: true
        }
    }
};
//# sourceMappingURL=ErrorBoundary.stories.js.map