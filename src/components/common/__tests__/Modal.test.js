const { jsx: _jsx } = require("react/jsx-runtime");
const { render, screen, fireEvent } = require('../../../testing/simple-test-utils');
const { Modal } = require('../Modal');
// Mock Headless UI's Transition component
jest.mock('@headlessui/react', () => {
    const Dialog = ({ children, ...props }) => {
        const Component = props.as || 'div';
        return _jsx(Component, { ...props, children: children });
    };
    Dialog.displayName = 'Dialog';
    const DialogPanel = ({ children, className }) => (_jsx("div", { "data-testid": "modal-panel", className: className, children: children }));
    DialogPanel.displayName = 'Dialog.Panel';
    const DialogTitle = ({ children, className, ...props }) => (_jsx("h1", { className: className, ...props, children: children }));
    DialogTitle.displayName = 'Dialog.Title';
    const TransitionRoot = ({ show, children }) => show ? children : null;
    TransitionRoot.displayName = 'Transition.Root';
    const TransitionChild = ({ children }) => children;
    TransitionChild.displayName = 'Transition.Child';
    return {
        Transition: {
            Root: TransitionRoot,
            Child: TransitionChild,
        },
        Dialog,
        Fragment: ({ children }) => children,
    };
});
describe('Modal', () => {
    const mockOnClose = jest.fn();
    const defaultProps = {
        isOpen: true,
        onClose: mockOnClose,
        children: _jsx("div", { children: "Modal content" }),
    };
    beforeEach(() => {
        mockOnClose.mockClear();
    });
    it('renders when isOpen is true', () => {
        render(_jsx(Modal, { ...defaultProps }));
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(screen.getByTestId('modal-content')).toHaveTextContent('Modal content');
    });
    it('does not render when isOpen is false', () => {
        render(_jsx(Modal, { ...defaultProps, isOpen: false }));
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
    it('renders title when provided', () => {
        render(_jsx(Modal, { ...defaultProps, title: "Test Title" }));
        const title = screen.getByTestId('modal-title');
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Test Title');
    });
    it('calls onClose when close button is clicked', () => {
        render(_jsx(Modal, { ...defaultProps }));
        const closeButton = screen.getByTestId('modal-close-button');
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    it('applies different max-width classes correctly', () => {
        const { rerender } = render(_jsx(Modal, { ...defaultProps, maxWidth: "sm" }));
        expect(screen.getByTestId('modal-panel')).toHaveClass('sm:max-w-sm');
        rerender(_jsx(Modal, { ...defaultProps, maxWidth: "md" }));
        expect(screen.getByTestId('modal-panel')).toHaveClass('sm:max-w-md');
        rerender(_jsx(Modal, { ...defaultProps, maxWidth: "lg" }));
        expect(screen.getByTestId('modal-panel')).toHaveClass('sm:max-w-lg');
        rerender(_jsx(Modal, { ...defaultProps, maxWidth: "xl" }));
        expect(screen.getByTestId('modal-panel')).toHaveClass('sm:max-w-xl');
        rerender(_jsx(Modal, { ...defaultProps, maxWidth: "2xl" }));
        expect(screen.getByTestId('modal-panel')).toHaveClass('sm:max-w-2xl');
    });
    it('has proper accessibility attributes', () => {
        render(_jsx(Modal, { ...defaultProps, title: "Test Title" }));
        const modal = screen.getByTestId('modal');
        expect(modal).toHaveAttribute('role', 'dialog');
        expect(modal).toHaveAttribute('aria-modal', 'true');
        expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
        const closeButton = screen.getByTestId('modal-close-button');
        expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
        expect(closeButton.querySelector('.sr-only')).toHaveTextContent('Close modal');
    });
    it('uses correct aria attributes when no title is provided', () => {
        render(_jsx(Modal, { ...defaultProps }));
        const modal = screen.getByTestId('modal');
        expect(modal).toHaveAttribute('aria-label', 'Modal dialog');
        expect(modal).not.toHaveAttribute('aria-labelledby');
    });
    it('renders close button with correct styling', () => {
        render(_jsx(Modal, { ...defaultProps }));
        const closeButton = screen.getByTestId('modal-close-button');
        expect(closeButton).toHaveClass('rounded-md', 'bg-white', 'text-gray-400', 'hover:text-gray-500', 'focus:outline-none', 'focus:ring-2', 'focus:ring-primary-500', 'focus:ring-offset-2');
    });
    it('renders with correct panel styling', () => {
        render(_jsx(Modal, { ...defaultProps }));
        const panel = screen.getByTestId('modal-panel');
        expect(panel).toHaveClass('relative', 'transform', 'overflow-hidden', 'rounded-lg', 'bg-white', 'shadow-xl', 'transition-all');
    });
});
//# sourceMappingURL=Modal.test.js.map
