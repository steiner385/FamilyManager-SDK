import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
export const LoadingSkeleton = ({ className = '', width = 'w-full', height = 'h-4', variant = 'rectangle', count = 1, }) => {
    const baseClasses = 'animate-pulse bg-gray-200 rounded';
    const variantClasses = {
        text: '',
        circle: 'rounded-full',
        rectangle: 'rounded',
    };
    const skeletons = Array.from({ length: count }, (_, index) => (_jsx("div", { className: `${baseClasses} ${variantClasses[variant]} ${width} ${height} ${className} ${index < count - 1 ? 'mb-4' : ''}`, role: "status", "aria-label": "Loading...", children: _jsx("span", { className: "sr-only", children: "Loading..." }) }, index)));
    return _jsx(_Fragment, { children: skeletons });
};
//# sourceMappingURL=LoadingSkeleton.js.map