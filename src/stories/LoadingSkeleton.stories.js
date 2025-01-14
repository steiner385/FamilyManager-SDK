import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';
const meta = {
    title: 'Components/LoadingSkeleton',
    component: LoadingSkeleton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        width: {
            control: 'text',
            description: 'Width class (e.g., "w-full", "w-64")',
        },
        height: {
            control: 'text',
            description: 'Height class (e.g., "h-4", "h-8")',
        },
        variant: {
            control: 'select',
            options: ['text', 'circle', 'rectangle'],
            description: 'Shape variant of the skeleton',
        },
        count: {
            control: 'number',
            description: 'Number of skeleton items to display',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
};
export default meta;
export const Default = {
    args: {
        width: 'w-64',
        height: 'h-4',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const skeleton = canvas.getByRole('status');
        await expect(skeleton).toBeVisible();
        await expect(skeleton).toHaveClass('animate-pulse');
        await expect(skeleton).toHaveClass('bg-gray-200');
        await expect(skeleton).toHaveClass('w-64');
        await expect(skeleton).toHaveClass('h-4');
    },
};
export const Circle = {
    args: {
        variant: 'circle',
        width: 'w-12',
        height: 'h-12',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const skeleton = canvas.getByRole('status');
        await expect(skeleton).toBeVisible();
        await expect(skeleton).toHaveClass('rounded-full');
        await expect(skeleton).toHaveClass('w-12');
        await expect(skeleton).toHaveClass('h-12');
    },
};
export const Text = {
    args: {
        variant: 'text',
        width: 'w-full',
        height: 'h-4',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const skeleton = canvas.getByRole('status');
        await expect(skeleton).toBeVisible();
        await expect(skeleton).toHaveClass('w-full');
        await expect(skeleton).toHaveClass('h-4');
    },
};
export const MultipleLines = {
    args: {
        variant: 'text',
        width: 'w-full',
        height: 'h-4',
        count: 3,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const skeletons = canvas.getAllByRole('status');
        await expect(skeletons).toHaveLength(3);
        skeletons.forEach(async (skeleton, index) => {
            await expect(skeleton).toBeVisible();
            await expect(skeleton).toHaveClass('w-full');
            await expect(skeleton).toHaveClass('h-4');
            if (index < 2) {
                await expect(skeleton).toHaveClass('mb-4');
            }
        });
    },
};
export const WithCustomClass = {
    args: {
        width: 'w-64',
        height: 'h-4',
        className: 'my-8',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const skeleton = canvas.getByRole('status');
        await expect(skeleton).toBeVisible();
        await expect(skeleton).toHaveClass('my-8');
    },
};
//# sourceMappingURL=LoadingSkeleton.stories.js.map