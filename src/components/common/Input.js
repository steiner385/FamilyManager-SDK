import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Input = React.forwardRef(({ variant = 'default', size = 'md', error = false, helperText, startIcon, endIcon, fullWidth = false, disabled = false, className = '', 'data-testid': dataTestId, ...props }, ref) => {
    const baseStyles = 'transition-colors focus:outline-none';
    const variants = {
        default: `
        border border-gray-300 bg-white
        focus:border-blue-500 focus:ring-1 focus:ring-blue-500
      `,
        filled: `
        border-0 bg-gray-100
        focus:bg-gray-50 focus:ring-2 focus:ring-blue-500
      `,
        outlined: `
        border-2 border-gray-300 bg-transparent
        focus:border-blue-500
      `,
    };
    const sizes = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-base',
        lg: 'px-4 py-3 text-lg',
    };
    const states = {
        error: 'border-red-600 focus:border-red-600 focus:ring-red-600',
        disabled: 'opacity-50 cursor-not-allowed bg-gray-50',
    };
    const widthClass = fullWidth ? 'w-full' : 'w-auto';
    const combinedClassName = `
      ${baseStyles}
      ${variants[variant]}
      ${sizes[size]}
      ${error ? states.error : ''}
      ${disabled ? states.disabled : ''}
      ${widthClass}
      rounded-md
      ${className}
    `.trim();
    const wrapperClass = `
      relative inline-flex items-center
      ${fullWidth ? 'w-full' : 'w-auto'}
    `.trim();
    const iconClass = `
      absolute flex items-center justify-center
      text-gray-400 pointer-events-none
      ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}
    `.trim();
    const startIconClass = `${iconClass} left-2`;
    const endIconClass = `${iconClass} right-2`;
    const inputElement = (_jsx("input", { ref: ref, disabled: disabled, className: `
          ${combinedClassName}
          ${startIcon ? 'pl-8' : ''}
          ${endIcon ? 'pr-8' : ''}
        `.trim(), "data-testid": dataTestId, ...props }));
    return (_jsxs("div", { className: "flex flex-col", "data-testid": dataTestId ? `${dataTestId}-wrapper` : undefined, children: [_jsxs("div", { className: wrapperClass, children: [startIcon && (_jsx("span", { className: startIconClass, "data-testid": dataTestId ? `${dataTestId}-start-icon` : undefined, children: startIcon })), inputElement, endIcon && (_jsx("span", { className: endIconClass, "data-testid": dataTestId ? `${dataTestId}-end-icon` : undefined, children: endIcon }))] }), helperText && (_jsx("span", { className: `mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`, "data-testid": dataTestId ? `${dataTestId}-helper-text` : undefined, children: helperText }))] }));
});
Input.displayName = 'Input';
//# sourceMappingURL=Input.js.map