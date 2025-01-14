import { jsx as _jsx } from "react/jsx-runtime";
import { LoadingSpinner } from './LoadingSpinner';
export const PageLoader = ({ className = '' }) => {
    return (_jsx("div", { className: `flex justify-center items-center min-h-screen ${className}`, children: _jsx(LoadingSpinner, { size: "large" }) }));
};
//# sourceMappingURL=PageLoader.js.map