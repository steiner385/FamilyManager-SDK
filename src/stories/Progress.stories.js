import { Progress } from '../components/common/Progress';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';
const meta = {
    title: 'Components/Progress',
    component: Progress,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: { type: 'range', min: 0, max: 100 },
            description: 'Current value of the progress bar',
        },
        max: {
            control: 'number',
            description: 'Maximum value (default: 100)',
        },
        variant: {
            control: 'select',
            options: ['primary', 'success', 'warning', 'danger', 'info'],
            description: 'Visual style variant of the progress bar',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the progress bar',
        },
        showValue: {
            control: 'boolean',
            description: 'Whether to show the percentage value',
        },
        valuePosition: {
            control: 'radio',
            options: ['inside', 'outside'],
            description: 'Position of the percentage value',
        },
        label: {
            control: 'text',
            description: 'Label text above the progress bar',
        },
        animated: {
            control: 'boolean',
            description: 'Whether to show animation effect',
        },
        striped: {
            control: 'boolean',
            description: 'Whether to show striped pattern',
        },
    },
};
export default meta;
const waitForTransition = async () => new Promise(resolve => setTimeout(resolve, 350));
const checkProgressWidth = async (element, expectedPercentage) => {
    await waitForTransition();
    const style = element.getAttribute('style');
    expect(style).toBe(`width: ${expectedPercentage}%;`);
};
export const Default = {
    args: {
        value: 60,
        label: 'Default Progress',
        'data-testid': 'default-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const track = canvas.getByTestId('default-progress-track');
        const bar = canvas.getByTestId('default-progress-bar');
        expect(track).toBeInTheDocument();
        expect(bar).toBeInTheDocument();
        expect(bar).toHaveClass('bg-blue-600');
        expect(bar.style.width).toBe('60%');
    },
};
export const Success = {
    args: {
        value: 80,
        variant: 'success',
        label: 'Success Progress',
        'data-testid': 'success-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const bar = canvas.getByTestId('success-progress-bar');
        expect(bar).toBeInTheDocument();
        expect(bar).toHaveClass('bg-green-600');
        expect(bar.style.width).toBe('80%');
    },
};
export const Warning = {
    args: {
        value: 70,
        variant: 'warning',
        label: 'Warning Progress',
        'data-testid': 'warning-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const bar = canvas.getByTestId('warning-progress-bar');
        expect(bar).toBeInTheDocument();
        expect(bar).toHaveClass('bg-yellow-500');
        expect(bar.style.width).toBe('70%');
    },
};
export const Danger = {
    args: {
        value: 30,
        variant: 'danger',
        label: 'Danger Progress',
        'data-testid': 'danger-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const bar = canvas.getByTestId('danger-progress-bar');
        expect(bar).toBeInTheDocument();
        expect(bar).toHaveClass('bg-red-600');
        expect(bar.style.width).toBe('30%');
    },
};
export const Small = {
    args: {
        value: 50,
        size: 'sm',
        label: 'Small Progress',
        'data-testid': 'small-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const track = canvas.getByTestId('small-progress-track');
        expect(track).toBeInTheDocument();
        expect(track).toHaveClass('h-1');
    },
};
export const Large = {
    args: {
        value: 50,
        size: 'lg',
        label: 'Large Progress',
        'data-testid': 'large-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const track = canvas.getByTestId('large-progress-track');
        expect(track).toBeInTheDocument();
        expect(track).toHaveClass('h-3');
    },
};
export const WithLabel = {
    args: {
        value: 75,
        label: 'Upload Progress',
        'data-testid': 'label-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const label = canvas.getByTestId('label-progress-label');
        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent('Upload Progress');
        expect(label).toHaveClass('font-medium');
    },
};
export const WithValueOutside = {
    args: {
        value: 65,
        showValue: true,
        valuePosition: 'outside',
        'data-testid': 'value-outside-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const value = canvas.getByTestId('value-outside-progress-value-outside');
        expect(value).toBeInTheDocument();
        expect(value).toHaveTextContent('65%');
    },
};
export const WithValueInside = {
    args: {
        value: 65,
        showValue: true,
        valuePosition: 'inside',
        size: 'lg',
        'data-testid': 'value-inside-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const value = canvas.getByTestId('value-inside-progress-value-inside');
        expect(value).toBeInTheDocument();
        expect(value).toHaveTextContent('65%');
        expect(value).toHaveClass('text-white');
    },
};
export const Striped = {
    args: {
        value: 70,
        striped: true,
        'data-testid': 'striped-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const bar = canvas.getByTestId('striped-progress-bar');
        expect(bar).toBeInTheDocument();
        expect(bar).toHaveClass('bg-gradient-to-r');
        expect(bar).toHaveClass('bg-[length:30px_30px]');
    },
};
export const Animated = {
    args: {
        value: 70,
        animated: true,
        'data-testid': 'animated-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const bar = canvas.getByTestId('animated-progress-bar');
        expect(bar).toBeInTheDocument();
        expect(bar).toHaveClass('after:animate-progress-shine');
    },
};
export const CompleteProgress = {
    args: {
        value: 100,
        variant: 'success',
        label: 'Download Complete',
        showValue: true,
        valuePosition: 'outside',
        'data-testid': 'complete-progress',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const bar = canvas.getByTestId('complete-progress-bar');
        const label = canvas.getByTestId('complete-progress-label');
        const value = canvas.getByTestId('complete-progress-value-outside');
        expect(bar).toBeInTheDocument();
        expect(bar).toHaveClass('bg-green-600');
        expect(bar.style.width).toBe('100%');
        expect(label).toHaveTextContent('Download Complete');
        expect(value).toHaveTextContent('100%');
    },
};
//# sourceMappingURL=Progress.stories.js.map