import { jsx as _jsx } from "react/jsx-runtime";
export const Form = ({ children, className = '', onSubmit, method = 'post', action, autoComplete = 'off', noValidate = false, ...props }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        if (onSubmit) {
            onSubmit(event);
        }
    };
    return (_jsx("form", { className: `space-y-4 ${className}`, onSubmit: handleSubmit, method: method, action: action, autoComplete: autoComplete, noValidate: noValidate, ...props, children: children }));
};
//# sourceMappingURL=Form.js.map