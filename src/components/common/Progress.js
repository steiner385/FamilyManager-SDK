import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Progress = React.forwardRef(({ value, max = 100, variant = 'primary', size = 'md', showValue = false, valuePosition = 'outside', label, animated = false, striped = false, className = '', 'data-testid': dataTestId, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const variants = {
        primary: 'bg-blue-600',
        success: 'bg-green-600',
        warning: 'bg-yellow-500',
        danger: 'bg-red-600',
        info: 'bg-indigo-600',
    };
    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };
    const labelSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };
    const stripedClass = striped
        ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:30px_30px]'
        : '';
    const animatedClass = animated
        ? 'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:animate-progress-shine'
        : '';
    return (_jsxs("div", { className: `w-full ${className}`, ref: ref, "data-testid": dataTestId, ...props, children: [(label || (showValue && valuePosition === 'outside')) && (_jsxs("div", { className: "flex justify-between mb-1", "data-testid": dataTestId ? `${dataTestId}-header` : undefined, children: [label && (_jsx("span", { className: `font-medium ${labelSizes[size]}`, "data-testid": dataTestId ? `${dataTestId}-label` : undefined, children: label })), showValue && valuePosition === 'outside' && (_jsxs("span", { className: `${labelSizes[size]}`, "data-testid": dataTestId ? `${dataTestId}-value-outside` : undefined, children: [Math.round(percentage), "%"] }))] })), _jsx("div", { className: `w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`, "data-testid": dataTestId ? `${dataTestId}-track` : undefined, children: _jsx("div", { className: `
              relative
              ${variants[variant]}
              ${sizes[size]}
              ${stripedClass}
              ${animatedClass}
              transition-all
              duration-300
              ease-in-out
            `, style: { width: `${percentage}%` }, "data-testid": dataTestId ? `${dataTestId}-bar` : undefined, children: showValue && valuePosition === 'inside' && size !== 'sm' && (_jsxs("span", { className: "absolute inset-0 flex items-center justify-center text-white text-xs font-semibold", "data-testid": dataTestId ? `${dataTestId}-value-inside` : undefined, children: [Math.round(percentage), "%"] })) }) })] }));
});
Progress.displayName = 'Progress';
//# sourceMappingURL=Progress.js.map