import Toast from '../components/common/Toast';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';
const meta = {
    title: 'Components/Toast',
    component: Toast,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        message: {
            control: 'text',
            description: 'Message to display in the toast',
        },
        type: {
            control: 'select',
            options: ['info', 'success', 'warning', 'error'],
            description: 'Type of toast notification',
        },
        duration: {
            control: 'number',
            description: 'Duration in milliseconds before auto-closing',
        },
        onClose: {
            action: 'closed',
            description: 'Callback when toast is closed',
        },
    },
};
export default meta;
export const Info = {
    args: {
        message: 'This is an informational message',
        type: 'info',
        onClose: () => { },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const toast = canvas.getByRole('alert');
        await expect(toast).toBeInTheDocument();
    },
};
export const Success = {
    args: {
        message: 'Operation completed successfully',
        type: 'success',
        onClose: () => { },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const toast = canvas.getByRole('alert');
        await expect(toast).toBeInTheDocument();
    },
};
export const Warning = {
    args: {
        message: 'Please review this important notice',
        type: 'warning',
        onClose: () => { },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const toast = canvas.getByRole('alert');
        await expect(toast).toBeInTheDocument();
    },
};
export const Error = {
    args: {
        message: 'An error occurred while processing your request',
        type: 'error',
        onClose: () => { },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const toast = canvas.getByRole('alert');
        await expect(toast).toBeInTheDocument();
    },
};
export const CustomDuration = {
    args: {
        message: 'This toast will close in 5 seconds',
        type: 'info',
        duration: 5000,
        onClose: () => { },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const toast = canvas.getByRole('alert');
        await expect(toast).toBeInTheDocument();
    },
};
//# sourceMappingURL=Toast.stories.js.map