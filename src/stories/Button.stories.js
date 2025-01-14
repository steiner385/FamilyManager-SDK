import { Button } from '../components/common/Button';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';
const meta = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        isLoading: {
            control: 'boolean',
        },
        isFullWidth: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
    },
};
export default meta;
export const Primary = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
        'data-testid': 'primary-button',
    },
    play: async (context) => {
        const canvas = within(context.canvasElement);
        const button = canvas.getByTestId('primary-button');
        await expect(button).toBeVisible();
        await expect(button).toHaveTextContent('Primary Button');
        await expect(button).toHaveClass('bg-blue-600');
    },
};
export const Secondary = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
        'data-testid': 'secondary-button',
    },
    play: async (context) => {
        const canvas = within(context.canvasElement);
        const button = canvas.getByTestId('secondary-button');
        await expect(button).toBeVisible();
        await expect(button).toHaveTextContent('Secondary Button');
        await expect(button).toHaveClass('bg-gray-600');
    },
};
export const Outline = {
    args: {
        variant: 'outline',
        children: 'Outline Button',
        'data-testid': 'outline-button',
    },
    play: async (context) => {
        const canvas = within(context.canvasElement);
        const button = canvas.getByTestId('outline-button');
        await expect(button).toBeVisible();
        await expect(button).toHaveTextContent('Outline Button');
        await expect(button).toHaveClass('border-2');
        await expect(button).toHaveClass('border-gray-300');
        await expect(button).toHaveClass('bg-transparent');
    },
};
export const Ghost = {
    args: {
        variant: 'ghost',
        children: 'Ghost Button',
        'data-testid': 'ghost-button',
    },
    play: async (context) => {
        const canvas = within(context.canvasElement);
        const button = canvas.getByTestId('ghost-button');
        await expect(button).toBeVisible();
        await expect(button).toHaveTextContent('Ghost Button');
        await expect(button).toHaveClass('bg-transparent');
    },
};
export const Danger = {
    args: {
        variant: 'danger',
        children: 'Danger Button',
        'data-testid': 'danger-button',
    },
    play: async (context) => {
        const canvas = within(context.canvasElement);
        const button = canvas.getByTestId('danger-button');
        await expect(button).toBeVisible();
        await expect(button).toHaveTextContent('Danger Button');
        await expect(button).toHaveClass('bg-red-600');
    },
};
export const Small = {
    args: {
        size: 'sm',
        children: 'Small Button',
        'data-testid': 'small-button',
    },
    play: async (context) => {
        const canvas = within(context.canvasElement);
        const button = canvas.getByTestId('small-button');
        await expect(button).toBeVisible();
        await expect(button).toHaveTextContent('Small Button');
        await expect(button).toHaveClass('px-3');
        await expect(button).toHaveClass('py-1.5');
        await expect(button).toHaveClass('text-sm');
    },
};
export const Medium = {
    args: {
        size: 'md',
        children: 'Medium Button',
        'data-testid': 'medium-button',
    },
    play: async (context) => {
        const canvas = within(context.canvasElement);
        const button = canvas.getByTestId('medium-button');
        await expect(button).toBeVisible();
        await expect(button).toHaveTextContent('Medium Button');
        await expect(button).toHaveClass('px-4');
        await expect(button).toHaveClass('py-2');
        await expect(button).toHaveClass('text-base');
    },
};
export const Large = {
    args: {
        size: 'lg',
        children: 'Large Button',
        'data-testid': 'large-button',
    },
    play: async (context) => {
        const canvas = within(context.canvasElement);
        const button = canvas.getByTestId('large-button');
        await expect(button).toBeVisible();
        await expect(button).toHaveTextContent('Large Button');
        await expect(button).toHaveClass('px-6');
        await expect(button).toHaveClass('py-3');
        await expect(button).toHaveClass('text-lg');
    },
};
export const Disabled = {
    args: {
        disabled: true,
        children: 'Disabled Button',
        'data-testid': 'disabled-button',
    },
    play: async (context) => {
        const canvas = within(context.canvasElement);
        const button = canvas.getByTestId('disabled-button');
        await expect(button).toBeVisible();
        await expect(button).toHaveTextContent('Disabled Button');
        await expect(button).toHaveAttribute('disabled');
    },
};
export const Loading = {
    args: {
        isLoading: true,
        children: 'Loading Button',
        'data-testid': 'loading-button',
    },
    play: async (context) => {
        const canvas = within(context.canvasElement);
        const button = canvas.getByTestId('loading-button');
        await expect(button).toBeVisible();
        await expect(button).toHaveTextContent('Loading Button');
        await expect(button).toBeDisabled();
        await expect(button).toHaveClass('cursor-wait');
        // Check for loading spinner
        const spinner = canvas.getByRole('status');
        await expect(spinner).toBeVisible();
        await expect(spinner).toHaveClass('animate-spin');
        await expect(spinner).toHaveAttribute('aria-label', 'Loading');
    },
};
export const FullWidth = {
    args: {
        isFullWidth: true,
        children: 'Full Width Button',
        'data-testid': 'full-width-button',
    },
    play: async (context) => {
        const canvas = within(context.canvasElement);
        const button = canvas.getByTestId('full-width-button');
        await expect(button).toBeVisible();
        await expect(button).toHaveTextContent('Full Width Button');
        await expect(button).toHaveClass('w-full');
    },
};
//# sourceMappingURL=Button.stories.js.map