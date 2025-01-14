import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
import Toast from '../components/common/Toast';
const ToastContext = createContext(undefined);
export function ToastProvider({ children }) {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const showToast = (newMessage, newType = 'info') => {
        setMessage(newMessage);
        setType(newType);
        setShow(true);
    };
    return (_jsxs(ToastContext.Provider, { value: { showToast }, children: [children, show && (_jsx(Toast, { message: message, type: type, onClose: () => setShow(false) }))] }));
}
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
//# sourceMappingURL=ToastContext.js.map