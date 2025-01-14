import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from '../components/common/Modal';
const meta = {
    title: 'Components/Modal',
    component: Modal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        isOpen: {
            control: 'boolean',
            description: 'Controls whether the modal is visible',
        },
        onClose: {
            description: 'Function called when the modal is closed',
        },
        title: {
            control: 'text',
            description: 'Optional title text for the modal',
        },
        maxWidth: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl', '2xl'],
            description: 'Maximum width of the modal',
        },
        children: {
            control: 'text',
            description: 'Content to display inside the modal',
        },
    },
};
export default meta;
export const Default = {
    args: {
        isOpen: true,
        onClose: () => { },
        children: 'Modal content goes here',
    },
};
export const WithTitle = {
    args: {
        isOpen: true,
        onClose: () => { },
        title: 'Modal Title',
        children: 'Modal content with a title',
    },
};
export const SmallSize = {
    args: {
        isOpen: true,
        onClose: () => { },
        maxWidth: 'sm',
        children: 'Small modal content',
    },
};
export const LargeSize = {
    args: {
        isOpen: true,
        onClose: () => { },
        maxWidth: 'lg',
        children: 'Large modal content',
    },
};
export const WithCloseButton = {
    args: {
        isOpen: true,
        onClose: () => { },
        children: 'Modal with close button',
    },
};
export const WithLongContent = {
    args: {
        isOpen: true,
        onClose: () => { },
        children: (_jsxs("div", { children: [_jsx("p", { children: "This is a long content paragraph." }), _jsx("p", { children: "It demonstrates the modal's scrolling behavior." }), _jsx("p", { children: "The modal should handle long content gracefully." }), _jsx("p", { children: "You can add as much content as needed." }), _jsx("p", { children: "The modal will scroll if the content exceeds the viewport." }), Array.from({ length: 10 }).map((_, i) => (_jsxs("p", { children: ["Additional paragraph ", i + 1] }, i)))] })),
    },
};
//# sourceMappingURL=Modal.stories.js.map