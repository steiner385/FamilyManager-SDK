import { LoadingSpinner } from '../components/common/LoadingSpinner';
const meta = {
    title: 'Components/LoadingSpinner',
    component: LoadingSpinner,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'Size of the spinner',
        },
        label: {
            control: 'text',
            description: 'Accessibility label for the spinner',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
};
export default meta;
export const Default = {
    args: {},
    play: ({ canvasElement }) => {
        const spinner = canvasElement.querySelector('[role="status"]');
        if (!spinner)
            throw new Error('Spinner not found');
        if (!spinner.classList.contains('animate-spin'))
            throw new Error('Missing animate-spin class');
        if (!spinner.classList.contains('h-8'))
            throw new Error('Missing h-8 class');
        if (!spinner.classList.contains('w-8'))
            throw new Error('Missing w-8 class');
        if (spinner.getAttribute('aria-busy') !== 'true')
            throw new Error('Missing aria-busy attribute');
        if (spinner.getAttribute('aria-label') !== 'Loading')
            throw new Error('Missing aria-label attribute');
    },
};
export const Small = {
    args: {
        size: 'small',
    },
    play: ({ canvasElement }) => {
        const spinner = canvasElement.querySelector('[role="status"]');
        if (!spinner)
            throw new Error('Spinner not found');
        if (!spinner.classList.contains('h-4'))
            throw new Error('Missing h-4 class');
        if (!spinner.classList.contains('w-4'))
            throw new Error('Missing w-4 class');
    },
};
export const Large = {
    args: {
        size: 'large',
    },
    play: ({ canvasElement }) => {
        const spinner = canvasElement.querySelector('[role="status"]');
        if (!spinner)
            throw new Error('Spinner not found');
        if (!spinner.classList.contains('h-12'))
            throw new Error('Missing h-12 class');
        if (!spinner.classList.contains('w-12'))
            throw new Error('Missing w-12 class');
    },
};
export const CustomLabel = {
    args: {
        label: 'Processing...',
    },
    play: ({ canvasElement }) => {
        const spinner = canvasElement.querySelector('[role="status"]');
        if (!spinner)
            throw new Error('Spinner not found');
        if (spinner.getAttribute('aria-label') !== 'Processing...')
            throw new Error('Missing custom aria-label');
    },
};
export const WithCustomClass = {
    args: {
        className: 'text-blue-500',
    },
    play: ({ canvasElement }) => {
        const spinner = canvasElement.querySelector('[role="status"]');
        if (!spinner)
            throw new Error('Spinner not found');
        if (!spinner.classList.contains('text-blue-500'))
            throw new Error('Missing custom class');
    },
};
//# sourceMappingURL=LoadingSpinner.stories.js.map