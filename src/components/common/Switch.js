import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Switch = React.forwardRef(({ size = 'md', label, description, variant = 'primary', disabled = false, className = '', id, 'data-testid': dataTestId, ...props }, ref) => {
    const uniqueId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
    const sizes = {
        sm: {
            switch: 'w-8 h-4',
            thumb: 'w-3 h-3',
            translate: 'translate-x-4',
            text: 'text-sm',
        },
        md: {
            switch: 'w-11 h-6',
            thumb: 'w-5 h-5',
            translate: 'translate-x-5',
            text: 'text-base',
        },
        lg: {
            switch: 'w-14 h-7',
            thumb: 'w-6 h-6',
            translate: 'translate-x-7',
            text: 'text-lg',
        },
    };
    const variants = {
        primary: {
            active: 'bg-blue-600',
            inactive: 'bg-gray-200',
        },
        success: {
            active: 'bg-green-600',
            inactive: 'bg-gray-200',
        },
        danger: {
            active: 'bg-red-600',
            inactive: 'bg-gray-200',
        },
    };
    return (_jsxs("div", { className: `flex items-start ${className}`, "data-testid": dataTestId ? `${dataTestId}-wrapper` : undefined, children: [_jsx("div", { className: "flex items-center h-full", children: _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", id: uniqueId, className: "sr-only peer", disabled: disabled, ref: ref, "data-testid": dataTestId, ...props }), _jsx("div", { className: `
                ${sizes[size].switch}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${variants[variant].inactive}
                peer-checked:${variants[variant].active}
                rounded-full
                peer-focus:outline-none
                peer-focus:ring-4
                peer-focus:ring-blue-300
                dark:peer-focus:ring-blue-800
                transition-colors
              `, "data-testid": dataTestId ? `${dataTestId}-track` : undefined, children: _jsx("div", { className: `
                  ${sizes[size].thumb}
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  bg-white
                  rounded-full
                  transition-transform
                  peer-checked:${sizes[size].translate}
                  absolute
                  left-0.5
                  top-1/2
                  -translate-y-1/2
                `, "data-testid": dataTestId ? `${dataTestId}-thumb` : undefined }) })] }) }), (label || description) && (_jsxs("div", { className: "ml-3", children: [label && (_jsx("label", { htmlFor: uniqueId, className: `
                  font-medium
                  ${sizes[size].text}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `, "data-testid": dataTestId ? `${dataTestId}-label` : undefined, children: label })), description && (_jsx("p", { className: `
                  text-gray-500
                  ${size === 'sm' ? 'text-xs' : 'text-sm'}
                  ${disabled ? 'opacity-50' : ''}
                `, "data-testid": dataTestId ? `${dataTestId}-description` : undefined, children: description }))] }))] }));
});
Switch.displayName = 'Switch';
//# sourceMappingURL=Switch.js.map