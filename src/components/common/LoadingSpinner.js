import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const LoadingSpinner = ({ size = 'medium', className = '', label = 'Loading' }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };
    return (_jsx("div", { className: `inline-block animate-spin ${sizeClasses[size]} ${className}`, role: "status", "aria-label": label, "aria-busy": "true", children: _jsxs("svg", { className: "text-current", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }) }));
};
//# sourceMappingURL=LoadingSpinner.js.map