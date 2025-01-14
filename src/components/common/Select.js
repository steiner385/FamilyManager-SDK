import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Select = ({ options, value, onChange, disabled = false, placeholder, error, label, required = false, className = '', name, ...props }) => {
    const selectClasses = [
        'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
        disabled ? 'bg-gray-100 cursor-not-allowed' : '',
        error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '',
        className
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { children: [label && (_jsxs("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsx("div", { className: "mt-1", children: _jsxs("select", { id: name, name: name, className: selectClasses, value: value, onChange: onChange, disabled: disabled, required: required, ...props, children: [placeholder && (_jsx("option", { value: "", disabled: true, children: placeholder })), options.map((option) => (_jsx("option", { value: option.value, disabled: option.disabled, children: option.label }, option.value)))] }) }), error && (_jsx("p", { className: "mt-2 text-sm text-red-600", children: error }))] }));
};
//# sourceMappingURL=Select.js.map