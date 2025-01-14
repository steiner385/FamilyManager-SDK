import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Card = React.forwardRef(({ children, variant = 'default', padding = 'md', header, footer, hoverable = false, className = '', 'data-testid': dataTestId, ...props }, ref) => {
    const baseStyles = 'rounded-lg overflow-hidden';
    const variants = {
        default: 'bg-white',
        outlined: 'bg-white border border-gray-200',
        elevated: 'bg-white shadow-md',
    };
    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };
    const hoverStyles = hoverable
        ? 'transition-shadow duration-200 hover:shadow-lg'
        : '';
    const combinedClassName = `
      ${baseStyles}
      ${variants[variant]}
      ${hoverStyles}
      ${className}
    `.trim();
    return (_jsxs("div", { ref: ref, className: combinedClassName, "data-testid": dataTestId, ...props, children: [header && (_jsx("div", { className: `border-b border-gray-200 ${paddings[padding]}`, "data-testid": dataTestId ? `${dataTestId}-header` : undefined, children: header })), _jsx("div", { className: paddings[padding], "data-testid": dataTestId ? `${dataTestId}-content` : undefined, children: children }), footer && (_jsx("div", { className: `border-t border-gray-200 bg-gray-50 ${paddings[padding]}`, "data-testid": dataTestId ? `${dataTestId}-footer` : undefined, children: footer }))] }));
});
Card.displayName = 'Card';
//# sourceMappingURL=Card.js.map