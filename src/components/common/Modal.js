import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'md' }) => {
    const maxWidthClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl'
    };
    return (_jsx(Transition.Root, { show: isOpen, as: Fragment, children: _jsxs(Dialog, { as: "div", className: "relative z-50", onClose: onClose, "aria-modal": "true", "aria-labelledby": title ? "modal-title" : undefined, "aria-label": title ? undefined : "Modal dialog", role: "dialog", "data-testid": "modal", children: [_jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" }) }), _jsx("div", { className: "fixed inset-0 z-10 overflow-y-auto", children: _jsx("div", { className: "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0", children: _jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95", enterTo: "opacity-100 translate-y-0 sm:scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 translate-y-0 sm:scale-100", leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95", children: _jsxs(Dialog.Panel, { className: `relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full ${maxWidthClasses[maxWidth]} sm:p-6`, "data-testid": "modal-panel", children: [_jsx("div", { className: "absolute right-0 top-0 hidden pr-4 pt-4 sm:block", children: _jsxs("button", { type: "button", className: "rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2", onClick: onClose, "aria-label": "Close modal", "data-testid": "modal-close-button", children: [_jsx("span", { className: "sr-only", children: "Close modal" }), _jsx(XMarkIcon, { className: "h-6 w-6", "aria-hidden": "true" })] }) }), title && (_jsx(Dialog.Title, { as: "h1", id: "modal-title", className: "text-lg font-medium leading-6 text-gray-900 mb-4", "data-testid": "modal-title", children: title })), _jsx("div", { className: "modal-content", "data-testid": "modal-content", children: children })] }) }) }) })] }) }));
};
//# sourceMappingURL=Modal.js.map