import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '../components/common/Card';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';
const meta = {
    title: 'Components/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'outlined', 'elevated'],
            description: 'Visual style variant of the card',
        },
        padding: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg'],
            description: 'Padding size of the card content',
        },
        header: {
            control: 'text',
            description: 'Optional header content',
        },
        footer: {
            control: 'text',
            description: 'Optional footer content',
        },
        hoverable: {
            control: 'boolean',
            description: 'Whether to show hover effects',
        },
    },
};
export default meta;
export const Default = {
    args: {
        children: 'Default card content',
        'data-testid': 'default-card',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const card = canvas.getByTestId('default-card');
        const content = canvas.getByTestId('default-card-content');
        await expect(card).toBeVisible();
        await expect(card).toHaveClass('bg-white');
        await expect(content).toHaveClass('p-4');
    },
};
export const Outlined = {
    args: {
        variant: 'outlined',
        children: 'Outlined card content',
        'data-testid': 'outlined-card',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const card = canvas.getByTestId('outlined-card');
        await expect(card).toBeVisible();
        await expect(card).toHaveClass('border');
        await expect(card).toHaveClass('border-gray-200');
    },
};
export const Elevated = {
    args: {
        variant: 'elevated',
        children: 'Elevated card content',
        'data-testid': 'elevated-card',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const card = canvas.getByTestId('elevated-card');
        await expect(card).toBeVisible();
        await expect(card).toHaveClass('shadow-md');
    },
};
export const SmallPadding = {
    args: {
        padding: 'sm',
        children: 'Card with small padding',
        'data-testid': 'small-padding-card',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const content = canvas.getByTestId('small-padding-card-content');
        await expect(content).toBeVisible();
        await expect(content).toHaveClass('p-3');
    },
};
export const LargePadding = {
    args: {
        padding: 'lg',
        children: 'Card with large padding',
        'data-testid': 'large-padding-card',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const content = canvas.getByTestId('large-padding-card-content');
        await expect(content).toBeVisible();
        await expect(content).toHaveClass('p-6');
    },
};
export const WithHeader = {
    args: {
        header: 'Card Header',
        children: 'Card content with header',
        'data-testid': 'header-card',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const header = canvas.getByTestId('header-card-header');
        await expect(header).toBeVisible();
        await expect(header).toHaveClass('border-b');
        await expect(header).toHaveClass('border-gray-200');
        await expect(header).toHaveTextContent('Card Header');
    },
};
export const WithFooter = {
    args: {
        footer: 'Card Footer',
        children: 'Card content with footer',
        'data-testid': 'footer-card',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const footer = canvas.getByTestId('footer-card-footer');
        await expect(footer).toBeVisible();
        await expect(footer).toHaveClass('border-t');
        await expect(footer).toHaveClass('border-gray-200');
        await expect(footer).toHaveClass('bg-gray-50');
        await expect(footer).toHaveTextContent('Card Footer');
    },
};
export const Hoverable = {
    args: {
        hoverable: true,
        children: 'Hoverable card content',
        'data-testid': 'hoverable-card',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const card = canvas.getByTestId('hoverable-card');
        await expect(card).toBeVisible();
        await expect(card).toHaveClass('transition-shadow');
        await expect(card).toHaveClass('hover:shadow-lg');
    },
};
export const ComplexContent = {
    args: {
        variant: 'elevated',
        header: (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Complex Card" }), _jsx("button", { className: "text-blue-600", children: "Action" })] })),
        footer: (_jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { className: "px-4 py-2 text-gray-600", children: "Cancel" }), _jsx("button", { className: "px-4 py-2 bg-blue-600 text-white rounded", children: "Save" })] })),
        children: (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { children: "This is a card with complex content including:" }), _jsxs("ul", { className: "list-disc list-inside", children: [_jsx("li", { children: "Header with actions" }), _jsx("li", { children: "Multiple content sections" }), _jsx("li", { children: "Footer with buttons" })] })] })),
        'data-testid': 'complex-card',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const card = canvas.getByTestId('complex-card');
        const header = canvas.getByTestId('complex-card-header');
        const content = canvas.getByTestId('complex-card-content');
        const footer = canvas.getByTestId('complex-card-footer');
        await expect(card).toBeVisible();
        await expect(header).toBeVisible();
        await expect(content).toBeVisible();
        await expect(footer).toBeVisible();
        await expect(header).toContainHTML('text-lg font-semibold');
        await expect(content).toContainHTML('list-disc list-inside');
        await expect(footer).toContainHTML('bg-blue-600');
    },
};
//# sourceMappingURL=Card.stories.js.map