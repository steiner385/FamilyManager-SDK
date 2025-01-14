import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const FormField = ({ children, className = '', label, error, required }) => {
    const id = label?.toLowerCase().replace(/\s+/g, '-');
    return (_jsxs("div", { className: `space-y-1 ${className}`, children: [label && (_jsxs("label", { htmlFor: id, className: "block text-sm font-medium text-gray-700", children: [label, required && _jsx("span", { className: "text-error-500 ml-1", children: "*" })] })), children, error && (_jsx("p", { className: "text-error-500 text-sm mt-1", role: "alert", children: error }))] }));
};
//# sourceMappingURL=FormField.js.map