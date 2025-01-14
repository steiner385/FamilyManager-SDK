import { jsx as _jsx } from "react/jsx-runtime";
import { LoadingSpinner } from './LoadingSpinner';
export const LoadingContainer = ({ children, isLoading, className = '' }) => {
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center p-4", children: _jsx(LoadingSpinner, { size: "large" }) }));
    }
    return (_jsx("div", { className: className, children: children }));
};
//# sourceMappingURL=LoadingContainer.js.map